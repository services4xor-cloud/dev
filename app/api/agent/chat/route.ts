import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  buildPersonaPrompt,
  chatWithAgent,
  type CatalogItem,
  type SelectedOpportunity,
} from '@/lib/ai'
import { getCountryInsights } from '@/lib/country-insights'
import { db } from '@/lib/db'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { formatPrice, KIND_LABELS, readProps } from '@/lib/opportunities'
import { rateLimit } from '@/lib/rate-limit'
import type { Prisma } from '@prisma/client'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = (session.user as { id?: string }).id
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: {
    countries?: unknown
    message?: string
    conversationId?: string
    opportunityIds?: unknown
  }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { message, conversationId, opportunityIds } = body
  if (!message || typeof message !== 'string' || !message.trim()) {
    return new Response('Missing message', { status: 400 })
  }

  if (message.length > 4000) {
    return new Response('Message must be 4000 characters or fewer', { status: 400 })
  }

  // Countries the Explorer is looking at: known ISO codes only, max 3
  const countryCodes = Array.isArray(body.countries)
    ? Array.from(
        new Set(
          body.countries
            .filter((x): x is string => typeof x === 'string')
            .map((x) => x.toUpperCase())
            .filter((x) => COUNTRY_OPTIONS.some((c) => c.code === x))
        )
      ).slice(0, 3)
    : []

  // Cost guard: cap agent messages per Explorer per day
  if (!(await rateLimit('agent', userId, 100, 24 * 60 * 60))) {
    return new Response('Daily agent limit reached. Try again tomorrow.', { status: 429 })
  }

  // Selected Opportunities are re-loaded from the DB; only published ones count
  const ids = Array.isArray(opportunityIds)
    ? opportunityIds.filter((x): x is string => typeof x === 'string').slice(0, 10)
    : []
  const selected: SelectedOpportunity[] = []
  const catalog: CatalogItem[] = []
  const nodes = await db.node.findMany({
    where: { type: 'EXPERIENCE', active: true },
    include: {
      inEdges: { where: { relation: 'OFFERS' }, include: { from: true }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  const appUrl = process.env.NEXTAUTH_URL ?? ''
  for (const n of nodes) {
    const p = readProps(n)
    if (p.status !== 'PUBLISHED') continue
    const country = COUNTRY_OPTIONS.find((c) => c.code === p.countryCode)?.name
    const host = n.inEdges[0]?.from.label ?? null
    if (catalog.length < 40)
      catalog.push({
        label: n.label,
        kind: KIND_LABELS[p.kind],
        country,
        host,
        price: formatPrice(p),
        link: `${appUrl}/exchange/${n.id}`,
      })
    if (!ids.includes(n.id)) continue
    selected.push({
      id: n.id,
      label: n.label,
      kind: KIND_LABELS[p.kind],
      host,
      description: p.description,
      location: p.location,
      country,
      price: formatPrice(p),
      dates: p.startsOn || p.endsOn ? `${p.startsOn ?? '?'} to ${p.endsOn ?? '?'}` : undefined,
      capacity: p.capacity,
    })
  }

  // Load or create conversation — verify ownership
  let history: { role: 'user' | 'assistant'; content: string }[] = []
  let chatId = conversationId

  if (chatId) {
    const chat = await db.agentChat.findUnique({ where: { id: chatId } })
    if (chat) {
      if (chat.userId !== userId) {
        return new Response('Forbidden', { status: 403 })
      }
      history = (chat.messages as { role: 'user' | 'assistant'; content: string }[]) ?? []
    }
  }

  const countries = (await Promise.all(countryCodes.map((c) => getCountryInsights(c)))).filter(
    (c): c is NonNullable<typeof c> => !!c
  )
  const systemPrompt = buildPersonaPrompt({ countries, selected, catalog })

  // Add new user message, cap history to last 50 turns to limit AI cost
  history.push({ role: 'user', content: message })
  if (history.length > 50) {
    history = history.slice(-50)
  }

  try {
    // Get full response (no fake streaming)
    const fullResponse = await chatWithAgent(systemPrompt, history)

    // Save conversation
    history.push({ role: 'assistant', content: fullResponse })

    if (chatId) {
      await db.agentChat.update({
        where: { id: chatId },
        data: {
          messages: history as Prisma.InputJsonValue,
          dimensions: { countries: countryCodes } as Prisma.InputJsonValue,
        },
      })
    } else {
      const chat = await db.agentChat.create({
        data: {
          userId,
          dimensions: { countries: countryCodes } as Prisma.InputJsonValue,
          messages: history as Prisma.InputJsonValue,
        },
      })
      chatId = chat.id
    }

    return new Response(fullResponse, {
      headers: {
        'Content-Type': 'text/plain',
        'X-Conversation-Id': chatId ?? '',
      },
    })
  } catch (err) {
    console.error('[agent/chat] Error:', err)
    if (err instanceof Error && /credit balance/i.test(err.message)) {
      return new Response('The agent is paused right now. Please try again later.', { status: 503 })
    }
    return new Response('Something went wrong — please try again.', { status: 500 })
  }
}

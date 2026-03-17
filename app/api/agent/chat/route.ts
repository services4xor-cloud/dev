import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildPersonaPrompt, chatWithAgent } from '@/lib/ai'
import { db } from '@/lib/db'
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
    dimensions?: Record<string, string>
    enrichedContext?: {
      countries?: string[]
      allValues?: Record<string, string[]>
      customChips?: { dimension: string; label: string }[]
    }
    message?: string
    conversationId?: string
  }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { dimensions, enrichedContext, message, conversationId } = body
  if (!message || typeof message !== 'string' || !dimensions) {
    return new Response('Missing message or dimensions', { status: 400 })
  }

  if (message.length > 4000) {
    return new Response('Message must be 4000 characters or fewer', { status: 400 })
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

  // Build persona from graph + enriched context
  const systemPrompt = await buildPersonaPrompt(dimensions, enrichedContext)

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
          dimensions: dimensions as Prisma.InputJsonValue,
        },
      })
    } else {
      const chat = await db.agentChat.create({
        data: {
          userId,
          dimensions: dimensions as Prisma.InputJsonValue,
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
  } catch {
    return new Response('Agent error', { status: 500 })
  }
}

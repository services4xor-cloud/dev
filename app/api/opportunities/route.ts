import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import type { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notify } from '@/lib/notifications'
import { parseOpportunityInput, readProps, toDTO, KIND_ICONS } from '@/lib/opportunities'
import { clientIp, rateLimit } from '@/lib/rate-limit'

const HOST_INCLUDE = {
  inEdges: {
    where: { relation: 'OFFERS' as const },
    include: { from: { select: { label: true, icon: true, userId: true } } },
    take: 1,
  },
}

// ─── GET /api/opportunities ───────────────────────────────────
// Published opportunities for the map and feed.
// ?mine=1   → the signed-in Host's own opportunities (any status, with access links)
// ?review=1 → Admin only: opportunities waiting for review
export async function GET(req: NextRequest) {
  const mine = req.nextUrl.searchParams.get('mine') === '1'
  const review = req.nextUrl.searchParams.get('review') === '1'

  try {
    let userId: string | undefined
    let role: string | undefined
    if (mine || review) {
      const session = await getServerSession(authOptions)
      userId = (session?.user as { id?: string } | undefined)?.id
      role = (session?.user as { role?: string } | undefined)?.role
      if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      if (review && role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const nodes = await db.node.findMany({
      where: {
        type: 'EXPERIENCE',
        ...(mine ? { inEdges: { some: { relation: 'OFFERS', from: { userId } } } } : {}),
        ...(mine || review ? {} : { active: true }),
      },
      include: HOST_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    const result = nodes
      .filter((n) => {
        const { status } = readProps(n)
        if (mine) return true
        if (review) return status === 'IN_REVIEW'
        return status === 'PUBLISHED'
      })
      .map((n) => toDTO(n, n.inEdges[0]?.from ?? null, { includeAccess: mine || review }))

    return NextResponse.json(result)
  } catch {
    // Table may not exist yet — return empty list gracefully
    return NextResponse.json([])
  }
}

// ─── POST /api/opportunities ──────────────────────────────────
// Any signed-in Explorer can list an Opportunity; doing so makes them a Host.
// Admin listings go live at once, everyone else's wait for review.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await rateLimit('opportunity-create', userId || clientIp(req.headers), 20, 24 * 60 * 60))) {
    return NextResponse.json({ error: 'Too many new listings today' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseOpportunityInput(body)
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { label, icon, lat, lng, props } = parsed.data!

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true, node: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

  const hostNode =
    user.node ??
    (await db.node.create({
      data: {
        type: 'USER',
        code: user.email,
        label: user.name ?? 'Host',
        icon: '👤',
        userId,
      },
    }))

  if (user.role === 'EXPLORER') {
    await db.user.update({ where: { id: userId }, data: { role: 'HOST' } })
  }

  const isAdmin = role === 'ADMIN' || user.role === 'ADMIN'
  const status = isAdmin ? 'PUBLISHED' : 'IN_REVIEW'
  const code = `${(label ?? 'experience')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)}-${Date.now().toString(36)}`

  const node = await db.node.create({
    data: {
      type: 'EXPERIENCE',
      code,
      label: label!,
      icon: icon ?? KIND_ICONS[props.kind!],
      lat: lat ?? null,
      lng: lng ?? null,
      properties: { ...props, status } as Prisma.InputJsonValue,
    },
  })

  await db.edge.create({ data: { fromId: hostNode.id, toId: node.id, relation: 'OFFERS' } })

  if (!isAdmin) {
    const admins = await db.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } })
    for (const admin of admins) {
      notify({
        userId: admin.id,
        type: 'SYSTEM',
        title: `New listing to review: ${node.label}`,
        link: '/admin',
      }).catch(() => {})
    }
  }

  return NextResponse.json(toDTO(node, hostNode, { includeAccess: true }), { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserNode } from '@/lib/graph'
import { notify } from '@/lib/notifications'

// GET /api/exchanges — list exchanges for the current user
// ?role=explorer → shows user's exchanges (SEEKS edges)
// ?role=host → shows exchanges to user's opportunities (SEEKS edges targeting user's EXPERIENCE nodes)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const role = searchParams.get('role') ?? 'explorer'

  const userNode = await getUserNode(userId)
  if (!userNode) {
    return NextResponse.json([])
  }

  if (role === 'host') {
    // Find all EXPERIENCE nodes this user OFFERS, then find SEEKS edges to those
    const offeredExperiences = await db.edge.findMany({
      where: { fromId: userNode.id, relation: 'OFFERS' },
      select: { toId: true },
    })
    const experienceIds = offeredExperiences.map((e) => e.toId)

    if (experienceIds.length === 0) return NextResponse.json([])

    const exchanges = await db.edge.findMany({
      where: { toId: { in: experienceIds }, relation: 'SEEKS' },
      include: {
        from: { include: { user: { select: { id: true, name: true, image: true } } } },
        to: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const result = exchanges.map((e) => ({
      id: e.id,
      status: (e.properties as { status?: string } | null)?.status ?? 'PENDING',
      message: (e.properties as { message?: string } | null)?.message ?? null,
      createdAt: e.createdAt,
      explorer: {
        nodeId: e.from.id,
        userId: e.from.user?.id,
        name: e.from.user?.name ?? e.from.label,
        image: e.from.user?.image,
      },
      opportunity: {
        id: e.to.id,
        label: e.to.label,
        icon: e.to.icon,
      },
    }))

    return NextResponse.json(result)
  }

  // Explorer view — show user's SEEKS edges
  const exchanges = await db.edge.findMany({
    where: { fromId: userNode.id, relation: 'SEEKS' },
    include: {
      to: {
        include: {
          inEdges: {
            where: { relation: 'OFFERS' },
            take: 1,
            include: { from: { include: { user: { select: { name: true } } } } },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = exchanges.map((e) => ({
    id: e.id,
    status: (e.properties as { status?: string } | null)?.status ?? 'PENDING',
    createdAt: e.createdAt,
    opportunity: {
      id: e.to.id,
      label: e.to.label,
      icon: e.to.icon,
    },
    host: e.to.inEdges[0]?.from.user?.name ?? e.to.inEdges[0]?.from.label ?? null,
  }))

  return NextResponse.json(result)
}

// POST /api/exchanges — Explorer engages with an opportunity
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { opportunityId?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { opportunityId, message } = body
  if (!opportunityId || typeof opportunityId !== 'string') {
    return NextResponse.json({ error: 'opportunityId is required' }, { status: 400 })
  }

  // Verify the opportunity exists and is an EXPERIENCE node
  const opportunity = await db.node.findUnique({
    where: { id: opportunityId },
    include: {
      inEdges: {
        where: { relation: 'OFFERS' },
        include: { from: { select: { userId: true } } },
      },
    },
  })
  if (!opportunity || opportunity.type !== 'EXPERIENCE') {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  }

  const userNode = await getUserNode(userId)
  if (!userNode) {
    return NextResponse.json({ error: 'Complete your profile first' }, { status: 400 })
  }

  // Atomically check + create to prevent race conditions
  const existing = await db.edge.findFirst({
    where: { fromId: userNode.id, toId: opportunityId, relation: 'SEEKS' },
  })
  if (existing) {
    return NextResponse.json(
      { error: 'You have already engaged with this opportunity' },
      { status: 409 }
    )
  }

  let edge
  try {
    edge = await db.edge.create({
      data: {
        fromId: userNode.id,
        toId: opportunityId,
        relation: 'SEEKS',
        properties: {
          status: 'PENDING',
          ...(message ? { message: String(message).trim().slice(0, 500) } : {}),
        },
      },
    })
  } catch (e) {
    // Handle race condition: another request created the edge between our check and create
    if (e instanceof Error && e.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'You have already engaged with this opportunity' },
        { status: 409 }
      )
    }
    throw e
  }

  // Notify the host
  const hostUserId = opportunity.inEdges[0]?.from.userId
  if (hostUserId) {
    const applicant = await db.user.findUnique({ where: { id: userId }, select: { name: true } })
    notify({
      userId: hostUserId,
      type: 'MATCH',
      title: `${applicant?.name ?? 'Someone'} engaged with ${opportunity.label}`,
      body: message ? String(message).trim().slice(0, 100) : undefined,
      link: '/host',
    }).catch(() => {})
  }

  return NextResponse.json({ id: edge.id, status: 'PENDING' }, { status: 201 })
}

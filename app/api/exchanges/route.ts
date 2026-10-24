import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { ensureUserNode } from '@/lib/graph'
import { notify } from '@/lib/notifications'
import { readProps } from '@/lib/opportunities'
import { actionEmail, sendEmail } from '@/lib/email'

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

  const userNode = await ensureUserNode(userId)
  if (!userNode) {
    return NextResponse.json([])
  }

  if (role === 'host') {
    // Find all EXPERIENCE nodes this user OFFERS, then find SEEKS edges to those
    // Admins also handle listings of providers without a login (e.g. BeKenya, 4XOR)
    const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'
    const offeredExperiences = await db.edge.findMany({
      where: {
        relation: 'OFFERS',
        OR: [{ fromId: userNode.id }, ...(isAdmin ? [{ from: { userId: null } }] : [])],
      },
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
      take: 100,
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

  // Explorer view — show user's SEEKS edges.
  // inEdges is capped at take: 1 — we only need the host's name, and every
  // EXPERIENCE has exactly one OFFERS host edge.
  const exchanges = await db.edge.findMany({
    where: { fromId: userNode.id, relation: 'SEEKS' },
    include: {
      to: {
        include: {
          inEdges: {
            where: { relation: 'OFFERS' },
            include: { from: { include: { user: { select: { name: true } } } } },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const result = exchanges.map((e) => {
    const status = (e.properties as { status?: string } | null)?.status ?? 'PENDING'
    const { kind, accessUrl } = readProps(e.to)
    return {
      id: e.id,
      status,
      createdAt: e.createdAt,
      opportunity: {
        id: e.to.id,
        label: e.to.label,
        icon: e.to.icon,
        kind,
      },
      host: e.to.inEdges[0]?.from.user?.name ?? e.to.inEdges[0]?.from.label ?? null,
      // The private access link (e.g. 4xor Studio) is only revealed once the Host accepted
      ...(status === 'ACCEPTED' && accessUrl ? { accessUrl } : {}),
    }
  })

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
  if (
    !opportunity ||
    opportunity.type !== 'EXPERIENCE' ||
    !opportunity.active ||
    readProps(opportunity).status !== 'PUBLISHED'
  ) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  }
  if (opportunity.inEdges[0]?.from.userId === userId) {
    return NextResponse.json({ error: 'You cannot book your own opportunity' }, { status: 400 })
  }

  const userNode = await ensureUserNode(userId)
  if (!userNode) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check for existing Exchange (fast path). The edge.create below is
  // wrapped in try/catch to catch the race where a second request slips
  // in between this findFirst and the create call.
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

  // Notify the host — or the admins for providers without a login
  const hostUserId = opportunity.inEdges[0]?.from.userId
  const recipients = hostUserId
    ? [hostUserId]
    : (await db.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } })).map((a) => a.id)
  if (recipients.length) {
    const explorer = await db.user.findUnique({ where: { id: userId }, select: { name: true } })
    const hostEmails = await db.user.findMany({
      where: { id: { in: recipients } },
      select: { email: true },
    })
    const base = process.env.NEXTAUTH_URL ?? req.nextUrl.origin
    for (const { email } of hostEmails) {
      sendEmail({
        to: email,
        subject: `New booking request: ${opportunity.label}`,
        html: actionEmail(
          'New booking request',
          `${explorer?.name ?? 'An Explorer'} wants to book ${opportunity.label}. Confirm or decline it in your Host hub.`,
          'Open Host hub',
          `${base}/host`
        ),
      }).catch(() => {})
    }
    for (const recipient of recipients) {
      notify({
        userId: recipient,
        type: 'MATCH',
        title: `${explorer?.name ?? 'An Explorer'} booked ${opportunity.label}`,
        body: message ? String(message).trim().slice(0, 100) : undefined,
        link: '/host',
      }).catch(() => {})
    }
  }

  return NextResponse.json({ id: edge.id, status: 'PENDING' }, { status: 201 })
}

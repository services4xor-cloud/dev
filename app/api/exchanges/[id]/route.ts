import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserNode } from '@/lib/graph'
import { notify } from '@/lib/notifications'

// PATCH /api/exchanges/[id] — Host accepts or rejects an exchange
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  const role = (session?.user as { role?: string })?.role
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (role !== 'HOST' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { status?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const newStatus = body.status
  if (!newStatus || !['ACCEPTED', 'REJECTED'].includes(newStatus)) {
    return NextResponse.json({ error: 'status must be ACCEPTED or REJECTED' }, { status: 400 })
  }

  // Find the SEEKS edge
  const edge = await db.edge.findUnique({
    where: { id: params.id },
    include: {
      to: {
        include: {
          inEdges: {
            where: { relation: 'OFFERS' },
            include: { from: { select: { userId: true } } },
          },
        },
      },
      from: { select: { userId: true, label: true } },
    },
  })

  if (!edge || edge.relation !== 'SEEKS') {
    return NextResponse.json({ error: 'Exchange not found' }, { status: 404 })
  }

  // Verify the current user owns the opportunity (is the host)
  const userNode = await getUserNode(userId)
  const hostNodeId = edge.to.inEdges[0]?.from.userId
  if (hostNodeId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not your opportunity' }, { status: 403 })
  }

  // Update the edge properties
  const existingProps = (edge.properties as Record<string, unknown>) ?? {}
  await db.edge.update({
    where: { id: params.id },
    data: {
      properties: { ...existingProps, status: newStatus },
    },
  })

  // Notify the explorer
  if (edge.from.userId) {
    const hostName = await db.user.findUnique({ where: { id: userId }, select: { name: true } })
    notify({
      userId: edge.from.userId,
      type: 'MATCH',
      title: `Your application was ${newStatus.toLowerCase()}`,
      body: `${hostName?.name ?? 'A host'} ${newStatus === 'ACCEPTED' ? 'accepted' : 'declined'} your application for ${edge.to.label}`,
      link: '/me',
    })
  }

  return NextResponse.json({ id: edge.id, status: newStatus })
}

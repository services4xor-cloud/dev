import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function getSessionUser(
  session: Awaited<ReturnType<typeof getServerSession>>
): { id: string; role: string } | null {
  if (!session) return null
  const u = (session as { user?: { id?: string; role?: string } }).user
  if (!u?.id) return null
  return { id: u.id, role: u.role ?? 'EXPLORER' }
}

/**
 * GET /api/host/stats
 * Returns Hub stats for the authenticated Host.
 * Requires HOST or ADMIN role.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  const user = getSessionUser(session)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (user.role !== 'HOST' && user.role !== 'ADMIN') {
    return new Response('Forbidden: Host or Admin role required', { status: 403 })
  }

  // Find the user's graph Node
  const userNode = await db.node.findFirst({
    where: { type: 'USER', userId: user.id },
  })

  // Find all EXPERIENCE nodes connected via OFFERS edge from this user's node
  const offerEdges =
    userNode !== null
      ? await db.edge.findMany({
          where: {
            fromId: userNode.id,
            relation: 'OFFERS',
            to: { type: 'EXPERIENCE' },
          },
          include: { to: true },
          orderBy: { createdAt: 'desc' },
          take: 100,
        })
      : []

  // Aggregate revenue (SUCCESS only), total count, and recent payments in parallel.
  // Note: _count cannot share this aggregate because the SUCCESS-filter would
  // cause it to count only successful payments instead of all of them.
  const [revenueAgg, totalPayments, recentPayments] = await Promise.all([
    db.payment.aggregate({
      where: { userId: user.id, status: 'SUCCESS' },
      _sum: { amount: true },
    }),
    db.payment.count({ where: { userId: user.id } }),
    db.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const totalRevenue = revenueAgg._sum.amount ?? 0

  return NextResponse.json({
    opportunities: offerEdges.map((edge) => ({
      id: edge.to.id,
      label: edge.to.label,
      icon: edge.to.icon,
      properties: edge.to.properties,
      createdAt: edge.to.createdAt,
    })),
    totalOpportunities: offerEdges.length,
    totalPayments,
    totalRevenue,
    recentPayments: recentPayments.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt,
    })),
  })
}

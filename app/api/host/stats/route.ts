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

  try {
    // Find the user's graph Node
    const userNode = await db.node.findFirst({
      where: { type: 'USER', userId: user.id },
    })

    // Find EXPERIENCE nodes connected via OFFERS edge (capped at 200)
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
            take: 200,
          })
        : []

    // Recent payments for this user (capped at 100)
    const payments = await db.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    const totalRevenue = payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0)

    const recentPayments = payments.slice(0, 5)

    return NextResponse.json({
      opportunities: offerEdges.map((edge) => ({
        id: edge.to.id,
        label: edge.to.label,
        icon: edge.to.icon,
        properties: edge.to.properties,
        createdAt: edge.to.createdAt,
      })),
      totalOpportunities: offerEdges.length,
      totalPayments: payments.length,
      totalRevenue,
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load host stats' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user as { id?: string; role?: string }

  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const [
      explorers,
      hosts,
      totalNodes,
      nodesByType,
      totalEdges,
      totalPayments,
      paymentsByStatus,
      totalConversations,
      recentUsers,
    ] = await Promise.all([
      db.user.count({ where: { role: 'EXPLORER' } }),
      db.user.count({ where: { role: 'HOST' } }),
      db.node.count(),
      db.node.groupBy({ by: ['type'], _count: { _all: true } }),
      db.edge.count(),
      db.payment.count(),
      db.payment.groupBy({ by: ['status'], _count: { _all: true } }),
      db.conversation.count(),
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ])

    const byType = Object.fromEntries(nodesByType.map((n) => [n.type, n._count._all]))

    const byStatus = Object.fromEntries(paymentsByStatus.map((p) => [p.status, p._count._all]))

    return NextResponse.json({
      explorers,
      hosts,
      nodes: { total: totalNodes, byType },
      edges: totalEdges,
      payments: { total: totalPayments, byStatus },
      conversations: totalConversations,
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load admin stats' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [totalExplorers, totalCountries, totalConnections, totalExchanges, successPayments] =
    await Promise.all([
      db.node.count({ where: { type: 'USER', active: true } }),
      db.node.count({ where: { type: 'COUNTRY', active: true } }),
      db.edge.count({ where: { relation: 'CONNECTED_TO' } }),
      db.edge.count({ where: { relation: 'EXCHANGED_WITH' } }),
      db.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
    ])

  const totalAmount = successPayments._sum.amount ?? 0
  const utamaduniContribution = Math.round(totalAmount * 0.05)

  return NextResponse.json({
    totalExplorers,
    totalCountries,
    totalConnections,
    totalExchanges,
    utamaduniContribution,
  })
}

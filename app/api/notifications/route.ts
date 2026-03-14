import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const [unreadMessages, pendingPayments] = await Promise.all([
    db.message.count({
      where: {
        read: false,
        senderId: { not: userId },
        conversation: {
          participants: { some: { id: userId } },
        },
      },
    }),
    db.payment.count({
      where: {
        userId,
        status: 'PENDING',
      },
    }),
  ])

  return NextResponse.json({ unreadMessages, pendingPayments })
}

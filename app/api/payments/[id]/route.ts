import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function getSessionUser(
  session: Awaited<ReturnType<typeof getServerSession>>
): { id: string; role?: string } | null {
  if (!session) return null
  const u = (session as { user?: { id?: string; role?: string } }).user
  if (!u?.id) return null
  return { id: u.id, role: u.role }
}

/**
 * GET /api/payments/[id]
 * Return a single payment. Only the owner or an ADMIN may access it.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const currentUser = getSessionUser(session)
  if (!currentUser) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payment = await db.payment.findUnique({ where: { id: params.id } })

  if (!payment) {
    return new Response('Not Found', { status: 404 })
  }

  const isOwner = payment.userId === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    return new Response('Forbidden', { status: 403 })
  }

  return NextResponse.json(payment)
}

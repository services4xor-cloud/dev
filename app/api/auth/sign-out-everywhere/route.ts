import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// POST /api/auth/sign-out-everywhere — bumps tokenVersion so every existing
// session (all devices) is rejected at its next check, within ~5 minutes.
export async function POST() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } })
  return NextResponse.json({ ok: true })
}

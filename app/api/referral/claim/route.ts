import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// POST — claim a referral code after signup
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).code !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const code = ((body as Record<string, unknown>).code as string).trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const referral = await db.referral.findUnique({ where: { code } })
  if (!referral) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
  }

  if (referral.referrerId === session.user.id) {
    return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 })
  }

  // Check if this user already claimed a referral
  const alreadyClaimed = await db.referral.findFirst({
    where: { referredId: session.user.id },
  })
  if (alreadyClaimed) {
    return NextResponse.json({ error: 'Referral already claimed' }, { status: 400 })
  }

  // Create a new referral record linking referrer → this user
  await db.referral.create({
    data: {
      referrerId: referral.referrerId,
      referredId: session.user.id,
      code: `${code}-${session.user.id.slice(0, 6)}`,
      status: 'JOINED',
    },
  })

  return NextResponse.json({ claimed: true })
}

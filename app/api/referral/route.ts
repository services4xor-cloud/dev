import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

function generateCode(): string {
  return randomBytes(4).toString('hex').toUpperCase()
}

// GET — return the current user's referral code + stats
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Find or create the user's own referral code record (referredId = null = this is their code).
  // Wrapped in a transaction to prevent concurrent GET requests from creating
  // duplicate referral codes for the same user.
  const referral = await db.$transaction(async (tx) => {
    const existing = await tx.referral.findFirst({
      where: { referrerId: userId, referredId: null },
    })
    if (existing) return existing
    return tx.referral.create({
      data: { referrerId: userId, code: generateCode(), status: 'ACTIVE' },
    })
  })

  const [totalReferred, totalJoined] = await Promise.all([
    db.referral.count({
      where: { referrerId: userId, referredId: { not: null } },
    }),
    db.referral.count({
      where: { referrerId: userId, status: 'JOINED', referredId: { not: null } },
    }),
  ])

  const base = process.env.NEXTAUTH_URL ?? 'https://becountry.com'
  const link = `${base}/signup?ref=${referral.code}`

  return NextResponse.json({ code: referral.code, link, totalReferred, totalJoined })
}

// POST — validate a referral code (called during signup, no auth required)
export async function POST(req: NextRequest) {
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

  const referral = await db.referral.findUnique({
    where: { code },
    include: { referrer: { select: { name: true } } },
  })

  if (!referral) {
    return NextResponse.json({ valid: false })
  }

  return NextResponse.json({ valid: true, referrerName: referral.referrer.name ?? 'An Explorer' })
}

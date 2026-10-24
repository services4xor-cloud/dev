import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { actionEmail, sendEmail } from '@/lib/email'
import {
  hashPassword,
  newVerificationToken,
  normalizeEmail,
  validatePassword,
  VERIFY_PREFIX,
} from '@/lib/password'
import { clientIp, rateLimit } from '@/lib/rate-limit'

// POST /api/auth/register — create an email + password account and send a
// verification link. Always answers the same way for known emails so the
// endpoint can't be used to find out who has an account.
export async function POST(req: NextRequest) {
  if (!(await rateLimit('register', clientIp(req.headers), 5, 60 * 60))) {
    return NextResponse.json({ error: 'Too many sign-ups. Try again later.' }, { status: 429 })
  }

  let body: { email?: unknown; password?: unknown; name?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = normalizeEmail(body.email)
  if (!email) return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 })
  const pwError = validatePassword(body.password)
  if (pwError) return NextResponse.json({ error: pwError }, { status: 400 })
  const name =
    typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 80) : null

  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true },
  })
  const ok = NextResponse.json({ ok: true }, { status: 201 })
  // Verified accounts are never touched here; the owner can sign in or reset.
  if (existing?.emailVerified) return ok

  const passwordHash = await hashPassword(body.password as string)
  if (existing) {
    await db.user.update({ where: { id: existing.id }, data: { passwordHash, name } })
  } else {
    const user = await db.user.create({ data: { email, name, passwordHash } })
    await db.node.create({
      data: { type: 'USER', code: email, label: name ?? 'Explorer', icon: '👤', userId: user.id },
    })
  }

  await db.verificationToken.deleteMany({ where: { identifier: `${VERIFY_PREFIX}${email}` } })
  const { raw, record } = newVerificationToken(email)
  await db.verificationToken.create({ data: record })

  const base = process.env.NEXTAUTH_URL ?? req.nextUrl.origin
  const url = `${base}/api/auth/verify-email?token=${raw}&email=${encodeURIComponent(email)}`
  await sendEmail({
    to: email,
    subject: 'Confirm your email for Be[X]',
    html: actionEmail(
      'Confirm your email',
      'Click below to confirm your email address. Then you can sign in with your password. The link is valid for 24 hours.',
      'Confirm email',
      url
    ),
  })

  return ok
}

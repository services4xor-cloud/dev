import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashToken, normalizeEmail, VERIFY_PREFIX } from '@/lib/password'

// GET /api/auth/verify-email?token=…&email=… — confirms an email/password
// account. Tokens are single use and stored hashed.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const email = normalizeEmail(req.nextUrl.searchParams.get('email'))
  const login = new URL('/login', req.nextUrl.origin)

  if (!token || !email) {
    login.searchParams.set('error', 'InvalidLink')
    return NextResponse.redirect(login)
  }

  const record = await db.verificationToken.findUnique({ where: { token: hashToken(token) } })
  if (!record || record.identifier !== `${VERIFY_PREFIX}${email}` || record.expires < new Date()) {
    login.searchParams.set('error', 'InvalidLink')
    return NextResponse.redirect(login)
  }

  await db.verificationToken.delete({ where: { token: record.token } })
  await db.user.update({ where: { email }, data: { emailVerified: new Date() } })

  login.searchParams.set('verified', '1')
  login.searchParams.set('email', email)
  return NextResponse.redirect(login)
}

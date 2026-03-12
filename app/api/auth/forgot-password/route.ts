import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordReset } from '@/lib/email'
import { logger } from '@/lib/logger'

const schema = z.object({
  email: z.string().email('Invalid email'),
})

/**
 * POST /api/auth/forgot-password
 *
 * Generates a password reset token, stores a hash in the DB,
 * and sends the reset link via Resend.
 *
 * Always returns 200 to prevent email enumeration.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { email } = parsed.data

  try {
    const user = await db.user.findUnique({ where: { email } })

    if (user) {
      // Generate a secure token
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Store hashed token — we store in user record via a simple approach:
      // Use passwordHash field prefix convention or a separate mechanism.
      // For now, store in a lightweight way using Prisma's JSON or a convention.
      // We'll use the Account model with provider="password_reset"
      await db.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: 'password_reset',
            providerAccountId: email,
          },
        },
        update: {
          access_token: tokenHash,
          expires_at: Math.floor(expiresAt.getTime() / 1000),
        },
        create: {
          userId: user.id,
          type: 'credentials',
          provider: 'password_reset',
          providerAccountId: email,
          access_token: tokenHash,
          expires_at: Math.floor(expiresAt.getTime() / 1000),
        },
      })

      // Send the email (fire-and-forget for speed, but log errors)
      void sendPasswordReset(email, token).catch((err) =>
        logger.error('Password reset email failed', { error: String(err) })
      )
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/auth/forgot-password failed', { error: String(err) })
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

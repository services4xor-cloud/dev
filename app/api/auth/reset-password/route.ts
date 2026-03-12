import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

const schema = z.object({
  token: z.string().min(1, 'Token required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
})

/**
 * POST /api/auth/reset-password
 *
 * Verifies the reset token and updates the user's password.
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
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 }
    )
  }

  const { token, password } = parsed.data
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  try {
    // Find the reset record by hashed token
    const resetRecord = await db.account.findFirst({
      where: {
        provider: 'password_reset',
        access_token: tokenHash,
      },
      include: { user: true },
    })

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    // Check expiry
    const expiresAt = resetRecord.expires_at ? resetRecord.expires_at * 1000 : 0
    if (Date.now() > expiresAt) {
      // Clean up expired token
      await db.account.delete({ where: { id: resetRecord.id } })
      return NextResponse.json({ error: 'Reset link has expired' }, { status: 400 })
    }

    // Hash the new password
    const passwordHash = await hash(password, 10)

    // Update user password and delete the reset token
    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      db.account.delete({ where: { id: resetRecord.id } }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('POST /api/auth/reset-password failed', { error: String(err) })
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

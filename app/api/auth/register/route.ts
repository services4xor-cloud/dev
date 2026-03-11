import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address').max(320),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  country: z.string().max(10).optional(),
  role: z.enum(['PIONEER', 'ANCHOR']).optional(),
  phone: z.string().max(20).optional(),
})

/**
 * POST /api/auth/register — Create a new account
 *
 * Creates user with hashed password, then client signs in via NextAuth.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 }
    )
  }

  const { name, email, password, country, role, phone } = parsed.data

  try {
    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password (10 rounds)
    const passwordHash = await hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        country: country ?? (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE'),
        role: role === 'ANCHOR' ? 'ANCHOR' : 'PIONEER',
        phone: phone ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        country: true,
      },
    })

    // Send welcome email (fire-and-forget — don't block registration)
    void sendEmail(email, 'pioneer_welcome', {
      name: name || 'Pioneer',
      role: user.role,
      country: user.country,
    }).catch((err) => console.error('Welcome email error:', err))

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (err) {
    console.error('POST /api/auth/register error:', err)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'

/**
 * POST /api/auth/register — Create a new account
 *
 * Creates user with hashed password, then client signs in via NextAuth.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, country, role, phone } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

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

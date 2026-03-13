import { NextResponse } from 'next/server'

/**
 * POST /api/auth/forgot-password — DEPRECATED
 *
 * Password auth has been removed. Users authenticate via Magic Link or Google OAuth.
 * Magic link handles both login and password-free account recovery.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Password auth has been removed. Use magic link or Google to sign in.' },
    { status: 410 }
  )
}

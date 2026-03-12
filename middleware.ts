/**
 * Next.js Middleware — Route Protection
 *
 * Runs at the edge before page rendering. Protects authenticated-only
 * routes by checking the NextAuth JWT token.
 *
 * Protected routes:
 *   /pioneers/dashboard, /anchors/dashboard, /agents/dashboard,
 *   /admin, /profile, /anchors/post-path, /notifications
 *
 * Public routes (no auth required):
 *   /, /ventures, /compass, /about, /pricing, /login, /signup,
 *   /contact, /privacy, /be/*, /offerings, /threads, /charity,
 *   /experiences/*, /fashion/*, /media/*, /business, /referral,
 *   /onboarding (needs to be accessible for new users)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/** Routes that require authentication */
const PROTECTED_PATHS = [
  '/pioneers/dashboard',
  '/anchors/dashboard',
  '/agents/dashboard',
  '/admin',
  '/profile',
  '/anchors/post-path',
  '/notifications',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this path requires authentication
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for valid JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    // Redirect to login with callback URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin route requires ADMIN role
  if (pathname.startsWith('/admin')) {
    const role = (token.role as string) || 'PIONEER'
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Only run middleware on page routes, not on static assets or API routes
export const config = {
  matcher: [
    '/pioneers/dashboard/:path*',
    '/anchors/dashboard/:path*',
    '/anchors/post-path/:path*',
    '/agents/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/notifications/:path*',
  ],
}

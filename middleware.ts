import { NextResponse, type NextRequest } from 'next/server'

/**
 * Domain routing: one deployment serves several sites.
 * 4xor.com (and www.) shows the company page at "/"; every other path is the
 * shared app (map, agent, bookings), so links from the company page just work.
 */
const COMPANY_HOSTS = (process.env.COMPANY_HOSTS ?? '4xor.com,www.4xor.com')
  .split(',')
  .map((h) => h.trim().toLowerCase())

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0].toLowerCase()
  if (req.nextUrl.pathname === '/' && COMPANY_HOSTS.includes(host)) {
    return NextResponse.rewrite(new URL('/4xor', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/' }

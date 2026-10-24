/**
 * Fixed-window rate limiter backed by Postgres (RateLimit table).
 *
 * Works across serverless instances because the counter lives in the DB.
 * Usage: `if (!(await rateLimit('login', email, 10, 15 * 60))) return 429`
 */
import { db } from '@/lib/db'

export async function rateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const key = `${scope}:${identifier.toLowerCase()}`
  const now = new Date()
  const resetAt = new Date(now.getTime() + windowSeconds * 1000)

  const existing = await db.rateLimit.findUnique({ where: { key } })
  if (!existing || existing.resetAt <= now) {
    await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    })
    return true
  }
  if (existing.count >= limit) return false

  await db.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } })
  return true
}

/** Best-effort client IP from proxy headers (CloudFront / Amplify / Vercel set x-forwarded-for). */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

/**
 * Tests for lib/rate-limit.ts
 */
jest.mock('@/lib/db', () => ({
  db: { rateLimit: { findUnique: jest.fn(), upsert: jest.fn(), update: jest.fn() } },
}))

import { db } from '@/lib/db'
import { clientIp, rateLimit } from '@/lib/rate-limit'

const rl = db.rateLimit as unknown as Record<'findUnique' | 'upsert' | 'update', jest.Mock>

describe('rateLimit', () => {
  beforeEach(() => jest.clearAllMocks())

  it('starts a new window when none exists or it expired', async () => {
    rl.findUnique.mockResolvedValue(null)
    expect(await rateLimit('login', 'A@x.com', 3, 60)).toBe(true)
    expect(rl.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { key: 'login:a@x.com' } })
    )

    rl.findUnique.mockResolvedValue({ count: 99, resetAt: new Date(Date.now() - 1000) })
    expect(await rateLimit('login', 'a@x.com', 3, 60)).toBe(true)
  })

  it('counts within the window and blocks at the limit', async () => {
    rl.findUnique.mockResolvedValue({ count: 2, resetAt: new Date(Date.now() + 60_000) })
    expect(await rateLimit('login', 'a@x.com', 3, 60)).toBe(true)
    expect(rl.update).toHaveBeenCalled()

    rl.findUnique.mockResolvedValue({ count: 3, resetAt: new Date(Date.now() + 60_000) })
    expect(await rateLimit('login', 'a@x.com', 3, 60)).toBe(false)
  })

  it('reads the first forwarded IP', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' }))).toBe('1.2.3.4')
    expect(clientIp(new Headers())).toBe('unknown')
  })
})

/**
 * Tests for app/api/auth/register/route.ts
 */
import { NextRequest } from 'next/server'

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
  actionEmail: jest.fn().mockReturnValue('<p/>'),
}))
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue(true),
  clientIp: jest.fn().mockReturnValue('ip'),
}))
jest.mock('@/lib/db', () => ({
  db: {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    node: { create: jest.fn() },
    verificationToken: { deleteMany: jest.fn(), create: jest.fn() },
  },
}))

import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { POST } from '@/app/api/auth/register/route'

const user = db.user as unknown as Record<string, jest.Mock>
const post = (body: unknown) =>
  POST(
    new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  )

beforeEach(() => {
  jest.clearAllMocks()
  user.create.mockResolvedValue({ id: 'u1' })
})

describe('POST /api/auth/register', () => {
  it('rejects a bad email or short password', async () => {
    expect((await post({ email: 'nope', password: 'longenough1' })).status).toBe(400)
    expect((await post({ email: 'a@x.com', password: 'short' })).status).toBe(400)
  })

  it('creates the account, stores only a hashed token and sends the link', async () => {
    user.findUnique.mockResolvedValue(null)
    const res = await post({ email: 'A@X.com', password: 'longenough1', name: 'Tobias' })
    expect(res.status).toBe(201)
    const created = user.create.mock.calls[0][0].data
    expect(created.email).toBe('a@x.com')
    expect(created.passwordHash).not.toBe('longenough1')
    const token = (db.verificationToken.create as jest.Mock).mock.calls[0][0].data.token
    const html = (sendEmail as jest.Mock).mock.calls[0][0]
    expect(html.to).toBe('a@x.com')
    expect(token).toMatch(/^[a-f0-9]{64}$/)
  })

  it('answers the same for a verified email without touching it', async () => {
    user.findUnique.mockResolvedValue({ id: 'u1', emailVerified: new Date() })
    const res = await post({ email: 'a@x.com', password: 'longenough1' })
    expect(res.status).toBe(201)
    expect(user.update).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('returns 429 when rate limited', async () => {
    ;(rateLimit as jest.Mock).mockResolvedValueOnce(false)
    expect((await post({ email: 'a@x.com', password: 'longenough1' })).status).toBe(429)
  })
})

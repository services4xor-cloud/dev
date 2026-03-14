/**
 * Tests for notifications API route:
 *   app/api/notifications/route.ts (GET)
 */

// ---- Mocks (must come before route imports) ----

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/db', () => ({
  db: {
    message: { count: jest.fn() },
    payment: { count: jest.fn() },
  },
}))

// ---- Imports ----

import { GET as getNotifications } from '@/app/api/notifications/route'
import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'user-1', name: 'Alice Explorer', ...overrides },
    expires: '2099-01-01',
  }
}

// ---- GET /api/notifications ----

describe('GET /api/notifications', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await getNotifications()
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 401 when session has no user id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'No ID' },
      expires: '2099-01-01',
    } as unknown as Awaited<ReturnType<typeof getServerSession>>)
    const res = await getNotifications()
    expect(res.status).toBe(401)
  })

  test('returns unreadMessages and pendingPayments counts', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().message.count.mockResolvedValue(5)
    getDb().payment.count.mockResolvedValue(2)

    const res = await getNotifications()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.unreadMessages).toBe(5)
    expect(data.pendingPayments).toBe(2)
  })

  test('returns 0 counts when no unread messages or pending payments', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().message.count.mockResolvedValue(0)
    getDb().payment.count.mockResolvedValue(0)

    const res = await getNotifications()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.unreadMessages).toBe(0)
    expect(data.pendingPayments).toBe(0)
  })

  test('queries messages scoped to current user as recipient (not sender)', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-42' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().message.count.mockResolvedValue(3)
    getDb().payment.count.mockResolvedValue(0)

    await getNotifications()

    expect(getDb().message.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          read: false,
          senderId: { not: 'user-42' },
        }),
      })
    )
  })

  test('queries payments scoped to current user with PENDING status', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-42' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().message.count.mockResolvedValue(0)
    getDb().payment.count.mockResolvedValue(1)

    await getNotifications()

    expect(getDb().payment.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-42',
          status: 'PENDING',
        }),
      })
    )
  })
})

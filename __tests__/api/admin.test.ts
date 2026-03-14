/**
 * Tests for admin stats API route:
 *   app/api/admin/stats/route.ts  (GET)
 */
import { NextRequest } from 'next/server'

// ---- Mocks (must come before route imports) ----

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/db', () => ({
  db: {
    user: { count: jest.fn(), findMany: jest.fn() },
    node: { count: jest.fn(), groupBy: jest.fn() },
    edge: { count: jest.fn() },
    payment: { count: jest.fn(), groupBy: jest.fn() },
    conversation: { count: jest.fn() },
  },
}))

// ---- Imports ----

import { GET } from '@/app/api/admin/stats/route'
import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

function getDb() {
  return require('@/lib/db').db
}

function makeRequest(): NextRequest {
  return new NextRequest('http://localhost/api/admin/stats')
}

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'admin-1', role: 'ADMIN', ...overrides },
    expires: '2099-01-01',
  }
}

function setupAdminDbMocks() {
  const db = getDb()
  db.user.count.mockResolvedValue(42)
  db.user.findMany.mockResolvedValue([
    {
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'EXPLORER',
      createdAt: new Date('2026-01-01'),
    },
  ])
  db.node.count.mockResolvedValue(100)
  db.node.groupBy.mockResolvedValue([
    { type: 'USER', _count: { _all: 50 } },
    { type: 'LANGUAGE', _count: { _all: 30 } },
    { type: 'SECTOR', _count: { _all: 20 } },
  ])
  db.edge.count.mockResolvedValue(200)
  db.payment.count.mockResolvedValue(15)
  db.payment.groupBy.mockResolvedValue([
    { status: 'COMPLETED', _count: { _all: 10 } },
    { status: 'PENDING', _count: { _all: 5 } },
  ])
  db.conversation.count.mockResolvedValue(8)
}

// ---- Tests ----

describe('GET /api/admin/stats', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const req = makeRequest()
    const res = await GET()

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 403 for non-ADMIN user', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'EXPLORER' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )

    const req = makeRequest()
    const res = await GET()

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toBe('Forbidden')
  })

  test('returns stats for ADMIN user', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'ADMIN' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    setupAdminDbMocks()

    const res = await GET()

    expect(res.status).toBe(200)
    const data = await res.json()

    // Top-level counts
    expect(typeof data.explorers).toBe('number')
    expect(typeof data.hosts).toBe('number')

    // Nodes shape
    expect(data.nodes).toBeDefined()
    expect(typeof data.nodes.total).toBe('number')
    expect(typeof data.nodes.byType).toBe('object')

    // Edges
    expect(typeof data.edges).toBe('number')

    // Payments shape
    expect(data.payments).toBeDefined()
    expect(typeof data.payments.total).toBe('number')
    expect(typeof data.payments.byStatus).toBe('object')

    // Conversations
    expect(typeof data.conversations).toBe('number')

    // Recent users array
    expect(Array.isArray(data.recentUsers)).toBe(true)
    if (data.recentUsers.length > 0) {
      const u = data.recentUsers[0]
      expect(u).toHaveProperty('id')
      expect(u).toHaveProperty('name')
      expect(u).toHaveProperty('email')
      expect(u).toHaveProperty('role')
      expect(u).toHaveProperty('createdAt')
      expect(typeof u.createdAt).toBe('string')
    }
  })

  test('returns HOST count separately from EXPLORER count', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'ADMIN' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    setupAdminDbMocks()
    const db = getDb()
    // Distinguish counts for explorers vs hosts
    db.user.count
      .mockResolvedValueOnce(30) // explorers
      .mockResolvedValueOnce(12) // hosts

    const res = await GET()
    const data = await res.json()

    expect(data.explorers).toBe(30)
    expect(data.hosts).toBe(12)
  })
})

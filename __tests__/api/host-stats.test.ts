/**
 * Tests for host stats API route:
 *   app/api/host/stats/route.ts  (GET)
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
    node: { findFirst: jest.fn() },
    edge: { findMany: jest.fn() },
    payment: { findMany: jest.fn() },
  },
}))

// ---- Imports ----

import { GET } from '@/app/api/host/stats/route'
import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'host-1', role: 'HOST', ...overrides },
    expires: '2099-01-01',
  }
}

const mockHostNode = {
  id: 'node-host-1',
  userId: 'host-1',
  type: 'USER',
  code: 'host-1',
  label: 'Acme Corp',
}

const mockExperienceNode = {
  id: 'node-exp-1',
  type: 'EXPERIENCE',
  label: 'Safari Tour',
  icon: '🦁',
  properties: { sector: 'Tourism' },
  createdAt: new Date('2026-01-15'),
}

const mockOfferEdges = [
  { toId: 'node-exp-1', to: mockExperienceNode, createdAt: new Date('2026-01-15') },
]

const mockPayments = [
  {
    id: 'pay-1',
    amount: 5000,
    currency: 'KES',
    status: 'SUCCESS',
    createdAt: new Date('2026-02-01'),
  },
  {
    id: 'pay-2',
    amount: 3000,
    currency: 'KES',
    status: 'PENDING',
    createdAt: new Date('2026-02-10'),
  },
]

// ---- GET /api/host/stats ----

describe('GET /api/host/stats', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  test('returns 403 for EXPLORER role', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'EXPLORER' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await GET()
    expect(res.status).toBe(403)
  })

  test('returns 403 for missing role', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: undefined }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await GET()
    expect(res.status).toBe(403)
  })

  test('returns stats for HOST user', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.node.findFirst.mockResolvedValue(mockHostNode)
    db.edge.findMany.mockResolvedValue(mockOfferEdges)
    db.payment.findMany.mockResolvedValue(mockPayments)

    const res = await GET()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.totalOpportunities).toBe(1)
    expect(data.opportunities).toHaveLength(1)
    expect(data.opportunities[0].label).toBe('Safari Tour')
    expect(data.totalPayments).toBe(2)
    expect(data.totalRevenue).toBe(5000) // only SUCCESS payments
    expect(data.recentPayments).toHaveLength(2)
  })

  test('returns stats for ADMIN role', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'admin-1', role: 'ADMIN' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )
    const db = getDb()
    db.node.findFirst.mockResolvedValue({ ...mockHostNode, userId: 'admin-1' })
    db.edge.findMany.mockResolvedValue(mockOfferEdges)
    db.payment.findMany.mockResolvedValue(mockPayments)

    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.totalOpportunities).toBe(1)
  })

  test('returns empty stats when host node does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.node.findFirst.mockResolvedValue(null)
    db.payment.findMany.mockResolvedValue([])

    const res = await GET()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.totalOpportunities).toBe(0)
    expect(data.opportunities).toHaveLength(0)
    expect(data.totalPayments).toBe(0)
    expect(data.totalRevenue).toBe(0)
  })

  test('revenue only sums SUCCESS payments', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.node.findFirst.mockResolvedValue(mockHostNode)
    db.edge.findMany.mockResolvedValue([])
    db.payment.findMany.mockResolvedValue([
      { id: 'p1', amount: 1000, currency: 'KES', status: 'SUCCESS', createdAt: new Date() },
      { id: 'p2', amount: 2000, currency: 'KES', status: 'FAILED', createdAt: new Date() },
      { id: 'p3', amount: 3000, currency: 'KES', status: 'PENDING', createdAt: new Date() },
    ])

    const res = await GET()
    const data = await res.json()
    expect(data.totalRevenue).toBe(1000)
    expect(data.totalPayments).toBe(3)
  })
})

/**
 * Tests for explorer API routes:
 *   app/api/explorers/route.ts       (GET)
 *   app/api/explorers/[id]/route.ts  (GET)
 */
import { NextRequest } from 'next/server'

// ---- Mocks (must come before route imports) ----

jest.mock('@/lib/db', () => ({
  db: {
    node: { findMany: jest.fn(), findUnique: jest.fn() },
    user: { findMany: jest.fn() },
  },
}))

// ---- Imports ----

import { GET } from '@/app/api/explorers/route'
import { GET as getById } from '@/app/api/explorers/[id]/route'

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeListRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost/api/explorers')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return new NextRequest(url.toString())
}

function makeDetailRequest(id: string): NextRequest {
  return new NextRequest(`http://localhost/api/explorers/${id}`)
}

function makeByIdContext(id: string) {
  return { params: { id } }
}

function makeUserNode(overrides: Record<string, unknown> = {}) {
  return {
    id: 'node-1',
    type: 'USER',
    userId: 'user-1',
    user: {
      id: 'user-1',
      name: 'Alice Muthoni',
      image: null,
      country: 'KE',
    },
    outEdges: [
      {
        relation: 'SPEAKS',
        to: { label: 'Swahili', type: 'LANGUAGE' },
      },
      {
        relation: 'WORKS_IN',
        to: { label: 'Technology', type: 'SECTOR' },
      },
    ],
    ...overrides,
  }
}

// ---- Tests: GET /api/explorers ----

describe('GET /api/explorers', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns explorers array', async () => {
    getDb().node.findMany.mockResolvedValue([makeUserNode()])

    const req = makeListRequest()
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(Array.isArray(data.explorers)).toBe(true)
    expect(data.explorers).toHaveLength(1)
    expect(data.explorers[0].name).toBe('Alice Muthoni')
    expect(data.explorers[0].edges.speaks).toContain('Swahili')
    expect(data.explorers[0].edges.worksIn).toContain('Technology')
  })

  test('passes q param as name filter', async () => {
    getDb().node.findMany.mockResolvedValue([])

    const req = makeListRequest({ q: 'Alice' })
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.explorers).toHaveLength(0)

    // Verify findMany was called with user name filter
    const callArgs = getDb().node.findMany.mock.calls[0][0]
    expect(callArgs.where.user).toMatchObject({
      name: { contains: 'Alice', mode: 'insensitive' },
    })
  })

  test('caps limit at 50', async () => {
    getDb().node.findMany.mockResolvedValue([])

    const req = makeListRequest({ limit: '999' })
    await GET(req)

    const callArgs = getDb().node.findMany.mock.calls[0][0]
    expect(callArgs.take).toBe(50)
  })

  test('uses default limit of 20 when no limit param given', async () => {
    getDb().node.findMany.mockResolvedValue([])

    const req = makeListRequest()
    await GET(req)

    const callArgs = getDb().node.findMany.mock.calls[0][0]
    expect(callArgs.take).toBe(20)
  })

  test('filters out nodes without a user', async () => {
    const nodeWithoutUser = { ...makeUserNode(), user: null, userId: null }
    getDb().node.findMany.mockResolvedValue([nodeWithoutUser])

    const req = makeListRequest()
    const res = await GET(req)
    const data = await res.json()

    expect(data.explorers).toHaveLength(0)
  })
})

// ---- Tests: GET /api/explorers/[id] ----

describe('GET /api/explorers/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 404 for non-existent node', async () => {
    getDb().node.findUnique.mockResolvedValue(null)

    const req = makeDetailRequest('nonexistent-id')
    const res = await getById(req, makeByIdContext('nonexistent-id'))

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('Explorer not found')
  })

  test('returns 404 when node type is not USER', async () => {
    getDb().node.findUnique.mockResolvedValue({
      id: 'node-2',
      type: 'LANGUAGE',
      userId: null,
      user: null,
      outEdges: [],
    })

    const req = makeDetailRequest('node-2')
    const res = await getById(req, makeByIdContext('node-2'))

    expect(res.status).toBe(404)
  })

  test('returns explorer with grouped dimensions', async () => {
    const fullNode = {
      id: 'node-1',
      type: 'USER',
      userId: 'user-1',
      user: {
        id: 'user-1',
        name: 'Alice Muthoni',
        image: null,
        country: 'KE',
        createdAt: new Date('2026-01-15'),
      },
      outEdges: [
        {
          relation: 'SPEAKS',
          to: { code: 'sw', label: 'Swahili', type: 'LANGUAGE' },
        },
        {
          relation: 'SPEAKS',
          to: { code: 'en', label: 'English', type: 'LANGUAGE' },
        },
        {
          relation: 'WORKS_IN',
          to: { code: 'technology', label: 'Technology', type: 'SECTOR' },
        },
        {
          relation: 'HAS_SKILL',
          to: { code: 'python', label: 'Python', type: 'SKILL' },
        },
      ],
    }

    getDb().node.findUnique.mockResolvedValue(fullNode)

    const req = makeDetailRequest('node-1')
    const res = await getById(req, makeByIdContext('node-1'))

    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data.id).toBe('node-1')
    expect(data.userId).toBe('user-1')
    expect(data.name).toBe('Alice Muthoni')
    expect(data.country).toBe('KE')
    expect(data.createdAt).toBe('2026-01-15T00:00:00.000Z')

    // Dimensions grouped by relation
    expect(data.dimensions.SPEAKS).toHaveLength(2)
    expect(data.dimensions.SPEAKS).toContainEqual({ code: 'sw', label: 'Swahili' })
    expect(data.dimensions.SPEAKS).toContainEqual({ code: 'en', label: 'English' })
    expect(data.dimensions.WORKS_IN).toHaveLength(1)
    expect(data.dimensions.HAS_SKILL).toHaveLength(1)
  })

  test('returns 404 when userId is null on USER node', async () => {
    getDb().node.findUnique.mockResolvedValue({
      id: 'node-orphan',
      type: 'USER',
      userId: null,
      user: null,
      outEdges: [],
    })

    const req = makeDetailRequest('node-orphan')
    const res = await getById(req, makeByIdContext('node-orphan'))

    expect(res.status).toBe(404)
  })
})

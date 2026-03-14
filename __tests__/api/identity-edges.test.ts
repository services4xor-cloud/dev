/**
 * Tests for identity graph API routes:
 *   app/api/identity/edges/route.ts   (POST, DELETE)
 *   app/api/identity/route.ts         (PATCH)
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
    node: { findUnique: jest.fn(), upsert: jest.fn(), update: jest.fn() },
    edge: { upsert: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
    user: { update: jest.fn() },
    $transaction: jest.fn(),
  },
}))

// ---- Imports ----

import { POST, DELETE } from '@/app/api/identity/edges/route'
import { PATCH } from '@/app/api/identity/route'
import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'user-1', role: 'EXPLORER', ...overrides },
    expires: '2099-01-01',
  }
}

function makePostEdgeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/identity/edges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeDeleteEdgeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/identity/edges', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makePatchIdentityRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/identity', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockUserNode = {
  id: 'node-user-1',
  userId: 'user-1',
  type: 'USER',
  code: 'user-1',
  label: 'Alice',
  icon: null,
  properties: {},
  active: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const mockTargetNode = {
  id: 'node-lang-sw',
  userId: null,
  type: 'LANGUAGE',
  code: 'sw',
  label: 'sw',
  icon: null,
  properties: {},
  active: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const mockEdge = {
  id: 'edge-1',
  fromId: 'node-user-1',
  toId: 'node-lang-sw',
  relation: 'SPEAKS',
  weight: 1,
  createdAt: new Date('2026-01-01'),
  to: mockTargetNode,
}

// ---- POST /api/identity/edges ----

describe('POST /api/identity/edges', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await POST(
      makePostEdgeRequest({ relation: 'SPEAKS', targetType: 'LANGUAGE', targetCode: 'sw' })
    )
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  test('returns 400 for invalid relation', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await POST(
      makePostEdgeRequest({
        relation: 'INVALID_RELATION',
        targetType: 'LANGUAGE',
        targetCode: 'sw',
      })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Invalid relation/)
  })

  test('returns 400 for invalid targetType given a valid relation', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    // SPEAKS only allows LANGUAGE — SECTOR is invalid for it
    const res = await POST(
      makePostEdgeRequest({ relation: 'SPEAKS', targetType: 'SECTOR', targetCode: 'tech' })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Invalid targetType/)
  })

  test('returns 400 for missing required fields in body', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await POST(
      makePostEdgeRequest({ relation: 'SPEAKS' }) // missing targetType + targetCode
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/relation, targetType, targetCode/)
  })

  test('creates edge successfully and returns 201', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.node.findUnique.mockResolvedValue(mockUserNode)
    db.node.upsert.mockResolvedValue(mockTargetNode)
    db.edge.upsert.mockResolvedValue(mockEdge)

    const res = await POST(
      makePostEdgeRequest({ relation: 'SPEAKS', targetType: 'LANGUAGE', targetCode: 'sw' })
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe('edge-1')
    expect(body.relation).toBe('SPEAKS')
    expect(body.to.type).toBe('LANGUAGE')
    expect(body.to.code).toBe('sw')
  })

  test('upserts target node if it does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.node.findUnique.mockResolvedValue(mockUserNode)
    db.node.upsert.mockResolvedValue(mockTargetNode)
    db.edge.upsert.mockResolvedValue(mockEdge)

    await POST(
      makePostEdgeRequest({ relation: 'SPEAKS', targetType: 'LANGUAGE', targetCode: 'sw' })
    )

    expect(db.node.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { type_code: { type: 'LANGUAGE', code: 'sw' } },
        create: expect.objectContaining({ type: 'LANGUAGE', code: 'sw', label: 'sw' }),
        update: {},
      })
    )
  })

  test('returns 404 when user node not found', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().node.findUnique.mockResolvedValue(null)

    const res = await POST(
      makePostEdgeRequest({ relation: 'SPEAKS', targetType: 'LANGUAGE', targetCode: 'sw' })
    )
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/User node not found/)
  })

  test('returns 400 for empty targetCode', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await POST(
      makePostEdgeRequest({ relation: 'SPEAKS', targetType: 'LANGUAGE', targetCode: '   ' })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/targetCode/)
  })

  test('LOCATED_IN relation allows LOCATION and COUNTRY targetTypes', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    const locationNode = { ...mockTargetNode, type: 'LOCATION', code: 'nairobi' }
    db.node.findUnique.mockResolvedValue(mockUserNode)
    db.node.upsert.mockResolvedValue(locationNode)
    db.edge.upsert.mockResolvedValue({ ...mockEdge, relation: 'LOCATED_IN', to: locationNode })

    const res = await POST(
      makePostEdgeRequest({ relation: 'LOCATED_IN', targetType: 'LOCATION', targetCode: 'nairobi' })
    )
    expect(res.status).toBe(201)
  })
})

// ---- DELETE /api/identity/edges ----

describe('DELETE /api/identity/edges', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await DELETE(makeDeleteEdgeRequest({ edgeId: 'edge-1' }))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  test('returns 400 when edgeId is missing from body', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await DELETE(makeDeleteEdgeRequest({}))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/edgeId/)
  })

  test('returns 404 when user node not found', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().node.findUnique.mockResolvedValue(null)

    const res = await DELETE(makeDeleteEdgeRequest({ edgeId: 'edge-1' }))
    expect(res.status).toBe(404)
  })

  test('returns 404 when edge does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.node.findUnique.mockResolvedValue(mockUserNode)
    db.edge.findUnique.mockResolvedValue(null)

    const res = await DELETE(makeDeleteEdgeRequest({ edgeId: 'edge-missing' }))
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/Edge not found/)
  })

  test('returns 403 when edge does not belong to the requesting user', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-other' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    // user-other's node has a different id than the edge's fromId
    db.node.findUnique.mockResolvedValue({
      ...mockUserNode,
      id: 'node-other',
      userId: 'user-other',
    })
    db.edge.findUnique.mockResolvedValue(mockEdge) // fromId = 'node-user-1', not 'node-other'

    const res = await DELETE(makeDeleteEdgeRequest({ edgeId: 'edge-1' }))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('Forbidden')
  })

  test('deletes edge successfully and returns 200', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.node.findUnique.mockResolvedValue(mockUserNode)
    db.edge.findUnique.mockResolvedValue(mockEdge)
    db.edge.delete.mockResolvedValue(mockEdge)

    const res = await DELETE(makeDeleteEdgeRequest({ edgeId: 'edge-1' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)

    expect(db.edge.delete).toHaveBeenCalledWith({ where: { id: 'edge-1' } })
  })
})

// ---- PATCH /api/identity (name update) ----

describe('PATCH /api/identity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // The route uses array-form $transaction — mock it to resolve all items
    getDb().$transaction.mockImplementation((ops: Promise<unknown>[]) => Promise.all(ops))
    getDb().user.update.mockResolvedValue({ id: 'user-1', name: 'Alice Updated' })
    getDb().node.update.mockResolvedValue({ ...mockUserNode, label: 'Alice Updated' })
  })

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await PATCH(makePatchIdentityRequest({ name: 'Alice' }))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  test('returns 400 when name field is missing', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await PATCH(makePatchIdentityRequest({ other: 'field' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/name/)
  })

  test('returns 400 for empty name (whitespace-only)', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await PATCH(makePatchIdentityRequest({ name: '   ' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/1.100 characters/)
  })

  test('returns 400 for name exceeding 100 characters', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const longName = 'A'.repeat(101)
    const res = await PATCH(makePatchIdentityRequest({ name: longName }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/1.100 characters/)
  })

  test('updates name successfully and returns 200 with name', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )

    const res = await PATCH(makePatchIdentityRequest({ name: 'Alice Updated' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.name).toBe('Alice Updated')
  })

  test('trims whitespace from name before updating', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )

    const res = await PATCH(makePatchIdentityRequest({ name: '  Trimmed Name  ' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('Trimmed Name')
  })

  test('calls $transaction to update User and Node atomically', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )

    await PATCH(makePatchIdentityRequest({ name: 'Alice' }))

    expect(getDb().$transaction).toHaveBeenCalledTimes(1)
    expect(getDb().user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: { name: 'Alice' },
      })
    )
    expect(getDb().node.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        data: { label: 'Alice' },
      })
    )
  })

  test('returns 400 for invalid JSON body', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const req = new NextRequest('http://localhost/api/identity', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-valid-json',
    })
    const res = await PATCH(req)
    expect(res.status).toBe(400)
  })
})

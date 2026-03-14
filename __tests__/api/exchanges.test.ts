/**
 * Tests for exchanges API routes:
 *   app/api/exchanges/route.ts       (GET, POST)
 *   app/api/exchanges/[id]/route.ts  (PATCH)
 */
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/notifications', () => ({ notify: jest.fn() }))
jest.mock('@/lib/graph', () => ({ getUserNode: jest.fn() }))
jest.mock('@/lib/db', () => ({
  db: {
    edge: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    node: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}))

import { GET, POST } from '@/app/api/exchanges/route'
import { PATCH } from '@/app/api/exchanges/[id]/route'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { getUserNode } from '@/lib/graph'

const mockSession = getServerSession as jest.Mock
const mockGetUserNode = getUserNode as jest.Mock

function makeReq(
  url = 'http://localhost/api/exchanges',
  method = 'GET',
  body?: object
): NextRequest {
  return new NextRequest(url, {
    method,
    ...(body
      ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
      : {}),
  })
}

describe('GET /api/exchanges', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 without session', async () => {
    mockSession.mockResolvedValue(null)
    const res = await GET(makeReq())
    expect(res.status).toBe(401)
  })

  it('returns empty array if no user node', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    mockGetUserNode.mockResolvedValue(null)
    const res = await GET(makeReq())
    const data = await res.json()
    expect(data).toEqual([])
  })
})

describe('POST /api/exchanges', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 without session', async () => {
    mockSession.mockResolvedValue(null)
    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', { opportunityId: 'x' })
    )
    expect(res.status).toBe(401)
  })

  it('returns 400 without opportunityId', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    const res = await POST(makeReq('http://localhost/api/exchanges', 'POST', {}))
    expect(res.status).toBe(400)
  })

  it('returns 404 if opportunity not found', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    ;(db.node.findUnique as jest.Mock).mockResolvedValue(null)
    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', { opportunityId: 'bad' })
    )
    expect(res.status).toBe(404)
  })

  it('returns 409 if already applied', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    ;(db.node.findUnique as jest.Mock).mockResolvedValue({
      id: 'exp1',
      type: 'EXPERIENCE',
      inEdges: [],
    })
    mockGetUserNode.mockResolvedValue({ id: 'node1' })
    ;(db.edge.findFirst as jest.Mock).mockResolvedValue({ id: 'existing' })
    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', { opportunityId: 'exp1' })
    )
    expect(res.status).toBe(409)
  })

  it('creates SEEKS edge on success', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    ;(db.node.findUnique as jest.Mock).mockResolvedValue({
      id: 'exp1',
      type: 'EXPERIENCE',
      inEdges: [],
    })
    mockGetUserNode.mockResolvedValue({ id: 'node1' })
    ;(db.edge.findFirst as jest.Mock).mockResolvedValue(null)
    ;(db.edge.create as jest.Mock).mockResolvedValue({ id: 'edge1' })
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ name: 'Alice' })

    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', {
        opportunityId: 'exp1',
        message: 'Interested!',
      })
    )
    expect(res.status).toBe(201)
    expect(db.edge.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fromId: 'node1',
          toId: 'exp1',
          relation: 'SEEKS',
        }),
      })
    )
  })
})

describe('PATCH /api/exchanges/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 without session', async () => {
    mockSession.mockResolvedValue(null)
    const req = makeReq('http://localhost/api/exchanges/e1', 'PATCH', { status: 'ACCEPTED' })
    const res = await PATCH(req, { params: { id: 'e1' } })
    expect(res.status).toBe(401)
  })

  it('returns 403 if not HOST or ADMIN', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1', role: 'EXPLORER' } })
    const req = makeReq('http://localhost/api/exchanges/e1', 'PATCH', { status: 'ACCEPTED' })
    const res = await PATCH(req, { params: { id: 'e1' } })
    expect(res.status).toBe(403)
  })

  it('returns 400 for invalid status', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1', role: 'HOST' } })
    const req = makeReq('http://localhost/api/exchanges/e1', 'PATCH', { status: 'INVALID' })
    const res = await PATCH(req, { params: { id: 'e1' } })
    expect(res.status).toBe(400)
  })

  it('returns 404 if edge not found', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1', role: 'HOST' } })
    ;(db.edge.findUnique as jest.Mock).mockResolvedValue(null)
    const req = makeReq('http://localhost/api/exchanges/e1', 'PATCH', { status: 'ACCEPTED' })
    const res = await PATCH(req, { params: { id: 'e1' } })
    expect(res.status).toBe(404)
  })

  it('accepts an application successfully', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1', role: 'HOST' } })
    ;(db.edge.findUnique as jest.Mock).mockResolvedValue({
      id: 'e1',
      relation: 'SEEKS',
      properties: { status: 'PENDING' },
      to: {
        label: 'Job',
        inEdges: [{ from: { userId: 'u1' } }],
      },
      from: { userId: 'u2', label: 'Alice' },
    })
    mockGetUserNode.mockResolvedValue({ id: 'node1' })
    ;(db.edge.update as jest.Mock).mockResolvedValue({})
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ name: 'Host Bob' })

    const req = makeReq('http://localhost/api/exchanges/e1', 'PATCH', { status: 'ACCEPTED' })
    const res = await PATCH(req, { params: { id: 'e1' } })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('ACCEPTED')
  })
})

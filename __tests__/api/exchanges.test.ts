/**
 * Tests for exchanges API routes:
 *   app/api/exchanges/route.ts       (GET, POST)
 *   app/api/exchanges/[id]/route.ts  (PATCH)
 */
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/notifications', () => ({ notify: jest.fn().mockResolvedValue(undefined) }))
jest.mock('@/lib/graph', () => ({ ensureUserNode: jest.fn() }))
jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  actionEmail: jest.fn().mockReturnValue('<html>'),
}))
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
    user: { findUnique: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
  },
}))

import { GET, POST } from '@/app/api/exchanges/route'
import { PATCH } from '@/app/api/exchanges/[id]/route'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { ensureUserNode } from '@/lib/graph'

const mockSession = getServerSession as jest.Mock
const mockGetUserNode = ensureUserNode as jest.Mock

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

function publishedOpportunity(overrides: Record<string, unknown> = {}) {
  return {
    id: 'exp1',
    type: 'EXPERIENCE',
    active: true,
    label: 'Safari',
    properties: { kind: 'JOURNEY', status: 'PUBLISHED' },
    inEdges: [{ from: { userId: 'host1' } }],
    ...overrides,
  }
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
    ;(db.node.findUnique as jest.Mock).mockResolvedValue(publishedOpportunity())
    mockGetUserNode.mockResolvedValue({ id: 'node1' })
    ;(db.edge.findFirst as jest.Mock).mockResolvedValue({ id: 'existing' })
    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', { opportunityId: 'exp1' })
    )
    expect(res.status).toBe(409)
  })

  it('creates SEEKS edge on success', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    ;(db.node.findUnique as jest.Mock).mockResolvedValue(publishedOpportunity())
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

describe('POST /api/exchanges — booking rules', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 404 for a listing still in review', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    ;(db.node.findUnique as jest.Mock).mockResolvedValue(
      publishedOpportunity({ properties: { kind: 'JOURNEY', status: 'IN_REVIEW' } })
    )
    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', { opportunityId: 'exp1' })
    )
    expect(res.status).toBe(404)
  })

  it('refuses booking your own listing', async () => {
    mockSession.mockResolvedValue({ user: { id: 'host1' } })
    ;(db.node.findUnique as jest.Mock).mockResolvedValue(publishedOpportunity())
    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', { opportunityId: 'exp1' })
    )
    expect(res.status).toBe(400)
  })

  it('notifies admins when the provider has no login', async () => {
    const { notify } = require('@/lib/notifications')
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    ;(db.node.findUnique as jest.Mock).mockResolvedValue(
      publishedOpportunity({ inEdges: [{ from: { userId: null } }] })
    )
    mockGetUserNode.mockResolvedValue({ id: 'node1' })
    ;(db.edge.findFirst as jest.Mock).mockResolvedValue(null)
    ;(db.edge.create as jest.Mock).mockResolvedValue({ id: 'edge1' })
    ;(db.user.findMany as jest.Mock).mockResolvedValue([{ id: 'admin1', email: 'a@x.de' }])
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({ name: 'Alice' })
    const res = await POST(
      makeReq('http://localhost/api/exchanges', 'POST', { opportunityId: 'exp1' })
    )
    expect(res.status).toBe(201)
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ userId: 'admin1' }))
  })
})

describe('GET /api/exchanges — access links', () => {
  beforeEach(() => jest.clearAllMocks())

  it('reveals the access link only for accepted bookings', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    mockGetUserNode.mockResolvedValue({ id: 'node1' })
    const to = {
      id: 'svc1',
      label: 'Studio',
      icon: '📣',
      properties: { kind: 'SERVICE', status: 'PUBLISHED', accessUrl: 'https://studio.4xor.de/' },
      inEdges: [],
    }
    ;(db.edge.findMany as jest.Mock).mockResolvedValue([
      { id: 'a', properties: { status: 'ACCEPTED' }, createdAt: new Date(), to },
      { id: 'b', properties: { status: 'PENDING' }, createdAt: new Date(), to },
    ])
    const res = await GET(makeReq())
    const data = (await res.json()) as { id: string; accessUrl?: string }[]
    expect(data.find((x) => x.id === 'a')?.accessUrl).toBe('https://studio.4xor.de/')
    expect(data.find((x) => x.id === 'b')?.accessUrl).toBeUndefined()
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

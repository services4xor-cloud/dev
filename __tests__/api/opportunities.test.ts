/**
 * Tests for app/api/opportunities routes: review flow and private access links.
 */
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/notifications', () => ({ notify: jest.fn().mockResolvedValue(undefined) }))
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue(true),
  clientIp: jest.fn().mockReturnValue('ip'),
}))
jest.mock('@/lib/db', () => ({
  db: {
    node: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    edge: { create: jest.fn() },
    user: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  },
}))

import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { GET, POST } from '@/app/api/opportunities/route'
import { GET as GET_ONE, PATCH } from '@/app/api/opportunities/[id]/route'

const session = getServerSession as jest.Mock
const node = db.node as unknown as Record<string, jest.Mock>
const user = db.user as unknown as Record<string, jest.Mock>

const as = (id: string, role = 'EXPLORER') => session.mockResolvedValue({ user: { id, role } })

function listing(status: string, hostUserId: string | null = 'host-1') {
  return {
    id: 'opp-1',
    type: 'EXPERIENCE',
    label: 'Studio',
    icon: '📣',
    lat: 1,
    lng: 2,
    active: status !== 'ARCHIVED',
    properties: { kind: 'SERVICE', status, accessUrl: 'https://studio.4xor.de/' },
    inEdges: [{ from: { label: 'Host', icon: null, userId: hostUserId } }],
  }
}

const req = (url: string, body?: unknown, method = 'POST') =>
  new NextRequest(
    `http://localhost${url}`,
    body ? { method, body: JSON.stringify(body) } : undefined
  )

const params = { params: { id: 'opp-1' } }
const valid = { title: 'Studio', description: 'Posts', kind: 'SERVICE', countryCode: 'CH' }

beforeEach(() => {
  jest.clearAllMocks()
  node.update.mockImplementation(({ data }) =>
    Promise.resolve({ ...listing('PUBLISHED'), ...data })
  )
  node.create.mockImplementation(({ data }) => Promise.resolve({ id: 'new', ...data }))
  user.findMany.mockResolvedValue([{ id: 'admin-1' }])
})

describe('GET /api/opportunities', () => {
  it('lists only published listings and never the access link', async () => {
    node.findMany.mockResolvedValue([listing('PUBLISHED'), listing('IN_REVIEW')])
    const res = await GET(req('/api/opportunities'))
    const data = await res.json()
    expect(data).toHaveLength(1)
    expect(JSON.stringify(data)).not.toContain('studio.4xor.de')
  })

  it('refuses the review queue to non-admins', async () => {
    as('u1')
    expect((await GET(req('/api/opportunities?review=1'))).status).toBe(403)
  })
})

describe('POST /api/opportunities', () => {
  beforeEach(() => {
    user.findUnique.mockResolvedValue({
      name: 'T',
      email: 't@x.com',
      role: 'EXPLORER',
      node: { id: 'un' },
    })
  })

  it('requires sign-in', async () => {
    session.mockResolvedValue(null)
    expect((await POST(req('/api/opportunities', valid))).status).toBe(401)
  })

  it('puts a member listing in review and makes them a Host', async () => {
    as('u1')
    const res = await POST(req('/api/opportunities', valid))
    expect(res.status).toBe(201)
    expect(node.create.mock.calls[0][0].data.properties.status).toBe('IN_REVIEW')
    expect(user.update).toHaveBeenCalledWith({ where: { id: 'u1' }, data: { role: 'HOST' } })
  })

  it('publishes an admin listing at once', async () => {
    as('a1', 'ADMIN')
    await POST(req('/api/opportunities', valid))
    expect(node.create.mock.calls[0][0].data.properties.status).toBe('PUBLISHED')
  })
})

describe('/api/opportunities/[id]', () => {
  it('hides an unpublished listing from others', async () => {
    as('stranger')
    node.findUnique.mockResolvedValue(listing('IN_REVIEW'))
    expect((await GET_ONE(req('/api/opportunities/opp-1'), params)).status).toBe(404)
  })

  it('shows the access link to the owner only', async () => {
    node.findUnique.mockResolvedValue(listing('PUBLISHED'))
    as('stranger')
    expect(
      (await (await GET_ONE(req('/api/opportunities/opp-1'), params)).json()).accessUrl
    ).toBeUndefined()
    as('host-1')
    expect(
      (await (await GET_ONE(req('/api/opportunities/opp-1'), params)).json()).accessUrl
    ).toBeDefined()
  })

  it('forbids a host from publishing and sends their edits back to review', async () => {
    as('host-1')
    node.findUnique.mockResolvedValue(listing('IN_REVIEW'))
    expect((await PATCH(req('/x', { status: 'PUBLISHED' }, 'PATCH'), params)).status).toBe(403)

    node.findUnique.mockResolvedValue(listing('PUBLISHED'))
    await PATCH(req('/x', { title: 'Renamed' }, 'PATCH'), params)
    expect(node.update.mock.calls[0][0].data.properties.status).toBe('IN_REVIEW')
  })

  it('forbids editing someone else’s listing', async () => {
    as('stranger')
    node.findUnique.mockResolvedValue(listing('PUBLISHED'))
    expect((await PATCH(req('/x', { title: 'Mine now' }, 'PATCH'), params)).status).toBe(403)
  })

  it('lets an admin publish', async () => {
    as('a1', 'ADMIN')
    node.findUnique.mockResolvedValue(listing('IN_REVIEW'))
    const res = await PATCH(req('/x', { status: 'PUBLISHED' }, 'PATCH'), params)
    expect(res.status).toBe(200)
    expect(node.update.mock.calls[0][0].data).toMatchObject({
      active: true,
      properties: { status: 'PUBLISHED' },
    })
  })
})

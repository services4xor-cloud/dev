/**
 * Tests for notifications API route:
 *   app/api/notifications/route.ts (GET, PATCH)
 */
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/db', () => ({
  db: {
    notification: {
      findMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}))

import { GET, PATCH } from '@/app/api/notifications/route'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

const mockSession = getServerSession as jest.Mock
const mockFindMany = db.notification.findMany as jest.Mock
const mockCount = db.notification.count as jest.Mock
const mockUpdateMany = db.notification.updateMany as jest.Mock

function makeReq(params = ''): NextRequest {
  return new NextRequest(`http://localhost/api/notifications${params}`)
}

function makePatchReq(body: object): NextRequest {
  return new NextRequest('http://localhost/api/notifications', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function session(id = 'u1') {
  return { user: { id } }
}

describe('GET /api/notifications', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 without session', async () => {
    mockSession.mockResolvedValue(null)
    const res = await GET(makeReq())
    expect(res.status).toBe(401)
  })

  it('returns notifications and unread count', async () => {
    mockSession.mockResolvedValue(session())
    mockFindMany.mockResolvedValue([
      { id: 'n1', type: 'MESSAGE', title: 'Hello', read: false, createdAt: new Date() },
    ])
    mockCount.mockResolvedValue(1)

    const res = await GET(makeReq())
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.notifications).toHaveLength(1)
    expect(data.unreadCount).toBe(1)
  })

  it('respects limit param', async () => {
    mockSession.mockResolvedValue(session())
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    await GET(makeReq('?limit=5'))
    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }))
  })

  it('caps limit at 50', async () => {
    mockSession.mockResolvedValue(session())
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    await GET(makeReq('?limit=999'))
    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }))
  })

  it('returns nextCursor when results match limit', async () => {
    mockSession.mockResolvedValue(session())
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: `n${i}`,
      type: 'SYSTEM',
      title: `Notification ${i}`,
      read: false,
      createdAt: new Date(),
    }))
    mockFindMany.mockResolvedValue(items)
    mockCount.mockResolvedValue(25)

    const res = await GET(makeReq())
    const data = await res.json()
    expect(data.nextCursor).toBe('n19')
  })
})

describe('PATCH /api/notifications', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 without session', async () => {
    mockSession.mockResolvedValue(null)
    const res = await PATCH(makePatchReq({ all: true }))
    expect(res.status).toBe(401)
  })

  it('marks all as read when all: true', async () => {
    mockSession.mockResolvedValue(session())
    mockUpdateMany.mockResolvedValue({ count: 3 })

    const res = await PATCH(makePatchReq({ all: true }))
    expect(res.status).toBe(200)
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { userId: 'u1', read: false },
      data: { read: true },
    })
  })

  it('marks specific ids as read', async () => {
    mockSession.mockResolvedValue(session())
    mockUpdateMany.mockResolvedValue({ count: 2 })

    const res = await PATCH(makePatchReq({ ids: ['n1', 'n2'] }))
    expect(res.status).toBe(200)
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: { in: ['n1', 'n2'] }, userId: 'u1' },
      data: { read: true },
    })
  })

  it('returns 400 without ids or all', async () => {
    mockSession.mockResolvedValue(session())
    const res = await PATCH(makePatchReq({}))
    expect(res.status).toBe(400)
  })
})

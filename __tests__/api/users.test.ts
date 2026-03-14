/**
 * Tests for /api/users/[id] route
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
    user: {
      findUnique: jest.fn(),
    },
  },
}))

import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { GET } from '@/app/api/users/[id]/route'

const mockSession = getServerSession as jest.Mock
const mockFindUnique = db.user.findUnique as jest.Mock

function makeReq(): NextRequest {
  return new NextRequest('http://localhost/api/users/u1')
}

describe('GET /api/users/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockSession.mockResolvedValue(null)
    const res = await GET(makeReq(), { params: { id: 'u1' } })
    expect(res.status).toBe(401)
  })

  it('returns 404 when user not found', async () => {
    mockSession.mockResolvedValue({ user: { id: 'me' } })
    mockFindUnique.mockResolvedValue(null)
    const res = await GET(makeReq(), { params: { id: 'u1' } })
    expect(res.status).toBe(404)
  })

  it('returns user info on success', async () => {
    mockSession.mockResolvedValue({ user: { id: 'me' } })
    mockFindUnique.mockResolvedValue({ id: 'u1', name: 'Alice', image: 'img.jpg' })
    const res = await GET(makeReq(), { params: { id: 'u1' } })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ id: 'u1', name: 'Alice', image: 'img.jpg' })
  })

  it('only selects id, name, image fields', async () => {
    mockSession.mockResolvedValue({ user: { id: 'me' } })
    mockFindUnique.mockResolvedValue({ id: 'u1', name: 'Bob', image: null })
    await GET(makeReq(), { params: { id: 'u1' } })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'u1' },
      select: { id: true, name: true, image: true },
    })
  })
})

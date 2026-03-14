/**
 * Tests for /api/identity/photo route (POST, DELETE)
 */
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/db', () => ({
  db: { user: { update: jest.fn() } },
}))

import { POST, DELETE } from '@/app/api/identity/photo/route'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

const mockSession = getServerSession as jest.Mock
const mockUpdate = db.user.update as jest.Mock

function makeReq(body: object): NextRequest {
  return new NextRequest('http://localhost/api/identity/photo', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

const VALID_PHOTO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

describe('POST /api/identity/photo', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 without session', async () => {
    mockSession.mockResolvedValue(null)
    const res = await POST(makeReq({ photo: VALID_PHOTO }))
    expect(res.status).toBe(401)
  })

  it('returns 400 without photo', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    const res = await POST(makeReq({}))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid data URL', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    const res = await POST(makeReq({ photo: 'not-a-data-url' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for unsupported image type', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    // svg+xml doesn't match the \w+ regex, so it's an "invalid format" error
    const res = await POST(makeReq({ photo: 'data:image/svg+xml;base64,abc' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid')
  })

  it('uploads valid photo and updates DB', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    mockUpdate.mockResolvedValue({ id: 'u1', image: VALID_PHOTO })

    const res = await POST(makeReq({ photo: VALID_PHOTO }))
    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { image: VALID_PHOTO },
    })
    const data = await res.json()
    expect(data.image).toBe(VALID_PHOTO)
  })
})

describe('DELETE /api/identity/photo', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 401 without session', async () => {
    mockSession.mockResolvedValue(null)
    const res = await DELETE()
    expect(res.status).toBe(401)
  })

  it('removes photo and sets image to null', async () => {
    mockSession.mockResolvedValue({ user: { id: 'u1' } })
    mockUpdate.mockResolvedValue({ id: 'u1', image: null })

    const res = await DELETE()
    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { image: null },
    })
    const data = await res.json()
    expect(data.image).toBeNull()
  })
})

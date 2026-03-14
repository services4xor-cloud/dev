/**
 * Tests for notification preferences API:
 *   app/api/notifications/preferences/route.ts (GET, PUT)
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
    notificationPreference: {
      upsert: jest.fn(),
    },
  },
}))

// ---- Imports ----

import { GET, PUT } from '@/app/api/notifications/preferences/route'
import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'user-1', name: 'Alice Explorer', ...overrides },
    expires: '2099-01-01',
  }
}

const defaultPrefs = {
  id: 'pref-1',
  userId: 'user-1',
  email: true,
  push: false,
  messages: true,
  matches: true,
  marketing: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// ---- GET /api/notifications/preferences ----

describe('GET /api/notifications/preferences', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  test('returns default prefs for new user via upsert', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().notificationPreference.upsert.mockResolvedValue(defaultPrefs)

    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.email).toBe(true)
    expect(data.push).toBe(false)
    expect(data.messages).toBe(true)
    expect(data.matches).toBe(true)
    expect(data.marketing).toBe(false)
  })

  test('calls upsert with create defaults and empty update', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-42' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().notificationPreference.upsert.mockResolvedValue({ ...defaultPrefs, userId: 'user-42' })

    await GET()

    expect(getDb().notificationPreference.upsert).toHaveBeenCalledWith({
      where: { userId: 'user-42' },
      create: { userId: 'user-42' },
      update: {},
    })
  })
})

// ---- PUT /api/notifications/preferences ----

describe('PUT /api/notifications/preferences', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const req = new Request('http://localhost/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ email: false }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PUT(req)
    expect(res.status).toBe(401)
  })

  test('updates preferences and returns updated prefs', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const updated = { ...defaultPrefs, email: false, marketing: true }
    getDb().notificationPreference.upsert.mockResolvedValue(updated)

    const req = new Request('http://localhost/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ email: false, marketing: true }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.email).toBe(false)
    expect(data.marketing).toBe(true)
  })

  test('ignores invalid / non-boolean fields', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-99' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().notificationPreference.upsert.mockResolvedValue(defaultPrefs)

    const req = new Request('http://localhost/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ email: true, hacked: true, admin: 'yes', push: false }),
      headers: { 'Content-Type': 'application/json' },
    })
    await PUT(req)

    const callArgs = getDb().notificationPreference.upsert.mock.calls[0][0]
    expect(callArgs.update).toEqual({ email: true, push: false })
    expect(callArgs.update).not.toHaveProperty('hacked')
    expect(callArgs.update).not.toHaveProperty('admin')
  })

  test('calls upsert with correct userId', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-77' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().notificationPreference.upsert.mockResolvedValue({ ...defaultPrefs, userId: 'user-77' })

    const req = new Request('http://localhost/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ messages: false }),
      headers: { 'Content-Type': 'application/json' },
    })
    await PUT(req)

    expect(getDb().notificationPreference.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-77' } })
    )
  })
})

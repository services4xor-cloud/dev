/**
 * Tests for referral API routes:
 *   app/api/referral/route.ts       (GET, POST)
 *   app/api/referral/claim/route.ts (POST)
 */
import { NextRequest } from 'next/server'

// ---- Mocks (must come before route imports) ----

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/db', () => {
  const dbObj: Record<string, unknown> = {
    referral: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    user: { findUnique: jest.fn() },
    $transaction: jest.fn((fn: (tx: unknown) => Promise<unknown>) => fn(dbObj)),
  }
  return { db: dbObj }
})

// ---- Imports ----

import { GET as getReferral, POST as validateCode } from '@/app/api/referral/route'
import { POST as claimReferral } from '@/app/api/referral/claim/route'
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

function makePostRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockReferralRecord = {
  id: 'ref-1',
  referrerId: 'user-1',
  referredId: null,
  code: 'ABCD1234',
  status: 'ACTIVE',
  createdAt: new Date('2026-01-01'),
}

// ---- GET /api/referral ----

describe('GET /api/referral', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await getReferral()
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 401 when session has no user id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'No ID' },
      expires: '2099-01-01',
    } as unknown as Awaited<ReturnType<typeof getServerSession>>)
    const res = await getReferral()
    expect(res.status).toBe(401)
  })

  test('returns existing referral code and stats', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().referral.findFirst.mockResolvedValue(mockReferralRecord)
    getDb()
      .referral.count.mockResolvedValueOnce(3) // totalReferred
      .mockResolvedValueOnce(1) // totalJoined

    const res = await getReferral()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.code).toBe('ABCD1234')
    expect(data.totalReferred).toBe(3)
    expect(data.totalJoined).toBe(1)
    expect(data.link).toContain('ABCD1234')
  })

  test('creates a new referral code when none exists', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().referral.findFirst.mockResolvedValue(null)
    getDb().referral.create.mockResolvedValue({ ...mockReferralRecord, code: 'NEW01234' })
    getDb().referral.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0)

    const res = await getReferral()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.code).toBe('NEW01234')
    expect(getDb().referral.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ referrerId: 'user-1', status: 'ACTIVE' }),
      })
    )
  })
})

// ---- POST /api/referral (validate code) ----

describe('POST /api/referral', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns valid: true for an existing referral code', async () => {
    const referralWithReferrer = {
      ...mockReferralRecord,
      referrer: { name: 'Alice Explorer' },
    }
    getDb().referral.findUnique.mockResolvedValue(referralWithReferrer)

    const res = await validateCode(
      makePostRequest('http://localhost/api/referral', { code: 'ABCD1234' })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.valid).toBe(true)
    expect(data.referrerName).toBe('Alice Explorer')
  })

  test('returns valid: false for a non-existent referral code', async () => {
    getDb().referral.findUnique.mockResolvedValue(null)

    const res = await validateCode(
      makePostRequest('http://localhost/api/referral', { code: 'BADCODE' })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.valid).toBe(false)
  })

  test('falls back to "An Explorer" when referrer name is null', async () => {
    getDb().referral.findUnique.mockResolvedValue({
      ...mockReferralRecord,
      referrer: { name: null },
    })

    const res = await validateCode(
      makePostRequest('http://localhost/api/referral', { code: 'ABCD1234' })
    )
    const data = await res.json()
    expect(data.referrerName).toBe('An Explorer')
  })

  test('returns 400 when code field is missing', async () => {
    const res = await validateCode(
      makePostRequest('http://localhost/api/referral', { other: 'data' })
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Missing code')
  })

  test('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })
    const res = await validateCode(req)
    expect(res.status).toBe(400)
  })

  test('trims and uppercases the code before lookup', async () => {
    getDb().referral.findUnique.mockResolvedValue(null)

    await validateCode(makePostRequest('http://localhost/api/referral', { code: '  abcd1234  ' }))
    expect(getDb().referral.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { code: 'ABCD1234' } })
    )
  })
})

// ---- POST /api/referral/claim ----

describe('POST /api/referral/claim', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await claimReferral(
      makePostRequest('http://localhost/api/referral/claim', { code: 'ABCD1234' })
    )
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 400 for self-referral', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    // The referral code belongs to user-1 (same as the session user)
    getDb().referral.findUnique.mockResolvedValue({ ...mockReferralRecord, referrerId: 'user-1' })

    const res = await claimReferral(
      makePostRequest('http://localhost/api/referral/claim', { code: 'ABCD1234' })
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Cannot refer yourself')
  })

  test('returns 404 when referral code does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-2' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().referral.findUnique.mockResolvedValue(null)

    const res = await claimReferral(
      makePostRequest('http://localhost/api/referral/claim', { code: 'BADCODE' })
    )
    expect(res.status).toBe(404)
  })

  test('returns 400 when referral already claimed by this user', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-2' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().referral.findUnique.mockResolvedValue({ ...mockReferralRecord, referrerId: 'user-1' })
    getDb().referral.findFirst.mockResolvedValue({ id: 'ref-existing' }) // already claimed

    const res = await claimReferral(
      makePostRequest('http://localhost/api/referral/claim', { code: 'ABCD1234' })
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Referral already claimed')
  })

  test('returns 200 and claimed: true for valid claim', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-2' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().referral.findUnique.mockResolvedValue({ ...mockReferralRecord, referrerId: 'user-1' })
    getDb().referral.findFirst.mockResolvedValue(null) // not yet claimed
    getDb().referral.create.mockResolvedValue({ id: 'ref-new', status: 'JOINED' })

    const res = await claimReferral(
      makePostRequest('http://localhost/api/referral/claim', { code: 'ABCD1234' })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.claimed).toBe(true)
    expect(getDb().referral.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          referrerId: 'user-1',
          referredId: 'user-2',
          status: 'JOINED',
        }),
      })
    )
  })

  test('returns 400 for missing code field', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-2' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await claimReferral(
      makePostRequest('http://localhost/api/referral/claim', { other: 'data' })
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Missing code')
  })
})

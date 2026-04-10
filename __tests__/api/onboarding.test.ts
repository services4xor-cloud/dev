/**
 * Tests for onboarding API route:
 *   app/api/onboarding/route.ts (POST)
 *
 * The route creates graph edges for each identity dimension
 * (languages, faith, crafts, interests, locations) via createEdgesBatch.
 */
import { NextRequest } from 'next/server'

// ---- Mocks (must come before route imports) ----

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/graph', () => ({
  createEdgesBatch: jest.fn(),
}))

// ---- Imports ----

import { POST } from '@/app/api/onboarding/route'
import { getServerSession } from 'next-auth'
import { createEdgesBatch } from '@/lib/graph'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockCreateEdgesBatch = createEdgesBatch as jest.MockedFunction<typeof createEdgesBatch>

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: {
      id: 'user-1',
      name: 'Alice Explorer',
      email: 'alice@example.com',
      ...overrides,
    },
    expires: '2099-01-01',
  }
}

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/onboarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ============================================================
// POST /api/onboarding
// ============================================================

describe('POST /api/onboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default: createEdgesBatch returns the number of edges passed in
    mockCreateEdgesBatch.mockImplementation(async (_fromType, _fromCode, edges) => edges.length)
  })

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await POST(makePostRequest({ languages: ['sw'] }))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 401 when session has no user id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'No ID' },
      expires: '2099-01-01',
    } as unknown as Awaited<ReturnType<typeof getServerSession>>)
    const res = await POST(makePostRequest({ languages: ['sw'] }))
    expect(res.status).toBe(401)
  })

  test('returns 400 for invalid JSON body', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const req = new NextRequest('http://localhost/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-valid-json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid JSON')
  })

  test('creates language edges for each language provided', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    const res = await POST(makePostRequest({ languages: ['sw', 'en'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.created.languages).toBe(2)

    // Verify the batch call included both languages
    expect(mockCreateEdgesBatch).toHaveBeenCalledWith('USER', 'alice@example.com', [
      { toType: 'LANGUAGE', toCode: 'sw', relation: 'SPEAKS' },
      { toType: 'LANGUAGE', toCode: 'en', relation: 'SPEAKS' },
    ])
  })

  test('creates faith edges for each faith provided', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    const res = await POST(makePostRequest({ faith: ['christianity', 'islam'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.faith).toBe(2)

    expect(mockCreateEdgesBatch).toHaveBeenCalledWith('USER', 'alice@example.com', [
      { toType: 'FAITH', toCode: 'christianity', relation: 'PRACTICES' },
      { toType: 'FAITH', toCode: 'islam', relation: 'PRACTICES' },
    ])
  })

  test('creates skill edges for each craft provided', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    const res = await POST(makePostRequest({ crafts: ['software-engineer', 'designer'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.crafts).toBe(2)

    expect(mockCreateEdgesBatch).toHaveBeenCalledWith('USER', 'alice@example.com', [
      { toType: 'SKILL', toCode: 'software-engineer', relation: 'HAS_SKILL' },
      { toType: 'SKILL', toCode: 'designer', relation: 'HAS_SKILL' },
    ])
  })

  test('creates sector edges for each interest provided (slugified)', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    const res = await POST(makePostRequest({ interests: ['Technology', 'Green Energy'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.interests).toBe(2)

    expect(mockCreateEdgesBatch).toHaveBeenCalledWith('USER', 'alice@example.com', [
      { toType: 'SECTOR', toCode: 'technology', relation: 'INTERESTED_IN' },
      { toType: 'SECTOR', toCode: 'green-energy', relation: 'INTERESTED_IN' },
    ])
  })

  test('creates country edges for each location provided', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    const res = await POST(makePostRequest({ locations: ['KE', 'DE'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.locations).toBe(2)

    expect(mockCreateEdgesBatch).toHaveBeenCalledWith('USER', 'alice@example.com', [
      { toType: 'COUNTRY', toCode: 'KE', relation: 'LOCATED_IN' },
      { toType: 'COUNTRY', toCode: 'DE', relation: 'LOCATED_IN' },
    ])
  })

  test('creates edges across all dimensions in a single request', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    const res = await POST(
      makePostRequest({
        languages: ['sw'],
        faith: ['christianity'],
        crafts: ['engineer'],
        interests: ['Tech'],
        locations: ['KE'],
      })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.created).toEqual({
      languages: 1,
      faith: 1,
      crafts: 1,
      interests: 1,
      locations: 1,
    })
    // 5 batch calls (one per dimension)
    expect(mockCreateEdgesBatch).toHaveBeenCalledTimes(5)
  })

  test('caps arrays at 20 items per dimension', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    // 25 languages provided — only first 20 should be processed
    const tooMany = Array.from({ length: 25 }, (_, i) => `lang-${i}`)
    const res = await POST(makePostRequest({ languages: tooMany }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.languages).toBe(20)
    // Language batch should have exactly 20 items
    const langCall = mockCreateEdgesBatch.mock.calls.find(
      (call) => call[2].length > 0 && call[2][0].toType === 'LANGUAGE'
    )
    expect(langCall?.[2]).toHaveLength(20)
  })

  test('ignores non-string items in dimension arrays', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    const res = await POST(
      makePostRequest({
        languages: ['sw', 42, null, true, 'en'],
      })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    // Only 'sw' and 'en' are strings
    expect(data.created.languages).toBe(2)
    expect(mockCreateEdgesBatch).toHaveBeenCalledWith('USER', 'alice@example.com', [
      { toType: 'LANGUAGE', toCode: 'sw', relation: 'SPEAKS' },
      { toType: 'LANGUAGE', toCode: 'en', relation: 'SPEAKS' },
    ])
  })

  test('treats missing dimension as empty (no edges created for it)', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    // Only languages provided — other dimensions missing
    const res = await POST(makePostRequest({ languages: ['sw'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.faith).toBe(0)
    expect(data.created.crafts).toBe(0)
    expect(data.created.interests).toBe(0)
    expect(data.created.locations).toBe(0)
    expect(data.created.languages).toBe(1)
  })

  test('treats non-array dimension values as empty', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    // languages is a string instead of array
    const res = await POST(makePostRequest({ languages: 'sw' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.languages).toBe(0)
  })

  test('returns 200 with all-zero counts for empty request body', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )

    const res = await POST(makePostRequest({}))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.created).toEqual({
      languages: 0,
      faith: 0,
      crafts: 0,
      interests: 0,
      locations: 0,
    })
  })

  test('uses user email as node code when session email is available', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1', email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )

    await POST(makePostRequest({ languages: ['sw'] }))

    // All batch calls should use email as the userCode
    for (const call of mockCreateEdgesBatch.mock.calls) {
      expect(call[0]).toBe('USER')
      expect(call[1]).toBe('alice@example.com')
    }
  })

  test('falls back to userId as node code when session has no email', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', name: 'Alice', email: undefined },
      expires: '2099-01-01',
    } as unknown as Awaited<ReturnType<typeof getServerSession>>)

    await POST(makePostRequest({ languages: ['sw'] }))

    // All batch calls should use user ID as fallback
    for (const call of mockCreateEdgesBatch.mock.calls) {
      expect(call[0]).toBe('USER')
      expect(call[1]).toBe('user-1')
    }
  })

  test('returns 500 when createEdgesBatch throws an error', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    mockCreateEdgesBatch.mockRejectedValue(new Error('DB connection failed'))

    const res = await POST(makePostRequest({ languages: ['sw'] }))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/Failed to save dimensions/)
  })

  test('returns count from createEdgesBatch (may differ from input if nodes missing)', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ email: 'alice@example.com' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )
    // Simulate: batch receives 2 edges but only 1 target node exists
    mockCreateEdgesBatch.mockImplementation(async (_fromType, _fromCode, edges) => {
      if (edges.length > 0 && edges[0].toType === 'LANGUAGE') return 1
      return edges.length
    })

    const res = await POST(makePostRequest({ languages: ['sw', 'en'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.created.languages).toBe(1)
  })
})

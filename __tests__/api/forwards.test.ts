/**
 * Unit tests for the Forwards API route (/api/forwards)
 *
 * Since Next.js route handlers require the NextRequest/NextResponse
 * runtime, we test the exported POST and GET handlers directly
 * by constructing mock requests.
 */

import { POST, GET } from '@/app/api/forwards/route'
import { NextRequest } from 'next/server'

// Helper to create a mock NextRequest for POST
function createPostRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/forwards', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

// Helper to create a mock NextRequest for GET
function createGetRequest(params?: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/forwards')
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return new NextRequest(url.toString(), { method: 'GET' })
}

describe('POST /api/forwards', () => {
  it('returns 400 when agentId is missing', async () => {
    const req = createPostRequest({ pathId: 'p1' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('returns 400 when pathId is missing', async () => {
    const req = createPostRequest({ agentId: 'agent-001' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('returns 400 when body is empty', async () => {
    const req = createPostRequest({})
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 201 with valid agentId and pathId', async () => {
    const req = createPostRequest({ agentId: 'agent-test-001', pathId: 'p1' })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.forward).toBeDefined()
    expect(body.forward.trackingCode).toBeDefined()
    expect(body.forward.status).toBe('SENT')
  })

  it('tracking code starts with "trk_"', async () => {
    const req = createPostRequest({ agentId: 'agent-test-002', pathId: 'p2' })
    const res = await POST(req)
    const body = await res.json()
    expect(body.forward.trackingCode).toMatch(/^trk_/)
  })

  it('tracking code has sufficient length (at least 16 chars)', async () => {
    const req = createPostRequest({ agentId: 'agent-test-003', pathId: 'p3' })
    const res = await POST(req)
    const body = await res.json()
    // "trk_" (4) + 12 alphanumeric chars = 16
    expect(body.forward.trackingCode.length).toBeGreaterThanOrEqual(16)
  })

  it('returns a tracking link in the response', async () => {
    const req = createPostRequest({ agentId: 'agent-test-004', pathId: 'p4' })
    const res = await POST(req)
    const body = await res.json()
    expect(body.forward.trackingLink).toBeDefined()
    expect(body.forward.trackingLink).toContain('p4')
    expect(body.forward.trackingLink).toContain('ref=')
  })
})

describe('GET /api/forwards', () => {
  it('returns 400 when agentId query parameter is missing', async () => {
    const req = createGetRequest()
    const res = await GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('returns forwards array for a valid agentId', async () => {
    const req = createGetRequest({ agentId: 'agent-dk-001' })
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.forwards)).toBe(true)
    expect(body.totalForwards).toBeDefined()
    expect(body.statusCounts).toBeDefined()
    expect(body.totalCommission).toBeDefined()
  })

  it('returns empty array for unknown agentId', async () => {
    const req = createGetRequest({ agentId: 'agent-unknown-999' })
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.forwards).toEqual([])
    expect(body.totalForwards).toBe(0)
  })

  it('statusCounts has all forward status types', async () => {
    const req = createGetRequest({ agentId: 'agent-dk-001' })
    const res = await GET(req)
    const body = await res.json()
    const expectedStatuses = ['SENT', 'CLICKED', 'SIGNED_UP', 'APPLIED', 'PLACED', 'EXPIRED']
    expectedStatuses.forEach((status) => {
      expect(body.statusCounts).toHaveProperty(status)
    })
  })
})

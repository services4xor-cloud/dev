/**
 * Tests for app/api/agent/chat/route.ts
 */
import { NextRequest } from 'next/server'

// Must mock before importing the route
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/rate-limit', () => ({ rateLimit: jest.fn().mockResolvedValue(true) }))

jest.mock('@/lib/ai', () => ({
  buildPersonaPrompt: jest.fn(),
  chatWithAgent: jest.fn(),
}))

jest.mock('@/lib/country-insights', () => ({
  getCountryInsights: jest.fn(async (code: string) => ({ code, name: `Country ${code}` })),
}))

jest.mock('@/lib/db', () => ({
  db: {
    agentChat: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    node: { findUnique: jest.fn(), findMany: jest.fn() },
    edge: { findMany: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}))

// Mocking @anthropic-ai/sdk (pulled in by @/lib/ai transitively)
jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn(), stream: jest.fn() },
  })),
}))

import { POST } from '@/app/api/agent/chat/route'
import { getServerSession } from 'next-auth'
import { buildPersonaPrompt, chatWithAgent } from '@/lib/ai'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockBuildPersonaPrompt = buildPersonaPrompt as jest.MockedFunction<typeof buildPersonaPrompt>
const mockChatWithAgent = chatWithAgent as jest.MockedFunction<typeof chatWithAgent>

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/agent/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    require('@/lib/db').db.node.findMany.mockResolvedValue([])
  })

  test('returns 401 when no session', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const req = makeRequest({ message: 'Hello' })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const text = await res.text()
    expect(text).toBe('Unauthorized')
  })

  test('returns 401 when session has no user', async () => {
    mockGetServerSession.mockResolvedValue({ expires: '2099-01-01' } as unknown as Awaited<
      ReturnType<typeof getServerSession>
    >)

    const req = makeRequest({ message: 'Hello' })
    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  test('returns 401 when session user has no id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'Alice', email: 'alice@example.com' },
      expires: '2099-01-01',
    })

    const req = makeRequest({ message: 'Hello' })
    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  test('returns response for authenticated user', async () => {
    const { db } = require('@/lib/db')

    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
      expires: '2099-01-01',
    })

    mockBuildPersonaPrompt.mockReturnValue('You are a Be[X] agent...')
    mockChatWithAgent.mockResolvedValue('Hello from Kenya!')

    db.agentChat.create.mockResolvedValue({ id: 'chat-new-1' })

    const req = makeRequest({
      countries: ['KE'],
      message: 'Tell me about Kenya',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/plain')

    const body = await res.text()
    expect(body).toBe('Hello from Kenya!')

    expect(mockBuildPersonaPrompt).toHaveBeenCalledWith({
      countries: [{ code: 'KE', name: 'Country KE' }],
      selected: [],
      catalog: [],
    })
    expect(mockChatWithAgent).toHaveBeenCalledWith(
      'You are a Be[X] agent...',
      expect.arrayContaining([{ role: 'user', content: 'Tell me about Kenya' }])
    )
  })

  test('loads existing conversation and verifies ownership', async () => {
    const { db } = require('@/lib/db')

    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
      expires: '2099-01-01',
    })

    mockBuildPersonaPrompt.mockReturnValue('System prompt')
    mockChatWithAgent.mockResolvedValue('New reply')

    const existingHistory = [
      { role: 'user', content: 'Previous message' },
      { role: 'assistant', content: 'Previous reply' },
    ]
    db.agentChat.findUnique.mockResolvedValue({
      id: 'chat-existing',
      userId: 'user-1',
      messages: existingHistory,
    })
    db.agentChat.update.mockResolvedValue({ id: 'chat-existing' })

    const req = makeRequest({
      countries: ['KE'],
      message: 'Follow-up question',
      conversationId: 'chat-existing',
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    expect(db.agentChat.findUnique).toHaveBeenCalledWith({ where: { id: 'chat-existing' } })
    expect(mockChatWithAgent).toHaveBeenCalledWith(
      'System prompt',
      expect.arrayContaining([
        { role: 'user', content: 'Previous message' },
        { role: 'assistant', content: 'Previous reply' },
        { role: 'user', content: 'Follow-up question' },
      ])
    )
  })

  test('returns 403 when accessing another users conversation', async () => {
    const { db } = require('@/lib/db')

    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
      expires: '2099-01-01',
    })

    db.agentChat.findUnique.mockResolvedValue({
      id: 'chat-other',
      userId: 'user-999',
      messages: [],
    })

    const req = makeRequest({
      countries: ['KE'],
      message: 'Sneaky',
      conversationId: 'chat-other',
    })

    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  test('passes only published selected opportunities to the prompt', async () => {
    const { db } = require('@/lib/db')
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1' },
      expires: '2099-01-01',
    })
    mockBuildPersonaPrompt.mockReturnValue('prompt')
    mockChatWithAgent.mockResolvedValue('ok')
    db.agentChat.create.mockResolvedValue({ id: 'c1' })
    db.node.findMany.mockResolvedValue([
      {
        id: 'o1',
        label: 'Safari',
        properties: { kind: 'JOURNEY', status: 'PUBLISHED', price: 100, currency: 'EUR' },
        inEdges: [{ from: { label: 'BeKenya' } }],
      },
      {
        id: 'o2',
        label: 'Draft',
        properties: { kind: 'JOURNEY', status: 'IN_REVIEW' },
        inEdges: [],
      },
    ])

    const res = await POST(
      makeRequest({
        message: 'Is this good for a family?',
        opportunityIds: ['o1', 'o2', 42],
      })
    )
    expect(res.status).toBe(200)
    const arg = mockBuildPersonaPrompt.mock.calls.at(-1)?.[0]
    expect(arg?.selected?.map((o) => o.id)).toEqual(['o1'])
    expect(arg?.catalog?.map((o) => o.label)).toEqual(['Safari'])
  })

  test('keeps only known country codes, at most 3', async () => {
    const { db } = require('@/lib/db')
    const { getCountryInsights } = require('@/lib/country-insights')
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' }, expires: '2099-01-01' })
    mockBuildPersonaPrompt.mockReturnValue('prompt')
    mockChatWithAgent.mockResolvedValue('ok')
    db.node.findMany.mockResolvedValue([])
    db.agentChat.create.mockResolvedValue({ id: 'c1' })
    const res = await POST(
      makeRequest({ countries: ['ke', 'XX', 'DE', 'CH', 'GB', 7], message: 'Compare' })
    )
    expect(res.status).toBe(200)
    expect(getCountryInsights.mock.calls.map((c: string[]) => c[0])).toEqual(['KE', 'DE', 'CH'])
  })

  test('returns 400 without a message', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' }, expires: '2099-01-01' })
    const res = await POST(makeRequest({ countries: ['KE'] }))
    expect(res.status).toBe(400)
  })

  test('returns 429 when the daily agent limit is reached', async () => {
    const { rateLimit } = require('@/lib/rate-limit')
    rateLimit.mockResolvedValueOnce(false)
    mockGetServerSession.mockResolvedValue({ user: { id: 'user-1' }, expires: '2099-01-01' })
    const res = await POST(makeRequest({ message: 'hi' }))
    expect(res.status).toBe(429)
  })
})

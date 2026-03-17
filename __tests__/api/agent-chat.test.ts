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

jest.mock('@/lib/ai', () => ({
  buildPersonaPrompt: jest.fn(),
  chatWithAgent: jest.fn(),
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
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 when no session', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const req = makeRequest({ dimensions: {}, message: 'Hello' })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const text = await res.text()
    expect(text).toBe('Unauthorized')
  })

  test('returns 401 when session has no user', async () => {
    mockGetServerSession.mockResolvedValue({ expires: '2099-01-01' } as unknown as Awaited<
      ReturnType<typeof getServerSession>
    >)

    const req = makeRequest({ dimensions: {}, message: 'Hello' })
    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  test('returns 401 when session user has no id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'Alice', email: 'alice@example.com' },
      expires: '2099-01-01',
    })

    const req = makeRequest({ dimensions: {}, message: 'Hello' })
    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  test('returns response for authenticated user', async () => {
    const { db } = require('@/lib/db')

    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
      expires: '2099-01-01',
    })

    mockBuildPersonaPrompt.mockResolvedValue('You are a Be[X] agent...')
    mockChatWithAgent.mockResolvedValue('Hello from Kenya!')

    db.agentChat.create.mockResolvedValue({ id: 'chat-new-1' })

    const req = makeRequest({
      dimensions: { country: 'KE' },
      message: 'Tell me about Kenya',
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/plain')

    const body = await res.text()
    expect(body).toBe('Hello from Kenya!')

    expect(mockBuildPersonaPrompt).toHaveBeenCalledWith({ country: 'KE' }, undefined)
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

    mockBuildPersonaPrompt.mockResolvedValue('System prompt')
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
      dimensions: { country: 'KE' },
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
      dimensions: { country: 'KE' },
      message: 'Sneaky',
      conversationId: 'chat-other',
    })

    const res = await POST(req)
    expect(res.status).toBe(403)
  })
})

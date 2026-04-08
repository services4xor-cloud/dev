/**
 * Tests for messages API routes:
 *   app/api/messages/route.ts        (GET, POST)
 *   app/api/messages/[id]/route.ts   (GET)
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
    conversation: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    message: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((fn: (tx: unknown) => Promise<unknown>) => fn(dbObj)),
  }
  return { db: dbObj }
})

jest.mock('@/lib/notifications', () => ({
  notify: jest.fn().mockResolvedValue(undefined),
}))

// ---- Imports ----

import { GET as getConversations, POST as postMessage } from '@/app/api/messages/route'
import { GET as getConversation } from '@/app/api/messages/[id]/route'
import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'user-1', name: 'Alice Explorer', email: 'alice@example.com', ...overrides },
    expires: '2099-01-01',
  }
}

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeGetConversationRequest(conversationId: string): NextRequest {
  return new NextRequest(`http://localhost/api/messages/${conversationId}`)
}

// ---- Shared mock data ----

const mockParticipant = { id: 'user-2', name: 'Bob Host', image: null }

const mockMessage = {
  id: 'msg-1',
  conversationId: 'conv-1',
  senderId: 'user-2',
  content: 'Hello!',
  read: false,
  createdAt: new Date('2026-01-01T10:00:00Z'),
}

const mockConversation = {
  id: 'conv-1',
  participants: [{ id: 'user-1', name: 'Alice Explorer', image: null }, mockParticipant],
  messages: [mockMessage],
  lastMessageAt: new Date('2026-01-01T10:00:00Z'),
}

// ============================================================
// GET /api/messages
// ============================================================

describe('GET /api/messages', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await getConversations()
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 401 when session has no user id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'No ID' },
      expires: '2099-01-01',
    } as unknown as Awaited<ReturnType<typeof getServerSession>>)
    const res = await getConversations()
    expect(res.status).toBe(401)
  })

  test('returns conversations for authenticated user', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().conversation.findMany.mockResolvedValue([mockConversation])

    const res = await getConversations()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(1)
    expect(data[0].id).toBe('conv-1')
    expect(data[0].participants).toHaveLength(2)
    expect(data[0].lastMessage).not.toBeNull()
  })

  test('returns empty array when user has no conversations', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().conversation.findMany.mockResolvedValue([])

    const res = await getConversations()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual([])
  })

  test('returns null lastMessage when conversation has no messages', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const convWithNoMessages = { ...mockConversation, messages: [] }
    getDb().conversation.findMany.mockResolvedValue([convWithNoMessages])

    const res = await getConversations()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data[0].lastMessage).toBeNull()
  })

  test('queries conversations filtered to current user as participant', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-42' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().conversation.findMany.mockResolvedValue([])

    await getConversations()

    expect(getDb().conversation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { participants: { some: { id: 'user-42' } } },
      })
    )
  })

  test('returns conversations ordered by lastMessageAt descending', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().conversation.findMany.mockResolvedValue([mockConversation])

    await getConversations()

    expect(getDb().conversation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { lastMessageAt: 'desc' },
      })
    )
  })
})

// ============================================================
// POST /api/messages
// ============================================================

describe('POST /api/messages', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await postMessage(makePostRequest({ recipientId: 'user-2', content: 'Hi!' }))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 400 for invalid JSON body', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const req = new NextRequest('http://localhost/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-valid-json',
    })
    const res = await postMessage(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid JSON')
  })

  test('returns 400 when recipientId is missing', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await postMessage(makePostRequest({ content: 'Hello!' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/recipientId/)
  })

  test('returns 400 when content is missing', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await postMessage(makePostRequest({ recipientId: 'user-2' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/content/)
  })

  test('returns 400 when content is whitespace-only', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await postMessage(makePostRequest({ recipientId: 'user-2', content: '   ' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/content/)
  })

  test('returns 400 when content exceeds 2000 characters', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await postMessage(
      makePostRequest({ recipientId: 'user-2', content: 'A'.repeat(2001) })
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/2000/)
  })

  test('returns 400 when sending message to yourself', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await postMessage(makePostRequest({ recipientId: 'user-1', content: 'Hi me!' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/yourself/)
  })

  test('returns 404 when recipient does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().user.findUnique.mockResolvedValue(null)

    const res = await postMessage(makePostRequest({ recipientId: 'ghost-user', content: 'Hello!' }))
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/Recipient not found/)
  })

  test('creates message in existing conversation and returns 201', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.user.findUnique.mockResolvedValue({ id: 'user-2' })
    db.conversation.findFirst.mockResolvedValue({ id: 'conv-1' })
    db.message.create.mockResolvedValue({
      ...mockMessage,
      senderId: 'user-1',
      content: 'Hello!',
    })
    db.conversation.update.mockResolvedValue({})

    const res = await postMessage(makePostRequest({ recipientId: 'user-2', content: 'Hello!' }))
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.conversationId).toBe('conv-1')
    expect(data.message).toBeDefined()

    // Should NOT have created a new conversation
    expect(db.conversation.create).not.toHaveBeenCalled()
  })

  test('creates new conversation when none exists and returns 201', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.user.findUnique.mockResolvedValue({ id: 'user-2' })
    db.conversation.findFirst.mockResolvedValue(null)
    db.conversation.create.mockResolvedValue({ id: 'conv-new' })
    db.message.create.mockResolvedValue({
      ...mockMessage,
      conversationId: 'conv-new',
      senderId: 'user-1',
    })
    db.conversation.update.mockResolvedValue({})

    const res = await postMessage(makePostRequest({ recipientId: 'user-2', content: 'Hello!' }))
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.conversationId).toBe('conv-new')

    expect(db.conversation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          participants: { connect: [{ id: 'user-1' }, { id: 'user-2' }] },
        }),
      })
    )
  })

  test('trims content whitespace before saving', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.user.findUnique.mockResolvedValue({ id: 'user-2' })
    db.conversation.findFirst.mockResolvedValue({ id: 'conv-1' })
    db.message.create.mockResolvedValue({ ...mockMessage, content: 'Hello!' })
    db.conversation.update.mockResolvedValue({})

    await postMessage(makePostRequest({ recipientId: 'user-2', content: '  Hello!  ' }))

    expect(db.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ content: 'Hello!' }),
      })
    )
  })

  test('updates lastMessageAt on existing conversation after sending', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.user.findUnique.mockResolvedValue({ id: 'user-2' })
    db.conversation.findFirst.mockResolvedValue({ id: 'conv-1' })
    db.message.create.mockResolvedValue({ ...mockMessage })
    db.conversation.update.mockResolvedValue({})

    await postMessage(makePostRequest({ recipientId: 'user-2', content: 'Hi!' }))

    expect(db.conversation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'conv-1' },
        data: expect.objectContaining({ lastMessageAt: expect.any(Date) }),
      })
    )
  })
})

// ============================================================
// GET /api/messages/[id]
// ============================================================

describe('GET /api/messages/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  function makeParams(id: string) {
    return { params: { id } }
  }

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await getConversation(makeGetConversationRequest('conv-1'), makeParams('conv-1'))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('returns 401 when session has no user id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'No ID' },
      expires: '2099-01-01',
    } as unknown as Awaited<ReturnType<typeof getServerSession>>)
    const res = await getConversation(makeGetConversationRequest('conv-1'), makeParams('conv-1'))
    expect(res.status).toBe(401)
  })

  test('returns 404 when conversation does not exist or user is not a participant', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().conversation.findFirst.mockResolvedValue(null)

    const res = await getConversation(
      makeGetConversationRequest('conv-missing'),
      makeParams('conv-missing')
    )
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/Conversation not found/)
  })

  test('returns messages for valid conversation', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const conversationWithMessages = {
      ...mockConversation,
      messages: [
        {
          ...mockMessage,
          sender: { id: 'user-2', name: 'Bob Host', image: null },
        },
      ],
    }
    getDb().conversation.findFirst.mockResolvedValue(conversationWithMessages)
    getDb().message.updateMany.mockResolvedValue({ count: 1 })

    const res = await getConversation(makeGetConversationRequest('conv-1'), makeParams('conv-1'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe('conv-1')
    expect(data.participants).toHaveLength(2)
    expect(data.messages).toHaveLength(1)
    expect(data.messages[0].sender).toBeDefined()
  })

  test('marks unread messages from others as read', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.conversation.findFirst.mockResolvedValue({
      ...mockConversation,
      messages: [{ ...mockMessage, sender: { id: 'user-2', name: 'Bob', image: null } }],
    })
    db.message.updateMany.mockResolvedValue({ count: 1 })

    await getConversation(makeGetConversationRequest('conv-1'), makeParams('conv-1'))

    expect(db.message.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          conversationId: 'conv-1',
          senderId: { not: 'user-1' },
          read: false,
        }),
        data: { read: true },
      })
    )
  })

  test('queries conversation filtered to current user as participant', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-42' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const db = getDb()
    db.conversation.findFirst.mockResolvedValue({
      ...mockConversation,
      messages: [],
    })
    db.message.updateMany.mockResolvedValue({ count: 0 })

    await getConversation(makeGetConversationRequest('conv-1'), makeParams('conv-1'))

    expect(db.conversation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'conv-1',
          participants: { some: { id: 'user-42' } },
        },
      })
    )
  })

  test('loads the 200 most recent messages and returns them chronologically', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    // Prisma fetches newest-first (desc) with take: 200; the route reverses
    // the result so callers still see messages oldest-first for display.
    const m1 = { ...mockMessage, id: 'msg-old', createdAt: new Date('2026-01-01T09:00:00Z') }
    const m2 = { ...mockMessage, id: 'msg-new', createdAt: new Date('2026-01-01T10:00:00Z') }
    getDb().conversation.findFirst.mockResolvedValue({
      ...mockConversation,
      messages: [m2, m1],
    })
    getDb().message.updateMany.mockResolvedValue({ count: 0 })

    const res = await getConversation(makeGetConversationRequest('conv-1'), makeParams('conv-1'))
    const data = await res.json()

    expect(getDb().conversation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          messages: expect.objectContaining({
            orderBy: { createdAt: 'desc' },
            take: 200,
          }),
        }),
      })
    )

    expect(data.messages.map((m: { id: string }) => m.id)).toEqual(['msg-old', 'msg-new'])
  })
})

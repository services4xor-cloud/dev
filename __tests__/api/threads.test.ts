/**
 * Tests for community threads API routes:
 *   app/api/threads/route.ts            (GET, POST)
 *   app/api/threads/[id]/route.ts       (GET)
 *   app/api/threads/[id]/posts/route.ts (POST)
 */
import { NextRequest } from 'next/server'

// ---- Mocks (must come before route imports) ----

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/db', () => ({
  db: {
    thread: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    threadPost: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    node: {
      findUnique: jest.fn(),
    },
  },
}))

// ---- Imports ----

import { GET as getThreads, POST as createThread } from '@/app/api/threads/route'
import { GET as getThread } from '@/app/api/threads/[id]/route'
import { POST as createPost } from '@/app/api/threads/[id]/posts/route'
import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: {
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'EXPLORER',
      ...overrides,
    },
    expires: '2099-01-01',
  }
}

function makeGetRequest(url: string): NextRequest {
  return new NextRequest(url)
}

function makePostRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ---- Shared mock data ----

const mockNode = {
  id: 'node-1',
  type: 'COUNTRY',
  code: 'KE',
  label: 'Kenya',
  icon: '🇰🇪',
}

const mockThread = {
  id: 'thread-1',
  nodeId: 'node-1',
  title: 'Kenya Community',
  description: 'Discussions for Kenya',
  node: mockNode,
  _count: { posts: 3 },
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const mockPost = {
  id: 'post-1',
  threadId: 'thread-1',
  authorId: 'user-1',
  content: 'Hello from Kenya!',
  author: { id: 'user-1', name: 'Alice', image: null },
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

// ============================================================
// GET /api/threads
// ============================================================

describe('GET /api/threads', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns threads', async () => {
    getDb().thread.findMany.mockResolvedValue([mockThread])

    const res = await getThreads(makeGetRequest('http://localhost/api/threads'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.threads).toHaveLength(1)
    expect(data.threads[0].id).toBe('thread-1')
  })

  test('returns empty array when no threads', async () => {
    getDb().thread.findMany.mockResolvedValue([])

    const res = await getThreads(makeGetRequest('http://localhost/api/threads'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.threads).toEqual([])
  })

  test('filters by type when ?type= param is provided', async () => {
    getDb().thread.findMany.mockResolvedValue([mockThread])

    const res = await getThreads(makeGetRequest('http://localhost/api/threads?type=COUNTRY'))
    expect(res.status).toBe(200)

    expect(getDb().thread.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { node: { type: 'COUNTRY' } },
      })
    )
  })

  test('queries all threads when no type filter', async () => {
    getDb().thread.findMany.mockResolvedValue([])

    await getThreads(makeGetRequest('http://localhost/api/threads'))

    expect(getDb().thread.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: undefined,
      })
    )
  })
})

// ============================================================
// POST /api/threads
// ============================================================

describe('POST /api/threads', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await createThread(
      makePostRequest('http://localhost/api/threads', { nodeId: 'node-1', title: 'Test' })
    )
    expect(res.status).toBe(401)
  })

  test('returns 403 when user is EXPLORER', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'EXPLORER' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createThread(
      makePostRequest('http://localhost/api/threads', { nodeId: 'node-1', title: 'Test' })
    )
    expect(res.status).toBe(403)
  })

  test('returns 201 when user is HOST', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'HOST' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().node.findUnique.mockResolvedValue(mockNode)
    getDb().thread.create.mockResolvedValue(mockThread)

    const res = await createThread(
      makePostRequest('http://localhost/api/threads', {
        nodeId: 'node-1',
        title: 'Kenya Community',
      })
    )
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toBe('thread-1')
  })

  test('returns 201 when user is ADMIN', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'ADMIN' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().node.findUnique.mockResolvedValue(mockNode)
    getDb().thread.create.mockResolvedValue(mockThread)

    const res = await createThread(
      makePostRequest('http://localhost/api/threads', {
        nodeId: 'node-1',
        title: 'Kenya Community',
      })
    )
    expect(res.status).toBe(201)
  })

  test('returns 400 when nodeId is missing', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'ADMIN' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createThread(
      makePostRequest('http://localhost/api/threads', { title: 'Test' })
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/nodeId/)
  })

  test('returns 400 when title is missing', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'ADMIN' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createThread(
      makePostRequest('http://localhost/api/threads', { nodeId: 'node-1' })
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/title/)
  })

  test('returns 404 when node does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ role: 'ADMIN' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().node.findUnique.mockResolvedValue(null)

    const res = await createThread(
      makePostRequest('http://localhost/api/threads', { nodeId: 'ghost-node', title: 'Test' })
    )
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/Node not found/)
  })
})

// ============================================================
// GET /api/threads/[id]
// ============================================================

describe('GET /api/threads/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  function makeParams(id: string) {
    return { params: { id } }
  }

  test('returns thread with posts', async () => {
    const threadWithPosts = { ...mockThread, posts: [mockPost] }
    getDb().thread.findUnique.mockResolvedValue(threadWithPosts)

    const res = await getThread(
      makeGetRequest('http://localhost/api/threads/thread-1'),
      makeParams('thread-1')
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe('thread-1')
    expect(data.posts).toHaveLength(1)
    expect(data.posts[0].author).toBeDefined()
  })

  test('returns 404 when thread does not exist', async () => {
    getDb().thread.findUnique.mockResolvedValue(null)

    const res = await getThread(
      makeGetRequest('http://localhost/api/threads/ghost'),
      makeParams('ghost')
    )
    expect(res.status).toBe(404)
  })

  test('passes limit and offset to query', async () => {
    getDb().thread.findUnique.mockResolvedValue({ ...mockThread, posts: [] })

    await getThread(
      makeGetRequest('http://localhost/api/threads/thread-1?limit=10&offset=20'),
      makeParams('thread-1')
    )

    expect(getDb().thread.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          posts: expect.objectContaining({
            skip: 20,
            take: 10,
          }),
        }),
      })
    )
  })

  test('defaults to limit=20 and offset=0', async () => {
    getDb().thread.findUnique.mockResolvedValue({ ...mockThread, posts: [] })

    await getThread(makeGetRequest('http://localhost/api/threads/thread-1'), makeParams('thread-1'))

    expect(getDb().thread.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          posts: expect.objectContaining({
            skip: 0,
            take: 20,
          }),
        }),
      })
    )
  })
})

// ============================================================
// POST /api/threads/[id]/posts
// ============================================================

describe('POST /api/threads/[id]/posts', () => {
  beforeEach(() => jest.clearAllMocks())

  function makeParams(id: string) {
    return { params: { id } }
  }

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await createPost(
      makePostRequest('http://localhost/api/threads/thread-1/posts', { content: 'Hello!' }),
      makeParams('thread-1')
    )
    expect(res.status).toBe(401)
  })

  test('returns 201 and creates post when authenticated', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().thread.findUnique.mockResolvedValue(mockThread)
    getDb().threadPost.create.mockResolvedValue(mockPost)

    const res = await createPost(
      makePostRequest('http://localhost/api/threads/thread-1/posts', {
        content: 'Hello from Kenya!',
      }),
      makeParams('thread-1')
    )
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toBe('post-1')
    expect(data.content).toBe('Hello from Kenya!')
  })

  test('returns 400 when content is missing', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createPost(
      makePostRequest('http://localhost/api/threads/thread-1/posts', {}),
      makeParams('thread-1')
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/content/)
  })

  test('returns 400 when content is whitespace-only', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createPost(
      makePostRequest('http://localhost/api/threads/thread-1/posts', { content: '   ' }),
      makeParams('thread-1')
    )
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/content/)
  })

  test('returns 404 when thread does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().thread.findUnique.mockResolvedValue(null)

    const res = await createPost(
      makePostRequest('http://localhost/api/threads/ghost/posts', { content: 'Hello!' }),
      makeParams('ghost')
    )
    expect(res.status).toBe(404)
  })

  test('trims content whitespace before saving', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-1' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().thread.findUnique.mockResolvedValue(mockThread)
    getDb().threadPost.create.mockResolvedValue(mockPost)

    await createPost(
      makePostRequest('http://localhost/api/threads/thread-1/posts', { content: '  Hello!  ' }),
      makeParams('thread-1')
    )

    expect(getDb().threadPost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ content: 'Hello!' }),
      })
    )
  })

  test('associates post with correct threadId and authorId', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-42' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().thread.findUnique.mockResolvedValue(mockThread)
    getDb().threadPost.create.mockResolvedValue(mockPost)

    await createPost(
      makePostRequest('http://localhost/api/threads/thread-1/posts', { content: 'My post' }),
      makeParams('thread-1')
    )

    expect(getDb().threadPost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          threadId: 'thread-1',
          authorId: 'user-42',
        }),
      })
    )
  })
})

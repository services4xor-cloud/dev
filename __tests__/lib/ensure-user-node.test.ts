/**
 * Tests for ensureUserNode in lib/graph.ts
 */
jest.mock('@/lib/db', () => ({
  db: {
    node: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}))

import { db } from '@/lib/db'
import { ensureUserNode } from '@/lib/graph'

const node = db.node as unknown as Record<'findUnique' | 'create' | 'update', jest.Mock>
const user = db.user as unknown as Record<'findUnique', jest.Mock>

beforeEach(() => {
  jest.clearAllMocks()
  user.findUnique.mockResolvedValue({ email: 'a@x.com', name: 'Ana' })
  node.create.mockImplementation(({ data }) => Promise.resolve({ id: 'new', ...data }))
  node.update.mockImplementation(({ data }) => Promise.resolve({ id: 'old', ...data }))
})

describe('ensureUserNode', () => {
  it('returns the linked node when there is one', async () => {
    node.findUnique.mockResolvedValueOnce({ id: 'n1', userId: 'u1' })
    expect(await ensureUserNode('u1')).toEqual({ id: 'n1', userId: 'u1' })
    expect(node.create).not.toHaveBeenCalled()
  })

  it('creates a node for an account that has none', async () => {
    node.findUnique.mockResolvedValue(null)
    const created = await ensureUserNode('u1')
    expect(created).toMatchObject({ type: 'USER', code: 'a@x.com', userId: 'u1', label: 'Ana' })
  })

  it('adopts an unlinked node with the same email', async () => {
    node.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'old', userId: null })
    await ensureUserNode('u1')
    expect(node.update).toHaveBeenCalledWith({ where: { id: 'old' }, data: { userId: 'u1' } })
  })

  it('falls back to the user id when the email code belongs to someone else', async () => {
    node.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'other', userId: 'u2' })
    const created = await ensureUserNode('u1')
    expect(created).toMatchObject({ code: 'user:u1', userId: 'u1' })
  })

  it('returns null for an unknown user', async () => {
    node.findUnique.mockResolvedValue(null)
    user.findUnique.mockResolvedValue(null)
    expect(await ensureUserNode('nope')).toBeNull()
  })
})

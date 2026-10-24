/**
 * Tests for app/api/opportunities/[id]/contact/route.ts
 */
import { NextRequest } from 'next/server'

jest.mock('next-auth', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  actionEmail: jest.fn().mockReturnValue('<p/>'),
}))
jest.mock('@/lib/rate-limit', () => ({ rateLimit: jest.fn().mockResolvedValue(true) }))
jest.mock('@/lib/db', () => ({
  db: {
    node: { findUnique: jest.fn() },
    user: { findUnique: jest.fn(), findMany: jest.fn() },
  },
}))

import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { POST } from '@/app/api/opportunities/[id]/contact/route'

const session = getServerSession as jest.Mock
const node = db.node as unknown as Record<string, jest.Mock>
const user = db.user as unknown as Record<string, jest.Mock>
const params = { params: { id: 'opp-1' } }
const post = (body: unknown) =>
  POST(
    new NextRequest('http://localhost/x', { method: 'POST', body: JSON.stringify(body) }),
    params
  )

function listing(props: Record<string, unknown>, hostEmail: string | null = null) {
  return {
    id: 'opp-1',
    type: 'EXPERIENCE',
    label: 'Studio',
    active: true,
    properties: { kind: 'SERVICE', status: 'PUBLISHED', ...props },
    inEdges: [{ from: { label: 'Host', user: hostEmail ? { email: hostEmail } : null } }],
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  session.mockResolvedValue({ user: { id: 'u1' } })
  user.findUnique.mockResolvedValue({ name: 'Ana', email: 'ana@x.com' })
  user.findMany.mockResolvedValue([{ email: 'admin@4xor.com' }])
})

describe('POST /api/opportunities/[id]/contact', () => {
  it('requires sign-in and a message', async () => {
    session.mockResolvedValueOnce(null)
    expect((await post({ message: 'Hello there' })).status).toBe(401)
    expect((await post({ message: 'hi' })).status).toBe(400)
  })

  it('refuses unpublished listings', async () => {
    node.findUnique.mockResolvedValue(listing({ status: 'IN_REVIEW' }))
    expect((await post({ message: 'Hello there' })).status).toBe(404)
  })

  it('sends to the contact email with the visitor as reply-to', async () => {
    node.findUnique.mockResolvedValue(listing({ contactEmail: 'sales@4xor.com' }, 'host@x.com'))
    expect((await post({ message: 'Hello there' })).status).toBe(200)
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['sales@4xor.com'], replyTo: 'ana@x.com' })
    )
  })

  it('falls back to the host, then to the admins', async () => {
    node.findUnique.mockResolvedValue(listing({}, 'host@x.com'))
    await post({ message: 'Hello there' })
    expect((sendEmail as jest.Mock).mock.calls[0][0].to).toEqual(['host@x.com'])

    node.findUnique.mockResolvedValue(listing({}))
    await post({ message: 'Hello there' })
    expect((sendEmail as jest.Mock).mock.calls[1][0].to).toEqual(['admin@4xor.com'])
  })
})

/**
 * Tests for app/api/admin/ai-check/route.ts (GET)
 */
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))
jest.mock('@/lib/ai', () => ({ AGENT_MODEL: 'test-model' }))

const list = jest.fn()
const create = jest.fn()
jest.mock('@/lib/anthropic-client', () => ({
  awsWebIdentityToken: jest.fn(async () => 'x'.repeat(40)),
  createAnthropicClient: () => ({ models: { list }, messages: { create } }),
}))

import { GET } from '@/app/api/admin/ai-check/route'
import { getServerSession } from 'next-auth'

const mockSession = getServerSession as jest.Mock

describe('GET /api/admin/ai-check', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ANTHROPIC_FEDERATION_RULE_ID = 'fdrl_x'
    process.env.ANTHROPIC_ORGANIZATION_ID = 'org'
  })

  it('is admin only', async () => {
    mockSession.mockResolvedValue(null)
    expect((await GET()).status).toBe(401)
    mockSession.mockResolvedValue({ user: { role: 'EXPLORER' } })
    expect((await GET()).status).toBe(403)
  })

  it('reports each step and the reason a step fails', async () => {
    mockSession.mockResolvedValue({ user: { role: 'ADMIN' } })
    list.mockResolvedValue({ data: [{ id: 'm' }] })
    const err = Object.assign(new Error('Your credit balance is too low'), {
      name: 'BadRequestError',
      status: 400,
    })
    create.mockRejectedValue(err)
    const body = await (await GET()).json()
    expect(body.credential).toBe('workload-identity-federation')
    expect(body.awsToken).toEqual({ ok: true, detail: 'token issued (40 chars)' })
    expect(body.anthropicAuth.ok).toBe(true)
    expect(body.anthropicRequest).toEqual({
      ok: false,
      detail: 'BadRequestError 400: Your credit balance is too low',
    })
    expect(JSON.stringify(body)).not.toContain('xxxx')
  })
})

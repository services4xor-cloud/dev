/**
 * Unit tests for Forward tracking logic
 *
 * Tests the tracking code generation and forward schema validation
 * without importing the Next.js route handler (which pulls in ESM dependencies).
 */

import { z } from 'zod'

// Mirror the Zod schema from the route
const createForwardSchema = z.object({
  agentId: z.string().min(1),
  pathId: z.string().min(1),
  workerName: z.string().optional(),
  workerPhone: z.string().optional(),
  workerEmail: z.string().email().optional(),
  channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL', 'IN_PERSON', 'SOCIAL_MEDIA']).optional(),
})

// Mirror tracking code generation
function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = 'trk_'
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

describe('Forward Schema Validation', () => {
  it('rejects when agentId is missing', () => {
    const result = createForwardSchema.safeParse({ pathId: 'p1' })
    expect(result.success).toBe(false)
  })

  it('rejects when pathId is missing', () => {
    const result = createForwardSchema.safeParse({ agentId: 'agent-001' })
    expect(result.success).toBe(false)
  })

  it('rejects when body is empty', () => {
    const result = createForwardSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('accepts valid agentId and pathId', () => {
    const result = createForwardSchema.safeParse({ agentId: 'agent-001', pathId: 'p1' })
    expect(result.success).toBe(true)
  })

  it('accepts optional worker fields', () => {
    const result = createForwardSchema.safeParse({
      agentId: 'agent-001',
      pathId: 'p1',
      workerName: 'Jane Kamau',
      workerPhone: '+254712345678',
      workerEmail: 'jane@example.com',
      channel: 'WHATSAPP',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid channel value', () => {
    const result = createForwardSchema.safeParse({
      agentId: 'agent-001',
      pathId: 'p1',
      channel: 'TELEGRAM',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = createForwardSchema.safeParse({
      agentId: 'agent-001',
      pathId: 'p1',
      workerEmail: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })
})

describe('Tracking Code Generation', () => {
  it('starts with "trk_"', () => {
    const code = generateTrackingCode()
    expect(code).toMatch(/^trk_/)
  })

  it('has total length of 16 characters', () => {
    const code = generateTrackingCode()
    expect(code.length).toBe(16) // "trk_" (4) + 12 chars
  })

  it('generates unique codes', () => {
    const codes = new Set<string>()
    for (let i = 0; i < 100; i++) {
      codes.add(generateTrackingCode())
    }
    // With 62^12 possibilities, 100 codes should all be unique
    expect(codes.size).toBe(100)
  })

  it('only contains alphanumeric characters after prefix', () => {
    const code = generateTrackingCode()
    const suffix = code.slice(4)
    expect(suffix).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('generates tracking link correctly', () => {
    const code = generateTrackingCode()
    const pathId = 'p-test-123'
    const link = `/ventures/${pathId}?ref=${code}`
    expect(link).toContain(pathId)
    expect(link).toContain('ref=trk_')
  })
})

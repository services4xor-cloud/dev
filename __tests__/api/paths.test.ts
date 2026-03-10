/**
 * Unit tests for Paths API validation
 */
import { z } from 'zod'

const createPathSchema = z.object({
  title: z.string().min(3).max(100),
  company: z.string().min(2).max(100),
  description: z.string().min(50),
  location: z.string().min(2),
  isRemote: z.boolean().default(false),
  pathType: z.enum(['FULL_PATH', 'PART_PATH', 'SEASONAL', 'CONTRACT', 'REMOTE']),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().length(3).default('KES'),
  skills: z.array(z.string()).min(1).max(20),
  country: z.string().default('KE'),
  tier: z.enum(['BASIC', 'FEATURED', 'PREMIUM']).default('BASIC'),
})

describe('Path creation schema', () => {
  const validPath = {
    title: 'Software Engineer',
    company: 'Safaricom',
    description:
      'We are looking for a skilled software engineer to join our team and build amazing products for millions of Kenyans.',
    location: 'Nairobi',
    isRemote: true,
    pathType: 'FULL_PATH' as const,
    skills: ['TypeScript', 'React', 'Node.js'],
    salaryMin: 100000,
    salaryMax: 200000,
    currency: 'KES',
    country: 'KE',
    tier: 'BASIC' as const,
  }

  it('accepts a valid Path', () => {
    const result = createPathSchema.safeParse(validPath)
    expect(result.success).toBe(true)
  })

  it('rejects Path with title too short', () => {
    const result = createPathSchema.safeParse({ ...validPath, title: 'AB' })
    expect(result.success).toBe(false)
  })

  it('rejects Path with description too short', () => {
    const result = createPathSchema.safeParse({ ...validPath, description: 'Too short' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid path type', () => {
    const result = createPathSchema.safeParse({ ...validPath, pathType: 'INVALID' })
    expect(result.success).toBe(false)
  })

  it('rejects Path with no skills', () => {
    const result = createPathSchema.safeParse({ ...validPath, skills: [] })
    expect(result.success).toBe(false)
  })

  it('defaults currency to KES', () => {
    const { currency, ...withoutCurrency } = validPath
    const result = createPathSchema.safeParse(withoutCurrency)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.currency).toBe('KES')
  })
})

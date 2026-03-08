/**
 * Unit tests for Jobs API validation
 */
import { z } from 'zod'

const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  company: z.string().min(2).max(100),
  description: z.string().min(50),
  location: z.string().min(2),
  isRemote: z.boolean().default(false),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERNSHIP']),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().length(3).default('KES'),
  skills: z.array(z.string()).min(1).max(20),
  country: z.string().default('Kenya'),
  tier: z.enum(['BASIC', 'FEATURED', 'PREMIUM']).default('BASIC'),
})

describe('Job creation schema', () => {
  const validJob = {
    title: 'Software Engineer',
    company: 'Safaricom',
    description: 'We are looking for a skilled software engineer to join our team and build amazing products for millions of Kenyans.',
    location: 'Nairobi',
    isRemote: true,
    jobType: 'FULL_TIME' as const,
    skills: ['TypeScript', 'React', 'Node.js'],
    salaryMin: 100000,
    salaryMax: 200000,
    currency: 'KES',
    country: 'Kenya',
    tier: 'BASIC' as const,
  }

  it('accepts a valid job', () => {
    const result = createJobSchema.safeParse(validJob)
    expect(result.success).toBe(true)
  })

  it('rejects job with title too short', () => {
    const result = createJobSchema.safeParse({ ...validJob, title: 'AB' })
    expect(result.success).toBe(false)
  })

  it('rejects job with description too short', () => {
    const result = createJobSchema.safeParse({ ...validJob, description: 'Too short' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid job type', () => {
    const result = createJobSchema.safeParse({ ...validJob, jobType: 'INVALID' })
    expect(result.success).toBe(false)
  })

  it('rejects job with no skills', () => {
    const result = createJobSchema.safeParse({ ...validJob, skills: [] })
    expect(result.success).toBe(false)
  })

  it('defaults currency to KES', () => {
    const { currency, ...withoutCurrency } = validJob
    const result = createJobSchema.safeParse(withoutCurrency)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.currency).toBe('KES')
  })
})

/**
 * Unit tests for Profile API validation
 */
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(9).max(20).optional(),
  bio: z.string().max(500).optional(),
  headline: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).max(30).optional(),
})

describe('Profile update schema', () => {
  it('accepts a full valid profile update', () => {
    const result = profileSchema.safeParse({
      name: 'Alice Wanjiku',
      phone: '+254712345678',
      bio: 'Software engineer passionate about impact technology in East Africa.',
      headline: 'Senior Engineer @ Safaricom',
      city: 'Nairobi',
      country: 'Kenya',
      linkedin: 'https://linkedin.com/in/alice-wanjiku',
      skills: ['TypeScript', 'React', 'Python'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty object (all fields optional)', () => {
    const result = profileSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts partial updates', () => {
    const result = profileSchema.safeParse({ name: 'Bob', city: 'Berlin' })
    expect(result.success).toBe(true)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = profileSchema.safeParse({ name: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects name longer than 100 characters', () => {
    const result = profileSchema.safeParse({ name: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects phone shorter than 9 characters', () => {
    const result = profileSchema.safeParse({ phone: '12345678' })
    expect(result.success).toBe(false)
  })

  it('accepts phone at exactly 9 characters', () => {
    const result = profileSchema.safeParse({ phone: '123456789' })
    expect(result.success).toBe(true)
  })

  it('rejects bio longer than 500 characters', () => {
    const result = profileSchema.safeParse({ bio: 'X'.repeat(501) })
    expect(result.success).toBe(false)
  })

  it('accepts bio at exactly 500 characters', () => {
    const result = profileSchema.safeParse({ bio: 'X'.repeat(500) })
    expect(result.success).toBe(true)
  })

  it('rejects invalid linkedin URL', () => {
    const result = profileSchema.safeParse({ linkedin: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('accepts empty string for linkedin', () => {
    const result = profileSchema.safeParse({ linkedin: '' })
    expect(result.success).toBe(true)
  })

  it('accepts valid linkedin URL', () => {
    const result = profileSchema.safeParse({ linkedin: 'https://linkedin.com/in/testuser' })
    expect(result.success).toBe(true)
  })

  it('rejects more than 30 skills', () => {
    const skills = Array.from({ length: 31 }, (_, i) => `Skill ${i}`)
    const result = profileSchema.safeParse({ skills })
    expect(result.success).toBe(false)
  })

  it('accepts 30 skills', () => {
    const skills = Array.from({ length: 30 }, (_, i) => `Skill ${i}`)
    const result = profileSchema.safeParse({ skills })
    expect(result.success).toBe(true)
  })
})

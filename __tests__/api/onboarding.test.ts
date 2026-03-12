/**
 * Unit tests for Onboarding API validation
 */
import { z } from 'zod'

const OnboardingSchema = z.object({
  pioneerType: z.enum(['explorer', 'professional', 'artisan', 'guardian', 'creator', 'healer'], {
    errorMap: () => ({ message: 'Please select a valid Pioneer type' }),
  }),
  fromCountry: z.string().min(2, 'Origin country is required').max(10),
  toCountries: z.array(z.string().min(2).max(10)).min(1, 'Select at least one destination').max(8),
  skills: z.array(z.string().min(1).max(100)).min(3, 'Select at least 3 skills').max(50),
  headline: z.string().min(5, 'Headline must be at least 5 characters').max(200),
  bio: z.string().max(1000).optional().default(''),
  phone: z
    .string()
    .max(20)
    .optional()
    .transform((val) => {
      if (!val) return undefined
      const cleaned = val.replace(/[^\d+]/g, '')
      return cleaned.length >= 7 ? cleaned : undefined
    }),
})

describe('Onboarding schema', () => {
  const validOnboarding = {
    pioneerType: 'explorer' as const,
    fromCountry: 'KE',
    toCountries: ['DE', 'GB'],
    skills: ['JavaScript', 'React', 'Node.js'],
    headline: 'Software Engineer seeking global opportunities',
    bio: 'Passionate developer with 5 years experience.',
  }

  it('accepts a valid onboarding payload', () => {
    const result = OnboardingSchema.safeParse(validOnboarding)
    expect(result.success).toBe(true)
  })

  it('accepts all 6 pioneer types', () => {
    const types = ['explorer', 'professional', 'artisan', 'guardian', 'creator', 'healer'] as const
    for (const type of types) {
      const result = OnboardingSchema.safeParse({ ...validOnboarding, pioneerType: type })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid pioneer type', () => {
    const result = OnboardingSchema.safeParse({ ...validOnboarding, pioneerType: 'warrior' })
    expect(result.success).toBe(false)
  })

  it('rejects missing origin country', () => {
    const { fromCountry, ...without } = validOnboarding
    void fromCountry
    const result = OnboardingSchema.safeParse(without)
    expect(result.success).toBe(false)
  })

  it('rejects empty toCountries array', () => {
    const result = OnboardingSchema.safeParse({ ...validOnboarding, toCountries: [] })
    expect(result.success).toBe(false)
  })

  it('rejects more than 8 destination countries', () => {
    const result = OnboardingSchema.safeParse({
      ...validOnboarding,
      toCountries: ['DE', 'GB', 'US', 'CA', 'AU', 'FR', 'IT', 'ES', 'JP'],
    })
    expect(result.success).toBe(false)
  })

  it('accepts exactly 8 destination countries', () => {
    const result = OnboardingSchema.safeParse({
      ...validOnboarding,
      toCountries: ['DE', 'GB', 'US', 'CA', 'AU', 'FR', 'IT', 'ES'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects fewer than 3 skills', () => {
    const result = OnboardingSchema.safeParse({
      ...validOnboarding,
      skills: ['JavaScript', 'React'],
    })
    expect(result.success).toBe(false)
  })

  it('rejects more than 50 skills', () => {
    const skills = Array.from({ length: 51 }, (_, i) => `Skill${i}`)
    const result = OnboardingSchema.safeParse({ ...validOnboarding, skills })
    expect(result.success).toBe(false)
  })

  it('rejects headline shorter than 5 characters', () => {
    const result = OnboardingSchema.safeParse({ ...validOnboarding, headline: 'Hi' })
    expect(result.success).toBe(false)
  })

  it('rejects headline longer than 200 characters', () => {
    const result = OnboardingSchema.safeParse({
      ...validOnboarding,
      headline: 'X'.repeat(201),
    })
    expect(result.success).toBe(false)
  })

  it('defaults bio to empty string when not provided', () => {
    const { bio, ...withoutBio } = validOnboarding
    void bio
    const result = OnboardingSchema.safeParse(withoutBio)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.bio).toBe('')
    }
  })

  it('rejects bio longer than 1000 characters', () => {
    const result = OnboardingSchema.safeParse({
      ...validOnboarding,
      bio: 'X'.repeat(1001),
    })
    expect(result.success).toBe(false)
  })

  it('normalizes phone number by stripping non-digit chars', () => {
    const result = OnboardingSchema.safeParse({
      ...validOnboarding,
      phone: '+254 (712) 345-678',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phone).toBe('+254712345678')
    }
  })

  it('returns undefined for short phone number', () => {
    const result = OnboardingSchema.safeParse({
      ...validOnboarding,
      phone: '12345',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phone).toBeUndefined()
    }
  })
})

/**
 * Unit tests for Registration API validation
 */
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address').max(320),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  country: z.string().max(10).optional(),
  role: z.enum(['PIONEER', 'ANCHOR']).optional(),
  phone: z.string().max(20).optional(),
})

describe('Registration schema', () => {
  const validRegistration = {
    name: 'Alice Wanjiku',
    email: 'alice@example.com',
    password: 'SecurePass123!',
    country: 'KE',
    role: 'PIONEER' as const,
  }

  it('accepts a valid registration', () => {
    const result = registerSchema.safeParse(validRegistration)
    expect(result.success).toBe(true)
  })

  it('accepts registration with only required fields', () => {
    const result = registerSchema.safeParse({
      name: 'Bob',
      email: 'bob@test.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const { name, ...without } = validRegistration
    void name
    const result = registerSchema.safeParse(without)
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = registerSchema.safeParse({ ...validRegistration, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...validRegistration, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('rejects short password (< 8 chars)', () => {
    const result = registerSchema.safeParse({ ...validRegistration, password: '1234567' })
    expect(result.success).toBe(false)
  })

  it('accepts password at exactly 8 characters', () => {
    const result = registerSchema.safeParse({ ...validRegistration, password: '12345678' })
    expect(result.success).toBe(true)
  })

  it('rejects password exceeding 128 characters', () => {
    const result = registerSchema.safeParse({ ...validRegistration, password: 'X'.repeat(129) })
    expect(result.success).toBe(false)
  })

  it('accepts ANCHOR role', () => {
    const result = registerSchema.safeParse({ ...validRegistration, role: 'ANCHOR' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid role', () => {
    const result = registerSchema.safeParse({ ...validRegistration, role: 'ADMIN' })
    expect(result.success).toBe(false)
  })

  it('accepts optional phone', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      phone: '+254712345678',
    })
    expect(result.success).toBe(true)
  })
})

/**
 * Unit tests for Contact API validation
 */
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address').max(320),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
  country: z.string().max(10).optional(),
})

describe('Contact form schema', () => {
  const validContact = {
    name: 'Alice Wanjiku',
    email: 'alice@example.com',
    subject: 'Partnership inquiry',
    message: 'I would like to discuss a partnership opportunity with BeKenya.',
    country: 'KE',
  }

  it('accepts a valid contact submission', () => {
    const result = contactSchema.safeParse(validContact)
    expect(result.success).toBe(true)
  })

  it('accepts minimal required fields only', () => {
    const result = contactSchema.safeParse({
      name: 'Bob',
      email: 'bob@test.com',
      message: 'Hello',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = contactSchema.safeParse({
      email: 'alice@example.com',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name')
    }
  })

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({
      name: '',
      email: 'alice@example.com',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Alice',
      email: 'not-an-email',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('rejects missing message', () => {
    const result = contactSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty message', () => {
    const result = contactSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      message: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name exceeding 200 characters', () => {
    const result = contactSchema.safeParse({
      name: 'A'.repeat(201),
      email: 'alice@example.com',
      message: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('rejects message exceeding 5000 characters', () => {
    const result = contactSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'X'.repeat(5001),
    })
    expect(result.success).toBe(false)
  })

  it('accepts message at exactly 5000 characters', () => {
    const result = contactSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'X'.repeat(5000),
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional country field', () => {
    const result = contactSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello',
      country: 'DE',
    })
    expect(result.success).toBe(true)
  })
})

describe('HTML escaping', () => {
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('escapes ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  it('escapes quotes', () => {
    expect(escapeHtml('He said "hello"')).toBe('He said &quot;hello&quot;')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#039;s')
  })

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('handles string with no special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })
})

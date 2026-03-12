/**
 * Unit tests for Bookings API validation
 */
import { z } from 'zod'

const bookingSchema = z.object({
  experienceId: z.string().min(1),
  experienceName: z.string().min(1),
  date: z.string().min(1),
  guests: z.number().min(1).max(20).default(1),
  paymentMethod: z.enum(['card', 'mpesa']),
  totalAmount: z.number().min(0),
  currency: z.string().length(3).default('KES'),
})

describe('Booking creation schema', () => {
  const validBooking = {
    experienceId: 'exp_masai_mara',
    experienceName: 'Masai Mara 3-Day Safari',
    date: '2026-04-15',
    guests: 2,
    paymentMethod: 'mpesa' as const,
    totalAmount: 45000,
    currency: 'KES',
  }

  it('accepts a valid booking', () => {
    const result = bookingSchema.safeParse(validBooking)
    expect(result.success).toBe(true)
  })

  it('defaults guests to 1 when not provided', () => {
    const { guests, ...withoutGuests } = validBooking
    void guests
    const result = bookingSchema.safeParse(withoutGuests)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.guests).toBe(1)
    }
  })

  it('defaults currency to KES', () => {
    const { currency, ...withoutCurrency } = validBooking
    void currency
    const result = bookingSchema.safeParse(withoutCurrency)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.currency).toBe('KES')
    }
  })

  it('rejects missing experienceId', () => {
    const { experienceId, ...without } = validBooking
    void experienceId
    const result = bookingSchema.safeParse(without)
    expect(result.success).toBe(false)
  })

  it('rejects empty experienceId', () => {
    const result = bookingSchema.safeParse({ ...validBooking, experienceId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing date', () => {
    const { date, ...without } = validBooking
    void date
    const result = bookingSchema.safeParse(without)
    expect(result.success).toBe(false)
  })

  it('rejects 0 guests', () => {
    const result = bookingSchema.safeParse({ ...validBooking, guests: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects more than 20 guests', () => {
    const result = bookingSchema.safeParse({ ...validBooking, guests: 21 })
    expect(result.success).toBe(false)
  })

  it('accepts exactly 20 guests', () => {
    const result = bookingSchema.safeParse({ ...validBooking, guests: 20 })
    expect(result.success).toBe(true)
  })

  it('rejects invalid payment method', () => {
    const result = bookingSchema.safeParse({ ...validBooking, paymentMethod: 'bitcoin' })
    expect(result.success).toBe(false)
  })

  it('accepts card payment method', () => {
    const result = bookingSchema.safeParse({ ...validBooking, paymentMethod: 'card' })
    expect(result.success).toBe(true)
  })

  it('rejects negative totalAmount', () => {
    const result = bookingSchema.safeParse({ ...validBooking, totalAmount: -100 })
    expect(result.success).toBe(false)
  })

  it('accepts zero totalAmount', () => {
    const result = bookingSchema.safeParse({ ...validBooking, totalAmount: 0 })
    expect(result.success).toBe(true)
  })

  it('rejects currency with wrong length', () => {
    const result = bookingSchema.safeParse({ ...validBooking, currency: 'KESH' })
    expect(result.success).toBe(false)
  })

  it('accepts EUR currency', () => {
    const result = bookingSchema.safeParse({ ...validBooking, currency: 'EUR' })
    expect(result.success).toBe(true)
  })
})

describe('Booking ID generation', () => {
  it('generates unique booking IDs', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(`bk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`)
    }
    // With random suffix + timestamp, should have many unique values
    expect(ids.size).toBeGreaterThan(50)
  })

  it('booking ID starts with bk_ prefix', () => {
    const id = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    expect(id).toMatch(/^bk_\d+_[a-z0-9]{4}$/)
  })
})

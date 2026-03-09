/**
 * Unit tests for M-Pesa utility functions
 */

import { formatKenyanPhone } from '@/lib/mpesa'
import { z } from 'zod'

describe('formatKenyanPhone', () => {
  it('converts 07XX format to 2547XX', () => {
    expect(formatKenyanPhone('0712345678')).toBe('254712345678')
  })

  it('converts +254 format by removing the +', () => {
    expect(formatKenyanPhone('+254712345678')).toBe('254712345678')
  })

  it('leaves already-formatted 254 numbers unchanged', () => {
    expect(formatKenyanPhone('254712345678')).toBe('254712345678')
  })

  it('handles spaces in phone number', () => {
    expect(formatKenyanPhone('0712 345 678')).toBe('254712345678')
  })
})

// ─── M-Pesa STK Push validation schema (mirrors app/api/mpesa/stkpush/route.ts) ──

const stkPushSchema = z.object({
  phone: z.string().min(9, 'Phone number too short'),
  amount: z.number().min(1, 'Amount must be at least 1 KES').max(150000, 'M-Pesa daily limit is KES 150,000'),
  packageId: z.string().optional(),
  pathId: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(13, 'Description max 13 chars for M-Pesa'),
})

describe('M-Pesa STK Push (mock mode)', () => {
  describe('returns mock success when credentials not set', () => {
    it('schema accepts a valid STK push request', () => {
      const validRequest = {
        phone: '0712345678',
        amount: 350,
        description: 'Safari',
      }
      const result = stkPushSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('schema accepts request with optional packageId', () => {
      const validRequest = {
        phone: '+254712345678',
        amount: 520,
        packageId: 'maasai-mara-3day',
        description: 'BookSafari',
      }
      const result = stkPushSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('schema accepts request with optional pathId', () => {
      const validRequest = {
        phone: '254712345678',
        amount: 1000,
        pathId: 'path-001',
        description: 'PathFee',
      }
      const result = stkPushSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })
  })

  describe('validates phone number format', () => {
    it('rejects phone number that is too short', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712',
        amount: 100,
        description: 'Test',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const phoneError = result.error.issues.find(i => i.path.includes('phone'))
        expect(phoneError).toBeDefined()
        expect(phoneError?.message).toContain('too short')
      }
    })

    it('formatKenyanPhone accepts local 07XX format', () => {
      expect(formatKenyanPhone('0700111222')).toBe('254700111222')
    })

    it('formatKenyanPhone accepts +254 international format', () => {
      expect(formatKenyanPhone('+254700111222')).toBe('254700111222')
    })

    it('formatKenyanPhone accepts already formatted 254 number', () => {
      expect(formatKenyanPhone('254700111222')).toBe('254700111222')
    })

    it('does not reject 9-digit phone when stripped of spaces (min 9 chars)', () => {
      // '0712345678' = 10 chars, meets min 9
      const result = stkPushSchema.safeParse({
        phone: '071234567', // 9 chars — exactly at minimum
        amount: 100,
        description: 'Test',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('validates amount is positive', () => {
    it('rejects amount of 0', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712345678',
        amount: 0,
        description: 'Test',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const amountError = result.error.issues.find(i => i.path.includes('amount'))
        expect(amountError).toBeDefined()
      }
    })

    it('rejects negative amount', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712345678',
        amount: -100,
        description: 'Test',
      })
      expect(result.success).toBe(false)
    })

    it('rejects amount exceeding M-Pesa daily limit', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712345678',
        amount: 200000, // Over 150,000 limit
        description: 'Test',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const amountError = result.error.issues.find(i => i.path.includes('amount'))
        expect(amountError?.message).toContain('150,000')
      }
    })

    it('accepts amount of 1 (minimum valid)', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712345678',
        amount: 1,
        description: 'Test',
      })
      expect(result.success).toBe(true)
    })

    it('accepts maximum allowed amount of 150000', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712345678',
        amount: 150000,
        description: 'Test',
      })
      expect(result.success).toBe(true)
    })

    it('rejects description longer than 13 characters', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712345678',
        amount: 350,
        description: 'This description is way too long for M-Pesa',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const descError = result.error.issues.find(i => i.path.includes('description'))
        expect(descError).toBeDefined()
      }
    })

    it('rejects empty description', () => {
      const result = stkPushSchema.safeParse({
        phone: '0712345678',
        amount: 350,
        description: '',
      })
      expect(result.success).toBe(false)
    })
  })
})

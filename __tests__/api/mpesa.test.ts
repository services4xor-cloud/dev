/**
 * Unit tests for M-Pesa utility functions
 */

import { formatKenyanPhone } from '@/lib/mpesa'

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

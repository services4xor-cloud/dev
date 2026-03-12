/**
 * Payments Tests
 *
 * Validates:
 *   - Payment plug registry returns correct plugs per country
 *   - Plug interface compliance
 *   - Amount formatting
 *   - Mock payment initiation returns expected structure
 */

import {
  getPaymentPlug,
  getPaymentPlugs,
  getCurrentPaymentPlug,
  formatPayment,
} from '@/lib/payments'

describe('Payments — getPaymentPlug', () => {
  it('returns M-Pesa plug for KE', () => {
    const plug = getPaymentPlug('KE')
    expect(plug.id).toBe('mpesa')
    expect(plug.name).toBe('M-Pesa')
    expect(plug.identifierType).toBe('phone')
  })

  it('returns SEPA plug for DE', () => {
    const plug = getPaymentPlug('DE')
    expect(plug.id).toBe('sepa')
    expect(plug.identifierType).toBe('account')
  })

  it('returns Stripe plug for US', () => {
    const plug = getPaymentPlug('US')
    expect(plug.id).toBe('stripe')
    expect(plug.identifierType).toBe('email')
  })

  it('returns Flutterwave plug for NG', () => {
    const plug = getPaymentPlug('NG')
    expect(plug.id).toBe('flutterwave')
  })

  it('defaults to Stripe for unknown country', () => {
    const plug = getPaymentPlug('XX')
    expect(plug.id).toBe('stripe')
  })

  it('handles case insensitivity', () => {
    expect(getPaymentPlug('ke').id).toBe('mpesa')
  })
})

describe('Payments — getPaymentPlugs', () => {
  it('returns multiple plugs for KE (M-Pesa + Stripe)', () => {
    const plugs = getPaymentPlugs('KE')
    expect(plugs.length).toBe(2)
    const ids = plugs.map((p) => p.id)
    expect(ids).toContain('mpesa')
    expect(ids).toContain('stripe')
  })

  it('returns default [stripe] for unknown country', () => {
    const plugs = getPaymentPlugs('XX')
    expect(plugs).toHaveLength(1)
    expect(plugs[0].id).toBe('stripe')
  })
})

describe('Payments — plug interface', () => {
  it('every plug has required properties', () => {
    const countries = ['KE', 'DE', 'US', 'NG']
    for (const cc of countries) {
      const plug = getPaymentPlug(cc)
      expect(plug.id).toBeTruthy()
      expect(plug.name).toBeTruthy()
      expect(plug.currencies.length).toBeGreaterThan(0)
      expect(plug.identifierType).toMatch(/^(phone|email|account)$/)
      expect(plug.identifierLabel).toBeTruthy()
      expect(plug.identifierPlaceholder).toBeTruthy()
      expect(typeof plug.initiate).toBe('function')
      expect(typeof plug.checkStatus).toBe('function')
      expect(typeof plug.formatAmount).toBe('function')
    }
  })
})

describe('Payments — mock initiate', () => {
  it('M-Pesa initiate returns processing status', async () => {
    const plug = getPaymentPlug('KE')
    const result = await plug.initiate({
      amount: 5000,
      currency: 'KES',
      description: 'Test',
      reference: 'test-123',
      payerIdentifier: '0712345678',
    })
    expect(result.status).toBe('processing')
    expect(result.provider).toBe('M-Pesa')
    expect(result.transactionId).toMatch(/^MPESA-/)
  })

  it('Stripe initiate returns pending status', async () => {
    const plug = getPaymentPlug('US')
    const result = await plug.initiate({
      amount: 5000,
      currency: 'USD',
      description: 'Test',
      reference: 'test-123',
      payerIdentifier: 'test@test.com',
    })
    expect(result.status).toBe('pending')
    expect(result.provider).toBe('Stripe')
  })
})

describe('Payments — formatAmount', () => {
  it('M-Pesa formats as KES', () => {
    expect(getPaymentPlug('KE').formatAmount(5000)).toMatch(/KES/)
  })

  it('Stripe formats as $', () => {
    expect(getPaymentPlug('US').formatAmount(5000)).toMatch(/\$/)
  })

  it('SEPA formats as EUR', () => {
    expect(getPaymentPlug('DE').formatAmount(5000)).toMatch(/€/)
  })
})

describe('Payments — formatPayment convenience', () => {
  it('formats with explicit country', () => {
    expect(formatPayment(5000, 'KE')).toMatch(/KES/)
    expect(formatPayment(5000, 'DE')).toMatch(/€/)
  })
})

describe('Payments — getCurrentPaymentPlug', () => {
  it('returns a valid plug', () => {
    const plug = getCurrentPaymentPlug()
    expect(plug.id).toBeTruthy()
    expect(typeof plug.formatAmount).toBe('function')
  })
})

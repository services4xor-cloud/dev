/**
 * Pricing Data Tests
 *
 * Validates:
 *   - Plan prices are correctly structured for all currencies
 *   - formatPlanPrice() returns correct format (Free vs "€ 29/mo")
 *   - Commission rates are valid percentages
 *   - Free tier limits are sensible
 *   - Payment methods have required fields
 *   - All pricing plans have required fields
 *   - Currency conversions are defined for all supported currencies
 */

import {
  PRICING_PLANS,
  PAYMENT_METHODS,
  COMMISSION_RATES,
  FREE_TIER,
  CURRENCY_CONVERSIONS,
  COUNTRY_PAYMENT_METHODS,
  getPlanPrice,
  formatPlanPrice,
} from '@/data/mock/pricing'

describe('Pricing — Plans', () => {
  it('has exactly 3 pricing plans', () => {
    expect(PRICING_PLANS).toHaveLength(3)
  })

  it('plans are named Basic, Featured, Premium', () => {
    const names = PRICING_PLANS.map((p) => p.name)
    expect(names).toEqual(['Basic', 'Featured', 'Premium'])
  })

  it('Basic plan is free', () => {
    const basic = PRICING_PLANS[0]
    expect(basic.price).toBe(0)
    expect(basic.usd).toBe(0)
  })

  it('Featured plan is the most popular', () => {
    const featured = PRICING_PLANS[1]
    expect(featured.popular).toBe(true)
  })

  it('every plan has required fields', () => {
    for (const plan of PRICING_PLANS) {
      expect(plan.name).toBeTruthy()
      expect(plan.description).toBeTruthy()
      expect(plan.icon).toBeTruthy()
      expect(plan.cta).toBeTruthy()
      expect(plan.features.length).toBeGreaterThan(0)
      expect(typeof plan.price).toBe('number')
      expect(typeof plan.popular).toBe('boolean')
    }
  })

  it('plans have increasing prices', () => {
    const [basic, featured, premium] = PRICING_PLANS
    expect(basic.price).toBeLessThan(featured.price)
    expect(featured.price).toBeLessThan(premium.price)
  })

  it('plans have increasing feature counts', () => {
    const [basic, featured, premium] = PRICING_PLANS
    expect(basic.features.length).toBeLessThan(featured.features.length)
    expect(featured.features.length).toBeLessThanOrEqual(premium.features.length)
  })

  it('no plan features contain real company names', () => {
    const forbidden = ['Safaricom', 'SAP', 'Siemens', 'BMW', 'Novartis']
    for (const plan of PRICING_PLANS) {
      for (const feature of plan.features) {
        for (const name of forbidden) {
          expect(feature).not.toContain(name)
        }
      }
    }
  })
})

describe('Pricing — getPlanPrice()', () => {
  it('returns 0 for basic in all currencies', () => {
    expect(getPlanPrice('basic', 'KES')).toBe(0)
    expect(getPlanPrice('basic', 'EUR')).toBe(0)
    expect(getPlanPrice('basic', 'CHF')).toBe(0)
    expect(getPlanPrice('basic', 'THB')).toBe(0)
    expect(getPlanPrice('basic', 'USD')).toBe(0)
  })

  it('returns correct KES prices for paid plans', () => {
    expect(getPlanPrice('featured', 'KES')).toBe(2000)
    expect(getPlanPrice('premium', 'KES')).toBe(5000)
  })

  it('returns correct EUR prices', () => {
    expect(getPlanPrice('featured', 'EUR')).toBe(29)
    expect(getPlanPrice('premium', 'EUR')).toBe(99)
  })

  it('falls back to USD for unknown currency', () => {
    expect(getPlanPrice('featured', 'XYZ')).toBe(29)
    expect(getPlanPrice('premium', 'XYZ')).toBe(99)
  })
})

describe('Pricing — formatPlanPrice()', () => {
  it('returns "Free" for basic plan', () => {
    expect(formatPlanPrice('basic', 'KES')).toBe('Free')
    expect(formatPlanPrice('basic', 'EUR')).toBe('Free')
    expect(formatPlanPrice('basic', 'USD')).toBe('Free')
  })

  it('formats EUR price with symbol', () => {
    const result = formatPlanPrice('featured', 'EUR')
    expect(result).toContain('€')
    expect(result).toContain('29')
    expect(result).toContain('/mo')
  })

  it('formats CHF price with symbol', () => {
    const result = formatPlanPrice('featured', 'CHF')
    expect(result).toContain('CHF')
    expect(result).toContain('29')
  })

  it('formats KES price with symbol', () => {
    const result = formatPlanPrice('featured', 'KES')
    expect(result).toContain('KES')
    // toLocaleString format varies by environment (2,000 or 2.000)
    expect(result).toMatch(/2[,.]000/)
  })

  it('formats THB price with symbol', () => {
    const result = formatPlanPrice('featured', 'THB')
    expect(result).toContain('฿')
    expect(result).toContain('990')
  })
})

describe('Pricing — Commission Rates', () => {
  it('agent commission is 10%', () => {
    expect(COMMISSION_RATES.agent).toBe(0.1)
  })

  it('experience booking commission is 10%', () => {
    expect(COMMISSION_RATES.experienceBooking).toBe(0.1)
  })

  it('has impact donation for KE, DE, CH, TH', () => {
    expect(COMMISSION_RATES.impactDonation.KE).toBeDefined()
    expect(COMMISSION_RATES.impactDonation.DE).toBeDefined()
    expect(COMMISSION_RATES.impactDonation.CH).toBeDefined()
    expect(COMMISSION_RATES.impactDonation.TH).toBeDefined()
  })

  it('impact donations have amount, currency, and label', () => {
    for (const [, donation] of Object.entries(COMMISSION_RATES.impactDonation)) {
      expect(donation.amount).toBeGreaterThan(0)
      expect(donation.currency).toBeTruthy()
      expect(donation.label).toBeTruthy()
    }
  })
})

describe('Pricing — Free Tier', () => {
  it('allows 1 free path', () => {
    expect(FREE_TIER.maxPaths).toBe(1)
  })

  it('path duration is 30 days', () => {
    expect(FREE_TIER.pathDuration).toBe(30)
  })

  it('max chapters is 50', () => {
    expect(FREE_TIER.maxChapters).toBe(50)
  })
})

describe('Pricing — Payment Methods', () => {
  it('has at least 6 payment methods', () => {
    expect(PAYMENT_METHODS.length).toBeGreaterThanOrEqual(6)
  })

  it('includes M-Pesa for Kenya', () => {
    expect(PAYMENT_METHODS.find((m) => m.name === 'M-Pesa')).toBeDefined()
  })

  it('includes TWINT for Switzerland', () => {
    expect(PAYMENT_METHODS.find((m) => m.name === 'TWINT')).toBeDefined()
  })

  it('includes PromptPay for Thailand', () => {
    expect(PAYMENT_METHODS.find((m) => m.name === 'PromptPay')).toBeDefined()
  })

  it('every method has name, flag, and desc', () => {
    for (const method of PAYMENT_METHODS) {
      expect(method.name).toBeTruthy()
      expect(method.flag).toBeTruthy()
      expect(method.desc).toBeTruthy()
    }
  })
})

describe('Pricing — Currency Conversions', () => {
  it('has conversions for all 5 main currencies', () => {
    expect(CURRENCY_CONVERSIONS.KES).toBeDefined()
    expect(CURRENCY_CONVERSIONS.EUR).toBeDefined()
    expect(CURRENCY_CONVERSIONS.CHF).toBeDefined()
    expect(CURRENCY_CONVERSIONS.THB).toBeDefined()
    expect(CURRENCY_CONVERSIONS.USD).toBeDefined()
  })

  it('KES is base currency (rate = 1)', () => {
    expect(CURRENCY_CONVERSIONS.KES.rate).toBe(1)
  })

  it('every conversion has symbol, rate, and code', () => {
    for (const [code, conv] of Object.entries(CURRENCY_CONVERSIONS)) {
      expect(conv.symbol).toBeTruthy()
      expect(conv.rate).toBeGreaterThan(0)
      expect(conv.code).toBe(code)
    }
  })
})

describe('Pricing — Country Payment Methods', () => {
  it('Kenya uses M-Pesa', () => {
    expect(COUNTRY_PAYMENT_METHODS.KE).toContain('M-Pesa')
  })

  it('Germany uses Stripe', () => {
    expect(COUNTRY_PAYMENT_METHODS.DE).toContain('Stripe')
  })

  it('Switzerland uses TWINT', () => {
    expect(COUNTRY_PAYMENT_METHODS.CH).toContain('TWINT')
  })

  it('Thailand uses PromptPay', () => {
    expect(COUNTRY_PAYMENT_METHODS.TH).toContain('PromptPay')
  })
})

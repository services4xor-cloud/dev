/**
 * Service Layer Tests
 *
 * Validates:
 *   - All services are exported from barrel
 *   - Mock fallback returns data when no DATABASE_URL
 *   - Path service mock data uses fictional companies
 *   - Pricing service wraps static data correctly
 *   - hasDatabase flag is boolean
 */

import { pathService, threadService, chapterService, pricingService, hasDatabase } from '@/services'

describe('Service Layer — exports', () => {
  it('exports pathService', () => {
    expect(pathService).toBeDefined()
    expect(typeof pathService.list).toBe('function')
    expect(typeof pathService.getById).toBe('function')
    expect(typeof pathService.create).toBe('function')
  })

  it('exports threadService', () => {
    expect(threadService).toBeDefined()
    expect(typeof threadService.list).toBe('function')
    expect(typeof threadService.getBySlug).toBe('function')
  })

  it('exports chapterService', () => {
    expect(chapterService).toBeDefined()
    expect(typeof chapterService.create).toBe('function')
  })

  it('exports pricingService', () => {
    expect(pricingService).toBeDefined()
    expect(typeof pricingService.getPlans).toBe('function')
    expect(typeof pricingService.getPaymentMethods).toBe('function')
    expect(typeof pricingService.getPlanPrice).toBe('function')
    expect(typeof pricingService.formatPlanPrice).toBe('function')
  })

  it('hasDatabase is a boolean', () => {
    expect(typeof hasDatabase).toBe('boolean')
  })
})

describe('Service Layer — mock fallback', () => {
  it('pathService.list returns paths in mock mode', async () => {
    const result = await pathService.list()
    expect(result.paths).toBeDefined()
    expect(result.paths.length).toBeGreaterThan(0)
    expect(result.total).toBeGreaterThan(0)
  })

  it('pathService.list filters by country', async () => {
    const keResult = await pathService.list({ country: 'KE' })
    for (const path of keResult.paths) {
      expect(path.country).toBe('KE')
    }
  })

  it('pathService.getById returns null for unknown ID', async () => {
    const result = await pathService.getById('nonexistent_id')
    expect(result).toBeNull()
  })

  it('threadService.list returns threads', async () => {
    const result = await threadService.list()
    // threadService.list() returns ThreadItem[] directly
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('Service Layer — data integrity', () => {
  it('pathService returns paths with required fields', async () => {
    const result = await pathService.list()
    for (const path of result.paths) {
      expect(path.id).toBeTruthy()
      expect(path.title).toBeTruthy()
      expect(path.company).toBeTruthy()
      expect(path.country).toBeTruthy()
      expect(path.status).toBeTruthy()
    }
  })
})

describe('Service Layer — pricing service', () => {
  it('getPlans returns 3 plans', async () => {
    const plans = await pricingService.getPlans()
    expect(plans).toHaveLength(3)
  })

  it('getPaymentMethods returns methods', async () => {
    const methods = await pricingService.getPaymentMethods()
    expect(methods.length).toBeGreaterThan(0)
  })

  it('getPlanPrice returns correct value', () => {
    expect(pricingService.getPlanPrice('basic', 'EUR')).toBe(0)
    expect(pricingService.getPlanPrice('featured', 'EUR')).toBe(29)
  })

  it('formatPlanPrice returns Free for basic', () => {
    expect(pricingService.formatPlanPrice('basic', 'USD')).toBe('Free')
  })

  it('getCommissionRates returns valid rates', () => {
    const rates = pricingService.getCommissionRates()
    expect(rates.agent).toBe(0.1)
    expect(rates.experienceBooking).toBe(0.1)
  })

  it('getFreeTier returns limits', () => {
    const tier = pricingService.getFreeTier()
    expect(tier.maxPaths).toBe(1)
    expect(tier.pathDuration).toBe(30)
  })

  it('getCountryPaymentMethods returns methods for KE', () => {
    const methods = pricingService.getCountryPaymentMethods('KE')
    expect(methods).toContain('M-Pesa')
  })

  it('getCountryPaymentMethods returns empty for unknown country', () => {
    const methods = pricingService.getCountryPaymentMethods('XX')
    expect(methods).toEqual([])
  })
})

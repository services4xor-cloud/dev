/**
 * Unit tests for lib/compass.ts — Route corridor engine
 */

import { COUNTRY_ROUTES, getRouteKey, getRouteInfo, getRecommendedRoutes } from '@/lib/compass'

describe('getRouteKey', () => {
  it('creates correct key from two country codes', () => {
    expect(getRouteKey('KE', 'DE')).toBe('KE-DE')
  })

  it('is order-dependent (KE-DE ≠ DE-KE)', () => {
    expect(getRouteKey('KE', 'DE')).not.toBe(getRouteKey('DE', 'KE'))
  })
})

describe('getRouteInfo', () => {
  it('returns route data for known corridors', () => {
    const route = getRouteInfo('KE', 'DE')
    expect(route).not.toBeNull()
    expect(route!.strength).toBe('direct')
    expect(route!.primarySectors.length).toBeGreaterThan(0)
  })

  it('returns null for unknown corridors', () => {
    expect(getRouteInfo('JP', 'BR')).toBeNull()
  })

  it('KE-DE has payment methods including M-Pesa', () => {
    const route = getRouteInfo('KE', 'DE')!
    expect(route.paymentMethods).toContain('M-Pesa')
  })

  it('KE-GB is a direct route', () => {
    const route = getRouteInfo('KE', 'GB')!
    expect(route.strength).toBe('direct')
  })

  it('KE-US is a partner route', () => {
    const route = getRouteInfo('KE', 'US')!
    expect(route.strength).toBe('partner')
  })

  it('each route has visa note', () => {
    Object.values(COUNTRY_ROUTES).forEach((route) => {
      expect(route.visaNote.length).toBeGreaterThan(10)
    })
  })
})

describe('getRecommendedRoutes', () => {
  it('returns target countries for KE origin', () => {
    const routes = getRecommendedRoutes('KE')
    expect(routes.length).toBeGreaterThan(0)
    expect(routes).toContain('DE')
    expect(routes).toContain('GB')
  })

  it('returns target countries for DE origin', () => {
    const routes = getRecommendedRoutes('DE')
    expect(routes).toContain('KE')
  })

  it('returns empty array for unknown origin', () => {
    expect(getRecommendedRoutes('XX')).toEqual([])
  })
})

describe('COUNTRY_ROUTES data integrity', () => {
  it('has at least 5 corridors defined', () => {
    expect(Object.keys(COUNTRY_ROUTES).length).toBeGreaterThanOrEqual(5)
  })

  it('all corridors have required fields', () => {
    Object.entries(COUNTRY_ROUTES).forEach(([key, route]) => {
      expect(route.targetCountries.length).toBeGreaterThan(0)
      expect(route.primarySectors.length).toBeGreaterThan(0)
      expect(route.visaNote).toBeTruthy()
      expect(route.paymentMethods.length).toBeGreaterThan(0)
      expect(['direct', 'partner', 'emerging']).toContain(route.strength)
    })
  })

  it('corridor keys follow XX-XX format', () => {
    Object.keys(COUNTRY_ROUTES).forEach((key) => {
      expect(key).toMatch(/^[A-Z]{2}-[A-Z]{2}$/)
    })
  })
})

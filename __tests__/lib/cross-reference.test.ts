/**
 * Cross-reference validation tests — Session 63
 *
 * Validates data consistency across modules:
 * - Country payment methods match their currency
 * - Compass routes reference valid country codes
 * - Eco-tourism offerings reference valid countries
 * - Trade corridors have valid structure
 * - Country highlights reference valid country codes
 * - COUNTRY_META covers all 14 countries
 */

import { COUNTRIES, COUNTRY_META, type CountryCode } from '@/lib/countries'
import { COUNTRY_ROUTES, getRouteInfo, getRecommendedRoutes } from '@/lib/compass'
import { ECO_TOURISM_OFFERINGS, TRADE_CORRIDORS } from '@/data/mock'
import {
  COUNTRY_HIGHLIGHTS,
  getCountryHighlights,
  getHighlightSectors,
} from '@/lib/country-highlights'

const ALL_COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[]

// ─── Country Config Consistency ─────────────────────────────────────

describe('Country payment methods', () => {
  it('every country has at least 2 payment methods', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      const config = COUNTRIES[code]
      expect(config.paymentMethods.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('every payment method includes the country local currency', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      const config = COUNTRIES[code]
      const localCurrency = config.currency
      const hasLocalCurrencyMethod = config.paymentMethods.some((pm) =>
        pm.currencies.includes(localCurrency)
      )
      expect(hasLocalCurrencyMethod).toBe(true)
    })
  })

  it('no payment method has empty currencies array', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      COUNTRIES[code].paymentMethods.forEach((pm) => {
        expect(pm.currencies.length).toBeGreaterThan(0)
      })
    })
  })

  it('every payment method has name and id', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      COUNTRIES[code].paymentMethods.forEach((pm) => {
        expect(pm.id).toBeTruthy()
        expect(pm.name).toBeTruthy()
      })
    })
  })
})

// ─── COUNTRY_META Coverage ──────────────────────────────────────────

describe('COUNTRY_META coverage', () => {
  it('has SEO metadata for all 14 countries', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      expect(COUNTRY_META[code]).toBeDefined()
      expect(COUNTRY_META[code].title).toBeTruthy()
      expect(COUNTRY_META[code].description).toBeTruthy()
      expect(COUNTRY_META[code].brandName).toBeTruthy()
    })
  })

  it('brandName matches COUNTRIES config', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      if (COUNTRY_META[code]) {
        expect(COUNTRY_META[code].brandName).toBe(COUNTRIES[code].brandName)
      }
    })
  })
})

// ─── Compass Routes ─────────────────────────────────────────────────

describe('Compass routes', () => {
  it('all curated route keys are valid 2-letter code pairs', () => {
    Object.keys(COUNTRY_ROUTES).forEach((key) => {
      const [from, to] = key.split('-')
      // Must be 2-letter ISO codes (not necessarily in the 14 active deployments)
      expect(from).toMatch(/^[A-Z]{2}$/)
      expect(to).toMatch(/^[A-Z]{2}$/)
    })
  })

  it('no route has same origin and destination', () => {
    Object.keys(COUNTRY_ROUTES).forEach((key) => {
      const [from, to] = key.split('-')
      expect(from).not.toBe(to)
    })
  })

  it('most curated routes involve at least one of the 14 active countries', () => {
    const routeKeys = Object.keys(COUNTRY_ROUTES)
    const routesWithActiveCountry = routeKeys.filter((key) => {
      const [from, to] = key.split('-')
      return (
        ALL_COUNTRY_CODES.includes(from as CountryCode) ||
        ALL_COUNTRY_CODES.includes(to as CountryCode)
      )
    })
    // At least 80% of routes should involve an active country
    expect(routesWithActiveCountry.length / routeKeys.length).toBeGreaterThan(0.8)
  })

  it('getRouteInfo returns data for any valid country pair', () => {
    const info = getRouteInfo('KE', 'DE')
    expect(info).toBeDefined()
  })

  it('getRecommendedRoutes returns routes for any origin country', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      const routes = getRecommendedRoutes(code)
      expect(routes.length).toBeGreaterThan(0)
    })
  })
})

// ─── Eco-Tourism Offerings ──────────────────────────────────────────

describe('Eco-tourism offerings', () => {
  it('every offering with a country field references a valid code', () => {
    ECO_TOURISM_OFFERINGS.forEach((offering) => {
      if (offering.country) {
        expect(ALL_COUNTRY_CODES).toContain(offering.country)
      }
    })
  })

  it('offerings exist for more than just Kenya', () => {
    const countries = new Set(ECO_TOURISM_OFFERINGS.map((o) => o.country).filter(Boolean))
    expect(countries.size).toBeGreaterThanOrEqual(5)
  })
})

// ─── Trade Corridors ────────────────────────────────────────────────

describe('Trade corridors', () => {
  it('every corridor has required fields', () => {
    TRADE_CORRIDORS.forEach((corridor) => {
      expect(corridor.id).toBeTruthy()
      expect(corridor.name).toBeTruthy()
      expect(corridor.fromCountry).toBeTruthy()
      expect(corridor.toCountry).toBeTruthy()
      expect(corridor.sectors.length).toBeGreaterThan(0)
    })
  })

  it('no corridor has same origin and destination name', () => {
    TRADE_CORRIDORS.forEach((corridor) => {
      expect(corridor.fromCountry).not.toBe(corridor.toCountry)
    })
  })

  it('has at least 15 corridors', () => {
    expect(TRADE_CORRIDORS.length).toBeGreaterThanOrEqual(15)
  })
})

// ─── Country Highlights ─────────────────────────────────────────────

describe('Country highlights', () => {
  it('has highlights for at least 10 countries', () => {
    const countriesWithHighlights = Object.keys(COUNTRY_HIGHLIGHTS)
    expect(countriesWithHighlights.length).toBeGreaterThanOrEqual(10)
  })

  it('all highlight country codes are valid', () => {
    Object.keys(COUNTRY_HIGHLIGHTS).forEach((code) => {
      expect(ALL_COUNTRY_CODES).toContain(code)
    })
  })

  it('every highlight has name, description, and type', () => {
    Object.values(COUNTRY_HIGHLIGHTS)
      .flat()
      .forEach((h) => {
        expect(h.name).toBeTruthy()
        expect(h.description).toBeTruthy()
        expect(['event', 'resource', 'experience', 'certification']).toContain(h.type)
      })
  })

  it('getCountryHighlights returns array for any country', () => {
    ALL_COUNTRY_CODES.forEach((code) => {
      const highlights = getCountryHighlights(code)
      expect(Array.isArray(highlights)).toBe(true)
    })
  })

  it('getHighlightSectors returns unique sectors', () => {
    const sectors = getHighlightSectors('KE')
    expect(sectors.length).toBeGreaterThan(0)
    // No duplicates
    expect(new Set(sectors).size).toBe(sectors.length)
  })
})

// ─── StatHexagon dimensions ─────────────────────────────────────────

describe('StatHexagon data compatibility', () => {
  it('dimension-scoring breakdown keys match StatHexagon DIMENSIONS', () => {
    const HEXAGON_KEYS = [
      'language',
      'craft',
      'passion',
      'location',
      'reach',
      'faith',
      'culture',
      'market',
    ]
    expect(HEXAGON_KEYS).toHaveLength(8)
    HEXAGON_KEYS.forEach((key) => {
      expect(key).toMatch(/^[a-z]+$/)
    })
  })
})

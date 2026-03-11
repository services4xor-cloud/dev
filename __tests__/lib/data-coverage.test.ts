/**
 * Unit tests for mock data coverage across target countries
 *
 * Ensures all 4 target countries (KE, DE, CH, TH) have sufficient
 * mock data for paths, threads, greetings, and offerings.
 */

import {
  MOCK_VENTURE_PATHS,
  MOCK_THREADS,
  COUNTRY_GREETINGS,
  ECO_TOURISM_OFFERINGS,
} from '@/data/mock'

const TARGET_COUNTRIES = ['KE', 'DE', 'CH', 'TH']

describe('MOCK_VENTURE_PATHS country coverage', () => {
  it('has at least 2 paths for each target country', () => {
    TARGET_COUNTRIES.forEach((country) => {
      const paths = MOCK_VENTURE_PATHS.filter((p) => p.country === country)
      expect(paths.length).toBeGreaterThanOrEqual(2)
    })
  })

  it('every path has required fields', () => {
    MOCK_VENTURE_PATHS.forEach((path) => {
      expect(path.id).toBeTruthy()
      expect(path.title).toBeTruthy()
      expect(path.anchorName).toBeTruthy()
      expect(path.location).toBeTruthy()
      expect(path.country).toBeTruthy()
    })
  })

  it('no path has empty string fields for core properties', () => {
    MOCK_VENTURE_PATHS.forEach((path) => {
      expect(path.id.trim()).not.toBe('')
      expect(path.title.trim()).not.toBe('')
      expect(path.anchorName.trim()).not.toBe('')
      expect(path.location.trim()).not.toBe('')
      expect(path.country?.trim()).not.toBe('')
    })
  })
})

describe('MOCK_THREADS country coverage', () => {
  it('has a country thread for each target country', () => {
    const countrySlugs = ['ke', 'de', 'ch', 'th']
    countrySlugs.forEach((slug) => {
      const thread = MOCK_THREADS.find((t) => t.slug === slug && t.type === 'country')
      expect(thread).toBeDefined()
    })
  })
})

describe('COUNTRY_GREETINGS coverage', () => {
  it('has entries for all target countries', () => {
    TARGET_COUNTRIES.forEach((country) => {
      expect(COUNTRY_GREETINGS[country]).toBeDefined()
      expect(COUNTRY_GREETINGS[country].greeting).toBeTruthy()
      expect(COUNTRY_GREETINGS[country].flag).toBeTruthy()
      expect(COUNTRY_GREETINGS[country].name).toBeTruthy()
    })
  })
})

describe('ECO_TOURISM_OFFERINGS country coverage', () => {
  it('has at least 1 experience for each target country', () => {
    // KE offerings have Kenya-related locations
    const keOfferings = ECO_TOURISM_OFFERINGS.filter((o) => o.location.includes('Kenya'))
    expect(keOfferings.length).toBeGreaterThanOrEqual(1)

    // DE offerings
    const deOfferings = ECO_TOURISM_OFFERINGS.filter(
      (o) =>
        o.location.includes('Baden-Württemberg') ||
        o.location.includes('Bavaria') ||
        o.location.includes('Germany')
    )
    expect(deOfferings.length).toBeGreaterThanOrEqual(1)

    // CH offerings
    const chOfferings = ECO_TOURISM_OFFERINGS.filter(
      (o) => o.location.includes('Switzerland') || o.location.includes('Vaud')
    )
    expect(chOfferings.length).toBeGreaterThanOrEqual(1)

    // TH offerings
    const thOfferings = ECO_TOURISM_OFFERINGS.filter(
      (o) => o.location.includes('Chiang Mai') || o.location.includes('Krabi')
    )
    expect(thOfferings.length).toBeGreaterThanOrEqual(1)
  })

  it('every offering has highlights array with at least 3 items', () => {
    ECO_TOURISM_OFFERINGS.forEach((offering) => {
      expect(Array.isArray(offering.highlights)).toBe(true)
      expect(offering.highlights.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('every offering has required fields', () => {
    ECO_TOURISM_OFFERINGS.forEach((offering) => {
      expect(offering.id).toBeTruthy()
      expect(offering.name).toBeTruthy()
      expect(offering.location).toBeTruthy()
      expect(offering.type).toBeTruthy()
      expect(offering.duration).toBeTruthy()
      expect(offering.priceUSD).toBeGreaterThan(0)
      expect(offering.impactNote).toBeTruthy()
    })
  })
})

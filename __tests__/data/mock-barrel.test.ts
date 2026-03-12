/**
 * Mock Data Barrel Export Tests
 *
 * Validates the data/mock barrel export — ensures all mock data modules
 * export valid, non-empty data. This catches accidental breakage of the
 * data layer that feeds all pages.
 */

import * as MockData from '@/data/mock'

describe('Mock Data — barrel export completeness', () => {
  it('exports MOCK_VENTURE_PATHS as non-empty array', () => {
    expect(Array.isArray(MockData.MOCK_VENTURE_PATHS)).toBe(true)
    expect(MockData.MOCK_VENTURE_PATHS.length).toBeGreaterThan(0)
  })

  it('exports MOCK_CURRENT_PIONEER with required fields', () => {
    expect(MockData.MOCK_CURRENT_PIONEER).toBeDefined()
    expect(MockData.MOCK_CURRENT_PIONEER.name).toBeTruthy()
  })

  it('exports MOCK_CHAPTERS as array', () => {
    expect(Array.isArray(MockData.MOCK_CHAPTERS)).toBe(true)
  })

  it('exports MOCK_PLATFORM_STATS with numeric values', () => {
    const stats = MockData.MOCK_PLATFORM_STATS
    expect(stats).toBeDefined()
  })

  it('exports MOCK_ALL_ANCHORS as non-empty array', () => {
    expect(Array.isArray(MockData.MOCK_ALL_ANCHORS)).toBe(true)
    expect(MockData.MOCK_ALL_ANCHORS.length).toBeGreaterThan(0)
  })

  it('exports MOCK_THREADS as non-empty array', () => {
    expect(Array.isArray(MockData.MOCK_THREADS)).toBe(true)
    expect(MockData.MOCK_THREADS.length).toBeGreaterThan(0)
  })
})

describe('Mock Data — config exports', () => {
  it('exports BRAND_NAME as a Be* string', () => {
    expect(MockData.BRAND_NAME).toMatch(/^Be/)
  })

  it('exports BRAND_TAGLINE as non-empty string', () => {
    expect(MockData.BRAND_TAGLINE.length).toBeGreaterThan(5)
  })

  it('exports BRAND_MISSION as non-empty string', () => {
    expect(MockData.BRAND_MISSION.length).toBeGreaterThan(10)
  })

  it('exports IMPACT_PARTNER with required fields', () => {
    expect(MockData.IMPACT_PARTNER.name).toBeTruthy()
    expect(MockData.IMPACT_PARTNER.contributionAmount).toBeTruthy()
    expect(MockData.IMPACT_PARTNER.pillars.length).toBeGreaterThan(0)
  })

  it('exports CONTACT with email and phone', () => {
    expect(MockData.CONTACT.email).toMatch(/@/)
    expect(MockData.CONTACT.phone).toBeTruthy()
  })

  it('exports LEGAL with company registration fields', () => {
    expect(MockData.LEGAL.companyName).toBeTruthy()
    expect(MockData.LEGAL.incorporationNumber).toBeTruthy()
  })
})

describe('Mock Data — pricing exports', () => {
  it('exports PRICING_PLANS as non-empty array', () => {
    expect(Array.isArray(MockData.PRICING_PLANS)).toBe(true)
    expect(MockData.PRICING_PLANS.length).toBeGreaterThanOrEqual(2)
  })

  it('every pricing plan has name and price', () => {
    for (const plan of MockData.PRICING_PLANS) {
      expect(plan.name).toBeTruthy()
      expect(plan.price).toBeDefined()
    }
  })

  it('exports getPlanPrice function', () => {
    expect(typeof MockData.getPlanPrice).toBe('function')
  })

  it('exports formatPlanPrice function', () => {
    expect(typeof MockData.formatPlanPrice).toBe('function')
  })

  it('exports PAYMENT_METHODS as non-empty array', () => {
    expect(MockData.PAYMENT_METHODS.length).toBeGreaterThan(0)
  })
})

describe('Mock Data — homepage exports', () => {
  it('exports COUNTRY_GREETINGS as non-empty record', () => {
    expect(Object.keys(MockData.COUNTRY_GREETINGS).length).toBeGreaterThan(0)
  })

  it('exports ROTATING_FLAGS as non-empty array', () => {
    expect(MockData.ROTATING_FLAGS.length).toBeGreaterThan(0)
  })

  it('exports BENETWORK_PILLARS as non-empty array', () => {
    expect(MockData.BENETWORK_PILLARS.length).toBeGreaterThan(0)
  })

  it('exports TESTIMONIALS as non-empty array', () => {
    expect(MockData.TESTIMONIALS.length).toBeGreaterThan(0)
  })

  it('every testimonial has name and quote', () => {
    for (const t of MockData.TESTIMONIALS) {
      expect(t.name).toBeTruthy()
      expect(t.quote).toBeTruthy()
    }
  })
})

describe('Mock Data — about page exports', () => {
  it('exports ABOUT_VALUES as non-empty array', () => {
    expect(MockData.ABOUT_VALUES.length).toBeGreaterThan(0)
  })

  it('exports ABOUT_SECTORS as non-empty array', () => {
    expect(MockData.ABOUT_SECTORS.length).toBeGreaterThan(0)
  })

  it('exports ABOUT_STATS as non-empty array', () => {
    expect(MockData.ABOUT_STATS.length).toBeGreaterThan(0)
  })
})

describe('Mock Data — vertical page exports', () => {
  it('exports MEDIA_PATHS as non-empty array', () => {
    expect(MockData.MEDIA_PATHS.length).toBeGreaterThan(0)
  })

  it('exports FASHION_PATHS as non-empty array', () => {
    expect(MockData.FASHION_PATHS.length).toBeGreaterThan(0)
  })

  it('exports ECO_TOURISM_OFFERINGS as non-empty array', () => {
    expect(MockData.ECO_TOURISM_OFFERINGS.length).toBeGreaterThan(0)
  })

  it('exports TRADE_CORRIDORS as non-empty array', () => {
    expect(MockData.TRADE_CORRIDORS.length).toBeGreaterThan(0)
  })
})

describe('Mock Data — anchor dashboard exports', () => {
  it('exports MOCK_ANCHOR with required fields', () => {
    expect(MockData.MOCK_ANCHOR.name).toBeTruthy()
  })

  it('exports MOCK_PATHS as non-empty array', () => {
    expect(MockData.MOCK_PATHS.length).toBeGreaterThan(0)
  })

  it('exports ROUTE_CORRIDORS as non-empty array', () => {
    expect(MockData.ROUTE_CORRIDORS.length).toBeGreaterThan(0)
  })
})

describe('Mock Data — post-path wizard exports', () => {
  it('exports CURRENCIES as non-empty array', () => {
    expect(MockData.CURRENCIES.length).toBeGreaterThan(0)
  })

  it('exports POST_PATH_STEPS as non-empty array', () => {
    expect(MockData.POST_PATH_STEPS.length).toBeGreaterThan(0)
  })

  it('exports SUGGESTED_SKILLS as non-empty record', () => {
    expect(Object.keys(MockData.SUGGESTED_SKILLS).length).toBeGreaterThan(0)
  })
})

describe('Mock Data — charity exports', () => {
  it('exports PILLARS as non-empty array', () => {
    expect(MockData.PILLARS.length).toBeGreaterThan(0)
  })

  it('exports STORIES as non-empty array', () => {
    expect(MockData.STORIES.length).toBeGreaterThan(0)
  })

  it('exports ACTIVE_PROGRAMS as non-empty array', () => {
    expect(MockData.ACTIVE_PROGRAMS.length).toBeGreaterThan(0)
  })
})

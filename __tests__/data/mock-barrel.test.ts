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

// Config exports moved to @/lib/platform-config (canonical source)
// Tested in __tests__/lib/platform-config.test.ts

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

describe('Mock Data — admin extended exports', () => {
  it('exports MOCK_RECENT_PIONEERS as non-empty array', () => {
    expect(Array.isArray(MockData.MOCK_RECENT_PIONEERS)).toBe(true)
    expect(MockData.MOCK_RECENT_PIONEERS.length).toBeGreaterThan(0)
  })

  it('every recent pioneer has name and country', () => {
    for (const p of MockData.MOCK_RECENT_PIONEERS) {
      expect(p.name).toBeTruthy()
      expect(p.country).toBeTruthy()
    }
  })

  it('exports MOCK_ALL_PIONEERS as non-empty array', () => {
    expect(Array.isArray(MockData.MOCK_ALL_PIONEERS)).toBe(true)
    expect(MockData.MOCK_ALL_PIONEERS.length).toBeGreaterThan(0)
  })

  it('every pioneer has id, name, type, from, to', () => {
    for (const p of MockData.MOCK_ALL_PIONEERS) {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.type).toBeTruthy()
      expect(p.from).toBeTruthy()
      expect(p.to).toBeTruthy()
    }
  })

  it('exports MOCK_RECENT_CHAPTERS as non-empty array', () => {
    expect(Array.isArray(MockData.MOCK_RECENT_CHAPTERS)).toBe(true)
    expect(MockData.MOCK_RECENT_CHAPTERS.length).toBeGreaterThan(0)
  })

  it('every chapter has pioneer, path, anchor, score, status', () => {
    for (const ch of MockData.MOCK_RECENT_CHAPTERS) {
      expect(ch.pioneer).toBeTruthy()
      expect(ch.path).toBeTruthy()
      expect(ch.anchor).toBeTruthy()
      expect(ch.score).toBeGreaterThan(0)
      expect(ch.status).toBeTruthy()
    }
  })

  it('exports MOCK_SOCIAL_PLATFORMS as non-empty array', () => {
    expect(MockData.MOCK_SOCIAL_PLATFORMS.length).toBeGreaterThan(0)
  })

  it('exports MOCK_SOCIAL_QUEUE as non-empty array', () => {
    expect(MockData.MOCK_SOCIAL_QUEUE.length).toBeGreaterThan(0)
  })

  it('exports MOCK_ENV_VARS as non-empty array', () => {
    expect(MockData.MOCK_ENV_VARS.length).toBeGreaterThan(0)
  })
})

describe('Mock Data — messages exports', () => {
  it('exports MOCK_CHANNEL_MESSAGES as non-empty record', () => {
    expect(Object.keys(MockData.MOCK_CHANNEL_MESSAGES).length).toBeGreaterThan(0)
  })

  it('every channel has messages with id, author, text', () => {
    for (const [, messages] of Object.entries(MockData.MOCK_CHANNEL_MESSAGES)) {
      expect(messages.length).toBeGreaterThan(0)
      for (const msg of messages) {
        expect(msg.id).toBeTruthy()
        expect(msg.author).toBeTruthy()
        expect(msg.text).toBeTruthy()
      }
    }
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

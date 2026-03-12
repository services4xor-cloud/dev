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
  MOCK_ALL_ANCHORS,
  MOCK_ALL_PATHS,
  MOCK_ALL_PIONEERS,
  MOCK_RECENT_PIONEERS,
  MOCK_RECENT_CHAPTERS,
  MOCK_CHANNEL_MESSAGES,
} from '@/data/mock'
import { COUNTRY_META } from '@/lib/countries'
import { SECTOR_META, getSectorIcon, getSectorCategory } from '@/lib/sectors'

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

// ─── Cross-reference consistency ─────────────────────────────────────

describe('Admin data cross-references', () => {
  it('all pioneer names in RECENT_CHAPTERS exist in ALL_PIONEERS', () => {
    const pioneerNames = new Set(MOCK_ALL_PIONEERS.map((p) => p.name))
    MOCK_RECENT_CHAPTERS.forEach((ch) => {
      expect(pioneerNames.has(ch.pioneer)).toBe(true)
    })
  })

  it('all pioneer names in RECENT_PIONEERS exist in ALL_PIONEERS', () => {
    const allNames = new Set(MOCK_ALL_PIONEERS.map((p) => p.name))
    MOCK_RECENT_PIONEERS.forEach((rp) => {
      expect(allNames.has(rp.name)).toBe(true)
    })
  })

  it('all anchors in RECENT_CHAPTERS exist in ALL_ANCHORS', () => {
    const anchorNames = new Set(MOCK_ALL_ANCHORS.map((a) => a.name))
    MOCK_RECENT_CHAPTERS.forEach((ch) => {
      expect(anchorNames.has(ch.anchor)).toBe(true)
    })
  })

  it('all anchors in ALL_PATHS exist in ALL_ANCHORS (or known short forms)', () => {
    const anchorNames = new Set(MOCK_ALL_ANCHORS.map((a) => a.name))
    // KCC is a known abbreviation for Kenyatta Conference Centre
    const knownShortForms = new Set(['KCC'])
    MOCK_ALL_PATHS.forEach((path) => {
      const exists = anchorNames.has(path.anchor) || knownShortForms.has(path.anchor)
      expect(exists).toBe(true)
    })
  })

  it('no duplicate IDs in ALL_PIONEERS', () => {
    const ids = MOCK_ALL_PIONEERS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('no duplicate IDs in ALL_ANCHORS', () => {
    const ids = MOCK_ALL_ANCHORS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('no duplicate IDs in ALL_PATHS', () => {
    const ids = MOCK_ALL_PATHS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('no duplicate IDs in VENTURE_PATHS', () => {
    const ids = MOCK_VENTURE_PATHS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Messages data quality', () => {
  it('every channel has at least 2 messages', () => {
    for (const [channel, messages] of Object.entries(MOCK_CHANNEL_MESSAGES)) {
      expect(messages.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('no duplicate message IDs within a channel', () => {
    for (const [, messages] of Object.entries(MOCK_CHANNEL_MESSAGES)) {
      const ids = messages.map((m) => m.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('message authors have non-empty names', () => {
    for (const [, messages] of Object.entries(MOCK_CHANNEL_MESSAGES)) {
      messages.forEach((msg) => {
        expect(msg.author.trim()).not.toBe('')
      })
    }
  })
})

// ─── Centralized config modules ─────────────────────────────────────

describe('COUNTRY_META (SEO)', () => {
  it('has SEO metadata for all deployed countries', () => {
    ;['KE', 'DE', 'CH', 'TH'].forEach((code) => {
      expect(COUNTRY_META[code]).toBeDefined()
      expect(COUNTRY_META[code].title).toBeTruthy()
      expect(COUNTRY_META[code].description).toBeTruthy()
      expect(COUNTRY_META[code].twitter).toBeTruthy()
    })
  })
})

describe('SECTOR_META', () => {
  it('has at least 15 sector definitions', () => {
    expect(Object.keys(SECTOR_META).length).toBeGreaterThanOrEqual(15)
  })

  it('every sector has icon and category', () => {
    for (const [, meta] of Object.entries(SECTOR_META)) {
      expect(meta.icon).toBeTruthy()
      expect(meta.category).toBeTruthy()
    }
  })

  it('getSectorIcon returns fallback for unknown sector', () => {
    expect(getSectorIcon('nonexistent')).toBe('🧭')
    expect(getSectorIcon('tech')).toBe('💻')
  })

  it('getSectorCategory returns fallback for unknown sector', () => {
    expect(getSectorCategory('nonexistent')).toBe('professional')
    expect(getSectorCategory('safari')).toBe('explorer')
  })
})

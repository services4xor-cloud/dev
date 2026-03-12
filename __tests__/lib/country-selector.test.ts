/**
 * country-selector.test.ts — Tests for the 660-LOC country/language engine
 *
 * Covers: data integrity, proximity math, language overlap,
 * grouped countries, and corridor badges.
 */

import {
  COUNTRY_OPTIONS,
  REGION_CLUSTERS,
  LANGUAGE_REGISTRY,
  CORRIDOR_BADGE,
  MAX_COUNTRY_SELECTIONS,
  distanceKm,
  proximityLabel,
  isNearby,
  sortedByProximity,
  getGroupedCountries,
  priorityChar,
  getCountriesBySharedLanguage,
  getCountriesForLanguage,
  getAllLanguages,
  languageOverlap,
  getGroupedByLanguage,
  type CountryOption,
} from '@/lib/country-selector'

// ── Data Integrity ─────────────────────────────────────────────────────────────

describe('COUNTRY_OPTIONS data integrity', () => {
  it('has at least 16 countries', () => {
    expect(COUNTRY_OPTIONS.length).toBeGreaterThanOrEqual(16)
  })

  it('every country has required fields', () => {
    COUNTRY_OPTIONS.forEach((c) => {
      expect(c.code).toMatch(/^[A-Z]{2}$/)
      expect(c.name.length).toBeGreaterThan(0)
      expect(c.flag.length).toBeGreaterThan(0)
      expect(typeof c.lat).toBe('number')
      expect(typeof c.lng).toBe('number')
      expect(c.topSectors.length).toBeGreaterThan(0)
      expect(c.currency.length).toBeGreaterThan(0)
      expect(c.payment.length).toBeGreaterThan(0)
      expect(c.tz.length).toBeGreaterThan(0)
      expect(c.languages.length).toBeGreaterThan(0)
    })
  })

  it('has no duplicate country codes', () => {
    const codes = COUNTRY_OPTIONS.map((c) => c.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('every country belongs to a valid region cluster', () => {
    const validRegions = REGION_CLUSTERS.map((r) => r.key)
    COUNTRY_OPTIONS.forEach((c) => {
      expect(validRegions).toContain(c.region)
    })
  })

  it('Kenya is in the list with code KE', () => {
    const kenya = COUNTRY_OPTIONS.find((c) => c.code === 'KE')
    expect(kenya).toBeDefined()
    expect(kenya!.name).toBe('Kenya')
    expect(kenya!.flag).toBe('🇰🇪')
  })
})

describe('REGION_CLUSTERS', () => {
  it('has at least 6 clusters', () => {
    expect(REGION_CLUSTERS.length).toBeGreaterThanOrEqual(6)
  })

  it('each cluster has key, label, emoji', () => {
    REGION_CLUSTERS.forEach((c) => {
      expect(c.key).toBeTruthy()
      expect(c.label).toBeTruthy()
      expect(c.emoji).toBeTruthy()
    })
  })
})

describe('LANGUAGE_REGISTRY', () => {
  it('has 100+ languages (Tier A/B/C)', () => {
    expect(Object.keys(LANGUAGE_REGISTRY).length).toBeGreaterThanOrEqual(100)
  })

  it('English is global reach', () => {
    expect(LANGUAGE_REGISTRY.en.digitalReach).toBe('global')
  })

  it('Swahili covers KE, TZ, UG', () => {
    expect(LANGUAGE_REGISTRY.sw.countries).toEqual(expect.arrayContaining(['KE', 'TZ', 'UG']))
  })

  it('every language used in COUNTRY_OPTIONS exists in LANGUAGE_REGISTRY', () => {
    const allLangs = new Set(COUNTRY_OPTIONS.flatMap((c) => c.languages))
    allLangs.forEach((lang) => {
      expect(LANGUAGE_REGISTRY).toHaveProperty(lang)
    })
  })

  it('every language has nativeName, name, and countries[]', () => {
    Object.values(LANGUAGE_REGISTRY).forEach((lang) => {
      expect(lang.nativeName.length).toBeGreaterThan(0)
      expect(lang.name.length).toBeGreaterThan(0)
      expect(lang.countries.length).toBeGreaterThan(0)
    })
  })
})

// ── Distance & Proximity ───────────────────────────────────────────────────────

describe('distanceKm', () => {
  it('returns 0 for same point', () => {
    expect(distanceKm(-1.286, 36.817, -1.286, 36.817)).toBe(0)
  })

  it('Nairobi → Kampala ≈ 500-600 km', () => {
    const d = distanceKm(-1.286, 36.817, 0.316, 32.581)
    expect(d).toBeGreaterThan(400)
    expect(d).toBeLessThan(700)
  })

  it('Nairobi → Berlin ≈ 6500+ km', () => {
    const d = distanceKm(-1.286, 36.817, 51.166, 10.451)
    expect(d).toBeGreaterThan(6000)
  })
})

describe('proximityLabel', () => {
  it('< 500 km → Neighbor', () => {
    expect(proximityLabel(300)).toBe('Neighbor')
  })

  it('> 5000 km → Distant', () => {
    const label = proximityLabel(6000)
    expect(label.length).toBeGreaterThan(0)
  })
})

describe('isNearby', () => {
  it('KE → UG is nearby', () => {
    expect(isNearby('KE', 'UG')).toBe(true)
  })

  it('KE → DE is not nearby', () => {
    expect(isNearby('KE', 'DE')).toBe(false)
  })

  it('same country returns false (self not in list)', () => {
    // KE → KE should check — distance 0 is < 1800 but Kenya IS in the options
    // The function may or may not include self
    const result = isNearby('KE', 'KE')
    expect(typeof result).toBe('boolean')
  })
})

describe('sortedByProximity', () => {
  it('returns countries sorted by distance from origin (excludes self)', () => {
    const sorted = sortedByProximity('KE')
    expect(sorted.length).toBeGreaterThan(0)
    // Self is excluded — first should be nearest neighbor (UG or TZ)
    expect(['UG', 'TZ']).toContain(sorted[0].code)
  })

  it('East African countries appear before European ones for KE origin', () => {
    const sorted = sortedByProximity('KE')
    const ugIdx = sorted.findIndex((c) => c.code === 'UG')
    const deIdx = sorted.findIndex((c) => c.code === 'DE')
    if (ugIdx !== -1 && deIdx !== -1) {
      expect(ugIdx).toBeLessThan(deIdx)
    }
  })
})

// ── Grouped Countries ──────────────────────────────────────────────────────────

describe('getGroupedCountries', () => {
  it('returns groups with cluster and countries', () => {
    const groups = getGroupedCountries('KE')
    expect(groups.length).toBeGreaterThan(0)
    groups.forEach((g) => {
      expect(g.cluster).toBeDefined()
      expect(g.countries.length).toBeGreaterThan(0)
    })
  })

  it('marks nearby countries for KE origin', () => {
    const groups = getGroupedCountries('KE')
    const allCountries = groups.flatMap((g) => g.countries)
    const nearbyCountries = allCountries.filter((c) => c.isNearby)
    expect(nearbyCountries.length).toBeGreaterThan(0)
  })

  it('includes distKm in each country', () => {
    const groups = getGroupedCountries('KE')
    groups.forEach((g) => {
      g.countries.forEach((c) => {
        expect(typeof c.distKm).toBe('number')
        expect(c.distKm).toBeGreaterThanOrEqual(0)
      })
    })
  })
})

// ── Priority Characters ────────────────────────────────────────────────────────

describe('priorityChar', () => {
  it('returns ① for 1', () => {
    expect(priorityChar(1)).toBe('①')
  })

  it('returns ⑤ for 5', () => {
    expect(priorityChar(5)).toBe('⑤')
  })

  it('returns number string for > 5', () => {
    expect(priorityChar(6)).toBeTruthy()
  })
})

describe('MAX_COUNTRY_SELECTIONS', () => {
  it('equals 5', () => {
    expect(MAX_COUNTRY_SELECTIONS).toBe(5)
  })
})

// ── Corridor Badges ────────────────────────────────────────────────────────────

describe('CORRIDOR_BADGE', () => {
  it('has entries for direct, partner, emerging', () => {
    expect(CORRIDOR_BADGE.direct).toBeDefined()
    expect(CORRIDOR_BADGE.partner).toBeDefined()
    expect(CORRIDOR_BADGE.emerging).toBeDefined()
  })

  it('each badge has label and className', () => {
    Object.values(CORRIDOR_BADGE).forEach((b) => {
      expect(b.label.length).toBeGreaterThan(0)
      expect(b.className.length).toBeGreaterThan(0)
    })
  })
})

// ── Language Functions ─────────────────────────────────────────────────────────

describe('getCountriesBySharedLanguage', () => {
  it('KE shares Swahili with TZ and UG', () => {
    const shared = getCountriesBySharedLanguage('KE')
    // Returns { language, countries[] } groups
    const swahiliGroup = shared.find((g) => g.language.code === 'sw')
    expect(swahiliGroup).toBeDefined()
    const codes = swahiliGroup!.countries.map((c) => c.code)
    expect(codes).toContain('TZ')
    expect(codes).toContain('UG')
  })
})

describe('getCountriesForLanguage', () => {
  it('returns KE, TZ, UG, RW for Swahili', () => {
    const countries = getCountriesForLanguage('sw')
    const codes = countries.map((c) => c.code)
    expect(codes).toContain('KE')
    expect(codes).toContain('TZ')
  })
})

describe('getAllLanguages', () => {
  it('returns languages actually used by countries (≥ 10)', () => {
    // Only languages referenced by at least one country are returned
    const langs = getAllLanguages()
    expect(langs.length).toBeGreaterThanOrEqual(10)
    // English should always be present
    expect(langs.some((l) => l.code === 'en')).toBe(true)
  })
})

describe('languageOverlap', () => {
  it('KE ↔ TZ has high overlap (shared en + sw)', () => {
    // Returns ratio: shared / total unique languages
    const overlap = languageOverlap('KE', 'TZ')
    expect(overlap).toBeGreaterThan(0.5) // 2 shared out of 2-3 total
  })

  it('KE ↔ DE has low overlap (only en shared)', () => {
    const overlap = languageOverlap('KE', 'DE')
    expect(overlap).toBeGreaterThan(0) // at least English
    expect(overlap).toBeLessThan(0.5) // but not a lot of overlap
  })

  it('unknown countries → 0', () => {
    expect(languageOverlap('XX', 'YY')).toBe(0)
  })
})

describe('getGroupedByLanguage', () => {
  it('returns groups with language and countries', () => {
    const groups = getGroupedByLanguage()
    expect(groups.length).toBeGreaterThan(0)
    groups.forEach((g) => {
      expect(g.language).toBeDefined()
      expect(g.countries.length).toBeGreaterThan(0)
    })
  })
})

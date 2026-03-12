/**
 * World Data Registry — Tests
 *
 * Validates all 193 UN member states and ~70 languages are present
 * with correct structure, plus helper function behavior.
 */

import {
  WORLD_COUNTRIES,
  WORLD_LANGUAGES,
  getCountryName,
  getLanguageName,
  getCountriesByRegion,
  getLanguagesForCountry,
} from '@/lib/world-data'

// ─────────────────────────────────────────────────────────────────────────────
// Countries
// ─────────────────────────────────────────────────────────────────────────────

describe('WORLD_COUNTRIES', () => {
  const countries = Object.values(WORLD_COUNTRIES)

  it('has all 193 UN member states', () => {
    expect(countries.length).toBe(193)
  })

  it('each country has required fields with valid formats', () => {
    for (const country of countries) {
      expect(country.code).toMatch(/^[A-Z]{2}$/)
      expect(country.name).toBeTruthy()
      expect(country.region).toBeTruthy()
      expect(country.subregion).toBeTruthy()
      expect(typeof country.lat).toBe('number')
      expect(typeof country.lng).toBe('number')
      expect(country.lat).toBeGreaterThanOrEqual(-90)
      expect(country.lat).toBeLessThanOrEqual(90)
      expect(country.lng).toBeGreaterThanOrEqual(-180)
      expect(country.lng).toBeLessThanOrEqual(180)
      expect(Array.isArray(country.languages)).toBe(true)
      expect(country.languages.length).toBeGreaterThan(0)
      expect(Array.isArray(country.faiths)).toBe(true)
      expect(country.faiths.length).toBeGreaterThan(0)
      expect(country.currency).toBeTruthy()
      expect(country.currency.length).toBe(3)
    }
  })

  it('key in record matches country.code', () => {
    for (const [key, country] of Object.entries(WORLD_COUNTRIES)) {
      expect(key).toBe(country.code)
    }
  })

  it.each(['KE', 'DE', 'US', 'NG', 'JP', 'BR', 'IN', 'SA'])(
    'includes key country %s',
    (code) => {
      expect(WORLD_COUNTRIES[code]).toBeDefined()
      expect(WORLD_COUNTRIES[code].code).toBe(code)
    }
  )

  it('has correct region counts', () => {
    const africa = getCountriesByRegion('Africa')
    const europe = getCountriesByRegion('Europe')
    const asia = getCountriesByRegion('Asia')
    const americas = getCountriesByRegion('Americas')
    const oceania = getCountriesByRegion('Oceania')

    expect(africa.length).toBeGreaterThanOrEqual(50)
    expect(europe.length).toBeGreaterThanOrEqual(40)
    expect(asia.length).toBeGreaterThanOrEqual(40)
    expect(americas.length).toBeGreaterThanOrEqual(30)
    expect(oceania.length).toBeGreaterThanOrEqual(10)
  })

  it('all regions are valid', () => {
    const validRegions = ['Africa', 'Europe', 'Asia', 'Americas', 'Oceania']
    for (const country of countries) {
      expect(validRegions).toContain(country.region)
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Languages
// ─────────────────────────────────────────────────────────────────────────────

describe('WORLD_LANGUAGES', () => {
  const languages = Object.values(WORLD_LANGUAGES)

  it('has at least 50 languages', () => {
    expect(languages.length).toBeGreaterThanOrEqual(50)
  })

  it('each language has required fields', () => {
    for (const lang of languages) {
      expect(lang.code).toBeTruthy()
      expect(lang.name).toBeTruthy()
      expect(lang.nativeName).toBeTruthy()
      expect(['ltr', 'rtl']).toContain(lang.script)
      expect(typeof lang.speakers).toBe('number')
      expect(lang.speakers).toBeGreaterThan(0)
      expect(Array.isArray(lang.countries)).toBe(true)
      expect(lang.countries.length).toBeGreaterThan(0)
    }
  })

  it('key in record matches language.code', () => {
    for (const [key, lang] of Object.entries(WORLD_LANGUAGES)) {
      expect(key).toBe(lang.code)
    }
  })

  it.each(['en', 'ar', 'zh', 'es', 'hi', 'sw', 'de', 'fr'])(
    'includes key language %s',
    (code) => {
      expect(WORLD_LANGUAGES[code]).toBeDefined()
      expect(WORLD_LANGUAGES[code].code).toBe(code)
    }
  )

  it('RTL languages are correctly marked', () => {
    expect(WORLD_LANGUAGES['ar'].script).toBe('rtl')
    expect(WORLD_LANGUAGES['he'].script).toBe('rtl')
    expect(WORLD_LANGUAGES['ur'].script).toBe('rtl')
    expect(WORLD_LANGUAGES['fa'].script).toBe('rtl')
    expect(WORLD_LANGUAGES['ps'].script).toBe('rtl')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────────

describe('getCountriesByRegion', () => {
  it('returns only countries from the specified region', () => {
    const african = getCountriesByRegion('Africa')
    for (const c of african) {
      expect(c.region).toBe('Africa')
    }
  })

  it('is case-insensitive', () => {
    const a = getCountriesByRegion('africa')
    const b = getCountriesByRegion('Africa')
    expect(a.length).toBe(b.length)
  })

  it('returns empty array for unknown region', () => {
    expect(getCountriesByRegion('Atlantis')).toEqual([])
  })
})

describe('getLanguagesForCountry', () => {
  it('returns correct languages for Kenya (en, sw)', () => {
    const langs = getLanguagesForCountry('KE')
    const codes = langs.map((l) => l.code)
    expect(codes).toContain('en')
    expect(codes).toContain('sw')
  })

  it('returns correct languages for India', () => {
    const langs = getLanguagesForCountry('IN')
    const codes = langs.map((l) => l.code)
    expect(codes).toContain('hi')
    expect(codes).toContain('en')
  })

  it('is case-insensitive', () => {
    const a = getLanguagesForCountry('ke')
    const b = getLanguagesForCountry('KE')
    expect(a.length).toBe(b.length)
  })

  it('returns empty array for unknown country', () => {
    expect(getLanguagesForCountry('XX')).toEqual([])
  })
})

describe('getCountryName', () => {
  it('returns "Germany" for DE with en locale', () => {
    expect(getCountryName('DE', 'en')).toBe('Germany')
  })

  it('returns "Deutschland" for DE with de locale', () => {
    expect(getCountryName('DE', 'de')).toBe('Deutschland')
  })

  it('returns a name for any valid country code', () => {
    const name = getCountryName('KE')
    expect(name).toBeTruthy()
    expect(typeof name).toBe('string')
  })

  it('returns the code for unknown country', () => {
    expect(getCountryName('XX')).toBe('XX')
  })
})

describe('getLanguageName', () => {
  it('returns "English" for en', () => {
    expect(getLanguageName('en')).toBe('English')
  })

  it('returns "Swahili" for sw', () => {
    expect(getLanguageName('sw')).toBe('Swahili')
  })

  it('returns "German" for de', () => {
    expect(getLanguageName('de')).toBe('German')
  })

  it('returns the code for unknown language', () => {
    expect(getLanguageName('xx')).toBe('xx')
  })
})

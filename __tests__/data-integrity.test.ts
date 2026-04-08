/**
 * Data integrity gate — exhaustive checks of the country/language registries.
 * Prevents silent drift: bad codes, unknown languages, out-of-range coords, etc.
 */
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'

describe('country + language data integrity', () => {
  test('no duplicate country codes', () => {
    const codes = COUNTRY_OPTIONS.map((c) => c.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  test('every country has required fields populated', () => {
    for (const c of COUNTRY_OPTIONS) {
      expect(c.languages.length).toBeGreaterThan(0)
      expect(c.payment.length).toBeGreaterThan(0)
      expect(c.topSectors.length).toBeGreaterThan(0)
      expect(c.topFaiths.length).toBeGreaterThan(0)
      expect(c.tz).toBeTruthy()
      expect(c.currency).toBeTruthy()
    }
  })

  test('every referenced language exists in LANGUAGE_REGISTRY', () => {
    const langKeys = new Set(Object.keys(LANGUAGE_REGISTRY))
    const missing: string[] = []
    for (const c of COUNTRY_OPTIONS) {
      for (const lc of c.languages) {
        if (!langKeys.has(lc)) missing.push(`${c.code}->${lc}`)
      }
    }
    expect(missing).toEqual([])
  })

  test('coords are within valid range', () => {
    for (const c of COUNTRY_OPTIONS) {
      expect(c.lat).toBeGreaterThanOrEqual(-90)
      expect(c.lat).toBeLessThanOrEqual(90)
      expect(c.lng).toBeGreaterThanOrEqual(-180)
      expect(c.lng).toBeLessThanOrEqual(180)
    }
  })

  test('timezones are valid IANA identifiers', () => {
    const invalid: string[] = []
    for (const c of COUNTRY_OPTIONS) {
      try {
        new Intl.DateTimeFormat('en', { timeZone: c.tz })
      } catch {
        invalid.push(`${c.code}:${c.tz}`)
      }
    }
    expect(invalid).toEqual([])
  })

  test('no country has duplicate language refs', () => {
    for (const c of COUNTRY_OPTIONS) {
      expect(new Set(c.languages).size).toBe(c.languages.length)
    }
  })
})

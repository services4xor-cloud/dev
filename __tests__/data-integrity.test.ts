/**
 * Data integrity gate — exhaustive checks of the country/language registries.
 * Prevents silent drift: bad codes, unknown languages, out-of-range coords, etc.
 */
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'
import { FAITH_OPTIONS } from '@/lib/dimensions'

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

  test('every referenced faith exists in FAITH_OPTIONS', () => {
    const faithIds = new Set(FAITH_OPTIONS.map((f) => f.id))
    const missing: string[] = []
    for (const c of COUNTRY_OPTIONS) {
      for (const fc of c.topFaiths) {
        if (!faithIds.has(fc)) missing.push(`${c.code}->${fc}`)
      }
    }
    expect(missing).toEqual([])
  })

  test('no country has duplicate faith refs', () => {
    for (const c of COUNTRY_OPTIONS) {
      expect(new Set(c.topFaiths).size).toBe(c.topFaiths.length)
    }
  })

  test('country codes are 2-letter uppercase ISO 3166-1', () => {
    const invalid: string[] = []
    for (const c of COUNTRY_OPTIONS) {
      if (!/^[A-Z]{2}$/.test(c.code)) invalid.push(c.code)
    }
    expect(invalid).toEqual([])
  })

  test('currency codes are 3-letter uppercase ISO 4217', () => {
    const invalid: string[] = []
    for (const c of COUNTRY_OPTIONS) {
      if (!/^[A-Z]{3}$/.test(c.currency)) invalid.push(`${c.code}:${c.currency}`)
    }
    expect(invalid).toEqual([])
  })

  test('no country has duplicate sector refs', () => {
    for (const c of COUNTRY_OPTIONS) {
      expect(new Set(c.topSectors).size).toBe(c.topSectors.length)
    }
  })

  test('no empty strings in sector, payment, or faith arrays', () => {
    const issues: string[] = []
    for (const c of COUNTRY_OPTIONS) {
      for (const s of c.topSectors) {
        if (!s.trim()) issues.push(`${c.code}:sector:empty`)
      }
      for (const p of c.payment) {
        if (!p.trim()) issues.push(`${c.code}:payment:empty`)
      }
      for (const f of c.topFaiths) {
        if (!f.trim()) issues.push(`${c.code}:faith:empty`)
      }
    }
    expect(issues).toEqual([])
  })
})

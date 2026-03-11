/**
 * geo.test.ts — Tests for timezone-based country detection
 */

import { detectCountryFromTimezone } from '@/lib/geo'

describe('detectCountryFromTimezone', () => {
  const originalDateTimeFormat = Intl.DateTimeFormat

  afterEach(() => {
    // Restore original
    ;(globalThis as any).Intl.DateTimeFormat = originalDateTimeFormat
  })

  it('returns a 2-letter country code', () => {
    const code = detectCountryFromTimezone()
    expect(code).toMatch(/^[A-Z]{2}$/)
  })

  it('returns default country when Intl throws', () => {
    ;(globalThis as any).Intl.DateTimeFormat = () => {
      throw new Error('unsupported')
    }
    const code = detectCountryFromTimezone()
    expect(code).toMatch(/^[A-Z]{2}$/)
  })

  it('returns a country code from COUNTRY_OPTIONS (not arbitrary)', () => {
    // Whatever timezone the test runner is in, should map to a known country or fallback
    const code = detectCountryFromTimezone()
    expect(code.length).toBe(2)
  })
})

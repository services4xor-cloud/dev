/**
 * Endonyms Tests
 *
 * Validates:
 *   - Localized country name lookups
 *   - Default language per country
 *   - Search terms generation
 *   - Country search across languages
 */

import {
  getLocalizedCountryName,
  getDefaultLanguage,
  getCountrySearchTerms,
  searchCountries,
} from '@/lib/endonyms'

describe('Endonyms — getLocalizedCountryName', () => {
  it('returns English name for known country', () => {
    expect(getLocalizedCountryName('KE', 'en')).toBe('Kenya')
    expect(getLocalizedCountryName('DE', 'en')).toBe('Germany')
    expect(getLocalizedCountryName('US', 'en')).toBe('United States')
  })

  it('returns German endonym for DE in German', () => {
    expect(getLocalizedCountryName('DE', 'de')).toBe('Deutschland')
  })

  it('returns Swahili endonym for DE', () => {
    expect(getLocalizedCountryName('DE', 'sw')).toBe('Ujerumani')
  })

  it('returns German name for KE in German', () => {
    expect(getLocalizedCountryName('KE', 'de')).toBe('Kenia')
  })

  it('falls back to English for unknown language', () => {
    expect(getLocalizedCountryName('KE', 'zz')).toBe('Kenya')
  })

  it('returns country code for unknown country', () => {
    expect(getLocalizedCountryName('XX', 'en')).toBe('XX')
  })

  it('handles case insensitivity', () => {
    expect(getLocalizedCountryName('ke', 'EN')).toBe('Kenya')
  })
})

describe('Endonyms — getDefaultLanguage', () => {
  it('returns en for KE', () => {
    expect(getDefaultLanguage('KE')).toBe('en')
  })

  it('returns de for DE', () => {
    expect(getDefaultLanguage('DE')).toBe('de')
  })

  it('returns sw for TZ', () => {
    expect(getDefaultLanguage('TZ')).toBe('sw')
  })

  it('returns pt for BR', () => {
    expect(getDefaultLanguage('BR')).toBe('pt')
  })

  it('returns en for unknown country', () => {
    expect(getDefaultLanguage('XX')).toBe('en')
  })
})

describe('Endonyms — getCountrySearchTerms', () => {
  it('returns multiple language variants for DE', () => {
    const terms = getCountrySearchTerms('DE')
    expect(terms).toContain('Germany')
    expect(terms).toContain('Deutschland')
    expect(terms).toContain('Allemagne')
    expect(terms).toContain('Ujerumani')
  })

  it('deduplicates identical names', () => {
    const terms = getCountrySearchTerms('GH')
    // Ghana is the same in en, de, fr, sw
    const uniqueTerms = new Set(terms)
    expect(terms.length).toBe(uniqueTerms.size)
  })

  it('returns country code for unknown country', () => {
    expect(getCountrySearchTerms('XX')).toEqual(['XX'])
  })
})

describe('Endonyms — searchCountries', () => {
  it('finds KE by "Kenya"', () => {
    expect(searchCountries('Kenya')).toContain('KE')
  })

  it('finds KE by German name "Kenia"', () => {
    expect(searchCountries('Kenia')).toContain('KE')
  })

  it('finds DE by partial match "deutsch"', () => {
    expect(searchCountries('deutsch')).toContain('DE')
  })

  it('returns empty for no match', () => {
    expect(searchCountries('xyzabc')).toHaveLength(0)
  })

  it('is case insensitive', () => {
    expect(searchCountries('KENYA')).toContain('KE')
  })
})

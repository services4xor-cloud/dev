/**
 * Countries Tests
 *
 * Validates:
 *   - All country configs have required fields
 *   - getCountryConfig returns valid config
 *   - getAllCountries returns all entries
 *   - Payment methods have required properties
 *   - Impact partners have required properties
 *   - Featured sectors have required properties
 */

import { COUNTRIES, getCountryConfig, getAllCountries, type CountryCode } from '@/lib/countries'

const ALL_CODES = Object.keys(COUNTRIES) as CountryCode[]

describe('Countries — COUNTRIES registry', () => {
  it('has at least 10 country configurations', () => {
    expect(ALL_CODES.length).toBeGreaterThanOrEqual(10)
  })

  it('includes KE, DE, US, NG, CH', () => {
    expect(ALL_CODES).toContain('KE')
    expect(ALL_CODES).toContain('DE')
    expect(ALL_CODES).toContain('US')
    expect(ALL_CODES).toContain('NG')
    expect(ALL_CODES).toContain('CH')
  })

  it('every config has required identity fields', () => {
    for (const code of ALL_CODES) {
      const config = COUNTRIES[code]
      expect(config.code).toBe(code)
      expect(config.name).toBeTruthy()
      expect(config.brandName).toMatch(/^Be/)
      expect(config.domain).toMatch(/\.com$/)
      expect(config.flag).toBeTruthy()
      expect(config.currency).toBeTruthy()
      expect(config.currencySymbol).toBeTruthy()
      expect(config.locale).toBeTruthy()
      expect(config.phonePrefix).toMatch(/^\+\d+$/)
      expect(config.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it('every config has hero content', () => {
    for (const code of ALL_CODES) {
      const config = COUNTRIES[code]
      expect(config.heroTagline.length).toBeGreaterThan(5)
      expect(config.heroSubtext.length).toBeGreaterThan(10)
      expect(config.popularSearches.length).toBeGreaterThan(0)
      expect(config.statsBar.length).toBeGreaterThan(0)
    }
  })
})

describe('Countries — payment methods', () => {
  it('every country has at least one payment method', () => {
    for (const code of ALL_CODES) {
      const config = COUNTRIES[code]
      expect(config.paymentMethods.length).toBeGreaterThan(0)
    }
  })

  it('every payment method has required fields', () => {
    for (const code of ALL_CODES) {
      for (const method of COUNTRIES[code].paymentMethods) {
        expect(method.id).toBeTruthy()
        expect(method.name).toBeTruthy()
        expect(method.logo).toBeTruthy()
        expect(method.description).toBeTruthy()
        expect(method.currencies.length).toBeGreaterThan(0)
      }
    }
  })

  it('Kenya has M-Pesa as a payment method', () => {
    const ke = COUNTRIES.KE
    const mpesa = ke.paymentMethods.find((m) => m.id === 'mpesa')
    expect(mpesa).toBeDefined()
    expect(mpesa!.currencies).toContain('KES')
  })

  it('Germany has SEPA as a payment method', () => {
    const de = COUNTRIES.DE
    const sepa = de.paymentMethods.find((m) => m.id === 'sepa')
    expect(sepa).toBeDefined()
    expect(sepa!.currencies).toContain('EUR')
  })
})

describe('Countries — impact partners', () => {
  it('every country has an impact partner', () => {
    for (const code of ALL_CODES) {
      const partner = COUNTRIES[code].impactPartner
      expect(partner.name).toBeTruthy()
      expect(partner.fullName).toBeTruthy()
      expect(partner.tagline).toBeTruthy()
      expect(partner.sharePercent).toBeTruthy()
      expect(partner.contributionAmount).toBeTruthy()
      expect(partner.pillars.length).toBeGreaterThan(0)
    }
  })

  it('Kenya partner is UTAMADUNI', () => {
    expect(COUNTRIES.KE.impactPartner.name).toBe('UTAMADUNI')
  })
})

describe('Countries — featured sectors', () => {
  it('every country has at least 3 sectors', () => {
    for (const code of ALL_CODES) {
      expect(COUNTRIES[code].featuredSectors.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('every sector has id, name, emoji, count', () => {
    for (const code of ALL_CODES) {
      for (const sector of COUNTRIES[code].featuredSectors) {
        expect(sector.id).toBeTruthy()
        expect(sector.name).toBeTruthy()
        expect(sector.emoji).toBeTruthy()
        expect(sector.count).toBeGreaterThan(0)
      }
    }
  })
})

describe('Countries — getCountryConfig', () => {
  it('returns a valid config', () => {
    const config = getCountryConfig()
    expect(config.code).toBeTruthy()
    expect(config.name).toBeTruthy()
    expect(config.brandName).toMatch(/^Be/)
  })

  it('defaults to KE when env is not set', () => {
    // Default env is KE per CLAUDE.md
    const config = getCountryConfig()
    expect(config.code).toBe('KE')
  })
})

describe('Countries — getAllCountries', () => {
  it('returns all configs', () => {
    const all = getAllCountries()
    expect(all.length).toBe(ALL_CODES.length)
  })

  it('every entry is a valid config', () => {
    for (const config of getAllCountries()) {
      expect(config.code).toBeTruthy()
      expect(config.brandName).toMatch(/^Be/)
    }
  })
})

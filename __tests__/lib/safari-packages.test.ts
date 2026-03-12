/**
 * Safari Packages Tests
 *
 * Validates:
 *   - Package data integrity (required fields)
 *   - Filter by type works
 *   - Lookup by ID works
 *   - Price formatting
 */

import {
  SAFARI_PACKAGES,
  getPackagesByType,
  getPackageById,
  formatPackagePrice,
} from '@/lib/safari-packages'

describe('Safari Packages — data integrity', () => {
  it('exports at least 5 packages', () => {
    expect(SAFARI_PACKAGES.length).toBeGreaterThanOrEqual(5)
  })

  it('every package has required fields', () => {
    for (const pkg of SAFARI_PACKAGES) {
      expect(pkg.id).toBeTruthy()
      expect(pkg.name).toBeTruthy()
      expect(pkg.provider).toBeTruthy()
      expect(pkg.type).toBeTruthy()
      expect(pkg.duration).toBeTruthy()
      expect(pkg.maxGuests).toBeGreaterThan(0)
      expect(pkg.destination).toBeTruthy()
      expect(pkg.includes.length).toBeGreaterThan(0)
      expect(pkg.highlights.length).toBeGreaterThan(0)
      expect(pkg.days.length).toBeGreaterThan(0)
      expect(pkg.status).toMatch(/^(available|coming_soon)$/)
    }
  })

  it('every day entry has day, title, description, meals', () => {
    for (const pkg of SAFARI_PACKAGES) {
      for (const day of pkg.days) {
        expect(day.day).toBeGreaterThan(0)
        expect(day.title).toBeTruthy()
        expect(day.description).toBeTruthy()
        expect(day.meals).toBeTruthy()
      }
    }
  })

  it('no duplicate IDs', () => {
    const ids = SAFARI_PACKAGES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Safari Packages — getPackagesByType', () => {
  it('returns wildlife safari packages', () => {
    const safaris = getPackagesByType('wildlife_safari')
    expect(safaris.length).toBeGreaterThan(0)
    safaris.forEach((p) => expect(p.type).toBe('wildlife_safari'))
  })

  it('returns deep sea fishing packages', () => {
    const fishing = getPackagesByType('deep_sea_fishing')
    expect(fishing.length).toBeGreaterThan(0)
    fishing.forEach((p) => expect(p.type).toBe('deep_sea_fishing'))
  })

  it('returns empty array for unknown type', () => {
    const result = getPackagesByType('unknown' as never)
    expect(result).toEqual([])
  })
})

describe('Safari Packages — getPackageById', () => {
  it('finds existing package by ID', () => {
    const pkg = getPackageById('victoria-deep-sea')
    expect(pkg).toBeDefined()
    expect(pkg!.provider).toBe('Victoria Paradise')
  })

  it('returns undefined for unknown ID', () => {
    expect(getPackageById('nonexistent')).toBeUndefined()
  })
})

describe('Safari Packages — formatPackagePrice', () => {
  it('formats EUR price', () => {
    const pkg = SAFARI_PACKAGES.find((p) => p.priceEUR)!
    expect(formatPackagePrice(pkg)).toMatch(/^€/)
  })

  it('formats USD price', () => {
    const pkg = SAFARI_PACKAGES.find((p) => p.priceUSD && !p.priceEUR)!
    expect(formatPackagePrice(pkg)).toMatch(/^\$/)
  })

  it('returns "Price on request" for no-price package', () => {
    const result = formatPackagePrice({
      ...SAFARI_PACKAGES[0],
      priceEUR: undefined,
      priceUSD: undefined,
      priceKES: undefined,
    })
    expect(result).toBe('Price on request')
  })
})

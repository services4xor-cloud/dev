/**
 * Offerings Engine Tests
 *
 * Validates:
 *   - Destination recommendations sorted by route strength
 *   - Country offerings return correct data
 *   - Purpose filtering
 *   - Purpose availability
 */

import {
  getRecommendedDestinations,
  getCountryOfferings,
  getOfferingsByPurpose,
  getPurposeAvailability,
  OFFERING_PURPOSES,
} from '@/lib/offerings'

describe('Offerings — OFFERING_PURPOSES', () => {
  it('has 3 purposes: travel, professional, business', () => {
    expect(OFFERING_PURPOSES).toHaveLength(3)
    const ids = OFFERING_PURPOSES.map((p) => p.id)
    expect(ids).toContain('travel')
    expect(ids).toContain('professional')
    expect(ids).toContain('business')
  })

  it('each purpose has id, label, icon, description, pioneerTypes', () => {
    for (const purpose of OFFERING_PURPOSES) {
      expect(purpose.id).toBeTruthy()
      expect(purpose.label).toBeTruthy()
      expect(purpose.icon).toBeTruthy()
      expect(purpose.description).toBeTruthy()
      expect(purpose.pioneerTypes.length).toBeGreaterThan(0)
    }
  })
})

describe('Offerings — getRecommendedDestinations', () => {
  it('returns destinations for KE excluding KE itself', () => {
    const destinations = getRecommendedDestinations('KE')
    expect(destinations.length).toBeGreaterThan(0)
    for (const d of destinations) {
      expect(d.country.code).not.toBe('KE')
    }
  })

  it('sorts by route strength (direct first)', () => {
    const destinations = getRecommendedDestinations('KE')
    const strengths = destinations.map((d) => d.routeStrength)
    const order = { direct: 0, partner: 1, emerging: 2, none: 3 }
    for (let i = 1; i < strengths.length; i++) {
      expect(order[strengths[i]]).toBeGreaterThanOrEqual(order[strengths[i - 1]])
    }
  })

  it('includes relevantSectors, paymentRails, visaNote', () => {
    const destinations = getRecommendedDestinations('KE')
    for (const d of destinations) {
      expect(d.relevantSectors).toBeDefined()
      expect(d.paymentRails).toBeDefined()
      // visaNote can be null
    }
  })
})

describe('Offerings — getCountryOfferings', () => {
  it('returns KE offerings with experiences and eco-tourism', () => {
    const offerings = getCountryOfferings('KE')
    expect(offerings.experiences.length).toBeGreaterThan(0)
    expect(offerings.ecoTourism.length).toBeGreaterThan(0)
    expect(offerings.sectors.length).toBeGreaterThan(0)
  })

  it('returns DE offerings with sectors but no KE experiences', () => {
    const offerings = getCountryOfferings('DE')
    expect(offerings.experiences).toHaveLength(0)
    expect(offerings.ecoTourism).toHaveLength(0)
    expect(offerings.sectors.length).toBeGreaterThan(0)
  })
})

describe('Offerings — getOfferingsByPurpose', () => {
  it('travel purpose keeps experiences, removes trade corridors', () => {
    const travel = getOfferingsByPurpose('KE', 'travel')
    expect(travel.experiences.length).toBeGreaterThan(0)
    expect(travel.tradeCorridors).toHaveLength(0)
    expect(travel.sectors).toHaveLength(0)
  })

  it('professional purpose removes experiences and corridors', () => {
    const prof = getOfferingsByPurpose('KE', 'professional')
    expect(prof.experiences).toHaveLength(0)
    expect(prof.ecoTourism).toHaveLength(0)
    expect(prof.tradeCorridors).toHaveLength(0)
    expect(prof.sectors.length).toBeGreaterThan(0)
  })

  it('business purpose keeps corridors and sectors', () => {
    const biz = getOfferingsByPurpose('KE', 'business')
    expect(biz.experiences).toHaveLength(0)
    expect(biz.ecoTourism).toHaveLength(0)
  })
})

describe('Offerings — getPurposeAvailability', () => {
  it('returns availability for all 3 purposes', () => {
    const avail = getPurposeAvailability('KE')
    expect(avail).toHaveLength(3)
    for (const a of avail) {
      expect(a.purpose).toBeTruthy()
      expect(a.label).toBeTruthy()
      expect(typeof a.count).toBe('number')
      expect(typeof a.available).toBe('boolean')
    }
  })

  it('KE has travel content available', () => {
    const avail = getPurposeAvailability('KE')
    const travel = avail.find((a) => a.purpose === 'travel')!
    expect(travel.available).toBe(true)
    expect(travel.count).toBeGreaterThan(0)
  })
})

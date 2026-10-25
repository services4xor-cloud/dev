/**
 * Tests for lib/compare.ts: what connects compared countries and where they differ.
 */
import { bridgeCountries, compareCountries, connectedOfferings } from '@/lib/compare'
import type { OpportunityDTO } from '@/lib/opportunities'

function offering(id: string, countryCode: string, sector: string): OpportunityDTO {
  return {
    id,
    code: id,
    label: id,
    icon: '',
    lat: 0,
    lng: 0,
    properties: { kind: 'SERVICE', status: 'PUBLISHED', countryCode, sector },
  } as unknown as OpportunityDTO
}

describe('compareCountries', () => {
  test('needs at least two known countries', () => {
    expect(compareCountries(['KE'])).toBeNull()
    expect(compareCountries(['KE', 'ZZ'])).toBeNull()
    expect(compareCountries(['KE', 'ke'])).toBeNull()
  })

  test('Germany, Austria and Switzerland share German; Germany and Austria the euro', () => {
    const cmp = compareCountries(['DE', 'AT', 'CH'])!
    const german = cmp.shared.find((s) => s.kind === 'language' && s.key === 'de')
    expect(german?.codes.sort()).toEqual(['AT', 'CH', 'DE'])
    const euro = cmp.shared.find((s) => s.kind === 'currency')
    expect(euro?.key).toBe('EUR')
    expect(euro?.codes.sort()).toEqual(['AT', 'DE'])
    expect(cmp.routes).toHaveLength(3)
  })

  test('lists what only one country has, and the route between them', () => {
    const cmp = compareCountries(['KE', 'DE'])!
    expect(cmp.shared.some((s) => s.kind === 'language' && s.key === 'en')).toBe(true)
    expect(cmp.only.KE.languages).toContain('Swahili')
    expect(cmp.only.DE.languages).toContain('German')
    const route = cmp.routes[0]
    expect(route).toMatchObject({ from: 'KE', to: 'DE' })
    expect(route.distance).toMatch(/km$/)
  })

  test('caps the comparison at three countries', () => {
    expect(compareCountries(['KE', 'DE', 'CH', 'AT'])!.codes).toEqual(['KE', 'DE', 'CH'])
  })
})

describe('bridgeCountries', () => {
  test('highlights other German-speaking countries for DE + CH', () => {
    const cmp = compareCountries(['DE', 'CH'])!
    const bridges = bridgeCountries(cmp)
    expect(bridges.AT).toBeGreaterThan(0)
    expect(bridges.DE).toBeUndefined()
  })
})

describe('connectedOfferings', () => {
  test('finds offerings in the countries, in their strong sectors, and in bridge countries', () => {
    const cmp = compareCountries(['DE', 'CH'])!
    const list = connectedOfferings(
      [
        offering('in-de', 'DE', 'Nothing special'),
        offering('austria', 'AT', 'Nothing special'),
        offering('it-ke', 'KE', 'Technology and IT'),
        offering('unrelated', 'JP', 'Nothing special'),
      ],
      cmp
    )
    const ids = list.map((x) => x.offering.id)
    expect(ids).toEqual(expect.arrayContaining(['in-de', 'austria', 'it-ke']))
    expect(ids).not.toContain('unrelated')
    expect(list.find((x) => x.offering.id === 'in-de')?.reasons[0]).toBe('In Germany')
    expect(list.find((x) => x.offering.id === 'austria')?.reasons.join(' ')).toMatch(
      /Austria also speaks German/
    )
  })
})

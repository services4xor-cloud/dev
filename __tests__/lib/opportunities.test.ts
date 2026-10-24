/**
 * Tests for lib/opportunities.ts
 */
import { formatPrice, parseOpportunityInput, readProps, toDTO } from '@/lib/opportunities'

const base = { title: 'Safari', description: 'Five days', kind: 'JOURNEY', countryCode: 'ke' }

describe('parseOpportunityInput', () => {
  it('requires title, description, kind and country on create', () => {
    expect(parseOpportunityInput({}).error).toMatch(/title/)
    expect(parseOpportunityInput({ ...base, kind: 'NOPE' }).error).toMatch(/kind/)
    expect(parseOpportunityInput({ ...base, countryCode: 'XX' }).error).toMatch(/country/)
  })

  it('defaults the map position to the country capital', () => {
    const { data } = parseOpportunityInput(base)
    expect(data?.props.countryCode).toBe('KE')
    expect(typeof data?.lat).toBe('number')
    expect(typeof data?.lng).toBe('number')
  })

  it('accepts only https links', () => {
    expect(parseOpportunityInput({ ...base, accessUrl: 'http://x.com' }).error).toMatch(/https/)
    expect(parseOpportunityInput({ ...base, demoUrl: 'javascript:alert(1)' }).error).toMatch(
      /https/
    )
    expect(
      parseOpportunityInput({ ...base, accessUrl: 'https://studio.4xor.de' }).data?.props.accessUrl
    ).toBe('https://studio.4xor.de/')
  })

  it('validates price, unit, dates and capacity', () => {
    expect(parseOpportunityInput({ ...base, price: -1 }).error).toMatch(/price/)
    expect(parseOpportunityInput({ ...base, price: 10, priceUnit: 'DAY' }).error).toMatch(
      /priceUnit/
    )
    expect(parseOpportunityInput({ ...base, startsOn: '24.10.2026' }).error).toMatch(/startsOn/)
    expect(parseOpportunityInput({ ...base, capacity: 1.5 }).error).toMatch(/capacity/)
    const { data } = parseOpportunityInput({ ...base, price: 1350, priceUnit: 'PERSON' })
    expect(data?.props).toMatchObject({ price: 1350, currency: 'EUR', priceUnit: 'PERSON' })
  })

  it('leaves missing fields alone when partial', () => {
    const { data, error } = parseOpportunityInput({ title: 'New name' }, { partial: true })
    expect(error).toBeUndefined()
    expect(data?.label).toBe('New name')
    expect(data?.props.kind).toBeUndefined()
  })
})

describe('readProps and toDTO', () => {
  const node = {
    id: 'n1',
    label: 'Studio',
    icon: null,
    lat: 1,
    lng: 2,
    properties: { kind: 'SERVICE', status: 'PUBLISHED', accessUrl: 'https://studio.4xor.de/' },
  }

  it('treats legacy nodes as published experiences', () => {
    expect(readProps({ properties: null })).toMatchObject({
      kind: 'EXPERIENCE',
      status: 'PUBLISHED',
    })
  })

  it('strips the access link unless asked for', () => {
    expect(toDTO(node, null).accessUrl).toBeUndefined()
    expect(JSON.stringify(toDTO(node, null))).not.toContain('studio.4xor.de')
    expect(toDTO(node, null, { includeAccess: true }).accessUrl).toBe('https://studio.4xor.de/')
  })
})

describe('formatPrice', () => {
  it('formats amounts and units', () => {
    expect(formatPrice({})).toBeNull()
    expect(formatPrice({ price: 0 })).toBe('Free')
    expect(formatPrice({ price: 1350, currency: 'EUR', priceUnit: 'PERSON' })).toMatch(/1,350/)
  })
})

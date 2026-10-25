/**
 * Tests for lib/opportunities.ts
 */
import {
  formatPrice,
  parseOpportunityInput,
  projectLink,
  readProps,
  toDTO,
} from '@/lib/opportunities'

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
    code: 'studio',
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

describe('contactEmail', () => {
  const base2 = { title: 'Safari', description: 'Five days', kind: 'JOURNEY', countryCode: 'KE' }

  it('validates and keeps it private', () => {
    expect(parseOpportunityInput({ ...base2, contactEmail: 'nope' }).error).toMatch(/contactEmail/)
    const { data } = parseOpportunityInput({ ...base2, contactEmail: ' Me@4xor.com ' })
    expect(data?.props.contactEmail).toBe('me@4xor.com')
    const n = {
      id: 'n',
      code: 'x',
      label: 'x',
      icon: null,
      lat: 0,
      lng: 0,
      properties: { contactEmail: 'me@4xor.com' },
    }
    expect(JSON.stringify(toDTO(n, null))).not.toContain('me@4xor.com')
    expect(toDTO(n, null, { includeAccess: true }).contactEmail).toBe('me@4xor.com')
    const pub = { ...n, properties: { contactEmail: 'me@4xor.com', contactPublic: true } }
    expect(toDTO(pub, null).contactEmail).toBe('me@4xor.com')
  })
})

describe('projectLink', () => {
  it('keeps 4xor.com links inside the app on the 4xor page', () => {
    expect(projectLink('https://4xor.com/#4xor-social-media-automation')).toEqual({
      href: '/4xor#4xor-social-media-automation',
      internal: true,
    })
    expect(projectLink('https://www.4xor.com/')).toEqual({ href: '/4xor', internal: true })
  })

  it('leaves other links external', () => {
    expect(projectLink('https://bekenya.com/')).toEqual({
      href: 'https://bekenya.com/',
      internal: false,
    })
  })
})

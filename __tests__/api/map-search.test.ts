/**
 * Tests for app/api/map/search/route.ts — universal dimension search
 */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/map/search/route'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/map/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

interface Suggestion {
  dimension: string
  code: string
  label: string
  detail: string
  countryCount: number
}

describe('POST /api/map/search', () => {
  test('returns empty for query shorter than 2 chars', async () => {
    const res = await POST(makeRequest({ query: 'a' }))
    const data = await res.json()
    expect(data.suggestions).toEqual([])
  })

  test('"german" returns language + location suggestions', async () => {
    const res = await POST(makeRequest({ query: 'german' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    const dims = data.suggestions.map((s) => s.dimension)
    expect(dims).toContain('language') // German language
    expect(dims).toContain('location') // Germany country

    const langSuggestion = data.suggestions.find(
      (s) => s.dimension === 'language' && s.label === 'German'
    )
    expect(langSuggestion).toBeDefined()
    expect(langSuggestion!.countryCount).toBeGreaterThanOrEqual(3) // DE, AT, CH+
  })

  test('"islam" returns faith suggestion', async () => {
    const res = await POST(makeRequest({ query: 'islam' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    const faithHit = data.suggestions.find((s) => s.dimension === 'faith' && s.code === 'islam')
    expect(faithHit).toBeDefined()
    expect(faithHit!.label).toBe('Islam')
    expect(faithHit!.countryCount).toBeGreaterThanOrEqual(40)
  })

  test('"tech" returns sector suggestions', async () => {
    const res = await POST(makeRequest({ query: 'tech' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    const sectorHits = data.suggestions.filter((s) => s.dimension === 'sector')
    expect(sectorHits.length).toBeGreaterThanOrEqual(1)
    // At least one sector containing "tech"
    expect(sectorHits[0].label.toLowerCase()).toContain('tech')
  })

  test('"eur" returns currency suggestion', async () => {
    const res = await POST(makeRequest({ query: 'eur' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    const currencyHit = data.suggestions.find((s) => s.dimension === 'currency')
    expect(currencyHit).toBeDefined()
    expect(currencyHit!.label).toBe('EUR')
    expect(currencyHit!.countryCount).toBeGreaterThanOrEqual(10)
  })

  test('"east africa" returns location suggestion', async () => {
    const res = await POST(makeRequest({ query: 'east africa' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    const locationHit = data.suggestions.find(
      (s) => s.dimension === 'location' && s.detail === 'Region'
    )
    expect(locationHit).toBeDefined()
    expect(locationHit!.countryCount).toBeGreaterThanOrEqual(2)
  })

  test('"maasai" returns culture suggestion', async () => {
    const res = await POST(makeRequest({ query: 'maasai' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    const cultureHit = data.suggestions.find((s) => s.dimension === 'culture')
    expect(cultureHit).toBeDefined()
    expect(cultureHit!.label).toBe('Maasai')
  })

  test('"suaheli" matches via searchAliases', async () => {
    const res = await POST(makeRequest({ query: 'suaheli' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    const langHit = data.suggestions.find((s) => s.dimension === 'language')
    expect(langHit).toBeDefined()
    expect(langHit!.label).toBe('Swahili')
  })

  test('results are sorted by countryCount desc', async () => {
    const res = await POST(makeRequest({ query: 'ch' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    for (let i = 1; i < data.suggestions.length; i++) {
      expect(data.suggestions[i].countryCount).toBeLessThanOrEqual(
        data.suggestions[i - 1].countryCount
      )
    }
  })

  test('max 15 suggestions returned', async () => {
    const res = await POST(makeRequest({ query: 'an' }))
    const data = (await res.json()) as { suggestions: Suggestion[] }

    expect(data.suggestions.length).toBeLessThanOrEqual(15)
  })

  test('rejects invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/map/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

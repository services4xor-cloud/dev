/**
 * Tests for app/api/map/filter/route.ts
 * Now tests against COUNTRY_OPTIONS static data (no Prisma dependency)
 */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/map/filter/route'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/map/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/map/filter', () => {
  test('returns Swahili-speaking countries for language filter "sw"', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'sw' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.totalMatches).toBeGreaterThanOrEqual(2)
    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('KE') // Kenya has Swahili
    expect(codes).toContain('TZ') // Tanzania has Swahili
    expect(data.countries[0]).toHaveProperty('lat')
    expect(data.countries[0]).toHaveProperty('lng')
    expect(data.countries[0]).toHaveProperty('matchStrength', 1.0)
  })

  test('returns countries for language name search "swahili"', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'swahili' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('KE')
    expect(codes).toContain('TZ')
  })

  test('returns German-speaking countries for language "de"', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'de' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('DE') // Germany
    expect(codes).toContain('AT') // Austria
    expect(codes).toContain('CH') // Switzerland
  })

  test('filters by currency code', async () => {
    const req = makeRequest({ filters: [{ dimension: 'currency', nodeCode: 'eur' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('DE')
    expect(codes).toContain('FR')
    expect(codes).not.toContain('KE') // Kenya uses KES
  })

  test('filters by sector (case-insensitive substring)', async () => {
    const req = makeRequest({ filters: [{ dimension: 'sector', nodeCode: 'tech' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.totalMatches).toBeGreaterThanOrEqual(1)
    // Countries with "Technology" or "Tech" in their topSectors
    expect(data.countries.length).toBeGreaterThan(0)
  })

  test('intersects multiple filters', async () => {
    // Countries that speak German AND use EUR
    const req = makeRequest({
      filters: [
        { dimension: 'language', nodeCode: 'de' },
        { dimension: 'currency', nodeCode: 'eur' },
      ],
    })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('DE') // Germany: German + EUR ✓
    expect(codes).toContain('AT') // Austria: German + EUR ✓
    expect(codes).not.toContain('CH') // Switzerland: German + CHF ✗
  })

  test('returns empty for culture filter (not yet supported)', async () => {
    const req = makeRequest({ filters: [{ dimension: 'culture', nodeCode: 'maasai' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.countries).toEqual([])
    expect(data.totalMatches).toBe(0)
  })

  test('returns empty for unknown dimension', async () => {
    const req = makeRequest({ filters: [{ dimension: 'notreal', nodeCode: 'xyz' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.countries).toEqual([])
    expect(data.totalMatches).toBe(0)
  })

  test('returns empty for no filters', async () => {
    const req = makeRequest({ filters: [] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.countries).toEqual([])
    expect(data.totalMatches).toBe(0)
  })

  test('rejects invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/map/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  test('rejects too many filters', async () => {
    const filters = Array.from({ length: 11 }, (_, i) => ({
      dimension: 'language',
      nodeCode: `lang${i}`,
    }))
    const req = makeRequest({ filters })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  test('searchAliases: "suaheli" (German for Swahili) matches KE/TZ', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'suaheli' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('KE')
    expect(codes).toContain('TZ')
  })

  test('searchAliases: "allemand" (French for German) matches DE/AT/CH', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'allemand' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('DE')
    expect(codes).toContain('AT')
    expect(codes).toContain('CH')
  })

  test('English filter includes Germany (widely spoken)', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'en' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('DE') // Germany — high English proficiency
    expect(codes).toContain('SE') // Sweden — very high English proficiency
    expect(codes).toContain('NL') // Netherlands — very high English proficiency
    expect(codes).not.toContain('JP') // Japan — low English proficiency
  })

  test('suggestions: "sw" returns Swahili suggestion with country count', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'sw' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.suggestions).toBeDefined()
    expect(data.suggestions.length).toBeGreaterThanOrEqual(1)
    const swahiliSuggestion = data.suggestions.find((s: { code: string }) => s.code === 'sw')
    expect(swahiliSuggestion).toBeDefined()
    expect(swahiliSuggestion.name).toBe('Swahili')
    expect(swahiliSuggestion.countryCount).toBeGreaterThanOrEqual(3)
  })

  test('suggestions: "sw" returns both Swahili and Swedish', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'sw' }] })
    const res = await POST(req)
    const data = await res.json()

    const names = data.suggestions.map((s: { name: string }) => s.name)
    expect(names).toContain('Swahili')
    expect(names).toContain('Swedish') // "sw" matches "Swedish" substring
  })

  test('suggestions: sector filter returns matched sector names', async () => {
    const req = makeRequest({ filters: [{ dimension: 'sector', nodeCode: 'tourism' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.suggestions.length).toBeGreaterThanOrEqual(1)
    // All suggestions should contain "tourism" (case-insensitive)
    for (const s of data.suggestions) {
      expect((s as { name: string }).name.toLowerCase()).toContain('tourism')
    }
  })

  test('empty filters returns empty suggestions', async () => {
    const req = makeRequest({ filters: [] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.suggestions).toEqual([])
  })

  test('faith filter: "islam" returns Muslim-majority countries', async () => {
    const req = makeRequest({ filters: [{ dimension: 'faith', nodeCode: 'islam' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('SA') // Saudi Arabia
    expect(codes).toContain('EG') // Egypt
    expect(codes).toContain('ID') // Indonesia
    expect(codes).not.toContain('BR') // Brazil — Christianity
    expect(data.totalMatches).toBeGreaterThanOrEqual(40) // ~50+ Muslim countries
  })

  test('faith filter: "christianity" returns Christian-majority countries', async () => {
    const req = makeRequest({ filters: [{ dimension: 'faith', nodeCode: 'christianity' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('BR') // Brazil
    expect(codes).toContain('KE') // Kenya
    expect(codes).toContain('DE') // Germany
    expect(data.totalMatches).toBeGreaterThanOrEqual(80) // Most countries
  })

  test('faith filter: "buddh" matches Buddhism (substring)', async () => {
    const req = makeRequest({ filters: [{ dimension: 'faith', nodeCode: 'buddh' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('TH') // Thailand
    expect(codes).toContain('JP') // Japan
    expect(codes).toContain('LK') // Sri Lanka
  })

  test('faith suggestions: "islam" returns suggestion with country count', async () => {
    const req = makeRequest({ filters: [{ dimension: 'faith', nodeCode: 'islam' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.suggestions.length).toBeGreaterThanOrEqual(1)
    const islamSuggestion = data.suggestions.find((s: { code: string }) => s.code === 'islam')
    expect(islamSuggestion).toBeDefined()
    expect(islamSuggestion.name).toBe('Islam')
    expect(islamSuggestion.countryCount).toBeGreaterThanOrEqual(40)
  })

  test('faith + language intersection works', async () => {
    // Countries that are Muslim AND speak Arabic
    const req = makeRequest({
      filters: [
        { dimension: 'faith', nodeCode: 'islam' },
        { dimension: 'language', nodeCode: 'ar' },
      ],
    })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('SA') // Saudi Arabia: Islam + Arabic ✓
    expect(codes).toContain('EG') // Egypt: Islam + Arabic ✓
    expect(codes).not.toContain('ID') // Indonesia: Islam but no Arabic
  })

  test('response shape matches MapCountry interface', async () => {
    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'en' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.countries.length).toBeGreaterThan(0)
    const country = data.countries[0]
    expect(country).toHaveProperty('code')
    expect(country).toHaveProperty('name')
    expect(country).toHaveProperty('lat')
    expect(country).toHaveProperty('lng')
    expect(country).toHaveProperty('matchStrength')
    expect(typeof country.lat).toBe('number')
    expect(typeof country.lng).toBe('number')
  })
})

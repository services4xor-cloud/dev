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

  test('location filter matches by region or country name', async () => {
    const req = makeRequest({ filters: [{ dimension: 'location', nodeCode: 'east africa' }] })
    const res = await POST(req)
    const data = await res.json()

    const codes = data.countries.map((c: { code: string }) => c.code)
    expect(codes).toContain('KE')
    expect(codes).toContain('TZ')
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

/**
 * Tests for discovery API routes:
 *   app/api/discovery/route.ts          (POST)
 *   app/api/discovery/options/route.ts  (GET)
 */
import { NextRequest } from 'next/server'

// ---- Mocks (must come before route imports) ----

jest.mock('@/lib/db', () => ({
  db: {
    node: { findMany: jest.fn(), findUnique: jest.fn() },
    edge: { findMany: jest.fn() },
  },
}))

// ---- Imports ----

import { GET as getOptions } from '@/app/api/discovery/options/route'
import { POST as discoverCorridors } from '@/app/api/discovery/route'

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/discovery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockCountryNode = {
  id: 'node-de',
  code: 'DE',
  label: 'Germany',
  icon: '🇩🇪',
  type: 'COUNTRY',
  active: true,
}

const mockLanguageNode = {
  id: 'node-lang-de',
  code: 'de',
  label: 'German',
  icon: '💬',
  type: 'LANGUAGE',
  active: true,
}

const mockSectorNode = {
  id: 'node-sector-tech',
  code: 'tech',
  label: 'Technology',
  icon: '⚙️',
  type: 'SECTOR',
  active: true,
}

// ---- GET /api/discovery/options ----

describe('GET /api/discovery/options', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns countries, languages, and sectors arrays', async () => {
    getDb()
      .node.findMany.mockResolvedValueOnce([mockCountryNode]) // countries
      .mockResolvedValueOnce([mockLanguageNode]) // languages
      .mockResolvedValueOnce([mockSectorNode]) // sectors

    const res = await getOptions()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data.countries)).toBe(true)
    expect(Array.isArray(data.languages)).toBe(true)
    expect(Array.isArray(data.sectors)).toBe(true)

    expect(data.countries[0]).toMatchObject({ code: 'DE', label: 'Germany', icon: '🇩🇪' })
    expect(data.languages[0]).toMatchObject({ code: 'de', label: 'German', icon: '💬' })
    expect(data.sectors[0]).toMatchObject({ code: 'tech', label: 'Technology', icon: '⚙️' })
  })

  test('returns empty arrays when no nodes exist', async () => {
    getDb()
      .node.findMany.mockResolvedValueOnce([]) // countries
      .mockResolvedValueOnce([]) // languages
      .mockResolvedValueOnce([]) // sectors

    const res = await getOptions()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.countries).toHaveLength(0)
    expect(data.languages).toHaveLength(0)
    expect(data.sectors).toHaveLength(0)
  })

  test('falls back to default icons when node icon is null', async () => {
    getDb()
      .node.findMany.mockResolvedValueOnce([{ ...mockCountryNode, icon: null }])
      .mockResolvedValueOnce([{ ...mockLanguageNode, icon: null }])
      .mockResolvedValueOnce([{ ...mockSectorNode, icon: null }])

    const res = await getOptions()
    const data = await res.json()

    expect(data.countries[0].icon).toBe('🌍')
    expect(data.languages[0].icon).toBe('💬')
    expect(data.sectors[0].icon).toBe('⚙️')
  })
})

// ---- POST /api/discovery ----

describe('POST /api/discovery', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns corridors array for valid country', async () => {
    const originNode = { id: 'node-ke', code: 'KE', label: 'Kenya', icon: '🇰🇪' }
    getDb().node.findUnique.mockResolvedValue(originNode)
    getDb()
      .edge.findMany.mockResolvedValueOnce([{ toId: 'node-de' }]) // CORRIDOR edges
      .mockResolvedValueOnce([]) // lang edges for cards
      .mockResolvedValueOnce([]) // sector edges for cards
    getDb().node.findMany.mockResolvedValue([mockCountryNode])

    const res = await discoverCorridors(makePostRequest({ country: 'KE' }))
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data.corridors)).toBe(true)
    expect(data.corridors[0]).toMatchObject({ code: 'DE', label: 'Germany' })
    expect(typeof data.corridors[0].matchScore).toBe('number')
  })

  test('returns empty corridors when origin country not found', async () => {
    getDb().node.findUnique.mockResolvedValue(null)

    const res = await discoverCorridors(makePostRequest({ country: 'XX' }))
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.corridors).toHaveLength(0)
  })

  test('returns empty corridors when no corridor edges exist for country', async () => {
    getDb().node.findUnique.mockResolvedValue({ id: 'node-ke' })
    getDb().edge.findMany.mockResolvedValueOnce([]) // no CORRIDOR edges

    const res = await discoverCorridors(makePostRequest({ country: 'KE' }))
    const data = await res.json()
    expect(data.corridors).toHaveLength(0)
  })

  test('returns all active country nodes when no country provided', async () => {
    getDb().node.findMany.mockResolvedValueOnce([mockCountryNode]) // final countries query
    getDb()
      .edge.findMany.mockResolvedValueOnce([]) // lang edges for cards
      .mockResolvedValueOnce([]) // sector edges for cards

    const res = await discoverCorridors(makePostRequest({}))
    const data = await res.json()
    expect(Array.isArray(data.corridors)).toBe(true)
  })

  test('filters by language when languages param provided', async () => {
    getDb().node.findUnique.mockResolvedValue({ id: 'node-ke' })
    getDb()
      .edge.findMany.mockResolvedValueOnce([{ toId: 'node-de' }]) // CORRIDOR edges
      .mockResolvedValueOnce([{ fromId: 'node-de' }]) // OFFICIAL_LANG edges
      .mockResolvedValueOnce([]) // lang edges for cards
      .mockResolvedValueOnce([]) // sector edges for cards

    getDb()
      .node.findMany.mockResolvedValueOnce([mockLanguageNode]) // language nodes
      .mockResolvedValueOnce([mockCountryNode]) // final countries

    const res = await discoverCorridors(makePostRequest({ country: 'KE', languages: ['de'] }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.corridors)).toBe(true)
  })

  test('returns empty corridors when language filter matches no destinations', async () => {
    getDb().node.findUnique.mockResolvedValue({ id: 'node-ke' })
    getDb()
      .edge.findMany.mockResolvedValueOnce([{ toId: 'node-de' }]) // CORRIDOR edges
      .mockResolvedValueOnce([]) // OFFICIAL_LANG edges (no match)

    getDb().node.findMany.mockResolvedValueOnce([mockLanguageNode])

    const res = await discoverCorridors(makePostRequest({ country: 'KE', languages: ['sw'] }))
    const data = await res.json()
    expect(data.corridors).toHaveLength(0)
  })

  test('treats non-string country as no country filter', async () => {
    getDb().node.findMany.mockResolvedValueOnce([mockCountryNode])
    getDb()
      .edge.findMany.mockResolvedValueOnce([]) // lang edges for cards
      .mockResolvedValueOnce([]) // sector edges for cards

    const res = await discoverCorridors(makePostRequest({ country: 123 }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.corridors)).toBe(true)
  })

  test('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/discovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })
    const res = await discoverCorridors(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Invalid JSON')
  })

  test('matchScore is 1 when no filter dimensions requested', async () => {
    getDb().node.findUnique.mockResolvedValue({ id: 'node-ke' })
    getDb()
      .edge.findMany.mockResolvedValueOnce([{ toId: 'node-de' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    getDb().node.findMany.mockResolvedValue([mockCountryNode])

    const res = await discoverCorridors(makePostRequest({ country: 'KE' }))
    const data = await res.json()
    expect(data.corridors[0].matchScore).toBe(1)
  })
})

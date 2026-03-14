/**
 * Tests for app/api/map/filter/route.ts
 */
import { NextRequest } from 'next/server'

// Mock filterCountries from graph lib
jest.mock('@/lib/graph', () => ({
  filterCountries: jest.fn(),
}))

// Mock @/lib/db (required by transitive deps)
jest.mock('@/lib/db', () => ({
  db: {
    node: { findUnique: jest.fn(), findMany: jest.fn() },
    edge: { findMany: jest.fn(), upsert: jest.fn(), deleteMany: jest.fn() },
  },
}))

import { POST } from '@/app/api/map/filter/route'
import { filterCountries } from '@/lib/graph'

const mockFilterCountries = filterCountries as jest.MockedFunction<typeof filterCountries>

function mockNode(overrides: Record<string, unknown>) {
  return {
    userId: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/map/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/map/filter', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns country codes for language filter', async () => {
    mockFilterCountries.mockResolvedValue([
      mockNode({
        id: '1',
        type: 'COUNTRY',
        code: 'KE',
        label: 'Kenya',
        lat: -1.286,
        lng: 36.817,
        active: true,
        properties: null,
        icon: null,
        labelKey: null,
      }) as never,
      mockNode({
        id: '2',
        type: 'COUNTRY',
        code: 'TZ',
        label: 'Tanzania',
        lat: -6.369,
        lng: 34.889,
        active: true,
        properties: null,
        icon: null,
        labelKey: null,
      }) as never,
    ])

    const req = makeRequest({ filters: [{ dimension: 'language', nodeCode: 'sw' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.countries).toHaveLength(2)
    expect(data.countries[0]).toMatchObject({ code: 'KE', name: 'Kenya', matchStrength: 1.0 })
    expect(data.countries[1]).toMatchObject({ code: 'TZ', name: 'Tanzania' })
    expect(data.totalMatches).toBe(2)

    expect(mockFilterCountries).toHaveBeenCalledWith([
      { dimensionType: 'LANGUAGE', dimensionCode: 'sw', relation: 'OFFICIAL_LANG' },
    ])
  })

  test('returns empty array for unknown dimension type', async () => {
    mockFilterCountries.mockResolvedValue([])

    const req = makeRequest({ filters: [{ dimension: 'culture', nodeCode: 'maasai' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    // culture is not in DIMENSION_TO_EDGE, so filters become [] → filterCountries([])
    expect(data.countries).toEqual([])
    expect(data.totalMatches).toBe(0)
  })

  test('returns empty countries for completely unknown dimension', async () => {
    mockFilterCountries.mockResolvedValue([])

    const req = makeRequest({ filters: [{ dimension: 'notreal', nodeCode: 'xyz' }] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.countries).toEqual([])
    // filterCountries called with empty array (unknown dimension filtered out)
    expect(mockFilterCountries).toHaveBeenCalledWith([])
  })

  test('handles multiple filters', async () => {
    mockFilterCountries.mockResolvedValue([
      mockNode({
        id: '1',
        type: 'COUNTRY',
        code: 'KE',
        label: 'Kenya',
        lat: -1.286,
        lng: 36.817,
        active: true,
        properties: null,
        icon: null,
        labelKey: null,
      }) as never,
    ])

    const req = makeRequest({
      filters: [
        { dimension: 'language', nodeCode: 'sw' },
        { dimension: 'faith', nodeCode: 'islam' },
      ],
    })
    const res = await POST(req)
    const data = await res.json()

    expect(mockFilterCountries).toHaveBeenCalledWith([
      { dimensionType: 'LANGUAGE', dimensionCode: 'sw', relation: 'OFFICIAL_LANG' },
      { dimensionType: 'FAITH', dimensionCode: 'islam', relation: 'DOMINANT_FAITH' },
    ])
    expect(data.countries).toHaveLength(1)
  })

  test('includes lat/lng in response', async () => {
    mockFilterCountries.mockResolvedValue([
      mockNode({
        id: '1',
        type: 'COUNTRY',
        code: 'DE',
        label: 'Germany',
        lat: 51.165,
        lng: 10.451,
        active: true,
        properties: null,
        icon: null,
        labelKey: null,
      }) as never,
    ])

    const req = makeRequest({ filters: [] })
    const res = await POST(req)
    const data = await res.json()

    expect(data.countries[0]).toMatchObject({
      code: 'DE',
      name: 'Germany',
      lat: 51.165,
      lng: 10.451,
      matchStrength: 1.0,
    })
  })
})

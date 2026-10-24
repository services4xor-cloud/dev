/**
 * Tests for app/api/country/[code]/insights/route.ts
 */
import { NextRequest } from 'next/server'

jest.mock('@/lib/country-insights', () => ({
  getCountryInsights: jest.fn(),
}))
jest.mock('@/lib/db', () => ({
  db: { node: { count: jest.fn() }, edge: { count: jest.fn() } },
}))

import { GET } from '@/app/api/country/[code]/insights/route'
import { getCountryInsights } from '@/lib/country-insights'
import { db } from '@/lib/db'

const mockInsights = getCountryInsights as jest.Mock
const call = (code: string) =>
  GET(new NextRequest(`http://localhost/api/country/${code}/insights`), {
    params: Promise.resolve({ code }),
  })

beforeEach(() => jest.clearAllMocks())

test('rejects a malformed code', async () => {
  const res = await call('kenya')
  expect(res.status).toBe(400)
  expect(mockInsights).not.toHaveBeenCalled()
})

test('404 for an unknown country', async () => {
  mockInsights.mockResolvedValue(null)
  ;(db.node.count as jest.Mock).mockResolvedValue(0)
  ;(db.edge.count as jest.Mock).mockResolvedValue(0)
  expect((await call('ZZ')).status).toBe(404)
})

test('adds real Be[X] counts and caches publicly', async () => {
  mockInsights.mockResolvedValue({ code: 'KE', name: 'Kenya' })
  ;(db.node.count as jest.Mock).mockResolvedValue(4)
  ;(db.edge.count as jest.Mock).mockRejectedValue(new Error('db down'))
  const res = await call('ke')
  expect(res.status).toBe(200)
  expect(mockInsights).toHaveBeenCalledWith('KE')
  await expect(res.json()).resolves.toEqual({
    code: 'KE',
    name: 'Kenya',
    bex: { offerings: 4, explorers: 0 },
  })
  expect(res.headers.get('Cache-Control')).toContain('s-maxage=600')
})

/**
 * Tests for lib/country-insights.ts with the public APIs mocked.
 */
import {
  countryNeighbours,
  currencyName,
  fetchIndicator,
  fetchWikipediaSummary,
  getCountryInsights,
} from '@/lib/country-insights'

function respond(body: unknown, ok = true) {
  return Promise.resolve({ ok, json: () => Promise.resolve(body) } as Response)
}

const fetchMock = jest.fn()
beforeAll(() => {
  globalThis.fetch = fetchMock as unknown as typeof fetch
})
beforeEach(() => {
  fetchMock.mockReset()
})

describe('fetchIndicator', () => {
  test('reads the latest value and its year', async () => {
    fetchMock.mockReturnValue(respond([{}, [{ date: '2023', value: 5.6 }]]))
    await expect(fetchIndicator('KE', 'NY.GDP.MKTP.KD.ZG')).resolves.toEqual({
      value: 5.6,
      year: '2023',
    })
    expect(fetchMock.mock.calls[0][0]).toContain('/country/KE/indicator/NY.GDP.MKTP.KD.ZG')
  })

  test('returns null for missing data or a failed request', async () => {
    fetchMock.mockReturnValueOnce(respond([{ message: 'invalid' }]))
    await expect(fetchIndicator('KE', 'X')).resolves.toBeNull()
    fetchMock.mockReturnValueOnce(respond(null, false))
    await expect(fetchIndicator('KE', 'X')).resolves.toBeNull()
    fetchMock.mockReturnValueOnce(Promise.reject(new Error('offline')))
    await expect(fetchIndicator('KE', 'X')).resolves.toBeNull()
  })
})

describe('fetchWikipediaSummary', () => {
  test('returns the extract and page link', async () => {
    fetchMock.mockReturnValue(
      respond({
        type: 'standard',
        extract: 'Kenya is a country.',
        content_urls: { desktop: { page: 'https://en.wikipedia.org/wiki/Kenya' } },
      })
    )
    await expect(fetchWikipediaSummary('Kenya')).resolves.toEqual({
      extract: 'Kenya is a country.',
      url: 'https://en.wikipedia.org/wiki/Kenya',
    })
  })

  test('skips disambiguation pages', async () => {
    fetchMock.mockReturnValue(respond({ type: 'disambiguation', extract: 'Georgia may refer to' }))
    await expect(fetchWikipediaSummary('Georgia')).resolves.toBeNull()
  })
})

describe('countryNeighbours', () => {
  test('Germany shares German with Austria and Switzerland, and the euro with France', () => {
    const { sharedLanguage, sharedCurrency } = countryNeighbours('DE')
    const lang = sharedLanguage.map((c) => c.code)
    expect(lang).toEqual(expect.arrayContaining(['AT', 'CH']))
    expect(sharedCurrency.map((c) => c.code)).toContain('FR')
    expect(lang).not.toContain('DE')
  })

  test('unknown codes have no neighbours', () => {
    expect(countryNeighbours('ZZ')).toEqual({ sharedLanguage: [], sharedCurrency: [] })
  })
})

describe('getCountryInsights', () => {
  test('returns null for an unknown country', async () => {
    await expect(getCountryInsights('ZZ')).resolves.toBeNull()
  })

  test('falls back to registry data when every API is down', async () => {
    fetchMock.mockReturnValue(Promise.reject(new Error('offline')))
    const data = await getCountryInsights('ke')
    expect(data?.code).toBe('KE')
    expect(data?.name).toBe('Kenya')
    expect(data?.indicators).toEqual({})
    expect(data?.summary).toBeNull()
    expect(data?.languages.length).toBeGreaterThan(0)
    expect(data?.capital).toBeNull()
    expect(data?.population).toBeNull()
    expect(data?.currency).toEqual({ code: 'KES', name: 'Kenyan Shilling', symbol: null })
    expect(data?.sources.map((s) => s.name)).toEqual(['World Bank Open Data'])
  })

  test('reads capital and population from the World Bank', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/country/CH?')) return respond([{}, [{ capitalCity: 'Bern' }]])
      if (url.includes('SP.POP.TOTL')) return respond([{}, [{ date: '2025', value: 9_092_436 }]])
      if (url.includes('NY.GDP.MKTP.CD')) return respond([{}, [{ date: '2025', value: 9e11 }]])
      if (url.includes('wikipedia')) return respond({ type: 'standard', extract: 'Switzerland…' })
      return respond([{}, []])
    })
    const data = await getCountryInsights('CH')
    expect(data?.capital).toBe('Bern')
    expect(data?.population).toBe(9_092_436)
    expect(data?.indicators).toEqual({ gdp: { value: 9e11, year: '2025' } })
    expect(data?.flagUrl).toBe('https://flagcdn.com/ch.svg')
    expect(data?.summary).toBe('Switzerland…')
  })
})

describe('currencyName', () => {
  test('names a currency from its code', () => {
    expect(currencyName('CHF')).toBe('Swiss Franc')
    expect(currencyName('??')).toBeNull()
  })
})

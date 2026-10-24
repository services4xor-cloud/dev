/**
 * Country insights for the map and the agent: live public data plus Be[X]'s own numbers.
 *
 * Live, read-only sources (no API key, cached for a day):
 *   - REST Countries via lib/country-api (name, flag, capital, languages, currency)
 *   - World Bank indicators API (economy, people, industry structure)
 *   - Wikipedia REST summary (one-paragraph description)
 * Be[X] data (real, from the database): published offerings and Explorers per country.
 * Shared language / currency neighbours come from the curated registry in
 * lib/country-selector, so the map can show "no borders, just differences".
 *
 * Every source is optional: a failing API leaves its fields null, never the page.
 */
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { getCountryData } from '@/lib/country-api'

const DAY = 24 * 60 * 60

/** World Bank indicator ids → our field names */
export const WB_INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD', // GDP, current US$
  gdpPerCapita: 'NY.GDP.PCAP.CD', // GDP per capita, current US$
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG', // GDP growth, annual %
  agriculture: 'NV.AGR.TOTL.ZS', // Agriculture, % of GDP
  industry: 'NV.IND.TOTL.ZS', // Industry incl. construction, % of GDP
  services: 'NV.SRV.TOTL.ZS', // Services, % of GDP
  internet: 'IT.NET.USER.ZS', // Internet users, % of population
  urban: 'SP.URB.TOTL.IN.ZS', // Urban population, % of total
  youth: 'SP.POP.0014.TO.ZS', // Population aged 0-14, % of total
} as const
export type IndicatorKey = keyof typeof WB_INDICATORS

export interface IndicatorValue {
  value: number
  year: string
}

export interface CountryNeighbour {
  code: string
  name: string
  flag: string
}

export interface CountryInsights {
  code: string
  name: string
  officialName: string | null
  flag: string
  flagUrl: string | null
  capital: string | null
  region: string | null
  population: number | null
  currency: { code: string; name: string | null; symbol: string | null } | null
  languages: { code: string; name: string }[]
  timezone: string | null
  summary: string | null
  wikipediaUrl: string | null
  indicators: Partial<Record<IndicatorKey, IndicatorValue>>
  /** Curated sector focus (Be[X] registry) */
  sectors: string[]
  /** Countries sharing at least one language, most shared languages first */
  sharedLanguage: (CountryNeighbour & { languages: string[] })[]
  /** Countries using the same currency */
  sharedCurrency: CountryNeighbour[]
  sources: { name: string; url: string }[]
}

const COUNTRY_BY_CODE = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))

function languageName(code: string): string {
  return LANGUAGE_REGISTRY[code as LanguageCode]?.name ?? code
}

/** Fetch JSON with a timeout and a day of Next.js data cache. Null on any failure. */
async function getJson<T>(url: string, timeoutMs = 6000): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: DAY },
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

type WbResponse = [unknown, { date: string; value: number | null }[] | null] | null

/** Most recent non-empty value of one World Bank indicator. */
export async function fetchIndicator(code: string, id: string): Promise<IndicatorValue | null> {
  const data = await getJson<WbResponse>(
    `https://api.worldbank.org/v2/country/${code}/indicator/${id}?format=json&mrnv=1`
  )
  const row = Array.isArray(data) ? data[1]?.[0] : null
  if (!row || typeof row.value !== 'number') return null
  return { value: row.value, year: row.date }
}

export async function fetchWorldBank(code: string): Promise<CountryInsights['indicators']> {
  const keys = Object.keys(WB_INDICATORS) as IndicatorKey[]
  const values = await Promise.all(keys.map((k) => fetchIndicator(code, WB_INDICATORS[k])))
  const out: CountryInsights['indicators'] = {}
  keys.forEach((k, i) => {
    const v = values[i]
    if (v) out[k] = v
  })
  return out
}

export async function fetchWikipediaSummary(
  name: string
): Promise<{ extract: string; url: string } | null> {
  const data = await getJson<{
    type?: string
    extract?: string
    content_urls?: { desktop?: { page?: string } }
  }>(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/ /g, '_'))}`
  )
  if (!data?.extract || data.type === 'disambiguation') return null
  return { extract: data.extract, url: data.content_urls?.desktop?.page ?? '' }
}

/** How many of a country's languages count as "its" languages for matching (by prevalence). */
const TOP_LANGUAGES = 3

/**
 * Countries that share a main language or the currency with `code` (registry data).
 * Only each country's most spoken languages count, so English as a minor language
 * doesn't connect half the world.
 */
export function countryNeighbours(code: string): {
  sharedLanguage: CountryInsights['sharedLanguage']
  sharedCurrency: CountryNeighbour[]
} {
  const me = COUNTRY_BY_CODE.get(code)
  if (!me) return { sharedLanguage: [], sharedCurrency: [] }
  const mine = new Set(me.languages.slice(0, TOP_LANGUAGES))
  const sharedLanguage = COUNTRY_OPTIONS.filter((c) => c.code !== code)
    .map((c) => ({
      code: c.code,
      name: c.name,
      flag: c.flag,
      languages: c.languages
        .slice(0, TOP_LANGUAGES)
        .filter((l) => mine.has(l))
        .map(languageName),
    }))
    .filter((c) => c.languages.length > 0)
    .sort((a, b) => b.languages.length - a.languages.length || a.name.localeCompare(b.name))
  const sharedCurrency = COUNTRY_OPTIONS.filter(
    (c) => c.code !== code && c.currency === me.currency
  ).map((c) => ({ code: c.code, name: c.name, flag: c.flag }))
  return { sharedLanguage, sharedCurrency }
}

/** 'east-africa' → 'East Africa' */
function regionLabel(region: string): string {
  return region
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const memo = new Map<string, { at: number; data: CountryInsights }>()

/** Everything the country panel needs. Null for an unknown country code. */
export async function getCountryInsights(rawCode: string): Promise<CountryInsights | null> {
  const code = rawCode.toUpperCase()
  const reg = COUNTRY_BY_CODE.get(code)
  if (!reg) return null
  const hit = memo.get(code)
  if (hit && Date.now() - hit.at < DAY * 1000) return hit.data

  const [rest, indicators] = await Promise.all([getCountryData(code), fetchWorldBank(code)])
  const name = rest?.name ?? reg.name
  const wiki = await fetchWikipediaSummary(name)
  const { sharedLanguage, sharedCurrency } = countryNeighbours(code)

  const data: CountryInsights = {
    code,
    name,
    officialName: rest?.officialName ?? null,
    flag: reg.flag,
    flagUrl: rest?.flagUrl ?? null,
    capital: rest?.capital || null,
    region:
      rest?.subregion && rest.subregion !== reg.region ? rest.subregion : regionLabel(reg.region),
    population: rest?.population || null,
    currency: rest
      ? {
          code: rest.currency,
          name: rest.currencyName || null,
          symbol: rest.currencySymbol || null,
        }
      : { code: reg.currency, name: null, symbol: null },
    languages: (rest?.languages ?? reg.languages.map((l) => ({ code: l, name: languageName(l) })))
      .slice(0, 8)
      .map((l) => ({ code: l.code, name: l.name })),
    timezone: reg.tz ?? null,
    summary: wiki?.extract ?? null,
    wikipediaUrl: wiki?.url || null,
    indicators,
    sectors: reg.topSectors,
    sharedLanguage,
    sharedCurrency,
    sources: [
      { name: 'REST Countries', url: 'https://restcountries.com' },
      { name: 'World Bank Open Data', url: `https://data.worldbank.org/country/${code}` },
      ...(wiki?.url ? [{ name: 'Wikipedia', url: wiki.url }] : []),
    ],
  }
  // Only memoize a complete answer, so a temporary API outage is retried soon
  if (rest && Object.keys(indicators).length) memo.set(code, { at: Date.now(), data })
  return data
}

export { formatCompact } from '@/lib/format'

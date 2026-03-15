import { NextRequest, NextResponse } from 'next/server'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_REGISTRY,
  type LanguageCode,
  type FaithCode,
} from '@/lib/country-selector'
import { FAITH_OPTIONS, CULTURE_SUGGESTIONS } from '@/lib/dimensions'

interface SearchResult {
  dimension: string
  code: string
  label: string
  detail: string
  countryCount: number
  countryCodes: string[]
}

/**
 * Universal dimension search — searches ALL 5 dimensions simultaneously.
 * Returns top suggestions sorted by relevance (country count).
 *
 * Used by the map search box for real-time autocomplete.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { query } = body as { query?: string }
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const q = query.trim().toLowerCase()
  const results: SearchResult[] = []

  // 1. LANGUAGE — search by code, name, nativeName, searchAliases
  for (const lang of Object.values(LANGUAGE_REGISTRY)) {
    const matches =
      lang.code.toLowerCase() === q ||
      lang.name.toLowerCase().includes(q) ||
      (lang.nativeName && lang.nativeName.toLowerCase().includes(q)) ||
      (lang.searchAliases && lang.searchAliases.some((a) => a.toLowerCase().includes(q)))
    if (!matches) continue

    const matching = COUNTRY_OPTIONS.filter((c) => c.languages.includes(lang.code as LanguageCode))

    results.push({
      dimension: 'language',
      code: lang.code,
      label: lang.name,
      detail: lang.nativeName !== lang.name ? lang.nativeName : '',
      countryCount: matching.length,
      countryCodes: matching.map((c) => c.code),
    })
  }

  // 2. FAITH — search by id or label
  for (const faith of FAITH_OPTIONS) {
    const matches = faith.id.toLowerCase().includes(q) || faith.label.toLowerCase().includes(q)
    if (!matches) continue

    const matching = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(faith.id as FaithCode))

    results.push({
      dimension: 'faith',
      code: faith.id,
      label: faith.label,
      detail: faith.icon,
      countryCount: matching.length,
      countryCodes: matching.map((c) => c.code),
    })
  }

  // 3. SECTOR — search across all unique sectors
  const sectorMap = new Map<string, string[]>()
  for (const country of COUNTRY_OPTIONS) {
    for (const sector of country.topSectors) {
      if (sector.toLowerCase().includes(q)) {
        const existing = sectorMap.get(sector) || []
        existing.push(country.code)
        sectorMap.set(sector, existing)
      }
    }
  }
  for (const [sector, codes] of Array.from(sectorMap.entries())) {
    results.push({
      dimension: 'sector',
      code: sector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: sector,
      detail: '',
      countryCount: codes.length,
      countryCodes: codes,
    })
  }

  // 4. CURRENCY — search by code
  const currencyMap = new Map<string, string[]>()
  for (const c of COUNTRY_OPTIONS) {
    if (c.currency.toLowerCase().includes(q)) {
      const existing = currencyMap.get(c.currency) || []
      existing.push(c.code)
      currencyMap.set(c.currency, existing)
    }
  }
  for (const [currency, codes] of Array.from(currencyMap.entries())) {
    results.push({
      dimension: 'currency',
      code: currency.toLowerCase(),
      label: currency,
      detail: '',
      countryCount: codes.length,
      countryCodes: codes,
    })
  }

  // 5. CULTURE — search across culture suggestions
  const cultureMap = new Map<string, string[]>()
  for (const [countryCode, cultures] of Object.entries(CULTURE_SUGGESTIONS)) {
    for (const culture of cultures) {
      if (culture.toLowerCase().includes(q)) {
        const existing = cultureMap.get(culture) || []
        existing.push(countryCode)
        cultureMap.set(culture, existing)
      }
    }
  }
  for (const [culture, codes] of Array.from(cultureMap.entries())) {
    results.push({
      dimension: 'culture',
      code: culture.toLowerCase(),
      label: culture,
      detail: '',
      countryCount: codes.length,
      countryCodes: codes,
    })
  }

  // Sort by country count desc, then limit to 15 suggestions
  results.sort((a, b) => b.countryCount - a.countryCount)
  const limited = results.slice(0, 15)

  return NextResponse.json({ suggestions: limited })
}

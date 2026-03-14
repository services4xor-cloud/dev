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
}

/**
 * Universal dimension search — searches ALL 6 dimensions simultaneously.
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

    const countryCount = COUNTRY_OPTIONS.filter((c) =>
      c.languages.includes(lang.code as LanguageCode)
    ).length

    results.push({
      dimension: 'language',
      code: lang.code,
      label: lang.name,
      detail: lang.nativeName !== lang.name ? lang.nativeName : '',
      countryCount,
    })
  }

  // 2. FAITH — search by id or label
  for (const faith of FAITH_OPTIONS) {
    const matches = faith.id.toLowerCase().includes(q) || faith.label.toLowerCase().includes(q)
    if (!matches) continue

    const countryCount = COUNTRY_OPTIONS.filter((c) =>
      c.topFaiths.includes(faith.id as FaithCode)
    ).length

    results.push({
      dimension: 'faith',
      code: faith.id,
      label: faith.label,
      detail: faith.icon,
      countryCount,
    })
  }

  // 3. SECTOR — search across all unique sectors
  const sectorCounts = new Map<string, number>()
  for (const country of COUNTRY_OPTIONS) {
    for (const sector of country.topSectors) {
      if (sector.toLowerCase().includes(q)) {
        sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1)
      }
    }
  }
  for (const [sector, countryCount] of Array.from(sectorCounts.entries())) {
    results.push({
      dimension: 'sector',
      code: sector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: sector,
      detail: '',
      countryCount,
    })
  }

  // 4. LOCATION — search by country name or region
  const locationMatches = COUNTRY_OPTIONS.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().replace(/-/g, ' ').includes(q.replace(/-/g, ' '))
    )
  })
  // Group by region if the query matches a region
  const regionCounts = new Map<string, number>()
  for (const c of locationMatches) {
    const region = c.region.toLowerCase().replace(/-/g, ' ')
    if (region.includes(q.replace(/-/g, ' '))) {
      regionCounts.set(c.region, (regionCounts.get(c.region) || 0) + 1)
    }
  }
  for (const [region, count] of Array.from(regionCounts.entries())) {
    results.push({
      dimension: 'location',
      code: region.toLowerCase(),
      label: region.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      detail: 'Region',
      countryCount: count,
    })
  }
  // Individual country matches
  for (const c of locationMatches) {
    if (c.name.toLowerCase().includes(q)) {
      results.push({
        dimension: 'location',
        code: c.name.toLowerCase(),
        label: `${c.flag} ${c.name}`,
        detail: c.region.replace(/-/g, ' '),
        countryCount: 1,
      })
    }
  }

  // 5. CURRENCY — search by code
  const currencyCounts = new Map<string, number>()
  for (const c of COUNTRY_OPTIONS) {
    if (c.currency.toLowerCase().includes(q)) {
      currencyCounts.set(c.currency, (currencyCounts.get(c.currency) || 0) + 1)
    }
  }
  for (const [currency, count] of Array.from(currencyCounts.entries())) {
    results.push({
      dimension: 'currency',
      code: currency.toLowerCase(),
      label: currency,
      detail: '',
      countryCount: count,
    })
  }

  // 6. CULTURE — search across culture suggestions
  const cultureCounts = new Map<string, number>()
  for (const [, cultures] of Object.entries(CULTURE_SUGGESTIONS)) {
    for (const culture of cultures) {
      if (culture.toLowerCase().includes(q)) {
        cultureCounts.set(culture, (cultureCounts.get(culture) || 0) + 1)
      }
    }
  }
  for (const [culture, count] of Array.from(cultureCounts.entries())) {
    results.push({
      dimension: 'culture',
      code: culture.toLowerCase(),
      label: culture,
      detail: '',
      countryCount: count,
    })
  }

  // Sort by country count desc, then limit to 15 suggestions
  results.sort((a, b) => b.countryCount - a.countryCount)
  const limited = results.slice(0, 15)

  return NextResponse.json({ suggestions: limited })
}

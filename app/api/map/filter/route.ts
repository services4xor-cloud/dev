import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import type { DimensionFilter } from '@/types/domain'

const MAX_FILTERS = 10

/**
 * Filter countries by dimension values using COUNTRY_OPTIONS static data.
 *
 * Supports: language (code or name or alias), sector (substring), currency (exact code),
 * faith (deferred), location (deferred), culture (deferred).
 *
 * Response includes:
 * - countries: matching country list with lat/lng/matchStrength
 * - totalMatches: count
 * - suggestions: when dimension=language, shows which languages matched + count
 *   (enables "Did you mean: Swahili (6) · Swedish (2)" UX)
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { filters } = body as { filters?: unknown[] }
  if (!Array.isArray(filters) || filters.length > MAX_FILTERS) {
    return NextResponse.json(
      { error: `filters must be an array of max ${MAX_FILTERS} items` },
      { status: 400 }
    )
  }

  // Parse and validate filters
  const parsed: DimensionFilter[] = filters
    .map((f: unknown) => {
      const filter = f as { dimension?: string; nodeCode?: string }
      if (!filter?.dimension || !filter?.nodeCode) return null
      return {
        dimension: filter.dimension as DimensionFilter['dimension'],
        nodeCode: String(filter.nodeCode).toLowerCase().trim(),
      }
    })
    .filter((f): f is DimensionFilter => f !== null)

  // No valid filters → return all active countries
  if (parsed.length === 0) {
    return NextResponse.json({ countries: [], totalMatches: 0, suggestions: [] })
  }

  // Apply each filter with suggestion gathering
  const matchSets = parsed.map((f) => filterByDimension(f))

  // Collect suggestions from language filters
  const suggestions: { code: string; name: string; nativeName: string; countryCount: number }[] = []
  for (const f of parsed) {
    if (f.dimension === 'language') {
      const langSuggestions = getLanguageSuggestions(f.nodeCode)
      suggestions.push(...langSuggestions)
    }
    if (f.dimension === 'sector') {
      // Show which sectors matched
      const sectorSuggestions = getSectorSuggestions(f.nodeCode)
      suggestions.push(
        ...sectorSuggestions.map((s) => ({
          code: s.sector,
          name: s.sector,
          nativeName: s.sector,
          countryCount: s.countryCount,
        }))
      )
    }
  }

  // Intersect: country must match ALL filters
  const intersection = matchSets.reduce((acc, set) => {
    const codes = new Set(set.map((c) => c.code))
    return acc.filter((c) => codes.has(c.code))
  }, matchSets[0] ?? [])

  return NextResponse.json({
    countries: intersection.map((c) => ({
      code: c.code,
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      matchStrength: 1.0,
    })),
    totalMatches: intersection.length,
    suggestions,
  })
}

/**
 * Check if a language matches a search query (by code, name, nativeName, or alias).
 */
function languageMatchesQuery(lang: (typeof LANGUAGE_REGISTRY)[LanguageCode], query: string) {
  if (lang.code.toLowerCase() === query) return true
  if (lang.name.toLowerCase().includes(query)) return true
  if (lang.nativeName?.toLowerCase().includes(query)) return true
  if (lang.searchAliases?.some((alias) => alias.toLowerCase().includes(query))) return true
  return false
}

/**
 * Get language suggestions for a query — which languages match and how many countries each.
 * Enables "Did you mean: Swahili (6 countries) · Swedish (2 countries)" UX.
 */
function getLanguageSuggestions(query: string) {
  const results: { code: string; name: string; nativeName: string; countryCount: number }[] = []

  for (const lang of Object.values(LANGUAGE_REGISTRY)) {
    if (!languageMatchesQuery(lang, query)) continue

    // Count how many COUNTRY_OPTIONS have this language
    const countryCount = COUNTRY_OPTIONS.filter((c) =>
      c.languages.includes(lang.code as LanguageCode)
    ).length

    results.push({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      countryCount,
    })
  }

  // Sort by country count desc (most relevant first)
  return results.sort((a, b) => b.countryCount - a.countryCount)
}

/**
 * Get sector suggestions — which sectors match and how many countries each.
 */
function getSectorSuggestions(query: string) {
  const sectorCounts = new Map<string, number>()

  for (const country of COUNTRY_OPTIONS) {
    for (const sector of country.topSectors) {
      if (sector.toLowerCase().includes(query)) {
        sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1)
      }
    }
  }

  return Array.from(sectorCounts.entries())
    .map(([sector, countryCount]) => ({ sector, countryCount }))
    .sort((a, b) => b.countryCount - a.countryCount)
    .slice(0, 10) // Limit to top 10 suggestions
}

/**
 * Filter COUNTRY_OPTIONS by a single dimension.
 */
function filterByDimension(filter: DimensionFilter) {
  const { dimension, nodeCode } = filter

  switch (dimension) {
    case 'language':
      return COUNTRY_OPTIONS.filter((c) => {
        return c.languages.some((lc) => {
          const lang = LANGUAGE_REGISTRY[lc as LanguageCode]
          if (!lang) return false
          return languageMatchesQuery(lang, nodeCode)
        })
      })

    case 'sector':
      return COUNTRY_OPTIONS.filter((c) =>
        c.topSectors.some((s) => s.toLowerCase().includes(nodeCode))
      )

    case 'currency':
      return COUNTRY_OPTIONS.filter((c) => c.currency.toLowerCase() === nodeCode)

    case 'faith':
      // Faith data not yet in COUNTRY_OPTIONS — return empty for now
      return []

    case 'location':
      // Match by region name or country name (normalize hyphens/spaces)
      return COUNTRY_OPTIONS.filter((c) => {
        const region = c.region.toLowerCase().replace(/-/g, ' ')
        const name = c.name.toLowerCase()
        const query = nodeCode.replace(/-/g, ' ')
        return region.includes(query) || name.includes(query)
      })

    case 'culture':
      // Culture data not yet in COUNTRY_OPTIONS — return empty for now
      return []

    default:
      return []
  }
}

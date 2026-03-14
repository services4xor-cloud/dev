import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import type { DimensionFilter } from '@/types/domain'

const MAX_FILTERS = 10

/**
 * Filter countries by dimension values using COUNTRY_OPTIONS static data.
 *
 * Supports: language (code or name), sector (substring), currency (exact code),
 * faith (deferred), location (deferred), culture (deferred).
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
    return NextResponse.json({ countries: [], totalMatches: 0 })
  }

  // Apply each filter, then intersect results
  const matchSets = parsed.map((f) => filterByDimension(f))

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
  })
}

/**
 * Filter COUNTRY_OPTIONS by a single dimension.
 */
function filterByDimension(filter: DimensionFilter) {
  const { dimension, nodeCode } = filter

  switch (dimension) {
    case 'language':
      return COUNTRY_OPTIONS.filter((c) => {
        // Match by language code (exact)
        if (c.languages.some((lc) => lc.toLowerCase() === nodeCode)) return true
        // Match by language name (case-insensitive substring)
        return c.languages.some((lc) => {
          const lang = LANGUAGE_REGISTRY[lc as LanguageCode]
          if (!lang) return false
          return (
            lang.name.toLowerCase().includes(nodeCode) ||
            (lang.nativeName?.toLowerCase().includes(nodeCode) ?? false)
          )
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

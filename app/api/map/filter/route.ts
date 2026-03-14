import { NextRequest, NextResponse } from 'next/server'
import { filterCountries } from '@/lib/graph'
import type { NodeType, EdgeRelation } from '@prisma/client'

const DIMENSION_TO_EDGE: Record<string, { nodeType: NodeType; relation: EdgeRelation }> = {
  language: { nodeType: 'LANGUAGE', relation: 'OFFICIAL_LANG' },
  faith: { nodeType: 'FAITH', relation: 'DOMINANT_FAITH' },
  sector: { nodeType: 'SECTOR', relation: 'HAS_SECTOR' },
  currency: { nodeType: 'CURRENCY', relation: 'COUNTRY_CURRENCY' },
  location: { nodeType: 'LOCATION', relation: 'PARENT_OF' },
  // culture filter deferred — no COUNTRY→CULTURE edge yet
}

const MAX_FILTERS = 10

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

  const graphFilters = filters
    .map((f: unknown) => {
      const filter = f as { dimension?: string; nodeCode?: string }
      if (!filter?.dimension || !filter?.nodeCode) return null
      const mapping = DIMENSION_TO_EDGE[filter.dimension]
      if (!mapping) return null
      return {
        dimensionType: mapping.nodeType,
        dimensionCode: String(filter.nodeCode),
        relation: mapping.relation,
      }
    })
    .filter(
      (f): f is { dimensionType: NodeType; dimensionCode: string; relation: EdgeRelation } =>
        f !== null
    )

  const countries = await filterCountries(graphFilters)

  return NextResponse.json({
    countries: countries.map((c) => ({
      code: c.code,
      name: c.label,
      lat: c.lat,
      lng: c.lng,
      matchStrength: 1.0,
    })),
    totalMatches: countries.length,
  })
}

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

export async function POST(req: NextRequest) {
  const { filters } = await req.json()

  const graphFilters = filters
    .map((f: { dimension: string; nodeCode: string }) => {
      const mapping = DIMENSION_TO_EDGE[f.dimension]
      if (!mapping) return null
      return {
        dimensionType: mapping.nodeType,
        dimensionCode: f.nodeCode,
        relation: mapping.relation,
      }
    })
    .filter(Boolean)

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

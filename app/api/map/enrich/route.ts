import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'

/**
 * POST /api/map/enrich
 *
 * Given a country code, returns exactly 5 dimension filters — one per dimension.
 * Each filter picks the value with MAXIMUM global reach (most country matches)
 * from the country's available options in that dimension.
 *
 * This maximizes map glow: click Germany → French (30 countries) beats
 * German (6 countries) for language impact.
 */

const REGION_LABELS: Record<string, string> = {
  'east-africa': 'East Africa',
  'west-africa': 'West Africa',
  'central-africa': 'Central Africa',
  'north-africa': 'North Africa',
  'southern-africa': 'Southern Africa',
  'middle-east': 'Middle East',
  europe: 'Europe',
  americas: 'Americas',
  'central-america-caribbean': 'Central America & Caribbean',
  'south-america': 'South America',
  'south-asia': 'South Asia',
  'southeast-asia': 'Southeast Asia',
  'east-asia': 'East Asia',
  'central-asia': 'Central Asia',
  oceania: 'Oceania',
}

const FAITH_LABELS: Record<string, string> = {
  christianity: 'Christianity',
  islam: 'Islam',
  hinduism: 'Hinduism',
  buddhism: 'Buddhism',
  judaism: 'Judaism',
  traditional: 'Traditional',
  secular: 'Secular',
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { code } = body as { code?: string }
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const country = COUNTRY_OPTIONS.find((c) => c.code === code.toUpperCase())
  if (!country) return NextResponse.json({ error: 'Country not found' }, { status: 404 })

  const filters: {
    dimension: string
    nodeCode: string
    label: string
    icon: string
    countryCodes: string[]
  }[] = []

  // 1. Region — geographic cluster (always exactly 1)
  const regionMatches = COUNTRY_OPTIONS.filter((c) => c.region === country.region)
  filters.push({
    dimension: 'location',
    nodeCode: country.region,
    label: REGION_LABELS[country.region] ?? country.region,
    icon: '📍',
    countryCodes: regionMatches.map((c) => c.code),
  })

  // 2. Language — pick the language with MOST country reach from this country's languages
  if (country.languages.length > 0) {
    let bestLang = country.languages[0]
    let bestCount = 0
    for (const lang of country.languages) {
      const count = COUNTRY_OPTIONS.filter((c) => c.languages.includes(lang)).length
      if (count > bestCount) {
        bestCount = count
        bestLang = lang
      }
    }
    const langInfo = LANGUAGE_REGISTRY[bestLang]
    const matching = COUNTRY_OPTIONS.filter((c) => c.languages.includes(bestLang))
    if (langInfo) {
      filters.push({
        dimension: 'language',
        nodeCode: bestLang,
        label: langInfo.name,
        icon: '🗣️',
        countryCodes: matching.map((c) => c.code),
      })
    }
  }

  // 3. Currency — the country's currency (always exactly 1)
  const currencyMatches = COUNTRY_OPTIONS.filter((c) => c.currency === country.currency)
  filters.push({
    dimension: 'currency',
    nodeCode: country.currency.toLowerCase(),
    label: country.currency,
    icon: '💱',
    countryCodes: currencyMatches.map((c) => c.code),
  })

  // 4. Faith — pick the faith with MOST country reach from this country's faiths
  if (country.topFaiths.length > 0) {
    let bestFaith = country.topFaiths[0]
    let bestCount = 0
    for (const faith of country.topFaiths) {
      const count = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(faith)).length
      if (count > bestCount) {
        bestCount = count
        bestFaith = faith
      }
    }
    const matching = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(bestFaith))
    filters.push({
      dimension: 'faith',
      nodeCode: bestFaith,
      label: FAITH_LABELS[bestFaith] ?? bestFaith,
      icon: '☪️',
      countryCodes: matching.map((c) => c.code),
    })
  }

  // 5. Sector — pick the sector with MOST country reach from this country's sectors
  if (country.topSectors.length > 0) {
    let bestSector = country.topSectors[0]
    let bestCount = 0
    for (const sector of country.topSectors) {
      const count = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(sector)).length
      if (count > bestCount) {
        bestCount = count
        bestSector = sector
      }
    }
    const sectorMatches = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(bestSector))
    filters.push({
      dimension: 'sector',
      nodeCode: bestSector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: bestSector,
      icon: '💼',
      countryCodes: sectorMatches.map((c) => c.code),
    })
  }

  return NextResponse.json({ country: country.name, filters })
}

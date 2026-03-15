import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'

/**
 * POST /api/map/enrich
 *
 * Given a country code, returns all dimension filters for that country.
 * Used when clicking a country on the map — auto-discovers related countries
 * that share the same timezone, languages, currency, faith, and sectors.
 *
 * This creates the cascading glow: click Germany → Europe timezone lights up,
 * EUR currency zone lights up, German-speaking countries light up.
 */
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

  // Find all related countries per dimension
  const filters: {
    dimension: string
    nodeCode: string
    label: string
    icon: string
    countryCodes: string[]
  }[] = []

  // 1. Region — all countries in the same geographic region
  const regionLabels: Record<string, string> = {
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
  const regionMatches = COUNTRY_OPTIONS.filter((c) => c.region === country.region)
  filters.push({
    dimension: 'location',
    nodeCode: country.region,
    label: regionLabels[country.region] ?? country.region,
    icon: '📍',
    countryCodes: regionMatches.map((c) => c.code),
  })

  // 2. Languages — all countries sharing primary language
  if (country.languages.length > 0) {
    const primaryLang = country.languages[0]
    const langInfo = LANGUAGE_REGISTRY[primaryLang]
    const matching = COUNTRY_OPTIONS.filter((c) => c.languages.includes(primaryLang))
    if (langInfo && matching.length > 1) {
      filters.push({
        dimension: 'language',
        nodeCode: primaryLang,
        label: langInfo.name,
        icon: '🗣️',
        countryCodes: matching.map((c) => c.code),
      })
    }
  }

  // 3. Currency — all countries with same currency
  const currencyMatches = COUNTRY_OPTIONS.filter((c) => c.currency === country.currency)
  if (currencyMatches.length > 1) {
    filters.push({
      dimension: 'currency',
      nodeCode: country.currency.toLowerCase(),
      label: country.currency,
      icon: '💱',
      countryCodes: currencyMatches.map((c) => c.code),
    })
  }

  // 4. Faith — dominant faith
  if (country.topFaiths.length > 0) {
    const primaryFaith = country.topFaiths[0]
    const matching = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(primaryFaith))
    const faithLabels: Record<string, string> = {
      christianity: 'Christianity',
      islam: 'Islam',
      hinduism: 'Hinduism',
      buddhism: 'Buddhism',
      judaism: 'Judaism',
      traditional: 'Traditional',
      secular: 'Secular',
    }
    filters.push({
      dimension: 'faith',
      nodeCode: primaryFaith,
      label: faithLabels[primaryFaith] ?? primaryFaith,
      icon: '☪️',
      countryCodes: matching.map((c) => c.code),
    })
  }

  // 5. Sector — top sector shared with other countries
  if (country.topSectors.length > 0) {
    const primarySector = country.topSectors[0]
    const sectorMatches = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(primarySector))
    if (sectorMatches.length > 1) {
      filters.push({
        dimension: 'sector',
        nodeCode: primarySector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        label: primarySector,
        icon: '💼',
        countryCodes: sectorMatches.map((c) => c.code),
      })
    }
  }

  return NextResponse.json({ country: country.name, filters })
}

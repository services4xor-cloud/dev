import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'

/**
 * POST /api/map/enrich
 *
 * Given a country code, returns ALL dimension filters for that country.
 * Every language, sector, faith, and currency becomes a filter with its
 * matching country codes — so the Explorer sees exactly what glows and why.
 */

const FAITH_LABELS: Record<string, string> = {
  christianity: 'Christianity',
  islam: 'Islam',
  hinduism: 'Hinduism',
  buddhism: 'Buddhism',
  judaism: 'Judaism',
  shinto: 'Shinto',
  traditional: 'Traditional',
  secular: 'Secular',
  other: 'Other',
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

  type Filter = {
    dimension: string
    nodeCode: string
    label: string
    icon: string
    countryCodes: string[]
  }
  const filters: Filter[] = []

  // ALL languages for this country
  for (const langCode of country.languages) {
    const langInfo = LANGUAGE_REGISTRY[langCode]
    if (!langInfo) continue
    const matching = COUNTRY_OPTIONS.filter((c) => c.languages.includes(langCode))
    filters.push({
      dimension: 'language',
      nodeCode: langCode,
      label: langInfo.name,
      icon: '🗣️',
      countryCodes: matching.map((c) => c.code),
    })
  }

  // ALL sectors for this country
  for (const sector of country.topSectors) {
    const matching = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(sector))
    filters.push({
      dimension: 'sector',
      nodeCode: sector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: sector,
      icon: '💼',
      countryCodes: matching.map((c) => c.code),
    })
  }

  // Currency (always one)
  const currencyMatches = COUNTRY_OPTIONS.filter((c) => c.currency === country.currency)
  filters.push({
    dimension: 'currency',
    nodeCode: country.currency.toLowerCase(),
    label: country.currency,
    icon: '💱',
    countryCodes: currencyMatches.map((c) => c.code),
  })

  // ALL faiths for this country
  for (const faith of country.topFaiths) {
    const matching = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(faith))
    filters.push({
      dimension: 'faith',
      nodeCode: faith,
      label: FAITH_LABELS[faith] ?? faith,
      icon: '☪️',
      countryCodes: matching.map((c) => c.code),
    })
  }

  return NextResponse.json({ country: country.name, filters })
}

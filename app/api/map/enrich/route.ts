import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'

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

  // 1. Location — the country itself
  filters.push({
    dimension: 'location',
    nodeCode: country.name.toLowerCase(),
    label: country.name,
    icon: '📍',
    countryCodes: [country.code],
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

  // 5. Timezone band — same IANA prefix
  const tzPrefix = country.tz.split('/')[0]
  const tzLabel =
    tzPrefix === 'Europe'
      ? 'Europe'
      : tzPrefix === 'Africa'
        ? 'Africa'
        : tzPrefix === 'Asia'
          ? 'Asia'
          : tzPrefix === 'America'
            ? 'Americas'
            : tzPrefix === 'Pacific'
              ? 'Pacific'
              : tzPrefix === 'Australia'
                ? 'Oceania'
                : tzPrefix
  const tzMatches = COUNTRY_OPTIONS.filter((c) => c.tz.startsWith(tzPrefix))
  if (tzMatches.length > 1) {
    filters.push({
      dimension: 'timezone',
      nodeCode: tzLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: tzLabel,
      icon: '🕐',
      countryCodes: tzMatches.map((c) => c.code),
    })
  }

  return NextResponse.json({ country: country.name, filters })
}

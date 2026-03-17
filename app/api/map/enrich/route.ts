import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'

/**
 * POST /api/map/enrich
 *
 * Given a country code, returns exactly 4 dimension filters — one per dimension.
 * Each filter picks the PRIMARY value for that country (first in array = most
 * dominant/characteristic). Map only highlights countries matching these 4 values.
 */

const FAITH_LABELS: Record<string, string> = {
  christianity: 'Christianity',
  islam: 'Islam',
  hinduism: 'Hinduism',
  buddhism: 'Buddhism',
  judaism: 'Judaism',
  traditional: 'Traditional',
  secular: 'Secular',
}

// ─── Pre-computed lookup maps (built once at module load, not per request) ───
const COUNTRY_BY_CODE = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))

// language → country codes
const LANG_COUNTRIES = new Map<string, string[]>()
// sector → country codes
const SECTOR_COUNTRIES = new Map<string, string[]>()
// currency → country codes
const CURRENCY_COUNTRIES = new Map<string, string[]>()
// faith → country codes
const FAITH_COUNTRIES = new Map<string, string[]>()

for (const c of COUNTRY_OPTIONS) {
  for (const l of c.languages) {
    const arr = LANG_COUNTRIES.get(l) ?? []
    arr.push(c.code)
    LANG_COUNTRIES.set(l, arr)
  }
  for (const s of c.topSectors) {
    const arr = SECTOR_COUNTRIES.get(s) ?? []
    arr.push(c.code)
    SECTOR_COUNTRIES.set(s, arr)
  }
  {
    const arr = CURRENCY_COUNTRIES.get(c.currency) ?? []
    arr.push(c.code)
    CURRENCY_COUNTRIES.set(c.currency, arr)
  }
  for (const f of c.topFaiths) {
    const arr = FAITH_COUNTRIES.get(f) ?? []
    arr.push(c.code)
    FAITH_COUNTRIES.set(f, arr)
  }
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

  const country = COUNTRY_BY_CODE.get(code.toUpperCase())
  if (!country) return NextResponse.json({ error: 'Country not found' }, { status: 404 })

  // Build exactly 4 filters — one PRIMARY value per dimension
  type Filter = {
    dimension: string
    nodeCode: string
    label: string
    icon: string
    countryCodes: string[]
    isPrimary: boolean
  }
  const filters: Filter[] = []

  // 1. Language — PRIMARY only (first = official/dominant)
  if (country.languages.length > 0) {
    const bestLang = country.languages[0]
    const langInfo = LANGUAGE_REGISTRY[bestLang]
    if (langInfo) {
      filters.push({
        dimension: 'language',
        nodeCode: bestLang,
        label: langInfo.name,
        icon: '🗣️',
        countryCodes: LANG_COUNTRIES.get(bestLang) ?? [],
        isPrimary: true,
      })
    }
  }

  // 2. Sector — PRIMARY only (first = what the country is known for)
  if (country.topSectors.length > 0) {
    const primarySector = country.topSectors[0]
    filters.push({
      dimension: 'sector',
      nodeCode: primarySector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: primarySector,
      icon: '💼',
      countryCodes: SECTOR_COUNTRIES.get(primarySector) ?? [],
      isPrimary: true,
    })
  }

  // 3. Currency (single value)
  filters.push({
    dimension: 'currency',
    nodeCode: country.currency.toLowerCase(),
    label: country.currency,
    icon: '💱',
    countryCodes: CURRENCY_COUNTRIES.get(country.currency) ?? [],
    isPrimary: true,
  })

  // 4. Faith — PRIMARY only (first = dominant faith)
  if (country.topFaiths.length > 0) {
    const primaryFaith = country.topFaiths[0]
    filters.push({
      dimension: 'faith',
      nodeCode: primaryFaith,
      label: FAITH_LABELS[primaryFaith] ?? primaryFaith,
      icon: '☪️',
      countryCodes: FAITH_COUNTRIES.get(primaryFaith) ?? [],
      isPrimary: true,
    })
  }

  return NextResponse.json({ country: country.name, filters })
}

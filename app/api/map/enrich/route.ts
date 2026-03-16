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

  // Build filters in display order: Language → Sector → Currency → Faith
  type Filter = {
    dimension: string
    nodeCode: string
    label: string
    icon: string
    countryCodes: string[]
  }
  const filters: Filter[] = []

  // 1. Language — use the PRIMARY language (first in list = official/dominant)
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
      })
    }
  }

  // 2. Sector — pick the sector with MOST country reach
  if (country.topSectors.length > 0) {
    let bestSector = country.topSectors[0]
    let bestCount = 0
    for (const sector of country.topSectors) {
      const count = (SECTOR_COUNTRIES.get(sector) ?? []).length
      if (count > bestCount) {
        bestCount = count
        bestSector = sector
      }
    }
    filters.push({
      dimension: 'sector',
      nodeCode: bestSector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: bestSector,
      icon: '💼',
      countryCodes: SECTOR_COUNTRIES.get(bestSector) ?? [],
    })
  }

  // 3. Currency
  filters.push({
    dimension: 'currency',
    nodeCode: country.currency.toLowerCase(),
    label: country.currency,
    icon: '💱',
    countryCodes: CURRENCY_COUNTRIES.get(country.currency) ?? [],
  })

  // 4. Faith — pick the faith with MOST country reach
  if (country.topFaiths.length > 0) {
    let bestFaith = country.topFaiths[0]
    let bestCount = 0
    for (const faith of country.topFaiths) {
      const count = (FAITH_COUNTRIES.get(faith) ?? []).length
      if (count > bestCount) {
        bestCount = count
        bestFaith = faith
      }
    }
    filters.push({
      dimension: 'faith',
      nodeCode: bestFaith,
      label: FAITH_LABELS[bestFaith] ?? bestFaith,
      icon: '☪️',
      countryCodes: FAITH_COUNTRIES.get(bestFaith) ?? [],
    })
  }

  return NextResponse.json({ country: country.name, filters })
}

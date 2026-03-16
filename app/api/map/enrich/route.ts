import { NextRequest, NextResponse } from 'next/server'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'

/**
 * POST /api/map/enrich
 *
 * Given a country code, returns ALL dimension values across 4 dimensions
 * (language, sector, currency, faith) — mirroring what /be/[code] shows.
 * First value in each dimension array is marked isPrimary for rarity/glow.
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

  // Build filters: ALL values across 4 dimensions (same as /be/[code] page)
  type Filter = {
    dimension: string
    nodeCode: string
    label: string
    icon: string
    countryCodes: string[]
    isPrimary: boolean
  }
  const filters: Filter[] = []

  // 1. Languages — ALL languages, first is primary
  for (let i = 0; i < country.languages.length; i++) {
    const lang = country.languages[i]
    const langInfo = LANGUAGE_REGISTRY[lang]
    if (langInfo) {
      filters.push({
        dimension: 'language',
        nodeCode: lang,
        label: langInfo.name,
        icon: '🗣️',
        countryCodes: LANG_COUNTRIES.get(lang) ?? [],
        isPrimary: i === 0,
      })
    }
  }

  // 2. Sectors — ALL sectors, first is primary
  for (let i = 0; i < country.topSectors.length; i++) {
    const sector = country.topSectors[i]
    filters.push({
      dimension: 'sector',
      nodeCode: sector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: sector,
      icon: '💼',
      countryCodes: SECTOR_COUNTRIES.get(sector) ?? [],
      isPrimary: i === 0,
    })
  }

  // 3. Currency (single value, always primary)
  filters.push({
    dimension: 'currency',
    nodeCode: country.currency.toLowerCase(),
    label: country.currency,
    icon: '💱',
    countryCodes: CURRENCY_COUNTRIES.get(country.currency) ?? [],
    isPrimary: true,
  })

  // 4. Faiths — ALL faiths, first is primary
  for (let i = 0; i < country.topFaiths.length; i++) {
    const faith = country.topFaiths[i]
    filters.push({
      dimension: 'faith',
      nodeCode: faith,
      label: FAITH_LABELS[faith] ?? faith,
      icon: '☪️',
      countryCodes: FAITH_COUNTRIES.get(faith) ?? [],
      isPrimary: i === 0,
    })
  }

  return NextResponse.json({ country: country.name, filters })
}

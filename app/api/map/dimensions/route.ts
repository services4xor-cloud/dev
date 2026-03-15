import { NextResponse } from 'next/server'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_REGISTRY,
  type LanguageCode,
  type FaithCode,
} from '@/lib/country-selector'
import { FAITH_OPTIONS } from '@/lib/dimensions'

interface DimensionOption {
  code: string
  label: string
  icon?: string
  count: number
  countryCodes: string[]
}

/**
 * GET /api/map/dimensions
 *
 * Returns all selectable options for each dimension, sorted by country count.
 * Every option is pre-computed from COUNTRY_OPTIONS — 100% data-backed.
 * Used by DimensionFilters for the curated options UI.
 */
export async function GET() {
  // 1. LANGUAGE — from LANGUAGE_REGISTRY, only those present in at least 1 country
  const languageOptions: DimensionOption[] = []
  for (const lang of Object.values(LANGUAGE_REGISTRY)) {
    const matching = COUNTRY_OPTIONS.filter((c) => c.languages.includes(lang.code as LanguageCode))
    if (matching.length === 0) continue
    languageOptions.push({
      code: lang.code,
      label: lang.name,
      icon: '🗣️',
      count: matching.length,
      countryCodes: matching.map((c) => c.code),
    })
  }
  languageOptions.sort((a, b) => b.count - a.count)

  // 2. FAITH — from FAITH_OPTIONS
  const faithOptions: DimensionOption[] = []
  for (const faith of FAITH_OPTIONS) {
    if (faith.id === 'other') continue // skip generic "other"
    const matching = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(faith.id as FaithCode))
    if (matching.length === 0) continue
    faithOptions.push({
      code: faith.id,
      label: faith.label,
      icon: faith.icon,
      count: matching.length,
      countryCodes: matching.map((c) => c.code),
    })
  }
  faithOptions.sort((a, b) => b.count - a.count)

  // 3. SECTOR — from unique topSectors across all countries
  const sectorMap = new Map<string, string[]>()
  for (const country of COUNTRY_OPTIONS) {
    for (const sector of country.topSectors) {
      const existing = sectorMap.get(sector) || []
      existing.push(country.code)
      sectorMap.set(sector, existing)
    }
  }
  const sectorOptions: DimensionOption[] = Array.from(sectorMap.entries()).map(
    ([sector, codes]) => ({
      code: sector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: sector,
      icon: '💼',
      count: codes.length,
      countryCodes: codes,
    })
  )
  sectorOptions.sort((a, b) => b.count - a.count)

  // 4. CURRENCY — from unique currencies
  const currencyMap = new Map<string, string[]>()
  for (const c of COUNTRY_OPTIONS) {
    const existing = currencyMap.get(c.currency) || []
    existing.push(c.code)
    currencyMap.set(c.currency, existing)
  }
  // Common currency symbols for major currencies
  const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CHF: '₣',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    BRL: 'R$',
    ZAR: 'R',
    NGN: '₦',
    KES: 'KSh',
    AUD: 'A$',
    CAD: 'C$',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    TRY: '₺',
    RUB: '₽',
    THB: '฿',
    MYR: 'RM',
    SGD: 'S$',
    PHP: '₱',
    IDR: 'Rp',
    VND: '₫',
    EGP: 'E£',
    SAR: '﷼',
    AED: 'د.إ',
    ILS: '₪',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    XOF: 'CFA',
    XAF: 'CFA',
    MAD: 'د.م.',
    TZS: 'TSh',
    UGX: 'USh',
    GHS: '₵',
    ETB: 'Br',
    COP: 'COL$',
    ARS: 'AR$',
    CLP: 'CL$',
    PEN: 'S/',
    MXN: 'MX$',
    NZD: 'NZ$',
    PKR: '₨',
    BDT: '৳',
    LKR: 'Rs',
  }
  const currencyOptions: DimensionOption[] = Array.from(currencyMap.entries()).map(
    ([currency, codes]) => ({
      code: currency.toLowerCase(),
      label: `${currency}${CURRENCY_SYMBOLS[currency] ? ` (${CURRENCY_SYMBOLS[currency]})` : ''}`,
      icon: '💱',
      count: codes.length,
      countryCodes: codes,
    })
  )
  currencyOptions.sort((a, b) => b.count - a.count)

  // 5. TIMEZONE — group by UTC offset band for meaningful clusters
  const tzBandMap = new Map<string, string[]>()
  for (const c of COUNTRY_OPTIONS) {
    // Extract UTC offset band from IANA timezone (group into broad bands)
    const tz = c.tz
    // Map IANA zones to readable UTC bands
    let band = tz
    if (tz.startsWith('Pacific/')) band = 'Pacific'
    else if (tz.startsWith('America/')) band = 'Americas'
    else if (tz.startsWith('Atlantic/')) band = 'Atlantic'
    else if (tz.startsWith('Europe/')) band = 'Europe'
    else if (tz.startsWith('Africa/')) band = 'Africa'
    else if (tz.startsWith('Asia/')) band = 'Asia'
    else if (tz.startsWith('Indian/')) band = 'Indian Ocean'
    else if (tz.startsWith('Australia/')) band = 'Oceania'

    const existing = tzBandMap.get(band) || []
    existing.push(c.code)
    tzBandMap.set(band, existing)
  }
  const timezoneOptions: DimensionOption[] = Array.from(tzBandMap.entries())
    .filter(([, codes]) => codes.length >= 2)
    .map(([band, codes]) => ({
      code: band.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: band,
      icon: '🕐',
      count: codes.length,
      countryCodes: codes,
    }))
  timezoneOptions.sort((a, b) => b.count - a.count)

  return NextResponse.json({
    dimensions: {
      language: languageOptions,
      faith: faithOptions,
      sector: sectorOptions,
      currency: currencyOptions,
      timezone: timezoneOptions,
    },
  })
}

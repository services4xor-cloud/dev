'use client'

import { useState, useEffect } from 'react'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_REGISTRY,
  type LanguageCode,
  type FaithCode,
} from '@/lib/country-selector'

/**
 * CountryDimensions — client component for /be/[code] pages.
 *
 * Shows route hops with distance, flight time, time diff, exchange rates.
 * Displays Languages → Sectors → Currency → Faith with overlap awareness.
 */

interface Props {
  code: string
  languages: { code: string; name: string; nativeName?: string }[]
  topSectors: string[]
  topFaiths: string[]
  currency: string
  capital: string | null
  timezone: string | null
  population: number | null
  flagPng: string
  name: string
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
  XOF: 'CFA',
  XAF: 'CFA',
  MAD: 'د.م.',
  GHS: '₵',
  ETB: 'Br',
  COP: 'COL$',
  MXN: 'MX$',
  NZD: 'NZ$',
  PKR: '₨',
  BDT: '৳',
}

function fmtCurrency(code: string): string {
  const sym = CURRENCY_SYMBOLS[code]
  return sym ? `${code} (${sym})` : code
}

function formatTz(iana: string): string {
  return iana.replace(/^.*\//, '').replace(/_/g, ' ')
}

// ─── Haversine distance (km) ────────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = Math.PI / 180
  const dLat = (lat2 - lat1) * toRad
  const dLng = (lng2 - lng1) * toRad
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function fmtDistance(km: number): string {
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${Math.round(km)} km`
}

function fmtFlightTime(km: number): string {
  const hours = km / 800 // average cruise speed
  if (hours < 1) return `~${Math.round(hours * 60)}min`
  return hours < 10 ? `~${hours.toFixed(1)}h` : `~${Math.round(hours)}h`
}

// ─── UTC offset from IANA timezone ──────────────────────────────────────────
function getUtcOffsetMinutes(tz: string): number {
  try {
    const now = new Date()
    const str = now.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    const match = str.match(/GMT([+-]\d{1,2}(?::?\d{2})?)/)
    if (!match) return 0
    const parts = match[1].replace(':', '').match(/^([+-])(\d{1,2})(\d{2})?$/)
    if (!parts) return 0
    const sign = parts[1] === '-' ? -1 : 1
    return sign * (parseInt(parts[2]) * 60 + parseInt(parts[3] ?? '0'))
  } catch {
    return 0
  }
}

function fmtTimeDiff(minutes: number): string {
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const sign = minutes >= 0 ? '+' : '-'
  if (m === 0) return `${sign}${h}h`
  return `${sign}${h}h${m}m`
}

// ─── Exchange rate cache ────────────────────────────────────────────────────
const rateCache: Record<string, Record<string, number>> = {}

async function fetchRates(base: string): Promise<Record<string, number>> {
  if (rateCache[base]) return rateCache[base]
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`)
    if (!res.ok) return {}
    const data = await res.json()
    rateCache[base] = data.rates ?? {}
    return rateCache[base]
  } catch {
    return {}
  }
}

// ─── Route hop info ─────────────────────────────────────────────────────────
interface HopInfo {
  from: {
    code: string
    name: string
    flag: string
    currency: string
    tz: string
    lat: number
    lng: number
  }
  to: {
    code: string
    name: string
    flag: string
    currency: string
    tz: string
    lat: number
    lng: number
  }
  distanceKm: number
  timeDiffMin: number
  rate: number | null // exchange rate from→to currency
}

export default function CountryDimensions({
  code,
  languages,
  topSectors,
  topFaiths,
  currency,
  capital,
  timezone,
  population,
  flagPng,
  name,
}: Props) {
  const [otherCountryCodes, setOtherCountryCodes] = useState<string[]>([])
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bex-map-enriched')
      if (raw) {
        const all = JSON.parse(raw) as string[]
        setOtherCountryCodes(all.filter((c) => c !== code.toUpperCase()))
      }
    } catch {
      /* ignore */
    }
  }, [code])

  // Fetch exchange rates for this country's currency
  useEffect(() => {
    if (!currency || currency === '—') return
    fetchRates(currency).then(setExchangeRates)
  }, [currency])

  const otherCountries = otherCountryCodes
    .map((c) => COUNTRY_OPTIONS.find((o) => o.code === c))
    .filter(Boolean)

  const hasOthers = otherCountryCodes.length > 0
  const thisOpt = COUNTRY_OPTIONS.find((o) => o.code === code)

  // ─── Build route hops (sequential) ──────────────────────────────────────────
  const routeCountries = [
    {
      code,
      name,
      flag: thisOpt?.flag ?? '',
      currency,
      tz: timezone ?? thisOpt?.tz ?? '',
      lat: thisOpt?.lat ?? 0,
      lng: thisOpt?.lng ?? 0,
    },
    ...otherCountries.map((c) => ({
      code: c!.code,
      name: c!.name,
      flag: c!.flag,
      currency: c!.currency,
      tz: c!.tz,
      lat: c!.lat,
      lng: c!.lng,
    })),
  ]

  const hops: HopInfo[] = []
  for (let i = 0; i < routeCountries.length - 1; i++) {
    const from = routeCountries[i]
    const to = routeCountries[i + 1]
    const distanceKm = haversineKm(from.lat, from.lng, to.lat, to.lng)
    const fromOffset = getUtcOffsetMinutes(from.tz)
    const toOffset = getUtcOffsetMinutes(to.tz)
    const timeDiffMin = toOffset - fromOffset
    // Exchange rate: from.currency → to.currency
    let rate: number | null = null
    if (from.currency !== to.currency && exchangeRates[to.currency]) {
      rate = exchangeRates[to.currency]
    }
    hops.push({ from, to, distanceKm, timeDiffMin, rate })
  }

  // ─── Overlap helpers ────────────────────────────────────────────────────────
  function langOverlap(langCode: string): number {
    return otherCountries.filter((c) => c!.languages.includes(langCode as LanguageCode)).length
  }
  function sectorOverlap(sector: string): number {
    return otherCountries.filter((c) => c!.topSectors.includes(sector)).length
  }
  function currencyOverlap(curr: string): number {
    return otherCountries.filter((c) => c!.currency === curr).length
  }
  function faithOverlap(faith: string): number {
    return otherCountries.filter((c) => c!.topFaiths.includes(faith as FaithCode)).length
  }

  // ─── Sorted dimension arrays (shared first) ────────────────────────────────
  const sortedLanguages = [...languages].sort((a, b) => {
    const d = langOverlap(b.code) - langOverlap(a.code)
    if (d !== 0) return d
    const aR = COUNTRY_OPTIONS.filter((c) => c.languages.includes(a.code as LanguageCode)).length
    const bR = COUNTRY_OPTIONS.filter((c) => c.languages.includes(b.code as LanguageCode)).length
    return bR - aR
  })

  const sortedSectors = [...topSectors].sort((a, b) => {
    const d = sectorOverlap(b) - sectorOverlap(a)
    if (d !== 0) return d
    return (
      COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(b)).length -
      COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(a)).length
    )
  })

  const sortedFaiths = [...topFaiths].sort((a, b) => {
    const d = faithOverlap(b) - faithOverlap(a)
    if (d !== 0) return d
    return (
      COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(b as FaithCode)).length -
      COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(a as FaithCode)).length
    )
  })

  // ─── Currency: collect all unique currencies across selected countries ──────
  const allCurrencies: string[] = [currency]
  otherCountries.forEach((c) => {
    if (!allCurrencies.includes(c!.currency)) allCurrencies.push(c!.currency)
  })
  allCurrencies.sort((a, b) => {
    const aShared =
      (a === currency ? 1 : 0) + otherCountries.filter((c) => c!.currency === a).length
    const bShared =
      (b === currency ? 1 : 0) + otherCountries.filter((c) => c!.currency === b).length
    if (aShared !== bShared) return bShared - aShared
    return (
      COUNTRY_OPTIONS.filter((c) => c.currency === b).length -
      COUNTRY_OPTIONS.filter((c) => c.currency === a).length
    )
  })

  return (
    <>
      {/* ── Route hops (multi-select) ── */}
      {hasOthers && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
            Route · {routeCountries.length} Countries
          </h2>
          {hops.map((hop, i) => (
            <div
              key={`${hop.from.code}-${hop.to.code}`}
              className="rounded-xl border border-brand-accent/15 bg-brand-surface/50 p-3 sm:p-4"
            >
              {/* From → To with flags */}
              <div className="mb-2 flex items-center gap-2 text-sm sm:text-base">
                <span className="inline-flex items-center gap-1 font-medium text-brand-text">
                  <span className="text-base">{hop.from.flag}</span>
                  {hop.from.name}
                </span>
                <span className="text-brand-accent">→</span>
                <span className="inline-flex items-center gap-1 font-medium text-brand-text">
                  <span className="text-base">{hop.to.flag}</span>
                  {hop.to.name}
                </span>
              </div>
              {/* Stats row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-brand-text-muted">
                <span title="Haversine distance">
                  <span className="font-medium text-brand-text">{fmtDistance(hop.distanceKm)}</span>
                </span>
                <span title="Estimated flight time">
                  <span className="font-medium text-brand-text">
                    {fmtFlightTime(hop.distanceKm)}
                  </span>{' '}
                  flight
                </span>
                {hop.timeDiffMin !== 0 && (
                  <span title="Time difference">
                    <span className="font-medium text-brand-text">
                      {fmtTimeDiff(hop.timeDiffMin)}
                    </span>{' '}
                    time
                  </span>
                )}
                {hop.timeDiffMin === 0 && (
                  <span className="text-brand-text-muted">same timezone</span>
                )}
                {hop.from.currency !== hop.to.currency && hop.rate && (
                  <span title="Exchange rate">
                    1 {hop.from.currency} ={' '}
                    <span className="font-medium text-brand-accent">
                      {hop.rate < 0.01
                        ? hop.rate.toFixed(5)
                        : hop.rate < 1
                          ? hop.rate.toFixed(4)
                          : hop.rate < 100
                            ? hop.rate.toFixed(2)
                            : Math.round(hop.rate).toLocaleString()}{' '}
                      {hop.to.currency}
                    </span>
                  </span>
                )}
                {hop.from.currency === hop.to.currency && (
                  <span className="text-brand-text-muted">same currency ({hop.from.currency})</span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Languages ── */}
      {sortedLanguages.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {sortedLanguages.map((lang) => {
              const overlap = langOverlap(lang.code)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = COUNTRY_OPTIONS.filter((c) =>
                c.languages.includes(lang.code as LanguageCode)
              ).length
              return (
                <span
                  key={lang.code}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${
                    isShared
                      ? 'border-teal-300/50 bg-teal-500/20 text-teal-200 shadow-[0_0_10px_rgba(45,212,191,0.2)] ring-1 ring-teal-400/30'
                      : 'border-teal-400/25 bg-teal-500/10 text-teal-300'
                  }`}
                >
                  {lang.name}
                  {lang.nativeName && lang.nativeName !== lang.name && (
                    <span className="text-xs text-brand-text-muted sm:text-sm">
                      ({lang.nativeName})
                    </span>
                  )}
                  {isShared && (
                    <span className="rounded-full bg-teal-400/30 px-1.5 text-[10px] font-bold text-teal-200 sm:text-xs">
                      ×{multiplier}
                    </span>
                  )}
                  {!isShared && reach > 1 && (
                    <span className="rounded-full bg-teal-400/20 px-1.5 text-[10px] text-teal-400/70 sm:text-xs">
                      {reach}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Sectors ── */}
      {sortedSectors.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Top Sectors
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {sortedSectors.map((sector) => {
              const overlap = sectorOverlap(sector)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(sector)).length
              return (
                <span
                  key={sector}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-center text-xs sm:px-4 sm:text-sm transition-all ${
                    isShared
                      ? 'border-lime-300/50 bg-lime-500/20 text-lime-200 shadow-[0_0_10px_rgba(132,204,22,0.2)] ring-1 ring-lime-400/30'
                      : 'border-lime-400/15 bg-lime-500/10 text-lime-300'
                  }`}
                >
                  {sector}
                  {isShared && (
                    <span className="rounded-full bg-lime-400/30 px-1.5 text-[10px] font-bold text-lime-200">
                      ×{multiplier}
                    </span>
                  )}
                  {!isShared && reach > 1 && (
                    <span className="rounded-full bg-lime-400/20 px-1.5 text-[10px] text-lime-400/70">
                      {reach}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Currency ── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
          Currency
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {allCurrencies.map((curr) => {
            const overlap = currencyOverlap(curr)
            const isMine = curr === currency
            const totalCountries = (isMine ? 1 : 0) + overlap
            const isShared = hasOthers && totalCountries > 1
            const reach = COUNTRY_OPTIONS.filter((c) => c.currency === curr).length
            const rate = curr !== currency ? exchangeRates[curr] : null
            return (
              <span
                key={curr}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${
                  isShared
                    ? 'border-amber-300/50 bg-amber-500/20 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/30'
                    : 'border-amber-400/25 bg-amber-500/10 text-amber-300'
                }`}
              >
                {fmtCurrency(curr)}
                {rate && (
                  <span className="text-[10px] text-amber-400/80 sm:text-xs">
                    1:
                    {rate < 1
                      ? rate.toFixed(4)
                      : rate < 100
                        ? rate.toFixed(2)
                        : Math.round(rate).toLocaleString()}
                  </span>
                )}
                {isShared && (
                  <span className="rounded-full bg-amber-400/30 px-1.5 text-[10px] font-bold text-amber-200 sm:text-xs">
                    ×{totalCountries}
                  </span>
                )}
                {!isShared && !rate && reach > 1 && (
                  <span className="rounded-full bg-amber-400/20 px-1.5 text-[10px] text-amber-400/70 sm:text-xs">
                    {reach}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </section>

      {/* ── Faiths ── */}
      {sortedFaiths.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Faiths
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {sortedFaiths.map((faith) => {
              const overlap = faithOverlap(faith)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = COUNTRY_OPTIONS.filter((c) =>
                c.topFaiths.includes(faith as FaithCode)
              ).length
              return (
                <span
                  key={faith}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${
                    isShared
                      ? 'border-violet-300/50 bg-violet-500/20 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)] ring-1 ring-violet-400/30'
                      : 'border-violet-400/25 bg-violet-500/10 text-violet-300'
                  }`}
                >
                  {FAITH_LABELS[faith] ?? faith}
                  {isShared && (
                    <span className="rounded-full bg-violet-400/30 px-1.5 text-[10px] font-bold text-violet-200 sm:text-xs">
                      ×{multiplier}
                    </span>
                  )}
                  {!isShared && reach > 1 && (
                    <span className="rounded-full bg-violet-400/20 px-1.5 text-[10px] text-violet-400/70 sm:text-xs">
                      {reach}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}

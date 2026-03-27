'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_REGISTRY,
  type LanguageCode,
  type FaithCode,
} from '@/lib/country-selector'
import { haversineKm, fmtDistance, fmtFlightTime, getUtcOffsetMinutes } from '@/lib/geo'

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

// ─── UTC offset from IANA timezone ──────────────────────────────────────────

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
interface HopCountry {
  code: string
  name: string
  flag: string
  currency: string
  tz: string
  lat: number
  lng: number
}

interface HopInfo {
  from: HopCountry
  to: HopCountry
  distanceKm: number
  timeDiffMin: number
  rate: number | null // exchange rate from→to currency
  startCurrency: string // the route's starting currency
  startRate: number | null // rate from start currency to to.currency
  isNewCurrency: boolean // whether to.currency first appears in this hop
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
  const [allRouteCodes, setAllRouteCodes] = useState<string[]>([])
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bex-map-enriched')
      if (raw) {
        const all = JSON.parse(raw) as string[]
        // Preserve click order; ensure current page's country is in the list
        if (!all.includes(code.toUpperCase())) {
          all.unshift(code.toUpperCase())
        }
        setAllRouteCodes(all)
      } else {
        setAllRouteCodes([code.toUpperCase()])
      }
    } catch {
      setAllRouteCodes([code.toUpperCase()])
    }
  }, [code])

  const otherCountryCodes = allRouteCodes.filter((c) => c !== code.toUpperCase())

  // Fetch exchange rates for the first country's currency in route order
  useEffect(() => {
    const firstCode = allRouteCodes[0]
    const firstOpt = firstCode ? COUNTRY_OPTIONS.find((o) => o.code === firstCode) : null
    const baseCurrency = firstOpt?.currency
    if (!baseCurrency) return
    fetchRates(baseCurrency).then(setExchangeRates)
  }, [allRouteCodes])

  const otherCountries = otherCountryCodes
    .map((c) => COUNTRY_OPTIONS.find((o) => o.code === c))
    .filter(Boolean)

  const hasOthers = otherCountryCodes.length > 0
  const thisOpt = COUNTRY_OPTIONS.find((o) => o.code === code)

  // ─── Build route hops in click order ──────────────────────────────────────────
  const routeCountries = allRouteCodes
    .map((c) => {
      const opt = COUNTRY_OPTIONS.find((o) => o.code === c)
      if (!opt) return null
      // Use server-provided data for the current page's country
      if (c === code.toUpperCase()) {
        return {
          code,
          name,
          flag: opt.flag,
          currency,
          tz: timezone ?? opt.tz,
          lat: opt.lat,
          lng: opt.lng,
        }
      }
      return {
        code: opt.code,
        name: opt.name,
        flag: opt.flag,
        currency: opt.currency,
        tz: opt.tz,
        lat: opt.lat,
        lng: opt.lng,
      }
    })
    .filter(Boolean) as {
    code: string
    name: string
    flag: string
    currency: string
    tz: string
    lat: number
    lng: number
  }[]

  const hops: HopInfo[] = []
  const seenCurrencies = new Set<string>(routeCountries[0] ? [routeCountries[0].currency] : [])
  const startCurrency = routeCountries[0]?.currency ?? ''

  for (let i = 0; i < routeCountries.length - 1; i++) {
    const from = routeCountries[i]
    const to = routeCountries[i + 1]
    const distanceKm = haversineKm(from.lat, from.lng, to.lat, to.lng)
    const fromOffset = getUtcOffsetMinutes(from.tz)
    const toOffset = getUtcOffsetMinutes(to.tz)
    const timeDiffMin = toOffset - fromOffset
    const isNewCurrency = !seenCurrencies.has(to.currency)
    seenCurrencies.add(to.currency)
    // Exchange rate: from.currency → to.currency (cross-rate via base)
    let rate: number | null = null
    if (from.currency !== to.currency) {
      const fromRate = exchangeRates[from.currency] ?? 1
      const toRate = exchangeRates[to.currency]
      if (toRate && fromRate) rate = toRate / fromRate
    }
    // Start→destination rate for newly appearing currencies
    let startRate: number | null = null
    if (isNewCurrency && to.currency !== startCurrency) {
      startRate = exchangeRates[to.currency] ?? null
    }
    hops.push({ from, to, distanceKm, timeDiffMin, rate, startCurrency, startRate, isNewCurrency })
  }

  // ─── Overlap helpers ────────────────────────────────────────────────────────
  // Total overlap: any position in the array (used for sorting/display)
  function langOverlap(langCode: string): number {
    return otherCountries.filter((c) => c!.languages.includes(langCode as LanguageCode)).length
  }
  function sectorOverlap(sector: string): number {
    return otherCountries.filter((c) => c!.topSectors.includes(sector)).length
  }
  function faithOverlap(faith: string): number {
    return otherCountries.filter((c) => c!.topFaiths.includes(faith as FaithCode)).length
  }
  function currencyOverlap(cur: string): number {
    return otherCountries.filter((c) => c!.currency === cur).length
  }
  // Primary overlap: only counts countries where this is the DOMINANT (first) value
  // Used for rarity glow — "do they share the same dominant trait?"
  function primaryLangOverlap(langCode: string): number {
    return otherCountries.filter((c) => c!.languages[0] === langCode).length
  }
  function primarySectorOverlap(sector: string): number {
    return otherCountries.filter((c) => c!.topSectors[0] === sector).length
  }
  function primaryFaithOverlap(faith: string): number {
    return otherCountries.filter((c) => c!.topFaiths[0] === faith).length
  }

  // ─── Rarity system: overlap count → shiny tier (level 0-4) ─────────────────
  // Level 0 = unmatched (no class). Level 1 = common match. 2 = shiny. 3 = ultra. 4 = legendary.
  const RARITY_HUE: Record<string, number> = {
    language: 185,
    sector: 90,
    faith: 275,
    currency: 345,
  }

  function rarityClass(overlap: number): string {
    if (overlap >= 4) return 'rarity-legendary' // Level 4: 5+ countries share
    if (overlap === 3) return 'rarity-ultra' // Level 3: 4 countries share
    if (overlap === 2) return 'rarity-shiny' // Level 2: 3 countries share
    if (overlap === 1) return 'rarity-common' // Level 1: 2 countries share
    return '' // Level 0: unique to this country
  }

  function rarityStyle(dim: string): React.CSSProperties | undefined {
    const hue = RARITY_HUE[dim]
    return hue !== undefined ? ({ '--rarity-hue': String(hue) } as React.CSSProperties) : undefined
  }

  // ─── Pre-compute reach maps (O(n) once, not O(n) per chip) ─────────────────
  const langReach = useMemo(() => {
    const map: Record<string, number> = {}
    for (const c of COUNTRY_OPTIONS) for (const l of c.languages) map[l] = (map[l] || 0) + 1
    return map
  }, [])
  const sectorReach = useMemo(() => {
    const map: Record<string, number> = {}
    for (const c of COUNTRY_OPTIONS) for (const s of c.topSectors) map[s] = (map[s] || 0) + 1
    return map
  }, [])
  const faithReach = useMemo(() => {
    const map: Record<string, number> = {}
    for (const c of COUNTRY_OPTIONS) for (const f of c.topFaiths) map[f] = (map[f] || 0) + 1
    return map
  }, [])
  const currencyReach = useMemo(() => {
    const map: Record<string, number> = {}
    for (const c of COUNTRY_OPTIONS) map[c.currency] = (map[c.currency] || 0) + 1
    return map
  }, [])

  // ─── Sorted dimension arrays ──────────────────────────────────────────────
  // Single country: preserve original priority order from COUNTRY_OPTIONS
  // Multi country: sort shared-first, then by global reach
  const sortedLanguages = hasOthers
    ? [...languages].sort((a, b) => {
        const d = langOverlap(b.code) - langOverlap(a.code)
        return d !== 0 ? d : (langReach[b.code] ?? 0) - (langReach[a.code] ?? 0)
      })
    : languages

  const sortedSectors = hasOthers
    ? [...topSectors].sort((a, b) => {
        const d = sectorOverlap(b) - sectorOverlap(a)
        return d !== 0 ? d : (sectorReach[b] ?? 0) - (sectorReach[a] ?? 0)
      })
    : topSectors

  const sortedFaiths = hasOthers
    ? [...topFaiths].sort((a, b) => {
        const d = faithOverlap(b) - faithOverlap(a)
        return d !== 0 ? d : (faithReach[b] ?? 0) - (faithReach[a] ?? 0)
      })
    : topFaiths

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
                  <>
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
                    {/* Cumulative: start currency → new destination currency */}
                    {hop.isNewCurrency &&
                      hop.startCurrency !== hop.from.currency &&
                      hop.startRate && (
                        <span className="text-brand-text-muted/60" title="From route start">
                          (1 {hop.startCurrency} ={' '}
                          <span className="font-medium text-brand-accent/70">
                            {hop.startRate < 0.01
                              ? hop.startRate.toFixed(5)
                              : hop.startRate < 1
                                ? hop.startRate.toFixed(4)
                                : hop.startRate < 100
                                  ? hop.startRate.toFixed(2)
                                  : Math.round(hop.startRate).toLocaleString()}{' '}
                            {hop.to.currency}
                          </span>
                          )
                        </span>
                      )}
                  </>
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
            {sortedLanguages.map((lang, idx) => {
              const overlap = langOverlap(lang.code)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = langReach[lang.code] ?? 0
              // Rarity: based on primary overlap (dominant language match)
              // Current country's value is primary if it's first in list (idx === 0)
              const pOverlap = idx === 0 ? primaryLangOverlap(lang.code) : 0
              const rarity = isShared ? rarityClass(pOverlap) : ''
              return (
                <span
                  key={lang.code}
                  style={isShared ? rarityStyle('language') : undefined}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${rarity} ${
                    isShared
                      ? 'border-teal-300/50 bg-teal-500/20 text-teal-200'
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
            {sortedSectors.map((sector, idx) => {
              const overlap = sectorOverlap(sector)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = sectorReach[sector] ?? 0
              const pOverlap = idx === 0 ? primarySectorOverlap(sector) : 0
              const rarity = isShared ? rarityClass(pOverlap) : ''
              return (
                <span
                  key={sector}
                  style={isShared ? rarityStyle('sector') : undefined}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-center text-xs sm:px-4 sm:text-sm transition-all ${rarity} ${
                    isShared
                      ? 'border-lime-300/50 bg-lime-500/20 text-lime-200'
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

      {/* ── Currencies (all from route) ── */}
      {currency && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            {hasOthers ? 'Currencies' : 'Currency'}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {(() => {
              // Collect all unique currencies across route countries, current country first
              const currencyMap = new Map<string, string[]>()
              currencyMap.set(currency, [code.toUpperCase()])
              for (const other of otherCountries) {
                const cur = other!.currency
                const existing = currencyMap.get(cur) ?? []
                existing.push(other!.code)
                currencyMap.set(cur, existing)
              }
              return Array.from(currencyMap.entries())
                .sort((a, b) => b[1].length - a[1].length)
                .map(([cur, codes]) => {
                  const isShared = codes.length >= 2
                  const reach = currencyReach[cur] ?? 0
                  const isCurrent = cur === currency
                  const curOverlap = codes.length - 1 // how many other countries share
                  const rarity = isShared ? rarityClass(curOverlap) : ''
                  return (
                    <span
                      key={cur}
                      style={isShared ? rarityStyle('currency') : undefined}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${rarity} ${
                        isShared
                          ? 'border-rose-300/50 bg-rose-500/20 text-rose-200'
                          : isCurrent
                            ? 'border-rose-400/25 bg-rose-500/10 text-rose-300'
                            : 'border-rose-400/15 bg-rose-500/5 text-rose-300/60'
                      }`}
                    >
                      {cur}
                      {isShared && (
                        <span className="rounded-full bg-rose-400/30 px-1.5 text-[10px] font-bold text-rose-200 sm:text-xs">
                          ×{codes.length}
                        </span>
                      )}
                      {!isShared && reach > 1 && (
                        <span className="rounded-full bg-rose-400/20 px-1.5 text-[10px] text-rose-400/70 sm:text-xs">
                          {reach}
                        </span>
                      )}
                    </span>
                  )
                })
            })()}
          </div>
        </section>
      )}

      {/* ── Faiths ── */}
      {sortedFaiths.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Faiths
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {sortedFaiths.map((faith, idx) => {
              const overlap = faithOverlap(faith)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = faithReach[faith] ?? 0
              const pOverlap = idx === 0 ? primaryFaithOverlap(faith) : 0
              const rarity = isShared ? rarityClass(pOverlap) : ''
              return (
                <span
                  key={faith}
                  style={isShared ? rarityStyle('faith') : undefined}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${rarity} ${
                    isShared
                      ? 'border-violet-300/50 bg-violet-500/20 text-violet-200'
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

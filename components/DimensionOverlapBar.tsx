'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { ActiveFilter } from '@/components/DimensionFilters'
import { DEPTH_SHAPES } from '@/components/WorldMap'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'
import { haversineKm, fmtDistance, fmtFlightTime, getUtcOffsetMinutes } from '@/lib/geo'

/**
 * DimensionOverlapBar — shared context bar for Agent + Opportunities pages.
 *
 * Reads enriched countries + filters from sessionStorage (set by map page).
 * Shows country chips (removable with red X) + route hops + dimension overlap matrix.
 * Writes back on removal for two-way sync with the map.
 */

interface DimensionOverlapBarProps {
  /** Called when a dimension value chip is clicked — page-specific action */
  onDimensionClick?: (dimension: string, value: string, countryCodes: string[]) => void
  /** Currently focused dimension:value (for toggle highlight) */
  focusedValue?: string | null
}

/** Country flag emoji from ISO code */
function countryFlag(code: string): string {
  try {
    return String.fromCodePoint(
      ...code
        .toUpperCase()
        .split('')
        .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    )
  } catch {
    return '\u{1F30D}'
  }
}

const DIMENSION_ORDER = ['language', 'sector', 'currency', 'faith'] as const
const DIMENSION_LABELS: Record<string, { label: string; icon: string }> = {
  language: { label: 'Language', icon: '\u{1F5E3}\uFE0F' },
  sector: { label: 'Sector', icon: '\u{1F4BC}' },
  faith: { label: 'Faith', icon: '\u262A\uFE0F' },
  currency: { label: 'Currency', icon: '\u{1F4B1}' },
}

const DIMENSION_COLORS: Record<string, string> = {
  language: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
  sector: 'bg-lime-500/20 text-lime-300 border-lime-400/30',
  faith: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
  currency: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
}

const DIMENSION_COLORS_BRIGHT: Record<string, string> = {
  language: 'bg-teal-500/30 text-teal-200 border-teal-400/50 shadow-[0_0_6px_rgba(45,212,191,0.2)]',
  sector: 'bg-lime-500/30 text-lime-200 border-lime-400/50 shadow-[0_0_6px_rgba(132,204,22,0.2)]',
  faith:
    'bg-violet-500/30 text-violet-200 border-violet-400/50 shadow-[0_0_6px_rgba(139,92,246,0.2)]',
  currency: 'bg-rose-500/30 text-rose-200 border-rose-400/50 shadow-[0_0_6px_rgba(244,63,94,0.2)]',
}

// ─── Rarity system: CSS-only glow tiers keyed by overlap depth ──────────────
const RARITY_HUE: Record<string, number> = {
  language: 185, // teal
  sector: 90, // lime
  faith: 275, // violet
  currency: 345, // rose
}

function rarityClass(overlap: number): string {
  if (overlap >= 4) return 'rarity-legendary'
  if (overlap === 3) return 'rarity-ultra'
  if (overlap === 2) return 'rarity-shiny'
  if (overlap === 1) return 'rarity-common'
  return ''
}

function rarityStyle(dim: string): React.CSSProperties | undefined {
  const hue = RARITY_HUE[dim]
  return hue !== undefined ? ({ '--rarity-hue': String(hue) } as React.CSSProperties) : undefined
}

const DIMENSION_COLORS_FOCUSED: Record<string, string> = {
  language:
    'bg-teal-500/40 text-teal-100 border-teal-300/60 shadow-[0_0_10px_rgba(45,212,191,0.3)] ring-1 ring-teal-400/40',
  sector:
    'bg-lime-500/40 text-lime-100 border-lime-300/60 shadow-[0_0_10px_rgba(132,204,22,0.3)] ring-1 ring-lime-400/40',
  faith:
    'bg-violet-500/40 text-violet-100 border-violet-300/60 shadow-[0_0_10px_rgba(139,92,246,0.3)] ring-1 ring-violet-400/40',
  currency:
    'bg-rose-500/40 text-rose-100 border-rose-300/60 shadow-[0_0_10px_rgba(244,63,94,0.3)] ring-1 ring-rose-400/40',
}

/** Overlap value: a dimension value shared by 1+ countries */
interface OverlapValue {
  dimension: string
  nodeCode: string
  label: string
  icon: string
  sources: string[] // country codes that share this value
  primarySources: string[] // country codes where this is the PRIMARY (dominant) value
  countryCodes: string[] // all country codes matched by this filter
}

// ─── Route hop utilities ────────────────────────────────────────────────────

function fmtTimeDiff(minutes: number): string {
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const sign = minutes >= 0 ? '+' : '-'
  if (m === 0) return `${sign}${h}h`
  return `${sign}${h}h${m}m`
}

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

interface HopInfo {
  fromCode: string
  fromName: string
  fromFlag: string
  toCode: string
  toName: string
  toFlag: string
  distanceKm: number
  timeDiffMin: number
  fromCurrency: string
  toCurrency: string
  rate: number | null
  /** Rate from the route's starting currency to toCurrency (shown when toCurrency is new) */
  startCurrency: string
  startRate: number | null
  /** Whether toCurrency first appears in this hop */
  isNewCurrency: boolean
}

export default function DimensionOverlapBar({
  onDimensionClick,
  focusedValue,
}: DimensionOverlapBarProps) {
  const [filters, setFilters] = useState<ActiveFilter[]>([])
  const [enrichedCountries, setEnrichedCountries] = useState<string[]>([])
  const [enrichedNames, setEnrichedNames] = useState<Record<string, string>>({})
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [hops, setHops] = useState<HopInfo[]>([])

  // Load from sessionStorage on mount — amplify to ALL dimensions per country
  useEffect(() => {
    try {
      const rawEnriched = sessionStorage.getItem('bex-map-enriched')
      const enriched = rawEnriched ? (JSON.parse(rawEnriched) as string[]) : []
      if (rawEnriched) setEnrichedCountries(enriched)

      const rawNames = sessionStorage.getItem('bex-map-enriched-names')
      if (rawNames) setEnrichedNames(JSON.parse(rawNames) as Record<string, string>)

      // Amplify: expand each enriched country to ALL its dimensions
      // Map only stores 1 per type — agent/opportunities need the full picture
      const rawFilters = sessionStorage.getItem('bex-map-filters')
      const mapFilters = rawFilters ? (JSON.parse(rawFilters) as ActiveFilter[]) : []
      const customFilters = mapFilters.filter((f) => f.source === 'custom' || !f.source)

      const amplified: ActiveFilter[] = [...customFilters]
      for (const countryCode of enriched) {
        const country = COUNTRY_OPTIONS.find((c) => c.code === countryCode)
        if (!country) continue

        // ALL languages — first = primary (dominant/official)
        for (let i = 0; i < country.languages.length; i++) {
          const langCode = country.languages[i]
          const langInfo = LANGUAGE_REGISTRY[langCode]
          if (!langInfo) continue
          const matching = COUNTRY_OPTIONS.filter((c) => c.languages.includes(langCode))
          amplified.push({
            dimension: 'language',
            nodeCode: langCode,
            label: langInfo.name,
            icon: '\u{1F5E3}\uFE0F',
            countryCodes: matching.map((c) => c.code),
            source: countryCode,
            isPrimary: i === 0,
          })
        }

        // ALL sectors — first = primary industry
        for (let i = 0; i < country.topSectors.length; i++) {
          const sector = country.topSectors[i]
          const matching = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(sector))
          amplified.push({
            dimension: 'sector',
            nodeCode: sector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            label: sector,
            icon: '\u{1F4BC}',
            countryCodes: matching.map((c) => c.code),
            source: countryCode,
            isPrimary: i === 0,
          })
        }

        // Currency — always primary (1 per country)
        const currencyMatches = COUNTRY_OPTIONS.filter((c) => c.currency === country.currency)
        amplified.push({
          dimension: 'currency',
          nodeCode: country.currency.toLowerCase(),
          label: country.currency,
          icon: '\u{1F4B1}',
          countryCodes: currencyMatches.map((c) => c.code),
          source: countryCode,
          isPrimary: true,
        })

        // ALL faiths — first = dominant faith
        for (let i = 0; i < country.topFaiths.length; i++) {
          const faith = country.topFaiths[i]
          const matching = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(faith))
          amplified.push({
            dimension: 'faith',
            nodeCode: faith,
            label: faith.charAt(0).toUpperCase() + faith.slice(1),
            icon: '\u262A\uFE0F',
            countryCodes: matching.map((c) => c.code),
            source: countryCode,
            isPrimary: i === 0,
          })
        }
      }

      setFilters(amplified)
    } catch {
      // ignore
    }
  }, [])

  // Compute route hops when enriched countries change
  useEffect(() => {
    if (enrichedCountries.length < 2) {
      setHops([])
      return
    }

    const countries = enrichedCountries
      .map((c) => COUNTRY_OPTIONS.find((o) => o.code === c))
      .filter(Boolean)

    if (countries.length < 2) {
      setHops([])
      return
    }

    // Build hops sequentially, tracking which currencies we've seen
    const newHops: HopInfo[] = []
    const seenCurrencies = new Set<string>([countries[0]!.currency])
    const startCurrency = countries[0]!.currency

    for (let i = 0; i < countries.length - 1; i++) {
      const from = countries[i]!
      const to = countries[i + 1]!
      const distanceKm = haversineKm(from.lat, from.lng, to.lat, to.lng)
      const fromOffset = getUtcOffsetMinutes(from.tz)
      const toOffset = getUtcOffsetMinutes(to.tz)
      const isNewCurrency = !seenCurrencies.has(to.currency)
      seenCurrencies.add(to.currency)
      newHops.push({
        fromCode: from.code,
        fromName: from.name,
        fromFlag: from.flag,
        toCode: to.code,
        toName: to.name,
        toFlag: to.flag,
        distanceKm,
        timeDiffMin: toOffset - fromOffset,
        fromCurrency: from.currency,
        toCurrency: to.currency,
        rate: null,
        startCurrency,
        startRate: null,
        isNewCurrency,
      })
    }

    // Fetch exchange rates for the first country's currency (= route start)
    fetchRates(startCurrency).then((rates) => {
      const updated = newHops.map((hop) => {
        let rate = hop.rate
        let startRate = hop.startRate

        if (hop.fromCurrency !== hop.toCurrency) {
          // Cross-rate: hop.from → hop.to via the base (start) currency
          const fromRate = rates[hop.fromCurrency] ?? 1
          const toRate = rates[hop.toCurrency]
          rate = toRate && fromRate ? toRate / fromRate : null
        }

        // Start→destination rate for newly appearing currencies
        if (hop.isNewCurrency && hop.toCurrency !== hop.startCurrency) {
          startRate = rates[hop.toCurrency] ?? null
        }

        return { ...hop, rate, startRate }
      })
      setHops(updated)
    })

    // Set hops immediately (without rates), rates will update async
    setHops(newHops)
  }, [enrichedCountries])

  // Write back to sessionStorage on changes (two-way sync)
  const syncToStorage = useCallback(
    (newFilters: ActiveFilter[], newEnriched: string[], newNames: Record<string, string>) => {
      sessionStorage.setItem('bex-map-filters', JSON.stringify(newFilters))
      sessionStorage.setItem('bex-map-enriched', JSON.stringify(newEnriched))
      sessionStorage.setItem('bex-map-enriched-names', JSON.stringify(newNames))
      // Legacy keys
      if (newEnriched.length > 0) {
        sessionStorage.setItem('bex-map-selected', newEnriched[newEnriched.length - 1])
      } else {
        sessionStorage.removeItem('bex-map-selected')
        sessionStorage.removeItem('bex-map-selected-name')
      }
    },
    []
  )

  // Remove a single country
  const removeCountry = useCallback(
    (code: string) => {
      const newFilters = filters.filter((f) => f.source !== code)
      const newEnriched = enrichedCountries.filter((c) => c !== code)
      const newNames = { ...enrichedNames }
      delete newNames[code]
      setFilters(newFilters)
      setEnrichedCountries(newEnriched)
      setEnrichedNames(newNames)
      syncToStorage(newFilters, newEnriched, newNames)
    },
    [filters, enrichedCountries, enrichedNames, syncToStorage]
  )

  // Clear all
  const clearAll = useCallback(() => {
    setFilters([])
    setEnrichedCountries([])
    setEnrichedNames({})
    syncToStorage([], [], {})
  }, [syncToStorage])

  // Compute overlap matrix: group by dimension:nodeCode, track which sources share each value
  const overlapByDimension = useMemo(() => {
    const result: Record<string, OverlapValue[]> = {}

    for (const dim of DIMENSION_ORDER) {
      const valueMap = new Map<
        string,
        {
          label: string
          icon: string
          sources: Set<string>
          primarySources: Set<string>
          countryCodes: Set<string>
        }
      >()

      for (const f of filters) {
        if (f.dimension !== dim) continue
        const key = f.nodeCode
        const entry = valueMap.get(key) ?? {
          label: f.label ?? f.nodeCode,
          icon: f.icon ?? '\u25C6',
          sources: new Set<string>(),
          primarySources: new Set<string>(),
          countryCodes: new Set<string>(),
        }
        if (f.source && f.source !== 'custom') {
          entry.sources.add(f.source)
          if (f.isPrimary) {
            entry.primarySources.add(f.source)
          }
        }
        for (const c of f.countryCodes ?? []) entry.countryCodes.add(c)
        valueMap.set(key, entry)
      }

      // Sort: shared (2+) first by primary source count desc, then total source count
      const values = Array.from(valueMap.entries())
        .map(([nodeCode, v]) => ({
          dimension: dim,
          nodeCode,
          label: v.label,
          icon: v.icon,
          sources: Array.from(v.sources),
          primarySources: Array.from(v.primarySources),
          countryCodes: Array.from(v.countryCodes),
        }))
        .sort(
          (a, b) =>
            b.primarySources.length - a.primarySources.length || b.sources.length - a.sources.length
        )

      if (values.length > 0) result[dim] = values
    }

    return result
  }, [filters])

  const hasContent = enrichedCountries.length > 0 || filters.length > 0
  if (!hasContent) return null

  return (
    <div className="border-b border-brand-accent/10 bg-brand-surface/50 px-6 py-3">
      <div className="mx-auto max-w-5xl space-y-2.5">
        {/* ═══ Country chips row ═══ */}
        {enrichedCountries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {enrichedCountries.map((code) => (
              <div
                key={code}
                className="group relative flex items-center"
                onMouseEnter={() => setHoveredCountry(code)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Red X — slides in from left on hover */}
                <button
                  onClick={() => removeCountry(code)}
                  className="absolute -left-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80 text-[10px] font-bold text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-left-2.5 hover:bg-red-500"
                  title={`Remove ${enrichedNames[code] ?? code}`}
                >
                  &times;
                </button>

                {/* Country chip */}
                <span
                  className={`rounded-full border px-3 py-1 text-sm transition-all duration-200 ${
                    hoveredCountry === code
                      ? 'border-red-400/60 bg-red-500/10 text-red-300'
                      : 'border-brand-accent/20 bg-brand-accent/10 text-brand-accent'
                  }`}
                >
                  {countryFlag(code)} {enrichedNames[code] ?? code}
                </span>
              </div>
            ))}

            {/* Clear all — integrated at end of row */}
            {enrichedCountries.length > 1 && (
              <button
                onClick={clearAll}
                className="rounded-full px-2 py-1 text-[10px] text-brand-text-muted/50 transition hover:text-red-400/70 hover:bg-red-500/10"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* ═══ Route hops (compact) ═══ */}
        {hops.length > 0 && (
          <div className="space-y-1">
            {hops.map((hop) => (
              <div
                key={`${hop.fromCode}-${hop.toCode}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-brand-accent/10 bg-brand-bg/50 px-3 py-1.5 text-[11px] text-brand-text-muted"
              >
                <span className="font-medium text-brand-text">
                  {hop.fromFlag} {hop.fromName}
                  <span className="mx-1.5 text-brand-accent">→</span>
                  {hop.toFlag} {hop.toName}
                </span>
                <span>
                  <span className="font-medium text-brand-text">{fmtDistance(hop.distanceKm)}</span>
                </span>
                <span>
                  <span className="font-medium text-brand-text">
                    {fmtFlightTime(hop.distanceKm)}
                  </span>{' '}
                  flight
                </span>
                {hop.timeDiffMin !== 0 ? (
                  <span>
                    <span className="font-medium text-brand-text">
                      {fmtTimeDiff(hop.timeDiffMin)}
                    </span>{' '}
                    time
                  </span>
                ) : (
                  <span>same tz</span>
                )}
                {hop.fromCurrency !== hop.toCurrency && hop.rate ? (
                  <>
                    <span>
                      1 {hop.fromCurrency} ={' '}
                      <span className="font-medium text-brand-accent">
                        {hop.rate < 0.01
                          ? hop.rate.toFixed(5)
                          : hop.rate < 1
                            ? hop.rate.toFixed(4)
                            : hop.rate < 100
                              ? hop.rate.toFixed(2)
                              : Math.round(hop.rate).toLocaleString()}{' '}
                        {hop.toCurrency}
                      </span>
                    </span>
                    {/* Show start→destination rate if this is a new currency and not the first hop */}
                    {hop.isNewCurrency &&
                      hop.startCurrency !== hop.fromCurrency &&
                      hop.startRate && (
                        <span className="text-brand-text-muted/60">
                          (1 {hop.startCurrency} ={' '}
                          <span className="font-medium text-brand-accent/70">
                            {hop.startRate < 0.01
                              ? hop.startRate.toFixed(5)
                              : hop.startRate < 1
                                ? hop.startRate.toFixed(4)
                                : hop.startRate < 100
                                  ? hop.startRate.toFixed(2)
                                  : Math.round(hop.startRate).toLocaleString()}{' '}
                            {hop.toCurrency}
                          </span>
                          )
                        </span>
                      )}
                  </>
                ) : hop.fromCurrency === hop.toCurrency ? (
                  <span>same currency ({hop.fromCurrency})</span>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* ═══ Dimension overlap rows ═══ */}
        {DIMENSION_ORDER.map((dim) => {
          const values = overlapByDimension[dim]
          if (!values || values.length === 0) return null
          const meta = DIMENSION_LABELS[dim]

          return (
            <div key={dim} className="flex items-start gap-2">
              {/* Dimension label */}
              <span className="flex-shrink-0 w-20 text-[11px] text-brand-text-muted/60 pt-1">
                {meta.icon} {meta.label}
              </span>

              {/* Value chips */}
              <div className="flex flex-wrap gap-1.5">
                {values.map((v) => {
                  const isShared = v.sources.length >= 2
                  const isFocused = focusedValue === `${dim}:${v.nodeCode}`
                  // Rarity based on PRIMARY sources (dominant trait), not all sources
                  const primaryOverlap = v.primarySources.length - 1
                  const rarity = rarityClass(primaryOverlap)
                  const colorClass = isFocused
                    ? DIMENSION_COLORS_FOCUSED[dim]
                    : isShared
                      ? DIMENSION_COLORS_BRIGHT[dim]
                      : DIMENSION_COLORS[dim]

                  return (
                    <button
                      key={v.nodeCode}
                      onClick={() => onDimensionClick?.(dim, v.nodeCode, v.countryCodes)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition-all duration-150 cursor-pointer hover:opacity-90 ${colorClass} ${rarity} ${
                        !isShared && !isFocused ? 'opacity-50' : ''
                      }`}
                      style={isShared ? rarityStyle(dim) : undefined}
                    >
                      {v.label}
                      {/* Country flags for shared values */}
                      {isShared && (
                        <span className="ml-1.5">
                          {v.sources.map((s) => (
                            <span key={s} className="mr-0.5 text-[10px]">
                              {countryFlag(s)}
                            </span>
                          ))}
                          <span className="ml-0.5 inline-flex items-center gap-0.5 rounded-full bg-white/10 px-1.5 text-[10px] font-bold">
                            {(() => {
                              const shape = DEPTH_SHAPES[Math.min(v.sources.length, 5)]
                              return shape ? (
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox={shape.viewBox}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                  className="inline-block"
                                >
                                  <path d={shape.path} />
                                </svg>
                              ) : null
                            })()}
                            &times;{v.sources.length}
                          </span>
                        </span>
                      )}
                      {/* Single flag for unique values */}
                      {!isShared && v.sources.length === 1 && (
                        <span className="ml-1 text-[10px]">{countryFlag(v.sources[0])}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { ActiveFilter } from '@/components/DimensionFilters'

/**
 * DimensionOverlapBar — shared context bar for Agent + Opportunities pages.
 *
 * Reads enriched countries + filters from sessionStorage (set by map page).
 * Shows country chips (removable with red X) + dimension overlap matrix.
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
  countryCodes: string[] // all country codes matched by this filter
}

export default function DimensionOverlapBar({
  onDimensionClick,
  focusedValue,
}: DimensionOverlapBarProps) {
  const [filters, setFilters] = useState<ActiveFilter[]>([])
  const [enrichedCountries, setEnrichedCountries] = useState<string[]>([])
  const [enrichedNames, setEnrichedNames] = useState<Record<string, string>>({})
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const rawFilters = sessionStorage.getItem('bex-map-filters')
      if (rawFilters) setFilters(JSON.parse(rawFilters) as ActiveFilter[])
      const rawEnriched = sessionStorage.getItem('bex-map-enriched')
      if (rawEnriched) setEnrichedCountries(JSON.parse(rawEnriched) as string[])
      const rawNames = sessionStorage.getItem('bex-map-enriched-names')
      if (rawNames) setEnrichedNames(JSON.parse(rawNames) as Record<string, string>)
    } catch {
      // ignore
    }
  }, [])

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
        { label: string; icon: string; sources: Set<string>; countryCodes: Set<string> }
      >()

      for (const f of filters) {
        if (f.dimension !== dim) continue
        const key = f.nodeCode
        const entry = valueMap.get(key) ?? {
          label: f.label ?? f.nodeCode,
          icon: f.icon ?? '\u25C6',
          sources: new Set<string>(),
          countryCodes: new Set<string>(),
        }
        if (f.source && f.source !== 'custom') entry.sources.add(f.source)
        for (const c of f.countryCodes ?? []) entry.countryCodes.add(c)
        valueMap.set(key, entry)
      }

      // Sort: shared (2+) first by source count desc, then unique (1)
      const values = Array.from(valueMap.entries())
        .map(([nodeCode, v]) => ({
          dimension: dim,
          nodeCode,
          label: v.label,
          icon: v.icon,
          sources: Array.from(v.sources),
          countryCodes: Array.from(v.countryCodes),
        }))
        .sort((a, b) => b.sources.length - a.sources.length)

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
                  const colorClass = isFocused
                    ? DIMENSION_COLORS_FOCUSED[dim]
                    : isShared
                      ? DIMENSION_COLORS_BRIGHT[dim]
                      : DIMENSION_COLORS[dim]

                  return (
                    <button
                      key={v.nodeCode}
                      onClick={() => onDimensionClick?.(dim, v.nodeCode, v.countryCodes)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition-all duration-150 cursor-pointer hover:opacity-90 ${colorClass} ${
                        !isShared && !isFocused ? 'opacity-50' : ''
                      }`}
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
                          <span className="ml-0.5 rounded-full bg-white/10 px-1.5 text-[10px] font-bold">
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

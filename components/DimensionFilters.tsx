'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { DimensionFilter } from '@/types/domain'

/**
 * Curated dimension selector — 5 tabs with data-backed options.
 * Country click → one row with all 5 dimensions, color-coded per type.
 * Click row to remove. Overlaps merge with multiplier glow.
 */

interface DimensionOption {
  code: string
  label: string
  icon?: string
  count: number
  countryCodes: string[]
}

interface DimensionsData {
  language: DimensionOption[]
  faith: DimensionOption[]
  sector: DimensionOption[]
  location: DimensionOption[]
  currency: DimensionOption[]
  timezone: DimensionOption[]
}

/** What we store per active filter — code for API, label for display, countryCodes for scoring */
export interface ActiveFilter extends DimensionFilter {
  label?: string
  icon?: string
  /** Country codes this filter matches — used for client-side intensity scoring */
  countryCodes?: string[]
  /** Source of this filter: country code (auto-enriched) or "custom" (manual) */
  source?: string
}

/** Merged filter for display — combines duplicates across sources */
interface MergedFilter {
  dimension: string
  nodeCode: string
  label: string
  icon: string
  countryCodes: string[]
  multiplier: number
  sources: string[]
}

interface DimensionFiltersProps {
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  onPreview?: (countryCodes: string[]) => void
  /** Ordered list of enriched country codes — newest last, for color coding */
  enrichedCountries?: string[]
}

type DimensionKey = 'language' | 'faith' | 'sector' | 'location' | 'currency' | 'timezone'

const DIMENSIONS: { key: DimensionKey; label: string; icon: string }[] = [
  { key: 'language', label: 'Language', icon: '🗣️' },
  { key: 'faith', label: 'Faith', icon: '☪️' },
  { key: 'sector', label: 'Sector', icon: '💼' },
  { key: 'location', label: 'Region', icon: '📍' },
  { key: 'currency', label: 'Currency', icon: '💱' },
]

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
    return '🌍'
  }
}

/**
 * Dimension-specific chip colors — each type gets a distinct hue
 * that matches the map's visual language.
 */
const DIMENSION_COLORS: Record<string, string> = {
  language: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
  faith: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
  sector: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  location: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  currency: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  timezone: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
}

/** Overlap multiplier glow — golden gamification levels */
function overlapStyle(multiplier: number): string {
  if (multiplier >= 4)
    return 'border-yellow-400/70 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 text-yellow-200 shadow-[0_0_16px_rgba(253,224,71,0.4)] font-semibold'
  if (multiplier >= 3)
    return 'border-yellow-300/50 bg-gradient-to-r from-yellow-300/20 to-amber-300/20 text-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.25)]'
  if (multiplier >= 2)
    return 'border-brand-accent/50 bg-brand-accent/25 text-brand-accent shadow-[0_0_6px_rgba(201,162,39,0.2)]'
  return 'border-brand-accent/30 bg-brand-accent/15 text-brand-accent'
}

/**
 * Row glow for enriched countries — newest = brightest gold, oldest = dimmer.
 * Matches the map's path-fading trail.
 */
function enrichedRowStyle(recency: number): string {
  if (recency >= 0.9)
    return 'border-yellow-400/40 bg-yellow-400/10 shadow-[0_0_12px_rgba(253,224,71,0.15)]'
  if (recency >= 0.5) return 'border-brand-accent/30 bg-brand-accent/8'
  return 'border-brand-accent/15 bg-brand-accent/5'
}

export default function DimensionFilters({
  activeFilters,
  onFilterChange,
  onPreview,
  enrichedCountries = [],
}: DimensionFiltersProps) {
  const [dimensions, setDimensions] = useState<DimensionsData | null>(null)
  const [activeTab, setActiveTab] = useState<DimensionKey | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Load dimension options once
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/map/dimensions')
        if (res.ok) {
          const data = (await res.json()) as { dimensions: DimensionsData }
          setDimensions(data.dimensions)
        }
      } catch {
        // silently fail
      }
    }
    void load()
  }, [])

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActiveTab(null)
        onPreview?.([])
      }
    }
    if (activeTab) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeTab, onPreview])

  // Build a set of already-selected option codes for quick lookup
  const selectedCodes = useMemo(
    () => new Set<string>(activeFilters.map((f) => `${f.dimension}:${f.nodeCode}`)),
    [activeFilters]
  )

  // Recency map for enriched countries (matches WorldMap path-fading)
  const enrichedRecency = useMemo(() => {
    const m = new Map<string, number>()
    const len = enrichedCountries.length
    if (len === 0) return m
    for (let i = 0; i < len; i++) {
      m.set(enrichedCountries[i], 0.33 + 0.67 * (i / Math.max(len - 1, 1)))
    }
    return m
  }, [enrichedCountries])

  // ─── MERGE LOGIC: detect duplicates across sources ───
  const { overlaps, sourceRows } = useMemo(() => {
    const keyToFilters = new Map<string, ActiveFilter[]>()
    for (const f of activeFilters) {
      const key = `${f.dimension}:${f.nodeCode}`
      const arr = keyToFilters.get(key) ?? []
      arr.push(f)
      keyToFilters.set(key, arr)
    }

    const overlapList: MergedFilter[] = []
    const uniqueKeys = new Set<string>()

    for (const [key, filters] of Array.from(keyToFilters.entries())) {
      const distinctSources = Array.from(new Set(filters.map((f) => f.source ?? 'custom')))
      if (distinctSources.length >= 2) {
        const first = filters[0]
        const allCodes = new Set<string>()
        for (const f of filters) {
          for (const c of f.countryCodes ?? []) allCodes.add(c)
        }
        overlapList.push({
          dimension: first.dimension,
          nodeCode: first.nodeCode,
          label: first.label ?? first.nodeCode,
          icon: first.icon ?? '◆',
          countryCodes: Array.from(allCodes),
          multiplier: distinctSources.length,
          sources: distinctSources,
        })
        uniqueKeys.add(key)
      }
    }

    overlapList.sort((a, b) => b.multiplier - a.multiplier)

    const rows = new Map<string, ActiveFilter[]>()
    for (const f of activeFilters) {
      const key = `${f.dimension}:${f.nodeCode}`
      if (uniqueKeys.has(key)) continue
      const src = f.source ?? 'custom'
      const arr = rows.get(src) ?? []
      arr.push(f)
      rows.set(src, arr)
    }

    return { overlaps: overlapList, sourceRows: rows }
  }, [activeFilters])

  // Ordered source keys: country codes first (alphabetical), then "custom" last
  const sourceOrder = useMemo(() => {
    const allSources = new Set<string>()
    for (const f of activeFilters) allSources.add(f.source ?? 'custom')
    const keys = Array.from(allSources)
    const countries = keys.filter((k) => k !== 'custom').sort()
    const custom = keys.includes('custom') ? ['custom'] : []
    return [...countries, ...custom]
  }, [activeFilters])

  const toggleOption = useCallback(
    (dimension: DimensionKey, option: DimensionOption) => {
      const key = `${dimension}:${option.code}`
      if (selectedCodes.has(key)) {
        onFilterChange(
          activeFilters.filter((f) => !(f.dimension === dimension && f.nodeCode === option.code))
        )
      } else {
        const newFilter: ActiveFilter = {
          dimension: dimension as DimensionFilter['dimension'],
          nodeCode: option.code,
          label: option.label,
          icon: option.icon,
          countryCodes: option.countryCodes,
          source: 'custom',
        }
        onFilterChange([...activeFilters, newFilter])
      }
      onPreview?.([])
    },
    [activeFilters, onFilterChange, onPreview, selectedCodes]
  )

  const removeSource = (source: string) => {
    onFilterChange(activeFilters.filter((f) => (f.source ?? 'custom') !== source))
  }

  const removeFilter = (dimension: string, nodeCode: string) => {
    onFilterChange(
      activeFilters.filter((f) => !(f.dimension === dimension && f.nodeCode === nodeCode))
    )
  }

  const filtersForDimension = (dim: string) => activeFilters.filter((f) => f.dimension === dim)

  // Filter out already-selected options from the dropdown
  const availableOptions = useMemo(() => {
    if (!activeTab || !dimensions) return []
    return dimensions[activeTab].filter((opt) => !selectedCodes.has(`${activeTab}:${opt.code}`))
  }, [activeTab, dimensions, selectedCodes])

  const hasAnyFilters = activeFilters.length > 0

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {hasAnyFilters && (
        <div className="flex flex-col gap-1.5 max-w-[90vw]">
          {/* ═══ OVERLAP ROW — merged duplicates with multiplier badges ═══ */}
          {overlaps.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[10px] font-bold text-yellow-300/80 uppercase tracking-wider px-1">
                ⚡
              </span>
              {overlaps.map((m) => (
                <span
                  key={`${m.dimension}:${m.nodeCode}`}
                  onMouseEnter={() => onPreview?.(m.countryCodes)}
                  onMouseLeave={() => onPreview?.([])}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${overlapStyle(m.multiplier)}`}
                >
                  {m.icon} {m.label}
                  <span className="ml-1 rounded-full bg-white/10 px-1.5 text-[10px] font-bold">
                    ×{m.multiplier}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* ═══ SOURCE ROWS — one compact row per country/custom ═══ */}
          {sourceOrder.map((source) => {
            const group = sourceRows.get(source) ?? []
            const isCountry = source !== 'custom'
            const recency = enrichedRecency.get(source) ?? 0
            const rowStyle = isCountry ? enrichedRowStyle(recency) : 'border-white/10 bg-white/5'

            return (
              <button
                key={source}
                onClick={() => removeSource(source)}
                className={`flex flex-wrap items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 transition hover:opacity-80 cursor-pointer ${rowStyle}`}
                title={`Remove ${isCountry ? source : 'custom'} filters`}
              >
                {/* Source indicator: flag for countries, ✦ for custom */}
                <span className="text-sm">{isCountry ? countryFlag(source) : '✦'}</span>

                {/* Dimension chips — color-coded per type, no remove buttons */}
                {group.map((f) => (
                  <span
                    key={`${f.dimension}:${f.nodeCode}`}
                    onMouseEnter={(e) => {
                      e.stopPropagation()
                      onPreview?.(f.countryCodes ?? [])
                    }}
                    onMouseLeave={() => onPreview?.([])}
                    className={`rounded-full border px-2 py-0.5 text-[11px] ${DIMENSION_COLORS[f.dimension] ?? 'bg-white/10 text-white/60 border-white/20'}`}
                  >
                    {f.icon ?? '◆'} {f.label ?? f.nodeCode}
                  </span>
                ))}
              </button>
            )
          })}

          {/* Clear all */}
          {sourceOrder.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => onFilterChange([])}
                className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs text-red-400/70 hover:bg-red-500/20 transition"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Options panel — shows when a dimension tab is active */}
      {activeTab && availableOptions.length > 0 && (
        <div className="w-[340px] sm:w-[480px] overflow-hidden rounded-xl border border-brand-accent/20 bg-brand-surface/95 shadow-xl backdrop-blur">
          <div className="max-h-52 overflow-y-auto p-2">
            <div className="flex flex-wrap gap-1.5">
              {availableOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => toggleOption(activeTab, opt)}
                  onMouseEnter={() => onPreview?.(opt.countryCodes)}
                  onMouseLeave={() => onPreview?.([])}
                  className={`rounded-full border px-3 py-1.5 text-xs transition hover:opacity-80 ${DIMENSION_COLORS[activeTab] ?? 'bg-white/10 text-white/60 border-white/20'}`}
                >
                  {opt.label}
                  <span className="ml-1.5 opacity-50">{opt.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All options selected message */}
      {activeTab && availableOptions.length === 0 && dimensions?.[activeTab]?.length ? (
        <div className="rounded-xl border border-brand-accent/10 bg-brand-surface/95 px-4 py-2 text-xs text-brand-text-muted backdrop-blur">
          All {activeTab} options selected
        </div>
      ) : null}

      {/* Dimension tab bar */}
      <div className="flex items-center gap-1 rounded-2xl border border-brand-accent/20 bg-brand-surface/95 px-3 py-2 backdrop-blur">
        {DIMENSIONS.map((dim) => {
          const isActive = activeTab === dim.key
          const dimFilters = filtersForDimension(dim.key)
          const hasFilters = dimFilters.length > 0
          return (
            <button
              key={dim.key}
              onClick={() => {
                setActiveTab(isActive ? null : dim.key)
                onPreview?.([])
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition ${
                isActive
                  ? 'bg-brand-accent/20 text-brand-accent'
                  : hasFilters
                    ? 'bg-brand-accent/10 text-brand-accent'
                    : 'text-brand-text-muted hover:bg-brand-accent/5 hover:text-brand-accent'
              }`}
              title={dim.label}
            >
              <span className="text-sm">{dim.icon}</span>
              <span className="hidden sm:inline">{dim.label}</span>
              {hasFilters && (
                <span className="rounded-full bg-brand-accent/30 px-1.5 text-[10px]">
                  {dimFilters.length}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

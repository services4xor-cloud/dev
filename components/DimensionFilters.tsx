'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { DimensionFilter } from '@/types/domain'

/**
 * Curated dimension selector — 4 tabs with data-backed options.
 * Country click → one row with all 4 dimensions, color-coded per type.
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
  /** Whether this is the primary/dominant value for this dimension in the source country */
  isPrimary?: boolean
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
  isPrimary: boolean
}

interface DimensionFiltersProps {
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  onPreview?: (countryCodes: string[]) => void
  /** Ordered list of enriched country codes — newest last, for color coding */
  enrichedCountries?: string[]
}

type DimensionKey = 'language' | 'faith' | 'sector' | 'currency' | 'timezone'

/** Priority order: currency > language > sector > faith.
 *  Currency is most differentiating (unique per country) in ×1 mode,
 *  most revealing of economic corridors in ×2+ mode. */
const DIMENSIONS: { key: DimensionKey; label: string; icon: string }[] = [
  { key: 'currency', label: 'Currency', icon: '💱' },
  { key: 'language', label: 'Language', icon: '🗣️' },
  { key: 'sector', label: 'Sector', icon: '💼' },
  { key: 'faith', label: 'Faith', icon: '☪️' },
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
  sector: 'bg-lime-500/20 text-lime-300 border-lime-400/30',
  faith: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
  currency: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
  timezone: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
}

/** Overlap multiplier glow — dimension-colored with intensity based on multiplier */
const DIMENSION_OVERLAP_COLORS: Record<
  string,
  { base: string; glow2: string; glow3: string; glow4: string }
> = {
  language: {
    base: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    glow2: 'bg-teal-500/30 text-teal-200 border-teal-400/50 shadow-[0_0_6px_rgba(45,212,191,0.2)]',
    glow3: 'bg-teal-500/40 text-teal-200 border-teal-300/60 shadow-[0_0_10px_rgba(45,212,191,0.3)]',
    glow4:
      'bg-teal-500/50 text-teal-100 border-teal-300/70 shadow-[0_0_16px_rgba(45,212,191,0.4)] font-semibold',
  },
  faith: {
    base: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
    glow2:
      'bg-violet-500/30 text-violet-200 border-violet-400/50 shadow-[0_0_6px_rgba(139,92,246,0.2)]',
    glow3:
      'bg-violet-500/40 text-violet-200 border-violet-300/60 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
    glow4:
      'bg-violet-500/50 text-violet-100 border-violet-300/70 shadow-[0_0_16px_rgba(139,92,246,0.4)] font-semibold',
  },
  sector: {
    base: 'bg-lime-500/20 text-lime-300 border-lime-400/30',
    glow2: 'bg-lime-500/30 text-lime-200 border-lime-400/50 shadow-[0_0_6px_rgba(132,204,22,0.2)]',
    glow3: 'bg-lime-500/40 text-lime-200 border-lime-300/60 shadow-[0_0_10px_rgba(132,204,22,0.3)]',
    glow4:
      'bg-lime-500/50 text-lime-100 border-lime-300/70 shadow-[0_0_16px_rgba(132,204,22,0.4)] font-semibold',
  },
  currency: {
    base: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    glow2: 'bg-rose-500/30 text-rose-200 border-rose-400/50 shadow-[0_0_6px_rgba(244,63,94,0.2)]',
    glow3: 'bg-rose-500/40 text-rose-200 border-rose-300/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    glow4:
      'bg-rose-500/50 text-rose-100 border-rose-300/70 shadow-[0_0_16px_rgba(244,63,94,0.4)] font-semibold',
  },
}

function overlapStyle(dimension: string, multiplier: number): string {
  const colors = DIMENSION_OVERLAP_COLORS[dimension]
  if (!colors) return 'border-brand-accent/30 bg-brand-accent/15 text-brand-accent'
  if (multiplier >= 4) return colors.glow4
  if (multiplier >= 3) return colors.glow3
  if (multiplier >= 2) return colors.glow2
  return colors.base
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

  // ─── MERGE LOGIC: group ALL filters by (dimension, nodeCode) across sources ───
  // Every chip gets a multiplier = how many source countries share it
  const mergedFilters = useMemo(() => {
    const keyToFilters = new Map<string, ActiveFilter[]>()
    for (const f of activeFilters) {
      const key = `${f.dimension}:${f.nodeCode}`
      const arr = keyToFilters.get(key) ?? []
      arr.push(f)
      keyToFilters.set(key, arr)
    }

    const result: MergedFilter[] = []
    for (const [, filters] of Array.from(keyToFilters.entries())) {
      const distinctSources = Array.from(new Set(filters.map((f) => f.source ?? 'custom')))
      const first = filters[0]
      const allCodes = new Set<string>()
      for (const f of filters) {
        for (const c of f.countryCodes ?? []) allCodes.add(c)
      }
      result.push({
        dimension: first.dimension,
        nodeCode: first.nodeCode,
        label: first.label ?? first.nodeCode,
        icon: first.icon ?? '◆',
        countryCodes: Array.from(allCodes),
        multiplier: distinctSources.length,
        sources: distinctSources,
        isPrimary: filters.some((f) => f.isPrimary),
      })
    }

    // Sort: highest multiplier first, then by dimension order, then label
    const dimOrder = DIMENSIONS.map((d) => d.key)
    result.sort((a, b) => {
      const mDiff = b.multiplier - a.multiplier
      if (mDiff !== 0) return mDiff
      const dDiff =
        dimOrder.indexOf(a.dimension as DimensionKey) -
        dimOrder.indexOf(b.dimension as DimensionKey)
      if (dDiff !== 0) return dDiff
      return a.label.localeCompare(b.label)
    })

    return result
  }, [activeFilters])

  // Group merged filters by multiplier tier for display
  const filtersByTier = useMemo(() => {
    const tiers = new Map<number, MergedFilter[]>()
    for (const f of mergedFilters) {
      const arr = tiers.get(f.multiplier) ?? []
      arr.push(f)
      tiers.set(f.multiplier, arr)
    }
    // Sort tiers descending (×5 first, then ×4, ×3, ×2, ×1)
    return Array.from(tiers.entries()).sort((a, b) => b[0] - a[0])
  }, [mergedFilters])

  const toggleOption = useCallback(
    (dimension: DimensionKey, option: DimensionOption) => {
      // Check if a CUSTOM version already exists (not enriched)
      const hasCustom = activeFilters.some(
        (f) => f.dimension === dimension && f.nodeCode === option.code && f.source === 'custom'
      )
      if (hasCustom) {
        // Remove only the custom copy, keep enriched
        onFilterChange(
          activeFilters.filter(
            (f) =>
              !(f.dimension === dimension && f.nodeCode === option.code && f.source === 'custom')
          )
        )
      } else {
        // Add as custom — even if enriched version exists (boosts multiplier)
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
      // Collapse picker → show bubble again
      setActiveTab(null)
      onPreview?.([])
    },
    [activeFilters, onFilterChange, onPreview]
  )

  const removeSource = (source: string) => {
    onFilterChange(activeFilters.filter((f) => (f.source ?? 'custom') !== source))
  }

  /** Remove filter — source-aware to avoid killing duplicates across sources.
   *  'custom' removes only manual chip. Other sources remove all enriched copies. */
  const removeFilter = (dimension: string, nodeCode: string, sourceFilter?: string) => {
    onFilterChange(
      activeFilters.filter((f) => {
        if (f.dimension !== dimension || f.nodeCode !== nodeCode) return true
        // If removing a specific source (e.g. 'custom'), only remove that one
        if (sourceFilter) return (f.source ?? 'custom') !== sourceFilter
        // Otherwise remove all NON-custom copies (enriched from countries)
        return f.source === 'custom'
      })
    )
  }

  const filtersForDimension = (dim: string) => activeFilters.filter((f) => f.dimension === dim)

  // Build set of custom-selected codes (only hide options with existing CUSTOM source)
  const customCodes = useMemo(
    () =>
      new Set<string>(
        activeFilters
          .filter((f) => f.source === 'custom')
          .map((f) => `${f.dimension}:${f.nodeCode}`)
      ),
    [activeFilters]
  )

  // Filter out options that already have a CUSTOM version (enriched ones stay available)
  const availableOptions = useMemo(() => {
    if (!activeTab || !dimensions) return []
    return dimensions[activeTab].filter((opt) => !customCodes.has(`${activeTab}:${opt.code}`))
  }, [activeTab, dimensions, customCodes])

  const hasAnyFilters = activeFilters.length > 0

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {/* ═══ SOAP BUBBLE — hidden when dimension picker is open ═══ */}
      {hasAnyFilters && !activeTab && (
        <div className="relative max-w-[92vw] max-h-[35vh] rounded-[22px] border border-white/[0.12] bg-white/[0.04] backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
          {/* Bubble sheen */}
          <div className="pointer-events-none absolute inset-x-3 top-0.5 h-[4px] rounded-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent z-10" />

          {/* Clear-all × button — top right corner */}
          <button
            onClick={() => onFilterChange([])}
            className="absolute right-1.5 top-1.5 z-10 h-5 w-5 flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/20 text-[10px] text-red-400 transition hover:bg-red-500/40 hover:text-red-200"
            title="Clear all"
          >
            ×
          </button>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[35vh] px-3 py-2 scrollbar-thin">
            {/* Flags row */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {enrichedCountries.map((code) => (
                <button
                  key={`flag-${code}`}
                  onClick={() => removeSource(code)}
                  className="h-7 w-7 flex-shrink-0 flex items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.06] text-sm transition hover:bg-red-500/20 hover:border-red-400/30"
                  title={`Remove ${code}`}
                >
                  {countryFlag(code)}
                </button>
              ))}

              {/* No overlaps hint */}
              {enrichedCountries.length >= 2 &&
                filtersByTier.filter(([tier]) => tier >= 2).length === 0 && (
                  <span className="text-[10px] text-white/30 ml-1">no shared dimensions</span>
                )}
            </div>

            {/* Chips — compact flow, bigger on desktop */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {/* Single country: primary chips — sorted by dimension priority */}
              {enrichedCountries.length < 2 &&
                activeFilters
                  .filter((f) => f.isPrimary && enrichedCountries.includes(f.source ?? ''))
                  .sort((a, b) => {
                    const order = DIMENSIONS.map((d) => d.key)
                    return (
                      order.indexOf(a.dimension as DimensionKey) -
                      order.indexOf(b.dimension as DimensionKey)
                    )
                  })
                  .map((f) => (
                    <button
                      key={`${f.dimension}:${f.nodeCode}`}
                      onClick={() => removeFilter(f.dimension, f.nodeCode)}
                      onMouseEnter={() => onPreview?.(f.countryCodes ?? [])}
                      onMouseLeave={() => onPreview?.([])}
                      className={`rounded-full border px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-xs font-medium transition hover:scale-105 cursor-pointer ${DIMENSION_COLORS[f.dimension] ?? 'bg-white/10 text-white/60 border-white/20'}`}
                    >
                      {f.icon ?? '◆'} {f.label ?? f.nodeCode}
                    </button>
                  ))}

              {/* Multi-country: ×2+ overlap chips */}
              {enrichedCountries.length >= 2 &&
                filtersByTier
                  .filter(([tier]) => tier >= 2)
                  .flatMap(([tier, chips]) =>
                    chips.map((m) => (
                      <button
                        key={`${m.dimension}:${m.nodeCode}`}
                        onMouseEnter={() => onPreview?.(m.countryCodes)}
                        onMouseLeave={() => onPreview?.([])}
                        onClick={() => removeFilter(m.dimension, m.nodeCode)}
                        className={`rounded-full border px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-xs font-medium transition hover:scale-105 cursor-pointer ${overlapStyle(m.dimension, tier)}`}
                      >
                        {m.icon} {m.label}
                        <span className="ml-1 text-[9px] sm:text-[10px] opacity-60">×{tier}</span>
                      </button>
                    ))
                  )}

              {/* Custom/manual chips — always visible, ✦ marker */}
              {activeFilters
                .filter((f) => f.source === 'custom')
                .map((f) => (
                  <button
                    key={`custom-${f.dimension}:${f.nodeCode}`}
                    onClick={() => removeFilter(f.dimension, f.nodeCode, 'custom')}
                    onMouseEnter={() => onPreview?.(f.countryCodes ?? [])}
                    onMouseLeave={() => onPreview?.([])}
                    className={`rounded-full border-2 border-dashed px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-xs font-medium transition hover:scale-105 cursor-pointer ${DIMENSION_COLORS[f.dimension] ?? 'bg-white/10 text-white/60 border-white/20'}`}
                  >
                    ✦ {f.label ?? f.nodeCode}
                  </button>
                ))}
            </div>
          </div>
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

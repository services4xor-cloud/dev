'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { DimensionFilter } from '@/types/domain'

/**
 * Curated dimension selector — 6 tabs with data-backed options.
 * Multi-select within and across dimensions. More matches = more intense glow.
 * Every option is pre-computed from COUNTRY_OPTIONS — 100% data-backed.
 *
 * Filter rows are grouped by source:
 *   - Each clicked country gets its own enrichment row (e.g., "DE", "KE")
 *   - Manual selections from tabs go into a "custom" row
 *   - Already-selected options are hidden from the options panel (no duplicates)
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

interface DimensionFiltersProps {
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  /** Called with country codes for real-time map preview when hovering */
  onPreview?: (countryCodes: string[]) => void
}

type DimensionKey = 'language' | 'faith' | 'sector' | 'location' | 'currency' | 'timezone'

const DIMENSIONS: { key: DimensionKey; label: string; icon: string }[] = [
  { key: 'language', label: 'Language', icon: '🗣️' },
  { key: 'faith', label: 'Faith', icon: '☪️' },
  { key: 'sector', label: 'Sector', icon: '💼' },
  { key: 'location', label: 'Region', icon: '📍' },
  { key: 'currency', label: 'Currency', icon: '💱' },
  { key: 'timezone', label: 'Timezone', icon: '🕐' },
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

export default function DimensionFilters({
  activeFilters,
  onFilterChange,
  onPreview,
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

  // Group filters by source for row rendering
  const filterGroups = useMemo(() => {
    const groups = new Map<string, ActiveFilter[]>()
    for (const f of activeFilters) {
      const src = f.source ?? 'custom'
      const existing = groups.get(src) ?? []
      existing.push(f)
      groups.set(src, existing)
    }
    return groups
  }, [activeFilters])

  // Ordered source keys: country codes first (alphabetical), then "custom" last
  const sourceOrder = useMemo(() => {
    const keys = Array.from(filterGroups.keys())
    const countries = keys.filter((k) => k !== 'custom').sort()
    const custom = keys.includes('custom') ? ['custom'] : []
    return [...countries, ...custom]
  }, [filterGroups])

  const toggleOption = useCallback(
    (dimension: DimensionKey, option: DimensionOption) => {
      const key = `${dimension}:${option.code}`
      if (selectedCodes.has(key)) {
        // Deselect — remove ALL filters with this dimension:nodeCode (any source)
        onFilterChange(
          activeFilters.filter((f) => !(f.dimension === dimension && f.nodeCode === option.code))
        )
      } else {
        // Select — ADD as custom filter (manual selection)
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

  const removeFilter = (dimension: string, nodeCode: string) => {
    onFilterChange(
      activeFilters.filter((f) => !(f.dimension === dimension && f.nodeCode === nodeCode))
    )
  }

  const removeSource = (source: string) => {
    onFilterChange(activeFilters.filter((f) => (f.source ?? 'custom') !== source))
  }

  const filtersForDimension = (dim: string) => activeFilters.filter((f) => f.dimension === dim)

  // Filter out already-selected options from the dropdown — no duplicates
  const availableOptions = useMemo(() => {
    if (!activeTab || !dimensions) return []
    return dimensions[activeTab].filter((opt) => !selectedCodes.has(`${activeTab}:${opt.code}`))
  }, [activeTab, dimensions, selectedCodes])

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {/* Active filter rows — grouped by source */}
      {sourceOrder.length > 0 && (
        <div className="flex flex-col gap-1.5 max-w-[90vw]">
          {sourceOrder.map((source) => {
            const group = filterGroups.get(source) ?? []
            const isCountry = source !== 'custom'
            const sourceLabel = isCountry ? `${countryFlag(source)} ${source}` : '✦ Custom'
            return (
              <div key={source} className="flex flex-wrap items-center justify-center gap-1.5">
                {/* Source label + remove-all for this source */}
                <button
                  onClick={() => removeSource(source)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${
                    isCountry
                      ? 'bg-brand-accent/15 text-brand-accent hover:bg-brand-accent/25'
                      : 'bg-brand-text-muted/10 text-brand-text-muted hover:bg-brand-text-muted/20'
                  }`}
                  title={`Remove all ${isCountry ? source : 'custom'} filters`}
                >
                  {sourceLabel} ✕
                </button>
                {/* Individual filter chips */}
                {group.map((f) => (
                  <button
                    key={`${f.dimension}:${f.nodeCode}`}
                    onClick={() => removeFilter(f.dimension, f.nodeCode)}
                    onMouseEnter={() => onPreview?.(f.countryCodes ?? [])}
                    onMouseLeave={() => onPreview?.([])}
                    className="rounded-full bg-brand-accent/20 px-2.5 py-1 text-xs text-brand-accent hover:bg-brand-accent/30 transition"
                  >
                    {f.icon ?? '◆'} {f.label ?? f.nodeCode} ✕
                  </button>
                ))}
              </div>
            )
          })}
          {/* Clear all — only when 2+ sources or many filters */}
          {(sourceOrder.length > 1 || activeFilters.length > 2) && (
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

      {/* Options panel — shows when a dimension tab is active, hides already-selected */}
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
                  className="rounded-full border border-brand-accent/10 bg-brand-bg/80 px-3 py-1.5 text-xs text-brand-text transition hover:border-brand-accent/40 hover:bg-brand-accent/10 hover:text-brand-accent"
                >
                  {opt.label}
                  <span className="ml-1.5 text-brand-text-muted/50">{opt.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Show message when all options in this dimension are already selected */}
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

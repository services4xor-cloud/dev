'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { DimensionFilter } from '@/types/domain'

/**
 * Curated dimension selector — 5 tabs with data-backed options.
 * Multi-select within and across dimensions. More matches = more intense glow.
 * Every option is pre-computed from COUNTRY_OPTIONS — 100% data-backed.
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
}

/** What we store per active filter — code for API, label for display, countryCodes for scoring */
export interface ActiveFilter extends DimensionFilter {
  label?: string
  icon?: string
  /** Country codes this filter matches — used for client-side intensity scoring */
  countryCodes?: string[]
}

interface DimensionFiltersProps {
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  /** Called with country codes for real-time map preview when hovering */
  onPreview?: (countryCodes: string[]) => void
}

type DimensionKey = 'language' | 'faith' | 'sector' | 'location' | 'currency'

const DIMENSIONS: { key: DimensionKey; label: string; icon: string }[] = [
  { key: 'language', label: 'Language', icon: '🗣️' },
  { key: 'faith', label: 'Faith', icon: '☪️' },
  { key: 'sector', label: 'Sector', icon: '💼' },
  { key: 'location', label: 'Region', icon: '📍' },
  { key: 'currency', label: 'Currency', icon: '💱' },
]

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

  const toggleOption = useCallback(
    (dimension: DimensionKey, option: DimensionOption) => {
      const key = `${dimension}:${option.code}`
      if (selectedCodes.has(key)) {
        // Deselect — remove this specific filter
        onFilterChange(
          activeFilters.filter((f) => !(f.dimension === dimension && f.nodeCode === option.code))
        )
      } else {
        // Select — ADD to filters (multi-select)
        const newFilter: ActiveFilter = {
          dimension: dimension as DimensionFilter['dimension'],
          nodeCode: option.code,
          label: option.label,
          icon: option.icon,
          countryCodes: option.countryCodes,
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

  const filtersForDimension = (dim: string) => activeFilters.filter((f) => f.dimension === dim)
  const options = activeTab && dimensions ? dimensions[activeTab] : []

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[90vw]">
          {activeFilters.map((f) => (
            <button
              key={`${f.dimension}:${f.nodeCode}`}
              onClick={() => removeFilter(f.dimension, f.nodeCode)}
              className="rounded-full bg-brand-accent/20 px-3 py-1 text-xs text-brand-accent hover:bg-brand-accent/30 transition"
            >
              {f.icon ?? '◆'} {f.label ?? f.nodeCode} ✕
            </button>
          ))}
          {activeFilters.length > 1 && (
            <button
              onClick={() => onFilterChange([])}
              className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs text-red-400/70 hover:bg-red-500/20 transition"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Options panel — shows when a dimension tab is active */}
      {activeTab && options.length > 0 && (
        <div className="w-[340px] sm:w-[480px] overflow-hidden rounded-xl border border-brand-accent/20 bg-brand-surface/95 shadow-xl backdrop-blur">
          <div className="max-h-52 overflow-y-auto p-2">
            <div className="flex flex-wrap gap-1.5">
              {options.map((opt) => {
                const isSelected = selectedCodes.has(`${activeTab}:${opt.code}`)
                return (
                  <button
                    key={opt.code}
                    onClick={() => toggleOption(activeTab, opt)}
                    onMouseEnter={() => onPreview?.(opt.countryCodes)}
                    onMouseLeave={() => onPreview?.([])}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      isSelected
                        ? 'border-brand-accent bg-brand-accent/20 text-brand-accent'
                        : 'border-brand-accent/10 bg-brand-bg/80 text-brand-text hover:border-brand-accent/40 hover:bg-brand-accent/10 hover:text-brand-accent'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {opt.label}
                    <span className="ml-1.5 text-brand-text-muted/50">{opt.count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

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

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { DimensionFilter } from '@/types/domain'

/**
 * Curated dimension selector — 6 tabs with data-backed options.
 * Every option is pre-computed from COUNTRY_OPTIONS, sorted by country count.
 * Tap an option → map lights up. 100% reliable, no typing needed.
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

/** What we store per active filter — code for API, label for display */
export interface ActiveFilter extends DimensionFilter {
  label?: string
  icon?: string
}

interface DimensionFiltersProps {
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  /** Called with country codes for real-time map preview when hovering/browsing */
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

  const selectOption = useCallback(
    (dimension: DimensionKey, option: DimensionOption) => {
      const newFilter: ActiveFilter = {
        dimension: dimension as DimensionFilter['dimension'],
        nodeCode: option.code,
        label: option.label,
        icon: option.icon,
      }
      const updated = activeFilters.filter((f) => f.dimension !== dimension)
      updated.push(newFilter)
      onFilterChange(updated)
      setActiveTab(null)
      onPreview?.([]) // Clear preview — confirmed filter takes over
    },
    [activeFilters, onFilterChange, onPreview]
  )

  const removeFilter = (dimension: string) => {
    onFilterChange(activeFilters.filter((f) => f.dimension !== dimension))
  }

  const activeDims = new Set<string>(activeFilters.map((f) => f.dimension))
  const options = activeTab && dimensions ? dimensions[activeTab] : []

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {activeFilters.map((f) => (
            <button
              key={f.dimension}
              onClick={() => removeFilter(f.dimension)}
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
              {options.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => selectOption(activeTab, opt)}
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

      {/* Dimension tab bar — 5 tappable icons */}
      <div className="flex items-center gap-1 rounded-2xl border border-brand-accent/20 bg-brand-surface/95 px-3 py-2 backdrop-blur">
        {DIMENSIONS.map((dim) => {
          const isActive = activeTab === dim.key
          const isSelected = activeDims.has(dim.key)
          return (
            <button
              key={dim.key}
              onClick={() => {
                if (isSelected) {
                  // Already selected — tap to remove filter
                  removeFilter(dim.key)
                  setActiveTab(null)
                } else {
                  setActiveTab(isActive ? null : dim.key)
                  onPreview?.([])
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition ${
                isActive
                  ? 'bg-brand-accent/20 text-brand-accent'
                  : isSelected
                    ? 'bg-brand-accent/10 text-brand-accent'
                    : 'text-brand-text-muted hover:bg-brand-accent/5 hover:text-brand-accent'
              }`}
              title={dim.label}
            >
              <span className="text-sm">{dim.icon}</span>
              <span className="hidden sm:inline">{dim.label}</span>
            </button>
          )
        })}
        {activeFilters.length > 0 && (
          <span className="ml-1 text-[10px] text-brand-accent/50">{activeFilters.length}/5</span>
        )}
      </div>
    </div>
  )
}

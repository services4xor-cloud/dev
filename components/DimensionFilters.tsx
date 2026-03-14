'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { DimensionFilter } from '@/types/domain'

/**
 * Universal dimension search — always-visible text box with animated hints.
 * As the user types, shows matching results across ALL 6 dimensions.
 * Supports multi-filter: selecting "German" + "Christianity" intersects on map.
 */

interface Suggestion {
  dimension: string
  code: string
  label: string
  detail: string
  countryCount: number
}

/** What we store per active filter — code for API, label for display */
export interface ActiveFilter extends DimensionFilter {
  label?: string
  icon?: string
}

interface DimensionFiltersProps {
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
}

const DIMENSION_ICON: Record<string, string> = {
  language: '🗣️',
  faith: '☪️',
  sector: '💼',
  location: '📍',
  currency: '💱',
  culture: '🏛️',
}

/** Rotating placeholder examples — one per dimension */
const PLACEHOLDER_HINTS = [
  'German, Swahili, Arabic…',
  'Christianity, Islam, Buddhism…',
  'Technology, Tourism, Agriculture…',
  'East Africa, Berlin, Nairobi…',
  'EUR, USD, KES…',
  'Maasai, Yoruba, Bavarian…',
]

export default function DimensionFilters({ activeFilters, onFilterChange }: DimensionFiltersProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Rotate placeholder hints every 3 seconds (only when not focused and no query)
  useEffect(() => {
    if (isFocused || query.length > 0) return
    const interval = setInterval(() => {
      setHintIndex((prev) => {
        // Skip dimensions that are already selected
        let next = (prev + 1) % PLACEHOLDER_HINTS.length
        const activeDims = new Set<string>(activeFilters.map((f) => f.dimension))
        const dimOrder = ['language', 'faith', 'sector', 'location', 'currency', 'culture']
        let attempts = 0
        while (activeDims.has(dimOrder[next]) && attempts < 6) {
          next = (next + 1) % PLACEHOLDER_HINTS.length
          attempts++
        }
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [isFocused, query, activeFilters])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search across all dimensions
  const searchAllDimensions = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setSuggestions([])
        setShowDropdown(false)
        return
      }

      setLoading(true)
      try {
        const res = await fetch('/api/map/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        })
        if (res.ok) {
          const data = (await res.json()) as { suggestions: Suggestion[] }
          // Filter out dimensions already selected
          const activeDims = new Set<string>(activeFilters.map((f) => f.dimension))
          const filtered = data.suggestions.filter((s) => !activeDims.has(s.dimension))
          setSuggestions(filtered)
          setShowDropdown(filtered.length > 0)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    },
    [activeFilters]
  )

  // Debounce input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchAllDimensions(query)
    }, 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, searchAllDimensions])

  const selectSuggestion = (s: Suggestion) => {
    const newFilter: ActiveFilter = {
      dimension: s.dimension as DimensionFilter['dimension'],
      nodeCode: s.code,
      label: s.label,
      icon: DIMENSION_ICON[s.dimension],
    }
    // Replace existing filter for same dimension, or add new
    const updated = activeFilters.filter((f) => f.dimension !== s.dimension)
    updated.push(newFilter)
    onFilterChange(updated)
    setQuery('')
    setSuggestions([])
    setShowDropdown(false)
    // Re-focus for next filter
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const removeFilter = (dimension: string) => {
    onFilterChange(activeFilters.filter((f) => f.dimension !== dimension))
  }

  const currentPlaceholder = PLACEHOLDER_HINTS[hintIndex]

  return (
    <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {activeFilters.map((f) => (
            <button
              key={f.dimension}
              onClick={() => removeFilter(f.dimension)}
              className="rounded-full bg-brand-accent/20 px-3 py-1 text-xs text-brand-accent hover:bg-brand-accent/30 transition"
            >
              {f.icon ?? DIMENSION_ICON[f.dimension] ?? '◆'} {f.label ?? f.nodeCode} ✕
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

      {/* Search box — always visible */}
      <div className="relative w-[320px] sm:w-[420px]">
        <div className="flex items-center gap-2 rounded-2xl border border-brand-accent/20 bg-brand-surface/95 px-4 py-2.5 backdrop-blur">
          <span className="text-brand-text-muted text-sm">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              if (suggestions.length > 0) setShowDropdown(true)
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={currentPlaceholder}
            className="flex-1 bg-transparent text-sm text-brand-text placeholder:text-brand-text-muted/50 focus:outline-none"
          />
          {loading && <span className="text-xs text-brand-text-muted animate-pulse">…</span>}
          {activeFilters.length > 0 && !loading && (
            <span className="text-[10px] text-brand-accent/50">{activeFilters.length}/6</span>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute bottom-full mb-2 w-full overflow-hidden rounded-xl border border-brand-accent/20 bg-brand-surface shadow-xl backdrop-blur"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {suggestions.map((s, i) => (
                <button
                  key={`${s.dimension}-${s.code}-${i}`}
                  onClick={() => selectSuggestion(s)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-brand-accent/10"
                >
                  <span className="text-base">{DIMENSION_ICON[s.dimension] ?? '◆'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-brand-text">{s.label}</span>
                      <span className="text-xs text-brand-text-muted">{s.detail}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-brand-text-muted/60">
                      {s.dimension}
                    </span>
                  </div>
                  <span className="text-xs text-brand-accent/70">{s.countryCount}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

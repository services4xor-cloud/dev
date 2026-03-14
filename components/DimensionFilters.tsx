'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { DimensionFilter } from '@/types/domain'

/**
 * Universal dimension search — always-visible text box.
 * As the user types, shows matching results across ALL 6 dimensions.
 * E.g., typing "german" shows: Language: German (12 countries), Location: Germany (1), etc.
 */

interface Suggestion {
  dimension: string
  code: string
  label: string
  detail: string
  countryCount: number
}

interface DimensionFiltersProps {
  activeFilters: DimensionFilter[]
  onFilterChange: (filters: DimensionFilter[]) => void
}

export default function DimensionFilters({ activeFilters, onFilterChange }: DimensionFiltersProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

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
  const searchAllDimensions = useCallback(async (q: string) => {
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
        setSuggestions(data.suggestions)
        setShowDropdown(data.suggestions.length > 0)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

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
    const newFilter: DimensionFilter = {
      dimension: s.dimension as DimensionFilter['dimension'],
      nodeCode: s.code,
    }
    // Replace existing filter for same dimension, or add new
    const updated = activeFilters.filter((f) => f.dimension !== s.dimension)
    updated.push(newFilter)
    onFilterChange(updated)
    setQuery('')
    setShowDropdown(false)
    inputRef.current?.blur()
  }

  const removeFilter = (dimension: string) => {
    onFilterChange(activeFilters.filter((f) => f.dimension !== dimension))
  }

  const dimensionIcon: Record<string, string> = {
    language: '🗣️',
    faith: '☪️',
    sector: '💼',
    location: '📍',
    currency: '💱',
    culture: '🏛️',
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {activeFilters.map((f) => (
            <button
              key={f.dimension}
              onClick={() => removeFilter(f.dimension)}
              className="rounded-full bg-brand-accent/20 px-2.5 py-1 text-xs text-brand-accent hover:bg-brand-accent/30 transition"
            >
              {dimensionIcon[f.dimension] ?? '◆'} {f.nodeCode} ✕
            </button>
          ))}
        </div>
      )}

      {/* Search box — always visible */}
      <div className="relative w-[320px] sm:w-[400px]">
        <div className="flex items-center gap-2 rounded-2xl border border-brand-accent/20 bg-brand-surface/95 px-4 py-2.5 backdrop-blur">
          <span className="text-brand-text-muted">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true)
            }}
            placeholder="Search language, faith, sector, location…"
            className="flex-1 bg-transparent text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none"
          />
          {loading && <span className="text-xs text-brand-text-muted animate-pulse">…</span>}
        </div>

        {/* Suggestions dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute bottom-full mb-2 w-full overflow-hidden rounded-xl border border-brand-accent/20 bg-brand-surface/98 shadow-xl backdrop-blur"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {suggestions.map((s, i) => (
                <button
                  key={`${s.dimension}-${s.code}-${i}`}
                  onClick={() => selectSuggestion(s)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-brand-accent/10"
                >
                  <span className="text-base">{dimensionIcon[s.dimension] ?? '◆'}</span>
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

'use client'

import { useState } from 'react'
import type { DimensionFilter } from '@/types/domain'

const DIMENSIONS = [
  { key: 'language', label: '🗣️', name: 'Language', placeholder: 'e.g., sw, en, de' },
  { key: 'faith', label: '☪️', name: 'Faith', placeholder: 'e.g., islam, christianity' },
  { key: 'sector', label: '💼', name: 'Sector', placeholder: 'e.g., technology, healthcare' },
  { key: 'location', label: '📍', name: 'Location', placeholder: 'e.g., nairobi, berlin' },
  { key: 'currency', label: '💱', name: 'Currency', placeholder: 'e.g., KES, EUR, USD' },
  { key: 'culture', label: '🏛️', name: 'Culture', placeholder: 'e.g., maasai, yoruba' },
] as const

interface DimensionFiltersProps {
  activeFilters: DimensionFilter[]
  onFilterChange: (filters: DimensionFilter[]) => void
}

export default function DimensionFilters({ activeFilters, onFilterChange }: DimensionFiltersProps) {
  const [expanded, setExpanded] = useState<DimensionFilter['dimension'] | null>(null)
  const [input, setInput] = useState('')

  const toggleDimension = (key: DimensionFilter['dimension']) => {
    if (expanded === key) {
      setExpanded(null)
      setInput('')
    } else {
      setExpanded(key)
      setInput('')
    }
  }

  const addFilter = () => {
    if (!input.trim() || !expanded) return
    const newFilter: DimensionFilter = {
      dimension: expanded,
      nodeCode: input.trim().toLowerCase(),
    }
    // Replace existing filter for same dimension, or add new
    const updated = activeFilters.filter((f) => f.dimension !== expanded)
    updated.push(newFilter)
    onFilterChange(updated)
    setExpanded(null)
    setInput('')
  }

  const removeFilter = (dimension: DimensionFilter['dimension']) => {
    onFilterChange(activeFilters.filter((f) => f.dimension !== dimension))
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex gap-1.5">
          {activeFilters.map((f) => (
            <button
              key={f.dimension}
              onClick={() => removeFilter(f.dimension)}
              className="rounded-full bg-brand-accent/20 px-2.5 py-1 text-xs text-brand-accent hover:bg-brand-accent/30 transition"
            >
              {f.dimension}: {f.nodeCode} ✕
            </button>
          ))}
        </div>
      )}

      {/* Expanded input */}
      {expanded && (
        <div className="flex gap-2 rounded-lg border border-brand-accent/20 bg-brand-surface px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFilter()}
            placeholder={DIMENSIONS.find((d) => d.key === expanded)?.placeholder}
            className="w-40 bg-transparent text-sm text-brand-text placeholder:text-brand-text-muted focus:outline-none"
            autoFocus
          />
          <button
            onClick={addFilter}
            className="text-sm font-medium text-brand-accent hover:opacity-80"
          >
            Apply
          </button>
        </div>
      )}

      {/* Dimension pills */}
      <div className="flex gap-2 rounded-full border border-brand-accent/20 bg-brand-surface/90 px-4 py-2 backdrop-blur">
        {DIMENSIONS.map((dim) => {
          const isActive = activeFilters.some((f) => f.dimension === dim.key)
          const isExpanded = expanded === dim.key
          return (
            <button
              key={dim.key}
              onClick={() => toggleDimension(dim.key as DimensionFilter['dimension'])}
              className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                isExpanded
                  ? 'bg-brand-accent text-brand-bg scale-110'
                  : isActive
                    ? 'bg-brand-accent/30 text-brand-accent'
                    : 'text-brand-text-muted hover:bg-brand-surface hover:text-brand-text'
              }`}
              title={dim.name}
            >
              {dim.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import type { DimensionFilter } from '@/types/domain'

const DIMENSIONS = [
  { key: 'language', label: '🗣️', name: 'Language' },
  { key: 'faith', label: '☪️', name: 'Faith' },
  { key: 'sector', label: '💼', name: 'Sector' },
  { key: 'location', label: '📍', name: 'Location' },
  { key: 'currency', label: '💱', name: 'Currency' },
  { key: 'culture', label: '🏛️', name: 'Culture' },
] as const

interface DimensionFiltersProps {
  activeFilters: DimensionFilter[]
  onFilterChange: (filters: DimensionFilter[]) => void
}

export default function DimensionFilters({ activeFilters, onFilterChange }: DimensionFiltersProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-brand-accent/20 bg-brand-surface/90 px-4 py-2 backdrop-blur">
      {DIMENSIONS.map((dim) => {
        const isActive = activeFilters.some((f) => f.dimension === dim.key)
        return (
          <button
            key={dim.key}
            className={`rounded-full px-3 py-1.5 text-sm transition-all ${
              isActive
                ? 'bg-brand-accent text-brand-bg'
                : 'text-brand-text-muted hover:bg-brand-surface hover:text-brand-text'
            }`}
            title={dim.name}
          >
            {dim.label}
          </button>
        )
      })}
    </div>
  )
}

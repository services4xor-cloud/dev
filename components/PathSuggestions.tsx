'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

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

interface ScoredCountry {
  code: string
  score: number
  matchCount: number
}

interface PathSuggestionsProps {
  scoredCountries: ScoredCountry[]
  /** Countries already enriched (clicked) — shown differently */
  enrichedCountries: string[]
  /** Total active filters — used for context */
  totalFilters: number
  /** Callback when a suggested country is clicked */
  onSuggestClick: (code: string, name: string) => void
  /** Preview on hover */
  onPreview?: (codes: string[]) => void
}

/** Country code → name lookup (built once) */
const COUNTRY_NAMES: Record<string, string> = {}
for (const c of COUNTRY_OPTIONS) {
  COUNTRY_NAMES[c.code] = c.name
}

/**
 * Path Suggestions — identity-driven route discovery.
 *
 * When filters are active, ranks countries by match score and suggests
 * the strongest connections as "Routes". Clicking a suggestion adds it
 * to the enrichment path, making overlaps glow brighter.
 *
 * Only appears when there are 2+ active filters and scored countries exist.
 */
export default function PathSuggestions({
  scoredCountries,
  enrichedCountries,
  totalFilters,
  onSuggestClick,
  onPreview,
}: PathSuggestionsProps) {
  // Top suggestions: highest score, excluding already-enriched countries
  const suggestions = useMemo(() => {
    if (scoredCountries.length === 0 || totalFilters < 1) return []

    const enrichedSet = new Set(enrichedCountries)
    return scoredCountries
      .filter((sc) => !enrichedSet.has(sc.code) && sc.matchCount >= 2)
      .sort((a, b) => b.score - a.score || b.matchCount - a.matchCount)
      .slice(0, 6)
  }, [scoredCountries, enrichedCountries, totalFilters])

  if (suggestions.length === 0) return null

  return (
    <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2">
      <div className="w-48 rounded-xl border border-brand-accent/20 bg-brand-surface/95 shadow-xl backdrop-blur">
        {/* Header */}
        <div className="border-b border-brand-accent/10 px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-accent/70">
            ⚡ Suggested Routes
          </div>
          <div className="text-[9px] text-brand-text-muted">
            Based on {totalFilters} active filter{totalFilters !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col gap-0.5 p-1.5">
          {suggestions.map((sc) => {
            const name = COUNTRY_NAMES[sc.code] ?? sc.code
            const pct = Math.round(sc.score * 100)
            return (
              <button
                key={sc.code}
                onClick={() => onSuggestClick(sc.code, name)}
                onMouseEnter={() => onPreview?.([sc.code])}
                onMouseLeave={() => onPreview?.([])}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-brand-accent/10"
              >
                <span className="text-base">{countryFlag(sc.code)}</span>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-xs text-brand-text group-hover:text-brand-accent">
                    {name}
                  </div>
                  <div className="text-[9px] text-brand-text-muted">
                    {sc.matchCount}/{totalFilters} matches
                  </div>
                </div>
                {/* Score bar */}
                <div className="w-8 h-1.5 rounded-full bg-brand-bg overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        pct >= 80
                          ? '#FFF4CC'
                          : pct >= 60
                            ? '#E8C840'
                            : pct >= 40
                              ? '#C9A227'
                              : '#A07820',
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        {enrichedCountries.length > 0 && (
          <div className="border-t border-brand-accent/10 px-3 py-1.5">
            <Link
              href={`/be/${enrichedCountries[enrichedCountries.length - 1].toLowerCase()}`}
              className="text-[9px] text-brand-accent hover:underline"
            >
              Explore Be[{enrichedCountries[enrichedCountries.length - 1]}] →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

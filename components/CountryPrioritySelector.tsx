'use client'

/**
 * CountryPrioritySelector
 *
 * First interaction a Pioneer has with BeNetwork.
 * They select countries in priority order — first choice gets the best matches.
 *
 * Features:
 * - Countries grouped by geographic region clusters
 * - "Nearby" glow on geographically close countries (< 1800km from origin)
 * - Priority badges ①②③ on selected countries
 * - Priority rail at bottom — shows route sequence with × to remove
 * - Max 5 selections
 * - Animated entry and selection states
 *
 * Usage:
 *   <CountryPrioritySelector
 *     originCode="KE"
 *     onComplete={(ordered) => setStep(2)}
 *   />
 */

import { useState } from 'react'
import {
  COUNTRY_OPTIONS,
  REGION_CLUSTERS,
  CORRIDOR_BADGE,
  getGroupedCountries,
  isNearby,
  priorityChar,
  MAX_COUNTRY_SELECTIONS,
  type CountryOption,
} from '@/lib/country-selector'

interface Props {
  originCode?: string
  onComplete: (selectedCodes: string[]) => void
  className?: string
}

export default function CountryPrioritySelector({
  originCode = 'KE',
  onComplete,
  className = '',
}: Props) {
  const [selected, setSelected] = useState<string[]>([])

  const grouped = getGroupedCountries(originCode)
  const originCountry = COUNTRY_OPTIONS.find((c) => c.code === originCode)

  function toggleCountry(code: string) {
    setSelected((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code)
      }
      if (prev.length >= MAX_COUNTRY_SELECTIONS) return prev
      return [...prev, code]
    })
  }

  function removeFromPriority(code: string) {
    setSelected((prev) => prev.filter((c) => c !== code))
  }

  const selectedCountries = selected
    .map((code) => COUNTRY_OPTIONS.find((c) => c.code === code))
    .filter(Boolean) as CountryOption[]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center pb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Where do you want to go?</h2>
        <p className="text-gray-400 text-base">
          Select up to <span className="text-brand-accent font-semibold">5 countries</span> in your
          preferred order — your first choice gets priority matches
        </p>
        {originCountry && (
          <p className="text-sm text-gray-400 mt-1">
            <span className="text-brand-accent">●</span> Glowing cards are nearby{' '}
            {originCountry.flag} {originCountry.name}
          </p>
        )}
      </div>

      {/* Region cluster grid */}
      {grouped.map(({ cluster, countries }) => {
        const hasNearby = countries.some((c) => c.isNearby)
        return (
          <div key={cluster.key}>
            {/* Cluster label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{cluster.emoji}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {cluster.label}
              </span>
              {hasNearby && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/40 font-medium">
                  Nearby
                </span>
              )}
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* Country cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {countries.map((country) => {
                const idx = selected.indexOf(country.code)
                const isSelected = idx !== -1
                const badge = CORRIDOR_BADGE[country.corridorStrength]
                const near = country.isNearby
                const rank = isSelected ? idx + 1 : null

                return (
                  <button
                    key={country.code}
                    onClick={() => toggleCountry(country.code)}
                    disabled={!isSelected && selected.length >= MAX_COUNTRY_SELECTIONS}
                    title={
                      country.distKm > 0
                        ? `~${country.distKm.toLocaleString()} km from ${originCountry?.name}`
                        : 'Your origin'
                    }
                    className={[
                      'relative flex flex-col items-center justify-center gap-1.5',
                      'rounded-xl p-3 pb-4 text-center transition-all duration-200',
                      'border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      isSelected
                        ? 'border-brand-accent bg-brand-primary/30 shadow-[0_0_0_1px_rgb(var(--color-accent-rgb) / 0.38)]'
                        : near
                          ? 'border-emerald-700/50 bg-gray-900/80 shadow-[0_0_12px_2px_rgba(52,211,153,0.12)] hover:border-brand-accent/60 hover:shadow-[0_0_16px_4px_rgb(var(--color-accent-rgb) / 0.15)]'
                          : 'border-brand-primary/30 bg-gray-900/60 hover:border-brand-accent/40 hover:bg-gray-900',
                    ].join(' ')}
                  >
                    {/* Priority badge */}
                    {rank !== null && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-accent text-brand-bg text-xs font-black flex items-center justify-center shadow-md z-10">
                        {rank}
                      </div>
                    )}

                    {/* Nearby pulse indicator */}
                    {near && !isSelected && (
                      <span className="absolute top-1.5 left-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                    )}

                    {/* Flag */}
                    <span className="text-3xl leading-none">{country.flag}</span>

                    {/* Country name */}
                    <span
                      className={`text-sm font-semibold leading-tight ${isSelected ? 'text-brand-accent' : 'text-white'}`}
                    >
                      {country.name}
                    </span>

                    {/* Corridor badge */}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Priority rail — sticky selection summary */}
      {selected.length > 0 && (
        <div className="sticky bottom-0 pt-4">
          <div className="bg-gray-900/95 backdrop-blur-sm border border-brand-accent/30 rounded-2xl p-4 shadow-2xl">
            {/* Rail label */}
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>Your Route Priority</span>
              <span className="text-brand-accent">
                ({selected.length}/{MAX_COUNTRY_SELECTIONS})
              </span>
            </div>

            {/* Selected countries row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {selectedCountries.map((country, i) => (
                <div key={country.code} className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1.5 bg-brand-primary/40 border border-brand-accent/40 rounded-xl px-2.5 py-1.5">
                    <span className="text-brand-accent text-xs font-black">
                      {priorityChar(i + 1)}
                    </span>
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="text-white text-xs font-medium">{country.name}</span>
                    <button
                      onClick={() => removeFromPriority(country.code)}
                      className="text-gray-400 hover:text-red-400 transition-colors ml-0.5 text-xs leading-none"
                      aria-label={`Remove ${country.name}`}
                    >
                      ×
                    </button>
                  </div>
                  {i < selectedCountries.length - 1 && (
                    <span className="text-gray-600 text-sm flex-shrink-0">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => onComplete(selected)}
              className="w-full mt-3 bg-brand-primary hover:bg-brand-primary-light text-white font-bold py-3 rounded-xl transition-colors text-base border border-brand-accent/30 hover:border-brand-accent/60"
            >
              Set my route —{' '}
              {selected.length === 1 ? selectedCountries[0].name : `${selected.length} countries`} →
            </button>
          </div>
        </div>
      )}

      {/* Hint when nothing selected */}
      {selected.length === 0 && (
        <p className="text-center text-gray-600 text-sm py-4">
          Tap any country to begin building your route
        </p>
      )}
    </div>
  )
}

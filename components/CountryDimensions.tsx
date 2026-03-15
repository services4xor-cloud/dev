'use client'

import { useState, useEffect } from 'react'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_REGISTRY,
  type LanguageCode,
  type FaithCode,
} from '@/lib/country-selector'

/**
 * CountryDimensions — client component for /be/[code] pages.
 *
 * Displays Languages → Sectors → Faith with overlap awareness.
 * Reads sessionStorage for other selected countries and highlights
 * shared values (×2, ×3, etc.) with bright styling + multiplier badges.
 */

interface Props {
  code: string
  languages: { code: string; name: string; nativeName?: string }[]
  topSectors: string[]
  topFaiths: string[]
}

const FAITH_LABELS: Record<string, string> = {
  christianity: 'Christianity',
  islam: 'Islam',
  hinduism: 'Hinduism',
  buddhism: 'Buddhism',
  judaism: 'Judaism',
  traditional: 'Traditional',
  secular: 'Secular',
}

export default function CountryDimensions({ code, languages, topSectors, topFaiths }: Props) {
  const [otherCountryCodes, setOtherCountryCodes] = useState<string[]>([])

  // Read other selected countries from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bex-map-enriched')
      if (raw) {
        const all = JSON.parse(raw) as string[]
        // Other countries = all selected except this one
        setOtherCountryCodes(all.filter((c) => c !== code.toUpperCase()))
      }
    } catch {
      // ignore
    }
  }, [code])

  // Compute overlap counts for each dimension value
  const otherCountries = otherCountryCodes
    .map((c) => COUNTRY_OPTIONS.find((o) => o.code === c))
    .filter(Boolean)

  // Language overlap: how many OTHER selected countries share this language
  function langOverlap(langCode: string): number {
    return otherCountries.filter((c) => c!.languages.includes(langCode as LanguageCode)).length
  }

  // Sector overlap
  function sectorOverlap(sector: string): number {
    return otherCountries.filter((c) => c!.topSectors.includes(sector)).length
  }

  // Faith overlap
  function faithOverlap(faith: string): number {
    return otherCountries.filter((c) => c!.topFaiths.includes(faith as FaithCode)).length
  }

  // Sort: shared first (by overlap count desc), then unique
  const sortedLanguages = [...languages].sort((a, b) => {
    const aOvl = langOverlap(a.code)
    const bOvl = langOverlap(b.code)
    if (aOvl !== bOvl) return bOvl - aOvl
    // Secondary: global reach
    const aReach = COUNTRY_OPTIONS.filter((c) =>
      c.languages.includes(a.code as LanguageCode)
    ).length
    const bReach = COUNTRY_OPTIONS.filter((c) =>
      c.languages.includes(b.code as LanguageCode)
    ).length
    return bReach - aReach
  })

  const sortedSectors = [...topSectors].sort((a, b) => {
    const aOvl = sectorOverlap(a)
    const bOvl = sectorOverlap(b)
    if (aOvl !== bOvl) return bOvl - aOvl
    const aReach = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(a)).length
    const bReach = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(b)).length
    return bReach - aReach
  })

  const sortedFaiths = [...topFaiths].sort((a, b) => {
    const aOvl = faithOverlap(a)
    const bOvl = faithOverlap(b)
    if (aOvl !== bOvl) return bOvl - aOvl
    const aReach = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(a as FaithCode)).length
    const bReach = COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(b as FaithCode)).length
    return bReach - aReach
  })

  const hasOthers = otherCountryCodes.length > 0

  return (
    <>
      {/* Languages */}
      {sortedLanguages.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {sortedLanguages.map((lang) => {
              const overlap = langOverlap(lang.code)
              const multiplier = overlap + 1 // +1 for this country itself
              const isShared = hasOthers && overlap > 0
              const reach = COUNTRY_OPTIONS.filter((c) =>
                c.languages.includes(lang.code as LanguageCode)
              ).length
              return (
                <span
                  key={lang.code}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${
                    isShared
                      ? 'border-teal-300/50 bg-teal-500/20 text-teal-200 shadow-[0_0_10px_rgba(45,212,191,0.2)] ring-1 ring-teal-400/30'
                      : 'border-teal-400/25 bg-teal-500/10 text-teal-300'
                  }`}
                >
                  {lang.name}
                  {lang.nativeName && lang.nativeName !== lang.name && (
                    <span className="text-xs text-brand-text-muted sm:text-sm">
                      ({lang.nativeName})
                    </span>
                  )}
                  {isShared && (
                    <span className="rounded-full bg-teal-400/30 px-1.5 text-[10px] font-bold text-teal-200 sm:text-xs">
                      ×{multiplier}
                    </span>
                  )}
                  {!isShared && reach > 1 && (
                    <span className="rounded-full bg-teal-400/20 px-1.5 text-[10px] text-teal-400/70 sm:text-xs">
                      {reach}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </section>
      )}

      {/* Sectors */}
      {sortedSectors.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Top Sectors
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {sortedSectors.map((sector) => {
              const overlap = sectorOverlap(sector)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(sector)).length
              return (
                <span
                  key={sector}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-center text-xs sm:px-4 sm:text-sm transition-all ${
                    isShared
                      ? 'border-lime-300/50 bg-lime-500/20 text-lime-200 shadow-[0_0_10px_rgba(132,204,22,0.2)] ring-1 ring-lime-400/30'
                      : 'border-lime-400/15 bg-lime-500/10 text-lime-300'
                  }`}
                >
                  {sector}
                  {isShared && (
                    <span className="rounded-full bg-lime-400/30 px-1.5 text-[10px] font-bold text-lime-200">
                      ×{multiplier}
                    </span>
                  )}
                  {!isShared && reach > 1 && (
                    <span className="rounded-full bg-lime-400/20 px-1.5 text-[10px] text-lime-400/70">
                      {reach}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </section>
      )}

      {/* Faiths */}
      {sortedFaiths.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Faiths
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {sortedFaiths.map((faith) => {
              const overlap = faithOverlap(faith)
              const multiplier = overlap + 1
              const isShared = hasOthers && overlap > 0
              const reach = COUNTRY_OPTIONS.filter((c) =>
                c.topFaiths.includes(faith as FaithCode)
              ).length
              return (
                <span
                  key={faith}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${
                    isShared
                      ? 'border-violet-300/50 bg-violet-500/20 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)] ring-1 ring-violet-400/30'
                      : 'border-violet-400/25 bg-violet-500/10 text-violet-300'
                  }`}
                >
                  {FAITH_LABELS[faith] ?? faith}
                  {isShared && (
                    <span className="rounded-full bg-violet-400/30 px-1.5 text-[10px] font-bold text-violet-200 sm:text-xs">
                      ×{multiplier}
                    </span>
                  )}
                  {!isShared && reach > 1 && (
                    <span className="rounded-full bg-violet-400/20 px-1.5 text-[10px] text-violet-400/70 sm:text-xs">
                      {reach}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}

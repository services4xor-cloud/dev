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
 * Displays Languages → Sectors → Currency → Faith with overlap awareness.
 * When multiple countries are selected on the map, shows a combined overview
 * with flags/capitals/timezones and highlights shared dimension values.
 */

interface Props {
  code: string
  languages: { code: string; name: string; nativeName?: string }[]
  topSectors: string[]
  topFaiths: string[]
  currency: string
  capital: string | null
  timezone: string | null
  population: number | null
  flagPng: string
  name: string
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

/** Common currency symbols */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CHF: '₣',
  CNY: '¥',
  INR: '₹',
  KRW: '₩',
  BRL: 'R$',
  ZAR: 'R',
  NGN: '₦',
  KES: 'KSh',
  AUD: 'A$',
  CAD: 'C$',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  TRY: '₺',
  RUB: '₽',
  THB: '฿',
  MYR: 'RM',
  SGD: 'S$',
  PHP: '₱',
  IDR: 'Rp',
  VND: '₫',
  EGP: 'E£',
  SAR: '﷼',
  AED: 'د.إ',
  ILS: '₪',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  XOF: 'CFA',
  XAF: 'CFA',
  MAD: 'د.م.',
  GHS: '₵',
  ETB: 'Br',
  COP: 'COL$',
  MXN: 'MX$',
  NZD: 'NZ$',
  PKR: '₨',
  BDT: '৳',
}

function formatCurrency(code: string): string {
  const sym = CURRENCY_SYMBOLS[code]
  return sym ? `${code} (${sym})` : code
}

function formatPop(n: number): string {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}K`
      : String(n)
}

function formatTz(iana: string): string {
  return iana.replace(/^.*\//, '').replace(/_/g, ' ')
}

export default function CountryDimensions({
  code,
  languages,
  topSectors,
  topFaiths,
  currency,
  capital,
  timezone,
  population,
  flagPng,
  name,
}: Props) {
  const [otherCountryCodes, setOtherCountryCodes] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bex-map-enriched')
      if (raw) {
        const all = JSON.parse(raw) as string[]
        setOtherCountryCodes(all.filter((c) => c !== code.toUpperCase()))
      }
    } catch {
      // ignore
    }
  }, [code])

  const otherCountries = otherCountryCodes
    .map((c) => COUNTRY_OPTIONS.find((o) => o.code === c))
    .filter(Boolean)

  const hasOthers = otherCountryCodes.length > 0

  // ─── Overlap helpers ────────────────────────────────────────────────────────
  function langOverlap(langCode: string): number {
    return otherCountries.filter((c) => c!.languages.includes(langCode as LanguageCode)).length
  }
  function sectorOverlap(sector: string): number {
    return otherCountries.filter((c) => c!.topSectors.includes(sector)).length
  }
  function currencyOverlap(curr: string): number {
    return otherCountries.filter((c) => c!.currency === curr).length
  }
  function faithOverlap(faith: string): number {
    return otherCountries.filter((c) => c!.topFaiths.includes(faith as FaithCode)).length
  }

  // ─── Sorted dimension arrays (shared first) ────────────────────────────────
  const sortedLanguages = [...languages].sort((a, b) => {
    const d = langOverlap(b.code) - langOverlap(a.code)
    if (d !== 0) return d
    const aR = COUNTRY_OPTIONS.filter((c) => c.languages.includes(a.code as LanguageCode)).length
    const bR = COUNTRY_OPTIONS.filter((c) => c.languages.includes(b.code as LanguageCode)).length
    return bR - aR
  })

  const sortedSectors = [...topSectors].sort((a, b) => {
    const d = sectorOverlap(b) - sectorOverlap(a)
    if (d !== 0) return d
    return (
      COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(b)).length -
      COUNTRY_OPTIONS.filter((c) => c.topSectors.includes(a)).length
    )
  })

  const sortedFaiths = [...topFaiths].sort((a, b) => {
    const d = faithOverlap(b) - faithOverlap(a)
    if (d !== 0) return d
    return (
      COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(b as FaithCode)).length -
      COUNTRY_OPTIONS.filter((c) => c.topFaiths.includes(a as FaithCode)).length
    )
  })

  // ─── Currency: collect all unique currencies across selected countries ──────
  const allCurrencies: string[] = [currency]
  otherCountries.forEach((c) => {
    if (!allCurrencies.includes(c!.currency)) allCurrencies.push(c!.currency)
  })
  // Sort: shared first
  allCurrencies.sort((a, b) => {
    const aShared =
      (a === currency ? 1 : 0) + otherCountries.filter((c) => c!.currency === a).length
    const bShared =
      (b === currency ? 1 : 0) + otherCountries.filter((c) => c!.currency === b).length
    if (aShared !== bShared) return bShared - aShared
    return (
      COUNTRY_OPTIONS.filter((c) => c.currency === b).length -
      COUNTRY_OPTIONS.filter((c) => c.currency === a).length
    )
  })

  // ─── Combined country overview (when multiple selected) ────────────────────
  // Build list of all selected countries (this one + others)
  interface CountryInfo {
    code: string
    name: string
    flag: string
    capital: string | null
    timezone: string | null
    population: number | null
  }
  const allSelected: CountryInfo[] = [{ code, name, flag: '', capital, timezone, population }]
  otherCountries.forEach((c) => {
    allSelected.push({
      code: c!.code,
      name: c!.name,
      flag: c!.flag,
      capital: null, // We only have IANA tz from COUNTRY_OPTIONS
      timezone: c!.tz,
      population: null,
    })
  })

  // Deduplicated capitals & timezones
  const allCapitals = allSelected.map((c) => c.capital).filter(Boolean) as string[]
  const uniqueCapitals = Array.from(new Set(allCapitals))

  const allTimezones = allSelected.map((c) => c.timezone).filter(Boolean) as string[]
  const uniqueTimezones = Array.from(new Set(allTimezones))

  return (
    <>
      {/* ── Combined countries overview (multi-select) ── */}
      {hasOthers && (
        <section className="rounded-xl border border-brand-accent/15 bg-brand-surface/50 p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
            Comparing {allSelected.length} Countries
          </h2>
          {/* Flags + names row */}
          <div className="mb-3 flex flex-wrap gap-2 sm:gap-3">
            {allSelected.map((c) => {
              const opt = COUNTRY_OPTIONS.find((o) => o.code === c.code)
              return (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/20 bg-brand-surface px-3 py-1 text-sm text-brand-text sm:px-4"
                >
                  <span className="text-base">{opt?.flag ?? ''}</span>
                  {c.name}
                </span>
              )
            })}
          </div>
          {/* Shared quick facts */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-brand-text-muted">
            {uniqueCapitals.length > 0 && (
              <span>
                <span className="font-medium text-brand-text">
                  {uniqueCapitals.length === 1 ? 'Capital' : 'Capitals'}:
                </span>{' '}
                {uniqueCapitals.join(', ')}
              </span>
            )}
            {uniqueTimezones.length > 0 && (
              <span>
                <span className="font-medium text-brand-text">
                  {uniqueTimezones.length === 1 ? 'Timezone' : 'Timezones'}:
                </span>{' '}
                {uniqueTimezones.map(formatTz).join(', ')}
              </span>
            )}
          </div>
        </section>
      )}

      {/* ── Languages ── */}
      {sortedLanguages.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {sortedLanguages.map((lang) => {
              const overlap = langOverlap(lang.code)
              const multiplier = overlap + 1
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

      {/* ── Sectors ── */}
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

      {/* ── Currency ── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
          Currency
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {allCurrencies.map((curr) => {
            const overlap = currencyOverlap(curr)
            const isMine = curr === currency
            const totalCountries = (isMine ? 1 : 0) + overlap
            const isShared = hasOthers && totalCountries > 1
            const reach = COUNTRY_OPTIONS.filter((c) => c.currency === curr).length
            return (
              <span
                key={curr}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium sm:px-5 sm:py-2 sm:text-base transition-all ${
                  isShared
                    ? 'border-amber-300/50 bg-amber-500/20 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/30'
                    : 'border-amber-400/25 bg-amber-500/10 text-amber-300'
                }`}
              >
                {formatCurrency(curr)}
                {isShared && (
                  <span className="rounded-full bg-amber-400/30 px-1.5 text-[10px] font-bold text-amber-200 sm:text-xs">
                    ×{totalCountries}
                  </span>
                )}
                {!isShared && reach > 1 && (
                  <span className="rounded-full bg-amber-400/20 px-1.5 text-[10px] text-amber-400/70 sm:text-xs">
                    {reach}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </section>

      {/* ── Faiths ── */}
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

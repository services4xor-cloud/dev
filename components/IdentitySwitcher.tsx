'use client'

/**
 * IdentitySwitcher — Smart identity dropdown
 *
 * Design principles:
 *   1. CLEAR — always shows what's currently selected (country + language)
 *   2. CURATED — max 8 relevant options, ranked by algorithm
 *   3. LANGUAGE-AWARE — all names shown in the user's active language
 *   4. NO DUPLICATION — each identity appears once
 *   5. VALUE-DRIVEN — shows currency, distance, corridor strength
 *
 * Ranking algorithm (composite score):
 *   - Same language: +40 (journey collaboration)
 *   - Same region: +20 (proximity)
 *   - Direct corridor: +30 (trade strength)
 *   - Same currency: +15 (zero exchange risk)
 *   - Geographic proximity: +0–25 (inverse of flight hours)
 */

import Link from 'next/link'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { useJourney } from '@/lib/hooks/use-journey'

// ─── Props ──────────────────────────────────────────────────────────
interface IdentitySwitcherProps {
  open: boolean
  onClose: () => void
  className?: string
  widthClass?: string
}

// ─── Relevance engine ───────────────────────────────────────────────

interface RankedCountry {
  code: string
  flag: string
  name: string
  currency: string
  corridor: string
  flightHours: number
  score: number
  isCurrent: boolean
  tags: string[] // e.g. ['Same language', 'Direct corridor']
}

/** Haversine distance between two lat/lng points in km */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Approx flight hours from km (800km/h average) */
function kmToFlightHours(km: number): number {
  return Math.round((km / 800) * 10) / 10
}

function getRankedCountries(
  currentCountry: string,
  currentLanguage: string,
  localizeCountry: (code: string) => string
): RankedCountry[] {
  const current = COUNTRY_OPTIONS.find((c) => c.code === currentCountry)
  if (!current) return []

  const lang = LANGUAGE_REGISTRY[currentLanguage as LanguageCode]
  const languageCountries = new Set(lang?.countries ?? [])

  return COUNTRY_OPTIONS.filter((c) => c.code !== currentCountry)
    .map((c) => {
      let score = 0
      const tags: string[] = []

      // Same language countries (journey collaboration)
      if (languageCountries.has(c.code)) {
        score += 40
        tags.push(lang?.nativeName ?? currentLanguage)
      }

      // Direct corridor (strong trade route)
      if (c.corridorStrength === 'direct') {
        score += 30
        tags.push('Direct')
      } else if (c.corridorStrength === 'partner') {
        score += 15
      }

      // Same region (nearby)
      if (c.region === current.region) {
        score += 20
        if (!tags.length) tags.push('Nearby')
      }

      // Same currency (zero exchange risk)
      if (c.currency === current.currency) {
        score += 15
        tags.push(c.currency)
      }

      // Geographic proximity bonus (max 25 for adjacent countries)
      const dist = haversineKm(current.lat, current.lng, c.lat, c.lng)
      const flightHrs = kmToFlightHours(dist)
      const proximityScore = Math.max(0, 25 - flightHrs * 2)
      score += proximityScore

      return {
        code: c.code,
        flag: c.flag,
        name: localizeCountry(c.code),
        currency: c.currency,
        corridor: c.corridorStrength,
        flightHours: flightHrs,
        score,
        isCurrent: false,
        tags: tags.slice(0, 2), // Max 2 tags shown
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 7) // Top 7 most relevant (+ current = 8 total)
}

/** Get languages relevant to the user — spoken in their country first */
function getCuratedLanguages(
  currentCountry: string,
  currentLanguage: string
): { code: string; nativeName: string; name: string; isCurrent: boolean }[] {
  const results: { code: string; nativeName: string; name: string; isCurrent: boolean }[] = []
  const seen = new Set<string>()

  // Languages spoken in the user's country come first
  for (const [code, lang] of Object.entries(LANGUAGE_REGISTRY)) {
    if (lang.countries.includes(currentCountry)) {
      results.push({
        code,
        nativeName: lang.nativeName,
        name: lang.name,
        isCurrent: code === currentLanguage,
      })
      seen.add(code)
    }
  }

  // Then global-reach languages not yet included
  for (const [code, lang] of Object.entries(LANGUAGE_REGISTRY)) {
    if (seen.has(code)) continue
    if (lang.digitalReach === 'global') {
      results.push({
        code,
        nativeName: lang.nativeName,
        name: lang.name,
        isCurrent: code === currentLanguage,
      })
      seen.add(code)
    }
  }

  // If current language isn't included yet, add it
  if (!seen.has(currentLanguage)) {
    const lang = LANGUAGE_REGISTRY[currentLanguage as LanguageCode]
    if (lang) {
      results.unshift({
        code: currentLanguage,
        nativeName: lang.nativeName,
        name: lang.name,
        isCurrent: true,
      })
    }
  }

  return results.sort((a, b) => {
    if (a.isCurrent) return -1
    if (b.isCurrent) return 1
    return a.nativeName.localeCompare(b.nativeName)
  })
}

// ─── Component ──────────────────────────────────────────────────────

export default function IdentitySwitcher({
  open,
  onClose,
  className = '',
  widthClass = 'w-[calc(100vw-2rem)] sm:w-80',
}: IdentitySwitcherProps) {
  const { identity, setCountry, setLanguage, localizeCountry } = useIdentity()
  const { t } = useTranslation()
  const { trackCountryExplored } = useJourney()

  if (!open) return null

  const currentOpt = COUNTRY_OPTIONS.find((c) => c.code === identity.country)
  const ranked = getRankedCountries(identity.country, identity.language, localizeCountry)
  const languages = getCuratedLanguages(identity.country, identity.language)

  return (
    <div
      role="menu"
      data-testid="identity-switcher"
      className={`${widthClass} rounded-xl bg-[#16161e] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden ${className}`}
    >
      {/* ── Current (always visible, highlighted) ────── */}
      {currentOpt && (
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20">
            <span className="text-lg shrink-0">{currentOpt.flag}</span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-brand-accent">
                {localizeCountry(identity.country)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-brand-accent/60">
              {currentOpt.currency}
            </span>
          </div>
        </div>
      )}

      {/* ── Ranked countries ──────────────────────────── */}
      <div className="px-3 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-1.5 px-1">
          {t('nav.nearby') || 'Relevant'}
        </p>
        <div className="space-y-0.5">
          {ranked.map((c) => (
            <button
              key={c.code}
              type="button"
              role="menuitem"
              data-testid={`identity-country-${c.code.toLowerCase()}`}
              onClick={() => {
                setCountry(c.code)
                trackCountryExplored(c.code)
                onClose()
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/5 transition-all duration-150 group"
            >
              <span className="text-base shrink-0">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors">
                  {c.name}
                </span>
                {/* Tags — why this country is relevant */}
                {c.tags.length > 0 && (
                  <span className="ml-1.5 text-[9px] text-white/25">{c.tags.join(' · ')}</span>
                )}
              </div>
              {/* Flight hours — distance context */}
              <span className="text-[9px] text-white/20 shrink-0 tabular-nums">
                {c.flightHours}h
              </span>
              {/* Currency */}
              <span
                className={`text-[10px] font-mono shrink-0 ${
                  c.currency === currentOpt?.currency ? 'text-green-400/50' : 'text-white/25'
                }`}
              >
                {c.currency}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Language section ──────────────────────────── */}
      <div className="px-3 pt-1 pb-3 border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-2 mt-2 px-1">
          🗣️ {t('nav.language') || 'Language'}
        </p>
        <div className="flex flex-wrap gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              data-testid={`identity-lang-${lang.code}`}
              onClick={() => {
                setLanguage(lang.code)
                onClose()
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150
                ${
                  lang.isCurrent
                    ? 'bg-brand-accent/12 text-brand-accent border border-brand-accent/20'
                    : 'text-white/50 hover:text-white hover:bg-white/6 border border-white/5'
                }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="border-t border-white/5 px-3 py-2">
        <Link
          href="/threads"
          onClick={onClose}
          className="text-[11px] font-medium text-brand-accent/50 hover:text-brand-accent transition-colors"
        >
          {t('nav.browseThreads') || 'Browse all threads →'}
        </Link>
      </div>
    </div>
  )
}

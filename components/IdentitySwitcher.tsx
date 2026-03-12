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
      className={`${widthClass} rounded-2xl bg-[#12121a]/95 backdrop-blur-xl border border-white/8 shadow-2xl shadow-black/80 overflow-hidden ${className}`}
    >
      {/* ── Current (always visible, highlighted) ────── */}
      {currentOpt && (
        <div className="relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-accent/10" />
          <div className="relative px-4 pt-4 pb-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-2">
              Active Identity
            </p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-brand-accent/20">
              <span className="text-xl shrink-0">{currentOpt.flag}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-bold text-white">
                  Be{localizeCountry(identity.country)}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-white/40">
                    {languages.find((l) => l.isCurrent)?.nativeName ?? identity.language}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-mono text-brand-accent/60">
                    {currentOpt.currency}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-green-400/70 font-medium">Active</span>
                <span className="w-2 h-2 rounded-full bg-green-400/70 mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Ranked countries ──────────────────────────── */}
      <div className="px-4 pb-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-2 px-1">
          Switch Identity
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
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left
                         hover:bg-white/5 hover:border-white/10 border border-transparent
                         transition-all duration-200 group"
            >
              <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                {c.flag}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">
                    Be{c.name}
                  </span>
                </div>
                {c.tags.length > 0 && (
                  <div className="flex gap-1 mt-0.5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-white/25 block">{c.currency}</span>
                <span className="text-[9px] text-white/15">{c.flightHours}h</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Language section ──────────────────────────── */}
      <div className="px-4 pt-2 pb-3 border-t border-white/5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-2.5 px-1">
          {t('nav.language') || 'Display Language'}
        </p>
        <div className="flex flex-wrap gap-1.5">
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
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200
                ${
                  lang.isCurrent
                    ? 'bg-brand-accent/15 text-brand-accent border border-brand-accent/30 shadow-sm shadow-brand-accent/10'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-white/5 hover:border-white/10'
                }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="border-t border-white/5 px-4 py-2.5 flex items-center justify-between">
        <Link
          href="/threads"
          onClick={onClose}
          className="text-[11px] font-medium text-white/30 hover:text-brand-accent transition-colors"
        >
          Browse communities
        </Link>
        <Link
          href="/me"
          onClick={onClose}
          className="text-[11px] font-medium text-white/30 hover:text-brand-accent transition-colors"
        >
          Edit identity
        </Link>
      </div>
    </div>
  )
}

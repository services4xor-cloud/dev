'use client'

/**
 * IdentitySwitcher — Smart identity dropdown
 *
 * Design principles:
 *   1. LANGUAGE-FIRST — language selection appears before country
 *   2. CLEAR — always shows what's currently selected (country + language)
 *   3. TIERED — languages grouped: country → global/regional → local
 *   4. SEARCHABLE — filter input when 12+ languages
 *   5. NO DUPLICATION — each identity appears once
 *   6. VALUE-DRIVEN — shows currency, distance, corridor strength
 *
 * Ranking algorithm (composite score):
 *   - Same language: +40 (journey collaboration)
 *   - Same region: +20 (proximity)
 *   - Direct corridor: +30 (trade strength)
 *   - Same currency: +15 (zero exchange risk)
 *   - Geographic proximity: +0–25 (inverse of flight hours)
 */

import { useState } from 'react'
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
  languages: string[] // ISO language codes for this country
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
        languages: c.languages,
      }
    })
    .sort((a, b) => b.score - a.score)
}

// ─── Language tier type ─────────────────────────────────────────────

interface TieredLanguage {
  code: string
  nativeName: string
  name: string
  isCurrent: boolean
  tier: 'country' | 'global-regional' | 'local'
}

/**
 * Get ALL languages from LANGUAGE_REGISTRY grouped into 3 tiers:
 *   1. Country languages — spoken in the selected country (highlighted)
 *   2. Global/Regional — digitalReach 'global' or 'regional'
 *   3. Local — digitalReach 'local'
 *
 * Current language is always pinned at the very top.
 * No duplicates between tiers.
 */
function getCuratedLanguages(currentCountry: string, currentLanguage: string): TieredLanguage[] {
  const countryLangs: TieredLanguage[] = []
  const globalRegionalLangs: TieredLanguage[] = []
  const localLangs: TieredLanguage[] = []
  const seen = new Set<string>()

  // Tier 1: Languages spoken in the user's country
  for (const [code, lang] of Object.entries(LANGUAGE_REGISTRY)) {
    if (lang.countries.includes(currentCountry)) {
      countryLangs.push({
        code,
        nativeName: lang.nativeName,
        name: lang.name,
        isCurrent: code === currentLanguage,
        tier: 'country',
      })
      seen.add(code)
    }
  }

  // Tier 2: Global or regional reach (not already in tier 1)
  for (const [code, lang] of Object.entries(LANGUAGE_REGISTRY)) {
    if (seen.has(code)) continue
    if (lang.digitalReach === 'global' || lang.digitalReach === 'regional') {
      globalRegionalLangs.push({
        code,
        nativeName: lang.nativeName,
        name: lang.name,
        isCurrent: code === currentLanguage,
        tier: 'global-regional',
      })
      seen.add(code)
    }
  }

  // Tier 3: All remaining (local reach)
  for (const [code, lang] of Object.entries(LANGUAGE_REGISTRY)) {
    if (seen.has(code)) continue
    localLangs.push({
      code,
      nativeName: lang.nativeName,
      name: lang.name,
      isCurrent: code === currentLanguage,
      tier: 'local',
    })
    seen.add(code)
  }

  // Sort each tier alphabetically by nativeName
  const sortAlpha = (a: TieredLanguage, b: TieredLanguage) =>
    a.nativeName.localeCompare(b.nativeName)

  countryLangs.sort(sortAlpha)
  globalRegionalLangs.sort(sortAlpha)
  localLangs.sort(sortAlpha)

  // Combine all tiers
  const all = [...countryLangs, ...globalRegionalLangs, ...localLangs]

  // If current language wasn't captured in any tier, add it at the top
  if (!seen.has(currentLanguage)) {
    const lang = LANGUAGE_REGISTRY[currentLanguage as LanguageCode]
    if (lang) {
      all.unshift({
        code: currentLanguage,
        nativeName: lang.nativeName,
        name: lang.name,
        isCurrent: true,
        tier: 'country',
      })
    }
  }

  // Pin current language at the very top
  const currentIdx = all.findIndex((l) => l.isCurrent)
  if (currentIdx > 0) {
    const [current] = all.splice(currentIdx, 1)
    all.unshift(current)
  }

  return all
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
  const [search, setSearch] = useState('')

  if (!open) return null

  const currentOpt = COUNTRY_OPTIONS.find((c) => c.code === identity.country)
  const allRanked = getRankedCountries(identity.country, identity.language, localizeCountry)

  // Filter countries by search query (name, code, or language)
  const query = search.trim().toLowerCase()
  const ranked = query
    ? allRanked.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.languages.some((lang) => {
            const entry = LANGUAGE_REGISTRY[lang as LanguageCode]
            return (
              lang.includes(query) ||
              entry?.name.toLowerCase().includes(query) ||
              entry?.nativeName.toLowerCase().includes(query)
            )
          })
      )
    : allRanked

  // Get tier label
  const tierLabel = (tier: TieredLanguage['tier']) => {
    switch (tier) {
      case 'country':
        return localizeCountry(identity.country)
      case 'global-regional':
        return 'Global & Regional'
      case 'local':
        return 'All Languages'
    }
  }

  // Determine if we need tier dividers (only when not searching)
  const renderLanguageList = () => {
    let lastTier: TieredLanguage['tier'] | null = null

    return languages.map((lang, idx) => {
      const showTierHeader = !query && lang.tier !== lastTier && !lang.isCurrent
      lastTier = lang.tier

      return (
        <div key={lang.code}>
          {showTierHeader && idx > 0 && (
            <div className="pt-2 pb-1 px-1">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">
                {tierLabel(lang.tier)}
              </p>
            </div>
          )}
          <button
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
                  : lang.tier === 'country'
                    ? 'text-white/60 hover:text-white/90 hover:bg-white/8 border border-brand-accent/10 hover:border-brand-accent/25'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-white/5 hover:border-white/10'
              }`}
          >
            {lang.nativeName}
          </button>
        </div>
      )
    })
  }

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
              {t('nav.activeIdentity')}
            </p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-brand-accent/20">
              <span className="text-xl shrink-0">{currentOpt.flag}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-bold text-white">
                  Be{localizeCountry(identity.country)}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-white/40">
                    {allLanguages.find((l) => l.isCurrent)?.nativeName ?? identity.language}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-mono text-brand-accent/60">
                    {currentOpt.currency}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-green-400/70 font-medium">{t('nav.active')}</span>
                <span className="w-2 h-2 rounded-full bg-green-400/70 mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Countries with search ──────────────────── */}
      <div className="px-4 pb-3 border-t border-white/5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-2 mt-3 px-1">
          {t('nav.switchIdentity')}
        </p>

        {/* Search input */}
        <div className="relative mb-2">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries..."
            data-testid="country-search"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/8
                       text-[11px] text-white/70 placeholder-white/20
                       focus:outline-none focus:border-brand-accent/30 focus:bg-white/8
                       transition-all duration-200"
          />
        </div>
        <div className="space-y-0.5 max-h-[50vh] overflow-y-auto">
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
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {c.languages.slice(0, 3).map((lang) => {
                    const entry = LANGUAGE_REGISTRY[lang as LanguageCode]
                    return (
                      <span
                        key={lang}
                        className={`text-[9px] ${
                          lang === identity.language ? 'text-brand-accent/60' : 'text-white/25'
                        }`}
                      >
                        {entry?.nativeName ?? lang}
                      </span>
                    )
                  })}
                  {c.languages.length > 3 && (
                    <span className="text-[9px] text-white/15">+{c.languages.length - 3}</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-white/25 block">{c.currency}</span>
                <span className="text-[9px] text-white/15">{c.flightHours}h</span>
              </div>
            </button>
          ))}
          {query && ranked.length === 0 && (
            <p className="text-[10px] text-white/25 px-1 py-2">
              No countries match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="border-t border-white/5 px-4 py-2.5 flex items-center justify-between">
        <Link
          href="/exchange"
          onClick={onClose}
          className="text-[11px] font-medium text-white/30 hover:text-brand-accent transition-colors"
        >
          {t('nav.browseCommunitiesFull')}
        </Link>
        <Link
          href="/me"
          onClick={onClose}
          className="text-[11px] font-medium text-white/30 hover:text-brand-accent transition-colors"
        >
          {t('nav.editIdentity')}
        </Link>
      </div>
    </div>
  )
}

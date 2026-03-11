'use client'

/**
 * IdentitySwitcher — Compact identity dropdown
 *
 * Design principles:
 *   1. CLEAR — always shows what's currently selected (country + language)
 *   2. CURATED — max 8-10 relevant options, not a dump of everything
 *   3. LANGUAGE-AWARE — all names shown in the user's active language
 *   4. NO DUPLICATION — each identity appears once, sorted by relevance
 *   5. KISS — one flat list per section, no tabs
 *
 * Relevance algorithm:
 *   - Same language countries first (if you speak German → DE, CH, AT)
 *   - Same region second (if you're in KE → UG, TZ, NG)
 *   - High-corridor countries third
 *   - Everything else: hidden (browse /threads for full list)
 */

import Link from 'next/link'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'

// ─── Props ──────────────────────────────────────────────────────────
interface IdentitySwitcherProps {
  open: boolean
  onClose: () => void
  className?: string
  widthClass?: string
}

// ─── Relevance engine ───────────────────────────────────────────────

function getCuratedCountries(
  currentCountry: string,
  currentLanguage: string,
  localizeCountry: (code: string) => string
): {
  code: string
  flag: string
  name: string
  reason: 'current' | 'language' | 'region' | 'corridor'
}[] {
  const current = COUNTRY_OPTIONS.find((c) => c.code === currentCountry)
  if (!current) return []

  // Languages spoken in current country
  const lang = LANGUAGE_REGISTRY[currentLanguage as LanguageCode]
  const languageCountries = lang?.countries ?? []

  // Countries sharing the region
  const regionCountries = COUNTRY_OPTIONS.filter(
    (c) => c.region === current.region && c.code !== currentCountry
  ).map((c) => c.code)

  // Direct corridor countries
  const corridorCountries = COUNTRY_OPTIONS.filter(
    (c) => c.corridorStrength === 'direct' && c.code !== currentCountry
  ).map((c) => c.code)

  const seen = new Set<string>()
  const results: {
    code: string
    flag: string
    name: string
    reason: 'current' | 'language' | 'region' | 'corridor'
  }[] = []

  // 1. Current country always first
  results.push({
    code: current.code,
    flag: current.flag,
    name: localizeCountry(current.code),
    reason: 'current',
  })
  seen.add(current.code)

  // 2. Countries where user's language is spoken
  for (const cc of languageCountries) {
    if (seen.has(cc)) continue
    const opt = COUNTRY_OPTIONS.find((c) => c.code === cc)
    if (!opt) continue
    results.push({ code: cc, flag: opt.flag, name: localizeCountry(cc), reason: 'language' })
    seen.add(cc)
  }

  // 3. Same region
  for (const cc of regionCountries) {
    if (seen.has(cc)) continue
    if (results.length >= 8) break
    const opt = COUNTRY_OPTIONS.find((c) => c.code === cc)
    if (!opt) continue
    results.push({ code: cc, flag: opt.flag, name: localizeCountry(cc), reason: 'region' })
    seen.add(cc)
  }

  // 4. Direct corridors
  for (const cc of corridorCountries) {
    if (seen.has(cc)) continue
    if (results.length >= 10) break
    const opt = COUNTRY_OPTIONS.find((c) => c.code === cc)
    if (!opt) continue
    results.push({ code: cc, flag: opt.flag, name: localizeCountry(cc), reason: 'corridor' })
    seen.add(cc)
  }

  return results
}

/** Get languages relevant to the user — spoken in their country or nearby */
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

  // Sort: current first, then alphabetical by nativeName
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

  if (!open) return null

  const countries = getCuratedCountries(identity.country, identity.language, localizeCountry)
  const languages = getCuratedLanguages(identity.country, identity.language)

  return (
    <div
      role="menu"
      data-testid="identity-switcher"
      className={`${widthClass} rounded-xl bg-[#16161e] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden ${className}`}
    >
      {/* ── Location section ─────────────────────────── */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-accent/60 mb-2">
          📍 {t('nav.location') || 'Location'}
        </p>
        <div className="grid grid-cols-2 gap-1">
          {countries.map((c) => (
            <button
              key={c.code}
              type="button"
              role="menuitem"
              data-testid={`identity-country-${c.code.toLowerCase()}`}
              onClick={() => {
                setCountry(c.code)
                onClose()
              }}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                ${
                  c.reason === 'current'
                    ? 'bg-brand-accent/12 text-brand-accent border border-brand-accent/20'
                    : 'text-white/70 hover:text-white hover:bg-white/6'
                }`}
            >
              <span className="text-base shrink-0">{c.flag}</span>
              <span className="truncate text-[13px]">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Language section ──────────────────────────── */}
      <div className="px-3 pt-1 pb-3 border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-accent/60 mb-2 mt-2">
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
      <div className="border-t border-white/5 px-3 py-2 flex items-center justify-between">
        <Link
          href="/threads"
          onClick={onClose}
          className="text-[11px] font-medium text-brand-accent/60 hover:text-brand-accent transition-colors"
        >
          {t('nav.browseThreads') || 'Browse all threads →'}
        </Link>
      </div>
    </div>
  )
}

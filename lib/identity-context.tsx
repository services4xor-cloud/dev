'use client'

/**
 * Identity Context — Global identity state for Be[Country/Tribe/Location]
 *
 * When a user selects "BeGermany" in the Nav dropdown or a country Gate,
 * this context propagates that selection to every page component:
 *   - usePaths({ country }) filters to German paths
 *   - useThreads({ country }) shows German threads
 *   - Homepage hero adapts to selected identity
 *
 * Persists in localStorage so returning users keep their identity.
 * Falls back to NEXT_PUBLIC_COUNTRY_CODE (default: KE).
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getLocalizedCountryName, getDefaultLanguage } from '@/lib/endonyms'
import { detectCountryFromTimezone } from '@/lib/geo'

// ─── Types ──────────────────────────────────────────────────────────

interface Identity {
  /** ISO country code (KE, DE, CH, etc.) */
  country: string
  /** ISO 639-1 language code (en, de, sw, fr, etc.) */
  language: string
  /** Thread slug if viewing a specific thread (e.g. 'bemaasai') */
  threadSlug?: string
  /** Thread type if viewing a specific thread (e.g. 'tribe') */
  threadType?: string
  /** Thread brand name override (e.g. 'BeMaasai' when a tribe is active) */
  threadBrandName?: string
}

interface IdentityContextValue {
  /** Current active identity */
  identity: Identity
  /** Country name localized to user's language (e.g. "Kenia" in German, "Kenya" in English) */
  countryName: string
  /** Brand name localized (e.g. "BeDeutschland" in German, "BeGermany" in English) */
  brandName: string
  /** Set the active country (also resets language to country default) */
  setCountry: (code: string) => void
  /** Set the display language */
  setLanguage: (code: string) => void
  /** Set the active thread (with optional brand name for logo) */
  setThread: (slug: string, type: string, brandName?: string) => void
  /** Clear thread selection (back to country-level) */
  clearThread: () => void
  /** Reset to default country + language */
  reset: () => void
  /** Get any country's name in the current display language */
  localizeCountry: (countryCode: string) => string
}

// ─── Default ────────────────────────────────────────────────────────

const DEFAULT_COUNTRY = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase()
const DEFAULT_LANGUAGE = getDefaultLanguage(DEFAULT_COUNTRY)

// Countries where "Be" + full country name doesn't work as a brand name
const BRAND_NAME_OVERRIDES: Record<string, string> = {
  GB: 'BeUK',
  US: 'BeUSA',
  AE: 'BeUAE',
  ZA: 'BeSouthAfrica',
  KR: 'BeSouthKorea',
}

// ─── Context ────────────────────────────────────────────────────────

const IdentityContext = createContext<IdentityContextValue | undefined>(undefined)

// ─── Provider ───────────────────────────────────────────────────────

const STORAGE_KEY = 'be-identity'

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity>({
    country: DEFAULT_COUNTRY,
    language: DEFAULT_LANGUAGE,
  })

  // Hydrate from localStorage on mount, or auto-detect from browser
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.country) {
          // Migrate old format (no language field) → add default language
          if (!parsed.language) {
            parsed.language = getDefaultLanguage(parsed.country)
          }
          setIdentity(parsed)
        }
      }
    } catch {
      // Ignore — use default
    }

    // If nothing stored, detect from browser
    if (!stored) {
      try {
        const browserLang = navigator.language?.split('-')[0] || 'en'
        const detected = detectCountryFromTimezone()
        if (detected) {
          setIdentity({ country: detected, language: browserLang })
        }
      } catch {
        // Ignore — use defaults
      }
    }
  }, [])

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity))
    } catch {
      // Ignore — localStorage unavailable
    }
  }, [identity])

  const setCountry = useCallback((code: string) => {
    const cc = code.toUpperCase()
    setIdentity((prev) => ({
      country: cc,
      // When changing country, keep current language unless switching to a country
      // where the current language isn't spoken — then reset to country default
      language: prev.language || getDefaultLanguage(cc),
    }))
  }, [])

  const setLanguage = useCallback((code: string) => {
    setIdentity((prev) => ({ ...prev, language: code.toLowerCase() }))
  }, [])

  const setThread = useCallback((slug: string, type: string, threadBrand?: string) => {
    setIdentity((prev) => ({
      ...prev,
      threadSlug: slug,
      threadType: type,
      threadBrandName: threadBrand,
    }))
  }, [])

  const clearThread = useCallback(() => {
    setIdentity((prev) => ({ country: prev.country, language: prev.language }))
  }, [])

  const reset = useCallback(() => {
    setIdentity({ country: DEFAULT_COUNTRY, language: DEFAULT_LANGUAGE })
  }, [])

  // Localized names — thread brand overrides country brand when active
  const countryName = getLocalizedCountryName(identity.country, identity.language)
  const brandName =
    identity.threadBrandName || BRAND_NAME_OVERRIDES[identity.country] || `Be${countryName}`

  // Helper to localize any country code in the user's current language
  const localizeCountry = useCallback(
    (countryCode: string) => getLocalizedCountryName(countryCode, identity.language),
    [identity.language]
  )

  return (
    <IdentityContext.Provider
      value={{
        identity,
        countryName,
        brandName,
        setCountry,
        setLanguage,
        setThread,
        clearThread,
        reset,
        localizeCountry,
      }}
    >
      {children}
    </IdentityContext.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityContext)
  if (!ctx) {
    // Graceful fallback when used outside provider (e.g. in API routes)
    const fallbackName = getLocalizedCountryName(DEFAULT_COUNTRY, DEFAULT_LANGUAGE)
    return {
      identity: { country: DEFAULT_COUNTRY, language: DEFAULT_LANGUAGE },
      countryName: fallbackName,
      brandName: BRAND_NAME_OVERRIDES[DEFAULT_COUNTRY] || `Be${fallbackName}`,
      setCountry: () => {},
      setLanguage: () => {},
      setThread: () => {},
      clearThread: () => {},
      reset: () => {},
      localizeCountry: (cc: string) => getLocalizedCountryName(cc, DEFAULT_LANGUAGE),
    }
  }
  return ctx
}

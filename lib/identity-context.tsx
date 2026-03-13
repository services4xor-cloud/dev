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
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'

// ─── Types ──────────────────────────────────────────────────────────

interface Identity {
  /** ISO country code (KE, DE, CH, etc.) */
  country: string
  /** ISO 639-1 language code (en, de, sw, fr, etc.) — display language */
  language: string
  /** Thread slug if viewing a specific thread (e.g. 'bemaasai') */
  threadSlug?: string
  /** Thread type if viewing a specific thread (e.g. 'tribe') */
  threadType?: string
  /** Thread brand name override (e.g. 'BeMaasai' when a tribe is active) */
  threadBrandName?: string
  /** City the user is based in */
  city?: string
  /** Languages the user SPEAKS (distinct from display `language`) */
  languages: string[]
  /** Category IDs from exchange categories the user is interested in */
  interests: string[]
  /** Explorer discovers experiences, Host offers them */
  mode: 'explorer' | 'host'
  /** Faith/spiritual dimension */
  faith: string[]
  /** Profession/skill tags */
  craft: string[]
  /** Mobility/capability tags */
  reach: string[]
  /** Optional ethnic/cultural identity */
  culture?: string
  /** Target destination countries (ISO codes) the user wants to explore */
  toCountries: string[]
  /** Auto-detected location from browser timezone (ISO country code) — separate from selected country */
  detectedLocation?: string
  /** True once the 5-step discovery wizard has been completed — never resets even if languages emptied */
  discoveryCompleted?: boolean
}

interface IdentityContextValue {
  /** Current active identity */
  identity: Identity
  /** Country name localized to user's language (e.g. "Kenia" in German, "Kenya" in English) */
  countryName: string
  /** Brand name localized (e.g. "BeDeutschland" in German, "BeGermany" in English) */
  brandName: string
  /** True when user has selected languages AND interests (discovery complete) */
  hasCompletedDiscovery: boolean
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
  /** Set spoken languages (not display language) */
  setLanguages: (langs: string[]) => void
  /** Set interest category IDs */
  setInterests: (interests: string[]) => void
  /** Set explorer/host mode */
  setMode: (mode: 'explorer' | 'host') => void
  /** Set user's city */
  setCity: (city: string) => void
  /** Set faith/spiritual dimension */
  setFaith: (faith: string[]) => void
  /** Set profession/skill tags */
  setCraft: (craft: string[]) => void
  /** Set mobility/capability tags */
  setReach: (reach: string[]) => void
  /** Set ethnic/cultural identity */
  setCulture: (culture: string | undefined) => void
  /** Set target destination countries */
  setToCountries: (countries: string[]) => void
  /** Set detected location (ISO country code from browser timezone) */
  setDetectedLocation: (code: string | undefined) => void
  /** Mark discovery wizard as completed (one-way latch, never resets) */
  markDiscoveryCompleted: () => void
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
    languages: [],
    interests: [],
    mode: 'explorer',
    faith: [],
    craft: [],
    reach: [],
    toCountries: [],
  })

  // Hydrate from localStorage on mount, or auto-detect from browser
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.country) {
          // Migrate old format — add defaults for missing fields
          if (!parsed.language) {
            parsed.language = getDefaultLanguage(parsed.country)
          }
          if (!Array.isArray(parsed.languages)) {
            parsed.languages = []
          }
          if (!Array.isArray(parsed.interests)) {
            parsed.interests = []
          }
          if (!parsed.mode) {
            parsed.mode = 'explorer'
          }
          if (!Array.isArray(parsed.faith)) parsed.faith = parsed.faith ? [parsed.faith] : []
          if (!Array.isArray(parsed.craft)) parsed.craft = []
          if (!Array.isArray(parsed.reach)) parsed.reach = []
          if (!Array.isArray(parsed.toCountries)) parsed.toCountries = []
          setIdentity(parsed)
        }
      }
    } catch {
      // Ignore — use default
    }

    // Detect location from timezone (separate from selected country)
    // Only set country + language if NO stored identity exists
    try {
      const detectedLoc = detectCountryFromTimezone()
      if (detectedLoc) {
        setIdentity((prev) => ({
          ...prev,
          detectedLocation: detectedLoc,
          // Only auto-set country + language for brand-new users (no stored identity)
          // If user already has stored identity, preserve their language choice
          ...(!stored
            ? {
                country: detectedLoc,
                language: getDefaultLanguage(detectedLoc),
              }
            : {}),
        }))
      }
    } catch {
      // Ignore — detectedLocation stays undefined
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
    setIdentity((prev) => {
      // Language-first: preserve current language if spoken in the target country
      const currentLang = prev.language as LanguageCode
      const langEntry = LANGUAGE_REGISTRY[currentLang]
      const langSpokenInTarget = langEntry?.countries?.includes(cc) ?? false

      return {
        ...prev,
        country: cc,
        // Keep current language if it's spoken in the new country, else switch to default
        language: langSpokenInTarget ? prev.language : getDefaultLanguage(cc),
        // Clear thread when changing country
        threadSlug: undefined,
        threadType: undefined,
        threadBrandName: undefined,
      }
    })
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
    setIdentity((prev) => ({
      country: prev.country,
      language: prev.language,
      languages: prev.languages,
      interests: prev.interests,
      mode: prev.mode,
      city: prev.city,
      faith: prev.faith,
      craft: prev.craft,
      reach: prev.reach,
      culture: prev.culture,
      toCountries: prev.toCountries,
      detectedLocation: prev.detectedLocation,
      discoveryCompleted: prev.discoveryCompleted,
    }))
  }, [])

  const reset = useCallback(() => {
    setIdentity((prev) => ({
      country: DEFAULT_COUNTRY,
      language: DEFAULT_LANGUAGE,
      languages: [],
      interests: [],
      mode: 'explorer',
      faith: [],
      craft: [],
      reach: [],
      toCountries: [],
      // Preserve discovery flag — user shouldn't re-do wizard after reset
      discoveryCompleted: prev.discoveryCompleted,
    }))
  }, [])

  const setLanguages = useCallback((langs: string[]) => {
    setIdentity((prev) => ({ ...prev, languages: langs }))
  }, [])

  const setInterests = useCallback((newInterests: string[]) => {
    setIdentity((prev) => ({ ...prev, interests: newInterests }))
  }, [])

  const setMode = useCallback((newMode: 'explorer' | 'host') => {
    setIdentity((prev) => ({ ...prev, mode: newMode }))
  }, [])

  const setCity = useCallback((city: string) => {
    setIdentity((prev) => ({ ...prev, city }))
  }, [])

  const setFaith = useCallback((faith: string[]) => {
    setIdentity((prev) => ({ ...prev, faith }))
  }, [])

  const setCraft = useCallback((craft: string[]) => {
    setIdentity((prev) => ({ ...prev, craft }))
  }, [])

  const setReach = useCallback((reach: string[]) => {
    setIdentity((prev) => ({ ...prev, reach }))
  }, [])

  const setCulture = useCallback((culture: string | undefined) => {
    setIdentity((prev) => ({ ...prev, culture }))
  }, [])

  const setToCountries = useCallback((toCountries: string[]) => {
    setIdentity((prev) => ({ ...prev, toCountries: toCountries.slice(0, 10) }))
  }, [])

  const setDetectedLocation = useCallback((detectedLocation: string | undefined) => {
    setIdentity((prev) => ({ ...prev, detectedLocation }))
  }, [])

  const markDiscoveryCompleted = useCallback(() => {
    setIdentity((prev) => ({ ...prev, discoveryCompleted: true }))
  }, [])

  // Localized names — thread brand overrides country brand when active
  const countryName = getLocalizedCountryName(identity.country, identity.language)
  const brandName =
    identity.threadBrandName || BRAND_NAME_OVERRIDES[identity.country] || `Be${countryName}`

  // Discovery is complete once the wizard has been run (persistent flag)
  // OR if user has languages set (backwards compat for existing users)
  const hasCompletedDiscovery =
    identity.discoveryCompleted === true || identity.languages.length > 0

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
        hasCompletedDiscovery,
        setCountry,
        setLanguage,
        setThread,
        clearThread,
        reset,
        localizeCountry,
        setLanguages,
        setInterests,
        setMode,
        setCity,
        setFaith,
        setCraft,
        setReach,
        setCulture,
        setToCountries,
        setDetectedLocation,
        markDiscoveryCompleted,
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
      identity: {
        country: DEFAULT_COUNTRY,
        language: DEFAULT_LANGUAGE,
        languages: [],
        interests: [],
        mode: 'explorer' as const,
        faith: [],
        craft: [],
        reach: [],
        toCountries: [],
      },
      countryName: fallbackName,
      brandName: BRAND_NAME_OVERRIDES[DEFAULT_COUNTRY] || `Be${fallbackName}`,
      hasCompletedDiscovery: false,
      setCountry: () => {},
      setLanguage: () => {},
      setThread: () => {},
      clearThread: () => {},
      reset: () => {},
      localizeCountry: (cc: string) => getLocalizedCountryName(cc, DEFAULT_LANGUAGE),
      setLanguages: () => {},
      setInterests: () => {},
      setMode: () => {},
      setCity: () => {},
      setFaith: () => {},
      setCraft: () => {},
      setReach: () => {},
      setCulture: () => {},
      setToCountries: () => {},
      setDetectedLocation: () => {},
      markDiscoveryCompleted: () => {},
    }
  }
  return ctx
}

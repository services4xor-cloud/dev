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
import { COUNTRIES } from '@/lib/countries'

// ─── Types ──────────────────────────────────────────────────────────

interface Identity {
  /** ISO country code (KE, DE, CH, etc.) */
  country: string
  /** Thread slug if viewing a specific thread (e.g. 'bemaasai') */
  threadSlug?: string
  /** Thread type if viewing a specific thread (e.g. 'tribe') */
  threadType?: string
}

interface IdentityContextValue {
  /** Current active identity */
  identity: Identity
  /** Country name (e.g. "Kenya", "Germany") */
  countryName: string
  /** Brand name (e.g. "BeKenya", "BeGermany") */
  brandName: string
  /** Set the active country */
  setCountry: (code: string) => void
  /** Set the active thread */
  setThread: (slug: string, type: string) => void
  /** Clear thread selection (back to country-level) */
  clearThread: () => void
  /** Reset to default country */
  reset: () => void
}

// ─── Default ────────────────────────────────────────────────────────

const DEFAULT_COUNTRY = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase()

function getCountryName(code: string): string {
  const key = code.toUpperCase() as keyof typeof COUNTRIES
  return COUNTRIES[key]?.name ?? code
}

// ─── Context ────────────────────────────────────────────────────────

const IdentityContext = createContext<IdentityContextValue | undefined>(undefined)

// ─── Provider ───────────────────────────────────────────────────────

const STORAGE_KEY = 'be-identity'

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity>({ country: DEFAULT_COUNTRY })

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.country) {
          setIdentity(parsed)
        }
      }
    } catch {
      // Ignore — use default
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
    setIdentity({ country: code.toUpperCase() })
  }, [])

  const setThread = useCallback((slug: string, type: string) => {
    setIdentity((prev) => ({ ...prev, threadSlug: slug, threadType: type }))
  }, [])

  const clearThread = useCallback(() => {
    setIdentity((prev) => ({ country: prev.country }))
  }, [])

  const reset = useCallback(() => {
    setIdentity({ country: DEFAULT_COUNTRY })
  }, [])

  const countryName = getCountryName(identity.country)
  const brandName = `Be${countryName}`

  return (
    <IdentityContext.Provider
      value={{
        identity,
        countryName,
        brandName,
        setCountry,
        setThread,
        clearThread,
        reset,
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
    return {
      identity: { country: DEFAULT_COUNTRY },
      countryName: getCountryName(DEFAULT_COUNTRY),
      brandName: `Be${getCountryName(DEFAULT_COUNTRY)}`,
      setCountry: () => {},
      setThread: () => {},
      clearThread: () => {},
      reset: () => {},
    }
  }
  return ctx
}

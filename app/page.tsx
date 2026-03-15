'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'
import DimensionFilters, { type ActiveFilter } from '@/components/DimensionFilters'
import NotificationBadge from '@/components/NotificationBadge'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

/** Max enrichment steps — oldest drops off when exceeded (ouroboros) */
const MAX_PATH_STEPS = 7

/** Country code → name lookup */
const COUNTRY_NAMES: Record<string, string> = {}
for (const c of COUNTRY_OPTIONS) COUNTRY_NAMES[c.code] = c.name

/** Country flag emoji */
function countryFlag(code: string): string {
  try {
    return String.fromCodePoint(
      ...code
        .toUpperCase()
        .split('')
        .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    )
  } catch {
    return '🌍'
  }
}

/** Country with intensity score: how many active filters match this country */
export interface ScoredCountry {
  code: string
  score: number // 0-1 normalized (matchCount / totalFilters)
  matchCount: number
}

/** Elegant next-step teaser — fades in, holds 4s, fades out. Best option only. */
function NextStepTeaser({
  nextStep,
  enrichedCountries,
  onAccept,
  onPreview,
}: {
  nextStep: { code: string; name: string; score: number; matchCount: number } | null
  enrichedCountries: string[]
  onAccept: () => void
  onPreview: (codes: string[]) => void
}) {
  const [visible, setVisible] = useState(false)
  const [rendered, setRendered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevCodeRef = useRef<string | null>(null)

  useEffect(() => {
    // Only trigger when nextStep changes to a NEW suggestion
    if (!nextStep) {
      setVisible(false)
      setTimeout(() => setRendered(false), 500) // wait for fade-out
      prevCodeRef.current = null
      return
    }
    if (nextStep.code === prevCodeRef.current) return // same suggestion, don't re-trigger
    prevCodeRef.current = nextStep.code

    // Fade in after brief delay
    setRendered(true)
    const showTimer = setTimeout(() => setVisible(true), 100)

    // Auto-hide after 5 seconds
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => setRendered(false), 500)
    }, 5000)

    return () => {
      clearTimeout(showTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [nextStep])

  if (!nextStep || !rendered) return null

  return (
    <div
      className={`absolute left-0 right-0 top-12 z-20 flex justify-center px-4 py-1.5 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <button
        onClick={() => {
          onAccept()
          setVisible(false)
          setTimeout(() => setRendered(false), 500)
        }}
        onMouseEnter={() => {
          onPreview([nextStep.code])
          // Pause auto-hide on hover
          if (timerRef.current) clearTimeout(timerRef.current)
        }}
        onMouseLeave={() => {
          onPreview([])
          // Resume auto-hide
          timerRef.current = setTimeout(() => {
            setVisible(false)
            setTimeout(() => setRendered(false), 500)
          }, 2000)
        }}
        className="group flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-surface/90 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-brand-accent/5 transition-all hover:border-brand-accent/40 hover:shadow-brand-accent/15"
      >
        <span className="text-base">{countryFlag(nextStep.code)}</span>
        <span className="text-xs font-medium text-brand-accent group-hover:underline">
          {nextStep.name}
        </span>
        <span className="rounded-full bg-brand-accent/20 px-2 py-0.5 text-[10px] font-semibold text-brand-accent">
          {Math.round(nextStep.score * 100)}%
        </span>
        <span className="text-[10px] text-brand-text-muted/60">
          {enrichedCountries.length}/{MAX_PATH_STEPS}
        </span>
      </button>
    </div>
  )
}

export default function HomePage() {
  const { data: session } = useSession()
  // Restore map state from sessionStorage (survives navigation)
  const [filters, setFilters] = useState<ActiveFilter[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = sessionStorage.getItem('bex-map-filters')
      return raw ? (JSON.parse(raw) as ActiveFilter[]) : []
    } catch {
      return []
    }
  })
  // Track multiple enriched countries (additive clicks)
  const [enrichedCountries, setEnrichedCountries] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = sessionStorage.getItem('bex-map-enriched')
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })
  const [enrichedNames, setEnrichedNames] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = sessionStorage.getItem('bex-map-enriched-names')
      return raw ? (JSON.parse(raw) as Record<string, string>) : {}
    } catch {
      return {}
    }
  })
  const previewCountries: string[] = [] // preview disabled — keep prop for API compat
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // The "selected" country for the logo is the most recently enriched
  const selectedCountry =
    enrichedCountries.length > 0 ? enrichedCountries[enrichedCountries.length - 1] : null
  const selectedCountryName = selectedCountry
    ? (enrichedNames[selectedCountry] ?? selectedCountry)
    : null

  // Persist enriched countries + filters to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('bex-map-enriched', JSON.stringify(enrichedCountries))
    sessionStorage.setItem('bex-map-enriched-names', JSON.stringify(enrichedNames))
    // Keep legacy keys for backward compat
    if (selectedCountry) {
      sessionStorage.setItem('bex-map-selected', selectedCountry)
    } else {
      sessionStorage.removeItem('bex-map-selected')
    }
    if (selectedCountryName) {
      sessionStorage.setItem('bex-map-selected-name', selectedCountryName)
    } else {
      sessionStorage.removeItem('bex-map-selected-name')
    }
  }, [enrichedCountries, enrichedNames, selectedCountry, selectedCountryName])

  useEffect(() => {
    sessionStorage.setItem('bex-map-filters', JSON.stringify(filters))
  }, [filters])

  // Compute intensity scores from active filters — client-side, no API needed
  // Each filter has countryCodes[]. Count how many filters match each country.
  const scoredCountries = useMemo(() => {
    const filtersWithCodes = filters.filter((f) => f.countryCodes && f.countryCodes.length > 0)
    if (filtersWithCodes.length === 0) return []

    const countMap = new Map<string, number>()
    for (const f of filtersWithCodes) {
      for (const code of f.countryCodes!) {
        countMap.set(code, (countMap.get(code) || 0) + 1)
      }
    }

    const total = filtersWithCodes.length
    const scored: ScoredCountry[] = []
    for (const [code, matchCount] of Array.from(countMap.entries())) {
      scored.push({ code, score: matchCount / total, matchCount })
    }
    return scored
  }, [filters])

  // Next best step — single top suggestion (not already enriched, highest score, 2+ matches)
  const nextStep = useMemo(() => {
    if (scoredCountries.length === 0 || enrichedCountries.length === 0) return null
    const enrichedSet = new Set(enrichedCountries)
    const best = scoredCountries
      .filter((sc) => !enrichedSet.has(sc.code) && sc.matchCount >= 2)
      .sort((a, b) => b.score - a.score || b.matchCount - a.matchCount)[0]
    if (!best) return null
    return {
      code: best.code,
      name: COUNTRY_NAMES[best.code] ?? best.code,
      score: best.score,
      matchCount: best.matchCount,
    }
  }, [scoredCountries, enrichedCountries])

  // Enrich: when clicking a country, auto-discover related dimensions and ADD to existing
  const enrichCountry = useCallback(async (code: string, name: string) => {
    try {
      const res = await fetch('/api/map/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) return
      const data = (await res.json()) as {
        filters: ActiveFilter[]
      }
      // Tag each enrichment filter with its source country
      const taggedFilters = data.filters.map((f) => ({
        ...f,
        source: code,
      }))
      // ADD to existing filters (keep other countries' enrichments + custom)
      setFilters((prev) => {
        // Remove any existing filters from THIS country (re-enrich)
        const withoutThisCountry = prev.filter((f) => f.source !== code)
        return [...withoutThisCountry, ...taggedFilters]
      })
    } catch {
      // Fallback: just add location filter
      setFilters((prev) => {
        const withoutThisCountry = prev.filter((f) => f.source !== code)
        return [
          ...withoutThisCountry,
          {
            dimension: 'location' as const,
            nodeCode: name.toLowerCase(),
            label: name,
            icon: '📍',
            countryCodes: [code],
            source: code,
          },
        ]
      })
    }
  }, [])

  // Remove a country's enrichment — remove its filters and from enriched list
  const unenrichCountry = useCallback((code: string) => {
    setFilters((prev) => prev.filter((f) => f.source !== code))
    setEnrichedCountries((prev) => prev.filter((c) => c !== code))
    setEnrichedNames((prev) => {
      const next = { ...prev }
      delete next[code]
      return next
    })
  }, [])

  // Poll for unread notifications every 30 seconds when signed in
  useEffect(() => {
    if (!session) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = (await res.json()) as { unreadMessages: number; pendingPayments: number }
          setUnreadMessages(data.unreadMessages)
        }
      } catch {
        // silently ignore network errors
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [session])

  // Handle filter changes from DimensionFilters — sync enriched countries when source rows removed
  const handleFilterChange = useCallback((newFilters: ActiveFilter[]) => {
    setFilters(newFilters)
    // Check if any enriched country lost ALL its filters — remove from enriched list
    const remainingSources = new Set<string>(
      newFilters.filter((f) => f.source && f.source !== 'custom').map((f) => f.source!)
    )
    setEnrichedCountries((prev) => prev.filter((c) => remainingSources.has(c)))
    setEnrichedNames((prev) => {
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(prev)) {
        if (remainingSources.has(k)) next[k] = v
      }
      return next
    })
  }, [])

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <WorldMap
        scoredCountries={scoredCountries}
        previewCountryCodes={previewCountries}
        onCountryClick={(code, name) => {
          if (code === null) {
            // Clicked empty space — do nothing (keep enrichments)
            return
          }
          if (enrichedCountries.includes(code)) {
            // Toggle off — remove this country's enrichment only
            unenrichCountry(code)
          } else {
            // Add this country — ouroboros: if at max, oldest drops off
            setEnrichedCountries((prev) => {
              const next = [...prev, code]
              if (next.length > MAX_PATH_STEPS) {
                const dropped = next[0]
                // Remove oldest country's filters
                setFilters((f) => f.filter((fl) => fl.source !== dropped))
                return next.slice(1)
              }
              return next
            })
            setEnrichedNames((prev) => ({ ...prev, [code]: name ?? code }))
            // Auto-enrich: discover all related dimensions for this country
            void enrichCountry(code, name ?? code)
          }
        }}
        selectedCountry={selectedCountry}
      />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 py-3">
        <Link
          href={selectedCountry ? `/be/${selectedCountry.toLowerCase()}` : '/'}
          className={`text-xl font-bold transition ${selectedCountry ? 'logo-saiyan' : ''}`}
          onClick={(e) => {
            if (selectedCountry) {
              return
            }
            e.preventDefault()
          }}
        >
          <span className={selectedCountry ? 'text-brand-text-muted' : 'text-brand-accent'}>
            Be[
          </span>
          <span className="text-brand-accent">
            {enrichedCountries.length > 1
              ? enrichedCountries.join('·')
              : (selectedCountryName ?? 'X')}
          </span>
          <span className={selectedCountry ? 'text-brand-text-muted' : 'text-brand-accent'}>]</span>
        </Link>
        {/* Mobile menu toggle */}
        <button
          className="text-brand-text-muted hover:text-brand-accent transition sm:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 sm:flex">
          <Link
            href="/agent"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            Agent
          </Link>
          <Link
            href="/opportunities"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            Opportunities
          </Link>
          {session ? (
            <>
              <Link
                href="/messages"
                className="relative text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Messages
                <NotificationBadge count={unreadMessages} />
              </Link>
              <Link
                href="/me"
                className="text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Me
              </Link>
              <Link
                href="/settings"
                className="text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Settings
              </Link>
              <Link
                href="/payments"
                className="text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Payments
              </Link>
              <Link
                href="/referral"
                className="text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Refer
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-brand-text-muted hover:text-brand-accent transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Next best step — elegant teaser that fades in then out */}
      <NextStepTeaser
        nextStep={nextStep}
        enrichedCountries={enrichedCountries}
        onAccept={() => {
          if (nextStep && !enrichedCountries.includes(nextStep.code)) {
            setEnrichedCountries((prev) => {
              const next = [...prev, nextStep.code]
              if (next.length > MAX_PATH_STEPS) {
                const dropped = next[0]
                setFilters((f) => f.filter((fl) => fl.source !== dropped))
                return next.slice(1)
              }
              return next
            })
            setEnrichedNames((prev) => ({ ...prev, [nextStep.code]: nextStep.name }))
            void enrichCountry(nextStep.code, nextStep.name)
          }
        }}
        onPreview={() => {}}
      />

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="absolute left-0 right-0 top-12 z-40 flex flex-col gap-1 bg-brand-surface/95 px-4 py-3 backdrop-blur sm:hidden">
          <Link
            href="/agent"
            onClick={() => setMenuOpen(false)}
            className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            Agent
          </Link>
          <Link
            href="/opportunities"
            onClick={() => setMenuOpen(false)}
            className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            Opportunities
          </Link>
          {session ? (
            <>
              <Link
                href="/messages"
                onClick={() => setMenuOpen(false)}
                className="relative py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Messages
                <NotificationBadge count={unreadMessages} />
              </Link>
              <Link
                href="/me"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Me
              </Link>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Settings
              </Link>
              <Link
                href="/payments"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Payments
              </Link>
              <Link
                href="/referral"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Refer
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                  setMenuOpen(false)
                }}
                className="py-2 text-left text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
            >
              Login
            </Link>
          )}
        </nav>
      )}

      <DimensionFilters
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onPreview={() => {}}
      />
    </main>
  )
}

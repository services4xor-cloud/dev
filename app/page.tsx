'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'
import DimensionFilters, { type ActiveFilter } from '@/components/DimensionFilters'
import NotificationBadge from '@/components/NotificationBadge'
import PathSuggestions from '@/components/PathSuggestions'

/** Country with intensity score: how many active filters match this country */
export interface ScoredCountry {
  code: string
  score: number // 0-1 normalized (matchCount / totalFilters)
  matchCount: number
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
  const [previewCountries, setPreviewCountries] = useState<string[]>([])
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
            // Add this country to enriched list
            setEnrichedCountries((prev) => [...prev, code])
            setEnrichedNames((prev) => ({ ...prev, [code]: name ?? code }))
            // Auto-enrich: discover all related dimensions for this country
            void enrichCountry(code, name ?? code)
          }
        }}
        selectedCountry={selectedCountry}
      />

      {/* Path Suggestions — identity-driven route discovery */}
      <PathSuggestions
        scoredCountries={scoredCountries}
        enrichedCountries={enrichedCountries}
        totalFilters={filters.filter((f) => f.countryCodes && f.countryCodes.length > 0).length}
        onSuggestClick={(code, name) => {
          if (!enrichedCountries.includes(code)) {
            setEnrichedCountries((prev) => [...prev, code])
            setEnrichedNames((prev) => ({ ...prev, [code]: name }))
            void enrichCountry(code, name)
          }
        }}
        onPreview={setPreviewCountries}
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
        onPreview={setPreviewCountries}
      />
    </main>
  )
}

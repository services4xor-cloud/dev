'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'
import DimensionFilters, { type ActiveFilter } from '@/components/DimensionFilters'
import NotificationBadge from '@/components/NotificationBadge'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

/** Max enrichment steps — oldest drops off when exceeded (ouroboros) */
const MAX_PATH_STEPS = 3

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
  matchCount: number // 0 = neighbor proximity only, 1+ = dimension matches
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

/** Max neighbor detection radius in km (~direct border distance for most countries) */
const NEIGHBOR_RADIUS_KM = 2500

export default function HomePage() {
  const { data: session } = useSession()
  // State — initialized empty to avoid SSR/client hydration mismatch.
  // SessionStorage is restored in a useEffect below.
  const [filters, setFilters] = useState<ActiveFilter[]>([])
  const [enrichedCountries, setEnrichedCountries] = useState<string[]>([])
  const [enrichedNames, setEnrichedNames] = useState<Record<string, string>>({})
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from sessionStorage after mount (client-only)
  useEffect(() => {
    try {
      const rawFilters = sessionStorage.getItem('bex-map-filters')
      if (rawFilters) setFilters(JSON.parse(rawFilters) as ActiveFilter[])
      const rawEnriched = sessionStorage.getItem('bex-map-enriched')
      if (rawEnriched) setEnrichedCountries(JSON.parse(rawEnriched) as string[])
      const rawNames = sessionStorage.getItem('bex-map-enriched-names')
      if (rawNames) setEnrichedNames(JSON.parse(rawNames) as Record<string, string>)
    } catch {
      // Corrupted storage — start fresh
    }
    setHydrated(true)
  }, [])
  const previewCountries: string[] = [] // preview disabled — keep prop for API compat
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // The "selected" country for the logo is the most recently enriched
  const selectedCountry =
    enrichedCountries.length > 0 ? enrichedCountries[enrichedCountries.length - 1] : null
  const selectedCountryName = selectedCountry
    ? (enrichedNames[selectedCountry] ?? selectedCountry)
    : null

  // Persist enriched countries + filters to sessionStorage (only after hydration)
  useEffect(() => {
    if (!hydrated) return
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
  }, [hydrated, enrichedCountries, enrichedNames, selectedCountry, selectedCountryName])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem('bex-map-filters', JSON.stringify(filters))
  }, [hydrated, filters])

  // Compute intensity scores from active filters — client-side, no API needed
  // Each filter has countryCodes[]. Count how many filters match each country.
  // Also adds subtle neighbor proximity glow for countries bordering enriched ones.
  const scoredCountries = useMemo(() => {
    const filtersWithCodes = filters.filter((f) => f.countryCodes && f.countryCodes.length > 0)

    const countMap = new Map<string, number>()
    for (const f of filtersWithCodes) {
      for (const code of f.countryCodes!) {
        countMap.set(code, (countMap.get(code) || 0) + 1)
      }
    }

    const total = filtersWithCodes.length || 1
    const scored = new Map<string, ScoredCountry>()
    for (const [code, matchCount] of Array.from(countMap.entries())) {
      scored.set(code, { code, score: matchCount / total, matchCount })
    }

    // Neighbor proximity: enriched countries cast a subtle glow on nearby countries
    if (enrichedCountries.length > 0) {
      const enrichedSet = new Set(enrichedCountries)
      const enrichedData = enrichedCountries
        .map((ec) => COUNTRY_OPTIONS.find((c) => c.code === ec))
        .filter(Boolean) as (typeof COUNTRY_OPTIONS)[number][]

      for (const c of COUNTRY_OPTIONS) {
        // Skip enriched countries themselves and countries already scored by dimensions
        if (enrichedSet.has(c.code) || scored.has(c.code)) continue

        // Find closest enriched country
        let minDist = Infinity
        for (const ec of enrichedData) {
          const d = haversineKm(c.lat, c.lng, ec.lat, ec.lng)
          if (d < minDist) minDist = d
        }

        if (minDist < NEIGHBOR_RADIUS_KM) {
          // Score fades linearly with distance: 0.12 at 0km → 0.02 at NEIGHBOR_RADIUS_KM
          const proximityScore = 0.02 + 0.1 * (1 - minDist / NEIGHBOR_RADIUS_KM)
          scored.set(c.code, { code: c.code, score: proximityScore, matchCount: 0 })
        }
      }
    }

    return Array.from(scored.values())
  }, [filters, enrichedCountries])

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
        enrichedCountries={enrichedCountries}
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
                className="flex items-center gap-1.5 text-sm text-brand-accent transition hover:text-brand-accent/80"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent/20 text-[10px] font-bold text-brand-accent">
                    {(session.user?.name ?? session.user?.email ?? '?')[0].toUpperCase()}
                  </span>
                )}
                {session.user?.name ?? session.user?.email?.split('@')[0] ?? 'Me'}
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
              className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent transition hover:bg-brand-accent/20"
            >
              Sign in
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
                href="/me"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm text-brand-accent transition"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent/20 text-[10px] font-bold text-brand-accent">
                    {(session.user?.name ?? session.user?.email ?? '?')[0].toUpperCase()}
                  </span>
                )}
                {session.user?.name ?? session.user?.email?.split('@')[0] ?? 'Me'}
              </Link>
              <Link
                href="/messages"
                onClick={() => setMenuOpen(false)}
                className="relative py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Messages
                <NotificationBadge count={unreadMessages} />
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
              className="py-2 text-sm text-brand-accent transition"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}

      <DimensionFilters
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onPreview={() => {}}
        enrichedCountries={enrichedCountries}
      />
    </main>
  )
}

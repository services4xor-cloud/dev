'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'
import DimensionFilters, { type ActiveFilter } from '@/components/DimensionFilters'
import NotificationBadge from '@/components/NotificationBadge'

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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem('bex-map-selected') || null
  })
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem('bex-map-selected-name') || null
  })
  const [previewCountries, setPreviewCountries] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // Persist selection + filters to sessionStorage
  useEffect(() => {
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
  }, [selectedCountry, selectedCountryName])

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

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <WorldMap
        scoredCountries={scoredCountries}
        previewCountryCodes={previewCountries}
        onCountryClick={(code, name) => {
          if (code === null) {
            setSelectedCountry(null)
            setSelectedCountryName(null)
          } else if (code === selectedCountry) {
            // Toggle off — remove this country from location filters
            setSelectedCountry(null)
            setSelectedCountryName(null)
            setFilters((prev) =>
              prev.filter((f) => !(f.dimension === 'location' && f.nodeCode === code.toLowerCase()))
            )
          } else {
            setSelectedCountry(code)
            setSelectedCountryName(name ?? code)
            // Add as location filter (keep existing location filters — multi-select!)
            const alreadyHas = filters.some(
              (f) => f.dimension === 'location' && f.nodeCode === code.toLowerCase()
            )
            if (!alreadyHas) {
              setFilters((prev) => [
                ...prev,
                {
                  dimension: 'location' as const,
                  nodeCode: code.toLowerCase(),
                  label: `${name ?? code}`,
                  icon: '📍',
                  countryCodes: [code],
                },
              ])
            }
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
          <span className="text-brand-accent">{selectedCountryName ?? 'X'}</span>
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
        onFilterChange={setFilters}
        onPreview={setPreviewCountries}
      />
    </main>
  )
}

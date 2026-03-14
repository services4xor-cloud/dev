'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'
import DimensionFilters from '@/components/DimensionFilters'
import NotificationBadge from '@/components/NotificationBadge'
import type { DimensionFilter, MapCountry } from '@/types/domain'

export default function HomePage() {
  const { data: session } = useSession()
  const [filters, setFilters] = useState<DimensionFilter[]>([])
  const [countries, setCountries] = useState<MapCountry[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // Fetch filtered countries when filters change
  const fetchFilteredCountries = useCallback(async (activeFilters: DimensionFilter[]) => {
    if (activeFilters.length === 0) {
      setCountries([])
      return
    }
    try {
      const res = await fetch('/api/map/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: activeFilters }),
      })
      const data = await res.json()
      setCountries(data.countries ?? [])
    } catch {
      setCountries([])
    }
  }, [])

  useEffect(() => {
    fetchFilteredCountries(filters)
  }, [filters, fetchFilteredCountries])

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
        countries={countries}
        onCountryClick={(code, name) => {
          if (code === null) {
            setSelectedCountry(null)
            setSelectedCountryName(null)
          } else if (code === selectedCountry) {
            setSelectedCountry(null)
            setSelectedCountryName(null)
          } else {
            setSelectedCountry(code)
            setSelectedCountryName(name ?? code)
          }
        }}
        selectedCountry={selectedCountry}
      />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3">
        <Link
          href={selectedCountry ? `/be/${selectedCountry.toLowerCase()}` : '/'}
          className={`text-xl font-bold transition ${selectedCountry ? 'logo-saiyan' : ''}`}
          onClick={(e) => {
            if (selectedCountry) {
              // Let the link navigate to the Gate page
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
          <Link
            href="/threads"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            Threads
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
              Sign in
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="absolute left-0 right-0 top-12 z-30 flex flex-col gap-1 bg-brand-surface/95 px-4 py-3 backdrop-blur sm:hidden">
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
          <Link
            href="/threads"
            onClick={() => setMenuOpen(false)}
            className="py-2 text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            Threads
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
              Sign in
            </Link>
          )}
        </nav>
      )}

      <DimensionFilters activeFilters={filters} onFilterChange={setFilters} />
    </main>
  )
}

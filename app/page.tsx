'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'
import DimensionFilters from '@/components/DimensionFilters'
import CountryPanel from '@/components/CountryPanel'
import type { DimensionFilter, MapCountry } from '@/types/domain'

export default function HomePage() {
  const { data: session } = useSession()
  const [filters, setFilters] = useState<DimensionFilter[]>([])
  const [countries, setCountries] = useState<MapCountry[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

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

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <WorldMap countries={countries} onCountryClick={setSelectedCountry} />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-brand-accent">Be[X]</h1>
        <nav className="flex items-center gap-3">
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
                className="text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Messages
              </Link>
              <Link
                href="/me"
                className="text-sm text-brand-text-muted hover:text-brand-accent transition"
              >
                Me
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

      <DimensionFilters activeFilters={filters} onFilterChange={setFilters} />

      <CountryPanel countryCode={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </main>
  )
}

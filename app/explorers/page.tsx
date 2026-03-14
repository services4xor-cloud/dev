'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ExplorerEdges {
  speaks: string[]
  worksIn: string[]
  locatedIn: string[]
  skills: string[]
}

interface Explorer {
  id: string
  name: string
  image: string | null
  country: string
  edges: ExplorerEdges
}

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-brand-accent font-semibold text-lg select-none">
      {initials || '?'}
    </div>
  )
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full border border-brand-accent/20 px-2 py-0.5 text-xs text-brand-text-muted">
      {label}
    </span>
  )
}

function ExplorerCard({ explorer }: { explorer: Explorer }) {
  const allBadges = [
    ...explorer.edges.speaks,
    ...explorer.edges.worksIn,
    ...explorer.edges.skills,
    ...explorer.edges.locatedIn,
  ].slice(0, 5)

  return (
    <Link
      href={`/explorers/${explorer.id}`}
      className="flex flex-col gap-3 rounded-xl border border-brand-accent/20 bg-brand-surface p-4 hover:border-brand-accent/40 transition"
    >
      <div className="flex items-center gap-3">
        {explorer.image ? (
          <Image
            src={explorer.image}
            alt={explorer.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <AvatarPlaceholder name={explorer.name} />
        )}
        <div className="min-w-0">
          <p className="font-semibold text-brand-text truncate">{explorer.name}</p>
          <p className="text-xs text-brand-text-muted">{explorer.country}</p>
        </div>
      </div>
      {allBadges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {allBadges.map((b) => (
            <Badge key={b} label={b} />
          ))}
        </div>
      )}
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-xl border border-brand-accent/10 bg-brand-surface"
        />
      ))}
    </div>
  )
}

export default function ExplorersPage() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('')
  const [sector, setSector] = useState('')
  const [country, setCountry] = useState('')
  const [explorers, setExplorers] = useState<Explorer[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchExplorers = useCallback(async (q: string, lang: string, sec: string, ctry: string) => {
    setLoading(true)
    setHasSearched(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (lang) params.set('language', lang)
      if (sec) params.set('sector', sec)
      if (ctry) params.set('country', ctry)
      const res = await fetch(`/api/explorers?${params.toString()}`)
      const data = await res.json()
      setExplorers(data.explorers ?? [])
    } catch {
      setExplorers([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce text input, immediate for dropdowns
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchExplorers(query, language, sector, country)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, language, sector, country, fetchExplorers])

  const hasFilters = query || language || sector || country

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-brand-accent/10 px-4 py-4 sm:px-6">
        <h1 className="text-xl font-bold text-brand-accent">Explorers</h1>
        <Link href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
          ← Back to Map
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Search + Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Text search */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            className="flex-1 rounded-lg border border-brand-accent/20 bg-brand-surface px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/50 transition"
          />

          {/* Language filter */}
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value.trim())}
            placeholder="Language code (e.g. sw)"
            className="w-full rounded-lg border border-brand-accent/20 bg-brand-surface px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/50 transition sm:w-44"
          />

          {/* Sector filter */}
          <input
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value.trim())}
            placeholder="Sector code"
            className="w-full rounded-lg border border-brand-accent/20 bg-brand-surface px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/50 transition sm:w-36"
          />

          {/* Country filter */}
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value.trim().toUpperCase().slice(0, 3))}
            placeholder="Country (e.g. KE)"
            className="w-full rounded-lg border border-brand-accent/20 bg-brand-surface px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/50 transition sm:w-36"
          />
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {query && (
              <span className="flex items-center gap-1 rounded-full border border-brand-accent/30 bg-brand-surface px-3 py-1 text-xs text-brand-accent">
                Name: {query}
                <button
                  onClick={() => setQuery('')}
                  className="ml-1 opacity-60 hover:opacity-100"
                  aria-label="Clear name filter"
                >
                  ×
                </button>
              </span>
            )}
            {language && (
              <span className="flex items-center gap-1 rounded-full border border-brand-accent/30 bg-brand-surface px-3 py-1 text-xs text-brand-accent">
                Language: {language}
                <button
                  onClick={() => setLanguage('')}
                  className="ml-1 opacity-60 hover:opacity-100"
                  aria-label="Clear language filter"
                >
                  ×
                </button>
              </span>
            )}
            {sector && (
              <span className="flex items-center gap-1 rounded-full border border-brand-accent/30 bg-brand-surface px-3 py-1 text-xs text-brand-accent">
                Sector: {sector}
                <button
                  onClick={() => setSector('')}
                  className="ml-1 opacity-60 hover:opacity-100"
                  aria-label="Clear sector filter"
                >
                  ×
                </button>
              </span>
            )}
            {country && (
              <span className="flex items-center gap-1 rounded-full border border-brand-accent/30 bg-brand-surface px-3 py-1 text-xs text-brand-accent">
                Country: {country}
                <button
                  onClick={() => setCountry('')}
                  className="ml-1 opacity-60 hover:opacity-100"
                  aria-label="Clear country filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <LoadingGrid />
        ) : hasSearched && explorers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-brand-text">No Explorers found</p>
            <p className="mt-1 text-sm text-brand-text-muted">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : explorers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {explorers.map((e) => (
              <ExplorerCard key={e.id} explorer={e} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-brand-text-muted">
              Search by name or apply filters to discover Explorers.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

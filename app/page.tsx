'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'
import DimensionFilters, { type ActiveFilter } from '@/components/DimensionFilters'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

/** Max enrichment steps — oldest drops off when exceeded (ouroboros) */
const MAX_PATH_STEPS = 5

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

/** Dimension priority for determining dominant color */
const DIM_PRIORITY = ['language', 'sector', 'currency', 'faith']

/** Dimension-specific chip colors matching the map's HSL hue system */
const DIM_CHIP_COLORS: Record<
  string,
  { base: string; x2: string; x3: string; x4: string; x5: string }
> = {
  language: {
    base: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    x2: 'bg-teal-500/25 text-teal-200 border-teal-400/40 shadow-[0_0_6px_rgba(45,212,191,0.25)]',
    x3: 'bg-teal-500/35 text-teal-200 border-teal-300/55 shadow-[0_0_10px_rgba(45,212,191,0.35)]',
    x4: 'bg-teal-500/45 text-teal-100 border-teal-300/65 shadow-[0_0_14px_rgba(45,212,191,0.45)]',
    x5: 'bg-teal-500/55 text-teal-100 border-teal-200/75 shadow-[0_0_20px_rgba(45,212,191,0.55)] font-semibold',
  },
  sector: {
    base: 'bg-lime-500/20 text-lime-300 border-lime-400/30',
    x2: 'bg-lime-500/25 text-lime-200 border-lime-400/40 shadow-[0_0_6px_rgba(132,204,22,0.25)]',
    x3: 'bg-lime-500/35 text-lime-200 border-lime-300/55 shadow-[0_0_10px_rgba(132,204,22,0.35)]',
    x4: 'bg-lime-500/45 text-lime-100 border-lime-300/65 shadow-[0_0_14px_rgba(132,204,22,0.45)]',
    x5: 'bg-lime-500/55 text-lime-100 border-lime-200/75 shadow-[0_0_20px_rgba(132,204,22,0.55)] font-semibold',
  },
  faith: {
    base: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
    x2: 'bg-violet-500/25 text-violet-200 border-violet-400/40 shadow-[0_0_6px_rgba(139,92,246,0.25)]',
    x3: 'bg-violet-500/35 text-violet-200 border-violet-300/55 shadow-[0_0_10px_rgba(139,92,246,0.35)]',
    x4: 'bg-violet-500/45 text-violet-100 border-violet-300/65 shadow-[0_0_14px_rgba(139,92,246,0.45)]',
    x5: 'bg-violet-500/55 text-violet-100 border-violet-200/75 shadow-[0_0_20px_rgba(139,92,246,0.55)] font-semibold',
  },
  currency: {
    base: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    x2: 'bg-rose-500/25 text-rose-200 border-rose-400/40 shadow-[0_0_6px_rgba(244,63,94,0.25)]',
    x3: 'bg-rose-500/35 text-rose-200 border-rose-300/55 shadow-[0_0_10px_rgba(244,63,94,0.35)]',
    x4: 'bg-rose-500/45 text-rose-100 border-rose-300/65 shadow-[0_0_14px_rgba(244,63,94,0.45)]',
    x5: 'bg-rose-500/55 text-rose-100 border-rose-200/75 shadow-[0_0_20px_rgba(244,63,94,0.55)] font-semibold',
  },
}

function chipStyle(dimension: string, multiplier: number): string {
  const colors = DIM_CHIP_COLORS[dimension]
  if (!colors) return 'bg-white/10 text-white/60 border-white/20'
  if (multiplier >= 5) return colors.x5
  if (multiplier >= 4) return colors.x4
  if (multiplier >= 3) return colors.x3
  if (multiplier >= 2) return colors.x2
  return colors.base
}

/** Ranked dimension slot: dim name + top value for color derivation */
interface DimSlot {
  dim: string
  value: string
}

/** Country with intensity score: ranked dimensions for multi-ring border coloring */
export interface ScoredCountry {
  code: string
  score: number
  matchCount: number
  dimensions: string[] // which dimension types match
  /** Ranked dimension slots: [0]=fill, [1]=outer ring, [2]=inner ring, [3]=thinnest */
  ranked: DimSlot[]
  depth: number // unique dimension count 1-4 (determines intensity)
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

  // ─── OVERLAP CHIPS: dimension values shared across ×2–×5 countries ──────────
  const mapOverlaps = useMemo(() => {
    const keyToSources = new Map<string, { filter: ActiveFilter; sources: Set<string> }>()
    for (const f of filters) {
      const key = `${f.dimension}:${f.nodeCode}`
      const entry = keyToSources.get(key) ?? { filter: f, sources: new Set<string>() }
      entry.sources.add(f.source ?? 'custom')
      keyToSources.set(key, entry)
    }
    const result: {
      dimension: string
      nodeCode: string
      label: string
      icon: string
      multiplier: number
      countryCodes: string[]
    }[] = []
    for (const [, entry] of Array.from(keyToSources.entries())) {
      if (entry.sources.size >= 2) {
        result.push({
          dimension: entry.filter.dimension,
          nodeCode: entry.filter.nodeCode,
          label: entry.filter.label ?? entry.filter.nodeCode,
          icon: entry.filter.icon ?? '◆',
          multiplier: Math.min(entry.sources.size, 5),
          countryCodes: entry.filter.countryCodes ?? [],
        })
      }
    }
    result.sort((a, b) => b.multiplier - a.multiplier)
    return result
  }, [filters])

  // Compute intensity scores — tracks WHICH dimensions match for color blending.
  // Also adds subtle neighbor proximity glow for countries bordering enriched ones.
  const scoredCountries = useMemo(() => {
    const filtersWithCodes = filters.filter((f) => f.countryCodes && f.countryCodes.length > 0)

    // Track per-dimension counts and values for dominant-dimension coloring
    const countMap = new Map<
      string,
      {
        count: number
        dims: Set<string>
        dimCounts: Record<string, number>
        dimValues: Record<string, Record<string, number>>
      }
    >()
    for (const f of filtersWithCodes) {
      for (const code of f.countryCodes!) {
        const entry = countMap.get(code) ?? {
          count: 0,
          dims: new Set(),
          dimCounts: {},
          dimValues: {},
        }
        entry.count++
        entry.dims.add(f.dimension)
        entry.dimCounts[f.dimension] = (entry.dimCounts[f.dimension] || 0) + 1
        if (!entry.dimValues[f.dimension]) entry.dimValues[f.dimension] = {}
        entry.dimValues[f.dimension][f.nodeCode] =
          (entry.dimValues[f.dimension][f.nodeCode] || 0) + 1
        countMap.set(code, entry)
      }
    }

    const scored = new Map<string, ScoredCountry>()
    for (const [code, entry] of Array.from(countMap.entries())) {
      // Rank dimensions by hit count (priority order breaks ties)
      const ranked: { dim: string; count: number; topValue: string }[] = []
      for (const dim of DIM_PRIORITY) {
        const c = entry.dimCounts[dim] || 0
        if (c > 0) {
          const values = entry.dimValues[dim] || {}
          let topVal = ''
          let topValCount = 0
          for (const [v, vc] of Object.entries(values)) {
            if (vc > topValCount) {
              topValCount = vc
              topVal = v
            }
          }
          ranked.push({ dim, count: c, topValue: topVal })
        }
      }
      ranked.sort((a, b) => b.count - a.count)

      // Build ranked slots — pad to 4 with fallback to first
      const slots: DimSlot[] = ranked.map((r) => ({ dim: r.dim, value: r.topValue }))
      const fallback: DimSlot = slots[0] ?? { dim: '', value: '' }
      while (slots.length < 4) slots.push(fallback)

      scored.set(code, {
        code,
        score: entry.dims.size / 4,
        matchCount: entry.count,
        dimensions: Array.from(entry.dims),
        ranked: slots,
        depth: entry.dims.size,
      })
    }

    // Neighbor proximity: enriched countries cast a subtle glow on nearby countries
    if (enrichedCountries.length > 0) {
      const enrichedSet = new Set(enrichedCountries)
      const enrichedData = enrichedCountries
        .map((ec) => COUNTRY_OPTIONS.find((c) => c.code === ec))
        .filter(Boolean) as (typeof COUNTRY_OPTIONS)[number][]

      for (const c of COUNTRY_OPTIONS) {
        if (enrichedSet.has(c.code) || scored.has(c.code)) continue

        let minDist = Infinity
        for (const ec of enrichedData) {
          // Quick lat-only pre-check: 1° lat ≈ 111 km, skip if too far
          if (Math.abs(c.lat - ec.lat) * 111 > NEIGHBOR_RADIUS_KM) continue
          const d = haversineKm(c.lat, c.lng, ec.lat, ec.lng)
          if (d < minDist) minDist = d
          if (minDist < NEIGHBOR_RADIUS_KM) break // already qualifies
        }

        if (minDist < NEIGHBOR_RADIUS_KM) {
          const proximityScore = 0.02 + 0.1 * (1 - minDist / NEIGHBOR_RADIUS_KM)
          const empty: DimSlot = { dim: '', value: '' }
          scored.set(c.code, {
            code: c.code,
            score: proximityScore,
            matchCount: 0,
            dimensions: [],
            ranked: [empty, empty, empty, empty],
            depth: 0,
          })
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
      // Fallback: just add language filter for the country
      setFilters((prev) => {
        const withoutThisCountry = prev.filter((f) => f.source !== code)
        return [
          ...withoutThisCountry,
          {
            dimension: 'language' as const,
            nodeCode: code.toLowerCase(),
            label: name,
            icon: '🗣️',
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

      {/* ═══ MAP OVERLAY — ×2–×5 overlap chips ═══ */}
      {mapOverlaps.length > 0 && (
        <div className="absolute left-4 top-14 z-20 flex flex-col gap-1.5 max-w-[260px]">
          {mapOverlaps.map((m) => (
            <span
              key={`${m.dimension}:${m.nodeCode}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs backdrop-blur-sm transition-all ${chipStyle(m.dimension, m.multiplier)}`}
            >
              <span>{m.icon}</span>
              <span className="truncate">{m.label}</span>
              <span className="rounded-full bg-white/15 px-1.5 text-[10px] font-bold">
                ×{m.multiplier}
              </span>
            </span>
          ))}
        </div>
      )}

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
              ? enrichedCountries.join('→')
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
            <Link
              href="/profile"
              className="text-sm text-brand-accent hover:text-brand-accent/80 transition"
            >
              {session.user?.name ?? session.user?.email?.split('@')[0] ?? 'Pioneer'}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent transition hover:bg-brand-accent/20"
            >
              Sign Up
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
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm text-brand-accent hover:text-brand-accent/80 transition"
            >
              {session.user?.name ?? session.user?.email?.split('@')[0] ?? 'Pioneer'}
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm text-brand-accent transition"
            >
              Sign Up
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

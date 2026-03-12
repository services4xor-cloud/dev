'use client'

/**
 * usePaths — Bolt-style path ranking by identity context
 *
 * NOT a job board browser. This works like a ride-hailing app:
 *   1. Your identity (country/language) determines what you see FIRST
 *   2. Corridor partners come next (where demand + money flow)
 *   3. Remote paths always show (global access)
 *   4. Everything else fills in — never empty
 *
 * When DB is live, fetches from /api/paths. Falls back to mock data.
 * Ranking happens client-side using COUNTRY_OPTIONS corridor data.
 */

import { useState, useEffect, useMemo } from 'react'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { useIdentity } from '@/lib/identity-context'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { SECTOR_META } from '@/lib/sectors'
import type { PathListItem } from '@/types/domain'

/** Format salary range: "KES 80,000 – 140,000/mo" */
function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return 'Competitive'
  const fmt = (n: number) => n.toLocaleString()
  if (min && max) return `${currency} ${fmt(min)} – ${fmt(max)}/mo`
  if (min) return `From ${currency} ${fmt(min)}/mo`
  return `Up to ${currency} ${fmt(max!)}/mo`
}

/** "2h ago", "3d ago", "1w ago" from ISO date string */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ─── DB response type (what /api/paths returns) ──────────────────────────────

interface DBPath {
  id: string
  title: string
  company: string
  location: string
  country: string
  sector: string | null
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  skills: string[]
  status: string
  tier: string
  pathType: string
  isRemote: boolean
  description: string
  createdAt: string
  expiresAt: string
  anchorId: string
  anchorName?: string
  _count?: { chapters: number }
}

/** Transform DB path → UI PathListItem */
function mapDBPath(p: DBPath): PathListItem {
  const sector = (p.sector ?? 'tech').toLowerCase()
  const meta = SECTOR_META[sector] ?? { icon: '🔹', category: 'professional' }

  return {
    id: p.id,
    title: p.title,
    anchorName: p.anchorName ?? p.company,
    location: p.location,
    country: p.country,
    category: meta.category as PathListItem['category'],
    salary: formatSalary(p.salaryMin, p.salaryMax, p.currency),
    posted: timeAgo(p.createdAt),
    icon: meta.icon,
    tags: p.skills.slice(0, 5),
    isRemote: p.isRemote,
    isFeatured: p.tier === 'PREMIUM' || p.tier === 'FEATURED',
    pioneersNeeded: p._count?.chapters ? undefined : 1,
  }
}

// ─── Ranking Engine ─────────────────────────────────────────────────────────

/** Get corridor countries for a given country code */
function getCorridorCountries(countryCode: string, lang: string): string[] {
  const corridors = new Set<string>()

  // Same-language countries are corridor partners
  const langEntry = LANGUAGE_REGISTRY[lang as LanguageCode]
  if (langEntry) {
    langEntry.countries.forEach((c) => {
      if (c !== countryCode) corridors.add(c)
    })
  }

  // Same-region countries
  const myCountry = COUNTRY_OPTIONS.find((c) => c.code === countryCode)
  if (myCountry) {
    COUNTRY_OPTIONS.forEach((c) => {
      if (c.code !== countryCode && c.region === myCountry.region) {
        corridors.add(c.code)
      }
    })
  }

  // Direct corridor partners (high corridor strength)
  COUNTRY_OPTIONS.forEach((c) => {
    if (c.code !== countryCode && c.corridorStrength === 'direct') {
      corridors.add(c.code)
    }
  })

  return Array.from(corridors)
}

/**
 * Rank paths by relevance to identity — Bolt-style.
 *
 * Scoring:
 *   +100  Your country (local demand — what's HERE)
 *   +60   Corridor partner (where money flows TO/FROM you)
 *   +40   Remote/global (accessible from anywhere)
 *   +20   Same region (nearby opportunity)
 *   +10   Featured (anchor paid for visibility)
 *   +5    Has pioneersNeeded (active demand signal)
 */
function rankPaths(paths: PathListItem[], countryCode: string, language: string): PathListItem[] {
  const corridorCodes = getCorridorCountries(countryCode, language)
  const myCountry = COUNTRY_OPTIONS.find((c) => c.code === countryCode)
  const myRegion = myCountry?.region

  const scored = paths.map((path) => {
    let score = 0
    const pc = path.country?.toUpperCase()

    // Local paths — highest priority
    if (pc === countryCode) score += 100
    // Corridor partners — second priority
    else if (pc && corridorCodes.includes(pc)) score += 60

    // Remote — accessible from anywhere
    if (path.isRemote) score += 40

    // Same region — nearby opportunity
    if (pc && myRegion) {
      const pathCountry = COUNTRY_OPTIONS.find((c) => c.code === pc)
      if (pathCountry?.region === myRegion) score += 20
    }

    // Demand signals
    if (path.isFeatured) score += 10
    if (path.pioneersNeeded && path.pioneersNeeded > 1) score += 5

    return { path, score }
  })

  // Sort by score descending, then by featured, then by posted recency
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.path.isFeatured !== b.path.isFeatured) return a.path.isFeatured ? -1 : 1
    return 0
  })

  return scored.map((s) => s.path)
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UsePathsOptions {
  country?: string
  sector?: string
  q?: string
  limit?: number
}

interface UsePathsResult {
  paths: PathListItem[]
  total: number
  loading: boolean
  fromDB: boolean
  /** How many paths are from the user's own country */
  localCount: number
  /** How many paths are from corridor partners */
  corridorCount: number
}

export function usePaths(options: UsePathsOptions = {}): UsePathsResult {
  const { identity } = useIdentity()
  const [rawPaths, setRawPaths] = useState<PathListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fromDB, setFromDB] = useState(false)

  const effectiveCountry = identity.country

  useEffect(() => {
    let cancelled = false

    async function fetchPaths() {
      try {
        const params = new URLSearchParams()
        // Don't filter by country on server — we want ALL paths, then rank client-side
        if (options.sector) params.set('sector', options.sector)
        if (options.q) params.set('q', options.q)
        if (options.limit) params.set('limit', String(options.limit))

        const qs = params.toString()
        const res = await fetch(`/api/paths${qs ? `?${qs}` : ''}`)

        if (!res.ok) throw new Error(`API ${res.status}`)

        const data = await res.json()
        if (!cancelled) {
          setRawPaths(data.paths.map(mapDBPath))
          setTotal(data.total)
          setFromDB(true)
          setLoading(false)
        }
      } catch {
        // Graceful fallback to mock data
        if (!cancelled) {
          let mock = [...MOCK_VENTURE_PATHS]
          if (options.q) {
            const q = options.q.toLowerCase()
            mock = mock.filter(
              (p) => p.title.toLowerCase().includes(q) || p.anchorName.toLowerCase().includes(q)
            )
          }
          setRawPaths(mock)
          setTotal(mock.length)
          setFromDB(false)
          setLoading(false)
        }
      }
    }

    fetchPaths()
    return () => {
      cancelled = true
    }
  }, [options.sector, options.q, options.limit])

  // Rank paths by identity context — recalculates when identity or raw data changes
  const paths = useMemo(
    () => rankPaths(rawPaths, effectiveCountry, identity.language),
    [rawPaths, effectiveCountry, identity.language]
  )

  // Count local and corridor paths for UI display
  const corridorCodes = useMemo(
    () => getCorridorCountries(effectiveCountry, identity.language),
    [effectiveCountry, identity.language]
  )
  const localCount = paths.filter((p) => p.country === effectiveCountry).length
  const corridorCount = paths.filter(
    (p) => p.country && corridorCodes.includes(p.country) && p.country !== effectiveCountry
  ).length

  return { paths, total, loading, fromDB, localCount, corridorCount }
}

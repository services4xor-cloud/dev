'use client'

/**
 * usePaths — Client-side hook for fetching paths from API
 *
 * Transforms DB paths into UI-ready format with formatted salary,
 * time-ago strings, sector→icon mapping, and category inference.
 * Falls back to MOCK_VENTURE_PATHS when API is unavailable.
 */

import { useState, useEffect } from 'react'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { useIdentity } from '@/lib/identity-context'
import type { PathListItem } from '@/types/domain'

// ─── Sector → Icon + Category mapping ────────────────────────────────────────

const SECTOR_META: Record<string, { icon: string; category: string }> = {
  tech: { icon: '💻', category: 'professional' },
  safari: { icon: '🦁', category: 'explorer' },
  healthcare: { icon: '🏥', category: 'professional' },
  finance: { icon: '💰', category: 'professional' },
  education: { icon: '📚', category: 'community' },
  agriculture: { icon: '🌾', category: 'community' },
  engineering: { icon: '⚙️', category: 'professional' },
  hospitality: { icon: '🏨', category: 'explorer' },
  pharma: { icon: '💊', category: 'professional' },
  marine: { icon: '🐠', category: 'explorer' },
  energy: { icon: '⚡', category: 'professional' },
  media: { icon: '🎬', category: 'creative' },
  arts: { icon: '🎨', category: 'creative' },
  transport: { icon: '🚄', category: 'professional' },
  telecom: { icon: '📡', category: 'professional' },
  banking: { icon: '🏦', category: 'professional' },
  conservation: { icon: '🌿', category: 'explorer' },
}

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
}

export function usePaths(options: UsePathsOptions = {}): UsePathsResult {
  const { identity } = useIdentity()
  const [paths, setPaths] = useState<PathListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fromDB, setFromDB] = useState(false)

  // Use identity context country if no explicit country filter provided
  const effectiveCountry = options.country ?? identity.country

  useEffect(() => {
    let cancelled = false

    async function fetchPaths() {
      try {
        const params = new URLSearchParams()
        if (effectiveCountry) params.set('country', effectiveCountry)
        if (options.sector) params.set('sector', options.sector)
        if (options.q) params.set('q', options.q)
        if (options.limit) params.set('limit', String(options.limit))

        const qs = params.toString()
        const res = await fetch(`/api/paths${qs ? `?${qs}` : ''}`)

        if (!res.ok) throw new Error(`API ${res.status}`)

        const data = await res.json()
        if (!cancelled) {
          setPaths(data.paths.map(mapDBPath))
          setTotal(data.total)
          setFromDB(true)
          setLoading(false)
        }
      } catch {
        // Graceful fallback to mock data
        if (!cancelled) {
          let mock = [...MOCK_VENTURE_PATHS]
          if (options.country) {
            // Mock data doesn't have country field reliably, show all
          }
          if (options.q) {
            const q = options.q.toLowerCase()
            mock = mock.filter(
              (p) => p.title.toLowerCase().includes(q) || p.anchorName.toLowerCase().includes(q)
            )
          }
          setPaths(mock)
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
  }, [effectiveCountry, options.country, options.sector, options.q, options.limit])

  return { paths, total, loading, fromDB }
}

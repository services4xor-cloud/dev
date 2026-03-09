import { NextRequest, NextResponse } from 'next/server'
import { COUNTRIES, CountryCode } from '@/lib/countries'
import { MOCK_PATHS, rankPathsForPioneer, PioneerProfile, PathOpportunity } from '@/lib/matching'
import { SAFARI_PACKAGES, SafariPackage } from '@/lib/safari-packages'
import type { PioneerType } from '@/lib/vocabulary'

// ─── Result types ─────────────────────────────────────────────────────────────

export interface PathResult {
  kind: 'path'
  id: string
  title: string
  anchorName: string
  category: string
  location: string
  remoteOk: boolean
  pioneerTypes: PioneerType[]
  score: number
  recommendationLabel: string
  reasons: string[]
}

export interface ExperienceResult {
  kind: 'experience'
  id: string
  name: string
  provider: string
  type: string
  duration: string
  destination: string
  price: string
  score: number
}

type SearchResult = PathResult | ExperienceResult

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalise(s: string): string {
  return s.toLowerCase().trim()
}

/** Score a SafariPackage against a query string (0–100) */
function scorePackage(pkg: SafariPackage, query: string): number {
  const q = normalise(query)
  if (!q) return 50 // no query = neutral

  const fields = [
    pkg.name,
    pkg.provider,
    pkg.destination,
    pkg.type.replace('_', ' '),
    ...pkg.highlights,
  ].map(normalise)

  let score = 0

  for (const field of fields) {
    if (field.includes(q)) {
      score += 25
    } else {
      // Check word-level overlap
      const queryWords = q.split(/\s+/)
      const fieldWords = field.split(/\s+/)
      const overlapping = queryWords.filter(w => fieldWords.some(fw => fw.includes(w) || w.includes(fw)))
      score += overlapping.length * 8
    }
  }

  return Math.min(100, score)
}

/** Score a PathOpportunity against a plain text query (0–50, supplement to match engine) */
function scorePathTextMatch(path: PathOpportunity, query: string): number {
  if (!query.trim()) return 0
  const q = normalise(query)

  const fields = [
    path.title,
    path.anchorName,
    path.category,
    path.location,
    ...path.requiredSkills,
  ].map(normalise)

  let bonus = 0
  for (const field of fields) {
    if (field.includes(q)) {
      bonus += 10
    } else {
      const queryWords = q.split(/\s+/)
      const fieldWords = field.split(/\s+/)
      const overlapping = queryWords.filter(w =>
        fieldWords.some(fw => fw.includes(w) || w.includes(fw))
      )
      bonus += overlapping.length * 3
    }
  }

  return Math.min(50, bonus)
}

/** Generate related search suggestions from country popular searches */
function buildSuggestions(query: string, from: string): string[] {
  const fromCode = from.toUpperCase() as CountryCode
  const baseSearches = COUNTRIES[fromCode]?.popularSearches ?? COUNTRIES.KE.popularSearches

  if (!query.trim()) return baseSearches.slice(0, 6)

  const q = normalise(query)

  // Filter searches that partially match query
  const related = baseSearches.filter(s => {
    const norm = normalise(s)
    return norm.includes(q) || q.split(' ').some(w => norm.includes(w))
  })

  // Fill up to 6 from base if not enough
  const extras = baseSearches.filter(s => !related.includes(s))
  return [...related, ...extras].slice(0, 6)
}

/** Format package price as a readable string */
function packagePriceLabel(pkg: SafariPackage): string {
  if (pkg.priceEUR) return `€${pkg.priceEUR.toLocaleString('en-US')}`
  if (pkg.priceUSD) return `$${pkg.priceUSD.toLocaleString('en-US')}`
  if (pkg.priceKES) return `KES ${pkg.priceKES.toLocaleString('en-US')}`
  return 'Price on request'
}

// ─── GET /api/search ──────────────────────────────────────────────────────────
// ?q=safari&from=KE&to=DE&type=explorer&limit=20

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const query = searchParams.get('q') ?? ''
  const from = searchParams.get('from')?.toUpperCase() ?? 'KE'
  const to = searchParams.get('to')?.toUpperCase() ?? ''
  const typeParam = searchParams.get('type') as PioneerType | null
  const limitParam = parseInt(searchParams.get('limit') ?? '20', 10)
  const limit = Math.min(Math.max(1, limitParam), 100)

  // ── 1. Score Paths ──────────────────────────────────────────────────────────

  let pathResults: PathResult[]

  if (typeParam || to) {
    // Pioneer profile present — use full matching engine
    const profile: PioneerProfile = {
      pioneerType: typeParam ?? 'professional',
      fromCountry: from,
      toCountries: to ? [to] : [],
      skills: query
        ? query.split(/[,\s]+/).filter(w => w.length > 2)
        : [],
      headline: query,
      yearsExperience: undefined,
    }

    const ranked = rankPathsForPioneer(profile, MOCK_PATHS)

    pathResults = ranked.map(result => {
      const path = MOCK_PATHS.find(p => p.id === result.pathId)!
      const textBonus = scorePathTextMatch(path, query)
      const finalScore = Math.min(100, result.score + textBonus)

      return {
        kind: 'path' as const,
        id: path.id,
        title: path.title,
        anchorName: path.anchorName,
        category: path.category,
        location: path.location,
        remoteOk: path.remoteOk,
        pioneerTypes: path.pioneerTypes,
        score: finalScore,
        recommendationLabel: result.recommendationLabel,
        reasons: result.reasons,
      }
    })
  } else {
    // No pioneer profile — use text matching only
    pathResults = MOCK_PATHS.map(path => {
      const textScore = scorePathTextMatch(path, query)
      const baseScore = query ? textScore * 2 : 50

      return {
        kind: 'path' as const,
        id: path.id,
        title: path.title,
        anchorName: path.anchorName,
        category: path.category,
        location: path.location,
        remoteOk: path.remoteOk,
        pioneerTypes: path.pioneerTypes,
        score: Math.min(100, baseScore),
        recommendationLabel: 'Possible Match' as const,
        reasons: [],
      }
    }).sort((a, b) => b.score - a.score)
  }

  // ── 2. Score Safari Packages ────────────────────────────────────────────────

  const experienceResults: ExperienceResult[] = SAFARI_PACKAGES
    .filter(pkg => pkg.status === 'available')
    .map(pkg => ({
      kind: 'experience' as const,
      id: pkg.id,
      name: pkg.name,
      provider: pkg.provider,
      type: pkg.type,
      duration: pkg.duration,
      destination: pkg.destination,
      price: packagePriceLabel(pkg),
      score: scorePackage(pkg, query),
    }))
    .sort((a, b) => b.score - a.score)

  // ── 3. Merge and sort ───────────────────────────────────────────────────────

  const allResults: SearchResult[] = [
    ...pathResults,
    ...experienceResults,
  ].sort((a, b) => b.score - a.score)

  const paginated = allResults.slice(0, limit)

  // ── 4. Suggestions ──────────────────────────────────────────────────────────

  const suggestions = buildSuggestions(query, from)

  return NextResponse.json({
    results: paginated,
    total: allResults.length,
    query,
    suggestions,
  })
}

export const dynamic = 'force-dynamic'

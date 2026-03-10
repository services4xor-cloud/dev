/**
 * MATCHING ENGINE — BeNetwork's core algorithm
 *
 * Scores a Pioneer against a Path/Venture and ranks multiple Paths
 * for a given Pioneer profile.
 *
 * Scoring breakdown (total 100 points):
 *   Pioneer type match  → 40 pts
 *   Skills overlap      → 30 pts
 *   Country route match → 20 pts
 *   Experience level    → 10 pts
 */

import type { PioneerType } from './vocabulary'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PioneerProfile {
  pioneerType: PioneerType
  fromCountry: string // ISO 2-letter code e.g. 'KE', 'DE'
  toCountries: string[] // Desired destination codes
  skills: string[]
  headline: string
  yearsExperience?: number
}

export interface PathOpportunity {
  id: string
  title: string
  anchorName: string
  category: string
  location: string // Country name or code
  requiredSkills: string[]
  preferredCountries: string[] // Origin countries preferred by anchor
  remoteOk: boolean
  experienceYears?: number
  pioneerTypes: PioneerType[]
}

export interface MatchResult {
  pathId: string
  score: number // 0-100
  reasons: string[] // Human-readable positive signals
  gaps: string[] // Human-readable gaps/suggestions
  isDirectRoute: boolean
  routeStrength: 'direct' | 'partner' | 'emerging'
  recommendationLabel: 'Perfect Match' | 'Strong Match' | 'Good Match' | 'Possible Match'
}

// ─── Core Scoring Function ────────────────────────────────────────────────────

export function scorePioneerPath(pioneer: PioneerProfile, path: PathOpportunity): MatchResult {
  let score = 0
  const reasons: string[] = []
  const gaps: string[] = []

  // ── Pioneer Type Match (40 points max) ──────────────────────────────────────
  if (path.pioneerTypes.includes(pioneer.pioneerType)) {
    score += 40
    reasons.push(`Your ${pioneer.pioneerType} background is a perfect type match`)
  } else if (path.pioneerTypes.length > 0) {
    // Partial credit: adjacent types (e.g. creator ↔ artisan)
    const adjacentMap: Partial<Record<PioneerType, PioneerType[]>> = {
      creator: ['artisan', 'professional'],
      artisan: ['creator', 'explorer'],
      explorer: ['artisan', 'guardian'],
      guardian: ['explorer', 'professional'],
      professional: ['guardian', 'healer'],
      healer: ['professional', 'creator'],
    }
    const adjacent = adjacentMap[pioneer.pioneerType] ?? []
    const hasAdjacent = path.pioneerTypes.some((t) => adjacent.includes(t))
    if (hasAdjacent) {
      score += 20
      gaps.push(
        `This path is primarily for ${path.pioneerTypes.join('/')} Pioneers — your skills transfer well though`
      )
    } else {
      score += 10
      gaps.push(`This path is primarily for ${path.pioneerTypes.join('/')} Pioneers`)
    }
  } else {
    score += 15 // Open to all types
    reasons.push('This path is open to all Pioneer types')
  }

  // ── Skills Overlap (30 points max) ──────────────────────────────────────────
  const normalise = (s: string) => s.toLowerCase().trim()

  const matchingSkills = pioneer.skills.filter((s) =>
    path.requiredSkills.some(
      (rs) => normalise(rs).includes(normalise(s)) || normalise(s).includes(normalise(rs))
    )
  )

  const requiredCount = Math.max(path.requiredSkills.length, 1)
  const skillScore = Math.min(30, Math.round((matchingSkills.length / requiredCount) * 30))
  score += skillScore

  if (matchingSkills.length > 0) {
    const displayed = matchingSkills.slice(0, 3).join(', ')
    const extra = matchingSkills.length > 3 ? ` +${matchingSkills.length - 3} more` : ''
    reasons.push(`${matchingSkills.length} of your skills match: ${displayed}${extra}`)
  } else {
    gaps.push(`No direct skill overlap with the required skills for this path`)
  }

  const missingSkills = path.requiredSkills.filter(
    (rs) => !pioneer.skills.some((s) => normalise(s).includes(normalise(rs)))
  )
  if (missingSkills.length > 0) {
    gaps.push(`You could strengthen: ${missingSkills.slice(0, 2).join(', ')}`)
  }

  // ── Country / Route Match (20 points max) ───────────────────────────────────
  let routeStrength: MatchResult['routeStrength'] = 'emerging'
  let isDirectRoute = false

  // Normalise location to check against desired destinations
  const pathLocationNorm = normalise(path.location)
  const targetInDesiredCountries = pioneer.toCountries.some(
    (c) => pathLocationNorm.includes(normalise(c)) || normalise(c).includes(pathLocationNorm)
  )

  if (targetInDesiredCountries) {
    score += 20
    routeStrength = 'direct'
    isDirectRoute = true
    reasons.push('This is in one of your target destinations')
  } else if (path.remoteOk && pioneer.toCountries.length > 0) {
    // Remote roles are accessible from any desired country
    score += 15
    routeStrength = 'partner'
    reasons.push('This remote path is accessible from your target countries')
  } else if (
    path.preferredCountries.some((pc) => normalise(pc) === normalise(pioneer.fromCountry))
  ) {
    score += 15
    routeStrength = 'partner'
    reasons.push('Your origin country is preferred for this path')
  } else {
    score += 5
    gaps.push(`This path is not in your current target destinations`)
  }

  // ── Experience Match (10 points max) ────────────────────────────────────────
  if (pioneer.yearsExperience !== undefined && path.experienceYears !== undefined) {
    if (pioneer.yearsExperience >= path.experienceYears) {
      score += 10
      reasons.push(
        `Your ${pioneer.yearsExperience} year${pioneer.yearsExperience !== 1 ? 's' : ''} of experience qualifies you`
      )
    } else {
      score += 5
      gaps.push(`This path prefers ${path.experienceYears}+ years experience`)
    }
  } else if (!path.experienceYears || path.experienceYears === 0) {
    // Entry-level — no penalty
    score += 10
    reasons.push('No prior experience required — great entry point')
  }

  // ── Clamp score ──────────────────────────────────────────────────────────────
  score = Math.min(100, Math.max(0, score))

  // ── Recommendation label ─────────────────────────────────────────────────────
  const recommendationLabel: MatchResult['recommendationLabel'] =
    score >= 80
      ? 'Perfect Match'
      : score >= 60
        ? 'Strong Match'
        : score >= 40
          ? 'Good Match'
          : 'Possible Match'

  return {
    pathId: path.id,
    score,
    reasons,
    gaps,
    isDirectRoute,
    routeStrength,
    recommendationLabel,
  }
}

// ─── Rank Multiple Paths for a Pioneer ───────────────────────────────────────

export function rankPathsForPioneer(
  pioneer: PioneerProfile,
  paths: PathOpportunity[]
): MatchResult[] {
  return paths.map((path) => scorePioneerPath(pioneer, path)).sort((a, b) => b.score - a.score)
}

// ─── Filter Helpers ───────────────────────────────────────────────────────────

/** Return only paths that score at or above the given threshold */
export function filterByMinScore(results: MatchResult[], minScore: number): MatchResult[] {
  return results.filter((r) => r.score >= minScore)
}

/** Return only direct-route matches */
export function filterDirectRoutes(results: MatchResult[]): MatchResult[] {
  return results.filter((r) => r.isDirectRoute)
}

/** Return the top N results */
export function topN(results: MatchResult[], n: number): MatchResult[] {
  return results.slice(0, n)
}

// ─── Mock Paths — re-exported from canonical data source ─────────────────────

export { MOCK_MATCHING_PATHS as MOCK_PATHS } from '@/data/mock'

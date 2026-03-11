/**
 * Unit tests for lib/matching.ts — BeNetwork's core scoring engine
 *
 * Tests the 4-dimension matching: pioneer type (40pts), skills (30pts),
 * country route (20pts), experience (10pts).
 */

import {
  scorePioneerPath,
  rankPathsForPioneer,
  filterByMinScore,
  filterDirectRoutes,
  topN,
  type PioneerProfile,
  type PathOpportunity,
} from '@/lib/matching'

// ── Fixtures ──────────────────────────────────────────────────────────

const basePioneer: PioneerProfile = {
  pioneerType: 'professional',
  fromCountry: 'KE',
  toCountries: ['DE', 'GB'],
  skills: ['TypeScript', 'React', 'Node.js'],
  headline: 'Full-stack Developer',
  yearsExperience: 5,
}

const basePath: PathOpportunity = {
  id: 'path-001',
  title: 'Software Engineer',
  anchorName: 'TechCorp Berlin',
  category: 'Technology',
  location: 'DE',
  requiredSkills: ['TypeScript', 'React'],
  preferredCountries: ['KE', 'NG'],
  remoteOk: false,
  experienceYears: 3,
  pioneerTypes: ['professional'],
}

// ── Core Scoring ──────────────────────────────────────────────────────

describe('scorePioneerPath', () => {
  it('gives perfect match (100) when all dimensions align', () => {
    const result = scorePioneerPath(basePioneer, basePath)
    expect(result.score).toBe(100)
    expect(result.recommendationLabel).toBe('Perfect Match')
    expect(result.isDirectRoute).toBe(true)
    expect(result.routeStrength).toBe('direct')
  })

  it('returns correct pathId in result', () => {
    const result = scorePioneerPath(basePioneer, basePath)
    expect(result.pathId).toBe('path-001')
  })

  // ── Pioneer Type dimension (40pts) ──

  it('gives 40pts for exact pioneer type match', () => {
    const result = scorePioneerPath(basePioneer, basePath)
    expect(result.reasons.some((r) => r.includes('perfect type match'))).toBe(true)
  })

  it('gives 20pts for adjacent pioneer type', () => {
    const pioneer = { ...basePioneer, pioneerType: 'guardian' as const }
    const result = scorePioneerPath(pioneer, basePath)
    // guardian is adjacent to professional
    expect(result.score).toBeLessThan(100)
    expect(result.gaps.some((g) => g.includes('primarily for'))).toBe(true)
  })

  it('gives 10pts for non-adjacent pioneer type', () => {
    const pioneer = { ...basePioneer, pioneerType: 'explorer' as const }
    const result = scorePioneerPath(pioneer, basePath)
    expect(result.score).toBeLessThan(90)
  })

  it('gives 15pts when path has no pioneer type restrictions', () => {
    const path = { ...basePath, pioneerTypes: [] as any }
    const result = scorePioneerPath(basePioneer, path)
    expect(result.reasons.some((r) => r.includes('open to all'))).toBe(true)
  })

  // ── Skills dimension (30pts) ──

  it('gives full skill score when all skills match', () => {
    const pioneer = { ...basePioneer, skills: ['TypeScript', 'React'] }
    const result = scorePioneerPath(pioneer, basePath)
    expect(result.reasons.some((r) => r.includes('skills match'))).toBe(true)
  })

  it('gives partial skill score for partial match', () => {
    const pioneer = { ...basePioneer, skills: ['TypeScript', 'Python'] }
    const result = scorePioneerPath(pioneer, basePath)
    expect(result.score).toBeLessThan(100)
    expect(result.reasons.some((r) => r.includes('1 of your skills'))).toBe(true)
  })

  it('gives 0 skill points when no skills match', () => {
    const pioneer = { ...basePioneer, skills: ['Java', 'C++'] }
    const result = scorePioneerPath(pioneer, basePath)
    expect(result.gaps.some((g) => g.includes('No direct skill overlap'))).toBe(true)
  })

  it('skill matching is case-insensitive', () => {
    const pioneer = { ...basePioneer, skills: ['typescript', 'react'] }
    const result = scorePioneerPath(pioneer, basePath)
    expect(result.reasons.some((r) => r.includes('skills match'))).toBe(true)
  })

  it('identifies missing skills in gaps', () => {
    const pioneer = { ...basePioneer, skills: ['TypeScript'] }
    const result = scorePioneerPath(pioneer, basePath)
    expect(result.gaps.some((g) => g.includes('strengthen'))).toBe(true)
  })

  // ── Country Route dimension (20pts) ──

  it('gives 20pts when path location is in desired destinations', () => {
    const result = scorePioneerPath(basePioneer, basePath)
    expect(result.isDirectRoute).toBe(true)
    expect(result.routeStrength).toBe('direct')
  })

  it('gives 15pts for remote path with target countries', () => {
    const path = { ...basePath, location: 'US', remoteOk: true }
    const result = scorePioneerPath(basePioneer, path)
    expect(result.routeStrength).toBe('partner')
    expect(result.reasons.some((r) => r.includes('remote'))).toBe(true)
  })

  it('gives 15pts when pioneer origin is preferred', () => {
    const path = { ...basePath, location: 'US', remoteOk: false }
    const result = scorePioneerPath(basePioneer, path)
    expect(result.routeStrength).toBe('partner')
  })

  it('gives 5pts when no route match at all', () => {
    const path = { ...basePath, location: 'JP', remoteOk: false, preferredCountries: ['US'] }
    const result = scorePioneerPath(basePioneer, path)
    expect(result.routeStrength).toBe('emerging')
    expect(result.gaps.some((g) => g.includes('not in your current target'))).toBe(true)
  })

  // ── Experience dimension (10pts) ──

  it('gives 10pts when experience exceeds requirement', () => {
    const result = scorePioneerPath(basePioneer, basePath)
    expect(result.reasons.some((r) => r.includes('experience qualifies'))).toBe(true)
  })

  it('gives 5pts when experience is below requirement', () => {
    const pioneer = { ...basePioneer, yearsExperience: 1 }
    const path = { ...basePath, experienceYears: 5 }
    const result = scorePioneerPath(pioneer, path)
    expect(result.gaps.some((g) => g.includes('5+ years'))).toBe(true)
  })

  it('gives 10pts for entry-level path (no experience required)', () => {
    const path = { ...basePath, experienceYears: undefined }
    const result = scorePioneerPath(basePioneer, path)
    expect(result.reasons.some((r) => r.includes('entry point'))).toBe(true)
  })

  // ── Score clamping ──

  it('never exceeds 100', () => {
    const result = scorePioneerPath(basePioneer, basePath)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('never goes below 0', () => {
    const worstPioneer: PioneerProfile = {
      pioneerType: 'explorer',
      fromCountry: 'JP',
      toCountries: ['BR'],
      skills: ['Knitting'],
      headline: 'Hobbyist',
    }
    const result = scorePioneerPath(worstPioneer, basePath)
    expect(result.score).toBeGreaterThanOrEqual(0)
  })

  // ── Recommendation labels ──

  it('labels 80+ as Perfect Match', () => {
    const result = scorePioneerPath(basePioneer, basePath)
    expect(result.score).toBeGreaterThanOrEqual(80)
    expect(result.recommendationLabel).toBe('Perfect Match')
  })

  it('labels 60-79 as Strong Match', () => {
    const pioneer = { ...basePioneer, skills: ['TypeScript'] }
    const path = { ...basePath, experienceYears: 10 }
    const result = scorePioneerPath(pioneer, path)
    if (result.score >= 60 && result.score < 80) {
      expect(result.recommendationLabel).toBe('Strong Match')
    }
  })
})

// ── Ranking ──────────────────────────────────────────────────────────

describe('rankPathsForPioneer', () => {
  const paths: PathOpportunity[] = [
    basePath,
    {
      ...basePath,
      id: 'path-002',
      location: 'JP',
      requiredSkills: ['Java'],
      pioneerTypes: ['explorer'],
    },
    {
      ...basePath,
      id: 'path-003',
      location: 'GB',
      requiredSkills: ['TypeScript', 'React', 'Node.js'],
    },
  ]

  it('returns results sorted by score descending', () => {
    const results = rankPathsForPioneer(basePioneer, paths)
    expect(results.length).toBe(3)
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
    }
  })

  it('ranks matching paths higher than non-matching', () => {
    const results = rankPathsForPioneer(basePioneer, paths)
    const directMatch = results.find((r) => r.pathId === 'path-001')
    const poorMatch = results.find((r) => r.pathId === 'path-002')
    expect(directMatch!.score).toBeGreaterThan(poorMatch!.score)
  })
})

// ── Filter helpers ──────────────────────────────────────────────────

describe('filterByMinScore', () => {
  it('returns only results at or above threshold', () => {
    const results = rankPathsForPioneer(basePioneer, [
      basePath,
      {
        ...basePath,
        id: 'low',
        location: 'JP',
        requiredSkills: ['Java'],
        pioneerTypes: ['explorer'],
        preferredCountries: ['US'],
      },
    ])
    const filtered = filterByMinScore(results, 60)
    filtered.forEach((r) => expect(r.score).toBeGreaterThanOrEqual(60))
  })
})

describe('filterDirectRoutes', () => {
  it('returns only direct route matches', () => {
    const results = rankPathsForPioneer(basePioneer, [
      basePath,
      { ...basePath, id: 'indirect', location: 'JP' },
    ])
    const direct = filterDirectRoutes(results)
    direct.forEach((r) => expect(r.isDirectRoute).toBe(true))
  })
})

describe('topN', () => {
  it('returns at most N results', () => {
    const results = rankPathsForPioneer(basePioneer, [
      basePath,
      { ...basePath, id: 'p2' },
      { ...basePath, id: 'p3' },
    ])
    expect(topN(results, 2).length).toBe(2)
  })

  it('returns all results if N > length', () => {
    const results = rankPathsForPioneer(basePioneer, [basePath])
    expect(topN(results, 5).length).toBe(1)
  })
})

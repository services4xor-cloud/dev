/**
 * DIMENSION SCORING ENGINE — 8-dimension matching for the Human Exchange Network
 *
 * Scores two profiles across 8 dimensions:
 *   Language (0-20) + Market (0-20) + Craft (0-15) + Passion (0-15)
 *   + Location (0-10) + Faith (0-8) + Reach (0-7) + Culture (0-5)
 *   = 100 base + 10 human bonus = 110 max
 *
 * Key insight: COMPLEMENTARY craft scores higher than MIRROR craft.
 * Two people with different skills create more value together.
 */

import { getMarketScore, type MarketSignal } from './market-data'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DimensionProfile {
  country: string
  city?: string
  languages: string[]
  faith: string[]
  craft: string[]
  interests: string[] // Passion
  reach: string[]
  culture?: string
  isHuman: boolean
}

export interface DimensionScore {
  total: number // 0-110 (100 base + 10 human bonus)
  breakdown: {
    language: number // 0-20
    market: number // 0-20
    craft: number // 0-15
    passion: number // 0-15
    location: number // 0-10
    faith: number // 0-8
    reach: number // 0-7
    culture: number // 0-5
  }
  humanBonus: number // 0 or 10
  label: 'Perfect' | 'Strong' | 'Good' | 'Possible'
  highlights: string[] // Human-readable match reasons
}

// ─── Region Map ───────────────────────────────────────────────────────────────

const REGION_MAP: Record<string, string> = {
  // East Africa
  KE: 'East Africa',
  TZ: 'East Africa',
  UG: 'East Africa',
  RW: 'East Africa',
  ET: 'East Africa',
  // West Africa
  NG: 'West Africa',
  GH: 'West Africa',
  SN: 'West Africa',
  CI: 'West Africa',
  // Southern Africa
  ZA: 'Southern Africa',
  ZW: 'Southern Africa',
  MW: 'Southern Africa',
  MZ: 'Southern Africa',
  // North Africa
  EG: 'North Africa',
  MA: 'North Africa',
  TN: 'North Africa',
  // DACH
  DE: 'DACH',
  AT: 'DACH',
  CH: 'DACH',
  // British Isles
  GB: 'British Isles',
  IE: 'British Isles',
  // Nordics
  SE: 'Nordics',
  NO: 'Nordics',
  DK: 'Nordics',
  FI: 'Nordics',
  // North America
  US: 'North America',
  CA: 'North America',
  // Middle East
  AE: 'Middle East',
  SA: 'Middle East',
  QA: 'Middle East',
  // South Asia
  IN: 'South Asia',
  PK: 'South Asia',
  BD: 'South Asia',
  // East Asia
  CN: 'East Asia',
  JP: 'East Asia',
  KR: 'East Asia',
  // Southeast Asia
  SG: 'Southeast Asia',
  MY: 'Southeast Asia',
  PH: 'Southeast Asia',
  // Oceania
  AU: 'Oceania',
  NZ: 'Oceania',
}

// ─── Compatible Reach Pairs ──────────────────────────────────────────────────

const COMPATIBLE_PAIRS: [string, string][] = [
  ['can-travel', 'can-host'],
  ['can-invest', 'can-mentor'],
  ['can-relocate', 'can-host'],
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lower(s: string): string {
  return s.toLowerCase().trim()
}

function intersect(a: string[], b: string[]): string[] {
  const bSet = new Set(b.map(lower))
  return a.filter((item) => bSet.has(lower(item)))
}

function complement(mine: string[], theirs: string[]): string[] {
  const mySet = new Set(mine.map(lower))
  return theirs.filter((item) => !mySet.has(lower(item)))
}

// ─── Dimension Scorers ────────────────────────────────────────────────────────

function scoreLanguage(
  me: DimensionProfile,
  them: DimensionProfile
): { score: number; highlight: string | null } {
  const shared = intersect(me.languages, them.languages)
  if (shared.length === 0) return { score: 0, highlight: null }
  if (shared.length === 1) return { score: 10, highlight: `Shared language: ${shared[0]}` }
  return { score: 20, highlight: `${shared.length} shared languages: ${shared.join(', ')}` }
}

function scoreMarket(
  them: DimensionProfile,
  signals: MarketSignal[]
): { score: number; highlight: string | null } {
  const score = getMarketScore(
    { country: them.country, craft: them.craft, interests: them.interests },
    signals
  )
  if (score === 0) return { score: 0, highlight: null }
  return { score, highlight: `Market demand in ${them.country}: ${score}/20` }
}

function scoreCraft(
  me: DimensionProfile,
  them: DimensionProfile
): { score: number; highlight: string | null } {
  const shared = intersect(me.craft, them.craft)
  const complementary = complement(me.craft, them.craft)
  const score = Math.min(15, shared.length * 2 + complementary.length * 4)
  if (score === 0) return { score: 0, highlight: null }
  const parts: string[] = []
  if (shared.length > 0) parts.push(`${shared.length} shared craft${shared.length > 1 ? 's' : ''}`)
  if (complementary.length > 0)
    parts.push(`${complementary.length} complementary craft${complementary.length > 1 ? 's' : ''}`)
  return { score, highlight: `Craft match: ${parts.join(', ')}` }
}

function scorePassion(
  me: DimensionProfile,
  them: DimensionProfile
): { score: number; highlight: string | null } {
  const shared = intersect(me.interests, them.interests)
  if (shared.length === 0) return { score: 0, highlight: null }
  if (shared.length === 1) return { score: 5, highlight: `Shared interest: ${shared[0]}` }
  if (shared.length === 2)
    return { score: 10, highlight: `${shared.length} shared interests: ${shared.join(', ')}` }
  return {
    score: 15,
    highlight: `${shared.length} shared interests: ${shared.slice(0, 3).join(', ')}${shared.length > 3 ? '...' : ''}`,
  }
}

function scoreLocation(
  me: DimensionProfile,
  them: DimensionProfile
): { score: number; highlight: string | null } {
  if (me.country.toUpperCase() === them.country.toUpperCase()) {
    return { score: 10, highlight: `Same country: ${me.country}` }
  }
  const myRegion = REGION_MAP[me.country.toUpperCase()]
  const theirRegion = REGION_MAP[them.country.toUpperCase()]
  if (myRegion && theirRegion && myRegion === theirRegion) {
    return { score: 5, highlight: `Same region: ${myRegion}` }
  }
  return { score: 0, highlight: null }
}

function scoreFaith(
  me: DimensionProfile,
  them: DimensionProfile
): { score: number; highlight: string | null } {
  const faithOverlap = me.faith.filter((f) => them.faith.some((t) => lower(t) === lower(f)))
  if (faithOverlap.length > 0) {
    return { score: 8, highlight: `Shared faith: ${faithOverlap.join(', ')}` }
  }
  return { score: 0, highlight: null }
}

function scoreReach(
  me: DimensionProfile,
  them: DimensionProfile
): { score: number; highlight: string | null } {
  let pairScore = 0
  const matchedPairs: string[] = []

  for (const [a, b] of COMPATIBLE_PAIRS) {
    // Check both directions: me has a + them has b, OR me has b + them has a
    const meHasA = me.reach.some((r) => lower(r) === a)
    const meHasB = me.reach.some((r) => lower(r) === b)
    const themHasA = them.reach.some((r) => lower(r) === a)
    const themHasB = them.reach.some((r) => lower(r) === b)

    if ((meHasA && themHasB) || (meHasB && themHasA)) {
      pairScore += 4
      matchedPairs.push(`${a} + ${b}`)
    }
  }

  if (pairScore > 0) {
    const score = Math.min(7, pairScore)
    return { score, highlight: `Compatible reach: ${matchedPairs.join(', ')}` }
  }

  // Fallback: shared reach values (no compatible pair but some overlap)
  const sharedReach = intersect(me.reach, them.reach)
  if (sharedReach.length > 0) {
    return { score: 2, highlight: `Shared reach: ${sharedReach.join(', ')}` }
  }

  return { score: 0, highlight: null }
}

function scoreCulture(
  me: DimensionProfile,
  them: DimensionProfile
): { score: number; highlight: string | null } {
  if (me.culture && them.culture && lower(me.culture) === lower(them.culture)) {
    return { score: 5, highlight: `Shared culture: ${me.culture}` }
  }
  return { score: 0, highlight: null }
}

// ─── Main Scoring Function ───────────────────────────────────────────────────

export function scoreDimensions(
  me: DimensionProfile,
  them: DimensionProfile,
  marketSignals: MarketSignal[]
): DimensionScore {
  const language = scoreLanguage(me, them)
  const market = scoreMarket(them, marketSignals)
  const craft = scoreCraft(me, them)
  const passion = scorePassion(me, them)
  const location = scoreLocation(me, them)
  const faith = scoreFaith(me, them)
  const reach = scoreReach(me, them)
  const culture = scoreCulture(me, them)

  const humanBonus = me.isHuman && them.isHuman ? 10 : 0

  const breakdown = {
    language: language.score,
    market: market.score,
    craft: craft.score,
    passion: passion.score,
    location: location.score,
    faith: faith.score,
    reach: reach.score,
    culture: culture.score,
  }

  const baseTotal =
    breakdown.language +
    breakdown.market +
    breakdown.craft +
    breakdown.passion +
    breakdown.location +
    breakdown.faith +
    breakdown.reach +
    breakdown.culture

  const total = baseTotal + humanBonus

  // Build highlights
  const highlights: string[] = []
  for (const dim of [language, market, craft, passion, location, faith, reach, culture]) {
    if (dim.highlight) highlights.push(dim.highlight)
  }
  if (humanBonus > 0) highlights.push('Human-to-human connection bonus')

  // Label
  const label: DimensionScore['label'] =
    total >= 80 ? 'Perfect' : total >= 60 ? 'Strong' : total >= 40 ? 'Good' : 'Possible'

  return {
    total,
    breakdown,
    humanBonus,
    label,
    highlights,
  }
}

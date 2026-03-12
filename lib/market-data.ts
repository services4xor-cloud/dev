/**
 * Market Data — Platform-computed demand signals
 *
 * Computes a market relevance score based on real-world demand
 * for a Pioneer's combination of skills, location, and languages.
 * Score range: 0–20.
 */

interface MarketSignal {
  dimension: string
  label: string
  score: number
  maxScore: number
}

interface MarketScore {
  total: number
  maxTotal: number
  signals: MarketSignal[]
}

/**
 * Get demand signals for a region based on identity dimensions.
 * In production this would call an API; for now returns mock signals.
 */
export function getSignalsForRegion(country: string): MarketSignal[] {
  // Mock signals — country-aware baseline
  const baseSignals: MarketSignal[] = [
    { dimension: 'language_demand', label: 'Language demand', score: 0, maxScore: 4 },
    { dimension: 'skill_demand', label: 'Skill demand', score: 0, maxScore: 4 },
    { dimension: 'location_demand', label: 'Location demand', score: 0, maxScore: 4 },
    { dimension: 'cultural_fit', label: 'Cultural bridge value', score: 0, maxScore: 4 },
    { dimension: 'market_gap', label: 'Market gap', score: 0, maxScore: 4 },
  ]

  // Give baseline scores based on country corridors
  const highDemand = ['KE', 'NG', 'GH', 'ZA', 'IN', 'PH']
  if (highDemand.includes(country)) {
    baseSignals[0].score = 3
    baseSignals[2].score = 3
    baseSignals[4].score = 2
  } else {
    baseSignals[0].score = 2
    baseSignals[2].score = 2
    baseSignals[4].score = 1
  }

  return baseSignals
}

/**
 * Compute overall market score for a Pioneer's profile.
 */
export function getMarketScore(opts: {
  country: string
  languages: string[]
  craft: string[]
  interests: string[]
  reach: string[]
}): MarketScore {
  const signals = getSignalsForRegion(opts.country)

  // Boost language demand based on language count
  if (opts.languages.length >= 3) {
    signals[0].score = Math.min(signals[0].maxScore, signals[0].score + 1)
  }

  // Boost skill demand based on craft diversity
  if (opts.craft.length >= 2) {
    signals[1].score = Math.min(signals[1].maxScore, signals[1].score + 2)
  } else if (opts.craft.length >= 1) {
    signals[1].score = Math.min(signals[1].maxScore, signals[1].score + 1)
  }

  // Boost cultural bridge value based on interests breadth
  if (opts.interests.length >= 3) {
    signals[3].score = Math.min(signals[3].maxScore, signals[3].score + 2)
  } else if (opts.interests.length >= 1) {
    signals[3].score = Math.min(signals[3].maxScore, signals[3].score + 1)
  }

  // Boost market gap based on reach
  if (opts.reach.includes('global') || opts.reach.includes('diaspora')) {
    signals[4].score = Math.min(signals[4].maxScore, signals[4].score + 1)
  }

  const total = signals.reduce((sum, s) => sum + s.score, 0)
  const maxTotal = signals.reduce((sum, s) => sum + s.maxScore, 0)

  return { total, maxTotal, signals }
}

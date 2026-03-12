/**
 * MARKET DATA — Real-time market signals for dimension scoring
 *
 * Provides market demand data that feeds into the 8-dimension
 * matching engine. Each signal represents demand for a craft/interest
 * in a specific country.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MarketSignal {
  country: string // ISO 2-letter code
  craft: string // Skill/craft in demand
  demand: number // 0-100 demand level
  trend: 'rising' | 'stable' | 'declining'
}

export interface MarketQuery {
  country: string
  craft: string[]
  interests: string[]
}

// ─── Market Signals Data ──────────────────────────────────────────────────────

export const MARKET_SIGNALS: MarketSignal[] = [
  // East Africa
  { country: 'KE', craft: 'software', demand: 90, trend: 'rising' },
  { country: 'KE', craft: 'tourism', demand: 85, trend: 'rising' },
  { country: 'KE', craft: 'agriculture', demand: 75, trend: 'stable' },
  { country: 'KE', craft: 'healthcare', demand: 80, trend: 'rising' },
  { country: 'KE', craft: 'finance', demand: 70, trend: 'stable' },
  { country: 'TZ', craft: 'tourism', demand: 88, trend: 'rising' },
  { country: 'TZ', craft: 'agriculture', demand: 80, trend: 'stable' },
  { country: 'UG', craft: 'agriculture', demand: 82, trend: 'stable' },
  { country: 'RW', craft: 'software', demand: 85, trend: 'rising' },
  { country: 'ET', craft: 'manufacturing', demand: 78, trend: 'rising' },

  // West Africa
  { country: 'NG', craft: 'software', demand: 92, trend: 'rising' },
  { country: 'NG', craft: 'finance', demand: 85, trend: 'rising' },
  { country: 'NG', craft: 'media', demand: 80, trend: 'rising' },
  { country: 'GH', craft: 'software', demand: 82, trend: 'rising' },
  { country: 'GH', craft: 'mining', demand: 75, trend: 'stable' },

  // Southern Africa
  { country: 'ZA', craft: 'software', demand: 88, trend: 'rising' },
  { country: 'ZA', craft: 'mining', demand: 70, trend: 'declining' },
  { country: 'ZA', craft: 'finance', demand: 82, trend: 'stable' },

  // Europe
  { country: 'DE', craft: 'engineering', demand: 90, trend: 'rising' },
  { country: 'DE', craft: 'software', demand: 92, trend: 'rising' },
  { country: 'DE', craft: 'healthcare', demand: 88, trend: 'rising' },
  { country: 'GB', craft: 'software', demand: 90, trend: 'rising' },
  { country: 'GB', craft: 'finance', demand: 85, trend: 'stable' },
  { country: 'AT', craft: 'tourism', demand: 80, trend: 'stable' },
  { country: 'CH', craft: 'finance', demand: 90, trend: 'stable' },

  // North America
  { country: 'US', craft: 'software', demand: 95, trend: 'rising' },
  { country: 'US', craft: 'healthcare', demand: 90, trend: 'rising' },
  { country: 'CA', craft: 'software', demand: 88, trend: 'rising' },
  { country: 'CA', craft: 'mining', demand: 75, trend: 'stable' },
]

// ─── Scoring Function ─────────────────────────────────────────────────────────

/**
 * Calculate market score for a profile in a given country.
 * Looks up matching signals for the country + craft/interests combination.
 * Returns 0-20.
 */
export function getMarketScore(query: MarketQuery, signals: MarketSignal[]): number {
  const countrySignals = signals.filter(
    (s) => s.country.toUpperCase() === query.country.toUpperCase()
  )

  if (countrySignals.length === 0) return 0

  // Find best matching signal across crafts and interests
  const allTerms = [...query.craft, ...query.interests].map((t) => t.toLowerCase())
  let bestDemand = 0

  for (const signal of countrySignals) {
    const craftLower = signal.craft.toLowerCase()
    const matches = allTerms.some(
      (term) => craftLower.includes(term) || term.includes(craftLower)
    )
    if (matches && signal.demand > bestDemand) {
      bestDemand = signal.demand
    }
  }

  // Scale demand (0-100) to score (0-20)
  return Math.min(20, Math.round((bestDemand / 100) * 20))
}

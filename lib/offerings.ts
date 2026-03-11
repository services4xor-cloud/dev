/**
 * Offerings Engine — country-aware, purpose-driven recommendations
 *
 * Composes existing data sources:
 *   - lib/countries.ts      → sectors, payment methods per country
 *   - lib/compass.ts        → route corridors + strength
 *   - lib/vocabulary.ts     → Pioneer types (purpose categories)
 *   - lib/safari-packages.ts → experience packages (Kenya, extensible)
 *   - data/mock/offerings.ts → eco-tourism, trade corridor details
 *
 * Adding a new country = adding config in lib/countries.ts + data files.
 * Zero changes needed in this engine or any page.
 */

import { COUNTRIES, type CountryCode, type CountryConfig } from './countries'
import { COUNTRY_ROUTES } from './compass'
import { PIONEER_TYPES, type PioneerType } from './vocabulary'
import { SAFARI_PACKAGES, type SafariPackage } from './safari-packages'
import {
  ECO_TOURISM_OFFERINGS,
  TRADE_CORRIDORS,
  type EcoTourismOffering,
  type TradeCorridor,
} from '@/data/mock'

// ── Purpose categories (maps to PioneerType groups) ─────────────────

export type OfferingPurpose = 'travel' | 'professional' | 'business'

export const OFFERING_PURPOSES: {
  id: OfferingPurpose
  label: string
  icon: string
  description: string
  pioneerTypes: PioneerType[]
}[] = [
  {
    id: 'travel',
    label: 'Travel & Experiences',
    icon: '🌍',
    description: 'Safaris, eco-tourism, cultural immersions',
    pioneerTypes: ['explorer'],
  },
  {
    id: 'professional',
    label: 'Professional Paths',
    icon: '💼',
    description: 'Work, healthcare, tech, education',
    pioneerTypes: ['professional', 'healer', 'guardian'],
  },
  {
    id: 'business',
    label: 'Business & Trade',
    icon: '🤝',
    description: 'Trade corridors, partnerships, investment',
    pioneerTypes: ['artisan', 'creator'],
  },
]

// ── Destination recommendation ──────────────────────────────────────

export interface DestinationRecommendation {
  country: CountryConfig
  routeStrength: 'direct' | 'partner' | 'emerging' | 'none'
  relevantSectors: { name: string; emoji: string; count: number }[]
  paymentRails: string[]
  visaNote: string | null
}

/**
 * Get recommended destinations from a given origin country,
 * sorted by route strength (direct > partner > emerging).
 */
export function getRecommendedDestinations(originCode: CountryCode): DestinationRecommendation[] {
  const destinations: DestinationRecommendation[] = []

  for (const [code, config] of Object.entries(COUNTRIES)) {
    if (code === originCode) continue

    const routeKey = `${originCode}-${code}`
    const route = COUNTRY_ROUTES[routeKey]

    destinations.push({
      country: config,
      routeStrength: route?.strength ?? 'none',
      relevantSectors: config.featuredSectors.slice(0, 4).map((s) => ({
        name: s.name,
        emoji: s.emoji,
        count: s.count,
      })),
      paymentRails: route?.paymentMethods ?? [],
      visaNote: route?.visaNote ?? null,
    })
  }

  // Sort: direct first, then partner, then emerging, then no route
  const strengthOrder = { direct: 0, partner: 1, emerging: 2, none: 3 }
  return destinations.sort(
    (a, b) => strengthOrder[a.routeStrength] - strengthOrder[b.routeStrength]
  )
}

// ── Per-country offering data ───────────────────────────────────────

export interface CountryOfferings {
  experiences: SafariPackage[]
  ecoTourism: EcoTourismOffering[]
  tradeCorridors: TradeCorridor[]
  sectors: { name: string; emoji: string; count: number }[]
}

/**
 * Get all offerings available in a specific destination country.
 * Currently experiences/eco-tourism are Kenya-only — as more
 * countries get data, this will return their offerings too.
 */
export function getCountryOfferings(countryCode: CountryCode): CountryOfferings {
  const config = COUNTRIES[countryCode]

  return {
    // Experiences — currently KE only, extensible by country
    experiences: countryCode === 'KE' ? SAFARI_PACKAGES : [],

    // Eco-tourism — currently KE only, extensible
    ecoTourism: countryCode === 'KE' ? ECO_TOURISM_OFFERINGS : [],

    // Trade corridors that involve this country (either direction)
    tradeCorridors: TRADE_CORRIDORS.filter(
      (c) => c.id.startsWith(countryCode.toLowerCase()) || c.id.endsWith(countryCode.toLowerCase())
    ),

    // Sectors from country config
    sectors:
      config?.featuredSectors.map((s) => ({
        name: s.name,
        emoji: s.emoji,
        count: s.count,
      })) ?? [],
  }
}

/**
 * Get offerings filtered by purpose.
 */
export function getOfferingsByPurpose(
  countryCode: CountryCode,
  purpose: OfferingPurpose
): CountryOfferings {
  const all = getCountryOfferings(countryCode)

  switch (purpose) {
    case 'travel':
      return { ...all, tradeCorridors: [], sectors: [] }
    case 'professional':
      return { ...all, experiences: [], ecoTourism: [], tradeCorridors: [] }
    case 'business':
      return { ...all, experiences: [], ecoTourism: [] }
    default:
      return all
  }
}

// ── Purpose relevance for a country ─────────────────────────────────

export interface PurposeAvailability {
  purpose: OfferingPurpose
  label: string
  icon: string
  count: number
  available: boolean
}

/**
 * Check which purposes have content for a given country.
 */
export function getPurposeAvailability(countryCode: CountryCode): PurposeAvailability[] {
  const offerings = getCountryOfferings(countryCode)

  return OFFERING_PURPOSES.map((p) => {
    let count = 0
    switch (p.id) {
      case 'travel':
        count = offerings.experiences.length + offerings.ecoTourism.length
        break
      case 'professional':
        count = offerings.sectors.length
        break
      case 'business':
        count = offerings.tradeCorridors.length + offerings.sectors.length
        break
    }
    return {
      purpose: p.id,
      label: p.label,
      icon: p.icon,
      count,
      available: count > 0,
    }
  })
}

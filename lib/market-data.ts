/**
 * Market Data — Platform-pushed market signals
 *
 * The 8th identity dimension: what the world needs from you.
 * Real-world sector signals that connect Pioneer crafts to global demand.
 */

export interface MarketSignal {
  id: string
  sector: string
  region: string
  signal: 'growing' | 'stable' | 'emerging' | 'urgent'
  title: string
  description: string
  demandCrafts: string[]
  opportunityScore: number
}

// ---------------------------------------------------------------------------
// Region mapping — maps ISO country codes to broader region names
// ---------------------------------------------------------------------------

const REGION_MAP: Record<string, string[]> = {
  'East Africa': ['KE', 'TZ', 'UG', 'RW', 'ET', 'SO', 'BI', 'SS'],
  'West Africa': ['NG', 'GH', 'SN', 'CI', 'CM', 'ML', 'BF', 'NE', 'BJ', 'TG'],
  'Southern Africa': ['ZA', 'ZW', 'MW', 'MZ', 'BW', 'NA', 'ZM'],
  'North Africa': ['EG', 'MA', 'TN', 'DZ', 'LY'],
  Gulf: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'],
  Europe: [
    'DE',
    'GB',
    'FR',
    'CH',
    'NL',
    'SE',
    'NO',
    'DK',
    'FI',
    'IT',
    'ES',
    'PT',
    'AT',
    'BE',
    'IE',
  ],
  Asia: ['IN', 'JP', 'CN', 'KR', 'SG', 'MY', 'TH', 'PH', 'ID', 'VN'],
  Americas: ['US', 'CA', 'BR', 'MX', 'CO', 'AR', 'CL', 'PE'],
}

function getRegionsForCountry(countryCode: string): string[] {
  const upper = countryCode.toUpperCase()
  const regions: string[] = []
  for (const [region, codes] of Object.entries(REGION_MAP)) {
    if (codes.includes(upper)) {
      regions.push(region)
    }
  }
  return regions
}

// ---------------------------------------------------------------------------
// Market Signals — 32 real-world signals
// ---------------------------------------------------------------------------

export const MARKET_SIGNALS: MarketSignal[] = [
  // --- East Africa ---
  {
    id: 'ea-safari-recovery',
    sector: 'safari',
    region: 'East Africa',
    signal: 'growing',
    title: 'Safari tourism recovery in East Africa',
    description:
      'Post-pandemic safari bookings have surged past 2019 levels, with Kenya and Tanzania leading the recovery.',
    demandCrafts: ['Safari Guide', 'Photography', 'Hospitality'],
    opportunityScore: 85,
  },
  {
    id: 'ea-nairobi-tech',
    sector: 'tech',
    region: 'East Africa',
    signal: 'growing',
    title: 'Nairobi tech hub growth',
    description:
      'Silicon Savannah continues to attract investment with over 200 startups raising funding in the past year.',
    demandCrafts: ['Software Engineering', 'UX Design', 'Data Science'],
    opportunityScore: 90,
  },
  {
    id: 'ea-agri-exports',
    sector: 'agriculture',
    region: 'East Africa',
    signal: 'stable',
    title: 'East African agricultural exports',
    description:
      'Tea, coffee, and horticultural products remain strong export earners across the region.',
    demandCrafts: ['Agriculture', 'Logistics'],
    opportunityScore: 70,
  },
  {
    id: 'ea-conservation',
    sector: 'community',
    region: 'East Africa',
    signal: 'emerging',
    title: 'Kenyan conservation programs',
    description:
      'New marine and wildlife conservation corridors are opening funded by international partnerships.',
    demandCrafts: ['Conservation', 'Marine Biology'],
    opportunityScore: 65,
  },

  // --- West Africa ---
  {
    id: 'wa-fintech',
    sector: 'tech',
    region: 'West Africa',
    signal: 'urgent',
    title: 'Nigerian fintech explosion',
    description:
      'Nigeria leads African fintech with record funding rounds and rapid mobile money adoption.',
    demandCrafts: ['Software Engineering', 'Finance', 'Cybersecurity'],
    opportunityScore: 95,
  },
  {
    id: 'wa-nollywood',
    sector: 'media',
    region: 'West Africa',
    signal: 'growing',
    title: 'Nollywood and media expansion',
    description:
      'Streaming platforms are investing heavily in African content, driving demand for production talent.',
    demandCrafts: ['Videography', 'Writing', 'Music Production'],
    opportunityScore: 80,
  },
  {
    id: 'wa-fashion',
    sector: 'fashion',
    region: 'West Africa',
    signal: 'growing',
    title: 'West African fashion on the global stage',
    description: 'Lagos and Accra fashion weeks attract international buyers and media attention.',
    demandCrafts: ['Fashion Design', 'Photography', 'Marketing'],
    opportunityScore: 75,
  },
  {
    id: 'wa-ghana-tech',
    sector: 'tech',
    region: 'West Africa',
    signal: 'emerging',
    title: 'Ghana tech outsourcing growth',
    description:
      'Accra is positioning itself as an outsourcing hub with government-backed tech incubators.',
    demandCrafts: ['Software Engineering', 'DevOps'],
    opportunityScore: 70,
  },

  // --- Southern Africa ---
  {
    id: 'sa-mining-tech',
    sector: 'engineering',
    region: 'Southern Africa',
    signal: 'stable',
    title: 'South African mining technology',
    description:
      'Automation and IoT adoption in mining operations drives demand for technical specialists.',
    demandCrafts: ['Engineering', 'Mechanics', 'DevOps'],
    opportunityScore: 65,
  },
  {
    id: 'sa-cape-creative',
    sector: 'culture',
    region: 'Southern Africa',
    signal: 'growing',
    title: 'Cape Town creative scene',
    description:
      'Cape Town has emerged as a creative hub for design studios, animation houses, and media agencies.',
    demandCrafts: ['Graphic Design', 'Photography', 'Animation'],
    opportunityScore: 72,
  },

  // --- Europe-Africa corridors ---
  {
    id: 'eu-de-ke-tech',
    sector: 'tech',
    region: 'DE',
    signal: 'emerging',
    title: 'German-Kenyan tech corridor',
    description:
      'Berlin-Nairobi partnerships are creating pathways for African developers in the EU market.',
    demandCrafts: ['Software Engineering', 'Project Management'],
    opportunityScore: 78,
  },
  {
    id: 'eu-uk-ng-trade',
    sector: 'trade',
    region: 'GB',
    signal: 'growing',
    title: 'UK-Nigeria trade expansion',
    description:
      'Post-Brexit trade agreements have opened new channels for Nigerian goods and services.',
    demandCrafts: ['Finance', 'Consulting', 'Logistics'],
    opportunityScore: 80,
  },
  {
    id: 'eu-fr-wa-dev',
    sector: 'education',
    region: 'FR',
    signal: 'stable',
    title: 'French-West Africa development programs',
    description:
      'Francophone development corridors continue to fund education and agricultural partnerships.',
    demandCrafts: ['Teaching', 'Agriculture', 'Engineering'],
    opportunityScore: 68,
  },
  {
    id: 'eu-ch-ea-invest',
    sector: 'trade',
    region: 'CH',
    signal: 'emerging',
    title: 'Swiss-East Africa investment corridor',
    description:
      'Swiss impact investors are channeling capital into East African startups and social enterprises.',
    demandCrafts: ['Finance', 'Consulting'],
    opportunityScore: 72,
  },

  // --- Gulf ---
  {
    id: 'gulf-healthcare',
    sector: 'health',
    region: 'Gulf',
    signal: 'urgent',
    title: 'Healthcare workers needed in the Gulf',
    description:
      'Gulf states face critical shortages of healthcare professionals with active recruitment from Africa.',
    demandCrafts: ['Nursing', 'Medicine', 'Pharmacy'],
    opportunityScore: 92,
  },
  {
    id: 'gulf-construction',
    sector: 'engineering',
    region: 'Gulf',
    signal: 'stable',
    title: 'Gulf construction boom continues',
    description:
      'Mega-projects in Saudi Arabia and UAE sustain demand for skilled construction workers.',
    demandCrafts: ['Construction', 'Electrical', 'Welding'],
    opportunityScore: 75,
  },
  {
    id: 'gulf-uae-agri',
    sector: 'agriculture',
    region: 'Gulf',
    signal: 'growing',
    title: 'UAE investment in African agriculture',
    description:
      'Food security concerns are driving Gulf investment into African agricultural production.',
    demandCrafts: ['Agriculture', 'Finance', 'Logistics'],
    opportunityScore: 82,
  },

  // --- Asia ---
  {
    id: 'asia-manufacturing',
    sector: 'trade',
    region: 'Asia',
    signal: 'stable',
    title: 'Asian manufacturing partnerships with Africa',
    description:
      'Chinese and Indian manufacturers are establishing production facilities across the continent.',
    demandCrafts: ['Engineering', 'Logistics'],
    opportunityScore: 68,
  },
  {
    id: 'asia-india-outsource',
    sector: 'tech',
    region: 'Asia',
    signal: 'emerging',
    title: 'Indian tech outsourcing to Africa',
    description:
      'Indian IT firms are expanding operations to East and West Africa for cost-effective talent.',
    demandCrafts: ['Software Engineering', 'Cloud Architecture'],
    opportunityScore: 74,
  },
  {
    id: 'asia-japan-infra',
    sector: 'engineering',
    region: 'Asia',
    signal: 'emerging',
    title: 'Japanese investment in African infrastructure',
    description:
      'JICA-funded projects are building roads, ports, and energy infrastructure across East Africa.',
    demandCrafts: ['Engineering', 'Project Management'],
    opportunityScore: 65,
  },

  // --- Americas ---
  {
    id: 'us-remote-tech',
    sector: 'tech',
    region: 'Americas',
    signal: 'growing',
    title: 'Remote tech work from Africa',
    description:
      'US companies are actively recruiting African developers for remote engineering positions.',
    demandCrafts: ['Software Engineering', 'UX Design', 'DevOps'],
    opportunityScore: 88,
  },
  {
    id: 'us-agri-trade',
    sector: 'agriculture',
    region: 'Americas',
    signal: 'emerging',
    title: 'US-Africa agricultural trade',
    description:
      'AGOA provisions continue to support agricultural exports from sub-Saharan Africa to the US.',
    demandCrafts: ['Agriculture', 'Logistics'],
    opportunityScore: 62,
  },
  {
    id: 'ca-immigration',
    sector: 'education',
    region: 'CA',
    signal: 'growing',
    title: 'Canadian immigration pathways for skilled Africans',
    description:
      'Express Entry programs prioritize nurses, engineers, and teachers from African nations.',
    demandCrafts: ['Nursing', 'Engineering', 'Teaching'],
    opportunityScore: 78,
  },

  // --- Additional signals to reach 30+ ---
  {
    id: 'ea-renewable-energy',
    sector: 'engineering',
    region: 'East Africa',
    signal: 'growing',
    title: 'Renewable energy expansion in East Africa',
    description:
      'Solar and geothermal projects are scaling rapidly with new investment from development banks.',
    demandCrafts: ['Electrical Engineering', 'Project Management', 'Solar Installation'],
    opportunityScore: 83,
  },
  {
    id: 'eu-education-corridor',
    sector: 'education',
    region: 'Europe',
    signal: 'growing',
    title: 'European university scholarships for African students',
    description:
      'DAAD, Chevening, and Erasmus programs are expanding African scholarship quotas significantly.',
    demandCrafts: ['Teaching', 'Research', 'Academic Writing'],
    opportunityScore: 76,
  },
  {
    id: 'ea-hospitality-recovery',
    sector: 'hospitality',
    region: 'East Africa',
    signal: 'growing',
    title: 'Hospitality sector recovery across East Africa',
    description: 'International hotel chains are expanding in Nairobi, Dar es Salaam, and Kigali.',
    demandCrafts: ['Hospitality', 'Culinary Arts', 'Event Management'],
    opportunityScore: 77,
  },
  {
    id: 'wa-agritech',
    sector: 'agriculture',
    region: 'West Africa',
    signal: 'emerging',
    title: 'AgriTech startups transforming West African farming',
    description:
      'Precision agriculture and supply chain platforms are attracting venture capital in Nigeria and Ghana.',
    demandCrafts: ['Agriculture', 'Software Engineering', 'Data Science'],
    opportunityScore: 71,
  },
  {
    id: 'sa-fintech',
    sector: 'tech',
    region: 'Southern Africa',
    signal: 'growing',
    title: 'South African fintech ecosystem',
    description:
      'Johannesburg and Cape Town are becoming fintech hubs connecting African and global financial systems.',
    demandCrafts: ['Software Engineering', 'Finance', 'Compliance'],
    opportunityScore: 79,
  },
  {
    id: 'gulf-hospitality',
    sector: 'hospitality',
    region: 'Gulf',
    signal: 'growing',
    title: 'Gulf hospitality expansion',
    description:
      'Tourism diversification strategies in Saudi Arabia and UAE are creating thousands of hospitality roles.',
    demandCrafts: ['Hospitality', 'Culinary Arts', 'Tourism Management'],
    opportunityScore: 81,
  },
  {
    id: 'ea-mobile-health',
    sector: 'health',
    region: 'East Africa',
    signal: 'emerging',
    title: 'Mobile health innovation in East Africa',
    description:
      'mHealth platforms are revolutionizing healthcare delivery in rural communities across the region.',
    demandCrafts: ['Nursing', 'Software Engineering', 'Public Health'],
    opportunityScore: 69,
  },
  {
    id: 'eu-green-skills',
    sector: 'engineering',
    region: 'Europe',
    signal: 'urgent',
    title: 'Green skills shortage in Europe',
    description:
      'The EU Green Deal is creating urgent demand for renewable energy and sustainability specialists.',
    demandCrafts: ['Electrical Engineering', 'Environmental Science', 'Project Management'],
    opportunityScore: 86,
  },
  {
    id: 'na-creative-export',
    sector: 'culture',
    region: 'North Africa',
    signal: 'emerging',
    title: 'North African creative exports',
    description:
      'Egyptian and Moroccan film, music, and design are gaining traction in European and Gulf markets.',
    demandCrafts: ['Videography', 'Graphic Design', 'Music Production'],
    opportunityScore: 66,
  },
  {
    id: 'global-cybersecurity',
    sector: 'tech',
    region: 'East Africa',
    signal: 'urgent',
    title: 'Cybersecurity talent demand across Africa',
    description:
      'Digital transformation has outpaced security capacity, creating critical demand for cyber specialists.',
    demandCrafts: ['Cybersecurity', 'Software Engineering', 'Network Engineering'],
    opportunityScore: 91,
  },
]

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

const SIGNAL_WEIGHTS: Record<MarketSignal['signal'], number> = {
  urgent: 4,
  growing: 3,
  emerging: 2,
  stable: 1,
}

/**
 * Returns signals relevant to a country code.
 * Matches on exact country code OR the broader region that contains it.
 */
export function getSignalsForRegion(countryCode: string): MarketSignal[] {
  const upper = countryCode.toUpperCase()
  const regions = getRegionsForCountry(upper)

  return MARKET_SIGNALS.filter((s) => {
    // Direct country code match
    if (s.region.toUpperCase() === upper) return true
    // Region match
    if (regions.includes(s.region)) return true
    return false
  })
}

/**
 * Returns signals whose demandCrafts overlap with the given crafts.
 * Case-insensitive partial match.
 */
export function getSignalsForCraft(crafts: string[]): MarketSignal[] {
  const lowerCrafts = crafts.map((c) => c.toLowerCase())

  return MARKET_SIGNALS.filter((s) =>
    s.demandCrafts.some((dc) => {
      const lowerDc = dc.toLowerCase()
      return lowerCrafts.some((lc) => lowerDc.includes(lc) || lc.includes(lowerDc))
    })
  )
}

/**
 * Computes a market alignment score (0-20) for a Pioneer profile against signals.
 *
 * Factors:
 * - Craft overlap with demandCrafts
 * - Interest/sector overlap
 * - Signal urgency weighting (urgent=4x, growing=3x, emerging=2x, stable=1x)
 */
export function getMarketScore(
  profile: { country: string; craft: string[]; interests: string[] },
  signals: MarketSignal[]
): number {
  if (signals.length === 0) return 0

  const regionSignals = signals.filter((s) => {
    const upper = profile.country.toUpperCase()
    const regions = getRegionsForCountry(upper)
    if (s.region.toUpperCase() === upper) return true
    if (regions.includes(s.region)) return true
    return false
  })

  if (regionSignals.length === 0) return 0

  const lowerCrafts = profile.craft.map((c) => c.toLowerCase())
  const lowerInterests = profile.interests.map((i) => i.toLowerCase())

  let totalScore = 0

  for (const signal of regionSignals) {
    const weight = SIGNAL_WEIGHTS[signal.signal]

    // Craft overlap: does any of the Pioneer's crafts match demand?
    const craftMatch = signal.demandCrafts.some((dc) => {
      const lowerDc = dc.toLowerCase()
      return lowerCrafts.some((lc) => lowerDc.includes(lc) || lc.includes(lowerDc))
    })

    // Interest/sector overlap
    const interestMatch =
      lowerInterests.includes(signal.sector.toLowerCase()) ||
      lowerInterests.some((i) => signal.title.toLowerCase().includes(i))

    if (craftMatch) {
      totalScore += weight * 3
    }
    if (interestMatch) {
      totalScore += weight * 1
    }
  }

  // Normalize to 0-20
  // Max theoretical per signal = weight(4) * (3+1) = 16
  // Cap at a reasonable max
  const maxPossible = regionSignals.length * 16
  const normalized = Math.round((totalScore / maxPossible) * 20)

  return Math.min(20, Math.max(0, normalized))
}

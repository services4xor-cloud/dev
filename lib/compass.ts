// THE COMPASS — Smart routing engine
// Auto-detects user location, matches to target countries, shows relevant paths

import { COUNTRIES, CountryCode } from './countries'

// Country route relationships — which corridors are most active
export const COUNTRY_ROUTES: Record<
  string,
  {
    targetCountries: string[]
    primarySectors: string[]
    visaNote: string
    paymentMethods: string[]
    strength: 'direct' | 'partner' | 'emerging'
  }
> = {
  'KE-DE': {
    targetCountries: ['DE'],
    primarySectors: ['Healthcare', 'Technology', 'Hospitality', 'Cultural Exchange', 'Education'],
    visaNote:
      'Schengen visa required. Germany has high demand for Kenyan professionals in healthcare and tech. Active bilateral agreements for skilled worker recruitment.',
    paymentMethods: ['M-Pesa', 'SEPA', 'Wise'],
    strength: 'direct',
  },
  'KE-GB': {
    targetCountries: ['GB'],
    primarySectors: ['Healthcare', 'Education', 'Technology', 'Hospitality'],
    visaNote: 'UK Skilled Worker visa. Kenya has a strong corridor for NHS workers.',
    paymentMethods: ['M-Pesa', 'Bank Transfer', 'Wise'],
    strength: 'direct',
  },
  'KE-AE': {
    targetCountries: ['AE'],
    primarySectors: ['Hospitality', 'Logistics', 'Construction', 'Domestic Work'],
    visaNote: 'UAE employment visa through employer. High demand for Kenyan hospitality workers.',
    paymentMethods: ['M-Pesa', 'Bank Transfer', 'Western Union'],
    strength: 'direct',
  },
  'KE-US': {
    targetCountries: ['US'],
    primarySectors: ['Technology', 'Healthcare', 'Education', 'Finance'],
    visaNote: 'H1B for professionals, green card lottery. Strong Kenyan diaspora in US.',
    paymentMethods: ['M-Pesa', 'ACH', 'PayPal'],
    strength: 'partner',
  },
  'KE-CA': {
    targetCountries: ['CA'],
    primarySectors: ['Healthcare', 'Technology', 'Hospitality', 'Agriculture'],
    visaNote: 'Canada Express Entry. Kenyan professionals well-regarded in Canadian market.',
    paymentMethods: ['M-Pesa', 'Bank Transfer', 'Wise'],
    strength: 'partner',
  },
  'DE-KE': {
    targetCountries: ['KE'],
    primarySectors: [
      'Safari & Wildlife',
      'Eco-Tourism',
      'Charity & NGO',
      'Cultural Exchange',
      'Healthcare Training',
    ],
    visaNote:
      'No visa for tourism/volunteering up to 90 days. Ideal for eco-tourism ventures and professional exchange.',
    paymentMethods: ['SEPA', 'PayPal', 'Stripe', 'M-Pesa'],
    strength: 'direct',
  },
  'DE-CH': {
    targetCountries: ['CH'],
    primarySectors: ['Healthcare', 'Finance & Banking', 'Hospitality', 'Technology'],
    visaNote: 'EU/EFTA bilateral agreement. Germans can work in Switzerland with L/B permit.',
    paymentMethods: ['SEPA', 'TWINT', 'Bank Transfer'],
    strength: 'direct',
  },
  'CH-DE': {
    targetCountries: ['DE'],
    primarySectors: ['Technology', 'Finance & Banking', 'Automotive', 'Pharma'],
    visaNote: 'EU/EFTA bilateral agreement. Swiss citizens have free movement in Germany.',
    paymentMethods: ['SEPA', 'TWINT', 'Bank Transfer'],
    strength: 'direct',
  },
  'CH-KE': {
    targetCountries: ['KE'],
    primarySectors: ['Charity & NGO', 'Eco-Tourism', 'Cultural Exchange', 'Education'],
    visaNote: 'No visa for tourism up to 90 days. Switzerland has strong NGO presence in Kenya.',
    paymentMethods: ['TWINT', 'Wise', 'Stripe', 'M-Pesa'],
    strength: 'partner',
  },
  'GB-KE': {
    targetCountries: ['KE'],
    primarySectors: ['Charity & NGO', 'Education', 'Safari & Wildlife', 'Cultural Exchange'],
    visaNote:
      'No visa for tourism up to 90 days. Strong UK-Kenya historical ties and volunteer networks.',
    paymentMethods: ['Bank Transfer', 'PayPal', 'Wise', 'M-Pesa'],
    strength: 'direct',
  },
  'FR-KE': {
    targetCountries: ['KE'],
    primarySectors: ['Cultural Exchange', 'Hospitality', 'Safari & Wildlife', 'Education'],
    visaNote:
      'No visa for tourism up to 90 days. French development cooperation active in East Africa.',
    paymentMethods: ['SEPA', 'Wise', 'PayPal', 'M-Pesa'],
    strength: 'partner',
  },
  'KE-FR': {
    targetCountries: ['FR'],
    primarySectors: ['Hospitality', 'Healthcare', 'Education', 'Fashion & Design'],
    visaNote: 'Schengen visa required. Growing Kenyan diaspora in France, particularly in Paris.',
    paymentMethods: ['M-Pesa', 'SEPA', 'Wise'],
    strength: 'emerging',
  },
  'KE-CH': {
    targetCountries: ['CH'],
    primarySectors: ['Healthcare', 'Hospitality', 'Technology', 'Finance & Banking'],
    visaNote:
      'Swiss work permit required. High demand for healthcare workers. Strong NGO sector connection.',
    paymentMethods: ['M-Pesa', 'TWINT', 'Wise'],
    strength: 'partner',
  },
  'NG-KE': {
    targetCountries: ['KE'],
    primarySectors: ['Technology', 'Finance & Banking', 'Media & Content'],
    visaNote: 'EAC free movement. Nigeria-Kenya tech corridor growing rapidly.',
    paymentMethods: ['Flutterwave', 'M-Pesa', 'Paystack'],
    strength: 'partner',
  },
  'ZA-KE': {
    targetCountries: ['KE'],
    primarySectors: ['Finance & Banking', 'Technology', 'Retail'],
    visaNote: 'EAC agreement. South Africa-Kenya business corridor well-established.',
    paymentMethods: ['M-Pesa', 'EFT', 'Flutterwave'],
    strength: 'partner',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Region mapping for visa / free-movement logic
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_REGION: Record<string, string> = {
  KE: 'East Africa',
  UG: 'East Africa',
  TZ: 'East Africa',
  NG: 'West Africa',
  GH: 'West Africa',
  ZA: 'Southern Africa',
  DE: 'Western Europe',
  CH: 'Western Europe',
  GB: 'Western Europe',
  US: 'North America',
  CA: 'North America',
  AE: 'Middle East',
  IN: 'South Asia',
  TH: 'Southeast Asia',
}

// ─────────────────────────────────────────────────────────────────────────────
// Adaptive route generation — derives routes from COUNTRIES config
// ─────────────────────────────────────────────────────────────────────────────

type RouteEntry = (typeof COUNTRY_ROUTES)[string]

/**
 * Generate an adaptive route for ANY country pair by deriving data from the
 * COUNTRIES config.  Returns the curated COUNTRY_ROUTES entry when one exists,
 * otherwise builds a route dynamically from sector overlap and payment config.
 *
 * Returns `null` when the two countries share zero sectors.
 */
export function generateRoute(from: string, to: string): RouteEntry | null {
  // 1. If a curated route exists, prefer it
  const curated = COUNTRY_ROUTES[getRouteKey(from, to)]
  if (curated) return curated

  // 2. Both countries must be in COUNTRIES config
  const fromConfig = COUNTRIES[from as CountryCode]
  const toConfig = COUNTRIES[to as CountryCode]
  if (!fromConfig || !toConfig) return null

  // 3. Derive sector names from featuredSectors
  const fromSectors = fromConfig.featuredSectors.map((s) => s.name)
  const toSectors = toConfig.featuredSectors.map((s) => s.name)

  // Find overlapping sectors (case-insensitive for robustness)
  const fromSet = new Set(fromSectors.map((s) => s.toLowerCase()))
  const sharedSectors = toSectors.filter((s) => fromSet.has(s.toLowerCase()))

  if (sharedSectors.length === 0) return null

  // 4. Derive payment methods — unique names from both countries
  const paymentNames = new Set<string>()
  for (const pm of fromConfig.paymentMethods) paymentNames.add(pm.name)
  for (const pm of toConfig.paymentMethods) paymentNames.add(pm.name)

  // 5. Determine strength
  const strength: 'partner' | 'emerging' = sharedSectors.length >= 3 ? 'partner' : 'emerging'

  // 6. Visa note — same region → free movement hint, otherwise generic
  const fromRegion = COUNTRY_REGION[from] ?? 'Other'
  const toRegion = COUNTRY_REGION[to] ?? 'Other'
  const visaNote =
    fromRegion === toRegion
      ? `Free movement — ${fromConfig.name} and ${toConfig.name} share the ${toRegion} region.`
      : `${toConfig.name} visa required for ${fromConfig.name} nationals.`

  return {
    targetCountries: [to],
    primarySectors: sharedSectors,
    visaNote,
    paymentMethods: Array.from(paymentNames),
    strength,
  }
}

export function getRouteKey(from: string, to: string): string {
  return `${from}-${to}`
}

export function getRouteInfo(from: string, to: string) {
  return COUNTRY_ROUTES[getRouteKey(from, to)] ?? generateRoute(from, to)
}

export function getRecommendedRoutes(fromCountry: string): string[] {
  // Start with curated routes
  const curated = Object.keys(COUNTRY_ROUTES)
    .filter((k) => k.startsWith(`${fromCountry}-`))
    .map((k) => k.split('-')[1])

  const seen = new Set(curated)

  // Add generated routes for every other country in COUNTRIES
  for (const code of Object.keys(COUNTRIES)) {
    if (code === fromCountry || seen.has(code)) continue
    const route = generateRoute(fromCountry, code)
    if (route) {
      curated.push(code)
      seen.add(code)
    }
  }

  return curated
}

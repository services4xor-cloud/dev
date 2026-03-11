/**
 * Be[Country] Platform — Country & Language Data Engine
 *
 * SINGLE SOURCE OF TRUTH for:
 *   - All selectable countries (for compass, onboarding, route planning)
 *   - Language registry (for collaboration matching + corridor strength)
 *   - Geographic coordinates (for proximity clustering)
 *   - Region clusters (for visual grouping in UI)
 *   - Corridor strength (direct / partner / emerging)
 *
 * KEY CONCEPT: Language + Location = Collaboration
 *   A Pioneer's languages and location together determine the strongest
 *   corridors. A Swahili-speaking Pioneer in Kenya has a direct corridor
 *   to Tanzania/Uganda. A German-speaking Pioneer has a direct corridor
 *   to Germany/Austria/Switzerland.
 *
 * Used by:
 *   - components/CountryPrioritySelector.tsx (compass step 1 + onboarding)
 *   - app/compass/page.tsx
 *   - app/onboarding/page.tsx
 *
 * DO NOT duplicate country or language lists elsewhere. Import from here.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Language types & registry
// ─────────────────────────────────────────────────────────────────────────────

export type LanguageCode =
  | 'en'
  | 'sw'
  | 'de'
  | 'fr'
  | 'ar'
  | 'hi'
  | 'pt'
  | 'nl'
  | 'zu'
  | 'ha'
  | 'yo'
  | 'am'
  | 'lg'
  | 'rw'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  /** Countries where this language is widely spoken (ISO codes) */
  countries: string[]
  /** Digital communication relevance (how common online / in tech) */
  digitalReach: 'global' | 'regional' | 'local'
}

/** All supported languages — indexed by code for O(1) lookup */
export const LANGUAGE_REGISTRY: Record<LanguageCode, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    countries: ['KE', 'UG', 'TZ', 'NG', 'GH', 'ZA', 'GB', 'US', 'CA', 'AU', 'IN', 'AE', 'RW', 'NL'],
    digitalReach: 'global',
  },
  sw: {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    countries: ['KE', 'TZ', 'UG', 'RW'],
    digitalReach: 'regional',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    countries: ['DE', 'CH', 'AT'],
    digitalReach: 'regional',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    countries: ['FR', 'CA', 'RW', 'CH'],
    digitalReach: 'global',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    countries: ['AE'],
    digitalReach: 'regional',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    countries: ['IN'],
    digitalReach: 'regional',
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    countries: [],
    digitalReach: 'global',
  },
  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    countries: ['NL', 'ZA'],
    digitalReach: 'regional',
  },
  zu: { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', countries: ['ZA'], digitalReach: 'local' },
  ha: {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    countries: ['NG', 'GH'],
    digitalReach: 'local',
  },
  yo: {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    countries: ['NG'],
    digitalReach: 'local',
  },
  am: { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', countries: [], digitalReach: 'local' },
  lg: {
    code: 'lg',
    name: 'Luganda',
    nativeName: 'Luganda',
    countries: ['UG'],
    digitalReach: 'local',
  },
  rw: {
    code: 'rw',
    name: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda',
    countries: ['RW'],
    digitalReach: 'local',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Country types
// ─────────────────────────────────────────────────────────────────────────────

export type RegionCluster =
  | 'east-africa'
  | 'west-africa'
  | 'southern-africa'
  | 'middle-east'
  | 'europe'
  | 'americas'
  | 'south-asia'
  | 'oceania'

export type CorridorStrength = 'direct' | 'partner' | 'emerging'

export interface CountryOption {
  code: string
  name: string
  flag: string
  lat: number
  lng: number
  region: RegionCluster
  corridorStrength: CorridorStrength
  topSectors: string[]
  currency: string
  payment: string[]
  visa: string
  approxFlightHoursFromKenya: number
  tz: string // IANA timezone
  /** Languages spoken in this country (ordered by prevalence) */
  languages: LanguageCode[]
}

export interface RegionClusterConfig {
  key: RegionCluster
  label: string
  emoji: string
  description: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Region cluster config
// ─────────────────────────────────────────────────────────────────────────────

export const REGION_CLUSTERS: RegionClusterConfig[] = [
  {
    key: 'east-africa',
    label: 'East Africa',
    emoji: '🌍',
    description: 'EAC corridor — free movement & M-Pesa',
  },
  {
    key: 'west-africa',
    label: 'West Africa',
    emoji: '🌍',
    description: 'ECOWAS & Pan-African trade',
  },
  {
    key: 'southern-africa',
    label: 'Southern Africa',
    emoji: '🌍',
    description: 'SADC markets & mining corridor',
  },
  {
    key: 'middle-east',
    label: 'Middle East',
    emoji: '🏜️',
    description: 'Gulf opportunity corridor',
  },
  { key: 'europe', label: 'Europe', emoji: '🏛️', description: 'Skilled worker visa routes' },
  { key: 'americas', label: 'Americas', emoji: '🌎', description: 'Diaspora & tech hub routes' },
  { key: 'south-asia', label: 'South Asia', emoji: '🌏', description: 'Trade & tech corridor' },
  { key: 'oceania', label: 'Oceania', emoji: '🌏', description: 'Skilled migration programme' },
]

// ─────────────────────────────────────────────────────────────────────────────
// All country options — canonical list
// ─────────────────────────────────────────────────────────────────────────────

export const COUNTRY_OPTIONS: CountryOption[] = [
  // ── East Africa ─────────────────────────────────────────────────────────
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    lat: -1.286,
    lng: 36.817,
    region: 'east-africa',
    corridorStrength: 'direct',
    topSectors: ['Safari & Eco-Tourism', 'Technology', 'Finance & Banking'],
    currency: 'KES',
    payment: ['M-Pesa', 'Airtel Money', 'Bank Transfer'],
    visa: 'Home market — no visa',
    approxFlightHoursFromKenya: 0,
    tz: 'Africa/Nairobi',
    languages: ['en', 'sw'],
  },
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    lat: 0.316,
    lng: 32.581,
    region: 'east-africa',
    corridorStrength: 'direct',
    topSectors: ['Agriculture', 'Technology', 'Tourism'],
    currency: 'UGX',
    payment: ['MTN Mobile Money', 'Airtel Money', 'Bank Transfer'],
    visa: 'EAC Free Movement',
    approxFlightHoursFromKenya: 1,
    tz: 'Africa/Kampala',
    languages: ['en', 'sw', 'lg'],
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    lat: -6.369,
    lng: 34.889,
    region: 'east-africa',
    corridorStrength: 'direct',
    topSectors: ['Safari & Wildlife', 'Mining', 'Agriculture'],
    currency: 'TZS',
    payment: ['M-Pesa TZ', 'Airtel Money', 'Bank Transfer'],
    visa: 'EAC Free Movement',
    approxFlightHoursFromKenya: 1,
    tz: 'Africa/Dar_es_Salaam',
    languages: ['sw', 'en'],
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    lat: -1.94,
    lng: 29.874,
    region: 'east-africa',
    corridorStrength: 'direct',
    topSectors: ['Technology', 'Finance', 'Hospitality'],
    currency: 'RWF',
    payment: ['MTN MoMo', 'Bank Transfer'],
    visa: 'EAC Free Movement',
    approxFlightHoursFromKenya: 2,
    tz: 'Africa/Kigali',
    languages: ['rw', 'en', 'fr'],
  },
  // ── West Africa ──────────────────────────────────────────────────────────
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    lat: 9.082,
    lng: 8.676,
    region: 'west-africa',
    corridorStrength: 'partner',
    topSectors: ['Fintech', 'Media & Nollywood', 'Energy'],
    currency: 'NGN',
    payment: ['Flutterwave', 'Paystack', 'Bank Transfer'],
    visa: 'AU passport-free movement',
    approxFlightHoursFromKenya: 5,
    tz: 'Africa/Lagos',
    languages: ['en', 'ha', 'yo'],
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    lat: 7.946,
    lng: -1.023,
    region: 'west-africa',
    corridorStrength: 'partner',
    topSectors: ['Gold & Mining', 'Agriculture', 'Technology'],
    currency: 'GHS',
    payment: ['MTN MoMo', 'Vodafone Cash', 'Flutterwave'],
    visa: 'AU passport-free movement',
    approxFlightHoursFromKenya: 6,
    tz: 'Africa/Accra',
    languages: ['en', 'ha'],
  },
  // ── Southern Africa ──────────────────────────────────────────────────────
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    lat: -28.671,
    lng: 24.996,
    region: 'southern-africa',
    corridorStrength: 'partner',
    topSectors: ['Finance & Banking', 'Tourism & Wine', 'Mining'],
    currency: 'ZAR',
    payment: ['EFT', 'PayFast', 'Flutterwave'],
    visa: 'General Work Visa / Critical Skills',
    approxFlightHoursFromKenya: 4,
    tz: 'Africa/Johannesburg',
    languages: ['en', 'zu', 'nl'],
  },
  // ── Middle East ──────────────────────────────────────────────────────────
  {
    code: 'AE',
    name: 'UAE / Dubai',
    flag: '🇦🇪',
    lat: 23.424,
    lng: 53.848,
    region: 'middle-east',
    corridorStrength: 'direct',
    topSectors: ['Hospitality', 'Construction', 'Finance'],
    currency: 'AED',
    payment: ['Bank Transfer', 'Western Union', 'Wise'],
    visa: 'Employment visa via employer (fast)',
    approxFlightHoursFromKenya: 4,
    tz: 'Asia/Dubai',
    languages: ['ar', 'en'],
  },
  // ── Europe ───────────────────────────────────────────────────────────────
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    lat: 51.166,
    lng: 10.451,
    region: 'europe',
    corridorStrength: 'direct',
    topSectors: ['Healthcare', 'Engineering', 'IT'],
    currency: 'EUR',
    payment: ['SEPA Transfer', 'Wise', 'PayPal'],
    visa: 'Skilled Worker Visa — EU Blue Card',
    approxFlightHoursFromKenya: 9,
    tz: 'Europe/Berlin',
    languages: ['de', 'en'],
  },
  {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    lat: 47.39,
    lng: 8.23,
    region: 'europe',
    corridorStrength: 'partner',
    topSectors: ['Finance & Banking', 'Pharma & Biotech', 'Hospitality'],
    currency: 'CHF',
    payment: ['TWINT', 'SEPA', 'Stripe', 'PayPal'],
    visa: 'L/B Permit — Skilled Worker',
    approxFlightHoursFromKenya: 9,
    tz: 'Europe/Zurich',
    languages: ['de', 'fr', 'en'],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    lat: 55.378,
    lng: -3.436,
    region: 'europe',
    corridorStrength: 'direct',
    topSectors: ['NHS Healthcare', 'Technology', 'Finance'],
    currency: 'GBP',
    payment: ['Bank Transfer', 'Wise', 'PayPal'],
    visa: 'Skilled Worker Visa (employer sponsor)',
    approxFlightHoursFromKenya: 9,
    tz: 'Europe/London',
    languages: ['en'],
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    lat: 52.133,
    lng: 5.291,
    region: 'europe',
    corridorStrength: 'partner',
    topSectors: ['Technology', 'Logistics', 'Agriculture'],
    currency: 'EUR',
    payment: ['iDEAL', 'SEPA', 'Wise'],
    visa: 'EU Blue Card / Highly Skilled Migrant',
    approxFlightHoursFromKenya: 9,
    tz: 'Europe/Amsterdam',
    languages: ['nl', 'en', 'de'],
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    lat: 46.603,
    lng: 1.888,
    region: 'europe',
    corridorStrength: 'emerging',
    topSectors: ['Tourism', 'Fashion & Design', 'Agriculture'],
    currency: 'EUR',
    payment: ['SEPA', 'PayPal', 'Wise'],
    visa: 'Talent Passport / Work Permit',
    approxFlightHoursFromKenya: 9,
    tz: 'Europe/Paris',
    languages: ['fr', 'en'],
  },
  // ── Americas ─────────────────────────────────────────────────────────────
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    lat: 37.09,
    lng: -95.713,
    region: 'americas',
    corridorStrength: 'partner',
    topSectors: ['Technology', 'Healthcare', 'Research & Academia'],
    currency: 'USD',
    payment: ['ACH', 'Stripe', 'PayPal', 'Wise'],
    visa: 'H-1B / O-1 / EB visa (sponsor required)',
    approxFlightHoursFromKenya: 16,
    tz: 'America/New_York',
    languages: ['en'],
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    lat: 56.13,
    lng: -106.347,
    region: 'americas',
    corridorStrength: 'direct',
    topSectors: ['Healthcare', 'Technology', 'Agriculture'],
    currency: 'CAD',
    payment: ['Interac', 'Stripe', 'Wise'],
    visa: 'Express Entry — fastest immigration',
    approxFlightHoursFromKenya: 17,
    tz: 'America/Toronto',
    languages: ['en', 'fr'],
  },
  // ── South Asia ───────────────────────────────────────────────────────────
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    lat: 20.594,
    lng: 78.963,
    region: 'south-asia',
    corridorStrength: 'partner',
    topSectors: ['IT Services', 'Manufacturing', 'Trade & Logistics'],
    currency: 'INR',
    payment: ['UPI', 'Bank Transfer', 'Wise'],
    visa: 'Employment Visa / e-Visa',
    approxFlightHoursFromKenya: 5,
    tz: 'Asia/Kolkata',
    languages: ['en', 'hi'],
  },
  // ── South-East Asia ─────────────────────────────────────────────────────
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    lat: 13.75,
    lng: 100.5,
    region: 'south-asia',
    corridorStrength: 'partner',
    topSectors: ['Tourism', 'Manufacturing', 'Tech', 'Agriculture', 'Healthcare'],
    currency: 'THB',
    payment: ['Bank Transfer', 'PromptPay', 'Stripe'],
    visa: 'Tourist visa on arrival, Work Permit required',
    approxFlightHoursFromKenya: 9,
    tz: 'Asia/Bangkok',
    languages: ['en'],
  },
  // ── Oceania ──────────────────────────────────────────────────────────────
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    lat: -25.274,
    lng: 133.775,
    region: 'oceania',
    corridorStrength: 'emerging',
    topSectors: ['Agriculture', 'Mining', 'Healthcare'],
    currency: 'AUD',
    payment: ['Bank Transfer', 'PayPal', 'Wise'],
    visa: 'Skilled Migration Programme (points-based)',
    approxFlightHoursFromKenya: 12,
    tz: 'Australia/Sydney',
    languages: ['en'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Proximity engine
// ─────────────────────────────────────────────────────────────────────────────

/** Haversine distance in km between two lat/lng points */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Threshold (km) below which a country is considered "Nearby" */
export const NEARBY_KM = 1800

/** Proximity label for a distance */
export function proximityLabel(km: number): string {
  if (km < 500) return 'Neighbor'
  if (km < 1800) return 'Nearby'
  if (km < 5000) return 'Regional'
  if (km < 9000) return 'Long-haul'
  return 'Far route'
}

/** Is a country "nearby" relative to an origin country? */
export function isNearby(originCode: string, targetCode: string): boolean {
  const origin = COUNTRY_OPTIONS.find((c) => c.code === originCode)
  const target = COUNTRY_OPTIONS.find((c) => c.code === targetCode)
  if (!origin || !target || originCode === targetCode) return false
  return distanceKm(origin.lat, origin.lng, target.lat, target.lng) < NEARBY_KM
}

/** Get a sorted list of countries by proximity to a given origin */
export function sortedByProximity(originCode: string): CountryOption[] {
  const origin = COUNTRY_OPTIONS.find((c) => c.code === originCode)
  if (!origin) return COUNTRY_OPTIONS
  return [...COUNTRY_OPTIONS]
    .filter((c) => c.code !== originCode)
    .sort(
      (a, b) =>
        distanceKm(origin.lat, origin.lng, a.lat, a.lng) -
        distanceKm(origin.lat, origin.lng, b.lat, b.lng)
    )
}

/** Get countries grouped by region cluster, with nearby flag */
export function getGroupedCountries(
  originCode: string,
  excludeSelf = true
): {
  cluster: RegionClusterConfig
  countries: (CountryOption & { isNearby: boolean; distKm: number })[]
}[] {
  const origin = COUNTRY_OPTIONS.find((c) => c.code === originCode)
  const countries = COUNTRY_OPTIONS.filter((c) => (excludeSelf ? c.code !== originCode : true)).map(
    (c) => ({
      ...c,
      isNearby: origin ? distanceKm(origin.lat, origin.lng, c.lat, c.lng) < NEARBY_KM : false,
      distKm: origin ? Math.round(distanceKm(origin.lat, origin.lng, c.lat, c.lng)) : 0,
    })
  )

  // Group by region, put nearby-heavy clusters first
  return REGION_CLUSTERS.map((cluster) => ({
    cluster,
    countries: countries.filter((c) => c.region === cluster.key),
  })).filter((g) => g.countries.length > 0)
}

// ─────────────────────────────────────────────────────────────────────────────
// Corridor badge config
// ─────────────────────────────────────────────────────────────────────────────

export const CORRIDOR_BADGE: Record<CorridorStrength, { label: string; className: string }> = {
  direct: {
    label: 'Direct Route',
    className: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40',
  },
  partner: {
    label: 'Partner Route',
    className: 'bg-blue-900/60    text-blue-300    border border-blue-700/40',
  },
  emerging: {
    label: 'Emerging',
    className: 'bg-[#C9A227]/10   text-[#C9A227]   border border-[#C9A227]/30',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Priority number display (Unicode circled numbers ①–⑩)
// ─────────────────────────────────────────────────────────────────────────────

const PRIORITY_CHARS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
export function priorityChar(n: number): string {
  return PRIORITY_CHARS[n - 1] ?? String(n)
}

/** Max countries a Pioneer can select in the priority selector */
export const MAX_COUNTRY_SELECTIONS = 5

// ─────────────────────────────────────────────────────────────────────────────
// Language-based collaboration matching
// ─────────────────────────────────────────────────────────────────────────────

/** Get all countries that share a language with the given country */
export function getCountriesBySharedLanguage(
  countryCode: string
): { language: Language; countries: CountryOption[] }[] {
  const country = COUNTRY_OPTIONS.find((c) => c.code === countryCode)
  if (!country) return []

  return country.languages
    .map((langCode) => {
      const language = LANGUAGE_REGISTRY[langCode]
      const countries = COUNTRY_OPTIONS.filter(
        (c) => c.code !== countryCode && c.languages.includes(langCode)
      )
      return { language, countries }
    })
    .filter((g) => g.countries.length > 0)
}

/** Get all countries where a specific language is spoken */
export function getCountriesForLanguage(langCode: LanguageCode): CountryOption[] {
  return COUNTRY_OPTIONS.filter((c) => c.languages.includes(langCode))
}

/** Get all unique languages across all countries — useful for filter UIs */
export function getAllLanguages(): Language[] {
  const seen = new Set<LanguageCode>()
  const result: Language[] = []
  for (const c of COUNTRY_OPTIONS) {
    for (const l of c.languages) {
      if (!seen.has(l)) {
        seen.add(l)
        result.push(LANGUAGE_REGISTRY[l])
      }
    }
  }
  return result
}

/**
 * Language overlap score between two countries (0–1).
 * Used by the matching engine to boost corridor strength
 * when Pioneer and destination share languages.
 */
export function languageOverlap(codeA: string, codeB: string): number {
  const a = COUNTRY_OPTIONS.find((c) => c.code === codeA)
  const b = COUNTRY_OPTIONS.find((c) => c.code === codeB)
  if (!a || !b) return 0
  const shared = a.languages.filter((l) => b.languages.includes(l))
  const total = new Set([...a.languages, ...b.languages]).size
  return total > 0 ? shared.length / total : 0
}

/** Get countries grouped by language — for language-first UI views */
export function getGroupedByLanguage(): { language: Language; countries: CountryOption[] }[] {
  return Object.values(LANGUAGE_REGISTRY)
    .map((lang) => ({
      language: lang,
      countries: COUNTRY_OPTIONS.filter((c) => c.languages.includes(lang.code)),
    }))
    .filter((g) => g.countries.length > 0)
    .sort((a, b) => b.countries.length - a.countries.length)
}

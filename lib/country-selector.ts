/**
 * Be[Country] Platform — Country Selector Data & Proximity Engine
 *
 * SINGLE SOURCE OF TRUTH for:
 *   - All selectable countries (for compass, onboarding, route planning)
 *   - Geographic coordinates (for proximity clustering)
 *   - Region clusters (for visual grouping in UI)
 *   - Corridor strength (direct / partner / emerging)
 *
 * Used by:
 *   - components/CountryPrioritySelector.tsx (compass step 1 + onboarding)
 *   - app/compass/page.tsx
 *   - app/onboarding/page.tsx
 *
 * DO NOT duplicate country lists elsewhere. Import from here.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
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
  { key: 'east-africa',    label: 'East Africa',     emoji: '🌍', description: 'EAC corridor — free movement & M-Pesa' },
  { key: 'west-africa',    label: 'West Africa',     emoji: '🌍', description: 'ECOWAS & Pan-African trade' },
  { key: 'southern-africa',label: 'Southern Africa', emoji: '🌍', description: 'SADC markets & mining corridor' },
  { key: 'middle-east',    label: 'Middle East',     emoji: '🏜️', description: 'Gulf opportunity corridor' },
  { key: 'europe',         label: 'Europe',          emoji: '🏛️', description: 'Skilled worker visa routes' },
  { key: 'americas',       label: 'Americas',        emoji: '🌎', description: 'Diaspora & tech hub routes' },
  { key: 'south-asia',     label: 'South Asia',      emoji: '🌏', description: 'Trade & tech corridor' },
  { key: 'oceania',        label: 'Oceania',         emoji: '🌏', description: 'Skilled migration programme' },
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
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    lat: -1.940,
    lng: 29.874,
    region: 'east-africa',
    corridorStrength: 'direct',
    topSectors: ['Technology', 'Finance', 'Hospitality'],
    currency: 'RWF',
    payment: ['MTN MoMo', 'Bank Transfer'],
    visa: 'EAC Free Movement',
    approxFlightHoursFromKenya: 2,
    tz: 'Africa/Kigali',
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
  },
  // ── Americas ─────────────────────────────────────────────────────────────
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    lat: 37.090,
    lng: -95.713,
    region: 'americas',
    corridorStrength: 'partner',
    topSectors: ['Technology', 'Healthcare', 'Research & Academia'],
    currency: 'USD',
    payment: ['ACH', 'Stripe', 'PayPal', 'Wise'],
    visa: 'H-1B / O-1 / EB visa (sponsor required)',
    approxFlightHoursFromKenya: 16,
    tz: 'America/New_York',
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    lat: 56.130,
    lng: -106.347,
    region: 'americas',
    corridorStrength: 'direct',
    topSectors: ['Healthcare', 'Technology', 'Agriculture'],
    currency: 'CAD',
    payment: ['Interac', 'Stripe', 'Wise'],
    visa: 'Express Entry — fastest immigration',
    approxFlightHoursFromKenya: 17,
    tz: 'America/Toronto',
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
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Proximity engine
// ─────────────────────────────────────────────────────────────────────────────

/** Haversine distance in km between two lat/lng points */
export function distanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Threshold (km) below which a country is considered "Nearby" */
export const NEARBY_KM = 1800

/** Proximity label for a distance */
export function proximityLabel(km: number): string {
  if (km < 500)  return 'Neighbor'
  if (km < 1800) return 'Nearby'
  if (km < 5000) return 'Regional'
  if (km < 9000) return 'Long-haul'
  return 'Far route'
}

/** Is a country "nearby" relative to an origin country? */
export function isNearby(originCode: string, targetCode: string): boolean {
  const origin = COUNTRY_OPTIONS.find(c => c.code === originCode)
  const target = COUNTRY_OPTIONS.find(c => c.code === targetCode)
  if (!origin || !target || originCode === targetCode) return false
  return distanceKm(origin.lat, origin.lng, target.lat, target.lng) < NEARBY_KM
}

/** Get a sorted list of countries by proximity to a given origin */
export function sortedByProximity(originCode: string): CountryOption[] {
  const origin = COUNTRY_OPTIONS.find(c => c.code === originCode)
  if (!origin) return COUNTRY_OPTIONS
  return [...COUNTRY_OPTIONS]
    .filter(c => c.code !== originCode)
    .sort((a, b) =>
      distanceKm(origin.lat, origin.lng, a.lat, a.lng) -
      distanceKm(origin.lat, origin.lng, b.lat, b.lng)
    )
}

/** Get countries grouped by region cluster, with nearby flag */
export function getGroupedCountries(
  originCode: string,
  excludeSelf = true
): { cluster: RegionClusterConfig; countries: (CountryOption & { isNearby: boolean; distKm: number })[] }[] {
  const origin = COUNTRY_OPTIONS.find(c => c.code === originCode)
  const countries = COUNTRY_OPTIONS
    .filter(c => excludeSelf ? c.code !== originCode : true)
    .map(c => ({
      ...c,
      isNearby: origin ? distanceKm(origin.lat, origin.lng, c.lat, c.lng) < NEARBY_KM : false,
      distKm: origin ? Math.round(distanceKm(origin.lat, origin.lng, c.lat, c.lng)) : 0,
    }))

  // Group by region, put nearby-heavy clusters first
  return REGION_CLUSTERS
    .map(cluster => ({
      cluster,
      countries: countries.filter(c => c.region === cluster.key),
    }))
    .filter(g => g.countries.length > 0)
}

// ─────────────────────────────────────────────────────────────────────────────
// Corridor badge config
// ─────────────────────────────────────────────────────────────────────────────

export const CORRIDOR_BADGE: Record<CorridorStrength, { label: string; className: string }> = {
  direct:   { label: 'Direct Route',   className: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40' },
  partner:  { label: 'Partner Route',  className: 'bg-blue-900/60    text-blue-300    border border-blue-700/40' },
  emerging: { label: 'Emerging',       className: 'bg-amber-900/60   text-amber-300   border border-amber-700/40' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Priority number display (Unicode circled numbers ①–⑩)
// ─────────────────────────────────────────────────────────────────────────────

const PRIORITY_CHARS = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩']
export function priorityChar(n: number): string {
  return PRIORITY_CHARS[n - 1] ?? String(n)
}

/** Max countries a Pioneer can select in the priority selector */
export const MAX_COUNTRY_SELECTIONS = 5

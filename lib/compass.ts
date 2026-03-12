// THE COMPASS — Smart routing engine
// Auto-detects user location, matches to target countries, shows relevant paths

import { PioneerType } from './vocabulary'

export interface CompassReading {
  fromCountry: string // ISO2: detected origin
  fromCountryName: string
  toCountry: string // ISO2: where they want to go
  toCountryName: string
  pioneerType: PioneerType | null
  routeStrength: 'direct' | 'partner' | 'emerging' // how well this route is supported
  matchScore: number // 0-100
  topVentures: string[] // recommended venture IDs
  visaNote: string
  paymentNote: string
}

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

// Geolocation → country code mapping (simplified)
export async function detectCountryFromIP(): Promise<{
  country: string
  countryName: string
}> {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    return {
      country: data.country_code || 'KE',
      countryName: data.country_name || 'Kenya',
    }
  } catch {
    return { country: 'KE', countryName: 'Kenya' } // default to Kenya
  }
}

export function getRouteKey(from: string, to: string): string {
  return `${from}-${to}`
}

export function getRouteInfo(from: string, to: string) {
  return COUNTRY_ROUTES[getRouteKey(from, to)] || null
}

export function getRecommendedRoutes(fromCountry: string): string[] {
  return Object.keys(COUNTRY_ROUTES)
    .filter((k) => k.startsWith(fromCountry))
    .map((k) => k.split('-')[1])
}

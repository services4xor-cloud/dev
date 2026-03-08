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
    primarySectors: ['Safari & Wildlife', 'Eco-Tourism', 'Healthcare', 'Technology'],
    visaNote:
      'Schengen visa required. Germany has high demand for Kenyan professionals in healthcare and tech.',
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
    visaNote:
      'UAE employment visa through employer. High demand for Kenyan hospitality workers.',
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
    visaNote:
      'Canada Express Entry. Kenyan professionals well-regarded in Canadian market.',
    paymentMethods: ['M-Pesa', 'Bank Transfer', 'Wise'],
    strength: 'partner',
  },
  'DE-KE': {
    targetCountries: ['KE'],
    primarySectors: ['Safari & Wildlife', 'Eco-Tourism', 'Charity & NGO'],
    visaNote:
      'No visa for tourism/volunteering up to 90 days. Ideal for eco-tourism ventures.',
    paymentMethods: ['SEPA', 'PayPal', 'Stripe', 'M-Pesa'],
    strength: 'direct',
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
    visaNote:
      'EAC agreement. South Africa-Kenya business corridor well-established.',
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
    .filter(k => k.startsWith(fromCountry))
    .map(k => k.split('-')[1])
}

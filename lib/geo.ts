/**
 * geo.ts — Timezone-based country detection
 *
 * Uses Intl.DateTimeFormat to guess a user's country code
 * from their browser timezone — no external API call needed.
 *
 * Falls back to the deploy country (NEXT_PUBLIC_COUNTRY_CODE).
 */

import { COUNTRY_OPTIONS } from '@/lib/country-selector'

const DEFAULT_COUNTRY = process.env.NEXT_PUBLIC_COUNTRY_CODE ?? 'KE'

/**
 * Detect country code from the browser's timezone.
 *
 * Strategy: match canonical IANA timezone against COUNTRY_OPTIONS[].tz.
 * If no match, returns the deploy-level default.
 */
// ─── Haversine distance (km) ────────────────────────────────────────────────
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = Math.PI / 180
  const dLat = (lat2 - lat1) * toRad
  const dLng = (lng2 - lng1) * toRad
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function fmtDistance(km: number): string {
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${Math.round(km)} km`
}

export function fmtFlightTime(km: number): string {
  const hours = km / 800 // average cruise speed
  if (hours < 1) return `~${Math.round(hours * 60)}min`
  return hours < 10 ? `~${hours.toFixed(1)}h` : `~${Math.round(hours)}h`
}

export function getUtcOffsetMinutes(tz: string): number {
  try {
    const now = new Date()
    const str = now.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    const match = str.match(/GMT([+-]\d{1,2}(?::?\d{2})?)/)
    if (!match) return 0
    const parts = match[1].replace(':', '').match(/^([+-])(\d{1,2})(\d{2})?$/)
    if (!parts) return 0
    const sign = parts[1] === '-' ? -1 : 1
    return sign * (parseInt(parts[2]) * 60 + parseInt(parts[3] ?? '0'))
  } catch {
    return 0
  }
}

export function detectCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const match = COUNTRY_OPTIONS.find((c) => c.tz === tz || tz.startsWith(c.tz.split('/')[0]))
    return match?.code ?? DEFAULT_COUNTRY
  } catch {
    return DEFAULT_COUNTRY
  }
}

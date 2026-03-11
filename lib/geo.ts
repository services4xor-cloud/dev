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
export function detectCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const match = COUNTRY_OPTIONS.find((c) => c.tz === tz || tz.startsWith(c.tz.split('/')[0]))
    return match?.code ?? DEFAULT_COUNTRY
  } catch {
    return DEFAULT_COUNTRY
  }
}

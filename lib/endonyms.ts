/**
 * Country Name Endonyms — localized country names by language
 *
 * When a German user views Kenya, they see "BeKenia" (German endonym).
 * When a Kenyan views Germany in English, they see "BeGermany" (English exonym).
 *
 * This map scales: add a language column, not a separate translation file.
 * Follows ISO 3166-1 alpha-2 for countries, ISO 639-1 for languages.
 *
 * Usage:
 *   import { getLocalizedCountryName } from '@/lib/endonyms'
 *   getLocalizedCountryName('DE', 'de') // → "Deutschland"
 *   getLocalizedCountryName('KE', 'de') // → "Kenia"
 *   getLocalizedCountryName('DE', 'en') // → "Germany"
 */

// ─── Endonym Map ─────────────────────────────────────────────────────────────
// Row = country code, Column = language code → localized name
// Only populate languages where the name differs from English or is commonly used.

const ENDONYMS: Record<string, Record<string, string>> = {
  // ── Africa ─────────────────────────────────────────────
  KE: {
    en: 'Kenya',
    de: 'Kenia',
    fr: 'Kenya',
    sw: 'Kenya',
  },
  NG: {
    en: 'Nigeria',
    de: 'Nigeria',
    fr: 'Nigéria',
    yo: 'Nàìjíríà',
    ha: 'Nijeriya',
  },
  GH: {
    en: 'Ghana',
    de: 'Ghana',
    fr: 'Ghana',
  },
  ZA: {
    en: 'South Africa',
    de: 'Südafrika',
    fr: 'Afrique du Sud',
    zu: 'iNingizimu Afrika',
  },
  UG: {
    en: 'Uganda',
    de: 'Uganda',
    fr: 'Ouganda',
    sw: 'Uganda',
    lg: 'Yuganda',
  },
  TZ: {
    en: 'Tanzania',
    de: 'Tansania',
    fr: 'Tanzanie',
    sw: 'Tanzania',
  },

  // ── Europe ─────────────────────────────────────────────
  DE: {
    en: 'Germany',
    de: 'Deutschland',
    fr: 'Allemagne',
    sw: 'Ujerumani',
  },
  CH: {
    en: 'Switzerland',
    de: 'Schweiz',
    fr: 'Suisse',
  },
  GB: {
    en: 'United Kingdom',
    de: 'Vereinigtes Königreich',
    fr: 'Royaume-Uni',
    sw: 'Uingereza',
  },

  // ── Americas ───────────────────────────────────────────
  US: {
    en: 'United States',
    de: 'Vereinigte Staaten',
    fr: 'États-Unis',
    sw: 'Marekani',
  },
  CA: {
    en: 'Canada',
    de: 'Kanada',
    fr: 'Canada',
  },

  // ── Middle East / Asia ─────────────────────────────────
  AE: {
    en: 'UAE',
    de: 'VAE',
    fr: 'EAU',
    ar: 'الإمارات',
  },
  IN: {
    en: 'India',
    de: 'Indien',
    fr: 'Inde',
    hi: 'भारत',
  },
}

// ─── Default language per country ────────────────────────────────────────────
// What language does the platform default to for each country deployment?

const COUNTRY_DEFAULT_LANGUAGE: Record<string, string> = {
  KE: 'en',
  DE: 'de',
  CH: 'de',
  NG: 'en',
  GH: 'en',
  ZA: 'en',
  UG: 'en',
  TZ: 'sw',
  GB: 'en',
  US: 'en',
  CA: 'en',
  AE: 'en',
  IN: 'en',
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get a country's name in a specific language.
 * Falls back to English, then to the country code itself.
 *
 * @example
 * getLocalizedCountryName('DE', 'de') // → "Deutschland"
 * getLocalizedCountryName('KE', 'de') // → "Kenia"
 * getLocalizedCountryName('DE', 'en') // → "Germany"
 * getLocalizedCountryName('XX', 'en') // → "XX" (unknown country)
 */
export function getLocalizedCountryName(countryCode: string, languageCode: string): string {
  const cc = countryCode.toUpperCase()
  const lc = languageCode.toLowerCase()

  const countryNames = ENDONYMS[cc]
  if (!countryNames) return cc

  // Try exact language match, then English fallback
  return countryNames[lc] ?? countryNames['en'] ?? cc
}

/**
 * Get the default display language for a country.
 * Used when the user hasn't explicitly set a language preference.
 */
export function getDefaultLanguage(countryCode: string): string {
  return COUNTRY_DEFAULT_LANGUAGE[countryCode.toUpperCase()] ?? 'en'
}

/**
 * Get all endonym variants for a country (for search matching).
 * Returns all language variants so "Kenia", "Kenya", "Ujerumani" all match.
 *
 * @example
 * getCountrySearchTerms('DE') // → ["Germany", "Deutschland", "Allemagne", "Ujerumani"]
 */
export function getCountrySearchTerms(countryCode: string): string[] {
  const cc = countryCode.toUpperCase()
  const names = ENDONYMS[cc]
  if (!names) return [cc]

  // Deduplicate (some languages share the same name)
  return Array.from(new Set(Object.values(names)))
}

/**
 * Search across all countries using any language variant.
 * Returns matching country codes.
 *
 * @example
 * searchCountries('Kenia') // → ['KE']
 * searchCountries('deutsch') // → ['DE'] (partial match on 'Deutschland')
 */
export function searchCountries(query: string): string[] {
  const q = query.toLowerCase()
  const matches: string[] = []

  for (const [cc, names] of Object.entries(ENDONYMS)) {
    for (const name of Object.values(names)) {
      if (name.toLowerCase().includes(q)) {
        matches.push(cc)
        break
      }
    }
  }

  return matches
}

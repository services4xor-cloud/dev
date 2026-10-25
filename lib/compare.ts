/**
 * Compare up to three countries: what connects them and where they differ.
 * Registry data (lib/country-selector) only, so it works instantly and offline;
 * live figures are added by the panel from /api/country/[code]/insights.
 */
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { FAITH_OPTIONS } from '@/lib/dimensions'
import { fmtDistance, fmtFlightTime, getUtcOffsetMinutes, haversineKm } from '@/lib/geo'
import type { OpportunityDTO } from '@/lib/opportunities'

export const MAX_COMPARE = 3

type Country = (typeof COUNTRY_OPTIONS)[number]
const BY_CODE = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))
const FAITH_LABEL = new Map(FAITH_OPTIONS.map((f) => [f.id as string, f.label]))

export type LinkKind = 'language' | 'currency' | 'sector' | 'faith' | 'region'

/** Something at least two of the countries have in common. */
export interface SharedTrait {
  kind: LinkKind
  /** Registry key, e.g. 'de' or 'Technology and IT' */
  key: string
  label: string
  /** Which of the compared countries have it (2 or more) */
  codes: string[]
}

export interface Route {
  from: string
  to: string
  distance: string
  flight: string
  /** Hours the clock in `to` is ahead of `from` (negative: behind) */
  hoursAhead: number
}

export interface Comparison {
  codes: string[]
  shared: SharedTrait[]
  /** What only this country has among the compared ones */
  only: Record<string, { languages: string[]; sectors: string[]; faiths: string[] }>
  routes: Route[]
}

export function languageLabel(code: string): string {
  return LANGUAGE_REGISTRY[code as LanguageCode]?.name ?? code
}

function traits(c: Country): Record<LinkKind, { key: string; label: string }[]> {
  return {
    language: c.languages.map((l) => ({ key: l, label: languageLabel(l) })),
    currency: [{ key: c.currency, label: c.currency }],
    sector: c.topSectors.map((s) => ({ key: s, label: s })),
    faith: c.topFaiths.map((f) => ({ key: f, label: FAITH_LABEL.get(f) ?? f })),
    region: [
      {
        key: c.region,
        label: c.region
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
      },
    ],
  }
}

const KIND_ORDER: LinkKind[] = ['language', 'currency', 'region', 'sector', 'faith']

/** Null unless at least two known countries are given. */
export function compareCountries(rawCodes: string[]): Comparison | null {
  const countries = Array.from(new Set(rawCodes.map((c) => c.toUpperCase())))
    .map((c) => BY_CODE.get(c))
    .filter((c): c is Country => !!c)
    .slice(0, MAX_COMPARE)
  if (countries.length < 2) return null
  const codes = countries.map((c) => c.code)
  const all = countries.map(traits)

  const shared: SharedTrait[] = []
  for (const kind of KIND_ORDER) {
    const seen = new Map<string, SharedTrait>()
    all.forEach((t, i) => {
      for (const { key, label } of t[kind]) {
        const s = seen.get(key) ?? { kind, key, label, codes: [] }
        if (!s.codes.includes(codes[i])) s.codes.push(codes[i])
        seen.set(key, s)
      }
    })
    shared.push(
      ...Array.from(seen.values())
        .filter((s) => s.codes.length >= 2)
        .sort((a, b) => b.codes.length - a.codes.length)
    )
  }

  const sharedKeys = new Set(shared.map((s) => `${s.kind}:${s.key}`))
  const only: Comparison['only'] = {}
  all.forEach((t, i) => {
    const mine = (kind: LinkKind) =>
      t[kind].filter((x) => !sharedKeys.has(`${kind}:${x.key}`)).map((x) => x.label)
    only[codes[i]] = {
      languages: mine('language'),
      sectors: mine('sector'),
      faiths: mine('faith'),
    }
  })

  const routes: Route[] = []
  for (let i = 0; i < countries.length; i++)
    for (let j = i + 1; j < countries.length; j++) {
      const a = countries[i]
      const b = countries[j]
      const km = haversineKm(a.lat, a.lng, b.lat, b.lng)
      routes.push({
        from: a.code,
        to: b.code,
        distance: fmtDistance(km),
        flight: fmtFlightTime(km),
        hoursAhead: (getUtcOffsetMinutes(b.tz) - getUtcOffsetMinutes(a.tz)) / 60,
      })
    }

  return { codes, shared, only, routes }
}

/** Countries outside the comparison whose main language or currency connects them. */
export function bridgeCountries(cmp: Comparison): Record<string, number> {
  const langs = cmp.shared.filter((s) => s.kind === 'language').map((s) => s.key)
  const currencies = cmp.shared.filter((s) => s.kind === 'currency').map((s) => s.key)
  const out: Record<string, number> = {}
  for (const c of COUNTRY_OPTIONS) {
    if (cmp.codes.includes(c.code)) continue
    const n = (langs.includes(c.languages[0]) ? 1 : 0) + (currencies.includes(c.currency) ? 1 : 0)
    if (n) out[c.code] = Math.min(1, n / Math.max(1, langs.length + currencies.length))
  }
  return out
}

export interface ConnectedOffering {
  offering: OpportunityDTO
  reasons: string[]
}

/**
 * Offerings that fit the compared countries: located in one of them, in a sector
 * they are strong in, or in a country that shares their language or currency.
 * Most connections first.
 */
export function connectedOfferings(
  offerings: OpportunityDTO[],
  cmp: Comparison
): ConnectedOffering[] {
  const name = (code: string) => BY_CODE.get(code)?.name ?? code
  const sharedLangs = cmp.shared.filter((s) => s.kind === 'language')
  const sharedCurrency = cmp.shared.find((s) => s.kind === 'currency')
  const out: ConnectedOffering[] = []
  for (const o of offerings) {
    const reasons: string[] = []
    const cc = o.properties.countryCode
    const home = cc ? BY_CODE.get(cc) : undefined
    if (cc && cmp.codes.includes(cc)) reasons.push(`In ${name(cc)}`)
    const sector = o.properties.sector
    if (sector) {
      const strongIn = cmp.codes.filter((c) => BY_CODE.get(c)?.topSectors.includes(sector))
      if (strongIn.length) reasons.push(`${sector}: strong in ${strongIn.map(name).join(' and ')}`)
    }
    if (home && !cmp.codes.includes(home.code)) {
      // Only the main language counts: English as a second language connects half the world
      const lang = sharedLangs.find((s) => s.key === home.languages[0])
      if (lang) reasons.push(`${home.name} also speaks ${lang.label}`)
      if (sharedCurrency && home.currency === sharedCurrency.key)
        reasons.push(`${home.name} also pays in ${sharedCurrency.label}`)
    }
    if (reasons.length) out.push({ offering: o, reasons })
  }
  return out.sort((a, b) => b.reasons.length - a.reasons.length)
}

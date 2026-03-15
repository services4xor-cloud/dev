/**
 * Hybrid country data layer
 *
 * Generic data (name, flag, currency, languages, region, timezone)
 * comes from REST Countries API — always current, no API key needed.
 *
 * Be[X]-specific data (sectors, payment, visa, corridor strength)
 * comes from static COUNTRY_OPTIONS — business logic we curate.
 *
 * Falls back to static data if the API is unreachable.
 */

import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from './country-selector'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CountryData {
  code: string
  name: string
  officialName: string
  flagUrl: string // SVG from REST Countries
  flagPng: string // PNG fallback
  currency: string // e.g. "UAH"
  currencyName: string // e.g. "Ukrainian hryvnia"
  currencySymbol: string // e.g. "₴"
  languages: { code: string; name: string; nativeName?: string }[]
  region: string
  subregion: string
  capital: string
  timezone: string
  population: number
  // Be[X]-specific (from static registry)
  topSectors: string[]
  topFaiths: string[]
  payment: string[]
  visa: string
  corridorStrength: string
}

// ─── ISO 639-2 → 639-1 mapping (REST Countries uses 3-letter codes) ────────

const ISO639_2_TO_1: Record<string, string> = {
  afr: 'af',
  amh: 'am',
  ara: 'ar',
  aym: 'ay',
  aze: 'az',
  bel: 'be',
  ben: 'bn',
  bis: 'bi',
  bos: 'bs',
  bul: 'bg',
  cat: 'ca',
  ces: 'cs',
  cha: 'ch',
  zho: 'zh',
  cnr: 'sr', // Montenegrin → sr
  dan: 'da',
  deu: 'de',
  div: 'dv',
  dzo: 'dz',
  ell: 'el',
  eng: 'en',
  est: 'et',
  eus: 'eu',
  fas: 'fa',
  fin: 'fi',
  fij: 'fj',
  fra: 'fr',
  gle: 'ga',
  glg: 'gl',
  grn: 'gn',
  guj: 'gu',
  hat: 'ht',
  hau: 'ha',
  hbs: 'sh',
  heb: 'he',
  hin: 'hi',
  hrv: 'hr',
  hun: 'hu',
  hye: 'hy',
  ido: 'io',
  iku: 'iu',
  ind: 'id',
  isl: 'is',
  ita: 'it',
  jam: 'en',
  jpn: 'ja',
  jav: 'jv',
  kal: 'kl',
  kan: 'kn',
  kas: 'ks',
  kat: 'ka',
  kaz: 'kk',
  khm: 'km',
  kin: 'rw',
  kir: 'ky',
  kor: 'ko',
  kur: 'ku',
  lao: 'lo',
  lat: 'la',
  lav: 'lv',
  lit: 'lt',
  ltz: 'lb',
  lug: 'lg',
  mal: 'ml',
  mar: 'mr',
  mkd: 'mk',
  mlg: 'mg',
  mlt: 'mt',
  mon: 'mn',
  mri: 'mi',
  msa: 'ms',
  mya: 'my',
  nau: 'na',
  nbl: 'nr',
  nde: 'nd',
  nep: 'ne',
  nld: 'nl',
  nno: 'nn',
  nob: 'nb',
  nor: 'no',
  nya: 'ny',
  ori: 'or',
  pan: 'pa',
  pol: 'pl',
  por: 'pt',
  prs: 'fa',
  pus: 'ps',
  que: 'qu',
  roh: 'rm',
  ron: 'ro',
  run: 'rn',
  rus: 'ru',
  sag: 'sg',
  sin: 'si',
  slk: 'sk',
  slv: 'sl',
  smo: 'sm',
  sna: 'sn',
  som: 'so',
  sot: 'st',
  spa: 'es',
  sqi: 'sq',
  srp: 'sr',
  ssw: 'ss',
  swa: 'sw',
  swe: 'sv',
  tam: 'ta',
  tat: 'tt',
  tel: 'te',
  tgk: 'tg',
  tha: 'th',
  tir: 'ti',
  tkl: 'tk',
  toi: 'to',
  ton: 'to',
  tsn: 'tn',
  tso: 'ts',
  tuk: 'tk',
  tur: 'tr',
  ukr: 'uk',
  urd: 'ur',
  uzb: 'uz',
  ven: 've',
  vie: 'vi',
  xho: 'xh',
  yor: 'yo',
  zha: 'za',
  zul: 'zu',
}

// ─── Cache ───────────────────────────────────────────────────────────────────

let _cache: Map<string, CountryData> | null = null
let _cacheTime = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// ─── API fetch ───────────────────────────────────────────────────────────────

interface RestCountry {
  cca2: string
  name: { common: string; official: string }
  flags: { svg: string; png: string }
  currencies?: Record<string, { name: string; symbol: string }>
  languages?: Record<string, string>
  region: string
  subregion?: string
  capital?: string[]
  timezones: string[]
  population: number
}

async function fetchAllCountries(): Promise<RestCountry[]> {
  const res = await fetch(
    'https://restcountries.com/v3.1/all?fields=cca2,name,flags,currencies,languages,region,subregion,capital,timezones,population',
    { next: { revalidate: 3600 } } // Next.js ISR: revalidate every hour
  )
  if (!res.ok) throw new Error(`REST Countries API error: ${res.status}`)
  return res.json()
}

function mapRestCountry(rc: RestCountry): CountryData {
  // Get static Be[X] data if available
  const staticData = COUNTRY_OPTIONS.find((c) => c.code === rc.cca2)

  // Map languages: REST Countries uses ISO 639-2 (3-letter), we use 639-1 (2-letter)
  const languages: CountryData['languages'] = []
  if (rc.languages) {
    for (const [iso3, langName] of Object.entries(rc.languages)) {
      const iso1 = ISO639_2_TO_1[iso3]
      const registryLang = iso1 ? LANGUAGE_REGISTRY[iso1 as LanguageCode] : null
      languages.push({
        code: iso1 ?? iso3,
        name: registryLang?.name ?? langName,
        nativeName: registryLang?.nativeName,
      })
    }
  }

  // Currency — take the first one
  const currEntries = rc.currencies ? Object.entries(rc.currencies) : []
  const [currCode, currInfo] = currEntries[0] ?? ['—', { name: '', symbol: '' }]

  // Timezone — prefer capital timezone, strip UTC prefix if needed
  const tz = rc.timezones[0] ?? ''

  return {
    code: rc.cca2,
    name: rc.name.common,
    officialName: rc.name.official,
    flagUrl: rc.flags.svg,
    flagPng: rc.flags.png,
    currency: currCode,
    currencyName: currInfo.name,
    currencySymbol: currInfo.symbol,
    languages,
    region: staticData?.region ?? rc.subregion ?? rc.region,
    subregion: rc.subregion ?? rc.region,
    capital: rc.capital?.[0] ?? '',
    timezone: staticData?.tz ?? tz,
    population: rc.population,
    // Be[X]-specific: from static registry, with sensible defaults
    topSectors: staticData?.topSectors ?? [],
    topFaiths: staticData?.topFaiths ?? [],
    payment: staticData?.payment ?? ['Bank Transfer'],
    visa: staticData?.visa ?? 'Visa required',
    corridorStrength: staticData?.corridorStrength ?? 'frontier',
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Get data for a single country by ISO alpha-2 code. Server-side only. */
export async function getCountryData(code: string): Promise<CountryData | null> {
  const upperCode = code.toUpperCase()

  // Check cache
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) {
    return _cache.get(upperCode) ?? null
  }

  // Try API
  try {
    const all = await fetchAllCountries()
    _cache = new Map()
    for (const rc of all) {
      _cache.set(rc.cca2, mapRestCountry(rc))
    }
    _cacheTime = Date.now()
    return _cache.get(upperCode) ?? null
  } catch {
    // API down — fall back to static data
    return getStaticFallback(upperCode)
  }
}

/** Static fallback when API is unreachable */
function getStaticFallback(code: string): CountryData | null {
  const s = COUNTRY_OPTIONS.find((c) => c.code === code)
  if (!s) return null

  const languages = s.languages
    .map((lc) => {
      const lang = LANGUAGE_REGISTRY[lc]
      return lang ? { code: lc, name: lang.name, nativeName: lang.nativeName } : null
    })
    .filter(Boolean) as CountryData['languages']

  return {
    code: s.code,
    name: s.name,
    officialName: s.name,
    flagUrl: `https://flagcdn.com/${s.code.toLowerCase()}.svg`,
    flagPng: `https://flagcdn.com/w80/${s.code.toLowerCase()}.png`,
    currency: s.currency,
    currencyName: s.currency,
    currencySymbol: '',
    languages,
    region: s.region,
    subregion: s.region,
    capital: '',
    timezone: s.tz,
    population: 0,
    topSectors: s.topSectors,
    topFaiths: s.topFaiths,
    payment: s.payment,
    visa: s.visa,
    corridorStrength: s.corridorStrength,
  }
}

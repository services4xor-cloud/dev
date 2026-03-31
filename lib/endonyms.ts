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
    es: 'Kenia',
    pt: 'Quênia',
    ru: 'Кения',
    ja: 'ケニア',
    ko: '케냐',
    zh: '肯尼亚',
    tr: 'Kenya',
    id: 'Kenya',
    ar: 'كينيا',
    hi: 'केन्या',
  },
  NG: {
    en: 'Nigeria',
    de: 'Nigeria',
    fr: 'Nigéria',
    sw: 'Nigeria',
    es: 'Nigeria',
    pt: 'Nigéria',
    yo: 'Nàìjíríà',
    ha: 'Nijeriya',
    ar: 'نيجيريا',
  },
  GH: {
    en: 'Ghana',
    de: 'Ghana',
    fr: 'Ghana',
    sw: 'Ghana',
  },
  ZA: {
    en: 'South Africa',
    de: 'Südafrika',
    fr: 'Afrique du Sud',
    sw: 'Afrika Kusini',
    es: 'Sudáfrica',
    pt: 'África do Sul',
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
    es: 'Alemania',
    pt: 'Alemanha',
    ru: 'Германия',
    ja: 'ドイツ',
    ko: '독일',
    zh: '德国',
    tr: 'Almanya',
    id: 'Jerman',
    ar: 'ألمانيا',
    hi: 'जर्मनी',
  },
  CH: {
    en: 'Switzerland',
    de: 'Schweiz',
    fr: 'Suisse',
    sw: 'Uswisi',
    es: 'Suiza',
    pt: 'Suíça',
    ru: 'Швейцария',
    ja: 'スイス',
    ko: '스위스',
    zh: '瑞士',
    tr: 'İsviçre',
    id: 'Swiss',
    ar: 'سويسرا',
    hi: 'स्विट्ज़रलैंड',
  },
  GB: {
    en: 'United Kingdom',
    de: 'Vereinigtes Königreich',
    fr: 'Royaume-Uni',
    sw: 'Uingereza',
    es: 'Reino Unido',
    pt: 'Reino Unido',
    ru: 'Великобритания',
    ja: 'イギリス',
    ko: '영국',
    zh: '英国',
    tr: 'Birleşik Krallık',
    ar: 'المملكة المتحدة',
    hi: 'यूनाइटेड किंगडम',
  },

  // ── Americas ───────────────────────────────────────────
  US: {
    en: 'United States',
    de: 'Vereinigte Staaten',
    fr: 'États-Unis',
    sw: 'Marekani',
    es: 'Estados Unidos',
    pt: 'Estados Unidos',
    ru: 'США',
    ja: 'アメリカ',
    ko: '미국',
    zh: '美国',
    tr: 'Amerika Birleşik Devletleri',
    ar: 'الولايات المتحدة',
  },
  CA: {
    en: 'Canada',
    de: 'Kanada',
    fr: 'Canada',
    es: 'Canadá',
    pt: 'Canadá',
    ru: 'Канада',
    ja: 'カナダ',
    zh: '加拿大',
    ar: 'كندا',
  },
  BR: {
    en: 'Brazil',
    de: 'Brasilien',
    fr: 'Brésil',
    pt: 'Brasil',
    es: 'Brasil',
    sw: 'Brazili',
  },

  // ── Middle East / Asia ─────────────────────────────────
  AE: {
    en: 'UAE',
    de: 'VAE',
    fr: 'EAU',
    ar: 'الإمارات',
    es: 'EAU',
  },
  IN: {
    en: 'India',
    de: 'Indien',
    fr: 'Inde',
    hi: 'भारत',
    es: 'India',
    pt: 'Índia',
    ru: 'Индия',
    ja: 'インド',
    ko: '인도',
    zh: '印度',
    ar: 'الهند',
    tr: 'Hindistan',
  },
  CN: {
    en: 'China',
    de: 'China',
    fr: 'Chine',
    zh: '中国',
    es: 'China',
    pt: 'China',
    ru: 'Китай',
    ja: '中国',
    ko: '중국',
    ar: 'الصين',
  },
  JP: {
    en: 'Japan',
    de: 'Japan',
    fr: 'Japon',
    ja: '日本',
    es: 'Japón',
    zh: '日本',
    ko: '일본',
    ru: 'Япония',
  },
  KR: {
    en: 'South Korea',
    de: 'Südkorea',
    fr: 'Corée du Sud',
    ko: '대한민국',
    ja: '韓国',
    zh: '韩国',
    es: 'Corea del Sur',
  },
  TR: {
    en: 'Turkey',
    de: 'Türkei',
    fr: 'Turquie',
    tr: 'Türkiye',
    es: 'Turquía',
    ar: 'تركيا',
    ru: 'Турция',
  },
  RU: {
    en: 'Russia',
    de: 'Russland',
    fr: 'Russie',
    ru: 'Россия',
    es: 'Rusia',
    zh: '俄罗斯',
    ja: 'ロシア',
    ar: 'روسيا',
    tr: 'Rusya',
  },
  ES: {
    en: 'Spain',
    de: 'Spanien',
    fr: 'Espagne',
    es: 'España',
    pt: 'Espanha',
    ar: 'إسبانيا',
  },
  FR: {
    en: 'France',
    de: 'Frankreich',
    fr: 'France',
    es: 'Francia',
    pt: 'França',
    ar: 'فرنسا',
    sw: 'Ufaransa',
  },
  ID: {
    en: 'Indonesia',
    de: 'Indonesien',
    fr: 'Indonésie',
    id: 'Indonesia',
    es: 'Indonesia',
    zh: '印度尼西亚',
    ar: 'إندونيسيا',
  },
}

// ─── Default language per country ────────────────────────────────────────────
// Derived from COUNTRY_OPTIONS — first language in each country's languages[] array
// is the default. No hardcoded map needed.

// ─── Public API ──────────────────────────────────────────────────────────────

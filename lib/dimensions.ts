/**
 * Dimension Registries — Faith, Craft, Reach, Culture
 *
 * Four identity dimensions that power the BeNetwork matching engine.
 * These registries provide options, suggestions, and lookups for
 * Explorer profiles and Discovery routing.
 */

// ---------------------------------------------------------------------------
// Faith
// ---------------------------------------------------------------------------

export type FaithId =
  | 'islam'
  | 'christianity'
  | 'secular'
  | 'hinduism'
  | 'buddhism'
  | 'judaism'
  | 'traditional'
  | 'other'

export interface FaithOption {
  id: FaithId
  label: string // Fallback (English)
  labelKey: string // i18n key
  icon: string
}

export const FAITH_OPTIONS: FaithOption[] = [
  { id: 'islam', label: 'Islam', labelKey: 'faith.islam', icon: '☪️' },
  { id: 'christianity', label: 'Christianity', labelKey: 'faith.christianity', icon: '✝️' },
  { id: 'secular', label: 'Secular / Non-religious', labelKey: 'faith.secular', icon: '🌐' },
  { id: 'hinduism', label: 'Hinduism', labelKey: 'faith.hinduism', icon: '🕉️' },
  { id: 'buddhism', label: 'Buddhism', labelKey: 'faith.buddhism', icon: '☸️' },
  { id: 'judaism', label: 'Judaism', labelKey: 'faith.judaism', icon: '✡️' },
  {
    id: 'traditional',
    label: 'Traditional / Indigenous',
    labelKey: 'faith.traditional',
    icon: '🌿',
  },
  { id: 'other', label: 'Other', labelKey: 'faith.other', icon: '🤍' },
]

// ---------------------------------------------------------------------------
// Craft (skill / profession tags)
// ---------------------------------------------------------------------------

export const CRAFT_SUGGESTIONS: string[] = [
  // Tech
  'Software Engineering',
  'Data Science',
  'UX Design',
  'Cybersecurity',
  'DevOps',
  'Cloud Architecture',
  'AI/ML',
  'Mobile Development',
  'Frontend Development',
  'Backend Development',
  'Blockchain',
  'QA Engineering',

  // Business
  'Finance',
  'Marketing',
  'Sales',
  'Consulting',
  'Project Management',
  'Accounting',
  'HR',
  'Entrepreneurship',
  'Supply Chain',
  'Business Analysis',

  // Creative
  'Photography',
  'Videography',
  'Graphic Design',
  'Music Production',
  'Writing',
  'Animation',
  'Fashion Design',
  'Interior Design',
  'Content Creation',
  'Illustration',

  // Trades
  'Construction',
  'Electrical',
  'Plumbing',
  'Mechanics',
  'Welding',
  'Carpentry',
  'Masonry',
  'HVAC',

  // Health
  'Medicine',
  'Nursing',
  'Pharmacy',
  'Nutrition',
  'Physiotherapy',
  'Psychology',
  'Dentistry',
  'Public Health',

  // Education
  'Teaching',
  'Tutoring',
  'Curriculum Design',
  'Language Instruction',
  'Research',
  'Academic Writing',

  // Nature
  'Safari Guide',
  'Conservation',
  'Marine Biology',
  'Agriculture',
  'Forestry',
  'Veterinary',

  // Service
  'Hospitality',
  'Culinary Arts',
  'Event Planning',
  'Security',
  'Logistics',
  'Tourism',
  'Translation',
  'Social Work',
]

// ---------------------------------------------------------------------------
// Reach
// ---------------------------------------------------------------------------

export type ReachId =
  | 'can-travel'
  | 'can-host'
  | 'can-invest'
  | 'digital-only'
  | 'can-mentor'
  | 'can-relocate'

export interface ReachOption {
  id: ReachId
  label: string // Fallback (English)
  labelKey: string // i18n key for label
  descKey: string // i18n key for description
  icon: string
  description: string // Fallback (English)
}

export const REACH_OPTIONS: ReachOption[] = [
  {
    id: 'can-travel',
    label: 'Can Travel',
    labelKey: 'reach.canTravel',
    descKey: 'reach.canTravel.desc',
    icon: '✈️',
    description: 'Willing and able to travel for opportunities',
  },
  {
    id: 'can-host',
    label: 'Can Host',
    labelKey: 'reach.canHost',
    descKey: 'reach.canHost.desc',
    icon: '🏠',
    description: 'Can provide accommodation or workspace for visitors',
  },
  {
    id: 'can-invest',
    label: 'Can Invest',
    labelKey: 'reach.canInvest',
    descKey: 'reach.canInvest.desc',
    icon: '💎',
    description: 'Has resources to invest in ventures or partnerships',
  },
  {
    id: 'digital-only',
    label: 'Digital Only',
    labelKey: 'reach.digitalOnly',
    descKey: 'reach.digitalOnly.desc',
    icon: '💻',
    description: 'Available for remote collaboration exclusively',
  },
  {
    id: 'can-mentor',
    label: 'Can Mentor',
    labelKey: 'reach.canMentor',
    descKey: 'reach.canMentor.desc',
    icon: '🎓',
    description: 'Experienced and willing to guide others',
  },
  {
    id: 'can-relocate',
    label: 'Can Relocate',
    labelKey: 'reach.canRelocate',
    descKey: 'reach.canRelocate.desc',
    icon: '🌍',
    description: 'Open to moving to a new country or city',
  },
]

// ---------------------------------------------------------------------------
// Culture (ethnic / cultural identity suggestions by country)
// ---------------------------------------------------------------------------

export const CULTURE_SUGGESTIONS: Record<string, string[]> = {
  // Africa
  KE: ['Maasai', 'Kikuyu', 'Luo', 'Kalenjin', 'Luhya', 'Kamba'],
  NG: ['Yoruba', 'Igbo', 'Hausa', 'Fulani', 'Edo', 'Tiv'],
  GH: ['Akan', 'Ewe', 'Ga', 'Dagomba'],
  ZA: ['Zulu', 'Xhosa', 'Sotho', 'Tswana', 'Afrikaner'],
  TZ: ['Sukuma', 'Chagga', 'Haya', 'Nyamwezi', 'Maasai'],
  UG: ['Baganda', 'Acholi', 'Lango', 'Banyankole'],
  ET: ['Oromo', 'Amhara', 'Tigray', 'Somali'],
  RW: ['Hutu', 'Tutsi', 'Twa'],
  SN: ['Wolof', 'Fula', 'Serer', 'Mandinka'],
  CM: ['Bamileke', 'Beti-Pahuin', 'Fulani', 'Sawa'],
  CI: ['Akan', 'Krou', 'Mande', 'Voltaic'],
  CD: ['Luba', 'Kongo', 'Mongo', 'Mangbetu'],
  MZ: ['Makhuwa', 'Tsonga', 'Shona', 'Sena'],
  AO: ['Ovimbundu', 'Ambundu', 'Bakongo'],

  // Europe
  DE: ['Bavarian', 'Saxon', 'Swabian', 'Frisian'],
  GB: ['English', 'Scottish', 'Welsh', 'Irish', 'Cornish'],
  FR: ['Breton', 'Basque', 'Alsatian', 'Corsican', 'Occitan'],
  ES: ['Castilian', 'Catalan', 'Basque', 'Galician', 'Andalusian'],
  IT: ['Sicilian', 'Sardinian', 'Neapolitan', 'Lombard', 'Venetian'],
  NL: ['Dutch', 'Frisian', 'Limburgish'],
  SE: ['Swedish', 'Sami', 'Finnish-Swedish'],
  PL: ['Silesian', 'Kashubian', 'Highlander'],

  // Asia
  IN: ['Bengali', 'Tamil', 'Marathi', 'Gujarati', 'Punjabi', 'Rajasthani'],
  PK: ['Punjabi', 'Pashtun', 'Sindhi', 'Baloch', 'Muhajir'],
  BD: ['Bengali', 'Chakma', 'Marma', 'Garo'],
  CN: ['Han', 'Zhuang', 'Hui', 'Uyghur', 'Miao', 'Tibetan'],
  JP: ['Yamato', 'Ainu', 'Ryukyuan'],
  PH: ['Tagalog', 'Cebuano', 'Ilocano', 'Bicolano', 'Waray'],
  ID: ['Javanese', 'Sundanese', 'Batak', 'Malay', 'Balinese'],
  MY: ['Malay', 'Chinese-Malaysian', 'Indian-Malaysian', 'Orang Asli'],

  // Americas
  US: ['African American', 'Latino', 'Native American', 'Asian American', 'Pacific Islander'],
  BR: ['Afro-Brazilian', 'Indigenous', 'Japanese-Brazilian', 'Italian-Brazilian'],
  MX: ['Mestizo', 'Nahua', 'Maya', 'Zapotec', 'Mixtec'],
  CO: ['Mestizo', 'Afro-Colombian', 'Indigenous', 'Raizal'],

  // Middle East
  AE: ['Emirati', 'Bedouin', 'Baloch', 'Persian'],
  SA: ['Hejazi', 'Najdi', 'Bedouin', 'Hasawi'],
  TR: ['Turkish', 'Kurdish', 'Laz', 'Circassian'],
  EG: ['Egyptian Arab', 'Nubian', 'Bedouin', 'Berber'],

  // Oceania
  AU: ['Aboriginal', 'Torres Strait Islander', 'Anglo-Australian'],
  NZ: ['Maori', 'Pakeha', 'Pasifika'],
}

/**
 * Returns culture/ethnic identity suggestions for a given country code.
 * Returns an empty array if the country is not in the registry.
 */
export function getCultureSuggestionsForCountry(code: string): string[] {
  return CULTURE_SUGGESTIONS[code.toUpperCase()] ?? []
}

// ─── Lookup helpers ──────────────────────────────────────────────────

export function getFaithOption(id: string): FaithOption | undefined {
  return FAITH_OPTIONS.find((f) => f.id === id)
}

export function getReachOption(id: string): ReachOption | undefined {
  return REACH_OPTIONS.find((r) => r.id === id)
}

// ─── Dimension meta (for summary displays) ──────────────────────────

export interface DimensionMeta {
  key: string
  label: string // Fallback label (English)
  labelKey: string // i18n key for translation
  icon: string
}

export const DIMENSION_META: DimensionMeta[] = [
  { key: 'location', label: 'Location', labelKey: 'me.dimLocation', icon: '📍' },
  { key: 'languages', label: 'Languages', labelKey: 'me.dimLanguages', icon: '🗣️' },
  { key: 'faith', label: 'Faith', labelKey: 'me.dimFaith', icon: '🙏' },
  { key: 'craft', label: 'Craft', labelKey: 'me.dimCraft', icon: '🛠️' },
  { key: 'interests', label: 'Passion', labelKey: 'me.dimPassion', icon: '❤️' },
  { key: 'reach', label: 'Reach', labelKey: 'me.dimReach', icon: '🌐' },
  { key: 'culture', label: 'Culture', labelKey: 'me.dimCulture', icon: '🌿' },
  { key: 'market', label: 'Market', labelKey: 'me.dimMarket', icon: '📊' },
]

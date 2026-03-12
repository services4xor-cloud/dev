/**
 * Dimension Registries — Faith, Craft, Reach, Culture
 *
 * Four identity dimensions that power the BeNetwork matching engine.
 * These registries provide options, suggestions, and lookups for
 * Pioneer profiles and Compass routing.
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
  label: string
  icon: string
}

export const FAITH_OPTIONS: FaithOption[] = [
  { id: 'islam', label: 'Islam', icon: '☪️' },
  { id: 'christianity', label: 'Christianity', icon: '✝️' },
  { id: 'secular', label: 'Secular / Non-religious', icon: '🌐' },
  { id: 'hinduism', label: 'Hinduism', icon: '🕉️' },
  { id: 'buddhism', label: 'Buddhism', icon: '☸️' },
  { id: 'judaism', label: 'Judaism', icon: '✡️' },
  { id: 'traditional', label: 'Traditional / Indigenous', icon: '🌿' },
  { id: 'other', label: 'Other', icon: '🤍' },
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
  label: string
  icon: string
  description: string
}

export const REACH_OPTIONS: ReachOption[] = [
  {
    id: 'can-travel',
    label: 'Can Travel',
    icon: '✈️',
    description: 'Willing and able to travel for opportunities',
  },
  {
    id: 'can-host',
    label: 'Can Host',
    icon: '🏠',
    description: 'Can provide accommodation or workspace for visitors',
  },
  {
    id: 'can-invest',
    label: 'Can Invest',
    icon: '💎',
    description: 'Has resources to invest in ventures or partnerships',
  },
  {
    id: 'digital-only',
    label: 'Digital Only',
    icon: '💻',
    description: 'Available for remote collaboration exclusively',
  },
  {
    id: 'can-mentor',
    label: 'Can Mentor',
    icon: '🎓',
    description: 'Experienced and willing to guide others',
  },
  {
    id: 'can-relocate',
    label: 'Can Relocate',
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
  label: string
  icon: string
}

export const DIMENSION_META: DimensionMeta[] = [
  { key: 'location', label: 'Location', icon: '📍' },
  { key: 'languages', label: 'Languages', icon: '🗣️' },
  { key: 'faith', label: 'Faith', icon: '🙏' },
  { key: 'craft', label: 'Craft', icon: '🛠️' },
  { key: 'interests', label: 'Passion', icon: '❤️' },
  { key: 'reach', label: 'Reach', icon: '🌐' },
  { key: 'culture', label: 'Culture', icon: '🌿' },
  { key: 'market', label: 'Market', icon: '📊' },
]

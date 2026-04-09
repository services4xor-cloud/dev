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
  | 'shinto'
  | 'traditional'
  | 'other'

interface FaithOption {
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
  { id: 'shinto', label: 'Shinto', labelKey: 'faith.shinto', icon: '⛩️' },
  {
    id: 'traditional',
    label: 'Traditional / Indigenous',
    labelKey: 'faith.traditional',
    icon: '🌿',
  },
  { id: 'other', label: 'Other', labelKey: 'faith.other', icon: '🤍' },
]

// ---------------------------------------------------------------------------
// Reach
// ---------------------------------------------------------------------------

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

  ZW: ['Shona', 'Ndebele', 'Tonga'],
  MA: ['Arab', 'Berber', 'Sahrawi'],

  // Europe
  RU: ['Russian', 'Tatar', 'Chechen', 'Bashkir', 'Circassian'],
  UA: ['Ukrainian', 'Crimean Tatar', 'Rusyn'],
  GR: ['Greek', 'Pontic Greek', 'Arvanite'],
  RO: ['Romanian', 'Hungarian', 'Roma', 'German'],
  CH: ['German-Swiss', 'French-Swiss', 'Italian-Swiss', 'Romansh'],
  AT: ['Austrian', 'Carinthian Slovene', 'Burgenland Croat'],
  BE: ['Flemish', 'Walloon', 'German-Belgian'],
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
  TH: ['Thai', 'Isan', 'Northern Thai', 'Mon', 'Malay-Thai'],
  VN: ['Kinh', 'Tay', 'Thai', 'Muong', 'Khmer Krom', 'Hmong'],
  KR: ['Korean', 'Jeju'],
  LK: ['Sinhalese', 'Tamil', 'Moor', 'Burgher'],
  NP: ['Newar', 'Tharu', 'Tamang', 'Magar', 'Sherpa'],
  MM: ['Bamar', 'Shan', 'Karen', 'Rakhine', 'Mon'],
  IR: ['Persian', 'Azeri', 'Kurdish', 'Lur', 'Baloch', 'Arab'],
  IL: ['Ashkenazi', 'Mizrahi', 'Sephardi', 'Ethiopian', 'Arab'],

  // Americas
  US: ['African American', 'Latino', 'Native American', 'Asian American', 'Pacific Islander'],
  BR: ['Afro-Brazilian', 'Indigenous', 'Japanese-Brazilian', 'Italian-Brazilian'],
  MX: ['Mestizo', 'Nahua', 'Maya', 'Zapotec', 'Mixtec'],
  CO: ['Mestizo', 'Afro-Colombian', 'Indigenous', 'Raizal'],
  CA: ['First Nations', 'Inuit', 'Métis', 'Québécois', 'Acadian'],
  AR: ['Criollo', 'Mestizo', 'Italian-Argentine', 'Mapuche'],
  PE: ['Quechua', 'Aymara', 'Mestizo', 'Afro-Peruvian', 'Asháninka'],
  CL: ['Mapuche', 'Rapa Nui', 'Aymara', 'Chilean Mestizo'],
  VE: ['Mestizo', 'Afro-Venezuelan', 'Indigenous', 'Criollo'],
  JM: ['Jamaican', 'Maroon', 'East Indian', 'Chinese-Jamaican'],
  HT: ['Haitian Creole', 'Afro-Haitian', 'Mulatto'],

  // Middle East
  AE: ['Emirati', 'Bedouin', 'Baloch', 'Persian'],
  SA: ['Hejazi', 'Najdi', 'Bedouin', 'Hasawi'],
  TR: ['Turkish', 'Kurdish', 'Laz', 'Circassian'],
  EG: ['Egyptian Arab', 'Nubian', 'Bedouin', 'Berber'],

  // Oceania
  AU: ['Aboriginal', 'Torres Strait Islander', 'Anglo-Australian'],
  NZ: ['Maori', 'Pakeha', 'Pasifika'],
}

/**
 * Be[Country] Platform — AI Agent Persona Network
 *
 * Generates realistic AI agent personas for all 193 UN-recognized countries.
 * Each agent has a name, city, languages, crafts, interests, and bio that
 * reflect their country's culture, economy, and demographics.
 *
 * Key design:
 * - Deterministic: same country code always produces same agents
 * - Seeded PRNG based on country code char-code sum
 * - Regional name pools for authentic-feeling identities
 * - City pools for top 50 countries, capitals for the rest
 *
 * Used by:
 * - Agent network visualization
 * - Matching engine (AI-to-Pioneer connections)
 * - Thread/exchange seeding
 */

import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ResponseStyle = 'friendly' | 'professional' | 'enthusiastic' | 'thoughtful'

export interface AgentPersona {
  id: string // e.g., 'agent-ke-001'
  type: 'ai'
  name: string
  avatar: string // Emoji based on craft/region
  country: string // ISO code
  city: string
  languages: string[] // ISO 639-1 codes
  faith?: string // FaithId
  craft: string[] // From CRAFT_SUGGESTIONS
  interests: string[] // Exchange category IDs
  reach: string[] // ReachId[]
  culture?: string
  bio: string // 1-2 sentences
  exchangeProposals: string[] // What they offer/seek (1-3 items)
  responseStyle: ResponseStyle
}

// ─────────────────────────────────────────────────────────────────────────────
// Seeded PRNG — deterministic pseudo-random from country code
// ─────────────────────────────────────────────────────────────────────────────

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/** Simple seeded PRNG (mulberry32) — returns float in [0, 1) */
function createRng(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

function pickN<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5)
  return shuffled.slice(0, Math.min(n, arr.length))
}

// ─────────────────────────────────────────────────────────────────────────────
// Regional name pools (20+ per region)
// ─────────────────────────────────────────────────────────────────────────────

const NAMES_EAST_AFRICA = [
  'Amara',
  'Jabari',
  'Wanjiku',
  'Kofi',
  'Makena',
  'Baraka',
  'Nyala',
  'Tendai',
  'Zuri',
  'Imani',
  'Otieno',
  'Achieng',
  'Kamau',
  'Mwangi',
  'Njeri',
  'Ouma',
  'Adhiambo',
  'Kipchoge',
  'Chebet',
  'Mutua',
] as const

const NAMES_WEST_AFRICA = [
  'Adaeze',
  'Chidi',
  'Folake',
  'Emeka',
  'Yemi',
  'Ngozi',
  'Kwame',
  'Ama',
  'Babajide',
  'Chiamaka',
  'Olumide',
  'Aisha',
  'Ibrahim',
  'Fatima',
  'Amina',
  'Dayo',
  'Nneka',
  'Obinna',
  'Tunde',
  'Kelechi',
] as const

const NAMES_EUROPE = [
  'Lukas',
  'Sophie',
  'Hans',
  'Marie',
  'Pierre',
  'Elena',
  'Marco',
  'Anna',
  'Lars',
  'Freya',
  'Giovanni',
  'Clara',
  'Felix',
  'Ingrid',
  'Stefan',
  'Katya',
  'Milan',
  'Elsa',
  'Dimitri',
  'Nadia',
] as const

const NAMES_ASIA = [
  'Raj',
  'Priya',
  'Wei',
  'Mei',
  'Yuki',
  'Haruto',
  'Seo-yeon',
  'Jin',
  'Ananya',
  'Arjun',
  'Sakura',
  'Li',
  'Chen',
  'Arun',
  'Deepa',
  'Akira',
  'Sumi',
  'Rahul',
  'Fatimah',
  'Ahmed',
] as const

const NAMES_AMERICAS = [
  'Carlos',
  'Maria',
  'Diego',
  'Isabella',
  'Lucas',
  'Valentina',
  'Gabriel',
  'Sofia',
  'Miguel',
  'Carmen',
  'Alejandro',
  'Ana',
  'Fernando',
  'Rosa',
  'Pedro',
  'Lucia',
  'Roberto',
  'Diana',
  'Jorge',
  'Camila',
] as const

const NAMES_MIDDLE_EAST = [
  'Omar',
  'Layla',
  'Hassan',
  'Noor',
  'Ali',
  'Fatima',
  'Youssef',
  'Maryam',
  'Khaled',
  'Dina',
  'Tariq',
  'Salma',
  'Rami',
  'Hana',
  'Saeed',
  'Amal',
  'Zayed',
  'Noura',
  'Faisal',
  'Leila',
] as const

const NAMES_OCEANIA = [
  'Aroha',
  'Tane',
  'Moana',
  'Kai',
  'Leilani',
  'Maui',
  'Ngaire',
  'Wiremu',
  'Hinerangi',
  'Tipene',
  'Malia',
  'Sione',
  'Afa',
  'Mere',
  'Rua',
  'Tua',
  'Nani',
  'Koa',
  'Tui',
  'Sina',
] as const

const NAMES_SOUTHERN_AFRICA = [
  'Thabo',
  'Lindiwe',
  'Sipho',
  'Nomsa',
  'Bongani',
  'Naledi',
  'Mpho',
  'Zanele',
  'Dumisani',
  'Thandiwe',
  'Kagiso',
  'Palesa',
  'Tshepo',
  'Dineo',
  'Lerato',
  'Kgosi',
  'Rethabile',
  'Lesedi',
  'Kopano',
  'Malebogo',
] as const

const NAMES_NORTH_AFRICA = [
  'Youssef',
  'Fatima',
  'Mohamed',
  'Amira',
  'Karim',
  'Leila',
  'Omar',
  'Nadia',
  'Tariq',
  'Samira',
  'Rachid',
  'Malika',
  'Hamza',
  'Salma',
  'Mehdi',
  'Zineb',
  'Amine',
  'Khadija',
  'Anis',
  'Houda',
] as const

const NAMES_CENTRAL_AFRICA = [
  'Esperance',
  'Jean-Pierre',
  'Mutoni',
  'Habimana',
  'Consolee',
  'Mugisha',
  'Grace',
  'Parfait',
  'Divine',
  'Fiston',
  'Uwimana',
  'Ndayisaba',
  'Claudine',
  'Manzi',
  'Vestine',
  'Pacifique',
  'Josiane',
  'Elias',
  'Berthe',
  'Bosco',
] as const

const NAMES_CARIBBEAN = [
  'Marlon',
  'Anya',
  'Tyrone',
  'Keisha',
  'Winston',
  'Tamara',
  'Damian',
  'Nadine',
  'Sheldon',
  'Crystal',
  'Andre',
  'Shelly',
  'Devon',
  'Patrice',
  'Leon',
  'Marcia',
  'Desmond',
  'Tiffany',
  'Nigel',
  'Simone',
] as const

const NAMES_CENTRAL_ASIA = [
  'Aibek',
  'Aida',
  'Nursultan',
  'Gulnara',
  'Bakyt',
  'Dinara',
  'Ermek',
  'Saltanat',
  'Murat',
  'Zhanna',
  'Timur',
  'Madina',
  'Dastan',
  'Aigul',
  'Askar',
  'Kamila',
  'Ruslan',
  'Aliya',
  'Talgat',
  'Daria',
] as const

const NAMES_SOUTHEAST_ASIA = [
  'Rizal',
  'Putri',
  'Nguyen',
  'Linh',
  'Somchai',
  'Lek',
  'Budi',
  'Siti',
  'Minh',
  'Thao',
  'Arief',
  'Dewi',
  'Tran',
  'Mai',
  'Wayan',
  'Ketut',
  'Phong',
  'Hoa',
  'Reza',
  'Nurul',
] as const

// ─────────────────────────────────────────────────────────────────────────────
// Region mapping for name pools
// ─────────────────────────────────────────────────────────────────────────────

type NameRegion =
  | 'east-africa'
  | 'west-africa'
  | 'southern-africa'
  | 'north-africa'
  | 'central-africa'
  | 'europe'
  | 'asia'
  | 'americas'
  | 'middle-east'
  | 'oceania'
  | 'caribbean'
  | 'central-asia'
  | 'southeast-asia'

const NAME_POOLS: Record<NameRegion, readonly string[]> = {
  'east-africa': NAMES_EAST_AFRICA,
  'west-africa': NAMES_WEST_AFRICA,
  'southern-africa': NAMES_SOUTHERN_AFRICA,
  'north-africa': NAMES_NORTH_AFRICA,
  'central-africa': NAMES_CENTRAL_AFRICA,
  europe: NAMES_EUROPE,
  asia: NAMES_ASIA,
  americas: NAMES_AMERICAS,
  'middle-east': NAMES_MIDDLE_EAST,
  oceania: NAMES_OCEANIA,
  caribbean: NAMES_CARIBBEAN,
  'central-asia': NAMES_CENTRAL_ASIA,
  'southeast-asia': NAMES_SOUTHEAST_ASIA,
}

// ─────────────────────────────────────────────────────────────────────────────
// Craft suggestions (aligned with exchange categories)
// ─────────────────────────────────────────────────────────────────────────────

export const CRAFT_SUGGESTIONS = [
  'software-development',
  'data-science',
  'mobile-apps',
  'web-design',
  'photography',
  'videography',
  'graphic-design',
  'music-production',
  'agriculture',
  'permaculture',
  'livestock',
  'agritech',
  'teaching',
  'tutoring',
  'mentorship',
  'curriculum-design',
  'nursing',
  'pharmacy',
  'mental-health',
  'fitness',
  'cooking',
  'hospitality',
  'tour-guiding',
  'event-planning',
  'tailoring',
  'fashion-design',
  'jewelry',
  'textile-arts',
  'construction',
  'electrical',
  'plumbing',
  'mechanics',
  'writing',
  'journalism',
  'translation',
  'content-creation',
  'finance',
  'accounting',
  'consulting',
  'marketing',
  'conservation',
  'wildlife-management',
  'eco-tourism',
  'sustainability',
  'carpentry',
  'pottery',
  'weaving',
  'leather-craft',
] as const

// ─────────────────────────────────────────────────────────────────────────────
// Reach options
// ─────────────────────────────────────────────────────────────────────────────

export const REACH_OPTIONS = ['local', 'national', 'regional', 'continental', 'global'] as const

// ─────────────────────────────────────────────────────────────────────────────
// Faith options
// ─────────────────────────────────────────────────────────────────────────────

export const FAITH_OPTIONS = [
  'christianity',
  'islam',
  'hinduism',
  'buddhism',
  'judaism',
  'traditional',
  'sikhism',
  'none',
] as const

// ─────────────────────────────────────────────────────────────────────────────
// Response styles
// ─────────────────────────────────────────────────────────────────────────────

const RESPONSE_STYLES: ResponseStyle[] = ['friendly', 'professional', 'enthusiastic', 'thoughtful']

// ─────────────────────────────────────────────────────────────────────────────
// Avatar emojis by region
// ─────────────────────────────────────────────────────────────────────────────

const AVATARS_BY_REGION: Record<NameRegion, string[]> = {
  'east-africa': ['🌍', '🦁', '☕', '🏔️', '🌿'],
  'west-africa': ['🌍', '🎵', '🥁', '🌶️', '💎'],
  'southern-africa': ['🌍', '💎', '🍇', '⛏️', '🏔️'],
  'north-africa': ['🏜️', '🕌', '🌴', '📜', '🏛️'],
  'central-africa': ['🌍', '🌳', '🦍', '💎', '🌿'],
  europe: ['🏛️', '⚙️', '🎭', '📚', '🏰'],
  asia: ['🌏', '💻', '🎋', '🏔️', '🎎'],
  americas: ['🌎', '💻', '🎸', '🏙️', '🌮'],
  'middle-east': ['🏜️', '🕌', '💰', '🌴', '☕'],
  oceania: ['🌊', '🏝️', '🐨', '🌺', '🏄'],
  caribbean: ['🏝️', '🎵', '🌺', '☀️', '🌊'],
  'central-asia': ['🏔️', '🐎', '🏜️', '🎪', '⭐'],
  'southeast-asia': ['🌏', '🏝️', '🌺', '🎋', '🛕'],
}

// ─────────────────────────────────────────────────────────────────────────────
// Country data — all 193 UN-recognized countries
// ─────────────────────────────────────────────────────────────────────────────

interface CountryData {
  name: string
  region: NameRegion
  languages: string[]
  cities: string[]
  faiths: string[]
  topSectors: string[]
}

/** Comprehensive country data for all 193 UN member states */
const COUNTRY_DATA: Record<string, CountryData> = {
  // ── East Africa ───────────────────────────────────────────────────────────
  KE: {
    name: 'Kenya',
    region: 'east-africa',
    languages: ['en', 'sw'],
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
    faiths: ['christianity', 'islam', 'traditional'],
    topSectors: ['Safari & Eco-Tourism', 'Technology', 'Finance'],
  },
  UG: {
    name: 'Uganda',
    region: 'east-africa',
    languages: ['en', 'sw', 'lg'],
    cities: ['Kampala', 'Entebbe', 'Jinja', 'Gulu'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Agriculture', 'Technology', 'Tourism'],
  },
  TZ: {
    name: 'Tanzania',
    region: 'east-africa',
    languages: ['sw', 'en'],
    cities: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar City'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Safari & Wildlife', 'Mining', 'Agriculture'],
  },
  RW: {
    name: 'Rwanda',
    region: 'east-africa',
    languages: ['rw', 'en', 'fr'],
    cities: ['Kigali', 'Butare', 'Gisenyi'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Finance', 'Hospitality'],
  },
  BI: {
    name: 'Burundi',
    region: 'east-africa',
    languages: ['rn', 'fr', 'en'],
    cities: ['Bujumbura', 'Gitega'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Mining'],
  },
  ET: {
    name: 'Ethiopia',
    region: 'east-africa',
    languages: ['am', 'en', 'om'],
    cities: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Bahir Dar', 'Hawassa'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Agriculture', 'Manufacturing', 'Technology'],
  },
  ER: {
    name: 'Eritrea',
    region: 'east-africa',
    languages: ['ti', 'ar', 'en'],
    cities: ['Asmara'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Mining', 'Agriculture'],
  },
  DJ: {
    name: 'Djibouti',
    region: 'east-africa',
    languages: ['fr', 'ar'],
    cities: ['Djibouti City'],
    faiths: ['islam'],
    topSectors: ['Logistics', 'Trade'],
  },
  SO: {
    name: 'Somalia',
    region: 'east-africa',
    languages: ['so', 'ar'],
    cities: ['Mogadishu', 'Hargeisa'],
    faiths: ['islam'],
    topSectors: ['Livestock', 'Trade'],
  },
  SS: {
    name: 'South Sudan',
    region: 'east-africa',
    languages: ['en', 'ar'],
    cities: ['Juba'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Agriculture', 'Oil'],
  },
  SD: {
    name: 'Sudan',
    region: 'east-africa',
    languages: ['ar', 'en'],
    cities: ['Khartoum', 'Omdurman', 'Port Sudan'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Mining', 'Oil'],
  },
  // ── West Africa ───────────────────────────────────────────────────────────
  NG: {
    name: 'Nigeria',
    region: 'west-africa',
    languages: ['en', 'ha', 'yo', 'ig'],
    cities: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Fintech', 'Media', 'Energy'],
  },
  GH: {
    name: 'Ghana',
    region: 'west-africa',
    languages: ['en', 'ak', 'ee'],
    cities: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast'],
    faiths: ['christianity', 'islam', 'traditional'],
    topSectors: ['Gold & Mining', 'Agriculture', 'Technology'],
  },
  SN: {
    name: 'Senegal',
    region: 'west-africa',
    languages: ['fr', 'wo'],
    cities: ['Dakar', 'Saint-Louis', 'Thies'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Fishing', 'Tourism'],
  },
  CI: {
    name: "Cote d'Ivoire",
    region: 'west-africa',
    languages: ['fr'],
    cities: ['Abidjan', 'Yamoussoukro', 'Bouake'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Agriculture', 'Mining', 'Manufacturing'],
  },
  ML: {
    name: 'Mali',
    region: 'west-africa',
    languages: ['fr', 'bm'],
    cities: ['Bamako', 'Timbuktu'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Mining'],
  },
  BF: {
    name: 'Burkina Faso',
    region: 'west-africa',
    languages: ['fr'],
    cities: ['Ouagadougou', 'Bobo-Dioulasso'],
    faiths: ['islam', 'traditional'],
    topSectors: ['Agriculture', 'Mining'],
  },
  NE: {
    name: 'Niger',
    region: 'west-africa',
    languages: ['fr', 'ha'],
    cities: ['Niamey'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Mining'],
  },
  GN: {
    name: 'Guinea',
    region: 'west-africa',
    languages: ['fr'],
    cities: ['Conakry'],
    faiths: ['islam'],
    topSectors: ['Mining', 'Agriculture'],
  },
  SL: {
    name: 'Sierra Leone',
    region: 'west-africa',
    languages: ['en'],
    cities: ['Freetown'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Mining', 'Agriculture'],
  },
  LR: {
    name: 'Liberia',
    region: 'west-africa',
    languages: ['en'],
    cities: ['Monrovia'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Mining', 'Agriculture'],
  },
  TG: {
    name: 'Togo',
    region: 'west-africa',
    languages: ['fr', 'ee'],
    cities: ['Lome'],
    faiths: ['traditional', 'christianity', 'islam'],
    topSectors: ['Agriculture', 'Mining'],
  },
  BJ: {
    name: 'Benin',
    region: 'west-africa',
    languages: ['fr'],
    cities: ['Porto-Novo', 'Cotonou'],
    faiths: ['christianity', 'islam', 'traditional'],
    topSectors: ['Agriculture', 'Trade'],
  },
  GM: {
    name: 'Gambia',
    region: 'west-africa',
    languages: ['en'],
    cities: ['Banjul'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Tourism'],
  },
  GW: {
    name: 'Guinea-Bissau',
    region: 'west-africa',
    languages: ['pt'],
    cities: ['Bissau'],
    faiths: ['islam', 'traditional'],
    topSectors: ['Agriculture'],
  },
  MR: {
    name: 'Mauritania',
    region: 'west-africa',
    languages: ['ar', 'fr'],
    cities: ['Nouakchott'],
    faiths: ['islam'],
    topSectors: ['Mining', 'Fishing'],
  },
  CV: {
    name: 'Cabo Verde',
    region: 'west-africa',
    languages: ['pt'],
    cities: ['Praia'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Fishing'],
  },
  // ── Southern Africa ───────────────────────────────────────────────────────
  ZA: {
    name: 'South Africa',
    region: 'southern-africa',
    languages: ['en', 'zu', 'af', 'xh'],
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Soweto'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Finance', 'Tourism', 'Mining'],
  },
  MZ: {
    name: 'Mozambique',
    region: 'southern-africa',
    languages: ['pt'],
    cities: ['Maputo', 'Beira'],
    faiths: ['christianity', 'islam', 'traditional'],
    topSectors: ['Agriculture', 'Mining', 'Energy'],
  },
  ZM: {
    name: 'Zambia',
    region: 'southern-africa',
    languages: ['en'],
    cities: ['Lusaka', 'Kitwe', 'Ndola'],
    faiths: ['christianity'],
    topSectors: ['Mining', 'Agriculture'],
  },
  ZW: {
    name: 'Zimbabwe',
    region: 'southern-africa',
    languages: ['en', 'sn', 'nd'],
    cities: ['Harare', 'Bulawayo'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Mining', 'Agriculture', 'Tourism'],
  },
  MW: {
    name: 'Malawi',
    region: 'southern-africa',
    languages: ['en', 'ny'],
    cities: ['Lilongwe', 'Blantyre'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Agriculture', 'Tourism'],
  },
  BW: {
    name: 'Botswana',
    region: 'southern-africa',
    languages: ['en', 'tn'],
    cities: ['Gaborone', 'Francistown'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Mining', 'Tourism', 'Finance'],
  },
  NA: {
    name: 'Namibia',
    region: 'southern-africa',
    languages: ['en', 'af'],
    cities: ['Windhoek', 'Walvis Bay'],
    faiths: ['christianity'],
    topSectors: ['Mining', 'Tourism', 'Agriculture'],
  },
  LS: {
    name: 'Lesotho',
    region: 'southern-africa',
    languages: ['en', 'st'],
    cities: ['Maseru'],
    faiths: ['christianity'],
    topSectors: ['Mining', 'Textiles'],
  },
  SZ: {
    name: 'Eswatini',
    region: 'southern-africa',
    languages: ['en', 'ss'],
    cities: ['Mbabane'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Agriculture', 'Manufacturing'],
  },
  MG: {
    name: 'Madagascar',
    region: 'southern-africa',
    languages: ['mg', 'fr'],
    cities: ['Antananarivo', 'Toamasina'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Agriculture', 'Mining', 'Tourism'],
  },
  MU: {
    name: 'Mauritius',
    region: 'southern-africa',
    languages: ['en', 'fr', 'mfe'],
    cities: ['Port Louis'],
    faiths: ['hinduism', 'christianity', 'islam'],
    topSectors: ['Finance', 'Tourism', 'Technology'],
  },
  SC: {
    name: 'Seychelles',
    region: 'southern-africa',
    languages: ['en', 'fr', 'crs'],
    cities: ['Victoria'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Fishing'],
  },
  KM: {
    name: 'Comoros',
    region: 'southern-africa',
    languages: ['ar', 'fr'],
    cities: ['Moroni'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Fishing'],
  },
  AO: {
    name: 'Angola',
    region: 'southern-africa',
    languages: ['pt'],
    cities: ['Luanda', 'Huambo', 'Lobito'],
    faiths: ['christianity'],
    topSectors: ['Oil', 'Mining', 'Agriculture'],
  },
  // ── Central Africa ────────────────────────────────────────────────────────
  CD: {
    name: 'DR Congo',
    region: 'central-africa',
    languages: ['fr', 'ln', 'sw'],
    cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani'],
    faiths: ['christianity'],
    topSectors: ['Mining', 'Agriculture'],
  },
  CG: {
    name: 'Republic of Congo',
    region: 'central-africa',
    languages: ['fr'],
    cities: ['Brazzaville', 'Pointe-Noire'],
    faiths: ['christianity'],
    topSectors: ['Oil', 'Mining'],
  },
  CM: {
    name: 'Cameroon',
    region: 'central-africa',
    languages: ['fr', 'en'],
    cities: ['Douala', 'Yaounde', 'Bamenda'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Agriculture', 'Oil', 'Mining'],
  },
  GA: {
    name: 'Gabon',
    region: 'central-africa',
    languages: ['fr'],
    cities: ['Libreville'],
    faiths: ['christianity'],
    topSectors: ['Oil', 'Mining', 'Timber'],
  },
  GQ: {
    name: 'Equatorial Guinea',
    region: 'central-africa',
    languages: ['es', 'fr'],
    cities: ['Malabo'],
    faiths: ['christianity'],
    topSectors: ['Oil', 'Timber'],
  },
  TD: {
    name: 'Chad',
    region: 'central-africa',
    languages: ['fr', 'ar'],
    cities: ['Ndjamena'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Oil', 'Agriculture'],
  },
  CF: {
    name: 'Central African Republic',
    region: 'central-africa',
    languages: ['fr', 'sg'],
    cities: ['Bangui'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Mining', 'Agriculture'],
  },
  ST: {
    name: 'Sao Tome and Principe',
    region: 'central-africa',
    languages: ['pt'],
    cities: ['Sao Tome'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Tourism'],
  },
  // ── North Africa ──────────────────────────────────────────────────────────
  EG: {
    name: 'Egypt',
    region: 'north-africa',
    languages: ['ar', 'en'],
    cities: ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Tourism', 'Agriculture', 'Technology'],
  },
  MA: {
    name: 'Morocco',
    region: 'north-africa',
    languages: ['ar', 'fr', 'ber'],
    cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier'],
    faiths: ['islam'],
    topSectors: ['Tourism', 'Agriculture', 'Manufacturing'],
  },
  TN: {
    name: 'Tunisia',
    region: 'north-africa',
    languages: ['ar', 'fr'],
    cities: ['Tunis', 'Sfax', 'Sousse'],
    faiths: ['islam'],
    topSectors: ['Tourism', 'Manufacturing', 'Agriculture'],
  },
  DZ: {
    name: 'Algeria',
    region: 'north-africa',
    languages: ['ar', 'fr', 'ber'],
    cities: ['Algiers', 'Oran', 'Constantine'],
    faiths: ['islam'],
    topSectors: ['Oil', 'Agriculture', 'Manufacturing'],
  },
  LY: {
    name: 'Libya',
    region: 'north-africa',
    languages: ['ar'],
    cities: ['Tripoli', 'Benghazi'],
    faiths: ['islam'],
    topSectors: ['Oil', 'Agriculture'],
  },
  // ── Middle East ───────────────────────────────────────────────────────────
  AE: {
    name: 'United Arab Emirates',
    region: 'middle-east',
    languages: ['ar', 'en'],
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    faiths: ['islam'],
    topSectors: ['Hospitality', 'Finance', 'Technology'],
  },
  SA: {
    name: 'Saudi Arabia',
    region: 'middle-east',
    languages: ['ar'],
    cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Construction', 'Finance'],
  },
  QA: {
    name: 'Qatar',
    region: 'middle-east',
    languages: ['ar', 'en'],
    cities: ['Doha'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Finance', 'Construction'],
  },
  KW: {
    name: 'Kuwait',
    region: 'middle-east',
    languages: ['ar', 'en'],
    cities: ['Kuwait City'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Finance'],
  },
  BH: {
    name: 'Bahrain',
    region: 'middle-east',
    languages: ['ar', 'en'],
    cities: ['Manama'],
    faiths: ['islam'],
    topSectors: ['Finance', 'Tourism'],
  },
  OM: {
    name: 'Oman',
    region: 'middle-east',
    languages: ['ar'],
    cities: ['Muscat'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Tourism'],
  },
  YE: {
    name: 'Yemen',
    region: 'middle-east',
    languages: ['ar'],
    cities: ['Sanaa', 'Aden'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Fishing'],
  },
  JO: {
    name: 'Jordan',
    region: 'middle-east',
    languages: ['ar', 'en'],
    cities: ['Amman', 'Aqaba'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Technology', 'Tourism', 'Trade'],
  },
  LB: {
    name: 'Lebanon',
    region: 'middle-east',
    languages: ['ar', 'fr', 'en'],
    cities: ['Beirut', 'Tripoli'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Finance', 'Tourism', 'Trade'],
  },
  SY: {
    name: 'Syria',
    region: 'middle-east',
    languages: ['ar'],
    cities: ['Damascus', 'Aleppo'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Agriculture', 'Manufacturing'],
  },
  IQ: {
    name: 'Iraq',
    region: 'middle-east',
    languages: ['ar', 'ku'],
    cities: ['Baghdad', 'Basra', 'Erbil'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Agriculture'],
  },
  IR: {
    name: 'Iran',
    region: 'middle-east',
    languages: ['fa', 'ar'],
    cities: ['Tehran', 'Isfahan', 'Shiraz', 'Tabriz', 'Mashhad'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Manufacturing', 'Agriculture'],
  },
  IL: {
    name: 'Israel',
    region: 'middle-east',
    languages: ['he', 'ar', 'en'],
    cities: ['Tel Aviv', 'Jerusalem', 'Haifa'],
    faiths: ['judaism', 'islam', 'christianity'],
    topSectors: ['Technology', 'Agriculture', 'Finance'],
  },
  PS: {
    name: 'Palestine',
    region: 'middle-east',
    languages: ['ar'],
    cities: ['Ramallah', 'Gaza City'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Agriculture', 'Trade'],
  },
  CY: {
    name: 'Cyprus',
    region: 'middle-east',
    languages: ['el', 'tr', 'en'],
    cities: ['Nicosia', 'Limassol'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Tourism', 'Finance', 'Technology'],
  },
  // ── Europe ────────────────────────────────────────────────────────────────
  DE: {
    name: 'Germany',
    region: 'europe',
    languages: ['de', 'en'],
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    faiths: ['christianity', 'none'],
    topSectors: ['Engineering', 'Healthcare', 'Technology'],
  },
  GB: {
    name: 'United Kingdom',
    region: 'europe',
    languages: ['en'],
    cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol'],
    faiths: ['christianity', 'islam', 'none'],
    topSectors: ['Finance', 'Technology', 'Healthcare'],
  },
  FR: {
    name: 'France',
    region: 'europe',
    languages: ['fr', 'en'],
    cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
    faiths: ['christianity', 'islam', 'none'],
    topSectors: ['Tourism', 'Fashion', 'Technology'],
  },
  IT: {
    name: 'Italy',
    region: 'europe',
    languages: ['it', 'en'],
    cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
    faiths: ['christianity'],
    topSectors: ['Fashion', 'Tourism', 'Manufacturing'],
  },
  ES: {
    name: 'Spain',
    region: 'europe',
    languages: ['es', 'en', 'ca'],
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
    faiths: ['christianity', 'none'],
    topSectors: ['Tourism', 'Agriculture', 'Technology'],
  },
  PT: {
    name: 'Portugal',
    region: 'europe',
    languages: ['pt', 'en'],
    cities: ['Lisbon', 'Porto', 'Braga'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Technology', 'Agriculture'],
  },
  NL: {
    name: 'Netherlands',
    region: 'europe',
    languages: ['nl', 'en'],
    cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
    faiths: ['christianity', 'none'],
    topSectors: ['Technology', 'Logistics', 'Agriculture'],
  },
  BE: {
    name: 'Belgium',
    region: 'europe',
    languages: ['nl', 'fr', 'en'],
    cities: ['Brussels', 'Antwerp', 'Ghent'],
    faiths: ['christianity', 'none'],
    topSectors: ['Technology', 'Trade', 'Manufacturing'],
  },
  CH: {
    name: 'Switzerland',
    region: 'europe',
    languages: ['de', 'fr', 'it', 'en'],
    cities: ['Zurich', 'Geneva', 'Basel', 'Bern'],
    faiths: ['christianity', 'none'],
    topSectors: ['Finance', 'Pharma', 'Technology'],
  },
  AT: {
    name: 'Austria',
    region: 'europe',
    languages: ['de', 'en'],
    cities: ['Vienna', 'Graz', 'Salzburg'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Manufacturing', 'Technology'],
  },
  SE: {
    name: 'Sweden',
    region: 'europe',
    languages: ['sv', 'en'],
    cities: ['Stockholm', 'Gothenburg', 'Malmo'],
    faiths: ['christianity', 'none'],
    topSectors: ['Technology', 'Manufacturing', 'Healthcare'],
  },
  NO: {
    name: 'Norway',
    region: 'europe',
    languages: ['no', 'en'],
    cities: ['Oslo', 'Bergen', 'Trondheim'],
    faiths: ['christianity', 'none'],
    topSectors: ['Energy', 'Fishing', 'Technology'],
  },
  DK: {
    name: 'Denmark',
    region: 'europe',
    languages: ['da', 'en'],
    cities: ['Copenhagen', 'Aarhus'],
    faiths: ['christianity', 'none'],
    topSectors: ['Technology', 'Agriculture', 'Energy'],
  },
  FI: {
    name: 'Finland',
    region: 'europe',
    languages: ['fi', 'sv', 'en'],
    cities: ['Helsinki', 'Tampere', 'Turku'],
    faiths: ['christianity', 'none'],
    topSectors: ['Technology', 'Manufacturing', 'Education'],
  },
  IS: {
    name: 'Iceland',
    region: 'europe',
    languages: ['is', 'en'],
    cities: ['Reykjavik'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Fishing', 'Energy'],
  },
  IE: {
    name: 'Ireland',
    region: 'europe',
    languages: ['en', 'ga'],
    cities: ['Dublin', 'Cork', 'Galway'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Finance', 'Pharma'],
  },
  PL: {
    name: 'Poland',
    region: 'europe',
    languages: ['pl', 'en'],
    cities: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw'],
    faiths: ['christianity'],
    topSectors: ['Manufacturing', 'Technology', 'Agriculture'],
  },
  CZ: {
    name: 'Czechia',
    region: 'europe',
    languages: ['cs', 'en'],
    cities: ['Prague', 'Brno'],
    faiths: ['christianity', 'none'],
    topSectors: ['Manufacturing', 'Technology', 'Tourism'],
  },
  SK: {
    name: 'Slovakia',
    region: 'europe',
    languages: ['sk', 'en'],
    cities: ['Bratislava', 'Kosice'],
    faiths: ['christianity'],
    topSectors: ['Manufacturing', 'Technology'],
  },
  HU: {
    name: 'Hungary',
    region: 'europe',
    languages: ['hu', 'en'],
    cities: ['Budapest', 'Debrecen'],
    faiths: ['christianity'],
    topSectors: ['Manufacturing', 'Technology', 'Agriculture'],
  },
  RO: {
    name: 'Romania',
    region: 'europe',
    languages: ['ro', 'en'],
    cities: ['Bucharest', 'Cluj-Napoca', 'Timisoara'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Manufacturing', 'Agriculture'],
  },
  BG: {
    name: 'Bulgaria',
    region: 'europe',
    languages: ['bg', 'en'],
    cities: ['Sofia', 'Plovdiv'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Tourism', 'Agriculture'],
  },
  HR: {
    name: 'Croatia',
    region: 'europe',
    languages: ['hr', 'en'],
    cities: ['Zagreb', 'Split', 'Dubrovnik'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Manufacturing'],
  },
  SI: {
    name: 'Slovenia',
    region: 'europe',
    languages: ['sl', 'en'],
    cities: ['Ljubljana', 'Maribor'],
    faiths: ['christianity'],
    topSectors: ['Manufacturing', 'Tourism'],
  },
  RS: {
    name: 'Serbia',
    region: 'europe',
    languages: ['sr', 'en'],
    cities: ['Belgrade', 'Novi Sad'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Manufacturing', 'Agriculture'],
  },
  BA: {
    name: 'Bosnia and Herzegovina',
    region: 'europe',
    languages: ['bs', 'hr', 'sr'],
    cities: ['Sarajevo', 'Mostar'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Manufacturing', 'Tourism'],
  },
  ME: {
    name: 'Montenegro',
    region: 'europe',
    languages: ['sr', 'en'],
    cities: ['Podgorica'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Tourism', 'Energy'],
  },
  MK: {
    name: 'North Macedonia',
    region: 'europe',
    languages: ['mk', 'sq'],
    cities: ['Skopje'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Manufacturing', 'Agriculture'],
  },
  AL: {
    name: 'Albania',
    region: 'europe',
    languages: ['sq', 'en'],
    cities: ['Tirana', 'Durres'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  GR: {
    name: 'Greece',
    region: 'europe',
    languages: ['el', 'en'],
    cities: ['Athens', 'Thessaloniki', 'Heraklion'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture', 'Shipping'],
  },
  TR: {
    name: 'Turkey',
    region: 'europe',
    languages: ['tr', 'en'],
    cities: ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'],
    faiths: ['islam'],
    topSectors: ['Manufacturing', 'Tourism', 'Agriculture'],
  },
  UA: {
    name: 'Ukraine',
    region: 'europe',
    languages: ['uk', 'en'],
    cities: ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Agriculture', 'Manufacturing'],
  },
  MD: {
    name: 'Moldova',
    region: 'europe',
    languages: ['ro', 'ru'],
    cities: ['Chisinau'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Manufacturing'],
  },
  BY: {
    name: 'Belarus',
    region: 'europe',
    languages: ['be', 'ru'],
    cities: ['Minsk'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Manufacturing'],
  },
  RU: {
    name: 'Russia',
    region: 'europe',
    languages: ['ru', 'en'],
    cities: ['Moscow', 'St Petersburg', 'Novosibirsk', 'Kazan', 'Yekaterinburg'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Energy', 'Technology', 'Manufacturing'],
  },
  LT: {
    name: 'Lithuania',
    region: 'europe',
    languages: ['lt', 'en'],
    cities: ['Vilnius', 'Kaunas'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Manufacturing'],
  },
  LV: {
    name: 'Latvia',
    region: 'europe',
    languages: ['lv', 'en'],
    cities: ['Riga'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Manufacturing'],
  },
  EE: {
    name: 'Estonia',
    region: 'europe',
    languages: ['et', 'en'],
    cities: ['Tallinn', 'Tartu'],
    faiths: ['christianity', 'none'],
    topSectors: ['Technology', 'Manufacturing'],
  },
  MT: {
    name: 'Malta',
    region: 'europe',
    languages: ['mt', 'en'],
    cities: ['Valletta'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Finance', 'Technology'],
  },
  LU: {
    name: 'Luxembourg',
    region: 'europe',
    languages: ['lb', 'fr', 'de'],
    cities: ['Luxembourg City'],
    faiths: ['christianity'],
    topSectors: ['Finance', 'Technology'],
  },
  MC: {
    name: 'Monaco',
    region: 'europe',
    languages: ['fr'],
    cities: ['Monte Carlo'],
    faiths: ['christianity'],
    topSectors: ['Finance', 'Tourism'],
  },
  AD: {
    name: 'Andorra',
    region: 'europe',
    languages: ['ca', 'es', 'fr'],
    cities: ['Andorra la Vella'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Finance'],
  },
  SM: {
    name: 'San Marino',
    region: 'europe',
    languages: ['it'],
    cities: ['San Marino'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Finance'],
  },
  LI: {
    name: 'Liechtenstein',
    region: 'europe',
    languages: ['de'],
    cities: ['Vaduz'],
    faiths: ['christianity'],
    topSectors: ['Finance', 'Manufacturing'],
  },
  VA: {
    name: 'Vatican City',
    region: 'europe',
    languages: ['it', 'la'],
    cities: ['Vatican City'],
    faiths: ['christianity'],
    topSectors: ['Culture', 'Tourism'],
  },
  // ── South Asia ────────────────────────────────────────────────────────────
  IN: {
    name: 'India',
    region: 'asia',
    languages: ['hi', 'en', 'bn', 'ta', 'te'],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
    faiths: ['hinduism', 'islam', 'christianity', 'sikhism'],
    topSectors: ['Technology', 'Manufacturing', 'Agriculture'],
  },
  PK: {
    name: 'Pakistan',
    region: 'asia',
    languages: ['ur', 'en', 'pa'],
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad'],
    faiths: ['islam'],
    topSectors: ['Textiles', 'Agriculture', 'Technology'],
  },
  BD: {
    name: 'Bangladesh',
    region: 'asia',
    languages: ['bn', 'en'],
    cities: ['Dhaka', 'Chittagong', 'Sylhet'],
    faiths: ['islam', 'hinduism'],
    topSectors: ['Textiles', 'Agriculture', 'Technology'],
  },
  LK: {
    name: 'Sri Lanka',
    region: 'asia',
    languages: ['si', 'ta', 'en'],
    cities: ['Colombo', 'Kandy'],
    faiths: ['buddhism', 'hinduism', 'islam'],
    topSectors: ['Tourism', 'Agriculture', 'Technology'],
  },
  NP: {
    name: 'Nepal',
    region: 'asia',
    languages: ['ne', 'en'],
    cities: ['Kathmandu', 'Pokhara'],
    faiths: ['hinduism', 'buddhism'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  BT: {
    name: 'Bhutan',
    region: 'asia',
    languages: ['dz', 'en'],
    cities: ['Thimphu'],
    faiths: ['buddhism'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  MV: {
    name: 'Maldives',
    region: 'asia',
    languages: ['dv', 'en'],
    cities: ['Male'],
    faiths: ['islam'],
    topSectors: ['Tourism', 'Fishing'],
  },
  AF: {
    name: 'Afghanistan',
    region: 'asia',
    languages: ['ps', 'fa'],
    cities: ['Kabul', 'Herat', 'Kandahar'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Mining'],
  },
  // ── East Asia ─────────────────────────────────────────────────────────────
  CN: {
    name: 'China',
    region: 'asia',
    languages: ['zh', 'en'],
    cities: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu'],
    faiths: ['buddhism', 'traditional', 'none'],
    topSectors: ['Technology', 'Manufacturing', 'Trade'],
  },
  JP: {
    name: 'Japan',
    region: 'asia',
    languages: ['ja', 'en'],
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
    faiths: ['buddhism', 'traditional'],
    topSectors: ['Technology', 'Manufacturing', 'Finance'],
  },
  KR: {
    name: 'South Korea',
    region: 'asia',
    languages: ['ko', 'en'],
    cities: ['Seoul', 'Busan', 'Incheon', 'Daegu'],
    faiths: ['christianity', 'buddhism', 'none'],
    topSectors: ['Technology', 'Manufacturing', 'Entertainment'],
  },
  KP: {
    name: 'North Korea',
    region: 'asia',
    languages: ['ko'],
    cities: ['Pyongyang'],
    faiths: ['none', 'traditional'],
    topSectors: ['Mining', 'Agriculture'],
  },
  MN: {
    name: 'Mongolia',
    region: 'central-asia',
    languages: ['mn', 'en'],
    cities: ['Ulaanbaatar'],
    faiths: ['buddhism', 'traditional'],
    topSectors: ['Mining', 'Agriculture'],
  },
  // ── Southeast Asia ────────────────────────────────────────────────────────
  TH: {
    name: 'Thailand',
    region: 'southeast-asia',
    languages: ['th', 'en'],
    cities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'],
    faiths: ['buddhism'],
    topSectors: ['Tourism', 'Manufacturing', 'Technology'],
  },
  VN: {
    name: 'Vietnam',
    region: 'southeast-asia',
    languages: ['vi', 'en'],
    cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'],
    faiths: ['buddhism', 'none'],
    topSectors: ['Manufacturing', 'Technology', 'Agriculture'],
  },
  ID: {
    name: 'Indonesia',
    region: 'southeast-asia',
    languages: ['id', 'en'],
    cities: ['Jakarta', 'Surabaya', 'Bandung', 'Bali', 'Yogyakarta'],
    faiths: ['islam', 'hinduism', 'christianity'],
    topSectors: ['Manufacturing', 'Tourism', 'Agriculture'],
  },
  MY: {
    name: 'Malaysia',
    region: 'southeast-asia',
    languages: ['ms', 'en', 'zh'],
    cities: ['Kuala Lumpur', 'Penang', 'Johor Bahru'],
    faiths: ['islam', 'buddhism', 'hinduism'],
    topSectors: ['Technology', 'Manufacturing', 'Tourism'],
  },
  SG: {
    name: 'Singapore',
    region: 'southeast-asia',
    languages: ['en', 'zh', 'ms', 'ta'],
    cities: ['Singapore'],
    faiths: ['buddhism', 'christianity', 'islam', 'hinduism'],
    topSectors: ['Finance', 'Technology', 'Trade'],
  },
  PH: {
    name: 'Philippines',
    region: 'southeast-asia',
    languages: ['tl', 'en'],
    cities: ['Manila', 'Cebu', 'Davao', 'Quezon City'],
    faiths: ['christianity', 'islam'],
    topSectors: ['Services', 'Manufacturing', 'Agriculture'],
  },
  MM: {
    name: 'Myanmar',
    region: 'southeast-asia',
    languages: ['my', 'en'],
    cities: ['Yangon', 'Mandalay', 'Naypyidaw'],
    faiths: ['buddhism'],
    topSectors: ['Agriculture', 'Mining', 'Manufacturing'],
  },
  KH: {
    name: 'Cambodia',
    region: 'southeast-asia',
    languages: ['km', 'en'],
    cities: ['Phnom Penh', 'Siem Reap'],
    faiths: ['buddhism'],
    topSectors: ['Tourism', 'Agriculture', 'Manufacturing'],
  },
  LA: {
    name: 'Laos',
    region: 'southeast-asia',
    languages: ['lo', 'en'],
    cities: ['Vientiane', 'Luang Prabang'],
    faiths: ['buddhism'],
    topSectors: ['Agriculture', 'Mining', 'Tourism'],
  },
  BN: {
    name: 'Brunei',
    region: 'southeast-asia',
    languages: ['ms', 'en'],
    cities: ['Bandar Seri Begawan'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Finance'],
  },
  TL: {
    name: 'Timor-Leste',
    region: 'southeast-asia',
    languages: ['pt', 'tet'],
    cities: ['Dili'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Energy'],
  },
  // ── Central Asia ──────────────────────────────────────────────────────────
  KZ: {
    name: 'Kazakhstan',
    region: 'central-asia',
    languages: ['kk', 'ru', 'en'],
    cities: ['Almaty', 'Astana', 'Shymkent'],
    faiths: ['islam', 'christianity'],
    topSectors: ['Energy', 'Mining', 'Agriculture'],
  },
  UZ: {
    name: 'Uzbekistan',
    region: 'central-asia',
    languages: ['uz', 'ru'],
    cities: ['Tashkent', 'Samarkand', 'Bukhara'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Mining', 'Manufacturing'],
  },
  TM: {
    name: 'Turkmenistan',
    region: 'central-asia',
    languages: ['tk', 'ru'],
    cities: ['Ashgabat'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Agriculture'],
  },
  TJ: {
    name: 'Tajikistan',
    region: 'central-asia',
    languages: ['tg', 'ru'],
    cities: ['Dushanbe'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Mining'],
  },
  KG: {
    name: 'Kyrgyzstan',
    region: 'central-asia',
    languages: ['ky', 'ru'],
    cities: ['Bishkek'],
    faiths: ['islam'],
    topSectors: ['Agriculture', 'Mining', 'Tourism'],
  },
  GE: {
    name: 'Georgia',
    region: 'central-asia',
    languages: ['ka', 'en'],
    cities: ['Tbilisi', 'Batumi'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture', 'Technology'],
  },
  AM: {
    name: 'Armenia',
    region: 'central-asia',
    languages: ['hy', 'en'],
    cities: ['Yerevan'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Mining'],
  },
  AZ: {
    name: 'Azerbaijan',
    region: 'central-asia',
    languages: ['az', 'ru'],
    cities: ['Baku'],
    faiths: ['islam'],
    topSectors: ['Energy', 'Agriculture', 'Tourism'],
  },
  // ── Americas — North ──────────────────────────────────────────────────────
  US: {
    name: 'United States',
    region: 'americas',
    languages: ['en', 'es'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco'],
    faiths: ['christianity', 'judaism', 'islam', 'none'],
    topSectors: ['Technology', 'Finance', 'Healthcare'],
  },
  CA: {
    name: 'Canada',
    region: 'americas',
    languages: ['en', 'fr'],
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    faiths: ['christianity', 'none'],
    topSectors: ['Technology', 'Healthcare', 'Agriculture'],
  },
  MX: {
    name: 'Mexico',
    region: 'americas',
    languages: ['es', 'en'],
    cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancun', 'Puebla'],
    faiths: ['christianity'],
    topSectors: ['Manufacturing', 'Tourism', 'Technology'],
  },
  // ── Americas — Central ────────────────────────────────────────────────────
  GT: {
    name: 'Guatemala',
    region: 'americas',
    languages: ['es'],
    cities: ['Guatemala City', 'Antigua'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Tourism', 'Manufacturing'],
  },
  BZ: {
    name: 'Belize',
    region: 'americas',
    languages: ['en', 'es'],
    cities: ['Belmopan'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  SV: {
    name: 'El Salvador',
    region: 'americas',
    languages: ['es'],
    cities: ['San Salvador'],
    faiths: ['christianity'],
    topSectors: ['Manufacturing', 'Agriculture'],
  },
  HN: {
    name: 'Honduras',
    region: 'americas',
    languages: ['es'],
    cities: ['Tegucigalpa'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Manufacturing'],
  },
  NI: {
    name: 'Nicaragua',
    region: 'americas',
    languages: ['es'],
    cities: ['Managua'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Manufacturing'],
  },
  CR: {
    name: 'Costa Rica',
    region: 'americas',
    languages: ['es', 'en'],
    cities: ['San Jose'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Technology', 'Agriculture'],
  },
  PA: {
    name: 'Panama',
    region: 'americas',
    languages: ['es', 'en'],
    cities: ['Panama City'],
    faiths: ['christianity'],
    topSectors: ['Finance', 'Trade', 'Tourism'],
  },
  // ── Americas — South ──────────────────────────────────────────────────────
  BR: {
    name: 'Brazil',
    region: 'americas',
    languages: ['pt', 'en'],
    cities: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Technology', 'Manufacturing'],
  },
  AR: {
    name: 'Argentina',
    region: 'americas',
    languages: ['es', 'en'],
    cities: ['Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Technology', 'Manufacturing'],
  },
  CL: {
    name: 'Chile',
    region: 'americas',
    languages: ['es', 'en'],
    cities: ['Santiago', 'Valparaiso', 'Concepcion'],
    faiths: ['christianity', 'none'],
    topSectors: ['Mining', 'Agriculture', 'Technology'],
  },
  CO: {
    name: 'Colombia',
    region: 'americas',
    languages: ['es', 'en'],
    cities: ['Bogota', 'Medellin', 'Cali', 'Barranquilla'],
    faiths: ['christianity'],
    topSectors: ['Technology', 'Agriculture', 'Tourism'],
  },
  PE: {
    name: 'Peru',
    region: 'americas',
    languages: ['es', 'qu'],
    cities: ['Lima', 'Cusco', 'Arequipa'],
    faiths: ['christianity'],
    topSectors: ['Mining', 'Agriculture', 'Tourism'],
  },
  VE: {
    name: 'Venezuela',
    region: 'americas',
    languages: ['es'],
    cities: ['Caracas', 'Maracaibo'],
    faiths: ['christianity'],
    topSectors: ['Energy', 'Agriculture'],
  },
  EC: {
    name: 'Ecuador',
    region: 'americas',
    languages: ['es'],
    cities: ['Quito', 'Guayaquil'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Energy', 'Tourism'],
  },
  BO: {
    name: 'Bolivia',
    region: 'americas',
    languages: ['es', 'qu', 'ay'],
    cities: ['La Paz', 'Santa Cruz'],
    faiths: ['christianity'],
    topSectors: ['Mining', 'Agriculture'],
  },
  PY: {
    name: 'Paraguay',
    region: 'americas',
    languages: ['es', 'gn'],
    cities: ['Asuncion'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Manufacturing'],
  },
  UY: {
    name: 'Uruguay',
    region: 'americas',
    languages: ['es'],
    cities: ['Montevideo'],
    faiths: ['christianity', 'none'],
    topSectors: ['Agriculture', 'Technology', 'Tourism'],
  },
  GY: {
    name: 'Guyana',
    region: 'americas',
    languages: ['en'],
    cities: ['Georgetown'],
    faiths: ['christianity', 'hinduism', 'islam'],
    topSectors: ['Mining', 'Agriculture'],
  },
  SR: {
    name: 'Suriname',
    region: 'americas',
    languages: ['nl'],
    cities: ['Paramaribo'],
    faiths: ['christianity', 'hinduism', 'islam'],
    topSectors: ['Mining', 'Agriculture'],
  },
  // ── Caribbean ─────────────────────────────────────────────────────────────
  CU: {
    name: 'Cuba',
    region: 'caribbean',
    languages: ['es'],
    cities: ['Havana', 'Santiago de Cuba'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture', 'Healthcare'],
  },
  JM: {
    name: 'Jamaica',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Kingston', 'Montego Bay'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture', 'Music'],
  },
  HT: {
    name: 'Haiti',
    region: 'caribbean',
    languages: ['fr', 'ht'],
    cities: ['Port-au-Prince'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Agriculture', 'Manufacturing'],
  },
  DO: {
    name: 'Dominican Republic',
    region: 'caribbean',
    languages: ['es'],
    cities: ['Santo Domingo', 'Punta Cana'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture', 'Manufacturing'],
  },
  TT: {
    name: 'Trinidad and Tobago',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Port of Spain'],
    faiths: ['christianity', 'hinduism', 'islam'],
    topSectors: ['Energy', 'Tourism', 'Trade'],
  },
  BB: {
    name: 'Barbados',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Bridgetown'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Finance'],
  },
  BS: {
    name: 'Bahamas',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Nassau'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Finance'],
  },
  AG: {
    name: 'Antigua and Barbuda',
    region: 'caribbean',
    languages: ['en'],
    cities: ["Saint John's"],
    faiths: ['christianity'],
    topSectors: ['Tourism'],
  },
  DM: {
    name: 'Dominica',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Roseau'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  GD: {
    name: 'Grenada',
    region: 'caribbean',
    languages: ['en'],
    cities: ["Saint George's"],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  KN: {
    name: 'Saint Kitts and Nevis',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Basseterre'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Finance'],
  },
  LC: {
    name: 'Saint Lucia',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Castries'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  VC: {
    name: 'Saint Vincent',
    region: 'caribbean',
    languages: ['en'],
    cities: ['Kingstown'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Tourism'],
  },
  // ── Oceania ───────────────────────────────────────────────────────────────
  AU: {
    name: 'Australia',
    region: 'oceania',
    languages: ['en'],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    faiths: ['christianity', 'none'],
    topSectors: ['Mining', 'Agriculture', 'Technology'],
  },
  NZ: {
    name: 'New Zealand',
    region: 'oceania',
    languages: ['en', 'mi'],
    cities: ['Auckland', 'Wellington', 'Christchurch'],
    faiths: ['christianity', 'none'],
    topSectors: ['Agriculture', 'Tourism', 'Technology'],
  },
  FJ: {
    name: 'Fiji',
    region: 'oceania',
    languages: ['en', 'fj', 'hi'],
    cities: ['Suva', 'Nadi'],
    faiths: ['christianity', 'hinduism'],
    topSectors: ['Tourism', 'Agriculture'],
  },
  PG: {
    name: 'Papua New Guinea',
    region: 'oceania',
    languages: ['en', 'tpi'],
    cities: ['Port Moresby', 'Lae'],
    faiths: ['christianity', 'traditional'],
    topSectors: ['Mining', 'Agriculture'],
  },
  WS: {
    name: 'Samoa',
    region: 'oceania',
    languages: ['sm', 'en'],
    cities: ['Apia'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Tourism'],
  },
  TO: {
    name: 'Tonga',
    region: 'oceania',
    languages: ['to', 'en'],
    cities: ["Nuku'alofa"],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Tourism'],
  },
  VU: {
    name: 'Vanuatu',
    region: 'oceania',
    languages: ['bi', 'en', 'fr'],
    cities: ['Port Vila'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Tourism'],
  },
  SB: {
    name: 'Solomon Islands',
    region: 'oceania',
    languages: ['en'],
    cities: ['Honiara'],
    faiths: ['christianity'],
    topSectors: ['Agriculture', 'Fishing'],
  },
  KI: {
    name: 'Kiribati',
    region: 'oceania',
    languages: ['en', 'gil'],
    cities: ['Tarawa'],
    faiths: ['christianity'],
    topSectors: ['Fishing'],
  },
  MH: {
    name: 'Marshall Islands',
    region: 'oceania',
    languages: ['mh', 'en'],
    cities: ['Majuro'],
    faiths: ['christianity'],
    topSectors: ['Fishing'],
  },
  FM: {
    name: 'Micronesia',
    region: 'oceania',
    languages: ['en'],
    cities: ['Palikir'],
    faiths: ['christianity'],
    topSectors: ['Fishing', 'Tourism'],
  },
  NR: {
    name: 'Nauru',
    region: 'oceania',
    languages: ['na', 'en'],
    cities: ['Yaren'],
    faiths: ['christianity'],
    topSectors: ['Mining'],
  },
  PW: {
    name: 'Palau',
    region: 'oceania',
    languages: ['pau', 'en'],
    cities: ['Ngerulmud'],
    faiths: ['christianity'],
    topSectors: ['Tourism', 'Fishing'],
  },
  TV: {
    name: 'Tuvalu',
    region: 'oceania',
    languages: ['tvl', 'en'],
    cities: ['Funafuti'],
    faiths: ['christianity'],
    topSectors: ['Fishing'],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Country importance tiers (for agent count)
// ─────────────────────────────────────────────────────────────────────────────

const TIER_1 = new Set(['US', 'IN', 'NG', 'KE', 'DE', 'BR', 'CN', 'JP', 'GB', 'FR']) // 8-10 agents
const TIER_2 = new Set([
  'ZA',
  'GH',
  'EG',
  'TZ',
  'UG',
  'ET',
  'CA',
  'AU',
  'MX',
  'RW',
  'IT',
  'ES',
  'NL',
  'TR',
  'AE',
  'SA',
  'KR',
  'ID',
  'PH',
  'PK',
  'BD',
  'RU',
  'UA',
  'PL',
  'CO',
  'AR',
  'TH',
  'VN',
  'MY',
  'SG',
  'SE',
  'NO',
  'CH',
  'AT',
  'IE',
  'IL',
]) // 5-7 agents

// All others: 3-4 agents

// ─────────────────────────────────────────────────────────────────────────────
// Craft-to-category mapping
// ─────────────────────────────────────────────────────────────────────────────

const CRAFT_CATEGORY_MAP: Record<string, string> = {
  'software-development': 'tech',
  'data-science': 'tech',
  'mobile-apps': 'tech',
  'web-design': 'tech',
  photography: 'media',
  videography: 'media',
  'graphic-design': 'media',
  'music-production': 'media',
  agriculture: 'agriculture',
  permaculture: 'agriculture',
  livestock: 'agriculture',
  agritech: 'agriculture',
  teaching: 'education',
  tutoring: 'education',
  mentorship: 'education',
  'curriculum-design': 'education',
  nursing: 'health',
  pharmacy: 'health',
  'mental-health': 'health',
  fitness: 'health',
  cooking: 'hospitality',
  hospitality: 'hospitality',
  'tour-guiding': 'hospitality',
  'event-planning': 'hospitality',
  tailoring: 'fashion',
  'fashion-design': 'fashion',
  jewelry: 'fashion',
  'textile-arts': 'fashion',
  construction: 'engineering',
  electrical: 'engineering',
  plumbing: 'engineering',
  mechanics: 'engineering',
  writing: 'media',
  journalism: 'media',
  translation: 'culture',
  'content-creation': 'media',
  finance: 'trade',
  accounting: 'trade',
  consulting: 'trade',
  marketing: 'trade',
  conservation: 'safari',
  'wildlife-management': 'safari',
  'eco-tourism': 'safari',
  sustainability: 'community',
  carpentry: 'engineering',
  pottery: 'fashion',
  weaving: 'fashion',
  'leather-craft': 'fashion',
}

// ─────────────────────────────────────────────────────────────────────────────
// Sector-to-craft mapping (for country-appropriate craft selection)
// ─────────────────────────────────────────────────────────────────────────────

const SECTOR_CRAFTS: Record<string, string[]> = {
  Technology: ['software-development', 'data-science', 'mobile-apps', 'web-design'],
  Finance: ['finance', 'accounting', 'consulting'],
  'Finance & Banking': ['finance', 'accounting', 'consulting'],
  Healthcare: ['nursing', 'pharmacy', 'mental-health', 'fitness'],
  Agriculture: ['agriculture', 'permaculture', 'livestock', 'agritech'],
  Tourism: ['tour-guiding', 'hospitality', 'photography', 'event-planning'],
  'Safari & Eco-Tourism': ['conservation', 'wildlife-management', 'eco-tourism', 'photography'],
  'Safari & Wildlife': ['conservation', 'wildlife-management', 'eco-tourism', 'photography'],
  Manufacturing: ['construction', 'electrical', 'mechanics', 'carpentry'],
  Mining: ['construction', 'mechanics', 'electrical'],
  'Gold & Mining': ['construction', 'mechanics', 'electrical'],
  Energy: ['electrical', 'construction', 'mechanics', 'sustainability'],
  Education: ['teaching', 'tutoring', 'mentorship', 'curriculum-design'],
  Engineering: ['construction', 'electrical', 'plumbing', 'mechanics'],
  Media: ['photography', 'videography', 'graphic-design', 'content-creation'],
  'Media & Nollywood': ['videography', 'photography', 'content-creation', 'music-production'],
  Fintech: ['software-development', 'data-science', 'finance', 'mobile-apps'],
  Hospitality: ['hospitality', 'cooking', 'event-planning', 'tour-guiding'],
  Fashion: ['fashion-design', 'tailoring', 'jewelry', 'textile-arts'],
  'Fashion & Design': ['fashion-design', 'tailoring', 'graphic-design', 'textile-arts'],
  Trade: ['finance', 'consulting', 'marketing', 'accounting'],
  'Trade & Logistics': ['finance', 'consulting', 'marketing'],
  'IT Services': ['software-development', 'data-science', 'web-design', 'mobile-apps'],
  IT: ['software-development', 'data-science', 'web-design', 'mobile-apps'],
  Construction: ['construction', 'electrical', 'plumbing', 'carpentry'],
  Services: ['consulting', 'marketing', 'content-creation'],
  Pharma: ['pharmacy', 'nursing', 'data-science'],
  'Pharma & Biotech': ['pharmacy', 'nursing', 'data-science'],
  Textiles: ['tailoring', 'textile-arts', 'fashion-design'],
  Fishing: ['sustainability', 'agriculture'],
  Entertainment: ['music-production', 'videography', 'content-creation'],
  Music: ['music-production', 'content-creation'],
  'Research & Academia': ['teaching', 'mentorship', 'data-science'],
  Logistics: ['consulting', 'finance', 'marketing'],
  Oil: ['construction', 'electrical', 'mechanics'],
  Timber: ['carpentry', 'sustainability'],
  Culture: ['translation', 'writing', 'teaching'],
  Shipping: ['consulting', 'finance'],
  Livestock: ['livestock', 'agriculture'],
  'NHS Healthcare': ['nursing', 'pharmacy', 'mental-health'],
}

// ─────────────────────────────────────────────────────────────────────────────
// Bio templates
// ─────────────────────────────────────────────────────────────────────────────

const BIO_TEMPLATES = [
  (name: string, craft: string, city: string, country: string) =>
    `${name} is a ${craft} specialist based in ${city}, ${country}. Passionate about cross-cultural collaboration and knowledge exchange.`,
  (name: string, craft: string, city: string, country: string) =>
    `Based in ${city}, ${name} brings ${craft} expertise to the Be[Country] network. Always looking to connect with pioneers worldwide.`,
  (name: string, craft: string, city: string, country: string) =>
    `${name} works in ${craft} from ${city}, ${country}. Believes in building bridges through shared skills and cultural exchange.`,
  (name: string, craft: string, city: string, country: string) =>
    `A ${craft} professional in ${city}, ${name} is eager to share knowledge and learn from the global community.`,
  (name: string, craft: string, city: string, country: string) =>
    `${name} brings years of ${craft} experience from ${city}. Committed to empowering communities through skill sharing.`,
]

// ─────────────────────────────────────────────────────────────────────────────
// Exchange proposal templates
// ─────────────────────────────────────────────────────────────────────────────

const OFFER_TEMPLATES = [
  (craft: string) => `Offering ${craft.replace(/-/g, ' ')} workshops`,
  (craft: string) => `Sharing ${craft.replace(/-/g, ' ')} expertise`,
  (craft: string) => `Available for ${craft.replace(/-/g, ' ')} mentorship`,
  (craft: string) => `Teaching ${craft.replace(/-/g, ' ')} skills`,
]

const SEEK_TEMPLATES = [
  (interest: string) => `Seeking ${interest} mentorship`,
  (interest: string) => `Looking to learn about ${interest}`,
  (interest: string) => `Interested in ${interest} collaboration`,
]

// ─────────────────────────────────────────────────────────────────────────────
// Main generation functions
// ─────────────────────────────────────────────────────────────────────────────

function getCraftsForCountry(country: CountryData, rng: () => number): string[] {
  const available: string[] = []
  for (const sector of country.topSectors) {
    const crafts = SECTOR_CRAFTS[sector]
    if (crafts) available.push(...crafts)
  }
  // Deduplicate
  const unique = Array.from(new Set(available))
  if (unique.length === 0) return pickN(CRAFT_SUGGESTIONS as unknown as string[], 3, rng)
  return unique
}

function getInterestsForCrafts(crafts: string[]): string[] {
  const ids = new Set<string>()
  for (const craft of crafts) {
    const cat = CRAFT_CATEGORY_MAP[craft]
    if (cat) ids.add(cat)
  }
  // Ensure at least one category
  if (ids.size === 0) ids.add('culture')
  return Array.from(ids)
}

function formatCraftName(craft: string): string {
  return craft.replace(/-/g, ' ')
}

/**
 * Generate AI agent personas for a specific country.
 * Deterministic: same country code always produces the same output.
 */
export function generateAgentsForCountry(countryCode: string): AgentPersona[] {
  const country = COUNTRY_DATA[countryCode]
  if (!country) return []

  const seed = hashCode(countryCode + '-agents')
  const rng = createRng(seed)

  // Determine agent count by tier
  let agentCount: number
  if (TIER_1.has(countryCode)) {
    agentCount = 8 + Math.floor(rng() * 3) // 8-10
  } else if (TIER_2.has(countryCode)) {
    agentCount = 5 + Math.floor(rng() * 3) // 5-7
  } else {
    agentCount = 3 + Math.floor(rng() * 2) // 3-4
  }

  const namePool = NAME_POOLS[country.region]
  const avatarPool = AVATARS_BY_REGION[country.region]
  const countryCrafts = getCraftsForCountry(country, rng)
  const categoryIds = EXCHANGE_CATEGORIES.map((c) => c.id)

  const agents: AgentPersona[] = []

  for (let i = 0; i < agentCount; i++) {
    const name = namePool[Math.floor(rng() * namePool.length)]
    const city = country.cities[Math.floor(rng() * country.cities.length)]
    const avatar = avatarPool[Math.floor(rng() * avatarPool.length)]
    const style = RESPONSE_STYLES[Math.floor(rng() * RESPONSE_STYLES.length)]

    // Select 1-3 crafts
    const craftCount = 1 + Math.floor(rng() * 3)
    const agentCrafts = pickN(countryCrafts, craftCount, rng)

    // Interests from crafts + 1 random
    const interests = getInterestsForCrafts(agentCrafts)
    const extraInterest = categoryIds[Math.floor(rng() * categoryIds.length)]
    if (!interests.includes(extraInterest)) interests.push(extraInterest)

    // Languages: country languages + maybe English if not already included
    const languages = [...country.languages]
    if (!languages.includes('en') && rng() > 0.4) {
      languages.push('en')
    }

    // Reach: 1-2
    const reachCount = 1 + Math.floor(rng() * 2)
    const reach = pickN(REACH_OPTIONS as unknown as string[], reachCount, rng)

    // Faith: optional, from country's predominant faiths
    const faith =
      country.faiths.length > 0 && rng() > 0.3
        ? country.faiths[Math.floor(rng() * country.faiths.length)]
        : undefined

    // Bio
    const bioTemplate = BIO_TEMPLATES[Math.floor(rng() * BIO_TEMPLATES.length)]
    const bio = bioTemplate(name, formatCraftName(agentCrafts[0]), city, country.name)

    // Exchange proposals: 1-3
    const proposals: string[] = []
    // Always offer something based on first craft
    const offerTemplate = OFFER_TEMPLATES[Math.floor(rng() * OFFER_TEMPLATES.length)]
    proposals.push(offerTemplate(agentCrafts[0]))
    // Maybe seek something
    if (rng() > 0.3) {
      const seekInterest = interests[Math.floor(rng() * interests.length)]
      const seekCat = EXCHANGE_CATEGORIES.find((c) => c.id === seekInterest)
      if (seekCat) {
        const seekTemplate = SEEK_TEMPLATES[Math.floor(rng() * SEEK_TEMPLATES.length)]
        proposals.push(seekTemplate(seekCat.label.toLowerCase()))
      }
    }
    // Maybe add a third
    if (agentCrafts.length > 1 && rng() > 0.5) {
      proposals.push(`Offering ${formatCraftName(agentCrafts[1])} guidance`)
    }

    const id = `agent-${countryCode.toLowerCase()}-${String(i + 1).padStart(3, '0')}`

    agents.push({
      id,
      type: 'ai',
      name,
      avatar,
      country: countryCode,
      city,
      languages,
      faith,
      craft: agentCrafts,
      interests,
      reach,
      culture: country.region,
      bio,
      exchangeProposals: proposals,
      responseStyle: style,
    })
  }

  return agents
}

/**
 * Generate AI agent personas for ALL countries.
 * Returns 500-1500 agents total.
 */
export function generateAllAgents(): AgentPersona[] {
  const all: AgentPersona[] = []
  for (const code of Object.keys(COUNTRY_DATA)) {
    all.push(...generateAgentsForCountry(code))
  }
  return all
}

/**
 * Get all country codes in the agent network.
 */
export function getAgentCountryCodes(): string[] {
  return Object.keys(COUNTRY_DATA)
}

/**
 * Get country data for a specific code.
 */
export function getAgentCountryData(code: string): CountryData | undefined {
  return COUNTRY_DATA[code]
}

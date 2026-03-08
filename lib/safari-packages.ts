export interface SafariPackage {
  id: string
  name: string
  provider: string // 'Victoria Paradise' | 'FessyTours' | 'Orpul Safaris'
  type: 'deep_sea_fishing' | 'wildlife_safari' | 'eco_lodge' | 'cultural'
  duration: string
  maxGuests: number
  destination: string
  priceEUR?: number // per person
  priceUSD?: number // per person
  priceKES?: number // per person
  priceNote?: string // e.g. "for 2 guests total"
  season?: 'high' | 'low' | 'all'
  includes: string[]
  excludes: string[]
  highlights: string[]
  days: { day: number; title: string; description: string; meals: string }[]
  optionalActivities?: { name: string; priceUSD: number; unit: string }[]
  markup?: number // FessyTours adds 30%
  status: 'available' | 'coming_soon'
  imageHint: string
}

export const SAFARI_PACKAGES: SafariPackage[] = [
  {
    id: 'victoria-deep-sea',
    name: 'Deep Sea Fishing — Victoria Paradise',
    provider: 'Victoria Paradise',
    type: 'deep_sea_fishing',
    duration: 'Full Day',
    maxGuests: 6,
    destination: 'Lake Victoria / Indian Ocean',
    priceEUR: 350,
    priceNote: 'per group (max 6 people — share the cost)',
    season: 'all',
    includes: [
      'Mako 23ft boat',
      '2x 85HP engines',
      'Professional captain',
      'Fishing gear',
      'Safety equipment',
    ],
    excludes: ['Food & drinks', 'Fish processing', 'Transport to marina'],
    highlights: [
      'World-class deep sea fishing',
      'State-of-the-art Mako 23ft boat',
      'Twin 85HP engines',
      'Max 6 guests — perfect for groups',
    ],
    days: [
      {
        day: 1,
        title: 'Full Day Fishing Adventure',
        description:
          'Depart early morning from the marina aboard the Mako 23ft. Your professional captain knows the best spots. Fish for marlin, tuna, dorado, and more. Return by afternoon with your catch.',
        meals: 'Bring your own provisions',
      },
    ],
    status: 'available',
    imageHint: 'deep sea fishing boat ocean',
  },
  {
    id: 'victoria-tsavo-east',
    name: 'Tsavo East Safari — 2 Days 1 Night',
    provider: 'Victoria Safari',
    type: 'wildlife_safari',
    duration: '2 Days / 1 Night',
    maxGuests: 8,
    destination: 'Tsavo East National Park',
    priceEUR: 290,
    priceNote: 'per person, all inclusive',
    season: 'all',
    includes: [
      '4x4 Safari Vehicle',
      'Park entrance fees',
      'Accommodation',
      'All meals',
      'Professional guide',
      'Game drives',
    ],
    excludes: ['Personal items', 'Tips', 'Alcohol'],
    highlights: [
      'Tsavo East — Kenyas largest park',
      'Famous Red Elephants',
      'Big 5 wildlife',
      'Yatta Plateau views',
      'All inclusive pricing',
    ],
    days: [
      {
        day: 1,
        title: 'Nairobi to Tsavo East',
        description:
          'Depart Nairobi for the scenic drive to Tsavo East. Check-in at lodge. Evening game drive spotting lions, elephants, buffalo, and the famous red elephants of Tsavo. Dinner and overnight.',
        meals: 'Lunch, Dinner',
      },
      {
        day: 2,
        title: 'Full Game Drives & Return',
        description:
          'Early morning game drive at sunrise — best predator activity. Breakfast at lodge. Morning game drive continuing through the park. Lunch and depart for Nairobi with memories to last a lifetime.',
        meals: 'Breakfast, Lunch',
      },
    ],
    status: 'available',
    imageHint: 'Tsavo East Kenya red elephant safari',
  },
  {
    id: 'maasai-mara-3day',
    name: 'Maasai Mara Classic — 3 Days 2 Nights',
    provider: 'FessyTours via Orpul Safaris Camp',
    type: 'wildlife_safari',
    duration: '3 Days / 2 Nights',
    maxGuests: 6,
    destination: 'Maasai Mara National Reserve',
    priceUSD: 520, // $1,040 for 2 guests = $520 per person
    priceNote: '$1,040 total for 2 guests (FessyTours 30% service included)',
    season: 'all',
    includes: [
      'Accommodation at Orpul Safaris Camp (breakfast only)',
      'Safari jeep',
      'Park entrance fees',
      'FessyTours 30% service',
    ],
    excludes: ['Lunch', 'Dinner', 'Drinks', 'Optional activities'],
    highlights: [
      'Maasai Mara — Africas greatest wildlife reserve',
      'Orpul Safaris Camp',
      'Big 5 game drives',
      'Maasai cultural visit option',
      'Great Rift Valley views',
    ],
    days: [
      {
        day: 1,
        title: 'Nairobi → Maasai Mara (Arrival & Evening Drive)',
        description:
          'Depart Nairobi for the scenic drive to Maasai Mara. Stop at the Great Rift Valley viewpoint for photography. Check-in at Orpul Safaris Camp. Evening game drive at sunset — lions, elephants, zebras, wildebeest.',
        meals: 'Breakfast (next morning)',
      },
      {
        day: 2,
        title: 'Full Day in the Mara (Morning & Afternoon Drives)',
        description:
          'Early morning game drive — prime predator hunting time. Return for breakfast. Afternoon game drive into the deeper Mara ecosystem. Optional Maasai Village visit ($30/person) for authentic cultural experience.',
        meals: 'Breakfast',
      },
      {
        day: 3,
        title: 'Maasai Mara → Nairobi (Departure)',
        description:
          'Optional early morning game drive or Mara River nature walk with ranger ($10/group). Breakfast, check-out, and journey back to Nairobi with incredible memories.',
        meals: 'Breakfast',
      },
    ],
    optionalActivities: [
      { name: '🎈 Hot Air Balloon Safari', priceUSD: 500, unit: 'per person' },
      { name: '🏕️ Maasai Village Visit', priceUSD: 30, unit: 'per person' },
      { name: '🚶 Nature Walk with Ranger', priceUSD: 10, unit: 'per group' },
    ],
    markup: 0.30,
    status: 'available',
    imageHint: 'Maasai Mara Kenya lion savanna sunset',
  },
  {
    id: 'kenya-5day-high-season',
    name: 'Kenya Grand Safari — 5 Days (High Season)',
    provider: 'Victoria Safari',
    type: 'wildlife_safari',
    duration: '5 Days',
    maxGuests: 6,
    destination: 'Maasai Mara + Lake Nakuru + Lake Naivasha',
    priceEUR: 5025, // 1385+2120+1300+620 (2 pax estimate)
    priceNote:
      'Full package — 4x4 LandCruiser, park fees (Mara+Nakuru+Naivasha), full board budget accommodation',
    season: 'high',
    includes: [
      '4x4 LandCruiser (5 days, everything inclusive) — €1,385',
      'Park fees: Mara + Nakuru + Naivasha — €2,120',
      'Accommodation full board (budget) — €1,300',
      'Miscellaneous & margin — €620',
    ],
    excludes: ['Flights to Kenya', 'Personal expenses', 'Gratuities'],
    highlights: [
      '5-day grand circuit',
      'Maasai Mara Big 5',
      'Flamingos at Lake Nakuru',
      'Hippos at Lake Naivasha',
      'Full board included',
    ],
    days: [
      {
        day: 1,
        title: 'Nairobi → Maasai Mara',
        description: 'Drive to Mara, check-in, evening game drive.',
        meals: 'Full board',
      },
      {
        day: 2,
        title: 'Full Day Maasai Mara',
        description: 'Morning + afternoon game drives. Optional hot air balloon.',
        meals: 'Full board',
      },
      {
        day: 3,
        title: 'Mara → Lake Nakuru',
        description: 'Drive north to Nakuru. Game drive for rhinos, flamingos, lions.',
        meals: 'Full board',
      },
      {
        day: 4,
        title: 'Lake Nakuru → Lake Naivasha',
        description: 'Boat safari for hippos. Cycling in Hells Gate NP.',
        meals: 'Full board',
      },
      {
        day: 5,
        title: 'Naivasha → Nairobi',
        description: 'Morning at the lake. Drive back to Nairobi for flights.',
        meals: 'Breakfast',
      },
    ],
    status: 'available',
    imageHint: 'Kenya grand safari flamingos Nakuru LandCruiser',
  },
  {
    id: 'kenya-5day-low-season',
    name: 'Kenya Grand Safari — 5 Days (Low Season)',
    provider: 'Victoria Safari',
    type: 'wildlife_safari',
    duration: '5 Days',
    maxGuests: 6,
    destination: 'Maasai Mara + Lake Nakuru + Lake Naivasha',
    priceEUR: 4500, // 1070+1750+1060+620
    priceNote: 'Same itinerary at low season pricing (Jan–June)',
    season: 'low',
    includes: [
      '4x4 LandCruiser (5 days) — €1,070',
      'Park fees: Mara + Nakuru + Naivasha — €1,750',
      'Accommodation full board (budget) — €1,060',
      'Miscellaneous & margin — €620',
    ],
    excludes: ['Flights to Kenya', 'Personal expenses', 'Gratuities'],
    highlights: [
      'Same 5-day grand circuit',
      'Low season savings',
      'Fewer crowds in the parks',
      'Green landscape photography',
      'Best value Kenya safari',
    ],
    days: [
      {
        day: 1,
        title: 'Nairobi → Maasai Mara',
        description: 'Drive to Mara, check-in, evening game drive.',
        meals: 'Full board',
      },
      {
        day: 2,
        title: 'Full Day Maasai Mara',
        description: 'Morning + afternoon game drives.',
        meals: 'Full board',
      },
      {
        day: 3,
        title: 'Mara → Lake Nakuru',
        description: 'Game drive for rhinos, flamingos, lions.',
        meals: 'Full board',
      },
      {
        day: 4,
        title: 'Lake Nakuru → Lake Naivasha',
        description: 'Boat safari, Hells Gate cycling.',
        meals: 'Full board',
      },
      {
        day: 5,
        title: 'Naivasha → Nairobi',
        description: 'Morning at lake, drive to Nairobi.',
        meals: 'Breakfast',
      },
    ],
    status: 'available',
    imageHint: 'Kenya low season green savanna safari',
  },
  {
    id: 'maasai-mara-budget',
    name: 'Maasai Mara Budget Safari',
    provider: 'FessyTours',
    type: 'wildlife_safari',
    duration: '3 Days / 2 Nights',
    maxGuests: 6,
    destination: 'Maasai Mara National Reserve',
    priceUSD: 650, // high season $650 all inclusive (+30%)
    priceNote:
      'All inclusive, high season. Low season (Jan–June): $450/person. FessyTours 30% always added.',
    season: 'all',
    includes: [
      'Accommodation',
      'All meals',
      'Safari vehicle',
      'Park fees',
      'Guide',
      'FessyTours 30% service',
    ],
    excludes: ['Flights', 'Personal items', 'Tips'],
    highlights: [
      'Best budget Mara experience',
      'All inclusive pricing',
      'Professional guides',
      'Low season discount available',
    ],
    days: [
      {
        day: 1,
        title: 'Nairobi → Maasai Mara',
        description: 'Morning drive to Mara. Evening game drive.',
        meals: 'All meals',
      },
      {
        day: 2,
        title: 'Full Mara Experience',
        description: 'Morning and afternoon game drives.',
        meals: 'All meals',
      },
      {
        day: 3,
        title: 'Final Drive → Nairobi',
        description: 'Early drive before departing.',
        meals: 'Breakfast',
      },
    ],
    status: 'available',
    imageHint: 'Maasai Mara budget camp wildlife',
  },
]

export function getPackagesByType(type: SafariPackage['type']): SafariPackage[] {
  return SAFARI_PACKAGES.filter(p => p.type === type)
}

export function getPackageById(id: string): SafariPackage | undefined {
  return SAFARI_PACKAGES.find(p => p.id === id)
}

export function formatPackagePrice(pkg: SafariPackage): string {
  if (pkg.priceEUR) return `€${pkg.priceEUR.toLocaleString('en-US')}`
  if (pkg.priceUSD) return `$${pkg.priceUSD.toLocaleString('en-US')}`
  if (pkg.priceKES) return `KES ${pkg.priceKES.toLocaleString('en-US')}`
  return 'Price on request'
}

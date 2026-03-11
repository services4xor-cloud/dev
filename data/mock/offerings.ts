/**
 * Mock data for Kenya Offerings pages
 *
 * Three categories: Safaris, Eco-Tourism, Trade Corridors
 * Safari data comes from lib/safari-packages.ts (real packages)
 * Eco-tourism and trade data lives here until DB is connected.
 */

// ── Eco-Tourism Offerings ─────────────────────────────────────────────

export interface EcoTourismOffering {
  id: string
  name: string
  location: string
  type: 'eco-lodge' | 'conservation' | 'community-stay' | 'permaculture'
  duration: string
  priceUSD: number
  priceNote: string
  capacity: number
  highlights: string[]
  impactNote: string
  seasonBest: string
  imageHint: string
}

export const ECO_TOURISM_OFFERINGS: EcoTourismOffering[] = [
  {
    id: 'lamu-eco-retreat',
    name: 'Lamu Island Eco-Retreat',
    location: 'Lamu Archipelago, Coast Province',
    type: 'eco-lodge',
    duration: '4 Days / 3 Nights',
    priceUSD: 380,
    priceNote: 'per person, full board',
    capacity: 12,
    highlights: [
      'UNESCO World Heritage site',
      'Solar-powered lodge on waterfront',
      'Traditional dhow sailing',
      'Swahili cooking workshop',
      'Mangrove conservation walk',
    ],
    impactNote: '15% of booking supports Lamu Marine Conservation Trust',
    seasonBest: 'October — March (dry season)',
    imageHint: 'Lamu dhow boat turquoise water',
  },
  {
    id: 'ol-pejeta-conservancy',
    name: 'Ol Pejeta Conservancy Stay',
    location: 'Laikipia County, Central Kenya',
    type: 'conservation',
    duration: '3 Days / 2 Nights',
    priceUSD: 450,
    priceNote: 'per person, includes park fees',
    capacity: 8,
    highlights: [
      'Home to the last 2 Northern White Rhinos',
      'Chimpanzee sanctuary visit',
      'Night game drives',
      'Conservation briefing with rangers',
      'All Big 5 in one conservancy',
    ],
    impactNote: '20% of booking funds rhino protection patrols',
    seasonBest: 'Year-round (dry: Jun–Oct best for game viewing)',
    imageHint: 'Ol Pejeta rhino conservancy Kenya',
  },
  {
    id: 'maasai-community-stay',
    name: 'Maasai Community Immersion',
    location: 'Kajiado County, Southern Kenya',
    type: 'community-stay',
    duration: '3 Days / 2 Nights',
    priceUSD: 220,
    priceNote: 'per person, homestay included',
    capacity: 6,
    highlights: [
      'Live with a Maasai family',
      'Cattle herding experience',
      'Beadwork workshop with Maasai women',
      'Bush walk with Maasai warriors',
      'Traditional ceremony attendance',
    ],
    impactNote: '100% of homestay fee goes directly to the host family',
    seasonBest: 'Year-round',
    imageHint: 'Maasai community bead work Kenya',
  },
  {
    id: 'kakamega-forest-camp',
    name: 'Kakamega Rainforest Explorer',
    location: 'Kakamega County, Western Kenya',
    type: 'conservation',
    duration: '2 Days / 1 Night',
    priceUSD: 160,
    priceNote: 'per person, guided',
    capacity: 10,
    highlights: [
      'Last remaining tropical rainforest in Kenya',
      'Over 330 bird species',
      'Night forest walk with guide',
      'Medicinal plant tour',
      'Community tree planting',
    ],
    impactNote: '10% supports Kenya Forest Service reforestation',
    seasonBest: 'Year-round (birds best Jan–Mar)',
    imageHint: 'Kakamega forest canopy birds Kenya',
  },
  {
    id: 'watamu-marine-eco',
    name: 'Watamu Marine Eco-Experience',
    location: 'Watamu, Kilifi County',
    type: 'conservation',
    duration: '3 Days / 2 Nights',
    priceUSD: 320,
    priceNote: 'per person, snorkeling included',
    capacity: 8,
    highlights: [
      'Watamu Marine National Park',
      'Sea turtle conservation project',
      'Coral reef snorkeling',
      'Whale shark spotting (seasonal)',
      'Beach cleanup with Local Ocean Conservation',
    ],
    impactNote: '15% supports Local Ocean Conservation turtle rescue',
    seasonBest: 'October — March (whale sharks: Oct–Mar)',
    imageHint: 'Watamu sea turtle marine Kenya',
  },
  {
    id: 'mt-kenya-permaculture',
    name: 'Mt Kenya Permaculture Farm Stay',
    location: 'Nyeri County, Central Kenya',
    type: 'permaculture',
    duration: '5 Days / 4 Nights',
    priceUSD: 280,
    priceNote: 'per person, meals from farm',
    capacity: 8,
    highlights: [
      'Working organic farm at 2,000m altitude',
      'Learn permaculture design principles',
      'Coffee processing from cherry to cup',
      'Mt Kenya views from farm',
      'Cook with ingredients you harvest',
    ],
    impactNote: 'Training local youth in sustainable agriculture',
    seasonBest: 'Year-round (dry season Jun–Oct best)',
    imageHint: 'Mt Kenya farm permaculture coffee',
  },
]

// ── Trade Corridors ───────────────────────────────────────────────────

export interface TradeCorridor {
  id: string
  name: string
  fromCountry: string
  toCountry: string
  fromFlag: string
  toFlag: string
  sectors: string[]
  tradeVolume: string
  growthRate: string
  keyProducts: string[]
  opportunities: string[]
  paymentRails: string[]
  visaNote: string
  strength: 'direct' | 'partner' | 'emerging'
}

export const TRADE_CORRIDORS: TradeCorridor[] = [
  {
    id: 'ke-de',
    name: 'Kenya — Germany',
    fromCountry: 'Kenya',
    toCountry: 'Germany',
    fromFlag: '🇰🇪',
    toFlag: '🇩🇪',
    sectors: ['Safari & Wildlife', 'Eco-Tourism', 'Healthcare', 'Technology'],
    tradeVolume: '$1.2B annual bilateral trade',
    growthRate: '+12% year-over-year',
    keyProducts: ['Tea & Coffee', 'Cut Flowers', 'Textiles', 'Tech Services'],
    opportunities: [
      'GIZ-funded professional exchange programs',
      'German hospital nursing recruitment',
      'Safari lodge management partnerships',
      'Renewable energy tech transfer',
    ],
    paymentRails: ['M-Pesa', 'SEPA', 'Wise'],
    visaNote:
      'Schengen visa required. Germany has high demand for Kenyan professionals in healthcare and tech.',
    strength: 'direct',
  },
  {
    id: 'ke-gb',
    name: 'Kenya — United Kingdom',
    fromCountry: 'Kenya',
    toCountry: 'United Kingdom',
    fromFlag: '🇰🇪',
    toFlag: '🇬🇧',
    sectors: ['Healthcare', 'Education', 'Technology', 'Hospitality'],
    tradeVolume: '$1.8B annual bilateral trade',
    growthRate: '+8% year-over-year',
    keyProducts: ['Tea', 'Horticulture', 'Education Services', 'Tech Talent'],
    opportunities: [
      'NHS Skilled Worker visa for Kenyan nurses',
      'Commonwealth scholarship programs',
      'London fintech corridors',
      'Hospitality management placements',
    ],
    paymentRails: ['M-Pesa', 'Bank Transfer', 'Wise'],
    visaNote: 'UK Skilled Worker visa. Kenya has a strong corridor for NHS workers.',
    strength: 'direct',
  },
  {
    id: 'ke-ae',
    name: 'Kenya — UAE',
    fromCountry: 'Kenya',
    toCountry: 'UAE',
    fromFlag: '🇰🇪',
    toFlag: '🇦🇪',
    sectors: ['Hospitality', 'Logistics', 'Construction', 'Domestic Work'],
    tradeVolume: '$2.1B annual bilateral trade',
    growthRate: '+15% year-over-year',
    keyProducts: ['Re-exports', 'Hospitality Talent', 'Logistics Services'],
    opportunities: [
      'Dubai hospitality sector recruitment',
      'Abu Dhabi logistics hub placements',
      'Free zone business partnerships',
      'Trade re-export opportunities',
    ],
    paymentRails: ['M-Pesa', 'Bank Transfer', 'Western Union'],
    visaNote: 'UAE employment visa through employer. High demand for Kenyan hospitality workers.',
    strength: 'direct',
  },
  {
    id: 'ke-us',
    name: 'Kenya — United States',
    fromCountry: 'Kenya',
    toCountry: 'United States',
    fromFlag: '🇰🇪',
    toFlag: '🇺🇸',
    sectors: ['Technology', 'Healthcare', 'Education', 'Finance'],
    tradeVolume: '$900M annual bilateral trade',
    growthRate: '+10% year-over-year',
    keyProducts: ['AGOA exports', 'Tech Services', 'Education', 'Coffee'],
    opportunities: [
      'Silicon Savannah tech talent pipeline',
      'US healthcare professional exchange',
      'AGOA trade preferences for exports',
      'Kenyan diaspora business network',
    ],
    paymentRails: ['M-Pesa', 'ACH', 'PayPal'],
    visaNote: 'H1B for professionals, green card lottery. Strong Kenyan diaspora in US.',
    strength: 'partner',
  },
  {
    id: 'ke-ca',
    name: 'Kenya — Canada',
    fromCountry: 'Kenya',
    toCountry: 'Canada',
    fromFlag: '🇰🇪',
    toFlag: '🇨🇦',
    sectors: ['Healthcare', 'Technology', 'Hospitality', 'Agriculture'],
    tradeVolume: '$400M annual bilateral trade',
    growthRate: '+14% year-over-year',
    keyProducts: ['Coffee', 'Horticulture', 'Tech Talent', 'Agricultural Tech'],
    opportunities: [
      'Express Entry for skilled professionals',
      'Provincial nominee programs',
      'AgriTech knowledge transfer',
      'Tourism hospitality placements',
    ],
    paymentRails: ['M-Pesa', 'Bank Transfer', 'Wise'],
    visaNote: 'Canada Express Entry. Kenyan professionals well-regarded in Canadian market.',
    strength: 'partner',
  },
  {
    id: 'ng-ke',
    name: 'Nigeria — Kenya',
    fromCountry: 'Nigeria',
    toCountry: 'Kenya',
    fromFlag: '🇳🇬',
    toFlag: '🇰🇪',
    sectors: ['Technology', 'Finance & Banking', 'Media & Content'],
    tradeVolume: '$350M annual bilateral trade',
    growthRate: '+22% year-over-year',
    keyProducts: ['Fintech Services', 'Media Content', 'E-commerce'],
    opportunities: [
      'Lagos-Nairobi tech corridor',
      'Fintech cross-border expansion',
      'Nollywood-Kenya media production',
      'Pan-African startup ecosystem',
    ],
    paymentRails: ['Flutterwave', 'M-Pesa', 'Paystack'],
    visaNote: 'EAC free movement. Nigeria-Kenya tech corridor growing rapidly.',
    strength: 'partner',
  },
]

// ── Offerings Landing Page Stats ──────────────────────────────────────

export const OFFERINGS_STATS = [
  { label: 'Safari Packages', value: '6', icon: '🦁' },
  { label: 'Eco-Tourism Experiences', value: '6', icon: '🌿' },
  { label: 'Trade Corridors', value: '6', icon: '🌍' },
  { label: 'Countries Connected', value: '7', icon: '🧭' },
] as const

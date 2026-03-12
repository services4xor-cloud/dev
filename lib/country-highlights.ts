/**
 * Country Highlights — Location-unique resources, events, and experiences
 *
 * Things that can ONLY be achieved in specific parts of the world.
 * Used by: Gate pages, compass recommendations, offerings page.
 */

export interface CountryHighlight {
  type: 'event' | 'resource' | 'experience' | 'certification'
  name: string
  description: string
  season?: string
  sector?: string
}

export interface CountryHighlights {
  country: string
  highlights: CountryHighlight[]
}

export const COUNTRY_HIGHLIGHTS: Record<string, CountryHighlight[]> = {
  KE: [
    {
      type: 'experience',
      name: 'Great Migration Safari',
      description:
        'Witness the Maasai Mara wildebeest migration — one of the Seven Wonders of the Natural World',
      season: 'Jul — Oct',
      sector: 'Tourism',
    },
    {
      type: 'certification',
      name: 'Safari Guide Certification',
      description:
        'Kenya Wildlife Service accredited guide training with field experience in national parks',
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Coffee Origin Sourcing',
      description: 'Direct-trade specialty coffee from Nyeri, Kiambu, and Mt Kenya cooperatives',
      sector: 'Agriculture',
    },
    {
      type: 'experience',
      name: 'Maasai Cultural Immersion',
      description: 'Live with Maasai communities — beadwork, cattle herding, warrior traditions',
      sector: 'Cultural Exchange',
    },
    {
      type: 'resource',
      name: 'M-Pesa Innovation Hub',
      description: "Access to the world's leading mobile money ecosystem and fintech talent pool",
      sector: 'Technology',
    },
  ],
  DE: [
    {
      type: 'event',
      name: 'Oktoberfest',
      description:
        "The world's largest folk festival in Munich — cultural landmark and hospitality sector opportunity",
      season: 'Sep — Oct',
      sector: 'Hospitality',
    },
    {
      type: 'certification',
      name: 'German Dual Education (Ausbildung)',
      description:
        'World-renowned apprenticeship system combining classroom theory with workplace training',
      sector: 'Education',
    },
    {
      type: 'resource',
      name: 'Automotive Engineering Hub',
      description: 'Access to BMW, Mercedes, VW, Porsche R&D centers and supply chain networks',
      sector: 'Automotive',
    },
    {
      type: 'event',
      name: 'Christmas Markets (Weihnachtsmärkte)',
      description:
        'Centuries-old holiday tradition across 2,500+ markets — seasonal hospitality sector',
      season: 'Nov — Dec',
      sector: 'Hospitality',
    },
    {
      type: 'resource',
      name: 'Renewable Energy Leadership',
      description:
        "Energiewende — Germany's green energy transition with world-leading solar and wind capacity",
      sector: 'Energy',
    },
  ],
  CH: [
    {
      type: 'resource',
      name: 'Swiss Banking Sector',
      description:
        'Access to global wealth management, private banking, and fintech innovation in Zurich and Geneva',
      sector: 'Finance & Banking',
    },
    {
      type: 'certification',
      name: 'Swiss Watchmaking School',
      description: 'Haute horlogerie training in Vallée de Joux — the cradle of luxury watchmaking',
      sector: 'Precision Engineering',
    },
    {
      type: 'experience',
      name: 'Alpine Ski Season',
      description:
        'World-class ski resorts (Zermatt, St. Moritz, Verbier) — seasonal hospitality employment',
      season: 'Dec — Apr',
      sector: 'Hospitality',
    },
    {
      type: 'resource',
      name: 'Swiss Hospitality Management',
      description:
        "EHL and Les Roches — world's top hospitality schools headquartered in Switzerland",
      sector: 'Hospitality',
    },
    {
      type: 'resource',
      name: 'CERN & Pharma Research',
      description:
        'Access to world-leading physics research and Basel pharma corridor (Novartis, Roche)',
      sector: 'Science',
    },
  ],
  US: [
    {
      type: 'resource',
      name: 'Silicon Valley Tech Ecosystem',
      description: "World's largest concentration of tech companies, VCs, and startup talent",
      sector: 'Technology',
    },
    {
      type: 'resource',
      name: 'Wall Street Financial Hub',
      description:
        'Global financial capital — access to NYSE, investment banks, and fintech innovation',
      sector: 'Finance & Banking',
    },
    {
      type: 'experience',
      name: 'National Park System',
      description:
        '63 national parks from Yellowstone to Grand Canyon — eco-tourism and conservation careers',
      sector: 'Tourism',
    },
    {
      type: 'certification',
      name: 'US Medical Residency',
      description: 'USMLE pathway for international medical graduates to practice in the US',
      sector: 'Healthcare',
    },
    {
      type: 'resource',
      name: 'Hollywood & Media Industry',
      description:
        'Global entertainment capital — film, TV, streaming, and digital media production',
      sector: 'Media & Content',
    },
  ],
  NG: [
    {
      type: 'resource',
      name: 'Lagos Tech Scene (Yaba)',
      description:
        "Africa's largest tech hub — home to Flutterwave, Paystack, and hundreds of startups",
      sector: 'Technology',
    },
    {
      type: 'resource',
      name: 'Nollywood Film Industry',
      description:
        "World's second-largest film industry by volume — acting, production, and distribution",
      sector: 'Media & Content',
    },
    {
      type: 'resource',
      name: 'Oil & Gas Sector',
      description:
        "Africa's largest oil producer — engineering, logistics, and energy sector opportunities",
      sector: 'Energy',
    },
    {
      type: 'experience',
      name: 'Calabar Carnival',
      description:
        "Africa's biggest street party — cultural celebration and creative arts showcase",
      season: 'Dec',
      sector: 'Cultural Exchange',
    },
    {
      type: 'resource',
      name: 'Afrobeats Music Industry',
      description:
        'Global music export — recording, production, and performance opportunities in Lagos',
      sector: 'Media & Content',
    },
  ],
  GH: [
    {
      type: 'experience',
      name: 'Cape Coast Heritage Tour',
      description:
        'UNESCO World Heritage slave castles — historical education and cultural remembrance',
      sector: 'Cultural Exchange',
    },
    {
      type: 'event',
      name: 'Chale Wote Street Art Festival',
      description: "West Africa's largest street art festival in Jamestown, Accra",
      season: 'Aug',
      sector: 'Creative Arts',
    },
    {
      type: 'resource',
      name: 'Cocoa Industry',
      description:
        "World's second-largest cocoa producer — farm-to-bar experiences and trade opportunities",
      sector: 'Agriculture',
    },
    {
      type: 'resource',
      name: 'Accra Tech Hub',
      description: "Growing startup ecosystem with Google's first African AI research center",
      sector: 'Technology',
    },
    {
      type: 'experience',
      name: 'Volta Region Adventures',
      description: "Waterfalls, hiking, and community-based tourism in Ghana's eastern highlands",
      sector: 'Tourism',
    },
  ],
  ZA: [
    {
      type: 'experience',
      name: 'Kruger National Park',
      description: "Africa's premier wildlife reserve — Big Five safaris and conservation research",
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Cape Town Creative Hub',
      description: "Africa's design capital — advertising, fashion, film, and tech industries",
      sector: 'Creative Arts',
    },
    {
      type: 'resource',
      name: 'Mining & Resources Sector',
      description:
        "World's leading producer of platinum, gold, and diamonds — engineering and geology careers",
      sector: 'Mining',
    },
    {
      type: 'experience',
      name: 'Cape Winelands',
      description: 'World-class wine region — viticulture training and hospitality careers',
      sector: 'Hospitality',
    },
    {
      type: 'resource',
      name: 'Johannesburg Financial Hub',
      description: "Africa's largest stock exchange and financial services center",
      sector: 'Finance & Banking',
    },
  ],
  UG: [
    {
      type: 'experience',
      name: 'Mountain Gorilla Trekking',
      description:
        'Track endangered mountain gorillas in Bwindi Impenetrable Forest — unique to Uganda, Rwanda, and DRC',
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Source of the Nile',
      description:
        'Jinja — adventure tourism capital with white-water rafting, bungee, and kayaking',
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Agricultural Heartland',
      description: 'Fertile highlands producing coffee, tea, and flowers for export',
      sector: 'Agriculture',
    },
    {
      type: 'experience',
      name: 'Queen Elizabeth National Park',
      description:
        'Tree-climbing lions and Kazinga Channel boat safaris — unique wildlife encounters',
      sector: 'Tourism',
    },
  ],
  TZ: [
    {
      type: 'experience',
      name: 'Kilimanjaro Summit',
      description: "Africa's highest peak — guided treks supporting local porter communities",
      sector: 'Tourism',
    },
    {
      type: 'experience',
      name: 'Serengeti Migration',
      description: 'The Tanzania side of the Great Migration — calving season and river crossings',
      season: 'Jan — Mar, Jun — Jul',
      sector: 'Tourism',
    },
    {
      type: 'experience',
      name: 'Zanzibar Spice Islands',
      description: 'Historic spice trade, Stone Town UNESCO heritage, and marine tourism',
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Tanzanite Mining',
      description:
        "World's only source of tanzanite gemstones — unique resource and trade opportunity",
      sector: 'Mining',
    },
  ],
  IN: [
    {
      type: 'resource',
      name: 'Bangalore IT Hub',
      description:
        "India's Silicon Valley — world's largest IT outsourcing center and startup ecosystem",
      sector: 'Technology',
    },
    {
      type: 'experience',
      name: 'Ayurveda & Wellness',
      description:
        'Kerala — birthplace of Ayurveda with world-class wellness retreats and training',
      sector: 'Healthcare',
    },
    {
      type: 'event',
      name: 'Diwali Festival',
      description:
        "Festival of Lights — India's biggest celebration with cultural significance across religions",
      season: 'Oct — Nov',
      sector: 'Cultural Exchange',
    },
    {
      type: 'resource',
      name: 'Bollywood Film Industry',
      description: "World's largest film industry by output — Mumbai's entertainment ecosystem",
      sector: 'Media & Content',
    },
    {
      type: 'resource',
      name: 'Textile & Fashion Heritage',
      description: 'Centuries of textile tradition — from Varanasi silk to Jaipur block printing',
      sector: 'Fashion & Design',
    },
  ],
  AE: [
    {
      type: 'resource',
      name: 'Dubai Free Zones',
      description:
        'Tax-free business zones (DIFC, DMCC, JAFZA) — startup-friendly with 100% foreign ownership',
      sector: 'Business',
    },
    {
      type: 'event',
      name: 'Dubai Expo & Global Events',
      description: 'World-class exhibitions, conferences, and trade shows year-round',
      sector: 'Business',
    },
    {
      type: 'experience',
      name: 'Desert Conservation',
      description:
        'Al Marmoom Desert Conservation Reserve — Arabian oryx and sustainability initiatives',
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Aviation Hub',
      description:
        "Emirates, Etihad — world's busiest international airport and aviation career paths",
      sector: 'Aviation',
    },
    {
      type: 'resource',
      name: 'Hospitality Mega-Sector',
      description:
        'Luxury hotels, restaurants, and tourism — year-round demand for hospitality professionals',
      sector: 'Hospitality',
    },
  ],
  CA: [
    {
      type: 'resource',
      name: 'Express Entry Immigration',
      description:
        "Points-based skilled worker immigration — one of the world's most accessible pathways",
      sector: 'Immigration',
    },
    {
      type: 'experience',
      name: 'Rocky Mountain Wilderness',
      description:
        'Banff, Jasper — world-class national parks with conservation and eco-tourism careers',
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Toronto Financial District',
      description: "Canada's financial capital — banking, insurance, and fintech innovation hub",
      sector: 'Finance & Banking',
    },
    {
      type: 'resource',
      name: 'Mining & Natural Resources',
      description:
        "World's third-largest mining sector — engineering and environmental science opportunities",
      sector: 'Mining',
    },
    {
      type: 'event',
      name: 'Calgary Stampede',
      description: 'The Greatest Outdoor Show on Earth — Western heritage and seasonal hospitality',
      season: 'Jul',
      sector: 'Hospitality',
    },
  ],
  GB: [
    {
      type: 'resource',
      name: 'London Financial Centre',
      description: "World's leading financial centre — banking, insurance, and fintech hub",
      sector: 'Finance & Banking',
    },
    {
      type: 'resource',
      name: 'NHS Healthcare System',
      description:
        'Active international recruitment for nurses, doctors, and allied health professionals',
      sector: 'Healthcare',
    },
    {
      type: 'certification',
      name: 'UK University System',
      description: 'Oxford, Cambridge, Imperial — world-renowned higher education and research',
      sector: 'Education',
    },
    {
      type: 'experience',
      name: 'Scottish Highlands',
      description:
        'Dramatic landscapes — eco-tourism, whisky distillery tours, and outdoor adventure',
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Creative Industries Hub',
      description: 'London — global capital for advertising, fashion, music, and digital media',
      sector: 'Creative Arts',
    },
  ],
  TH: [
    {
      type: 'experience',
      name: 'Diving Certification Hub',
      description: "Koh Tao — world's most popular location for PADI diving certification",
      sector: 'Tourism',
    },
    {
      type: 'resource',
      name: 'Digital Nomad Visa',
      description:
        "Thailand's Long-Term Resident Visa — designed for remote workers and digital nomads",
      sector: 'Technology',
    },
    {
      type: 'experience',
      name: 'Thai Massage & Wellness',
      description:
        'Wat Pho — birthplace of Thai massage with internationally recognized certification',
      sector: 'Healthcare',
    },
    {
      type: 'event',
      name: 'Full Moon Party',
      description: 'Koh Phangan — iconic monthly beach festival and hospitality sector hub',
      season: 'Monthly',
      sector: 'Hospitality',
    },
    {
      type: 'resource',
      name: 'Medical Tourism Leader',
      description:
        'Bangkok hospitals (Bumrungrad) — world-class healthcare at fraction of Western costs',
      sector: 'Healthcare',
    },
  ],
}

/**
 * Get highlights for a specific country
 */
export function getCountryHighlights(countryCode: string): CountryHighlight[] {
  return COUNTRY_HIGHLIGHTS[countryCode] ?? []
}

/**
 * Get highlights filtered by sector
 */
export function getHighlightsBySector(countryCode: string, sector: string): CountryHighlight[] {
  return getCountryHighlights(countryCode).filter((h) => h.sector === sector)
}

/**
 * Get seasonal highlights (events with a specific season)
 */
export function getSeasonalHighlights(countryCode: string): CountryHighlight[] {
  return getCountryHighlights(countryCode).filter((h) => h.season)
}

/**
 * Get all unique sectors covered by a country's highlights
 */
export function getHighlightSectors(countryCode: string): string[] {
  const sectors = getCountryHighlights(countryCode)
    .map((h) => h.sector)
    .filter(Boolean)
  return Array.from(new Set(sectors)) as string[]
}

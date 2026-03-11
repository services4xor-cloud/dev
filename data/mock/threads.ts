/**
 * Mock thread data — identity-based communities
 *
 * DESIGN PRINCIPLE: "We are one"
 * Every category has global representation. A German sees BeMaasai.
 * A Kenyan sees BeBavarian. The Nav shows ALL threads — no country filtering.
 *
 * Thread types:
 *   country   → BeKenya, BeGermany (geographic identity)
 *   tribe     → BeMaasai, BeBavarian (cultural/regional identity)
 *   language  → BeSwahili, BeDeutsch (linguistic identity)
 *   interest  → BeTech, BeSafari (professional/personal passion)
 *   religion  → BeChristian, BeMuslim (spiritual identity)
 *   science   → BeMedical, BeEngineering (knowledge domain)
 *   location  → BeNairobi, BeBerlin (city/region identity)
 */

import type { Thread } from '@/lib/threads'

export const MOCK_THREADS: Thread[] = [
  // ═══════════════════════════════════════════════════════════════════
  // COUNTRIES — Geographic identity
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'ke',
    name: 'Kenya',
    brandName: 'BeKenya',
    type: 'country',
    icon: '🇰🇪',
    tagline: 'The heart of East Africa. Safari, tech, and limitless potential.',
    description:
      'Kenya is the hub of East African innovation, home to the savannah, Silicon Savannah, and a vibrant creative economy.',
    relatedThreads: ['maasai', 'nairobi', 'swahili', 'safari'],
    countries: ['KE'],
    memberCount: 12450,
    active: true,
  },
  {
    slug: 'de',
    name: 'Germany',
    brandName: 'BeGermany',
    type: 'country',
    icon: '🇩🇪',
    tagline: 'Engineering excellence meets global talent.',
    description:
      'Germany has the strongest economy in Europe with high demand for healthcare, tech, and skilled workers worldwide.',
    relatedThreads: ['bavarian', 'berlin', 'deutsch', 'tech'],
    countries: ['DE'],
    memberCount: 8200,
    active: true,
  },
  {
    slug: 'ch',
    name: 'Switzerland',
    brandName: 'BeSwitzerland',
    type: 'country',
    icon: '🇨🇭',
    tagline: 'Precision, pharma, and Alpine opportunity.',
    description:
      'Switzerland offers world-class opportunities in finance, pharmaceuticals, hospitality, and precision engineering.',
    relatedThreads: ['zurich', 'deutsch', 'french', 'medical'],
    countries: ['CH'],
    memberCount: 3400,
    active: true,
  },
  {
    slug: 'ng',
    name: 'Nigeria',
    brandName: 'BeNigeria',
    type: 'country',
    icon: '🇳🇬',
    tagline: "Africa's largest economy. Fintech, media, and hustle.",
    description:
      'Nigeria leads Africa in fintech, entertainment, and entrepreneurship with a rapidly growing tech ecosystem.',
    relatedThreads: ['lagos', 'yoruba', 'tech', 'creative'],
    countries: ['NG'],
    memberCount: 5800,
    active: true,
  },
  {
    slug: 'gb',
    name: 'United Kingdom',
    brandName: 'BeBritain',
    type: 'country',
    icon: '🇬🇧',
    tagline: 'Gateway to Europe. Healthcare, education, and global opportunity.',
    description:
      'The UK has strong corridors for healthcare professionals, educators, and tech talent worldwide.',
    relatedThreads: ['london', 'english', 'medical'],
    countries: ['GB'],
    memberCount: 4100,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRIBES / CULTURES — Regional & cultural identity (global)
  // ═══════════════════════════════════════════════════════════════════

  // — Kenya cultures —
  {
    slug: 'maasai',
    name: 'Maasai',
    brandName: 'BeMaasai',
    type: 'tribe',
    icon: '🦁',
    tagline: 'Warriors of the savannah. Culture keepers. Global ambassadors.',
    description:
      'The Maasai people span Kenya and Tanzania, known worldwide for their rich cultural heritage, wildlife conservation, and eco-tourism leadership.',
    relatedThreads: ['ke', 'safari', 'eco-tourism'],
    parentThread: 'ke',
    countries: ['KE', 'TZ'],
    memberCount: 890,
    active: true,
  },
  {
    slug: 'kikuyu',
    name: 'Kikuyu',
    brandName: 'BeKikuyu',
    type: 'tribe',
    icon: '🌿',
    tagline: 'Entrepreneurial spirit. Innovation in the highlands.',
    description:
      "The Kikuyu are Kenya's largest ethnic group, known for entrepreneurship, agriculture, and business acumen.",
    relatedThreads: ['ke', 'nairobi'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 1540,
    active: true,
  },
  {
    slug: 'luo',
    name: 'Luo',
    brandName: 'BeLuo',
    type: 'tribe',
    icon: '🎵',
    tagline: 'Lakeside brilliance. Music, academia, and leadership.',
    description:
      'The Luo people of western Kenya are renowned for academic excellence, music, and political leadership.',
    relatedThreads: ['ke', 'creative'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 980,
    active: true,
  },

  // — German cultures —
  {
    slug: 'bavarian',
    name: 'Bavarian',
    brandName: 'BeBavarian',
    type: 'tribe',
    icon: '🏔️',
    tagline: 'Tradition meets innovation. From Alps to automotive.',
    description:
      'Bavaria is a cultural powerhouse — home to BMW, Siemens, beer gardens, Oktoberfest, and a fiercely proud regional identity.',
    relatedThreads: ['de', 'munich', 'engineering'],
    parentThread: 'de',
    countries: ['DE'],
    memberCount: 2200,
    active: true,
  },
  {
    slug: 'schwaben',
    name: 'Swabian',
    brandName: 'BeSchwaben',
    type: 'tribe',
    icon: '⚙️',
    tagline: 'Tüftler und Schaffer. Engineers and makers.',
    description:
      'The Swabians of Baden-Württemberg are known for engineering excellence, thrift, and companies like Mercedes-Benz, Bosch, and Porsche.',
    relatedThreads: ['de', 'stuttgart', 'engineering'],
    parentThread: 'de',
    countries: ['DE'],
    memberCount: 1600,
    active: true,
  },
  {
    slug: 'berliner',
    name: 'Berliner',
    brandName: 'BeBerliner',
    type: 'tribe',
    icon: '🐻',
    tagline: 'Kreativ, frei, weltoffen. Creative, free, cosmopolitan.',
    description:
      'Berlin culture is defined by creativity, startups, nightlife, and a uniquely open, multicultural spirit.',
    relatedThreads: ['de', 'berlin', 'tech', 'creative'],
    parentThread: 'de',
    countries: ['DE'],
    memberCount: 1800,
    active: true,
  },

  // — Swiss cultures —
  {
    slug: 'romand',
    name: 'Romand',
    brandName: 'BeRomand',
    type: 'tribe',
    icon: '🏔️',
    tagline: 'French-speaking Switzerland. Geneva, Lausanne, and lakeside elegance.',
    description:
      'The Romandy region bridges French and Swiss culture — home to international organizations, watchmaking, and Alpine hospitality.',
    relatedThreads: ['ch', 'french', 'geneva'],
    parentThread: 'ch',
    countries: ['CH'],
    memberCount: 1100,
    active: true,
  },
  {
    slug: 'alemannisch',
    name: 'Alemannic Swiss',
    brandName: 'BeAlemannisch',
    type: 'tribe',
    icon: '🇨🇭',
    tagline: 'Swiss-German heartland. Finance, pharma, and precision.',
    description:
      'German-speaking Switzerland — Zurich, Basel, Bern — the economic engine of Swiss banking, pharma, and engineering.',
    relatedThreads: ['ch', 'deutsch', 'zurich'],
    parentThread: 'ch',
    countries: ['CH'],
    memberCount: 1400,
    active: true,
  },

  // — Nigerian cultures —
  {
    slug: 'yoruba',
    name: 'Yoruba',
    brandName: 'BeYoruba',
    type: 'tribe',
    icon: '🎭',
    tagline: 'Art, commerce, and spiritual depth. The Yoruba world.',
    description:
      'The Yoruba people of southwestern Nigeria are known for their rich artistic traditions, Nollywood contributions, and vibrant diaspora.',
    relatedThreads: ['ng', 'lagos', 'creative'],
    parentThread: 'ng',
    countries: ['NG'],
    memberCount: 2400,
    active: true,
  },
  {
    slug: 'igbo',
    name: 'Igbo',
    brandName: 'BeIgbo',
    type: 'tribe',
    icon: '💼',
    tagline: 'Trade, tech, and entrepreneurial fire.',
    description:
      'The Igbo people of southeastern Nigeria are renowned for entrepreneurship, trading networks, and tech innovation.',
    relatedThreads: ['ng', 'tech'],
    parentThread: 'ng',
    countries: ['NG'],
    memberCount: 2100,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LANGUAGES — Linguistic identity (global)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'swahili',
    name: 'Swahili',
    brandName: 'BeSwahili',
    type: 'language',
    icon: '🗣️',
    tagline: 'The language of 200M+ people. Connecting East Africa and beyond.',
    description:
      'Swahili is the lingua franca of East Africa, spoken across Kenya, Tanzania, Uganda, DRC, and diaspora communities worldwide.',
    relatedThreads: ['ke', 'maasai', 'nairobi'],
    countries: ['KE', 'TZ', 'UG'],
    memberCount: 4200,
    active: true,
  },
  {
    slug: 'deutsch',
    name: 'Deutsch',
    brandName: 'BeDeutsch',
    type: 'language',
    icon: '🗣️',
    tagline: 'Sprechen Sie Deutsch? Connect with German-speaking opportunities.',
    description:
      'The German-speaking community thread connects Pioneers with opportunities in Germany, Austria, and Switzerland.',
    relatedThreads: ['de', 'ch', 'tech', 'medical'],
    countries: ['DE', 'CH'],
    memberCount: 3800,
    active: true,
  },
  {
    slug: 'english',
    name: 'English',
    brandName: 'BeEnglish',
    type: 'language',
    icon: '🗣️',
    tagline: 'The global bridge language. Connect anywhere.',
    description:
      'English connects Pioneers across all countries — the working language of international business, tech, and diplomacy.',
    relatedThreads: ['gb', 'ke', 'ng'],
    countries: [],
    memberCount: 9500,
    active: true,
  },
  {
    slug: 'french',
    name: 'Français',
    brandName: 'BeFrançais',
    type: 'language',
    icon: '🗣️',
    tagline: 'La langue de la diplomatie. From Geneva to Dakar.',
    description:
      'French connects West Africa, Switzerland, Belgium, Canada, and international organizations worldwide.',
    relatedThreads: ['ch', 'ng', 'romand'],
    countries: ['CH'],
    memberCount: 2800,
    active: true,
  },
  {
    slug: 'arabic',
    name: 'العربية',
    brandName: 'BeArabic',
    type: 'language',
    icon: '🗣️',
    tagline: 'From the Gulf to the coast. Arabic connects worlds.',
    description:
      'Arabic-speaking communities across the Gulf states, North Africa, and the Swahili coast.',
    relatedThreads: ['ae', 'ke', 'muslim'],
    countries: ['AE'],
    memberCount: 2200,
    active: true,
  },
  {
    slug: 'hindi',
    name: 'हिन्दी',
    brandName: 'BeHindi',
    type: 'language',
    icon: '🗣️',
    tagline: 'Connecting South Asia to the world.',
    description:
      'Hindi connects the Indian subcontinent diaspora — from Mumbai to Nairobi to Berlin.',
    relatedThreads: ['in', 'ke', 'ae'],
    countries: ['IN'],
    memberCount: 1800,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // INTERESTS — Professional & personal passions (global)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'tech',
    name: 'Technology',
    brandName: 'BeTech',
    type: 'interest',
    icon: '💻',
    tagline: 'Code the future. From Silicon Savannah to Silicon Valley.',
    description:
      'Connects software engineers, data scientists, and digital innovators across all borders.',
    relatedThreads: ['ke', 'de', 'ng', 'engineering'],
    countries: [],
    memberCount: 7800,
    active: true,
  },
  {
    slug: 'safari',
    name: 'Safari & Wildlife',
    brandName: 'BeSafari',
    type: 'interest',
    icon: '🦁',
    tagline: 'Where wild meets wonderful. Conservation through connection.',
    description:
      'Eco-tourism professionals, wildlife conservationists, and adventure seekers worldwide.',
    relatedThreads: ['ke', 'maasai', 'eco-tourism'],
    countries: ['KE', 'TZ', 'ZA'],
    memberCount: 3400,
    active: true,
  },
  {
    slug: 'eco-tourism',
    name: 'Eco-Tourism',
    brandName: 'BeEcoTourism',
    type: 'interest',
    icon: '🌍',
    tagline: 'Travel that gives back. Sustainable adventures.',
    description:
      'Sustainable, community-benefiting travel — from Kenyan safari lodges to Swiss Alpine retreats.',
    relatedThreads: ['safari', 'ke', 'ch'],
    countries: [],
    memberCount: 2100,
    active: true,
  },
  {
    slug: 'creative',
    name: 'Creative Arts',
    brandName: 'BeCreative',
    type: 'interest',
    icon: '🎨',
    tagline: 'Fashion, music, film, and art. Creativity without borders.',
    description:
      'Connects artists, designers, musicians, filmmakers, and digital creators globally.',
    relatedThreads: ['ng', 'ke', 'berliner'],
    countries: [],
    memberCount: 2900,
    active: true,
  },
  {
    slug: 'agriculture',
    name: 'Agriculture & Farming',
    brandName: 'BeFarmer',
    type: 'interest',
    icon: '🌾',
    tagline: 'From tea highlands to Alpine dairy. Feeding the world together.',
    description:
      'Connects agricultural innovators — Kenyan tea and coffee, Swiss dairy, Nigerian cocoa, and precision farming.',
    relatedThreads: ['ke', 'ch', 'eco-tourism'],
    countries: [],
    memberCount: 3100,
    active: true,
  },
  {
    slug: 'marine',
    name: 'Marine & Water',
    brandName: 'BeWater',
    type: 'interest',
    icon: '🌊',
    tagline: 'From deep-sea fishing to marine conservation. The ocean calls.',
    description:
      'Diving instructors, fishing guides, marine biologists, and water-sports professionals.',
    relatedThreads: ['ke', 'mombasa', 'eco-tourism'],
    countries: ['KE', 'TZ'],
    memberCount: 1400,
    active: true,
  },
  {
    slug: 'finance',
    name: 'Finance & Banking',
    brandName: 'BeFinance',
    type: 'interest',
    icon: '🏦',
    tagline: 'M-Pesa to Swiss banking. Financial systems that connect.',
    description: 'Fintech innovators, bankers, insurance professionals, and mobile money pioneers.',
    relatedThreads: ['ke', 'ch', 'ng', 'de'],
    countries: [],
    memberCount: 4500,
    active: true,
  },
  {
    slug: 'hospitality',
    name: 'Hospitality & Tourism',
    brandName: 'BeHospitality',
    type: 'interest',
    icon: '🏨',
    tagline: 'World-class service. From safari lodges to Swiss chalets.',
    description:
      'Hotel managers, chefs, tour operators, and service professionals across the global hospitality industry.',
    relatedThreads: ['ke', 'ch', 'de', 'eco-tourism'],
    countries: [],
    memberCount: 3200,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SCIENCE / KNOWLEDGE — Domain expertise (global)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'medical',
    name: 'Medical & Healthcare',
    brandName: 'BeMedical',
    type: 'science',
    icon: '🏥',
    tagline: 'Healing across borders. Healthcare without frontiers.',
    description:
      'Nurses, doctors, pharmacists connecting with international opportunities — especially UK and Germany.',
    relatedThreads: ['de', 'gb', 'ke'],
    countries: [],
    memberCount: 4100,
    active: true,
  },
  {
    slug: 'engineering',
    name: 'Engineering',
    brandName: 'BeEngineering',
    type: 'science',
    icon: '⚙️',
    tagline: 'Build the infrastructure of tomorrow.',
    description:
      'Civil, mechanical, electrical, and software engineers connecting across Africa and Europe.',
    relatedThreads: ['tech', 'de', 'schwaben'],
    countries: [],
    memberCount: 2600,
    active: true,
  },
  {
    slug: 'renewable',
    name: 'Renewable Energy',
    brandName: 'BeRenewable',
    type: 'science',
    icon: '⚡',
    tagline: 'Solar, wind, and green hydrogen. Powering the future.',
    description:
      'Renewable energy engineers, researchers, and entrepreneurs — from Kenyan geothermal to German wind farms.',
    relatedThreads: ['de', 'ke', 'engineering'],
    countries: [],
    memberCount: 1900,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LOCATIONS — City & region identity (balanced across countries)
  // ═══════════════════════════════════════════════════════════════════

  // — Kenya locations —
  {
    slug: 'nairobi',
    name: 'Nairobi',
    brandName: 'BeNairobi',
    type: 'location',
    icon: '🏙️',
    tagline: 'Silicon Savannah. The startup capital of Africa.',
    description:
      "East Africa's tech and business hub — M-Pesa, iHub, and a thriving startup ecosystem.",
    relatedThreads: ['ke', 'tech', 'kikuyu'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 6200,
    active: true,
  },
  {
    slug: 'mombasa',
    name: 'Mombasa',
    brandName: 'BeMombasa',
    type: 'location',
    icon: '⛵',
    tagline: 'Where the ocean meets opportunity. Trade, tourism, and culture.',
    description:
      "Kenya's coastal gem — a port city rich in Swahili culture, trade, and marine tourism.",
    relatedThreads: ['ke', 'swahili', 'marine'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 1800,
    active: true,
  },
  {
    slug: 'kericho',
    name: 'Kericho',
    brandName: 'BeKericho',
    type: 'location',
    icon: '🍵',
    tagline: 'The tea heartland of Kenya. Green hills, golden opportunity.',
    description:
      'Capital of Kenyan tea production — vast estates and a growing agricultural tech sector.',
    relatedThreads: ['ke', 'agriculture'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 820,
    active: true,
  },
  {
    slug: 'diani',
    name: 'Diani Beach',
    brandName: 'BeDiani',
    type: 'location',
    icon: '🏖️',
    tagline: 'Where the Indian Ocean meets world-class hospitality.',
    description: 'South coast paradise — water sports, diving, and eco-resorts.',
    relatedThreads: ['ke', 'marine', 'eco-tourism'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 650,
    active: true,
  },

  // — Germany locations —
  {
    slug: 'berlin',
    name: 'Berlin',
    brandName: 'BeBerlin',
    type: 'location',
    icon: '🐻',
    tagline: "Startups, culture, and freedom. Europe's creative capital.",
    description:
      "Berlin is Germany's startup hub and cultural melting pot — affordable, creative, and fiercely international.",
    relatedThreads: ['de', 'berliner', 'tech', 'creative'],
    parentThread: 'de',
    countries: ['DE'],
    memberCount: 4800,
    active: true,
  },
  {
    slug: 'munich',
    name: 'Munich',
    brandName: 'BeMunich',
    type: 'location',
    icon: '🏔️',
    tagline: 'BMW, beer, and Bavaria. Engineering meets lifestyle.',
    description:
      "Munich combines world-class engineering (BMW, Siemens) with Alpine lifestyle and one of Germany's strongest economies.",
    relatedThreads: ['de', 'bavarian', 'engineering'],
    parentThread: 'de',
    countries: ['DE'],
    memberCount: 3200,
    active: true,
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    brandName: 'BeHamburg',
    type: 'location',
    icon: '⚓',
    tagline: "Europe's gateway port. Trade, media, and maritime.",
    description:
      "Germany's second city — a major port, media hub, and logistics center with a cosmopolitan harbor culture.",
    relatedThreads: ['de', 'marine', 'finance'],
    parentThread: 'de',
    countries: ['DE'],
    memberCount: 2100,
    active: true,
  },
  {
    slug: 'stuttgart',
    name: 'Stuttgart',
    brandName: 'BeStuttgart',
    type: 'location',
    icon: '🚗',
    tagline: 'Mercedes, Porsche, Bosch. The engine of German industry.',
    description:
      'Stuttgart and Baden-Württemberg are the heart of German automotive and precision engineering.',
    relatedThreads: ['de', 'schwaben', 'engineering'],
    parentThread: 'de',
    countries: ['DE'],
    memberCount: 1800,
    active: true,
  },

  // — Switzerland locations —
  {
    slug: 'zurich',
    name: 'Zürich',
    brandName: 'BeZürich',
    type: 'location',
    icon: '🏦',
    tagline: "Finance, ETH, and lakeside living. Switzerland's powerhouse.",
    description:
      "Zurich is Switzerland's financial center and home to ETH — one of the world's top technical universities.",
    relatedThreads: ['ch', 'alemannisch', 'finance', 'tech'],
    parentThread: 'ch',
    countries: ['CH'],
    memberCount: 2400,
    active: true,
  },
  {
    slug: 'geneva',
    name: 'Geneva',
    brandName: 'BeGeneva',
    type: 'location',
    icon: '🌐',
    tagline: 'UN, WHO, CERN. Where the world comes together.',
    description:
      'Geneva is the global capital of diplomacy, international organizations, and watchmaking.',
    relatedThreads: ['ch', 'romand', 'french'],
    parentThread: 'ch',
    countries: ['CH'],
    memberCount: 1900,
    active: true,
  },
  {
    slug: 'basel',
    name: 'Basel',
    brandName: 'BeBasel',
    type: 'location',
    icon: '💊',
    tagline: 'Pharma capital. Novartis, Roche, and life sciences.',
    description:
      'Basel sits at the tri-border (CH/DE/FR) and is the global headquarters of Novartis and Roche.',
    relatedThreads: ['ch', 'medical', 'alemannisch'],
    parentThread: 'ch',
    countries: ['CH'],
    memberCount: 1200,
    active: true,
  },

  // — Nigeria locations —
  {
    slug: 'lagos',
    name: 'Lagos',
    brandName: 'BeLagos',
    type: 'location',
    icon: '🌆',
    tagline: "Africa's megacity. Hustle, Nollywood, and fintech.",
    description:
      "Lagos is Africa's largest city and economic powerhouse — home to Flutterwave, Nollywood, and boundless entrepreneurial energy.",
    relatedThreads: ['ng', 'yoruba', 'tech', 'finance'],
    parentThread: 'ng',
    countries: ['NG'],
    memberCount: 4200,
    active: true,
  },

  // — UK locations —
  {
    slug: 'london',
    name: 'London',
    brandName: 'BeLondon',
    type: 'location',
    icon: '🏰',
    tagline: 'The world in one city. Finance, NHS, and opportunity.',
    description:
      "London is the world's most international city — financial capital, NHS employer, and cultural crossroads.",
    relatedThreads: ['gb', 'english', 'finance', 'medical'],
    parentThread: 'gb',
    countries: ['GB'],
    memberCount: 3800,
    active: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // RELIGION / FAITH — Spiritual identity (global, no country filter)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'christian',
    name: 'Christianity',
    brandName: 'BeChristian',
    type: 'religion',
    icon: '✝️',
    tagline: 'Faith communities, churches, and mission networks worldwide.',
    description:
      'Connect with Christian communities across countries — from Nairobi chapels to German parishes.',
    relatedThreads: ['ke', 'de', 'ng'],
    countries: [],
    memberCount: 8500,
    active: true,
  },
  {
    slug: 'muslim',
    name: 'Islam',
    brandName: 'BeMuslim',
    type: 'religion',
    icon: '☪️',
    tagline: 'Ummah without borders — mosques, halal paths, and community.',
    description:
      'Muslim communities, mosques, halal-friendly workplaces, and Islamic finance paths.',
    relatedThreads: ['ke', 'ae', 'ng'],
    countries: [],
    memberCount: 6200,
    active: true,
  },
  {
    slug: 'hindu',
    name: 'Hinduism',
    brandName: 'BeHindu',
    type: 'religion',
    icon: '🕉️',
    tagline: 'Temples, dharma, and cultural bridges across continents.',
    description:
      'Hindu communities, temple networks, and dharma-aligned paths from India to East Africa and beyond.',
    relatedThreads: ['in', 'ke'],
    countries: [],
    memberCount: 3800,
    active: true,
  },
  {
    slug: 'buddhist',
    name: 'Buddhism',
    brandName: 'BeBuddhist',
    type: 'religion',
    icon: '☸️',
    tagline: 'Mindful paths — meditation, wellness, and peaceful community.',
    description:
      'Meditation centers, mindfulness retreats, and contemplative communities worldwide.',
    relatedThreads: ['de', 'ch'],
    countries: [],
    memberCount: 1400,
    active: true,
  },
  {
    slug: 'traditional',
    name: 'Traditional & Indigenous',
    brandName: 'BeTraditional',
    type: 'religion',
    icon: '🌿',
    tagline: 'Ancestral wisdom, sacred lands, and indigenous spirituality.',
    description:
      'Traditional African religions, indigenous spiritual practices, and ancestral cultural preservation.',
    relatedThreads: ['ke', 'ng', 'maasai'],
    countries: [],
    memberCount: 2100,
    active: true,
  },
]

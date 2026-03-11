/**
 * Mock thread data — identity-based communities
 *
 * Each thread represents an identity group that gets its own Gate page,
 * curated Ventures feed, and community space. Like Reddit threads but
 * for life-routing.
 *
 * Adding a new identity thread = adding an entry here. Zero code changes.
 */

import type { Thread } from '@/lib/threads'

export const MOCK_THREADS: Thread[] = [
  // ── Country threads ─────────────────────────────────────────────
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
    tagline: 'Engineering excellence meets African talent.',
    description:
      'Germany has the strongest economy in Europe with high demand for healthcare, tech, and skilled workers from the Global South.',
    relatedThreads: ['ke', 'deutsch', 'tech', 'medical'],
    countries: ['DE'],
    memberCount: 3200,
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
    relatedThreads: ['ke', 'tech', 'creative'],
    countries: ['NG'],
    memberCount: 5800,
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
      'Switzerland offers world-class opportunities in finance, pharmaceuticals, hospitality, and precision engineering with some of the highest salaries globally.',
    relatedThreads: ['de', 'deutsch', 'tech', 'medical'],
    countries: ['CH'],
    memberCount: 1800,
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
      'The UK has strong corridors for Kenyan healthcare professionals, educators, and tech talent.',
    relatedThreads: ['ke', 'medical', 'education'],
    countries: ['GB'],
    memberCount: 2100,
    active: true,
  },

  // ── Tribe threads ───────────────────────────────────────────────
  {
    slug: 'maasai',
    name: 'Maasai',
    brandName: 'BeMaasai',
    type: 'tribe',
    icon: '🦁',
    tagline: 'Warriors of the savannah. Culture keepers. Global ambassadors.',
    description:
      'The Maasai people span Kenya and Tanzania, known worldwide for their rich cultural heritage, wildlife conservation, and eco-tourism leadership.',
    relatedThreads: ['ke', 'safari', 'eco-tourism', 'conservation'],
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
    relatedThreads: ['ke', 'nairobi', 'business'],
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
    relatedThreads: ['ke', 'education', 'creative'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 980,
    active: true,
  },

  // ── Language threads ────────────────────────────────────────────
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
    countries: ['DE', 'CH', 'AT'],
    memberCount: 1800,
    active: true,
  },

  // ── Interest threads ────────────────────────────────────────────
  {
    slug: 'tech',
    name: 'Technology',
    brandName: 'BeTech',
    type: 'interest',
    icon: '💻',
    tagline: 'Code the future. From Silicon Savannah to Silicon Valley.',
    description:
      'The tech thread connects software engineers, data scientists, and digital innovators across borders.',
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
      'The safari thread connects eco-tourism professionals, wildlife conservationists, and adventure seekers.',
    relatedThreads: ['ke', 'maasai', 'eco-tourism', 'conservation'],
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
      'Eco-tourism professionals and travelers committed to sustainable, community-benefiting travel.',
    relatedThreads: ['safari', 'conservation', 'ke'],
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
    tagline: 'Fashion, music, film, and art. African creativity goes global.',
    description:
      'The creative thread connects artists, designers, musicians, filmmakers, and digital creators.',
    relatedThreads: ['fashion', 'ng', 'ke'],
    countries: [],
    memberCount: 2900,
    active: true,
  },

  // ── Science/Knowledge threads ───────────────────────────────────
  {
    slug: 'medical',
    name: 'Medical & Healthcare',
    brandName: 'BeMedical',
    type: 'science',
    icon: '🏥',
    tagline: 'Healing across borders. Healthcare professionals without frontiers.',
    description:
      'Connects healthcare workers — nurses, doctors, pharmacists — with international opportunities, especially in the UK and Germany.',
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
    relatedThreads: ['tech', 'de', 'construction'],
    countries: [],
    memberCount: 2600,
    active: true,
  },

  // ── Additional interest threads ─────────────────────────────────
  {
    slug: 'agriculture',
    name: 'Agriculture & Farming',
    brandName: 'BeFarmer',
    type: 'interest',
    icon: '🌾',
    tagline: 'Tea, coffee, flowers, and the future of African agriculture.',
    description:
      'The agriculture thread connects tea estate workers, coffee farmers, horticulture exporters, and agricultural innovators across Kenya and East Africa.',
    relatedThreads: ['ke', 'eco-tourism'],
    countries: ['KE', 'TZ', 'UG'],
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
      'Connects diving instructors, fishing guides, marine biologists, and water-sports professionals along the East African coast.',
    relatedThreads: ['ke', 'mombasa', 'eco-tourism'],
    countries: ['KE', 'TZ'],
    memberCount: 1400,
    active: true,
  },

  // ── Location threads ────────────────────────────────────────────
  {
    slug: 'kericho',
    name: 'Kericho',
    brandName: 'BeKericho',
    type: 'location',
    icon: '🍵',
    tagline: 'The tea heartland of Kenya. Green hills, golden opportunity.',
    description:
      'Kericho is the capital of Kenyan tea production, home to vast estates and a growing agricultural tech sector.',
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
    description:
      'Diani Beach on the south coast is a top destination for water sports, diving, and eco-resorts.',
    relatedThreads: ['ke', 'marine', 'eco-tourism', 'mombasa'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 650,
    active: true,
  },
  {
    slug: 'nairobi',
    name: 'Nairobi',
    brandName: 'BeNairobi',
    type: 'location',
    icon: '🏙️',
    tagline: 'Silicon Savannah. The startup capital of Africa.',
    description:
      "Nairobi is East Africa's tech and business hub, home to M-Pesa, iHub, and a thriving startup ecosystem.",
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
      "Mombasa is Kenya's coastal gem — a port city rich in Swahili culture, trade, and marine tourism.",
    relatedThreads: ['ke', 'swahili', 'eco-tourism'],
    parentThread: 'ke',
    countries: ['KE'],
    memberCount: 1800,
    active: true,
  },
]

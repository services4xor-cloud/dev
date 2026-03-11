/* eslint-disable no-console */
/**
 * Be[Country] — Database Seed
 * Run: npx prisma db seed
 *
 * Seeds 3 countries (KE, DE, CH) with:
 * - 9 Anchors (3 per country)
 * - 18 Paths (6 per country)
 * - 6 Pioneers (2 per country)
 * - 21+ Threads (identity communities)
 * - 6 Experiences (eco-tourism, Kenya)
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Be[Country] data for KE, DE, CH...\n')

  // ── Anchors ─────────────────────────────────────────────────────────────────
  const anchors = await Promise.all([
    // Kenya
    upsertAnchor('hr@safaricom.test', 'Safaricom HR', 'KE', 'Leading telecom, powering M-Pesa.'),
    upsertAnchor('careers@kcb.test', 'KCB Bank Kenya', 'KE', 'Largest bank in East Africa.'),
    upsertAnchor('team@basecamp.test', 'Basecamp Explorer', 'KE', 'Award-winning eco-tourism.'),
    // Germany
    upsertAnchor('hr@sap.test', 'SAP SE', 'DE', "Europe's largest software company."),
    upsertAnchor(
      'careers@siemens-health.test',
      'Siemens Healthineers',
      'DE',
      'Global leader in medical technology.'
    ),
    upsertAnchor('jobs@deutschebahn.test', 'Deutsche Bahn', 'DE', "Germany's national railway."),
    // Switzerland
    upsertAnchor(
      'careers@novartis.test',
      'Novartis AG',
      'CH',
      'Global pharmaceutical leader based in Basel.'
    ),
    upsertAnchor(
      'hr@ubs.test',
      'UBS Group',
      'CH',
      "Switzerland's largest bank, global wealth management."
    ),
    upsertAnchor(
      'jobs@swisscom.test',
      'Swisscom AG',
      'CH',
      'Leading Swiss telecom and IT provider.'
    ),
  ])

  console.log(`✅ ${anchors.length} Anchors seeded`)

  // ── Paths (6 per country) ───────────────────────────────────────────────────
  const pathData = [
    // Kenya
    path(
      'Senior Software Engineer',
      'Safaricom',
      anchors[0].id,
      'KE',
      'Nairobi, Kenya',
      'tech',
      'Join the M-Pesa team and build financial infrastructure for 30M+ users.',
      180000,
      280000,
      'KES',
      ['TypeScript', 'Node.js', 'React', 'AWS', 'PostgreSQL'],
      'FEATURED'
    ),
    path(
      'Safari Guide & Wildlife Educator',
      'Basecamp Masai Mara',
      anchors[2].id,
      'KE',
      'Masai Mara, Kenya',
      'safari',
      'Lead international tourists on safari experiences in the Masai Mara.',
      80000,
      120000,
      'KES',
      ['Wildlife Knowledge', 'English', 'Swahili', 'First Aid'],
      'PREMIUM'
    ),
    path(
      'Branch Manager — Westlands',
      'KCB Bank Kenya',
      anchors[1].id,
      'KE',
      'Westlands, Nairobi',
      'finance',
      'Lead Westlands branch operations, managing a team of 15 staff.',
      200000,
      300000,
      'KES',
      ['Banking', 'Leadership', 'Sales', 'Credit Analysis'],
      'FEATURED'
    ),
    path(
      'Social Media Manager',
      'Twiga Foods',
      anchors[0].id,
      'KE',
      'Nairobi, Kenya',
      'creative',
      'Manage social media across Twitter, Instagram, TikTok and LinkedIn.',
      60000,
      100000,
      'KES',
      ['Social Media', 'Content Creation', 'Photography', 'Analytics'],
      'BASIC'
    ),
    path(
      'Eco-Lodge Manager — Amboseli',
      'Ol Tukai Lodge',
      anchors[2].id,
      'KE',
      'Amboseli, Kenya',
      'hospitality',
      'Manage daily operations of our luxury eco-lodge with 80 rooms.',
      150000,
      220000,
      'KES',
      ['Hospitality Management', 'Sustainability', 'Team Leadership'],
      'FEATURED'
    ),
    path(
      'Community Health Worker — Kibera',
      'Amref Health Africa',
      anchors[0].id,
      'KE',
      'Kibera, Nairobi',
      'healthcare',
      'Provide primary healthcare services and health education to families.',
      45000,
      65000,
      'KES',
      ['Nursing', 'Community Health', 'Swahili', 'First Aid'],
      'BASIC'
    ),

    // Germany
    path(
      'Cloud Solutions Architect',
      'SAP SE',
      anchors[3].id,
      'DE',
      'Walldorf, Germany',
      'tech',
      'Design and implement enterprise cloud architectures for SAP S/4HANA customers across Europe.',
      75000,
      95000,
      'EUR',
      ['SAP', 'Cloud Architecture', 'TypeScript', 'Kubernetes', 'German B2'],
      'PREMIUM'
    ),
    path(
      'Pflegefachkraft (Nurse)',
      'Siemens Healthineers',
      anchors[4].id,
      'DE',
      'Erlangen, Germany',
      'healthcare',
      'Join our clinical team operating cutting-edge MRI and CT diagnostic equipment.',
      42000,
      55000,
      'EUR',
      ['Nursing Degree', 'German B2', 'Radiology', 'Patient Care'],
      'FEATURED'
    ),
    path(
      'Lokführer (Train Operator)',
      'Deutsche Bahn',
      anchors[5].id,
      'DE',
      'Munich, Germany',
      'logistics',
      'Operate regional and long-distance trains across Bavaria and beyond.',
      38000,
      48000,
      'EUR',
      ['Train Operation License', 'German B2', 'Technical Skills'],
      'BASIC'
    ),
    path(
      'Data Analyst — Automotive',
      'BMW Group',
      anchors[3].id,
      'DE',
      'Munich, Germany',
      'tech',
      "Analyze production and supply chain data for BMW's electric vehicle division.",
      55000,
      72000,
      'EUR',
      ['Python', 'SQL', 'Power BI', 'Statistics', 'German B1'],
      'FEATURED'
    ),
    path(
      'Mechanical Engineer',
      'Siemens Energy',
      anchors[4].id,
      'DE',
      'Berlin, Germany',
      'engineering',
      'Design renewable energy turbine components for wind and hydrogen power.',
      60000,
      80000,
      'EUR',
      ['CAD', 'FEA', 'Materials Science', 'German B1', 'English'],
      'FEATURED'
    ),
    path(
      'Hotel Manager — Hamburg',
      'Maritim Hotels',
      anchors[5].id,
      'DE',
      'Hamburg, Germany',
      'hospitality',
      'Lead operations at a 280-room waterfront hotel. International clientele.',
      50000,
      65000,
      'EUR',
      ['Hospitality Management', 'German C1', 'English', 'Leadership'],
      'BASIC'
    ),

    // Switzerland
    path(
      'Pharma Research Associate',
      'Novartis AG',
      anchors[6].id,
      'CH',
      'Basel, Switzerland',
      'pharma',
      'Conduct drug discovery research in oncology at Novartis Institutes for BioMedical Research.',
      90000,
      120000,
      'CHF',
      ['Molecular Biology', 'Drug Discovery', 'Lab Techniques', 'English'],
      'PREMIUM'
    ),
    path(
      'Wealth Manager — Private Banking',
      'UBS Group',
      anchors[7].id,
      'CH',
      'Zürich, Switzerland',
      'finance',
      'Manage portfolios for ultra-high-net-worth clients across Europe and Africa.',
      110000,
      160000,
      'CHF',
      ['CFA', 'Portfolio Management', 'German', 'English', 'French'],
      'PREMIUM'
    ),
    path(
      'Cloud Engineer',
      'Swisscom AG',
      anchors[8].id,
      'CH',
      'Bern, Switzerland',
      'tech',
      "Build and maintain cloud infrastructure for Switzerland's largest telecom.",
      95000,
      125000,
      'CHF',
      ['AWS', 'Kubernetes', 'Terraform', 'Python', 'German B1'],
      'FEATURED'
    ),
    path(
      'Hotel Director — Interlaken',
      'Victoria Jungfrau',
      anchors[8].id,
      'CH',
      'Interlaken, Switzerland',
      'hospitality',
      "Lead one of Switzerland's most iconic luxury resort hotels.",
      100000,
      140000,
      'CHF',
      ['Hospitality Management', 'German', 'French', 'English', 'Leadership'],
      'FEATURED'
    ),
    path(
      'Precision CNC Machinist',
      'Swatch Group',
      anchors[6].id,
      'CH',
      'Biel/Bienne, Switzerland',
      'precision',
      'Manufacture precision watch components with tolerances under 0.01mm.',
      70000,
      90000,
      'CHF',
      ['CNC Programming', 'Metrology', 'German B2', 'Precision Engineering'],
      'BASIC'
    ),
    path(
      'Renewable Energy Engineer',
      'ABB Switzerland',
      anchors[7].id,
      'CH',
      'Baden, Switzerland',
      'renewable',
      'Design power conversion systems for solar and wind energy installations.',
      85000,
      115000,
      'CHF',
      ['Power Electronics', 'MATLAB', 'Renewable Energy', 'English'],
      'FEATURED'
    ),
  ]

  for (const p of pathData) {
    await prisma.path.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    })
  }
  console.log(`✅ ${pathData.length} Paths seeded`)

  // ── Pioneers (2 per country) ────────────────────────────────────────────────
  const passwordHash = await hash('pioneer123', 12)

  const pioneers = await Promise.all([
    // Kenya
    upsertPioneer(
      'wanjiku@test.com',
      'Wanjiku Maina',
      'KE',
      '+254712345678',
      passwordHash,
      'Software Engineer',
      'Experienced fintech engineer with 5 years in Nairobi.',
      'professional',
      ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS']
    ),
    upsertPioneer(
      'kamau@test.com',
      'Kamau Njoroge',
      'KE',
      '+254722345678',
      passwordHash,
      'Senior Safari Guide',
      'Passionate guide with 8 years in Masai Mara and Amboseli.',
      'explorer',
      ['Wildlife Knowledge', 'English', 'Swahili', 'French', 'First Aid']
    ),
    // Germany
    upsertPioneer(
      'lena@test.com',
      'Lena Schmidt',
      'DE',
      '+491711234567',
      passwordHash,
      'Data Scientist',
      'Machine learning engineer at a Berlin startup, exploring new paths.',
      'professional',
      ['Python', 'TensorFlow', 'SQL', 'German', 'English']
    ),
    upsertPioneer(
      'ahmed@test.com',
      'Ahmed Hassan',
      'DE',
      '+491721234567',
      passwordHash,
      'Healthcare Professional',
      'Kenyan-born nurse working in Frankfurt, 3 years in Germany.',
      'healer',
      ['Nursing', 'German B2', 'English', 'Swahili', 'Patient Care']
    ),
    // Switzerland
    upsertPioneer(
      'sophie@test.com',
      'Sophie Müller',
      'CH',
      '+41791234567',
      passwordHash,
      'Pharma Researcher',
      'Biochemist exploring opportunities in Swiss pharma industry.',
      'professional',
      ['Molecular Biology', 'Lab Techniques', 'German', 'English', 'French']
    ),
    upsertPioneer(
      'james@test.com',
      'James Ochieng',
      'CH',
      '+41781234567',
      passwordHash,
      'IT Consultant',
      'Kenyan tech professional relocating to Zürich for fintech roles.',
      'professional',
      ['Java', 'Cloud Architecture', 'English', 'Swahili', 'German A2']
    ),
  ])

  console.log(`✅ ${pioneers.length} Pioneers seeded`)

  // ── Threads (identity communities — balanced across ALL countries) ───────────
  const threads = [
    // Countries
    thread(
      'ke',
      'Kenya',
      'BeKenya',
      'COUNTRY',
      '🇰🇪',
      'The heart of East Africa.',
      null,
      ['KE'],
      12450
    ),
    thread(
      'de',
      'Germany',
      'BeGermany',
      'COUNTRY',
      '🇩🇪',
      'Engineering excellence meets global talent.',
      null,
      ['DE'],
      8200
    ),
    thread(
      'ch',
      'Switzerland',
      'BeSwitzerland',
      'COUNTRY',
      '🇨🇭',
      'Precision, pharma, and Alpine opportunity.',
      null,
      ['CH'],
      3400
    ),
    thread(
      'ng',
      'Nigeria',
      'BeNigeria',
      'COUNTRY',
      '🇳🇬',
      "Africa's largest economy.",
      null,
      ['NG'],
      5800
    ),
    thread(
      'gb',
      'United Kingdom',
      'BeBritain',
      'COUNTRY',
      '🇬🇧',
      'Gateway to Europe.',
      null,
      ['GB'],
      4100
    ),

    // Tribes / Cultures — KE
    thread(
      'maasai',
      'Maasai',
      'BeMaasai',
      'TRIBE',
      '🦁',
      'Warriors of the savannah.',
      'ke',
      ['KE', 'TZ'],
      890
    ),
    thread(
      'kikuyu',
      'Kikuyu',
      'BeKikuyu',
      'TRIBE',
      '🌿',
      'Entrepreneurial spirit.',
      'ke',
      ['KE'],
      1540
    ),
    thread('luo', 'Luo', 'BeLuo', 'TRIBE', '🎵', 'Lakeside brilliance.', 'ke', ['KE'], 980),
    // Tribes / Cultures — DE
    thread(
      'bavarian',
      'Bavarian',
      'BeBavarian',
      'TRIBE',
      '🏔️',
      'Tradition meets innovation.',
      'de',
      ['DE'],
      2200
    ),
    thread(
      'schwaben',
      'Swabian',
      'BeSchwaben',
      'TRIBE',
      '⚙️',
      'Tüftler und Schaffer.',
      'de',
      ['DE'],
      1600
    ),
    thread(
      'berliner',
      'Berliner',
      'BeBerliner',
      'TRIBE',
      '🐻',
      'Kreativ, frei, weltoffen.',
      'de',
      ['DE'],
      1800
    ),
    // Tribes / Cultures — CH
    thread(
      'romand',
      'Romand',
      'BeRomand',
      'TRIBE',
      '🏔️',
      'French-speaking Switzerland.',
      'ch',
      ['CH'],
      1100
    ),
    thread(
      'alemannisch',
      'Alemannic Swiss',
      'BeAlemannisch',
      'TRIBE',
      '🇨🇭',
      'Swiss-German heartland.',
      'ch',
      ['CH'],
      1400
    ),
    // Tribes / Cultures — NG
    thread(
      'yoruba',
      'Yoruba',
      'BeYoruba',
      'TRIBE',
      '🎭',
      'Art, commerce, spiritual depth.',
      'ng',
      ['NG'],
      2400
    ),
    thread(
      'igbo',
      'Igbo',
      'BeIgbo',
      'TRIBE',
      '💼',
      'Trade, tech, entrepreneurial fire.',
      'ng',
      ['NG'],
      2100
    ),

    // Languages (global)
    thread(
      'swahili',
      'Swahili',
      'BeSwahili',
      'LANGUAGE',
      '🗣️',
      'The language of 200M+ people.',
      null,
      ['KE', 'TZ', 'UG'],
      4200
    ),
    thread(
      'deutsch',
      'Deutsch',
      'BeDeutsch',
      'LANGUAGE',
      '🗣️',
      'Sprechen Sie Deutsch?',
      null,
      ['DE', 'CH'],
      3800
    ),
    thread(
      'english',
      'English',
      'BeEnglish',
      'LANGUAGE',
      '🗣️',
      'The global bridge language.',
      null,
      [],
      9500
    ),
    thread(
      'french',
      'Français',
      'BeFrançais',
      'LANGUAGE',
      '🗣️',
      'From Geneva to Dakar.',
      null,
      ['CH'],
      2800
    ),
    thread(
      'arabic',
      'العربية',
      'BeArabic',
      'LANGUAGE',
      '🗣️',
      'From the Gulf to the coast.',
      null,
      ['AE'],
      2200
    ),
    thread(
      'hindi',
      'हिन्दी',
      'BeHindi',
      'LANGUAGE',
      '🗣️',
      'Connecting South Asia to the world.',
      null,
      ['IN'],
      1800
    ),

    // Interests (global)
    thread('tech', 'Technology', 'BeTech', 'INTEREST', '💻', 'Code the future.', null, [], 7800),
    thread(
      'safari',
      'Safari & Wildlife',
      'BeSafari',
      'INTEREST',
      '🦁',
      'Where wild meets wonderful.',
      null,
      ['KE', 'TZ', 'ZA'],
      3400
    ),
    thread(
      'eco-tourism',
      'Eco-Tourism',
      'BeEcoTourism',
      'INTEREST',
      '🌍',
      'Travel that gives back.',
      null,
      [],
      2100
    ),
    thread(
      'creative',
      'Creative Arts',
      'BeCreative',
      'INTEREST',
      '🎨',
      'Creativity without borders.',
      null,
      [],
      2900
    ),
    thread(
      'agriculture',
      'Agriculture',
      'BeFarmer',
      'INTEREST',
      '🌾',
      'Feeding the world together.',
      null,
      [],
      3100
    ),
    thread(
      'marine',
      'Marine & Water',
      'BeWater',
      'INTEREST',
      '🌊',
      'The ocean calls.',
      null,
      ['KE', 'TZ'],
      1400
    ),
    thread(
      'finance',
      'Finance & Banking',
      'BeFinance',
      'INTEREST',
      '🏦',
      'M-Pesa to Swiss banking.',
      null,
      [],
      4500
    ),
    thread(
      'hospitality',
      'Hospitality & Tourism',
      'BeHospitality',
      'INTEREST',
      '🏨',
      'World-class service.',
      null,
      [],
      3200
    ),

    // Sciences (global)
    thread(
      'medical',
      'Medical & Healthcare',
      'BeMedical',
      'SCIENCE',
      '🏥',
      'Healing across borders.',
      null,
      [],
      4100
    ),
    thread(
      'engineering',
      'Engineering',
      'BeEngineering',
      'SCIENCE',
      '⚙️',
      'Build tomorrow.',
      null,
      [],
      2600
    ),
    thread(
      'renewable',
      'Renewable Energy',
      'BeRenewable',
      'SCIENCE',
      '⚡',
      'Powering the future.',
      null,
      [],
      1900
    ),

    // Locations — KE
    thread(
      'nairobi',
      'Nairobi',
      'BeNairobi',
      'LOCATION',
      '🏙️',
      'Silicon Savannah.',
      'ke',
      ['KE'],
      6200
    ),
    thread(
      'mombasa',
      'Mombasa',
      'BeMombasa',
      'LOCATION',
      '⛵',
      'Where ocean meets opportunity.',
      'ke',
      ['KE'],
      1800
    ),
    thread(
      'kericho',
      'Kericho',
      'BeKericho',
      'LOCATION',
      '🍵',
      'Tea heartland of Kenya.',
      'ke',
      ['KE'],
      820
    ),
    thread(
      'diani',
      'Diani Beach',
      'BeDiani',
      'LOCATION',
      '🏖️',
      'Indian Ocean paradise.',
      'ke',
      ['KE'],
      650
    ),
    // Locations — DE
    thread(
      'berlin',
      'Berlin',
      'BeBerlin',
      'LOCATION',
      '🐻',
      "Europe's creative capital.",
      'de',
      ['DE'],
      4800
    ),
    thread(
      'munich',
      'Munich',
      'BeMunich',
      'LOCATION',
      '🏔️',
      'BMW, beer, and Bavaria.',
      'de',
      ['DE'],
      3200
    ),
    thread(
      'hamburg',
      'Hamburg',
      'BeHamburg',
      'LOCATION',
      '⚓',
      "Europe's gateway port.",
      'de',
      ['DE'],
      2100
    ),
    thread(
      'stuttgart',
      'Stuttgart',
      'BeStuttgart',
      'LOCATION',
      '🚗',
      'Engine of German industry.',
      'de',
      ['DE'],
      1800
    ),
    // Locations — CH
    thread(
      'zurich',
      'Zürich',
      'BeZürich',
      'LOCATION',
      '🏦',
      "Switzerland's powerhouse.",
      'ch',
      ['CH'],
      2400
    ),
    thread(
      'geneva',
      'Geneva',
      'BeGeneva',
      'LOCATION',
      '🌐',
      'Where the world comes together.',
      'ch',
      ['CH'],
      1900
    ),
    thread('basel', 'Basel', 'BeBasel', 'LOCATION', '💊', 'Pharma capital.', 'ch', ['CH'], 1200),
    // Locations — NG
    thread('lagos', 'Lagos', 'BeLagos', 'LOCATION', '🌆', "Africa's megacity.", 'ng', ['NG'], 4200),
    // Locations — GB
    thread(
      'london',
      'London',
      'BeLondon',
      'LOCATION',
      '🏰',
      'The world in one city.',
      'gb',
      ['GB'],
      3800
    ),

    // Faith / Religion (global)
    thread(
      'christian',
      'Christianity',
      'BeChristian',
      'RELIGION',
      '✝️',
      'Faith communities worldwide.',
      null,
      [],
      8500
    ),
    thread(
      'muslim',
      'Islam',
      'BeMuslim',
      'RELIGION',
      '☪️',
      'Ummah without borders.',
      null,
      [],
      6200
    ),
    thread(
      'hindu',
      'Hinduism',
      'BeHindu',
      'RELIGION',
      '🕉️',
      'Temples, dharma, cultural bridges.',
      null,
      [],
      3800
    ),
    thread(
      'buddhist',
      'Buddhism',
      'BeBuddhist',
      'RELIGION',
      '☸️',
      'Mindful paths.',
      null,
      [],
      1400
    ),
    thread(
      'traditional',
      'Traditional & Indigenous',
      'BeTraditional',
      'RELIGION',
      '🌿',
      'Ancestral wisdom.',
      null,
      [],
      2100
    ),
  ]

  for (const t of threads) {
    await prisma.thread.upsert({
      where: { slug: t.slug },
      update: { memberCount: t.memberCount },
      create: t,
    })
  }
  console.log(`✅ ${threads.length} Threads seeded`)

  // ── Experiences (eco-tourism) ───────────────────────────────────────────────
  const experiences = [
    experience(
      'lamu-cultural',
      'Lamu Cultural Immersion',
      'Lamu Island, Kenya',
      'cultural',
      '5 days',
      450,
      8,
      [
        'UNESCO Old Town walking tour',
        'Traditional dhow sailing',
        'Swahili cooking class',
        'Henna workshop',
      ],
      'December – March'
    ),
    experience(
      'ol-pejeta-conservation',
      'Ol Pejeta Conservation Experience',
      'Laikipia, Kenya',
      'conservation',
      '7 days',
      1200,
      6,
      [
        'Northern white rhino sanctuary',
        'Predator tracking with researchers',
        'Community project building',
        'Night game drives',
      ],
      'June – October'
    ),
    experience(
      'maasai-community',
      'Maasai Community Stay',
      'Kajiado County, Kenya',
      'community-stay',
      '4 days',
      320,
      10,
      [
        'Live with a Maasai family',
        'Cattle herding experience',
        'Beadwork workshop',
        'Traditional dance',
      ],
      'Year-round'
    ),
    experience(
      'kakamega-forest',
      'Kakamega Rainforest Expedition',
      'Western Kenya',
      'eco-lodge',
      '3 days',
      280,
      12,
      [
        'Guided forest walks',
        'Bird watching (300+ species)',
        'Night forest walk',
        'Community lunch',
      ],
      'Year-round'
    ),
    experience(
      'watamu-marine',
      'Watamu Marine Discovery',
      'Watamu, Kenya',
      'conservation',
      '6 days',
      680,
      8,
      [
        'Coral reef snorkeling',
        'Turtle conservation project',
        'Whale shark tracking',
        'Mangrove kayaking',
      ],
      'October – March'
    ),
    experience(
      'mt-kenya-trek',
      'Mt. Kenya Summit Trek',
      'Central Kenya',
      'eco-lodge',
      '5 days',
      890,
      8,
      [
        'Point Lenana summit (4,985m)',
        'Alpine moorland crossing',
        'Mountain lake camp',
        'Acclimatization walks',
      ],
      'January – March'
    ),
  ]

  for (const e of experiences) {
    await prisma.experience.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    })
  }
  console.log(`✅ ${experiences.length} Experiences seeded`)

  console.log('\n🎉 Seed complete! 3 countries ready: KE, DE, CH')
  console.log('   Visit /ventures to see listings.')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function upsertAnchor(email: string, name: string, country: string, bio: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      role: 'ANCHOR',
      country,
      profile: { create: { bio, headline: name, skills: [] } },
    },
  })
}

async function upsertPioneer(
  email: string,
  name: string,
  country: string,
  phone: string,
  pwHash: string,
  headline: string,
  bio: string,
  pioneerType: string,
  skills: string[]
) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      role: 'PIONEER',
      country,
      phone,
      passwordHash: pwHash,
      profile: { create: { headline, bio, pioneerType, skills } },
    },
  })
}

function path(
  title: string,
  company: string,
  anchorId: string,
  country: string,
  location: string,
  sector: string,
  description: string,
  salaryMin: number,
  salaryMax: number,
  currency: string,
  skills: string[],
  tier: 'BASIC' | 'FEATURED' | 'PREMIUM'
) {
  const id = `seed_${title.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()}`
  return {
    id,
    title,
    company,
    anchorId,
    country,
    location,
    sector,
    description,
    salaryMin,
    salaryMax,
    currency,
    skills,
    status: 'OPEN' as const,
    pathType: 'FULL_PATH' as const,
    tier,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  }
}

function thread(
  slug: string,
  name: string,
  brandName: string,
  type: 'COUNTRY' | 'TRIBE' | 'LANGUAGE' | 'INTEREST' | 'RELIGION' | 'SCIENCE' | 'LOCATION',
  icon: string,
  tagline: string,
  parentSlug: string | null,
  countries: string[],
  memberCount: number
) {
  return {
    slug,
    name,
    brandName,
    type,
    icon,
    tagline,
    description: tagline, // Short default — can expand later
    parentSlug,
    countries,
    relatedSlugs: [],
    memberCount,
    active: true,
  }
}

function experience(
  slug: string,
  name: string,
  location: string,
  type: string,
  duration: string,
  priceUSD: number,
  capacity: number,
  highlights: string[],
  seasonBest: string
) {
  return {
    slug,
    name,
    location,
    type,
    duration,
    priceUSD,
    priceNote: `From $${priceUSD} per person`,
    capacity,
    highlights,
    seasonBest,
    impactNote: '5% of revenue supports local community projects',
    country: 'KE',
    active: true,
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

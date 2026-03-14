/**
 * Be[Country] Platform — Country Configuration System
 *
 * Each entry powers a country-specific deployment:
 *   BeKenya → bekenya.com
 *   BeGermany → begermany.com
 *   BeAmerica → beamerica.com
 *   etc.
 *
 * Architecture:
 * - Same Next.js codebase for all countries
 * - Country resolved from NEXT_PUBLIC_COUNTRY_CODE env var (or hostname)
 * - Payment methods, currency, sectors, partners all per-country
 */

export type CountryCode =
  | 'KE'
  | 'DE'
  | 'CH'
  | 'US'
  | 'NG'
  | 'GH'
  | 'ZA'
  | 'UG'
  | 'TZ'
  | 'IN'
  | 'AE'
  | 'CA'
  | 'GB'
  | 'TH'

export interface PaymentMethod {
  id: string
  name: string
  logo: string
  description: string
  minAmount?: number
  maxAmount?: number
  currencies: string[]
}

export interface JobSector {
  id: string
  name: string
  emoji: string
  count: number
  partnerUrl?: string
  partnerName?: string
}

/** Social impact partner — each country deployment has its own */
export interface ImpactPartner {
  name: string // "UTAMADUNI" | "Brücken e.V." | "Ọmọ Foundation"
  fullName: string // "UTAMADUNI Community-Based Organisation"
  tagline: string // "Every path plants a seed"
  sharePercent: string // "5%"
  contributionAmount: string // "KES 50" | "€2" | "₦500"
  pillars: string[] // ["Education", "Women's Empowerment", "Conservation", "Cultural Preservation"]
  url?: string // public page slug: "/charity"
}

export interface CountryConfig {
  code: CountryCode
  name: string
  brandName: string // "Bekenya" | "BeGermany" | "BeAmerica"
  domain: string // "bekenya.com" | "begermany.com"
  flag: string // emoji
  currency: string // "KES" | "EUR" | "USD"
  currencySymbol: string
  locale: string // "en-KE" | "de-DE" | "en-US"
  phonePrefix: string // "+254" | "+49" | "+1"
  primaryColor: string // hex — can customize per country
  impactPartner: ImpactPartner
  paymentMethods: PaymentMethod[]
  featuredSectors: JobSector[]
  popularSearches: string[]
  heroTagline: string
  heroSubtext: string
  statsBar: { label: string; value: string }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// KENYA — BeKenya 🇰🇪
// ─────────────────────────────────────────────────────────────────────────────
const kenyaConfig: CountryConfig = {
  code: 'KE',
  name: 'Kenya',
  brandName: 'BeKenya',
  domain: 'bekenya.com',
  flag: '🇰🇪',
  currency: 'KES',
  currencySymbol: 'KES',
  locale: 'en-KE',
  phonePrefix: '+254',
  primaryColor: '#5C0A14',
  impactPartner: {
    name: 'UTAMADUNI',
    fullName: 'UTAMADUNI Community-Based Organisation',
    tagline: 'Every path plants a seed',
    sharePercent: '5%',
    contributionAmount: 'KES 50',
    pillars: ['Education', "Women's Empowerment", 'Conservation', 'Cultural Preservation'],
    url: '/charity',
  },
  paymentMethods: [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      logo: 'M',
      description: 'Safaricom M-Pesa STK Push',
      currencies: ['KES'],
      maxAmount: 150000,
    },
    {
      id: 'airtel-money',
      name: 'Airtel Money',
      logo: 'A',
      description: 'Airtel Kenya',
      currencies: ['KES'],
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: 'S',
      description: 'Cards (international employers)',
      currencies: ['USD', 'EUR', 'GBP'],
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      logo: 'F',
      description: 'Pan-African payments',
      currencies: ['KES', 'NGN', 'GHS'],
    },
  ],
  featuredSectors: [
    { id: 'tech', name: 'Tech & Engineering', emoji: '💻', count: 4200 },
    {
      id: 'safari',
      name: 'Wildlife & Safaris',
      emoji: '🦁',
      count: 850,
      partnerName: 'African Wildlife Foundation',
      partnerUrl: 'https://www.awf.org',
    },
    {
      id: 'eco-tourism',
      name: 'Eco-Tourism',
      emoji: '🌿',
      count: 620,
      partnerName: 'Basecamp Explorer',
      partnerUrl: 'https://basecampexplorer.com',
    },
    { id: 'finance', name: 'Finance & Banking', emoji: '💰', count: 1800 },
    { id: 'health', name: 'Healthcare', emoji: '🏥', count: 2100 },
    { id: 'education', name: 'Teaching & Education', emoji: '📚', count: 1500 },
    { id: 'hospitality', name: 'Hospitality', emoji: '🍽️', count: 1200 },
    { id: 'creative', name: 'Creative & Media', emoji: '🎨', count: 680 },
    { id: 'agriculture', name: 'Agriculture & Farming', emoji: '🌾', count: 2100 },
    { id: 'marine', name: 'Marine & Water Sports', emoji: '🌊', count: 450 },
  ],
  popularSearches: [
    'Safari Guide',
    'Software Explorer',
    'Healthcare',
    'Tea Estate',
    'Deep-Sea Fishing',
    'Remote',
    'Nairobi',
    'UK Visa Opportunity',
  ],
  heroTagline: 'Global Opportunities, Paid via M-Pesa',
  heroSubtext:
    'Find your path with Hosts from Kenya, USA, UK, UAE and beyond. Open an Exchange, begin your Experience.',
  statsBar: [
    { label: 'Open Opportunities', value: '12,400+' },
    { label: 'Countries', value: '50+' },
    { label: 'Explorers Placed', value: '3,200' },
    { label: 'Avg. (KES)', value: '85K' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// GERMANY — BeGermany 🇩🇪
// ─────────────────────────────────────────────────────────────────────────────
const germanyConfig: CountryConfig = {
  code: 'DE',
  name: 'Germany',
  brandName: 'BeGermany',
  domain: 'begermany.com',
  flag: '🇩🇪',
  currency: 'EUR',
  currencySymbol: '€',
  locale: 'de-DE',
  phonePrefix: '+49',
  primaryColor: '#5C0A14',
  impactPartner: {
    name: 'Brücken e.V.',
    fullName: 'Brücken — Verein für Integration und Austausch',
    tagline: 'Brücken bauen, Zukunft gestalten',
    sharePercent: '5%',
    contributionAmount: '€2',
    pillars: ['Integration', 'Language Training', 'Professional Mentorship', 'Cultural Exchange'],
    url: '/charity',
  },
  paymentMethods: [
    {
      id: 'sepa',
      name: 'SEPA Direct Debit',
      logo: 'EU',
      description: 'EU bank transfer',
      currencies: ['EUR'],
    },
    {
      id: 'stripe',
      name: 'Stripe / Kreditkarte',
      logo: 'S',
      description: 'Visa, Mastercard, Amex',
      currencies: ['EUR'],
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: 'P',
      description: 'PayPal international',
      currencies: ['EUR', 'USD'],
    },
  ],
  featuredSectors: [
    {
      id: 'engineering',
      name: 'Engineering',
      emoji: '⚙️',
      count: 8200,
      partnerName: 'VDMA',
      partnerUrl: 'https://www.vdma.org',
    },
    { id: 'it', name: 'IT & Software', emoji: '💻', count: 12400 },
    {
      id: 'healthcare',
      name: 'Pflege & Gesundheit',
      emoji: '🏥',
      count: 6800,
      partnerName: 'DBfK',
      partnerUrl: 'https://www.dbfk.de',
    },
    {
      id: 'automotive',
      name: 'Automotive',
      emoji: '🚗',
      count: 4200,
      partnerName: 'VDA',
      partnerUrl: 'https://www.vda.de',
    },
    { id: 'renewable', name: 'Renewable Energy', emoji: '⚡', count: 2800 },
    { id: 'logistics', name: 'Logistik & Transport', emoji: '🚛', count: 5400 },
    { id: 'finance', name: 'Finance & Banking', emoji: '🏦', count: 3200 },
    { id: 'hospitality', name: 'Gastronomie', emoji: '🍽️', count: 3800 },
  ],
  popularSearches: [
    'Software Engineer',
    'Ausbildung',
    'Krankenschwester',
    'Remote',
    'München',
    'Berlin',
  ],
  heroTagline: 'Dein Weg nach Deutschland',
  heroSubtext:
    'Finde deinen Pfad bei führenden deutschen Hosts. Öffne einen Exchange, starte dein Abenteuer.',
  statsBar: [
    { label: 'Offene Opportunities', value: '48,000+' },
    { label: 'Hosts', value: '2,400+' },
    { label: 'Explorers platziert', value: '8,200' },
    { label: 'Ø Vergütung', value: '€58k' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// SWITZERLAND — BeSwitzerland 🇨🇭
// ─────────────────────────────────────────────────────────────────────────────
const switzerlandConfig: CountryConfig = {
  code: 'CH',
  name: 'Switzerland',
  brandName: 'BeSwitzerland',
  domain: 'beswitzerland.com',
  flag: '🇨🇭',
  currency: 'CHF',
  currencySymbol: 'CHF',
  locale: 'de-CH',
  phonePrefix: '+41',
  primaryColor: '#5C0A14',
  impactPartner: {
    name: 'Brücken Schweiz',
    fullName: 'Brücken Schweiz — Verein für Integration',
    tagline: 'Brücken bauen zwischen Kulturen',
    sharePercent: '5%',
    contributionAmount: 'CHF 2',
    pillars: ['Integration', 'Language Training', 'Professional Mentorship', 'Cultural Exchange'],
    url: '/charity',
  },
  paymentMethods: [
    {
      id: 'twint',
      name: 'TWINT',
      logo: 'TW',
      description: 'Swiss mobile payment',
      currencies: ['CHF'],
    },
    {
      id: 'sepa',
      name: 'SEPA Direct Debit',
      logo: 'EU',
      description: 'EU/Swiss bank transfer',
      currencies: ['CHF', 'EUR'],
    },
    {
      id: 'stripe',
      name: 'Stripe / Kreditkarte',
      logo: 'S',
      description: 'Visa, Mastercard, Amex',
      currencies: ['CHF', 'EUR'],
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: 'P',
      description: 'PayPal international',
      currencies: ['CHF', 'EUR', 'USD'],
    },
  ],
  featuredSectors: [
    { id: 'finance', name: 'Finance & Banking', emoji: '🏦', count: 9200 },
    {
      id: 'pharma',
      name: 'Pharma & Biotech',
      emoji: '💊',
      count: 6800,
      partnerName: 'Interpharma',
      partnerUrl: 'https://www.interpharma.ch',
    },
    { id: 'hospitality', name: 'Hospitality & Tourism', emoji: '🏔️', count: 5400 },
    { id: 'it', name: 'IT & Software', emoji: '💻', count: 8400 },
    {
      id: 'precision',
      name: 'Precision Engineering',
      emoji: '⚙️',
      count: 3200,
      partnerName: 'Swissmem',
      partnerUrl: 'https://www.swissmem.ch',
    },
    { id: 'renewable', name: 'Renewable Energy', emoji: '⚡', count: 1800 },
    { id: 'healthcare', name: 'Healthcare', emoji: '🏥', count: 4200 },
    { id: 'education', name: 'Education & Research', emoji: '🎓', count: 2800 },
  ],
  popularSearches: [
    'Software Engineer',
    'Pharma Research',
    'Hotel Management',
    'Banking',
    'Zürich',
    'Remote',
  ],
  heroTagline: 'Dein Weg in die Schweiz',
  heroSubtext:
    'Finde deinen Pfad bei führenden Schweizer Hosts. Pharma, Finanzen, Hospitality — Weltklasse-Chancen.',
  statsBar: [
    { label: 'Offene Opportunities', value: '38,000+' },
    { label: 'Hosts', value: '1,800+' },
    { label: 'Explorers platziert', value: '4,200' },
    { label: 'Ø Vergütung', value: 'CHF 85k' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// USA — BeAmerica 🇺🇸
// ─────────────────────────────────────────────────────────────────────────────
const usaConfig: CountryConfig = {
  code: 'US',
  name: 'United States',
  brandName: 'BeAmerica',
  domain: 'beamerica.com',
  flag: '🇺🇸',
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  phonePrefix: '+1',
  primaryColor: '#5C0A14',
  impactPartner: {
    name: 'Pathways Foundation',
    fullName: 'Pathways — Foundation for Global Mobility',
    tagline: 'Opening doors, building futures',
    sharePercent: '5%',
    contributionAmount: '$1',
    pillars: ['Visa Support', 'Skills Training', 'Community Integration', 'Career Mentorship'],
    url: '/charity',
  },
  paymentMethods: [
    {
      id: 'stripe',
      name: 'Stripe',
      logo: 'S',
      description: 'Cards, ACH bank transfer',
      currencies: ['USD'],
    },
    { id: 'paypal', name: 'PayPal', logo: 'P', description: 'PayPal / Venmo', currencies: ['USD'] },
  ],
  featuredSectors: [
    { id: 'tech', name: 'Technology', emoji: '💻', count: 85000 },
    { id: 'healthcare', name: 'Healthcare', emoji: '🏥', count: 62000 },
    { id: 'finance', name: 'Finance & Fintech', emoji: '💰', count: 28000 },
    { id: 'green', name: 'Clean Energy', emoji: '⚡', count: 14000 },
    { id: 'construction', name: 'Construction', emoji: '🏗️', count: 35000 },
    { id: 'education', name: 'Education', emoji: '📚', count: 22000 },
    { id: 'aviation', name: 'Aviation & Travel', emoji: '✈️', count: 8200 },
    { id: 'remote', name: 'Remote / Anywhere', emoji: '🌎', count: 48000 },
  ],
  popularSearches: [
    'Software Explorer',
    'Remote',
    'H1B Opportunity',
    'New York',
    'Silicon Valley',
    'Healthcare',
  ],
  heroTagline: 'Find Your American Opportunity',
  heroSubtext:
    'Top US Hosts with open Opportunities. H1B sponsored, remote, and high-value Experiences across 50 states.',
  statsBar: [
    { label: 'Open Opportunities', value: '280,000+' },
    { label: 'Hosts', value: '12,000+' },
    { label: 'Explorers Placed', value: '42,000' },
    { label: 'Avg. Compensation', value: '$95k' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// NIGERIA — BeNigeria 🇳🇬
// ─────────────────────────────────────────────────────────────────────────────
const nigeriaConfig: CountryConfig = {
  code: 'NG',
  name: 'Nigeria',
  brandName: 'BeNigeria',
  domain: 'benigeria.com',
  flag: '🇳🇬',
  currency: 'NGN',
  currencySymbol: '₦',
  locale: 'en-NG',
  phonePrefix: '+234',
  primaryColor: '#5C0A14',
  impactPartner: {
    name: 'Ọmọ Foundation',
    fullName: 'Ọmọ — Foundation for Youth & Enterprise',
    tagline: 'Our children, our future',
    sharePercent: '5%',
    contributionAmount: '₦500',
    pillars: ['Youth Enterprise', 'Digital Skills', 'Mentorship', 'Community Development'],
    url: '/charity',
  },
  paymentMethods: [
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      logo: 'F',
      description: 'Cards, bank transfer, USSD',
      currencies: ['NGN', 'USD'],
    },
    {
      id: 'paystack',
      name: 'Paystack',
      logo: 'PS',
      description: 'Cards, bank, USSD',
      currencies: ['NGN'],
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: 'S',
      description: 'International cards',
      currencies: ['USD'],
    },
  ],
  featuredSectors: [
    { id: 'tech', name: 'Tech & Fintech', emoji: '💻', count: 12400 },
    { id: 'finance', name: 'Banking & Finance', emoji: '🏦', count: 8200 },
    { id: 'oil-gas', name: 'Oil & Gas', emoji: '⛽', count: 4800 },
    { id: 'telecom', name: 'Telecom', emoji: '📡', count: 2800 },
    { id: 'media', name: 'Nollywood & Media', emoji: '🎬', count: 1200 },
    { id: 'agri', name: 'Agriculture', emoji: '🌾', count: 3400 },
    { id: 'health', name: 'Healthcare', emoji: '🏥', count: 5200 },
    { id: 'education', name: 'Education', emoji: '📚', count: 3800 },
  ],
  popularSearches: [
    'Software Explorer',
    'Lagos',
    'Remote',
    'Finance Opportunity',
    'Oil & Gas',
    'NYSC',
  ],
  heroTagline: 'Find Your Opportunity in Nigeria',
  heroSubtext:
    'Connect with Hosts across Nigeria. Pay with Flutterwave or Paystack. Open your Exchange today.',
  statsBar: [
    { label: 'Open Opportunities', value: '38,000+' },
    { label: 'Hosts', value: '3,200+' },
    { label: 'Explorers Placed', value: '6,800' },
    { label: 'Avg. (₦)', value: '450k' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Country registry
// ─────────────────────────────────────────────────────────────────────────────
export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  KE: kenyaConfig,
  DE: germanyConfig,
  CH: switzerlandConfig,
  US: usaConfig,
  NG: nigeriaConfig,
  // Placeholders — configs to be built out:
  GH: {
    ...nigeriaConfig,
    code: 'GH',
    name: 'Ghana',
    brandName: 'BeGhana',
    domain: 'beghana.com',
    flag: '🇬🇭',
    currency: 'GHS',
    currencySymbol: '₵',
    locale: 'en-GH',
    phonePrefix: '+233',
    paymentMethods: [
      {
        id: 'mtn-momo',
        name: 'MTN MoMo',
        logo: 'M',
        description: 'MTN Mobile Money',
        currencies: ['GHS'],
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave',
        logo: 'F',
        description: 'Pan-African payments',
        currencies: ['GHS', 'USD'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: 'S',
        description: 'Cards (international)',
        currencies: ['USD', 'GBP'],
      },
    ],
  },
  ZA: {
    ...kenyaConfig,
    code: 'ZA',
    name: 'South Africa',
    brandName: 'BeSouthAfrica',
    domain: 'besouthafrica.com',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R',
    locale: 'en-ZA',
    phonePrefix: '+27',
    paymentMethods: [
      {
        id: 'eft',
        name: 'EFT / Bank Transfer',
        logo: 'E',
        description: 'South African bank transfer',
        currencies: ['ZAR'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: 'S',
        description: 'Cards (Visa, Mastercard)',
        currencies: ['ZAR', 'USD'],
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave',
        logo: 'F',
        description: 'Pan-African payments',
        currencies: ['ZAR', 'USD'],
      },
    ],
  },
  UG: {
    ...kenyaConfig,
    code: 'UG',
    name: 'Uganda',
    brandName: 'BeUganda',
    domain: 'beuganda.com',
    flag: '🇺🇬',
    currency: 'UGX',
    currencySymbol: 'USh',
    locale: 'en-UG',
    phonePrefix: '+256',
    paymentMethods: [
      {
        id: 'mtn-momo',
        name: 'MTN MoMo',
        logo: 'M',
        description: 'MTN Mobile Money Uganda',
        currencies: ['UGX'],
      },
      {
        id: 'airtel-money',
        name: 'Airtel Money',
        logo: 'A',
        description: 'Airtel Money Uganda',
        currencies: ['UGX'],
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave',
        logo: 'F',
        description: 'Pan-African payments',
        currencies: ['UGX', 'USD'],
      },
    ],
  },
  TZ: {
    ...kenyaConfig,
    code: 'TZ',
    name: 'Tanzania',
    brandName: 'BeTanzania',
    domain: 'betanzania.com',
    flag: '🇹🇿',
    currency: 'TZS',
    currencySymbol: 'TSh',
    locale: 'en-TZ',
    phonePrefix: '+255',
    paymentMethods: [
      {
        id: 'mpesa',
        name: 'M-Pesa',
        logo: 'M',
        description: 'Vodacom M-Pesa Tanzania',
        currencies: ['TZS'],
      },
      {
        id: 'tigo-pesa',
        name: 'Tigo Pesa',
        logo: 'T',
        description: 'Tigo mobile money',
        currencies: ['TZS'],
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave',
        logo: 'F',
        description: 'Pan-African payments',
        currencies: ['TZS', 'USD'],
      },
    ],
  },
  IN: {
    ...usaConfig,
    code: 'IN',
    name: 'India',
    brandName: 'BeIndia',
    domain: 'beindia.com',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    phonePrefix: '+91',
    paymentMethods: [
      {
        id: 'upi',
        name: 'UPI',
        logo: 'U',
        description: 'Unified Payments Interface',
        currencies: ['INR'],
      },
      {
        id: 'razorpay',
        name: 'Razorpay',
        logo: 'R',
        description: 'Cards, UPI, wallets',
        currencies: ['INR', 'USD'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: 'S',
        description: 'Cards (international)',
        currencies: ['INR', 'USD'],
      },
    ],
  },
  AE: {
    ...usaConfig,
    code: 'AE',
    name: 'UAE',
    brandName: 'BeUAE',
    domain: 'beuae.com',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'د.إ',
    locale: 'en-AE',
    phonePrefix: '+971',
    paymentMethods: [
      {
        id: 'apple-pay',
        name: 'Apple Pay',
        logo: 'A',
        description: 'Apple Pay (UAE)',
        currencies: ['AED', 'USD'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: 'S',
        description: 'Cards (Visa, Mastercard)',
        currencies: ['AED', 'USD'],
      },
      {
        id: 'paypal',
        name: 'PayPal',
        logo: 'P',
        description: 'PayPal',
        currencies: ['AED', 'USD'],
      },
    ],
  },
  CA: {
    ...usaConfig,
    code: 'CA',
    name: 'Canada',
    brandName: 'BeCanada',
    domain: 'becanada.com',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'CA$',
    locale: 'en-CA',
    phonePrefix: '+1',
    paymentMethods: [
      {
        id: 'interac',
        name: 'Interac',
        logo: 'I',
        description: 'Interac e-Transfer',
        currencies: ['CAD'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: 'S',
        description: 'Cards (Visa, Mastercard)',
        currencies: ['CAD', 'USD'],
      },
      {
        id: 'paypal',
        name: 'PayPal',
        logo: 'P',
        description: 'PayPal',
        currencies: ['CAD', 'USD'],
      },
    ],
  },
  GB: {
    ...usaConfig,
    code: 'GB',
    name: 'United Kingdom',
    brandName: 'BeUK',
    domain: 'beuk.com',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    locale: 'en-GB',
    phonePrefix: '+44',
    paymentMethods: [
      {
        id: 'faster-payments',
        name: 'Faster Payments',
        logo: 'F',
        description: 'UK bank transfer',
        currencies: ['GBP'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: 'S',
        description: 'Cards (Visa, Mastercard)',
        currencies: ['GBP', 'EUR', 'USD'],
      },
      {
        id: 'paypal',
        name: 'PayPal',
        logo: 'P',
        description: 'PayPal',
        currencies: ['GBP', 'EUR', 'USD'],
      },
    ],
  },
  TH: {
    ...usaConfig,
    code: 'TH',
    name: 'Thailand',
    brandName: 'BeThailand',
    domain: 'bethailand.com',
    flag: '🇹🇭',
    currency: 'THB',
    currencySymbol: '฿',
    locale: 'th-TH',
    phonePrefix: '+66',
    impactPartner: {
      name: 'Siam Bridges',
      fullName: 'Siam Bridges — Foundation for Cross-Cultural Exchange',
      tagline: 'Bridging cultures, building futures',
      sharePercent: '5%',
      contributionAmount: 'THB 50',
      pillars: [
        'Cultural Exchange',
        'Skills Training',
        'Community Development',
        'Youth Empowerment',
      ],
      url: '/charity',
    },
    paymentMethods: [
      {
        id: 'bank-transfer',
        name: 'Bank Transfer',
        logo: 'BT',
        description: 'Thai bank transfer',
        currencies: ['THB'],
      },
      {
        id: 'promptpay',
        name: 'PromptPay',
        logo: 'PP',
        description: 'Thai QR payment system',
        currencies: ['THB'],
      },
      {
        id: 'stripe',
        name: 'Stripe',
        logo: 'S',
        description: 'International cards',
        currencies: ['THB', 'USD'],
      },
    ],
    featuredSectors: [
      { id: 'tourism', name: 'Tourism', emoji: '🏖️', count: 8400 },
      { id: 'manufacturing', name: 'Manufacturing', emoji: '🏭', count: 6200 },
      { id: 'tech', name: 'Technology', emoji: '💻', count: 5800 },
      { id: 'agriculture', name: 'Agriculture', emoji: '🌾', count: 4200 },
      { id: 'healthcare', name: 'Healthcare', emoji: '🏥', count: 3600 },
      { id: 'hospitality', name: 'Hospitality', emoji: '🍽️', count: 7200 },
    ],
    popularSearches: [
      'Hotel Manager',
      'Software Explorer',
      'Tourism',
      'Bangkok',
      'Remote',
      'Agriculture',
    ],
    heroTagline: 'Find Your Opportunity in Thailand',
    heroSubtext:
      'Connect with Hosts across Thailand. Tourism, tech, and agriculture Opportunities in the Land of Smiles.',
    statsBar: [
      { label: 'Open Opportunities', value: '32,000+' },
      { label: 'Hosts', value: '2,100+' },
      { label: 'Explorers Placed', value: '5,400' },
      { label: 'Avg. (THB)', value: '85k' },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO metadata per country (used in app/layout.tsx <head>)
// ─────────────────────────────────────────────────────────────────────────────

export interface CountrySEOMeta {
  title: string
  description: string
  twitter: string
  brandName: string
}

export const COUNTRY_META: Record<string, CountrySEOMeta> = {
  KE: {
    title: 'BeKenya — Find Where You Belong. Go There.',
    description:
      'An identity-first discovery platform for Explorers. Safari paths, professional experiences, community impact — Kenya-first, globally connected. M-Pesa, Stripe, Flutterwave.',
    twitter: '@BeKenya',
    brandName: 'BeKenya',
  },
  DE: {
    title: 'BeGermany — Find Your Path in Germany.',
    description:
      'Your compass for professional paths, experiences, and community in Germany. SEPA payments, skilled worker routes, European connections.',
    twitter: '@BeGermany',
    brandName: 'BeGermany',
  },
  CH: {
    title: 'BeSwitzerland — Find Your Path in Switzerland.',
    description:
      'Your compass for professional paths, alpine experiences, and community in Switzerland. TWINT, Stripe, cross-border routes.',
    twitter: '@BeSwitzerland',
    brandName: 'BeSwitzerland',
  },
  TH: {
    title: 'BeThailand — Find Your Path in Thailand.',
    description:
      'Your compass for professional paths, tourism ventures, and community in Thailand. PromptPay, Stripe, cultural exchange.',
    twitter: '@BeThailand',
    brandName: 'BeThailand',
  },
  US: {
    title: 'BeAmerica — Find Your Path in the United States.',
    description:
      'Your compass for professional paths, innovation hubs, and diverse communities across America. ACH, Stripe, global connections.',
    twitter: '@BeAmerica',
    brandName: 'BeAmerica',
  },
  NG: {
    title: 'BeNigeria — Find Your Path in Nigeria.',
    description:
      "Your compass for tech, creative, and professional paths in Nigeria. Flutterwave, Paystack, Africa's largest economy.",
    twitter: '@BeNigeria',
    brandName: 'BeNigeria',
  },
  GH: {
    title: 'BeGhana — Find Your Path in Ghana.',
    description:
      'Your compass for professional paths, cultural heritage, and community in Ghana. MTN MoMo, Flutterwave, West African connections.',
    twitter: '@BeGhana',
    brandName: 'BeGhana',
  },
  ZA: {
    title: 'BeSouthAfrica — Find Your Path in South Africa.',
    description:
      'Your compass for professional paths, wildlife ventures, and community in South Africa. EFT, Stripe, continental gateway.',
    twitter: '@BeSouthAfrica',
    brandName: 'BeSouthAfrica',
  },
  UG: {
    title: 'BeUganda — Find Your Path in Uganda.',
    description:
      'Your compass for professional paths, gorilla trekking ventures, and community in Uganda. MTN MoMo, Airtel Money, East African routes.',
    twitter: '@BeUganda',
    brandName: 'BeUganda',
  },
  TZ: {
    title: 'BeTanzania — Find Your Path in Tanzania.',
    description:
      'Your compass for professional paths, Serengeti ventures, and community in Tanzania. M-Pesa, Tigo Pesa, East African connections.',
    twitter: '@BeTanzania',
    brandName: 'BeTanzania',
  },
  IN: {
    title: 'BeIndia — Find Your Path in India.',
    description:
      'Your compass for technology paths, cultural experiences, and community across India. UPI, Razorpay, global talent hub.',
    twitter: '@BeIndia',
    brandName: 'BeIndia',
  },
  AE: {
    title: 'BeUAE — Find Your Path in the UAE.',
    description:
      'Your compass for professional paths, business ventures, and community in the UAE. Apple Pay, Stripe, global business hub.',
    twitter: '@BeUAE',
    brandName: 'BeUAE',
  },
  CA: {
    title: 'BeCanada — Find Your Path in Canada.',
    description:
      'Your compass for professional paths, natural adventures, and multicultural community in Canada. Interac, Stripe, immigration pathways.',
    twitter: '@BeCanada',
    brandName: 'BeCanada',
  },
  GB: {
    title: 'BeUK — Find Your Path in the United Kingdom.',
    description:
      'Your compass for professional paths, cultural experiences, and community in the UK. Faster Payments, Stripe, global connections.',
    twitter: '@BeUK',
    brandName: 'BeUK',
  },
}

/** Get active country config (from env var or default to Kenya) */
export function getCountryConfig(): CountryConfig {
  const code = (process.env.NEXT_PUBLIC_COUNTRY_CODE as CountryCode) || 'KE'
  return COUNTRIES[code] ?? COUNTRIES.KE
}

/** Get all country configs for the landing page selector */
export function getAllCountries(): CountryConfig[] {
  return Object.values(COUNTRIES)
}

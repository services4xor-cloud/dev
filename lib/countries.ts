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

export type CountryCode = 'KE' | 'DE' | 'US' | 'NG' | 'GH' | 'ZA' | 'UG' | 'TZ' | 'IN' | 'AE' | 'CA' | 'GB'

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

export interface CountryConfig {
  code: CountryCode
  name: string
  brandName: string     // "Bekenya" | "BeGermany" | "BeAmerica"
  domain: string        // "bekenya.com" | "begermany.com"
  flag: string          // emoji
  currency: string      // "KES" | "EUR" | "USD"
  currencySymbol: string
  locale: string        // "en-KE" | "de-DE" | "en-US"
  phonePrefix: string   // "+254" | "+49" | "+1"
  primaryColor: string  // hex — can customize per country
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
  brandName: 'Bekenya',
  domain: 'bekenya.com',
  flag: '🇰🇪',
  currency: 'KES',
  currencySymbol: 'KES',
  locale: 'en-KE',
  phonePrefix: '+254',
  primaryColor: '#FF6B35',
  paymentMethods: [
    { id: 'mpesa', name: 'M-Pesa', logo: 'M', description: 'Safaricom M-Pesa STK Push', currencies: ['KES'], maxAmount: 150000 },
    { id: 'airtel-money', name: 'Airtel Money', logo: 'A', description: 'Airtel Kenya', currencies: ['KES'] },
    { id: 'stripe', name: 'Stripe', logo: 'S', description: 'Cards (international employers)', currencies: ['USD', 'EUR', 'GBP'] },
    { id: 'flutterwave', name: 'Flutterwave', logo: 'F', description: 'Pan-African payments', currencies: ['KES', 'NGN', 'GHS'] },
  ],
  featuredSectors: [
    { id: 'tech', name: 'Tech & Engineering', emoji: '💻', count: 4200 },
    { id: 'safari', name: 'Wildlife & Safaris', emoji: '🦁', count: 850, partnerName: 'African Wildlife Foundation', partnerUrl: 'https://www.awf.org' },
    { id: 'eco-tourism', name: 'Eco-Tourism', emoji: '🌿', count: 620, partnerName: 'Basecamp Explorer', partnerUrl: 'https://basecampexplorer.com' },
    { id: 'finance', name: 'Finance & Banking', emoji: '💰', count: 1800 },
    { id: 'health', name: 'Healthcare', emoji: '🏥', count: 2100 },
    { id: 'education', name: 'Teaching & Education', emoji: '📚', count: 1500 },
    { id: 'hospitality', name: 'Hospitality', emoji: '🍽️', count: 1200 },
    { id: 'creative', name: 'Creative & Media', emoji: '🎨', count: 680 },
  ],
  popularSearches: ['Safari Guide', 'Software Engineer', 'Nurse', 'Remote', 'Nairobi', 'UK Visa Sponsored'],
  heroTagline: 'International Jobs, Paid via M-Pesa',
  heroSubtext: 'Find your dream job with top employers from Kenya, USA, UK, UAE and beyond. Apply fast, get hired faster.',
  statsBar: [
    { label: 'Active Jobs', value: '12,400+' },
    { label: 'Countries', value: '50+' },
    { label: 'Hired This Month', value: '3,200' },
    { label: 'Avg. Salary (KES)', value: '85K' },
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
  primaryColor: '#FF6B35',
  paymentMethods: [
    { id: 'sepa', name: 'SEPA Direct Debit', logo: 'EU', description: 'EU bank transfer', currencies: ['EUR'] },
    { id: 'stripe', name: 'Stripe / Kreditkarte', logo: 'S', description: 'Visa, Mastercard, Amex', currencies: ['EUR'] },
    { id: 'paypal', name: 'PayPal', logo: 'P', description: 'PayPal international', currencies: ['EUR', 'USD'] },
  ],
  featuredSectors: [
    { id: 'engineering', name: 'Engineering', emoji: '⚙️', count: 8200, partnerName: 'VDMA', partnerUrl: 'https://www.vdma.org' },
    { id: 'it', name: 'IT & Software', emoji: '💻', count: 12400 },
    { id: 'healthcare', name: 'Pflege & Gesundheit', emoji: '🏥', count: 6800, partnerName: 'DBfK', partnerUrl: 'https://www.dbfk.de' },
    { id: 'automotive', name: 'Automotive', emoji: '🚗', count: 4200, partnerName: 'VDA', partnerUrl: 'https://www.vda.de' },
    { id: 'renewable', name: 'Renewable Energy', emoji: '⚡', count: 2800 },
    { id: 'logistics', name: 'Logistik & Transport', emoji: '🚛', count: 5400 },
    { id: 'finance', name: 'Finance & Banking', emoji: '🏦', count: 3200 },
    { id: 'hospitality', name: 'Gastronomie', emoji: '🍽️', count: 3800 },
  ],
  popularSearches: ['Software Engineer', 'Ausbildung', 'Krankenschwester', 'Remote', 'München', 'Berlin'],
  heroTagline: 'Jobs in Deutschland finden',
  heroSubtext: 'Finde deinen Traumjob bei führenden deutschen Unternehmen. Schnell bewerben, schnell eingestellt werden.',
  statsBar: [
    { label: 'Aktive Stellen', value: '48,000+' },
    { label: 'Arbeitgeber', value: '2,400+' },
    { label: 'Eingestellt diesen Monat', value: '8,200' },
    { label: 'Ø Gehalt', value: '€58k' },
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
  primaryColor: '#FF6B35',
  paymentMethods: [
    { id: 'stripe', name: 'Stripe', logo: 'S', description: 'Cards, ACH bank transfer', currencies: ['USD'] },
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
  popularSearches: ['Software Engineer', 'Remote', 'H1B Sponsor', 'New York', 'Silicon Valley', 'Healthcare'],
  heroTagline: 'Find Your Next American Opportunity',
  heroSubtext: 'Top US employers hiring now. Find H1B sponsored roles, remote work, and high-paying tech jobs.',
  statsBar: [
    { label: 'Active Jobs', value: '280,000+' },
    { label: 'Employers', value: '12,000+' },
    { label: 'Hired This Month', value: '42,000' },
    { label: 'Avg. Salary', value: '$95k' },
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
  primaryColor: '#FF6B35',
  paymentMethods: [
    { id: 'flutterwave', name: 'Flutterwave', logo: 'F', description: 'Cards, bank transfer, USSD', currencies: ['NGN', 'USD'] },
    { id: 'paystack', name: 'Paystack', logo: 'PS', description: 'Cards, bank, USSD', currencies: ['NGN'] },
    { id: 'stripe', name: 'Stripe', logo: 'S', description: 'International cards', currencies: ['USD'] },
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
  popularSearches: ['Software Engineer', 'Lagos', 'Remote', 'Bank Job', 'Oil & Gas', 'NYSC'],
  heroTagline: 'Find Top Jobs in Nigeria',
  heroSubtext: 'Connect with the best employers across Nigeria. Pay with Flutterwave or Paystack. Get hired fast.',
  statsBar: [
    { label: 'Active Jobs', value: '38,000+' },
    { label: 'Employers', value: '3,200+' },
    { label: 'Hired This Month', value: '6,800' },
    { label: 'Avg. Salary (₦)', value: '450k' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Country registry
// ─────────────────────────────────────────────────────────────────────────────
export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  KE: kenyaConfig,
  DE: germanyConfig,
  US: usaConfig,
  NG: nigeriaConfig,
  // Placeholders — configs to be built out:
  GH: { ...nigeriaConfig, code: 'GH', name: 'Ghana', brandName: 'BeGhana', domain: 'beghana.com', flag: '🇬🇭', currency: 'GHS', currencySymbol: '₵', locale: 'en-GH', phonePrefix: '+233' },
  ZA: { ...kenyaConfig, code: 'ZA', name: 'South Africa', brandName: 'BeSouthAfrica', domain: 'besouthafrica.com', flag: '🇿🇦', currency: 'ZAR', currencySymbol: 'R', locale: 'en-ZA', phonePrefix: '+27' },
  UG: { ...kenyaConfig, code: 'UG', name: 'Uganda', brandName: 'BeUganda', domain: 'beuganda.com', flag: '🇺🇬', currency: 'UGX', currencySymbol: 'USh', locale: 'en-UG', phonePrefix: '+256' },
  TZ: { ...kenyaConfig, code: 'TZ', name: 'Tanzania', brandName: 'BeTanzania', domain: 'betanzania.com', flag: '🇹🇿', currency: 'TZS', currencySymbol: 'TSh', locale: 'en-TZ', phonePrefix: '+255' },
  IN: { ...usaConfig, code: 'IN', name: 'India', brandName: 'BeIndia', domain: 'beindia.com', flag: '🇮🇳', currency: 'INR', currencySymbol: '₹', locale: 'en-IN', phonePrefix: '+91' },
  AE: { ...usaConfig, code: 'AE', name: 'UAE', brandName: 'BeUAE', domain: 'beuae.com', flag: '🇦🇪', currency: 'AED', currencySymbol: 'د.إ', locale: 'en-AE', phonePrefix: '+971' },
  CA: { ...usaConfig, code: 'CA', name: 'Canada', brandName: 'BeCanada', domain: 'becanada.com', flag: '🇨🇦', currency: 'CAD', currencySymbol: 'CA$', locale: 'en-CA', phonePrefix: '+1' },
  GB: { ...usaConfig, code: 'GB', name: 'United Kingdom', brandName: 'BeUK', domain: 'beuk.com', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£', locale: 'en-GB', phonePrefix: '+44' },
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

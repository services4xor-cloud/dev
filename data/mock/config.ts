/**
 * Platform Configuration — centralized brand, contact, and social info.
 * All pages import from here. Never hardcode contact details in pages.
 */

import { COUNTRIES } from '@/lib/countries'

const CC = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase() as keyof typeof COUNTRIES
const country = COUNTRIES[CC]

// ── Brand ────────────────────────────────────────────────────────
export const BRAND_NAME = `Be${country?.name ?? 'Country'}`
export const BRAND_TAGLINE = 'Find where you belong. Go there.'
export const BRAND_MISSION =
  'An identity-first compass. Connect internationally — lever languages, cultures, and potentials across borders.'
export const UTAMADUNI_SHARE = '5%'
export const UTAMADUNI_AMOUNT = 'KES 50'
export const REFERRAL_BONUS = 'KES 5,000'

// ── Contact ──────────────────────────────────────────────────────
export const CONTACT = {
  email: 'hello@bekenya.com',
  emailBusiness: 'services4xor@gmail.com',
  emailPrivacy: 'privacy@bekenya.com',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  social: '@bekenya',
  socialPlatforms: 'Twitter/X · LinkedIn · Instagram',
  location: country?.name === 'Kenya' ? 'Nairobi, Kenya' : `${country?.name ?? 'Global'}`,
  locationDetail: 'Westlands, CBD',
  responseTime: '24 hours',
  businessHours: 'Monday–Friday, 8am–6pm EAT',
} as const

// ── Legal ────────────────────────────────────────────────────────
export const LEGAL = {
  companyName: `${BRAND_NAME} Family Ltd`,
  privacyLastUpdated: 'March 2024',
  copyrightYear: new Date().getFullYear(),
} as const

// ── Referral ─────────────────────────────────────────────────────
export const REFERRAL = {
  mockLink: 'https://bekenya.com/ref/JK2024',
  bonus: REFERRAL_BONUS,
  paymentMethod: 'M-Pesa',
  paymentDays: 7,
  steps: [
    {
      n: 1,
      title: 'Share your link',
      desc: 'Copy your unique referral link and share it with friends seeking Paths.',
    },
    {
      n: 2,
      title: 'Friend signs up',
      desc: 'Your friend creates a free account using your referral link.',
    },
    {
      n: 3,
      title: 'Friend gets placed',
      desc: `When your friend gets placed through ${BRAND_NAME}, the countdown starts.`,
    },
    {
      n: 4,
      title: `You earn ${REFERRAL_BONUS}`,
      desc: 'M-Pesa payment lands in your account within 7 days. 🎉',
    },
  ],
  stats: [
    { value: '3,200+', label: 'Pioneers placed' },
    { value: 'KES 16M+', label: 'Bonuses paid out' },
    { value: '99%', label: 'On-time payments' },
  ],
} as const

// ── Mock Profile ─────────────────────────────────────────────────
export const MOCK_PROFILE = {
  name: 'John Kamau',
  email: 'john@example.com',
  phone: '0712345678',
  country: country?.name ?? 'Kenya',
  city: 'Nairobi',
  bio: '',
  headline: '',
  linkedin: '',
} as const

// ── Payment Providers (visual badges) ────────────────────────────
export const PAYMENT_BADGES = [
  { name: 'M-Pesa', color: '#00A651' },
  { name: 'Stripe', color: '#635BFF' },
  { name: 'Flutterwave', color: '#F5A623' },
  { name: 'PayPal', color: '#003087' },
] as const

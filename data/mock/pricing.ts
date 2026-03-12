/**
 * Pricing Data — single source of truth
 *
 * Business model (D6 decision):
 * - Pioneers: FREE (browse, apply, get matched)
 * - Anchors: Freemium (1 free Basic path, paid for Featured/Premium)
 * - Agents: 10% commission on successful placements
 * - Experiences: 10% platform commission on booking price
 *
 * Used by: pricing page, path posting wizard, payment flows
 */

import type { PricingPlan, PaymentMethodInfo } from '@/types/domain'

// ── Business Model Constants ──────────────────────────────────────────

/** Platform commission rates */
export const COMMISSION_RATES = {
  /** Agent earns this % of placement fee on successful forward → placement */
  agent: 0.1,
  /** Platform takes this % on experience/venture bookings */
  experienceBooking: 0.1,
  /** Micro-donation per transaction (in local currency smallest unit) */
  impactDonation: {
    KE: { amount: 50, currency: 'KES', label: 'KES 50' },
    DE: { amount: 200, currency: 'EUR', label: '€2' },
    CH: { amount: 200, currency: 'CHF', label: 'CHF 2' },
    TH: { amount: 70, currency: 'THB', label: '฿70' },
  } as Record<string, { amount: number; currency: string; label: string }>,
} as const

/** Free tier limits for Anchors */
export const FREE_TIER = {
  maxPaths: 1,
  pathDuration: 30, // days
  maxChapters: 50,
} as const

// ── Anchor Pricing Plans (multi-currency) ────────────────────────────

/** Prices per currency — values in smallest display unit */
const PLAN_PRICES = {
  basic: { KES: 0, EUR: 0, CHF: 0, THB: 0, USD: 0 },
  featured: { KES: 2000, EUR: 29, CHF: 29, THB: 990, USD: 29 },
  premium: { KES: 5000, EUR: 99, CHF: 99, THB: 3490, USD: 99 },
} as const

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Basic',
    price: 0,
    currency: 'KES',
    usd: 0,
    icon: 'Briefcase',
    color: 'gray',
    description: 'Start hiring for free — 1 active Path',
    features: [
      '1 active Path post (30 days)',
      'Standard placement in Compass',
      'Up to 50 Chapters',
      'Email notifications',
      'BeNetwork branding on post',
    ],
    cta: 'Post for Free',
    popular: false,
  },
  {
    name: 'Featured',
    price: 2000,
    currency: 'KES',
    usd: 29,
    icon: 'Star',
    color: 'maroon',
    description: 'Stand out and attract 3× more qualified Pioneers',
    features: [
      '3 featured Path posts (45 days)',
      'Top of Compass results',
      'Unlimited Chapters',
      'SMS + email notifications',
      'Anchor logo displayed',
      'Highlighted in sector feed',
      'Social media boost via BeNetwork',
      'Agent network distribution',
    ],
    cta: 'Go Featured',
    popular: true,
  },
  {
    name: 'Premium',
    price: 5000,
    currency: 'KES',
    usd: 99,
    icon: 'Crown',
    color: 'gold',
    description: 'Maximum visibility + dedicated support',
    features: [
      '10 premium Path posts (60 days)',
      'Homepage banner placement',
      'Unlimited Chapters',
      'Dedicated support channel',
      'CV screening assistance',
      'WhatsApp + Telegram alerts',
      'Analytics dashboard',
      'Featured in newsletter',
      'International reach (all countries)',
      'Priority Agent matching',
    ],
    cta: 'Go Premium',
    popular: false,
  },
]

/** Get plan price for a specific currency */
export function getPlanPrice(plan: 'basic' | 'featured' | 'premium', currencyCode: string): number {
  const prices = PLAN_PRICES[plan]
  return prices[currencyCode as keyof typeof prices] ?? prices.USD
}

/** Format plan price with currency symbol */
export function formatPlanPrice(
  plan: 'basic' | 'featured' | 'premium',
  currencyCode: string,
  freeLabel = 'Free'
): string {
  const price = getPlanPrice(plan, currencyCode)
  if (price === 0) return freeLabel
  const conv = CURRENCY_CONVERSIONS[currencyCode]
  if (!conv) return `$${price}`
  return `${conv.symbol} ${price.toLocaleString()}/mo`
}

/** Currency selector options for pricing UI */
export const CURRENCY_OPTIONS = [
  { code: 'KES', flag: '🇰🇪', label: 'KES' },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR' },
  { code: 'CHF', flag: '🇨🇭', label: 'CHF' },
  { code: 'THB', flag: '🇹🇭', label: 'THB' },
  { code: 'USD', flag: '🇺🇸', label: 'USD' },
] as const

/** Map plan name to i18n CTA key */
export const PLAN_CTA_KEY: Record<string, string> = {
  Basic: 'pricing.postFree',
  Featured: 'pricing.goFeatured',
  Premium: 'pricing.goPremium',
}

// ── Payment Methods ──────────────────────────────────────────────────

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  { name: 'M-Pesa', flag: '🇰🇪', desc: 'Kenya, Tanzania, Uganda' },
  { name: 'Airtel Money', flag: '🌍', desc: 'East & Central Africa' },
  { name: 'Stripe', flag: '💳', desc: 'USA, UK, EU, CH (cards + SEPA)' },
  { name: 'Flutterwave', flag: '🌊', desc: 'Nigeria, Ghana, Africa' },
  { name: 'PayPal', flag: '🌐', desc: 'Worldwide' },
  { name: 'USSD', flag: '📱', desc: 'No smartphone needed' },
  { name: 'TWINT', flag: '🇨🇭', desc: 'Switzerland mobile payments' },
  { name: 'PromptPay', flag: '🇹🇭', desc: 'Thailand instant transfers' },
]

/** Price multipliers relative to KES base prices */
export const CURRENCY_CONVERSIONS: Record<string, { symbol: string; rate: number; code: string }> =
  {
    KES: { symbol: 'KES', rate: 1, code: 'KES' },
    EUR: { symbol: '€', rate: 0.0067, code: 'EUR' },
    CHF: { symbol: 'CHF', rate: 0.0072, code: 'CHF' },
    THB: { symbol: '฿', rate: 0.24, code: 'THB' },
    USD: { symbol: '$', rate: 0.0072, code: 'USD' },
    GBP: { symbol: '£', rate: 0.0058, code: 'GBP' },
    NGN: { symbol: '₦', rate: 11.2, code: 'NGN' },
    AED: { symbol: 'AED', rate: 0.026, code: 'AED' },
  }

/** Payment methods available per country code */
export const COUNTRY_PAYMENT_METHODS: Record<string, string[]> = {
  KE: ['M-Pesa', 'Airtel Money', 'USSD'],
  DE: ['Stripe', 'PayPal'],
  CH: ['Stripe', 'TWINT', 'PayPal'],
  TH: ['PromptPay', 'Stripe'],
  NG: ['Flutterwave', 'USSD'],
  GB: ['Stripe', 'PayPal'],
  US: ['Stripe', 'PayPal'],
  AE: ['Stripe', 'PayPal'],
}

/**
 * Mock Pricing Data — single source of truth
 *
 * Used by: pricing page, path posting wizard
 */

import type { PricingPlan, PaymentMethodInfo } from '@/types/domain'

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Basic',
    price: 500,
    currency: 'KES',
    usd: 4,
    icon: 'Briefcase',
    color: 'gray',
    description: 'Perfect for Anchors posting occasionally',
    features: [
      '1 active Path post (30 days)',
      'Standard placement',
      'Up to 50 Chapters',
      'Email notifications',
      'Pay via M-Pesa',
    ],
    cta: 'Post for KES 500',
    popular: false,
  },
  {
    name: 'Featured',
    price: 2000,
    currency: 'KES',
    usd: 15,
    icon: 'Star',
    color: 'maroon',
    description: 'Stand out and attract 3× more qualified Pioneers',
    features: [
      '1 featured Path post (45 days)',
      'Top of Compass results',
      'Unlimited Chapters',
      'SMS + email notifications',
      'Anchor logo displayed',
      'Highlighted in sector',
      'Social media boost',
    ],
    cta: 'Post Featured — KES 2,000',
    popular: true,
  },
  {
    name: 'Premium',
    price: 5000,
    currency: 'KES',
    usd: 37,
    icon: 'Crown',
    color: 'gold',
    description: 'Maximum visibility for serious hiring needs',
    features: [
      '3 premium Path posts (60 days)',
      'Homepage banner placement',
      'Unlimited Chapters',
      'Dedicated support',
      'CV screening assistance',
      'WhatsApp alerts',
      'Analytics dashboard',
      'Featured in newsletter',
      'International reach',
    ],
    cta: 'Go Premium — KES 5,000',
    popular: false,
  },
]

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  { name: 'M-Pesa', flag: '🇰🇪', desc: 'Kenya, Tanzania, Uganda' },
  { name: 'Airtel Money', flag: '🌍', desc: 'East & Central Africa' },
  { name: 'Stripe', flag: '💳', desc: 'USA, UK, EU (cards)' },
  { name: 'Flutterwave', flag: '🌊', desc: 'Nigeria, Ghana, Africa' },
  { name: 'PayPal', flag: '🌐', desc: 'Worldwide' },
  { name: 'USSD', flag: '📱', desc: 'No smartphone needed' },
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
  DE: ['SEPA', 'Stripe'],
  CH: ['SEPA', 'Stripe'],
  TH: ['PromptPay', 'Stripe'],
  NG: ['Flutterwave', 'USSD'],
  GB: ['Stripe', 'PayPal'],
  US: ['Stripe', 'PayPal'],
  AE: ['Stripe', 'PayPal'],
}

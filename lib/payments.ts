/**
 * Payment Plug System — Country-aware payment abstraction
 *
 * Each country has its own payment methods (M-Pesa for KE, SEPA for DE,
 * Stripe for US, Flutterwave for NG). This module provides a unified
 * interface so the UI doesn't need to know which provider is active.
 *
 * Architecture:
 *   PaymentPlug (interface) → MpesaPlug, StripePlug, FlutterwavePlug
 *   getPaymentPlug('KE') → MpesaPlug
 *   getPaymentPlug('DE') → StripePlug
 *
 * When a new country launches, add its plug here. Zero UI changes needed.
 */

import type { CountryCode } from '@/lib/countries'

// ─── Core types ──────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface PaymentRequest {
  /** Amount in smallest currency unit (cents, shillings) */
  amount: number
  /** ISO currency code */
  currency: string
  /** What this payment is for */
  description: string
  /** Internal reference (e.g. 'chapter-123', 'booking-456') */
  reference: string
  /** Payer identifier (phone for M-Pesa, email for Stripe) */
  payerIdentifier: string
  /** Additional metadata */
  metadata?: Record<string, string>
}

export interface PaymentResult {
  /** Payment provider's transaction ID */
  transactionId: string
  /** Current status */
  status: PaymentStatus
  /** Provider-specific message */
  message: string
  /** Amount charged */
  amount: number
  /** Currency charged */
  currency: string
  /** Provider name for receipts */
  provider: string
}

export interface PaymentPlug {
  /** Provider identifier */
  id: string
  /** Human-readable name */
  name: string
  /** Supported currencies */
  currencies: string[]
  /** Whether this provider requires a phone number (M-Pesa) or email (Stripe) */
  identifierType: 'phone' | 'email' | 'account'
  /** Label for the identifier input */
  identifierLabel: string
  /** Placeholder for the identifier input */
  identifierPlaceholder: string
  /** Initiate a payment */
  initiate(request: PaymentRequest): Promise<PaymentResult>
  /** Check payment status */
  checkStatus(transactionId: string): Promise<PaymentResult>
  /** Format amount for display (e.g. "KES 5,000" or "€50.00") */
  formatAmount(amount: number): string
}

// ─── M-Pesa Plug (Kenya) ─────────────────────────────────────────────────────

const mpesaPlug: PaymentPlug = {
  id: 'mpesa',
  name: 'M-Pesa',
  currencies: ['KES'],
  identifierType: 'phone',
  identifierLabel: 'M-Pesa Phone Number',
  identifierPlaceholder: '0712345678',

  async initiate(request) {
    // In production, calls lib/mpesa.ts initiateStkPush()
    // For now, return mock success
    return {
      transactionId: `MPESA-${Date.now()}`,
      status: 'processing' as PaymentStatus,
      message: 'STK Push sent to your phone. Enter your M-Pesa PIN.',
      amount: request.amount,
      currency: 'KES',
      provider: 'M-Pesa',
    }
  },

  async checkStatus(transactionId) {
    return {
      transactionId,
      status: 'completed' as PaymentStatus,
      message: 'Payment confirmed',
      amount: 0,
      currency: 'KES',
      provider: 'M-Pesa',
    }
  },

  formatAmount(amount) {
    return `KES ${amount.toLocaleString('en-KE')}`
  },
}

// ─── Stripe Plug (International) ─────────────────────────────────────────────

const stripePlug: PaymentPlug = {
  id: 'stripe',
  name: 'Card Payment',
  currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
  identifierType: 'email',
  identifierLabel: 'Email Address',
  identifierPlaceholder: 'your@email.com',

  async initiate(request) {
    // In production, creates Stripe Checkout session
    return {
      transactionId: `STRIPE-${Date.now()}`,
      status: 'pending' as PaymentStatus,
      message: 'Redirecting to secure payment...',
      amount: request.amount,
      currency: request.currency,
      provider: 'Stripe',
    }
  },

  async checkStatus(transactionId) {
    return {
      transactionId,
      status: 'completed' as PaymentStatus,
      message: 'Payment confirmed',
      amount: 0,
      currency: 'USD',
      provider: 'Stripe',
    }
  },

  formatAmount(amount) {
    return `$${(amount / 100).toFixed(2)}`
  },
}

// ─── SEPA Plug (Germany / EU) ────────────────────────────────────────────────

const sepaPlug: PaymentPlug = {
  id: 'sepa',
  name: 'SEPA Bank Transfer',
  currencies: ['EUR'],
  identifierType: 'account',
  identifierLabel: 'IBAN',
  identifierPlaceholder: 'DE89 3704 0044 0532 0130 00',

  async initiate(request) {
    return {
      transactionId: `SEPA-${Date.now()}`,
      status: 'pending' as PaymentStatus,
      message: 'Bank transfer initiated. Funds arrive in 1-2 business days.',
      amount: request.amount,
      currency: 'EUR',
      provider: 'SEPA',
    }
  },

  async checkStatus(transactionId) {
    return {
      transactionId,
      status: 'completed' as PaymentStatus,
      message: 'Transfer received',
      amount: 0,
      currency: 'EUR',
      provider: 'SEPA',
    }
  },

  formatAmount(amount) {
    return `€${(amount / 100).toFixed(2)}`
  },
}

// ─── Flutterwave Plug (Nigeria) ──────────────────────────────────────────────

const flutterwavePlug: PaymentPlug = {
  id: 'flutterwave',
  name: 'Flutterwave',
  currencies: ['NGN'],
  identifierType: 'email',
  identifierLabel: 'Email Address',
  identifierPlaceholder: 'your@email.com',

  async initiate(request) {
    return {
      transactionId: `FLW-${Date.now()}`,
      status: 'pending' as PaymentStatus,
      message: 'Redirecting to Flutterwave...',
      amount: request.amount,
      currency: 'NGN',
      provider: 'Flutterwave',
    }
  },

  async checkStatus(transactionId) {
    return {
      transactionId,
      status: 'completed' as PaymentStatus,
      message: 'Payment confirmed',
      amount: 0,
      currency: 'NGN',
      provider: 'Flutterwave',
    }
  },

  formatAmount(amount) {
    return `₦${amount.toLocaleString('en-NG')}`
  },
}

// ─── Plug Registry ───────────────────────────────────────────────────────────

/** Country → primary payment plug mapping */
const COUNTRY_PLUGS: Record<string, PaymentPlug> = {
  KE: mpesaPlug,
  DE: sepaPlug,
  US: stripePlug,
  NG: flutterwavePlug,
  GB: stripePlug,
  CA: stripePlug,
  AU: stripePlug,
  AE: stripePlug,
  IN: stripePlug,
}

/** Country → all available plugs (primary + fallbacks) */
const COUNTRY_ALL_PLUGS: Record<string, PaymentPlug[]> = {
  KE: [mpesaPlug, stripePlug],
  DE: [sepaPlug, stripePlug],
  US: [stripePlug],
  NG: [flutterwavePlug, stripePlug],
  GB: [stripePlug],
  CA: [stripePlug],
  AU: [stripePlug],
  AE: [stripePlug],
  IN: [stripePlug],
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Get the primary payment plug for a country */
export function getPaymentPlug(countryCode: string): PaymentPlug {
  return COUNTRY_PLUGS[countryCode.toUpperCase()] ?? stripePlug
}

/** Get all available payment plugs for a country */
export function getPaymentPlugs(countryCode: string): PaymentPlug[] {
  return COUNTRY_ALL_PLUGS[countryCode.toUpperCase()] ?? [stripePlug]
}

/** Get the primary payment plug for the current deployment */
export function getCurrentPaymentPlug(): PaymentPlug {
  const cc = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase()
  return getPaymentPlug(cc)
}

/** Format an amount using the country's primary payment plug */
export function formatPayment(amount: number, countryCode?: string): string {
  const cc = countryCode ?? (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE')
  return getPaymentPlug(cc).formatAmount(amount)
}

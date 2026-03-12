/**
 * Pricing Service — static data with potential DB override
 *
 * Pricing plans and payment methods are currently static config
 * (no DB needed). This service wraps them to maintain the same
 * async pattern used by other services.
 */

import {
  PRICING_PLANS,
  PAYMENT_METHODS,
  COMMISSION_RATES,
  FREE_TIER,
  CURRENCY_CONVERSIONS,
  CURRENCY_OPTIONS,
  PLAN_CTA_KEY,
  COUNTRY_PAYMENT_METHODS,
  getPlanPrice,
  formatPlanPrice,
} from '@/data/mock/pricing'

export { CURRENCY_OPTIONS, PLAN_CTA_KEY }

export const pricingService = {
  /** Get all pricing plans */
  async getPlans() {
    return PRICING_PLANS
  },

  /** Get all payment methods */
  async getPaymentMethods() {
    return PAYMENT_METHODS
  },

  /** Get commission rates */
  getCommissionRates() {
    return COMMISSION_RATES
  },

  /** Get free tier limits */
  getFreeTier() {
    return FREE_TIER
  },

  /** Get plan price for a currency */
  getPlanPrice(plan: 'basic' | 'featured' | 'premium', currency: string) {
    return getPlanPrice(plan, currency)
  },

  /** Format plan price with symbol */
  formatPlanPrice(plan: 'basic' | 'featured' | 'premium', currency: string) {
    return formatPlanPrice(plan, currency)
  },

  /** Get currency conversion info */
  getCurrencyConversions() {
    return CURRENCY_CONVERSIONS
  },

  /** Get payment methods for a specific country */
  getCountryPaymentMethods(countryCode: string) {
    return COUNTRY_PAYMENT_METHODS[countryCode] ?? []
  },
}

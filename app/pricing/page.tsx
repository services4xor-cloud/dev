'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Star, Crown, Briefcase, Globe, Users, Zap } from 'lucide-react'
import {
  PRICING_PLANS,
  PAYMENT_METHODS,
  COMMISSION_RATES,
  FREE_TIER,
  formatPlanPrice,
} from '@/data/mock'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { COUNTRIES } from '@/lib/countries'

const ICON_MAP: Record<string, typeof Briefcase> = { Briefcase, Star, Crown }

const CURRENCY_OPTIONS = [
  { code: 'KES', flag: '🇰🇪', label: 'KES' },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR' },
  { code: 'CHF', flag: '🇨🇭', label: 'CHF' },
  { code: 'THB', flag: '🇹🇭', label: 'THB' },
  { code: 'USD', flag: '🇺🇸', label: 'USD' },
] as const

export default function PricingPage() {
  const { identity } = useIdentity()
  const { t } = useTranslation()

  // Default currency from identity's country config
  const countryConfig = COUNTRIES[identity.country as keyof typeof COUNTRIES]
  const defaultCurrency = countryConfig?.currency ?? 'USD'

  const [currency, setCurrency] = useState(defaultCurrency)

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-primary/30 text-brand-accent px-4 py-2 rounded-full text-sm font-medium mb-4 border border-brand-accent/20">
            <Globe className="w-4 h-4" />
            {t('pricing.badge') || 'Pay from anywhere — M-Pesa, SEPA, card, or mobile money'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl 3xl:text-6xl font-black text-white mb-4">
            {t('pricing.title') || 'Simple, transparent pricing'}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('pricing.subtitle') ||
              'Pioneers browse and apply for free. Anchors post Paths starting at zero cost. Scale when you need to.'}
          </p>

          {/* Currency selector */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {CURRENCY_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setCurrency(opt.code)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currency === opt.code
                    ? 'bg-brand-primary text-white border border-brand-accent/30'
                    : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {opt.flag} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => {
            const Icon = ICON_MAP[plan.icon] ?? Briefcase
            const planKey = plan.name.toLowerCase() as 'basic' | 'featured' | 'premium'
            const priceDisplay = formatPlanPrice(planKey, currency)

            return (
              <div
                key={plan.name}
                className={`bg-gray-900/60 rounded-2xl p-6 shadow-sm border-2 transition-transform hover:-translate-y-1 relative ${
                  plan.popular
                    ? 'border-brand-accent/50 shadow-lg shadow-brand-accent/5'
                    : 'border-brand-primary/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-bg text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    plan.popular ? 'bg-brand-primary/50' : 'bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${plan.popular ? 'text-brand-accent' : 'text-gray-400'}`}
                  />
                </div>

                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-gray-400 text-sm mt-1 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-3xl font-black text-white">{priceDisplay}</div>
                  <div className="text-gray-400 text-sm">
                    {planKey === 'basic' ? 'forever' : 'per month'}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-brand-accent' : 'text-green-500'}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/anchors/post-path?plan=${planKey}`}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-brand-primary text-white hover:bg-brand-primary-light border border-brand-accent/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Agent Commission */}
        <div className="bg-gray-900/60 rounded-2xl p-8 shadow-sm border border-brand-accent/20 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8 text-brand-accent" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                Agents earn {(COMMISSION_RATES.agent * 100).toFixed(0)}% commission
              </h2>
              <p className="text-gray-400">
                Forward Paths to your network via WhatsApp. When a Pioneer gets placed through your
                referral, you earn {(COMMISSION_RATES.agent * 100).toFixed(0)}% of the placement
                fee. No cap on earnings.
              </p>
            </div>
            <Link
              href="/agents"
              className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primary-light border border-brand-accent/30 transition-colors whitespace-nowrap"
            >
              Become an Agent →
            </Link>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-900/60 rounded-2xl p-8 shadow-sm border border-brand-primary/30 mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {t('pricing.paymentTitle') || 'Pay from anywhere in the world'}
            </h2>
            <p className="text-gray-400 mt-2">
              {t('pricing.paymentSubtitle') ||
                'We accept every major payment method so no one is excluded'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.name}
                className="text-center p-3 bg-gray-800/60 rounded-xl border border-gray-700/50"
              >
                <div className="text-2xl mb-1">{method.flag}</div>
                <div className="font-semibold text-white text-sm">{method.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{method.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* For Pioneers */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-light rounded-2xl p-8 text-white text-center border border-brand-accent/20">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">
            {t('pricing.pioneersTitle') || 'Pioneers — always free'}
          </h2>
          <p className="opacity-90 max-w-lg mx-auto mb-6">
            {t('pricing.pioneersDesc') ||
              `Creating a profile, opening Chapters, and getting placed is completely free for Pioneers. Always. Up to ${FREE_TIER.maxChapters} active Chapters.`}
          </p>
          <Link
            href="/signup?role=pioneer"
            className="bg-white text-brand-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors inline-block"
          >
            {t('pricing.pioneersCta') || 'Create Free Profile →'}
          </Link>
        </div>
      </div>
    </div>
  )
}

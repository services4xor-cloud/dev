'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Star, Crown, Briefcase, Globe, Users, Zap } from 'lucide-react'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { COUNTRIES } from '@/lib/countries'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'
import {
  PRICING_PLANS,
  PAYMENT_METHODS,
  COMMISSION_RATES,
  CURRENCY_OPTIONS,
  PLAN_CTA_KEY,
  formatPlanPrice,
} from '@/data/mock/pricing'

const ICON_MAP: Record<string, typeof Briefcase> = { Briefcase, Star, Crown }

export default function PricingPage() {
  const { identity } = useIdentity()
  const { t } = useTranslation()

  // Default currency from identity's country config
  const countryConfig = COUNTRIES[identity.country as keyof typeof COUNTRIES]
  const defaultCurrency = countryConfig?.currency ?? 'USD'

  const [currency, setCurrency] = useState(defaultCurrency)

  const agentRate = (COMMISSION_RATES.agent * 100).toFixed(0)

  return (
    <div className="min-h-screen bg-brand-bg">
      <SectionLayout size="md" ambient>
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-primary/30 text-brand-accent px-4 py-2 rounded-full text-phi-sm font-medium mb-4 border border-brand-accent/20">
            <Globe className="w-4 h-4" />
            {t('pricing.badge')}
          </div>
          <h1 className="text-phi-2xl sm:text-phi-3xl md:text-phi-4xl 3xl:text-phi-5xl font-black text-white mb-4 gradient-text">
            {t('pricing.title')}
          </h1>
          <p className="text-phi-xl text-gray-400 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5 mb-16 reveal-stagger">
          {PRICING_PLANS.map((plan) => {
            const Icon = ICON_MAP[plan.icon] ?? Briefcase
            const planKey = plan.name.toLowerCase() as 'basic' | 'featured' | 'premium'
            const priceDisplay = formatPlanPrice(planKey, currency, t('pricing.free'))

            return (
              <GlassCard
                key={plan.name}
                variant={plan.popular ? 'featured' : 'default'}
                hover
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-bg text-xs font-bold px-3 py-1 rounded-full">
                    {t('pricing.mostPopular')}
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

                <h3 className="text-phi-xl font-bold text-white">
                  {t(`pricing.plan${plan.name}`)}
                </h3>
                <p className="text-gray-400 text-phi-sm mt-1 mb-4">
                  {t(`pricing.desc${plan.name}`)}
                </p>

                <div className="mb-6">
                  <div className="text-phi-2xl font-black text-white">{priceDisplay}</div>
                  <div className="text-gray-400 text-phi-sm">
                    {planKey === 'basic' ? t('pricing.forever') : t('pricing.perMonth')}
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
                  href={`/exchange?plan=${planKey}`}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-brand-primary text-white hover:bg-brand-primary-light border border-brand-accent/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {t(PLAN_CTA_KEY[plan.name] ?? 'pricing.postFree')}
                </Link>
              </GlassCard>
            )
          })}
        </div>

        {/* Agent Commission */}
        <GlassCard variant="featured" padding="lg" className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-phi-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8 text-brand-accent" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-phi-xl font-bold text-white mb-2">
                {t('pricing.agentTitle', { rate: agentRate })}
              </h2>
              <p className="text-gray-400">{t('pricing.agentDesc', { rate: agentRate })}</p>
            </div>
            <Link
              href="/agents"
              className="bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primary-light border border-brand-accent/30 transition-colors whitespace-nowrap"
            >
              {t('pricing.agentCta')}
            </Link>
          </div>
        </GlassCard>

        {/* Payment Methods */}
        <GlassCard padding="lg" className="mb-16">
          <div className="text-center mb-6">
            <h2 className="text-phi-xl font-bold text-white">{t('pricing.paymentTitle')}</h2>
            <p className="text-gray-400 mt-2">{t('pricing.paymentSubtitle')}</p>
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
        </GlassCard>

        {/* For Pioneers */}
        <GlassCard variant="featured" padding="lg" className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-phi-xl font-bold text-white mb-2">{t('pricing.pioneersTitle')}</h2>
          <p className="opacity-90 max-w-lg mx-auto mb-6">{t('pricing.pioneersDesc')}</p>
          <Link
            href="/signup"
            className="bg-white text-brand-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors inline-block"
          >
            {t('pricing.pioneersCta')}
          </Link>
        </GlassCard>
      </SectionLayout>
    </div>
  )
}

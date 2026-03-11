'use client'

/**
 * Agent Landing Page — "Become a Be[Country] Agent"
 *
 * Explains the Agent model: real people who bridge Anchors and Pioneers.
 * CTA: Apply to become an Agent → /signup?role=AGENT
 */

import Link from 'next/link'
import {
  Send,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Smartphone,
  Shield,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { BRAND_NAME } from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'

export default function AgentLandingPage() {
  const { t } = useTranslation()

  const AGENT_STATS = [
    { label: t('agent.statAgents'), value: '200+', icon: Users },
    { label: t('agent.statPlacements'), value: '1,200+', icon: TrendingUp },
    { label: t('agent.statCountries'), value: '16', icon: MapPin },
    { label: t('agent.statCommission'), value: 'KES 15K', icon: DollarSign },
  ]

  const BENEFITS = [
    {
      icon: DollarSign,
      title: t('agent.benefit1Title'),
      description: t('agent.benefit1Desc'),
    },
    {
      icon: Smartphone,
      title: t('agent.benefit2Title'),
      description: t('agent.benefit2Desc'),
    },
    {
      icon: TrendingUp,
      title: t('agent.benefit3Title'),
      description: t('agent.benefit3Desc'),
    },
    {
      icon: Shield,
      title: t('agent.benefit4Title'),
      description: t('agent.benefit4Desc'),
    },
  ]

  const HOW_IT_WORKS = [
    { step: '1', title: t('agent.step1Title'), description: t('agent.step1Desc') },
    { step: '2', title: t('agent.step2Title'), description: t('agent.step2Desc') },
    { step: '3', title: t('agent.step3Title'), description: t('agent.step3Desc') },
    { step: '4', title: t('agent.step4Title'), description: t('agent.step4Desc') },
  ]

  const WHO_ITEMS = [
    t('agent.who1'),
    t('agent.who2'),
    t('agent.who3'),
    t('agent.who4'),
    t('agent.who5'),
    t('agent.who6'),
  ]

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section
        className="relative py-20 lg:py-28"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 40%)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
              {t('agent.badge')}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {t('agent.heroTitle', { brand: BRAND_NAME })}
            </h1>
            <p className="text-lg text-gray-300 mb-2">{t('agent.heroTagline')}</p>
            <p className="text-gray-400 mb-8 max-w-2xl">{t('agent.heroDesc')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup?role=AGENT"
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                {t('agent.applyCta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/agents/dashboard"
                className="flex items-center gap-2 px-6 py-3 border border-brand-accent/40 text-brand-accent rounded-xl text-sm font-medium hover:bg-brand-accent/10 transition-colors"
              >
                {t('agent.viewDemo')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENT_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-5 text-center"
                >
                  <Icon className="w-5 h-5 text-brand-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            {t('agent.howBadge')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{t('agent.howTitle')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            {t('agent.benefitsBadge')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            {t('agent.benefitsTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/30 border border-brand-accent/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Who can be an Agent */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            {t('agent.whoBadge')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{t('agent.whoTitle')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {WHO_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700"
              >
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 xl:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('agent.ctaTitle')}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            {t('agent.ctaDesc', { brand: BRAND_NAME })}
          </p>
          <Link
            href="/signup?role=AGENT"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-xl font-medium hover:opacity-90 transition-colors"
          >
            {t('agent.applyCta')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

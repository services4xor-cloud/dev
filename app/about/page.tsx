'use client'

/**
 * About — BeNetwork platform story, mission, values
 *
 * Dark theme. Full BeNetwork vocabulary. i18n-wired.
 * Global layout.tsx provides Nav + Footer — do NOT add them here.
 */

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Compass, Anchor } from 'lucide-react'
import { useJourney } from '@/lib/hooks/use-journey'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'
import {
  ABOUT_VALUES as VALUES,
  ABOUT_SECTORS as SECTORS,
  ABOUT_PAYMENT_METHODS as PAYMENT_METHODS,
  ABOUT_STATS as STATS,
  ABOUT_VOCAB_ITEMS as VOCAB_ITEMS,
  BRAND_NAME,
  IMPACT_PARTNER,
} from '@/data/mock'

export default function AboutPage() {
  const { completeAction } = useJourney()
  const { t } = useTranslation()

  // Track page visit for gamification
  useEffect(() => {
    completeAction('visit_about')
  }, [completeAction])

  return (
    <div className="bg-brand-bg text-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden py-28 px-4 text-center"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 70%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgb(var(--color-accent-rgb) / 0.13) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-accent-rgb) / 0.13) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-4xl 3xl:max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.svg"
              alt="BeNetwork"
              width={80}
              height={80}
              className="drop-shadow-2xl"
              unoptimized
            />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-sm font-medium mb-8">
            <Compass className="w-3.5 h-3.5" />
            {t('about.badge')}
          </div>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            {t('about.heroTitle')
              .replace('{accent}', '')
              .replace('{/accent}', '')
              .split('everyone.')
              .map((part, i) =>
                i === 0 ? (
                  <span key={i}>
                    {part}
                    <span style={{ color: 'var(--color-accent)' }}>everyone.</span>
                  </span>
                ) : null
              )}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('about.heroDesc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/compass"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                border: '1px solid rgb(var(--color-accent-rgb) / 0.38)',
              }}
            >
              <Compass className="w-5 h-5" />
              {t('about.startCompass')} →
            </Link>
            <Link
              href="/anchors/post-path"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10 transition-all"
            >
              <Anchor className="w-5 h-5" />
              {t('about.postPath')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <SectionLayout size="sm" ambient maxWidth="max-w-5xl 3xl:max-w-[1600px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-phi-5 reveal-stagger">
          {STATS.map((stat) => (
            <GlassCard key={stat.label} hover className="text-center">
              <div className="text-phi-2xl md:text-phi-3xl font-black text-brand-accent mb-2">
                {stat.value}
              </div>
              <div className="text-phi-sm text-gray-400">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Mission — golden ratio 61.8 / 38.2 column split */}
      <SectionLayout size="md">
        <div className="grid md:grid-cols-[1.618fr_1fr] gap-12 items-center">
          <div>
            <div className="text-phi-xs font-semibold uppercase tracking-widest text-brand-accent mb-4 flex items-center gap-2">
              <div className="w-8 h-px bg-brand-accent" /> {t('about.mission')}
            </div>
            <h2 className="text-phi-3xl md:text-phi-4xl font-bold mb-6 leading-tight">
              {t('about.missionTitle')
                .split('{accent}')
                .map((part, i) => {
                  if (i === 0) return <span key={i}>{part}</span>
                  const [accent, rest] = part.split('{/accent}')
                  return (
                    <span key={i}>
                      <span className="text-brand-accent">{accent}</span>
                      {rest}
                    </span>
                  )
                })}
            </h2>
            <p className="text-gray-300 text-phi-lg leading-relaxed mb-6">{t('about.missionP1')}</p>
            <p className="text-gray-400 leading-relaxed">{t('about.missionP2')}</p>
          </div>
          <div className="space-y-4">
            {VOCAB_ITEMS.map((item) => (
              <GlassCard
                key={item.label}
                variant="subtle"
                padding="sm"
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-primary/40 border border-brand-accent/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <div className="font-semibold text-white">{item.label}</div>
                  <div className="text-phi-sm text-gray-400">{item.desc}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* Values */}
      <SectionLayout size="md" maxWidth="max-w-5xl 3xl:max-w-[1600px]">
        <div className="text-center mb-12">
          <div className="text-phi-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            {t('about.valuesSubtitle')}
          </div>
          <h2 className="text-phi-2xl md:text-phi-3xl font-bold">{t('about.valuesTitle')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-phi-5 reveal-stagger">
          {VALUES.map((v) => (
            <GlassCard key={v.title} hover>
              <div className="w-10 h-10 rounded-xl bg-brand-primary/40 border border-brand-accent/20 flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <h3 className="font-bold text-phi-lg mb-2">{v.title}</h3>
              <p className="text-gray-400 text-phi-sm leading-relaxed">{v.desc}</p>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Sectors */}
      <SectionLayout size="md" maxWidth="max-w-5xl 3xl:max-w-[1600px]">
        <div className="text-center mb-10">
          <div className="text-phi-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            {t('about.sectors')}
          </div>
          <h2 className="text-phi-2xl md:text-phi-3xl font-bold">{t('about.sectorsTitle')}</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 reveal-stagger">
          {SECTORS.map((s) => (
            <GlassCard
              key={s.name}
              variant="subtle"
              hover
              padding="sm"
              className="flex flex-col items-center justify-center gap-2 text-center"
            >
              <span className="text-phi-xl">{s.emoji}</span>
              <span className="text-phi-xs text-gray-400 font-medium leading-tight">{s.name}</span>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Payment Rails */}
      <SectionLayout size="md" maxWidth="max-w-5xl 3xl:max-w-[1600px]">
        <div className="text-center mb-10">
          <div className="text-phi-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            {t('about.payments')}
          </div>
          <h2 className="text-phi-2xl font-bold mb-3">{t('about.paymentsTitle')}</h2>
          <p className="text-gray-400">{t('about.paymentsDesc')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 reveal-stagger">
          {PAYMENT_METHODS.map((p) => (
            <GlassCard
              key={p.name}
              variant="subtle"
              padding="sm"
              className="flex items-center gap-3"
            >
              <span className="text-phi-xl">{p.icon}</span>
              <div>
                <div className="font-semibold text-white text-phi-sm">{p.name}</div>
                <div className="text-phi-xs text-gray-400">{p.desc}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Impact Partner */}
      <SectionLayout size="sm" maxWidth="max-w-5xl 3xl:max-w-[1600px]">
        <GlassCard variant="featured" padding="lg" className="text-center">
          <div className="text-phi-2xl mb-3">🤲</div>
          <h3 className="text-phi-xl font-bold mb-3">{IMPACT_PARTNER.name}</h3>
          <p className="text-gray-300 max-w-xl mx-auto mb-6 text-phi-sm leading-relaxed">
            {t('about.impactDesc', { brand: BRAND_NAME })}
          </p>
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-phi-sm font-semibold text-brand-accent border border-brand-accent/40 hover:bg-brand-accent/10 transition-colors"
          >
            {t('about.learnImpact', { name: IMPACT_PARTNER.name })} →
          </Link>
        </GlassCard>
      </SectionLayout>

      {/* Final CTA */}
      <SectionLayout size="lg" maxWidth="max-w-3xl 3xl:max-w-5xl" className="text-center">
        <h2 className="text-phi-3xl md:text-phi-4xl font-bold mb-6">{t('about.ctaTitle')}</h2>
        <p className="text-gray-400 text-phi-lg mb-10">{t('about.ctaDesc')}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/compass"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              border: '1px solid rgb(var(--color-accent-rgb) / 0.38)',
            }}
          >
            <Compass className="w-5 h-5" />
            {t('about.startCompass')} →
          </Link>
          <Link
            href="/anchors/post-path"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold border border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10 transition-all text-lg"
          >
            <Anchor className="w-5 h-5" />
            {t('about.postPath')}
          </Link>
        </div>
      </SectionLayout>
    </div>
  )
}

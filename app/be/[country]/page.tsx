'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { COUNTRIES } from '@/lib/countries'
import { BRAND_NAME } from '@/lib/platform-config'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

type CountryConfig = (typeof COUNTRIES)[keyof typeof COUNTRIES]

// Sector emoji mapping — single source of truth in lib/emoji-map.ts
import { getSectorEmoji } from '@/lib/emoji-map'

function CountryStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-subtle rounded-xl p-phi-3 text-center">
      <div className="text-phi-xl font-bold text-brand-accent">{value}</div>
      <div className="text-phi-sm text-white/80 mt-1">{label}</div>
    </div>
  )
}

function PaymentBadge({ method }: { method: CountryConfig['paymentMethods'][number] }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/20">
      <span className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-xs font-bold text-stone-900">
        {method.logo.slice(0, 2)}
      </span>
      <span className="text-white text-sm font-medium">{method.name}</span>
    </div>
  )
}

function SectorCard({ sector }: { sector: CountryConfig['featuredSectors'][number] }) {
  const { t } = useTranslation()
  const emoji = sector.emoji || getSectorEmoji(sector.name)
  return (
    <Link
      href={`/exchange?sector=${sector.id}`}
      className="group glass-subtle rounded-xl p-phi-4 transition-all duration-200 hover:shadow-lg hover:shadow-brand-accent/10 hover:-translate-y-0.5"
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-white group-hover:text-brand-accent transition-colors">
        {sector.name}
      </h3>
      <p className="text-white/60 text-sm mt-1">
        {sector.count.toLocaleString('en-US')} {t('beCountry.openPaths')}
      </p>
      {sector.partnerName && (
        <p className="text-brand-accent/80 text-xs mt-2">
          {t('beCountry.partner', { name: sector.partnerName })}
        </p>
      )}
    </Link>
  )
}

export default function BeCountryPage() {
  const { t } = useTranslation()
  const params = useParams()
  const rawCode = typeof params.country === 'string' ? params.country.toUpperCase() : ''
  const countryKey = rawCode as keyof typeof COUNTRIES

  if (!countryKey || !(countryKey in COUNTRIES)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary to-[#2d1b00] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6">🌍</div>
          <h1 className="text-3xl font-bold text-brand-accent mb-4">
            {t('beCountry.comingSoonTitle')}
          </h1>
          <p className="text-white/70 mb-8 text-lg">
            {t('beCountry.comingSoonDesc', { brand: BRAND_NAME })}
          </p>
          <Link
            href="/be/ke"
            className="inline-block text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 text-lg"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              border: '1px solid rgb(var(--color-accent-rgb) / 0.40)',
            }}
          >
            {t('beCountry.goTo', { brand: BRAND_NAME })}
          </Link>
          <div className="mt-6">
            <Link
              href="/"
              className="text-brand-accent hover:text-brand-accent/80 underline text-sm"
            >
              Discover your path
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const country = COUNTRIES[countryKey]

  return (
    <div className="min-h-screen bg-brand-surface-elevated">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-gradient-to-br from-brand-primary via-[#3d0a0f] to-[#1a0505] flex flex-col items-center justify-center text-center px-4 py-20">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, var(--color-accent) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--color-accent) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Flag + Brand Name */}
          <div className="mb-6">
            <span className="text-7xl">{country.flag}</span>
          </div>
          <div className="text-brand-accent font-black text-phi-4xl md:text-phi-5xl tracking-tight mb-phi-3 gradient-text">
            {country.brandName}
          </div>

          {/* Hero tagline */}
          <h1 className="text-white text-phi-xl md:text-phi-3xl font-bold mb-phi-3 leading-phi-tight">
            {country.heroTagline}
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {country.heroSubtext}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/?from=${country.code}`}
              className="text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                border: '1px solid rgb(var(--color-accent-rgb) / 0.40)',
                boxShadow: '0 4px 20px rgb(var(--color-primary-rgb) / 0.30)',
              }}
            >
              Discover
            </Link>
            <Link
              href="/exchange"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/60 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
            >
              Exchange
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-[#2a0a10] border-y border-white/10 py-phi-6 px-4 ambient-glow">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-phi-3 reveal-stagger">
          {country.statsBar.map((stat, i) => (
            <CountryStatCard key={i} label={stat.label} value={stat.value} />
          ))}
        </div>
      </section>

      {/* ── PAYMENT METHODS ──────────────────────────────────────────────── */}
      <section className="py-phi-7 px-4 bg-brand-surface-elevated">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-brand-accent font-bold text-phi-xl md:text-phi-2xl mb-2">
            {t('beCountry.payTitle')}
          </h2>
          <p className="text-white/60 mb-8">{t('beCountry.payDesc')}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {country.paymentMethods.map((method) => (
              <PaymentBadge key={method.id} method={method} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SECTORS ─────────────────────────────────────────────── */}
      <section className="py-phi-7 px-4 bg-gradient-to-b from-brand-surface-elevated to-[#0d0507]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-phi-6">
            <h2 className="text-white font-bold text-phi-xl md:text-phi-2xl mb-2">
              {t('beCountry.sectorsTitle', { country: country.name })}
            </h2>
            <p className="text-white/60">{t('beCountry.sectorsDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-phi-3 reveal-stagger">
            {country.featuredSectors.map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SEARCHES ─────────────────────────────────────────────── */}
      <section className="py-phi-7 px-4 bg-[#0d0507]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white font-bold text-phi-xl md:text-phi-2xl mb-2">
            {t('beCountry.popularTitle')}
          </h2>
          <p className="text-white/60 mb-8">
            {t('beCountry.popularDesc', { country: country.name })}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {country.popularSearches.map((search) => (
              <Link
                key={search}
                href={`/exchange?q=${encodeURIComponent(search)}`}
                className="bg-brand-primary/60 hover:bg-brand-primary border border-brand-accent/30 hover:border-brand-accent text-white hover:text-brand-accent px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CROSS-ROUTES SECTION ─────────────────────────────────────────── */}
      <section className="py-phi-8 px-4 bg-gradient-to-br from-brand-primary/40 to-[#1a0505] border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-phi-3xl mb-phi-3">🧭</div>
          <h2 className="text-brand-accent font-bold text-phi-xl md:text-phi-2xl mb-3">
            {t('beCountry.crossTitle', { country: country.name })}
          </h2>
          <p className="text-white/70 text-lg mb-8">{t('beCountry.crossDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-brand-accent hover:bg-brand-accent/80 text-stone-900 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105"
            >
              Discover
            </Link>
            <Link
              href="/exchange"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
            >
              Browse Exchange
            </Link>
          </div>

          {/* Other country links */}
          <div className="mt-12">
            <p className="text-white/40 text-sm mb-4">{t('beCountry.exploreOther')}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.keys(COUNTRIES)
                .filter((code) => code !== rawCode)
                .map((code) => {
                  const cfg = COUNTRIES[code as keyof typeof COUNTRIES]
                  return (
                    <Link
                      key={code}
                      href={`/be/${code.toLowerCase()}`}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm transition-all"
                    >
                      {cfg.flag} {cfg.brandName}
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

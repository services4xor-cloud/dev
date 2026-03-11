'use client'

// THE BEKENYA HOME — Identity-first landing
// "Find where you belong. Go there."
// Autodetect country, emotional, end-user-centric, BeNetwork vocabulary

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { PIONEER_TYPES, type PioneerType } from '@/lib/vocabulary'
import { detectCountryFromTimezone } from '@/lib/geo'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { hasCompletedOnboarding, getVenturesUrl } from '@/lib/identity-flags'
import { SAFARI_PACKAGES, formatPackagePrice } from '@/lib/safari-packages'
import { useIdentity } from '@/lib/identity-context'
import { COUNTRIES, type CountryCode } from '@/lib/countries'
import IdentitySwitcher from '@/components/IdentitySwitcher'
import {
  COUNTRY_GREETINGS,
  ROTATING_FLAGS,
  BENETWORK_PILLARS,
  TESTIMONIALS,
  BE_COUNTRIES,
  BRAND_NAME,
  BRAND_MISSION,
  IMPACT_PARTNER,
  PAYMENT_BADGES,
} from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'

// ─── Derived Data ─────────────────────────────────────────────────────────────

const EXPERIENCE_PACKAGES = SAFARI_PACKAGES.slice(0, 3)

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [detectedCountry, setDetectedCountry] = useState<string>('DEFAULT')
  const [flagIndex, setFlagIndex] = useState(0)
  const [heroIdentityOpen, setHeroIdentityOpen] = useState(false)
  const heroIdentityRef = useRef<HTMLDivElement>(null)

  // Identity context — drives all dynamic content on the page
  const { identity, countryName, brandName, localizeCountry } = useIdentity()
  const { t } = useTranslation()
  const countryConfig = COUNTRIES[identity.country as CountryCode]

  // Rotate background flags
  useEffect(() => {
    const timer = setInterval(() => {
      setFlagIndex((i) => (i + 1) % ROTATING_FLAGS.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  // Close hero identity dropdown on outside click
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (heroIdentityRef.current && !heroIdentityRef.current.contains(e.target as Node)) {
        setHeroIdentityOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  // Detect country via timezone heuristic (uses canonical COUNTRY_OPTIONS)
  useEffect(() => {
    const code = detectCountryFromTimezone()
    if (code !== 'KE') setDetectedCountry(code)
    else setDetectedCountry('KE')
  }, [])

  // Use identity context for country-aware content, with timezone fallback
  const activeCountry = identity.country || detectedCountry
  const geo = COUNTRY_GREETINGS[activeCountry] || COUNTRY_GREETINGS.DEFAULT
  const detectedOption = COUNTRY_OPTIONS.find((c) => c.code === activeCountry)
  const activeImpactPartner = countryConfig?.impactPartner ?? IMPACT_PARTNER
  const activeSectors = countryConfig?.featuredSectors ?? []
  const activeStatsBar = countryConfig?.statsBar ?? []
  const isReturning = typeof window !== 'undefined' && hasCompletedOnboarding()
  const compassHref = isReturning
    ? getVenturesUrl()
    : `/compass${activeCountry !== 'DEFAULT' ? `?from=${activeCountry}` : ''}`

  return (
    <div className="bg-brand-bg text-white overflow-x-hidden">
      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[100vh] flex items-center">
        {/* Dark gradient background: maroon → near-black */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 40%, var(--color-bg) 100%)',
          }}
        />

        {/* Animated flag blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div
            key={flagIndex}
            className="text-[22rem] opacity-5 transition-all duration-700 blur-sm"
            style={{ lineHeight: 1 }}
          >
            {ROTATING_FLAGS[flagIndex]}
          </div>
        </div>

        {/* Gold glow top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, rgb(var(--color-accent-rgb) / 0.18) 0%, transparent 70%)',
          }}
        />
        {/* Maroon glow sides */}
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgb(var(--color-primary-rgb) / 0.25)' }}
        />

        <div className="relative max-w-5xl 3xl:max-w-7xl mx-auto px-4 py-28 3xl:py-40 text-center">
          {/* Compass rose logo — clickable identity switcher */}
          <div className="relative inline-block mb-8" ref={heroIdentityRef}>
            <button
              type="button"
              onClick={() => setHeroIdentityOpen((v) => !v)}
              aria-expanded={heroIdentityOpen}
              aria-haspopup="menu"
              aria-label={`${brandName} — Choose your identity`}
              data-testid="hero-identity-trigger"
              className="group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
                         focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg rounded-2xl
                         px-6 py-4 hover:bg-white/5 transition-all duration-200 rounded-xl"
            >
              <Image
                src="/logo.svg"
                width={80}
                height={80}
                alt=""
                priority
                unoptimized
                aria-hidden="true"
                className="mx-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              {/* Brand name + chevron */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-2xl md:text-3xl font-bold tracking-tight">
                  <span style={{ color: 'var(--color-accent)' }}>Be</span>
                  <span className="text-white">{brandName.replace(/^Be/, '')}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-accent/50 transition-transform duration-200 ${heroIdentityOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </div>
            </button>

            {/* Identity dropdown — positioned centered below logo */}
            {heroIdentityOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50">
                <IdentitySwitcher
                  open={heroIdentityOpen}
                  onClose={() => setHeroIdentityOpen(false)}
                />
              </div>
            )}
          </div>

          {/* Geo greeting chip */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-gray-200 mb-8 border"
            style={{
              background: 'rgb(var(--color-accent-rgb) / 0.08)',
              borderColor: 'rgb(var(--color-accent-rgb) / 0.25)',
            }}
          >
            <span className="text-xl">{geo.flag}</span>
            <span>
              {t('hero.greeting', {
                geoName: geo.name,
                geoGreeting: `${geo.greeting} ${t('hero.readyChapter')}`,
              })}
            </span>
          </div>

          {/* Main headline — driven by identity context + language */}
          <h1 className="font-display text-5xl md:text-7xl xl:text-8xl 3xl:text-9xl font-bold leading-[1.1] mb-6">
            <span className="text-white">
              {t(`hero.tagline.${identity.country}`) !== `hero.tagline.${identity.country}`
                ? t(`hero.tagline.${identity.country}`)
                : t('hero.headline')}
            </span>
            <br />
            <span style={{ color: 'var(--color-accent)' }}>{t('hero.belong')}</span>
            <br />
            <span style={{ color: 'var(--color-accent)' }}>{t('hero.goThere')}</span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle', { brandName })}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/compass"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-bold text-lg rounded-full px-10 py-4 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                boxShadow: '0 8px 32px rgb(var(--color-primary-rgb) / 0.40)',
                border: '1px solid rgb(var(--color-accent-rgb) / 0.40)',
              }}
            >
              <span>{t('hero.startCompass')}</span>
              <span>&#8594;</span>
            </Link>
            <Link
              href="/ventures"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-lg rounded-full px-10 py-4 transition-all border hover:scale-[1.02] active:scale-[0.98]"
              style={{
                color: 'var(--color-accent)',
                borderColor: 'rgb(var(--color-accent-rgb) / 0.50)',
                background: 'rgb(var(--color-accent-rgb) / 0.08)',
              }}
            >
              <span>{t('hero.browseVentures')}</span>
            </Link>
          </div>

          {/* Thin gold decorative line */}
          <div
            className="mx-auto mb-8 h-px w-48"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--color-accent), transparent)',
            }}
          />

          {/* Tiny trust line — country-aware impact partner */}
          <p className="text-gray-400 text-sm">
            {t('hero.pioneersTrust')} ·{' '}
            <span className="font-medium" style={{ color: 'var(--color-accent)' }}>
              {t('hero.everyBooking', { amount: activeImpactPartner.contributionAmount })}
            </span>{' '}
            {t('hero.fundsCommunity', { partner: activeImpactPartner.name })}
          </p>

          {/* Gold dot pulse at bottom center */}
          <div className="mt-12 flex justify-center">
            <span className="relative flex h-3 w-3">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: 'var(--color-accent)' }}
              />
              <span
                className="relative inline-flex rounded-full h-3 w-3"
                style={{ background: 'var(--color-accent)' }}
              />
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT IS THE BENETWORK ─────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-accent)' }}
            >
              {t('network.label')}
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              {t('network.headline')}
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto">{t('network.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 3xl:gap-8">
            {BENETWORK_PILLARS.map((pillar) => (
              <div
                key={pillar.for}
                className="rounded-3xl p-8 flex flex-col border"
                style={{
                  background: 'rgb(var(--color-primary-rgb) / 0.20)',
                  borderColor: 'rgb(var(--color-accent-rgb) / 0.30)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 border"
                  style={{
                    background: 'var(--color-primary)',
                    borderColor: 'rgb(var(--color-accent-rgb) / 0.50)',
                  }}
                >
                  {pillar.icon}
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {pillar.for}
                </div>
                <div className="text-gray-400 text-xs mb-4">{pillar.subtitle}</div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">{pillar.desc}</p>
                <Link
                  href={pillar.href}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl px-5 py-3 transition-all hover:scale-[1.02] active:scale-[0.98] w-full"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                    border: '1px solid rgb(var(--color-accent-rgb) / 0.30)',
                    boxShadow: '0 4px 16px rgb(var(--color-primary-rgb) / 0.25)',
                  }}
                >
                  {pillar.cta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. COMPASS CTA — Unified entry into the Compass wizard ──────────── */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-brand-bg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-800/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center">
            {/* Compass icon */}
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl border"
              style={{
                background: 'var(--color-primary)',
                borderColor: 'rgb(var(--color-accent-rgb) / 0.50)',
              }}
            >
              🧭
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {t('compass.headline')}
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">{t('compass.subtitle')}</p>

            {/* How it works — visual steps */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 text-xs md:text-sm">
              {[
                { num: 1, label: t('compass.step1') },
                { num: 2, label: t('compass.step2') },
                { num: 3, label: t('compass.step3') },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 md:gap-3">
                  {i > 0 && <span className="text-gray-700 hidden sm:inline">&#8594;</span>}
                  <span
                    className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      borderColor: 'rgb(var(--color-accent-rgb) / 0.50)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {s.num}
                  </span>
                  <span className="text-gray-300">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Auto-detected origin hint */}
            {detectedOption && (
              <p className="text-gray-500 text-sm mb-6">
                <span className="text-lg mr-1">{detectedOption.flag}</span>
                {t('compass.originHint', { country: detectedOption.name })}
              </p>
            )}

            <Link
              href={compassHref}
              className="inline-flex items-center justify-center gap-3 text-white font-bold text-lg rounded-full px-12 py-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                border: '1px solid rgb(var(--color-accent-rgb) / 0.40)',
                boxShadow: '0 8px 24px rgb(var(--color-primary-rgb) / 0.35)',
              }}
            >
              <span>{t('hero.startCompass')}</span>
              <span className="text-xl">&#10148;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. EXPERIENCES STRIP (identity-driven) ────────────────────────────── */}
      {activeCountry === 'KE' && (
        <section className="py-24 bg-gradient-to-b from-brand-bg to-brand-primary/20">
          <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
            <div className="text-center mb-12">
              <p className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
                {t('experiences.label', { country: countryConfig?.name ?? 'Safari' })}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                {t('experiences.headline', { country: countryName })}
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                {t('experiences.subtitle', { brandName })}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {EXPERIENCE_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-gray-900 border border-white/10 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-transform"
                >
                  {/* Image placeholder with gradient */}
                  <div className="h-44 bg-gradient-to-br from-brand-primary to-[#2a0a0f] flex items-center justify-center relative">
                    <span className="text-6xl opacity-60">
                      {pkg.type === 'deep_sea_fishing'
                        ? '🐟'
                        : pkg.type === 'wildlife_safari'
                          ? '🦁'
                          : '🌿'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-accent bg-brand-accent/10 rounded-full px-3 py-1">
                        {pkg.duration}
                      </span>
                      <span className="text-xs text-gray-400">{pkg.destination}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-1">{pkg.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {pkg.highlights[0]} · {pkg.highlights[1]}
                    </p>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div
                            className="font-bold text-xl"
                            style={{ color: 'var(--color-accent)' }}
                          >
                            {formatPackagePrice(pkg)}
                          </div>
                          {pkg.priceNote && (
                            <div className="text-gray-400 text-xs">{pkg.priceNote}</div>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/experiences/${pkg.id}`}
                        className="block w-full text-center text-sm font-bold text-white rounded-xl px-4 py-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                          border: '1px solid rgb(var(--color-accent-rgb) / 0.35)',
                          boxShadow: '0 4px 16px rgb(var(--color-primary-rgb) / 0.3)',
                        }}
                      >
                        {t('experiences.book')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. IMPACT PARTNER BANNER ─────────────────────────────────────────── */}
      <section
        className="py-phi-7 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, #2a0a0f 50%, var(--color-bg) 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.15),transparent)]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Gold accent left border strip */}
          <div
            className="border-l-4 pl-8 mb-8 text-center md:text-left"
            style={{ borderColor: 'var(--color-accent)' }}
          >
            <div className="text-4xl mb-4">&#127807;</div>
            <h2
              className="font-display text-2xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              {t('impact.headline', { partner: activeImpactPartner.name })}
            </h2>
            <p className="text-white text-lg mb-2 max-w-2xl">
              {activeImpactPartner.fullName} — {activeImpactPartner.tagline}
            </p>
            <p className="font-bold text-xl mb-8" style={{ color: 'var(--color-accent)' }}>
              {t('impact.contribution', { amount: activeImpactPartner.contributionAmount })}
            </p>
            <div className="flex flex-wrap items-center gap-8 mb-8 text-white text-sm">
              {activeImpactPartner.pillars.map((pillar, i) => (
                <span key={pillar}>
                  {['🏫', '🌿', '👥', '🎭'][i % 4]} {pillar}
                </span>
              ))}
            </div>
            <Link
              href={activeImpactPartner.url || '/charity'}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-full px-8 py-3 transition-colors"
            >
              {t('impact.learnMore', { partner: activeImpactPartner.name })}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. BECOUNTRY EXPANSION ───────────────────────────────────────────── */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('network.label')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            {t('expansion.headline', { brandName })}
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">{t('expansion.subtitle')}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {BE_COUNTRIES.map((c) => (
              <div
                key={c.name}
                className={`flex items-center gap-3 rounded-2xl px-6 py-4 border transition-all ${
                  c.status === 'live'
                    ? 'bg-brand-primary/30 border-brand-accent/40 text-white'
                    : 'bg-gray-900 border-white/5 text-gray-400'
                }`}
              >
                <span className="text-2xl">{c.flag}</span>
                {/* Lion circle badge */}
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm border shrink-0"
                  style={{
                    background: 'var(--color-primary)',
                    borderColor: 'rgb(var(--color-accent-rgb) / 0.60)',
                  }}
                  title="BeNetwork"
                >
                  🦁
                </span>
                <div className="text-left">
                  <div className="font-bold text-sm">{c.name}</div>
                  <div
                    className={`text-xs ${c.status === 'live' ? 'text-brand-accent' : 'text-gray-600'}`}
                  >
                    {c.status === 'live' ? t('expansion.live') : t('expansion.coming')}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-2xl px-6 py-4 border border-white/5 bg-gray-900 text-gray-600">
              <span className="text-2xl">+</span>
              <div className="text-left">
                <div className="font-bold text-sm text-gray-400">{t('expansion.more')}</div>
                <div className="text-xs text-gray-700">{t('expansion.every')}</div>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            {BE_COUNTRIES.filter((c) => c.status !== 'live')
              .slice(0, 5)
              .map((c) => c.name)
              .join(' · ')}{' '}
            · and beyond
          </p>
        </div>
      </section>

      {/* ── 7. ANCHOR SECTION ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-brand-bg to-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">&#127970;</div>
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-3">
            {t('anchors.label')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            {t('anchors.headline')}
          </h2>
          <p className="text-gray-400 text-lg mb-4 max-w-2xl mx-auto">{t('anchors.subtitle')}</p>
          <p className="text-gray-400 mb-10">
            Post a Path. Find Pioneers. Pay with{' '}
            {countryConfig?.paymentMethods
              .slice(0, 2)
              .map((p) => p.name)
              .join(', ') || 'M-Pesa, Stripe'}
            .{' '}
            <strong className="text-white">
              From {countryConfig?.currencySymbol ?? 'KES'}{' '}
              {identity.country === 'DE' || identity.country === 'CH' ? '25' : '500'}.
            </strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/anchors/post-path"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-bold rounded-full px-10 py-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                border: '1px solid rgb(var(--color-accent-rgb) / 0.40)',
                boxShadow: '0 8px 24px rgb(var(--color-primary-rgb) / 0.35)',
              }}
            >
              {t('anchors.postPath')} &#8594;
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-brand-accent/30 hover:border-brand-accent/50 text-white font-bold rounded-full px-10 py-4 transition-all"
            >
              {t('anchors.howItWorks')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="text-center mb-14">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-accent)' }}
            >
              {t('testimonials.label')}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              {t('testimonials.headline')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-gray-800/40 border border-white/5 rounded-3xl p-7 flex flex-col"
              >
                <div
                  className="text-4xl font-display mb-4"
                  style={{ color: 'var(--color-accent)' }}
                >
                  &ldquo;
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${t.avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">
                      {t.name} {t.flag}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {t.from} · {t.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. PAYMENT TRUST STRIP ──────────────────────────────────────────── */}
      <section className="py-12 bg-brand-bg border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
            {t('payments.label')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {PAYMENT_BADGES.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
                  style={{ backgroundColor: p.color + '22', border: `1px solid ${p.color}44` }}
                >
                  <span style={{ color: p.color }}>{p.name[0]}</span>
                </div>
                <span className="text-gray-400 font-semibold text-sm">{p.name}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-xs mt-6">{t('payments.secure')}</p>
        </div>
      </section>
    </div>
  )
}

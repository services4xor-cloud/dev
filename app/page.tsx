'use client'

// THE BEKENYA HOME — Identity-first landing
// "Find where you belong. Go there."
// Autodetect country, emotional, end-user-centric, BeNetwork vocabulary

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { VOCAB, PIONEER_TYPES, type PioneerType } from '@/lib/vocabulary'
import { SAFARI_PACKAGES, formatPackagePrice } from '@/lib/safari-packages'

// ─── Data ─────────────────────────────────────────────────────────────────────

const COUNTRY_GREETINGS: Record<string, { greeting: string; flag: string; name: string }> = {
  KE: { greeting: 'Habari! Ready for your next chapter?', flag: '🇰🇪', name: 'Kenya' },
  DE: { greeting: 'Guten Tag! Ready for your next chapter?', flag: '🇩🇪', name: 'Germany' },
  US: { greeting: 'Hello! Ready for your next chapter?', flag: '🇺🇸', name: 'the USA' },
  NG: { greeting: 'Ẹ káàárọ̀! Ready for your next chapter?', flag: '🇳🇬', name: 'Nigeria' },
  GB: { greeting: 'Good day! Ready for your next chapter?', flag: '🇬🇧', name: 'the UK' },
  AE: { greeting: 'Marhaba! Ready for your next chapter?', flag: '🇦🇪', name: 'UAE' },
  UG: { greeting: 'Wassuwa! Ready for your next chapter?', flag: '🇺🇬', name: 'Uganda' },
  TZ: { greeting: 'Karibu! Ready for your next chapter?', flag: '🇹🇿', name: 'Tanzania' },
  DEFAULT: { greeting: 'Ready for your next chapter?', flag: '🌍', name: 'your country' },
}

const ROTATING_FLAGS = ['🇰🇪', '🇩🇪', '🇺🇸', '🇳🇬', '🇬🇧', '🇦🇪', '🇺🇬', '🇹🇿', '🇫🇷', '🇨🇦', '🇦🇺', '🇸🇦']

const BENETWORK_PILLARS = [
  {
    icon: '🌿',
    for: 'For Pioneers',
    subtitle: '(That\'s you, if you\'re seeking)',
    desc: 'Find your path. Cross a border. Become something remarkable. Your compass is ready.',
    cta: 'Start My Journey',
    href: '/compass',
    gradient: 'from-[#5C0A14] to-[#3a0710]',
    accent: 'text-[#C9A227]',
  },
  {
    icon: '🏢',
    for: 'For Anchors',
    subtitle: '(Organizations that open doors)',
    desc: 'Find real talent. Grow with Africa. Post a Path and watch Pioneers find you.',
    cta: 'Post a Path',
    href: '/anchors/post-path',
    gradient: 'from-[#5C0A14] to-[#3a0710]',
    accent: 'text-[#C9A227]',
  },
  {
    icon: '🦁',
    for: 'For Explorers',
    subtitle: '(Safaris, marine, eco-experiences)',
    desc: 'Kenya\'s wildest ventures — deep sea fishing, Maasai Mara, Tsavo. Book an experience that changes you.',
    cta: 'Browse Ventures',
    href: '/ventures',
    gradient: 'from-[#5C0A14] to-[#3a0710]',
    accent: 'text-[#C9A227]',
  },
]

const FROM_COUNTRIES = ['Kenya', 'Nigeria', 'Uganda', 'Tanzania', 'South Africa', 'Ghana', 'Ethiopia', 'Germany', 'UK', 'USA']
const TO_COUNTRIES = ['UAE', 'UK', 'Germany', 'USA', 'Canada', 'Kenya', 'Saudi Arabia', 'Qatar', 'Australia', 'Singapore']
const PIONEER_TYPE_OPTIONS = Object.entries(PIONEER_TYPES).map(([key, val]) => ({
  value: key,
  label: `${val.icon} ${val.label}`,
}))

const FEATURED_VENTURES = [
  {
    type: 'safari',
    icon: '🦁',
    tag: 'Experience',
    title: 'Maasai Mara Classic',
    subtitle: '3 Days · 2 Nights · Big 5 guaranteed',
    price: '$520/person',
    detail: 'Orpul Safaris Camp · All inclusive',
    cta: 'Open This Chapter',
    href: '/ventures/maasai-mara-3day',
    gradient: 'from-amber-950 to-yellow-900',
    tagColor: 'bg-yellow-500 text-yellow-950',
  },
  {
    type: 'professional',
    icon: '💼',
    tag: 'Path',
    title: 'Safari Lodge Manager',
    subtitle: 'Sarova Group · Nairobi & Mara',
    price: 'KES 180,000/mo',
    detail: 'Open to international Pioneers · Housing included',
    cta: 'Open This Chapter',
    href: '/ventures?type=professional',
    gradient: 'from-gray-900 to-gray-800',
    tagColor: 'bg-[#5C0A14] text-[#C9A227] border border-[#C9A227]/30',
  },
  {
    type: 'professional',
    icon: '💻',
    tag: 'Path',
    title: 'Senior Software Pioneer',
    subtitle: 'Safaricom · Nairobi · Remote Eligible',
    price: 'KES 350,000/mo',
    detail: 'M-Pesa team · 5+ years exp · Relocation support',
    cta: 'Open This Chapter',
    href: '/ventures?type=tech',
    gradient: 'from-slate-900 to-blue-950',
    tagColor: 'bg-gray-700 text-[#C9A227] border border-[#C9A227]/20',
  },
]

const EXPERIENCE_PACKAGES = SAFARI_PACKAGES.slice(0, 3)

const TESTIMONIALS = [
  {
    name: 'Wanjiru N.',
    flag: '🇰🇪',
    from: 'Nairobi → Maasai Mara',
    type: 'Explorer Pioneer',
    quote:
      'I found my path as an eco-lodge guide through BeKenya. Now I lead safaris for German tourists and earn more than I ever thought possible.',
    avatar: 'WN',
    avatarBg: 'bg-green-600',
  },
  {
    name: 'Baraka O.',
    flag: '🇰🇪',
    from: 'Nairobi → Dubai',
    type: 'Professional Pioneer',
    quote:
      'From Nairobi to Dubai — BeKenya matched me with a hospitality group in 3 weeks. The compass knew exactly where I belonged.',
    avatar: 'BO',
    avatarBg: 'bg-[#5C0A14]',
  },
  {
    name: 'Aisha M.',
    flag: '🇸🇦',
    from: 'NGO Anchor',
    type: 'Healthcare Anchor',
    quote:
      'As an NGO anchor, we found 4 healthcare pioneers in one week. BeKenya understands what real talent looks like.',
    avatar: 'AM',
    avatarBg: 'bg-gray-700',
  },
]

const BE_COUNTRIES = [
  { flag: '🇰🇪', name: 'BeKenya', status: 'live', href: '/' },
  { flag: '🇩🇪', name: 'BeGermany', status: 'soon', href: '#' },
  { flag: '🇺🇸', name: 'BeAmerica', status: 'soon', href: '#' },
  { flag: '🇳🇬', name: 'BeNigeria', status: 'soon', href: '#' },
  { flag: '🇬🇧', name: 'BeUK', status: 'soon', href: '#' },
  { flag: '🇦🇪', name: 'BeUAE', status: 'soon', href: '#' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [detectedCountry, setDetectedCountry] = useState<string>('DEFAULT')
  const [flagIndex, setFlagIndex] = useState(0)
  const [compassFrom, setCompassFrom] = useState('')
  const [compassTo, setCompassTo] = useState('')
  const [compassType, setCompassType] = useState('')

  // Rotate background flags
  useEffect(() => {
    const timer = setInterval(() => {
      setFlagIndex((i) => (i + 1) % ROTATING_FLAGS.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  // Try to detect country via timezone heuristic (no external API needed)
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz.includes('Nairobi') || tz.includes('Africa/Nairobi')) setDetectedCountry('KE')
      else if (tz.includes('Berlin') || tz.includes('Europe/Berlin')) setDetectedCountry('DE')
      else if (tz.includes('Lagos') || tz.includes('Africa/Lagos')) setDetectedCountry('NG')
      else if (tz.includes('London') || tz.includes('Europe/London')) setDetectedCountry('GB')
      else if (tz.includes('New_York') || tz.includes('America/')) setDetectedCountry('US')
      else if (tz.includes('Dubai') || tz.includes('Asia/Dubai')) setDetectedCountry('AE')
      else if (tz.includes('Kampala')) setDetectedCountry('UG')
      else if (tz.includes('Dar_es_Salaam')) setDetectedCountry('TZ')
    } catch {
      // silent fail — DEFAULT stays
    }
  }, [])

  const geo = COUNTRY_GREETINGS[detectedCountry] || COUNTRY_GREETINGS.DEFAULT

  const compassParams = new URLSearchParams()
  if (compassFrom) compassParams.set('from', compassFrom)
  if (compassTo) compassParams.set('to', compassTo)
  if (compassType) compassParams.set('type', compassType)
  const compassHref = `/compass${compassParams.toString() ? '?' + compassParams.toString() : ''}`

  return (
    <div className="bg-gray-950 text-white overflow-x-hidden">

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[100vh] flex items-center">
        {/* Dark gradient background: maroon → near-black */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 40%, #0A0A0F 100%)' }} />

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(201,162,39,0.18) 0%, transparent 70%)' }} />
        {/* Maroon glow sides */}
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(92,10,20,0.25)' }} />

        <div className="relative max-w-5xl 3xl:max-w-7xl mx-auto px-4 py-28 3xl:py-40 text-center">

          {/* Compass rose logo */}
          <Image
            src="/logo.svg"
            width={100}
            height={100}
            alt=""
            priority
            unoptimized
            aria-hidden="true"
            className="mx-auto mb-6 drop-shadow-2xl"
          />

          {/* Geo greeting chip */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-gray-200 mb-8 border" style={{ background: 'rgba(201,162,39,0.08)', borderColor: 'rgba(201,162,39,0.25)' }}>
            <span className="text-xl">{geo.flag}</span>
            <span>We see you&apos;re in {geo.name}. {geo.greeting}</span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-5xl md:text-7xl xl:text-8xl 3xl:text-9xl font-bold leading-[1.1] mb-6">
            <span className="text-white">Find where you</span>
            <br />
            <span style={{ color: '#C9A227' }}>belong.</span>
            <br />
            <span style={{ color: '#C9A227' }}>Go there.</span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            BeKenya is not a job board. It&apos;s a compass — for Pioneers who want to move, grow, and belong somewhere extraordinary.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/compass"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-bold text-lg rounded-full px-10 py-4 transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', boxShadow: '0 8px 32px rgba(92,10,20,0.40)', border: '1px solid rgba(201,162,39,0.40)' }}
            >
              <span>Start My Compass</span>
              <span>&#8594;</span>
            </Link>
            <Link
              href="/ventures"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-lg rounded-full px-10 py-4 transition-all border"
              style={{ color: '#C9A227', borderColor: '#C9A227', background: 'transparent' }}
            >
              <span>Browse Ventures</span>
            </Link>
          </div>

          {/* Thin gold decorative line */}
          <div className="mx-auto mb-8 h-px w-48" style={{ background: 'linear-gradient(to right, transparent, #C9A227, transparent)' }} />

          {/* Tiny trust line */}
          <p className="text-gray-600 text-sm">
            Pioneers active today ·{' '}
            <span className="font-medium" style={{ color: '#C9A227' }}>KES 50 from every booking</span>{' '}
            funds UTAMADUNI community work
          </p>

          {/* Gold dot pulse at bottom center */}
          <div className="mt-12 flex justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#C9A227' }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: '#C9A227' }} />
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT IS THE BENETWORK ─────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#0A0A0F' }}>
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A227' }}>
              The BeNetwork
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Three kinds of people. One network.
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto">
              No jargon. No CVs rotting in inboxes. Just Pioneers, Anchors, and Explorers — finding each other.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 3xl:gap-8">
            {BENETWORK_PILLARS.map((pillar) => (
              <div
                key={pillar.for}
                className="rounded-3xl p-8 flex flex-col border"
                style={{ background: 'rgba(92,10,20,0.20)', borderColor: 'rgba(201,162,39,0.30)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 border"
                  style={{ background: '#5C0A14', borderColor: 'rgba(201,162,39,0.50)' }}
                >
                  {pillar.icon}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#C9A227' }}>
                  {pillar.for}
                </div>
                <div className="text-gray-400 text-xs mb-4">{pillar.subtitle}</div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">{pillar.desc}</p>
                <Link
                  href={pillar.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full px-5 py-2 transition-colors w-fit"
                >
                  {pillar.cta} &#8594;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. LIVE COMPASS PREVIEW ──────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A227' }}>Live Compass</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Where are you? Where do you want to be?
            </h2>
            <p className="text-gray-400">
              Tell us your journey. We&apos;ll show you the route.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* FROM */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  I am in
                </label>
                <select
                  value={compassFrom}
                  onChange={(e) => setCompassFrom(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                >
                  <option value="">Select country...</option>
                  {FROM_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* TO */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  I want to go to
                </label>
                <select
                  value={compassTo}
                  onChange={(e) => setCompassTo(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                >
                  <option value="">Select destination...</option>
                  {TO_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* PIONEER TYPE */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  I am a
                </label>
                <select
                  value={compassType}
                  onChange={(e) => setCompassType(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                >
                  <option value="">Pioneer type...</option>
                  {PIONEER_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-3 mb-8 text-xs text-gray-500">
              <span className={`flex items-center gap-1 ${compassFrom ? 'text-[#C9A227]' : 'text-gray-500'}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${compassFrom ? 'border-[#C9A227] text-[#C9A227]' : 'border-gray-600 text-gray-600'}`}>1</span>
                Where you are
              </span>
              <span className="text-gray-700">&#8594;</span>
              <span className={`flex items-center gap-1 ${compassTo ? 'text-[#C9A227]' : 'text-gray-500'}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${compassTo ? 'border-[#C9A227] text-[#C9A227]' : 'border-gray-600 text-gray-600'}`}>2</span>
                Where you&apos;re going
              </span>
              <span className="text-gray-700">&#8594;</span>
              <span className={`flex items-center gap-1 ${compassType ? 'text-[#C9A227]' : 'text-gray-500'}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${compassType ? 'border-[#C9A227] text-[#C9A227]' : 'border-gray-600 text-gray-600'}`}>3</span>
                Who you are
              </span>
            </div>

            <Link
              href={compassHref}
              className="inline-flex items-center gap-3 text-white font-bold text-base rounded-full px-8 py-4 transition-all shadow-lg hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', border: '1px solid rgba(201,162,39,0.40)', boxShadow: '0 8px 24px rgba(92,10,20,0.35)' }}
            >
              <span>Show My Route</span>
              <span className="text-xl">&#10148;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED VENTURES ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A227' }}>Featured Ventures</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                Open chapters waiting for you.
              </h2>
            </div>
            <Link
              href="/ventures"
              className="hidden md:inline-flex text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: '#C9A227' }}
            >
              All Ventures &#8594;
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_VENTURES.map((v) => (
              <div
                key={v.title}
                className={`bg-gradient-to-br ${v.gradient} rounded-3xl p-6 border border-white/5 flex flex-col`}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl">{v.icon}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1 ${v.tagColor}`}>
                    {v.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-1">{v.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{v.subtitle}</p>
                <p className="text-xs text-gray-500 mb-4">{v.detail}</p>
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-bold" style={{ color: '#C9A227' }}>{v.price}</span>
                  <Link
                    href={v.href}
                    className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
                  >
                    {VOCAB.chapter_open}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. EXPERIENCES STRIP (Safari) ────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-amber-950/30">
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="text-center mb-12">
            <p className="text-yellow-500 text-sm font-semibold uppercase tracking-widest mb-3">Safari Experiences</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Kenya waits for no one. Neither should you.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Three signature experiences. Deep sea. Open savanna. The world-famous Mara.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {EXPERIENCE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-gray-900 border border-white/10 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-transform"
              >
                {/* Image placeholder with gradient */}
                <div className="h-44 bg-gradient-to-br from-amber-900 to-yellow-950 flex items-center justify-center relative">
                  <span className="text-6xl opacity-60">
                    {pkg.type === 'deep_sea_fishing' ? '🐟' : pkg.type === 'wildlife_safari' ? '🦁' : '🌿'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-400/10 rounded-full px-3 py-1">
                      {pkg.duration}
                    </span>
                    <span className="text-xs text-gray-500">{pkg.destination}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {pkg.highlights[0]} · {pkg.highlights[1]}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg" style={{ color: '#C9A227' }}>{formatPackagePrice(pkg)}</div>
                      {pkg.priceNote && (
                        <div className="text-gray-600 text-xs">{pkg.priceNote}</div>
                      )}
                    </div>
                    <Link
                      href={`/ventures/${pkg.id}`}
                      className="text-sm font-semibold text-white rounded-full px-4 py-2 transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', border: '1px solid rgba(201,162,39,0.35)' }}
                    >
                      Book This Venture
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. UTAMADUNI BANNER ──────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5C0A14 0%, #2a0a0f 50%, #0A0A0F 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.15),transparent)]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Gold accent left border strip */}
          <div className="border-l-4 pl-8 mb-8 text-center md:text-left" style={{ borderColor: '#C9A227' }}>
            <div className="text-4xl mb-4">&#127807;</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4" style={{ color: '#C9A227' }}>
              Every venture supports UTAMADUNI
            </h2>
            <p className="text-white text-lg mb-2 max-w-2xl">
              Kenya&apos;s community development CBO — education, conservation, women&apos;s empowerment.
            </p>
            <p className="font-bold text-xl mb-8" style={{ color: '#C9A227' }}>
              KES 50 from every booking. Automatically. Always.
            </p>
            <div className="flex flex-wrap items-center gap-8 mb-8 text-white text-sm">
              <span>&#127979; Education for rural children</span>
              <span>&#127807; Wildlife conservation</span>
              <span>&#128101; Women&apos;s empowerment cooperatives</span>
            </div>
            <Link
              href="/charity"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-full px-8 py-3 transition-colors"
            >
              Learn about UTAMADUNI &#8594;
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. BECOUNTRY EXPANSION ───────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#C9A227' }}>The BeNetwork</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            BeKenya is just the beginning.
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Same mission. Every country. Every community.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {BE_COUNTRIES.map((c) => (
              <div
                key={c.name}
                className={`flex items-center gap-3 rounded-2xl px-6 py-4 border transition-all ${
                  c.status === 'live'
                    ? 'bg-[#5C0A14]/30 border-[#C9A227]/40 text-white'
                    : 'bg-gray-900 border-white/5 text-gray-500'
                }`}
              >
                <span className="text-2xl">{c.flag}</span>
                {/* Lion circle badge */}
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm border shrink-0"
                  style={{ background: '#5C0A14', borderColor: 'rgba(201,162,39,0.60)' }}
                  title="BeNetwork"
                >
                  🦁
                </span>
                <div className="text-left">
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className={`text-xs ${c.status === 'live' ? 'text-[#C9A227]' : 'text-gray-600'}`}>
                    {c.status === 'live' ? 'Live now' : 'Coming soon'}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-2xl px-6 py-4 border border-white/5 bg-gray-900 text-gray-600">
              <span className="text-2xl">+</span>
              <div className="text-left">
                <div className="font-bold text-sm text-gray-500">More coming</div>
                <div className="text-xs text-gray-700">Every country</div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            BeGermany · BeAmerica · BeNigeria · BeUK · BeUAE · and beyond
          </p>
        </div>
      </section>

      {/* ── 8. PIONEER TYPES ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A227' }}>Pioneer Types</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Which Pioneer are you?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Six paths. One compass. Every direction leads somewhere remarkable.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {(Object.entries(PIONEER_TYPES) as [PioneerType, typeof PIONEER_TYPES[PioneerType]][]).map(([key, pt]) => (
              <Link
                key={key}
                href={`/compass?type=${key}`}
                className="group bg-gray-800/50 hover:bg-gray-800 border border-white/5 hover:border-[#C9A227]/30 rounded-2xl p-6 transition-all"
              >
                <div className="text-4xl mb-3">{pt.icon}</div>
                <h3 className="font-display font-bold text-white mb-1 group-hover:text-[#C9A227] transition-colors">
                  {pt.label}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{pt.description}</p>
                <div className="flex flex-wrap gap-1">
                  {pt.sectors.slice(0, 2).map((s) => (
                    <span key={s} className="text-[10px] bg-white/5 rounded-full px-2 py-0.5 text-gray-400">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/compass"
              className="inline-flex items-center gap-2 text-white font-bold rounded-full px-8 py-4 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', border: '1px solid rgba(201,162,39,0.40)', boxShadow: '0 8px 24px rgba(92,10,20,0.35)' }}
            >
              Find My Pioneer Type &#8594;
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. ANCHOR SECTION ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">&#127970;</div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-3">For Organizations</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Are you an Anchor?
          </h2>
          <p className="text-gray-400 text-lg mb-4 max-w-2xl mx-auto">
            Organizations that open paths for Pioneers. Safari lodges, tech companies, NGOs, hospitals — any Anchor that believes real talent changes everything.
          </p>
          <p className="text-gray-500 mb-10">
            Post a Path. Find Pioneers. Pay with M-Pesa, Stripe, or Flutterwave. <strong className="text-white">From KES 500.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/anchors/post-path"
              className="inline-flex items-center gap-2 text-white font-bold rounded-full px-10 py-4 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', border: '1px solid rgba(201,162,39,0.40)', boxShadow: '0 8px 24px rgba(92,10,20,0.35)' }}
            >
              Post a Path &#8594;
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-full px-10 py-4 transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A227' }}>Pioneer Stories</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Real journeys. Real chapters.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-gray-800/40 border border-white/5 rounded-3xl p-7 flex flex-col"
              >
                <div className="text-4xl font-display mb-4" style={{ color: '#C9A227' }}>&ldquo;</div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name} {t.flag}</div>
                    <div className="text-gray-500 text-xs">{t.from} · {t.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. PAYMENT TRUST STRIP ──────────────────────────────────────────── */}
      <section className="py-12 bg-gray-950 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
            Pay with what you know
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { name: 'M-Pesa', color: '#00A651', symbol: 'M' },
              { name: 'Stripe', color: '#635BFF', symbol: 'S' },
              { name: 'Flutterwave', color: '#F5A623', symbol: 'F' },
              { name: 'PayPal', color: '#003087', symbol: 'P' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
                  style={{ backgroundColor: p.color + '22', border: `1px solid ${p.color}44` }}
                >
                  <span style={{ color: p.color }}>{p.symbol}</span>
                </div>
                <span className="text-gray-400 font-semibold text-sm">{p.name}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-xs mt-6">All transactions are secure and transparent</p>
        </div>
      </section>

    </div>
  )
}

'use client'

/**
 * Compass — Smart Route Wizard
 *
 * 4-step flow:
 *   Step 1: Country Priority Selector (ordered multi-select + proximity clustering)
 *   Step 2: Origin confirmation (where you are now)
 *   Step 3: Pioneer type (what kind of Pioneer are you?)
 *   Step 4: Route result (matched corridor + open paths)
 *
 * Country data lives in lib/country-selector.ts — do NOT define it here.
 * Pioneer types live in lib/vocabulary.ts — do NOT redefine here.
 */

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CountryPrioritySelector from '@/components/CountryPrioritySelector'
import { PIONEER_TYPES, PioneerType, VOCAB } from '@/lib/vocabulary'
import { SkeletonLine, SkeletonBlock } from '@/components/Skeleton'
import { COUNTRY_OPTIONS, CORRIDOR_BADGE, type CountryOption } from '@/lib/country-selector'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { useJourney } from '@/lib/hooks/use-journey'

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

const ORIGIN_COUNTRIES = COUNTRY_OPTIONS.filter((c) =>
  ['KE', 'NG', 'GH', 'UG', 'TZ', 'ZA', 'DE', 'GB', 'IN', 'US', 'AE', 'CA'].includes(c.code)
)

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CompassPage() {
  const searchParams = useSearchParams()
  const fromParam = searchParams.get('from') ?? ''
  const { identity } = useIdentity()
  const { t } = useTranslation()
  const { completeAction } = useJourney()
  const compassCompletedRef = useRef(false)

  const STEP_LABELS = [
    t('compass.stepLabel1'),
    t('compass.stepLabel2'),
    t('compass.stepLabel3'),
    t('compass.stepLabel4'),
  ]

  // Pre-fill origin: URL param → identity context → deployment default
  const deployDefault = process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE'
  const initialOrigin =
    (fromParam && COUNTRY_OPTIONS.find((c) => c.code === fromParam.toUpperCase())) ||
    COUNTRY_OPTIONS.find((c) => c.code === identity.country) ||
    COUNTRY_OPTIONS.find((c) => c.code === deployDefault)!

  const [step, setStep] = useState<Step>(1)
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
  const [origin, setOrigin] = useState<CountryOption>(initialOrigin)
  const [pioneerType, setPioneerType] = useState<PioneerType | null>(null)
  const [showOriginPicker, setShowOriginPicker] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Track compass completion for gamification when user reaches results (step 4)
  useEffect(() => {
    if (step === 4 && !compassCompletedRef.current) {
      compassCompletedRef.current = true
      completeAction('use_compass')
    }
  }, [step, completeAction])

  const primaryDestination = COUNTRY_OPTIONS.find((c) => c.code === selectedDestinations[0]) ?? null

  function handleDestinationsComplete(codes: string[]) {
    setSelectedDestinations(codes)
    setStep(2)
  }

  function handlePioneerSelect(type: PioneerType) {
    setPioneerType(type)
    setStep(4)
  }

  function handleReset() {
    setStep(1)
    setSelectedDestinations([])
    setPioneerType(null)
    setShowOriginPicker(false)
  }

  const displaySectors = (() => {
    if (!primaryDestination || !pioneerType) return []
    const relevant = primaryDestination.topSectors.filter((sector) =>
      PIONEER_TYPES[pioneerType].sectors.some((ps) =>
        sector.toLowerCase().includes(ps.toLowerCase().split(' ')[0].toLowerCase())
      )
    )
    return (relevant.length > 0 ? relevant : primaryDestination.topSectors).slice(0, 3)
  })()

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div
        className="pt-16 pb-8 text-center px-4"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 60%)',
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
          </span>
          {t('compass.active')}
        </div>
        <div className="flex justify-center mb-5">
          <Image
            src="/logo.svg"
            alt="BeNetwork Compass"
            width={64}
            height={64}
            className="opacity-90"
            unoptimized
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl font-bold text-white mb-3 leading-tight">
          {t('compass.ready')}
          <br />
          <span className="text-brand-accent">{t('compass.letsFind')}</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">{VOCAB.tagline}</p>
      </div>

      {/* Step progress bar */}
      <div className="max-w-3xl 3xl:max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-start">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                {/* Circle + label column */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step > s
                        ? 'bg-brand-accent text-brand-bg'
                        : step === s
                          ? 'bg-brand-primary text-brand-accent border border-brand-accent/60'
                          : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap transition-colors duration-300 ${
                      step >= s ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {/* Connector line */}
                {s < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 mt-4 -translate-y-1/2 transition-all duration-300 ${step > s ? 'bg-brand-accent' : 'bg-gray-800'}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl 3xl:max-w-5xl mx-auto px-4 pb-48">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <SkeletonBlock h="h-16" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonBlock key={i} h="h-20" />
              ))}
            </div>
            <SkeletonLine w="w-40" h="h-10" className="mx-auto" />
          </div>
        ) : (
          <>
            {/* STEP 1 — Country priority selector */}
            {step === 1 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <CountryPrioritySelector
                  originCode={origin.code}
                  onComplete={handleDestinationsComplete}
                />
              </div>
            )}

            {/* STEP 2 — Origin confirmation */}
            {step === 2 && (
              <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
                <div className="bg-gray-900/80 border border-brand-primary/30 rounded-2xl p-phi-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/50 flex items-center justify-center text-xl">
                      🌍
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {t('compass.stepOf', { step: '2', total: '4' })}
                      </div>
                      <div className="text-white font-semibold text-lg">
                        {t('compass.whereAre')}
                      </div>
                    </div>
                  </div>

                  {!showOriginPicker ? (
                    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{origin.flag}</span>
                        <div>
                          <div className="text-white font-medium">
                            {t('compass.currentlyIn', { name: origin.name })}
                          </div>
                          <div className="text-gray-400 text-sm">{t('compass.autoDetected')}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowOriginPicker(true)}
                        className="text-brand-accent text-sm font-medium hover:text-brand-accent/70 transition-colors"
                      >
                        {t('compass.change')}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                      {ORIGIN_COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setOrigin(c)
                            setShowOriginPicker(false)
                          }}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                            origin.code === c.code
                              ? 'border-brand-accent bg-brand-primary/30 text-brand-accent'
                              : 'border-gray-700 bg-gray-800/40 text-white hover:border-brand-accent/50'
                          }`}
                        >
                          <span className="text-xl">{c.flag}</span>
                          <span className="text-sm font-medium">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-400 text-sm">{t('compass.locationHint')}</p>
                </div>
                {/* Fixed bottom nav */}
                <div className="fixed bottom-0 left-0 right-0 bg-brand-bg/95 backdrop-blur border-t border-brand-accent/10 z-40">
                  <div className="max-w-3xl 3xl:max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button onClick={() => setStep(1)} className="btn-ghost btn-sm">
                      {t('compass.back')}
                    </button>
                    <span className="text-xs text-gray-500 flex-1 text-center">
                      {t('compass.stepOf', { step: '2', total: '4' })}
                    </span>
                    <button onClick={() => setStep(3)} className="btn-primary btn-sm">
                      {t('compass.confirmed', { name: origin.name })}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Pioneer type */}
            {step === 3 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <div className="bg-gray-900/80 border border-brand-primary/30 rounded-2xl p-phi-5 mb-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/50 flex items-center justify-center text-xl">
                      ✦
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {t('compass.stepOf', { step: '3', total: '4' })}
                      </div>
                      <div className="text-white font-semibold text-lg">
                        {t('compass.whatKind')}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(
                      Object.entries(PIONEER_TYPES) as [
                        PioneerType,
                        (typeof PIONEER_TYPES)[PioneerType],
                      ][]
                    ).map(([key, type]) => (
                      <button
                        key={key}
                        onClick={() => handlePioneerSelect(key)}
                        className="bg-gray-800/60 border border-gray-700 hover:border-brand-accent/50 hover:bg-gray-800 rounded-xl p-4 text-center transition-all duration-200 group"
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-white font-semibold text-sm group-hover:text-brand-accent transition-colors mb-1">
                          {type.label}
                        </div>
                        <div className="text-gray-400 text-xs leading-relaxed">
                          {type.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Fixed bottom nav */}
                <div className="fixed bottom-0 left-0 right-0 bg-brand-bg/95 backdrop-blur border-t border-brand-accent/10 z-40">
                  <div className="max-w-3xl 3xl:max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button onClick={() => setStep(2)} className="btn-ghost btn-sm">
                      {t('compass.back')}
                    </button>
                    <span className="text-xs text-gray-500 flex-1 text-center">
                      {t('compass.stepOf', { step: '3', total: '4' })} —{' '}
                      {t('compass.selectPioneerType')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Route result */}
            {step === 4 && primaryDestination && pioneerType && (
              <div className="animate-[fadeIn_0.3s_ease] space-y-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 border border-brand-accent/30 rounded-2xl p-phi-5">
                  <div className="text-xs text-brand-accent font-semibold uppercase tracking-widest mb-4">
                    {t('compass.yourRoute')}
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-center">
                      <div className="text-3xl mb-1">{origin.flag}</div>
                      <div className="text-white font-medium text-sm">{origin.name}</div>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-brand-accent/50" />
                      <span className="text-brand-accent font-bold text-lg">→</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-brand-accent/50 to-gray-700" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-1">{primaryDestination.flag}</div>
                      <div className="text-white font-medium text-sm">
                        {primaryDestination.name}
                      </div>
                    </div>
                  </div>

                  {selectedDestinations.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                      <span className="text-xs text-gray-400">{t('compass.alsoExploring')}</span>
                      {selectedDestinations.slice(1).map((code) => {
                        const c = COUNTRY_OPTIONS.find((x) => x.code === code)
                        return c ? (
                          <span
                            key={code}
                            className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                          >
                            {c.flag} {c.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${CORRIDOR_BADGE[primaryDestination.corridorStrength].className}`}
                    >
                      {CORRIDOR_BADGE[primaryDestination.corridorStrength].label}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/60 text-brand-accent border border-brand-accent/30">
                      {PIONEER_TYPES[pioneerType].icon} {PIONEER_TYPES[pioneerType].label}{' '}
                      {t('compass.pioneer')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800/60 rounded-xl p-4">
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        {t('compass.visaRoute')}
                      </div>
                      <div className="text-white text-sm leading-relaxed">
                        {primaryDestination.visa}
                      </div>
                    </div>
                    <div className="bg-gray-800/60 rounded-xl p-4">
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                        {t('compass.payments')}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {primaryDestination.payment.map((p) => (
                          <span
                            key={p}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-800/60 rounded-xl p-4">
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                        {t('compass.topSectors')}
                      </div>
                      <div className="space-y-1">
                        {displaySectors.map((sector) => (
                          <div key={sector} className="text-white text-xs flex items-center gap-1">
                            <span className="text-brand-accent">•</span>
                            {sector}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/ventures?from=${origin.code}&to=${selectedDestinations.join(',')}&type=${pioneerType}`}
                    className="block w-full bg-brand-primary hover:bg-brand-primary-light text-white font-bold py-4 rounded-xl transition-colors text-center text-lg border border-brand-accent/30 hover:border-brand-accent/60"
                  >
                    {VOCAB.pioneer_join} — {t('compass.seeOpenPaths')}
                  </Link>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleReset}
                    className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                  >
                    {t('compass.navigateDifferent')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

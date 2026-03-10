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

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CountryPrioritySelector from '@/components/CountryPrioritySelector'
import { PIONEER_TYPES, PioneerType, VOCAB } from '@/lib/vocabulary'
import {
  COUNTRY_OPTIONS,
  CORRIDOR_BADGE,
  type CountryOption,
} from '@/lib/country-selector'

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

const STEP_LABELS = ['Destinations', 'Your Origin', 'Pioneer Type', 'Your Route']

const ORIGIN_COUNTRIES = COUNTRY_OPTIONS.filter(c =>
  ['KE', 'NG', 'GH', 'UG', 'TZ', 'ZA', 'DE', 'GB', 'IN', 'US', 'AE', 'CA'].includes(c.code)
)

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CompassPage() {
  const [step, setStep] = useState<Step>(1)
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
  const [origin, setOrigin] = useState<CountryOption>(
    COUNTRY_OPTIONS.find(c => c.code === 'KE')!
  )
  const [pioneerType, setPioneerType] = useState<PioneerType | null>(null)
  const [showOriginPicker, setShowOriginPicker] = useState(false)

  const primaryDestination = COUNTRY_OPTIONS.find(c => c.code === selectedDestinations[0]) ?? null

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
    const relevant = primaryDestination.topSectors.filter(sector =>
      PIONEER_TYPES[pioneerType].sectors.some(ps =>
        sector.toLowerCase().includes(ps.toLowerCase().split(' ')[0].toLowerCase())
      )
    )
    return (relevant.length > 0 ? relevant : primaryDestination.topSectors).slice(0, 3)
  })()

  return (
    <div className="min-h-screen bg-[#0A0A0F]">

      {/* Hero */}
      <div className="pt-16 pb-8 text-center px-4" style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 60%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#C9A227] text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A227]" />
          </span>
          Your Compass is active
        </div>
        <div className="flex justify-center mb-5">
          <Image src="/logo.svg" alt="BeNetwork Compass" width={64} height={64} className="opacity-90" unoptimized />
        </div>
        <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-3 leading-tight">
          Your Compass is ready.<br />
          <span className="text-[#C9A227]">Let&apos;s find your path.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">{VOCAB.tagline}</p>
      </div>

      {/* Step progress bar */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-start">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                {/* Circle + label column */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > s
                      ? 'bg-[#C9A227] text-[#0A0A0F]'
                      : step === s
                        ? 'bg-[#5C0A14] text-[#C9A227] border border-[#C9A227]/60'
                        : 'bg-gray-800 text-gray-500'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`text-xs whitespace-nowrap transition-colors duration-300 ${
                    step >= s ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {label}
                  </span>
                </div>
                {/* Connector line */}
                {s < 4 && (
                  <div className={`flex-1 h-0.5 mx-3 mt-4 -translate-y-1/2 transition-all duration-300 ${step > s ? 'bg-[#C9A227]' : 'bg-gray-800'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-4 pb-32">

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
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#5C0A14]/50 flex items-center justify-center text-xl">🌍</div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Step 2 of 4</div>
                  <div className="text-white font-semibold text-lg">Where are you currently based?</div>
                </div>
              </div>

              {!showOriginPicker ? (
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{origin.flag}</span>
                    <div>
                      <div className="text-white font-medium">Currently in {origin.name}</div>
                      <div className="text-gray-500 text-sm">Auto-detected · tap to change</div>
                    </div>
                  </div>
                  <button onClick={() => setShowOriginPicker(true)} className="text-[#C9A227] text-sm font-medium hover:text-yellow-400 transition-colors">
                    Change
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {ORIGIN_COUNTRIES.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setOrigin(c); setShowOriginPicker(false) }}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                        origin.code === c.code
                          ? 'border-[#C9A227] bg-[#5C0A14]/30 text-[#C9A227]'
                          : 'border-gray-700 bg-gray-800/40 text-white hover:border-[#C9A227]/50'
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-sm font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-gray-400 text-sm mb-6">
                We use your location to find the strongest routes and payment corridors.
              </p>
              <button
                onClick={() => setStep(3)}
                className="w-full bg-[#5C0A14] hover:bg-[#7a0e1a] text-white font-bold py-4 rounded-xl transition-colors text-lg border border-[#C9A227]/30"
              >
                Confirmed — I&apos;m in {origin.name} →
              </button>
            </div>
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">← Back</button>
          </div>
        )}

        {/* STEP 3 — Pioneer type */}
        {step === 3 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#5C0A14]/50 flex items-center justify-center text-xl">✦</div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Step 3 of 4</div>
                  <div className="text-white font-semibold text-lg">What kind of Pioneer are you?</div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.entries(PIONEER_TYPES) as [PioneerType, typeof PIONEER_TYPES[PioneerType]][]).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => handlePioneerSelect(key)}
                    className="bg-gray-800/60 border border-gray-700 hover:border-[#C9A227]/50 hover:bg-gray-800 rounded-xl p-4 text-center transition-all duration-200 group"
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-white font-semibold text-sm group-hover:text-[#C9A227] transition-colors mb-1">{type.label}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">← Back</button>
          </div>
        )}

        {/* STEP 4 — Route result */}
        {step === 4 && primaryDestination && pioneerType && (
          <div className="animate-[fadeIn_0.3s_ease] space-y-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 border border-[#C9A227]/30 rounded-2xl p-6">
              <div className="text-xs text-[#C9A227] font-semibold uppercase tracking-widest mb-4">Your Route</div>

              <div className="flex items-center gap-4 mb-5">
                <div className="text-center">
                  <div className="text-3xl mb-1">{origin.flag}</div>
                  <div className="text-white font-medium text-sm">{origin.name}</div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-[#C9A227]/50" />
                  <span className="text-[#C9A227] font-bold text-lg">→</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#C9A227]/50 to-gray-700" />
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">{primaryDestination.flag}</div>
                  <div className="text-white font-medium text-sm">{primaryDestination.name}</div>
                </div>
              </div>

              {selectedDestinations.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  <span className="text-xs text-gray-500">Also exploring:</span>
                  {selectedDestinations.slice(1).map(code => {
                    const c = COUNTRY_OPTIONS.find(x => x.code === code)
                    return c ? (
                      <span key={code} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                        {c.flag} {c.name}
                      </span>
                    ) : null
                  })}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CORRIDOR_BADGE[primaryDestination.corridorStrength].className}`}>
                  {CORRIDOR_BADGE[primaryDestination.corridorStrength].label}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#5C0A14]/60 text-[#C9A227] border border-[#C9A227]/30">
                  {PIONEER_TYPES[pioneerType].icon} {PIONEER_TYPES[pioneerType].label} Pioneer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Visa Route</div>
                  <div className="text-white text-sm leading-relaxed">{primaryDestination.visa}</div>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Payments</div>
                  <div className="flex flex-wrap gap-1">
                    {primaryDestination.payment.map(p => (
                      <span key={p} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Top Sectors</div>
                  <div className="space-y-1">
                    {displaySectors.map(sector => (
                      <div key={sector} className="text-white text-xs flex items-center gap-1">
                        <span className="text-[#C9A227]">•</span>{sector}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/ventures"
                className="block w-full bg-[#5C0A14] hover:bg-[#7a0e1a] text-white font-bold py-4 rounded-xl transition-colors text-center text-lg border border-[#C9A227]/30 hover:border-[#C9A227]/60"
              >
                {VOCAB.pioneer_join} — See Open Paths →
              </Link>
            </div>

            <div className="text-center">
              <button onClick={handleReset} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                ← Navigate a different route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

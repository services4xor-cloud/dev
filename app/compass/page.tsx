'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PIONEER_TYPES, PioneerType, VOCAB } from '@/lib/vocabulary'

// Destination corridor data
interface Destination {
  code: string
  name: string
  flag: string
  highlight: string
  corridorStrength: 'direct' | 'partner' | 'emerging'
  visa: string
  payment: string[]
  topSectors: string[]
}

const DESTINATIONS: Destination[] = [
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    highlight: 'High demand for healthcare & skilled trades',
    corridorStrength: 'direct',
    visa: 'Skilled Worker Visa (EU Blue Card pathway)',
    payment: ['SEPA Transfer', 'PayPal', 'Wise'],
    topSectors: ['Healthcare', 'Engineering', 'IT', 'Hospitality'],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    highlight: 'NHS nursing, tech hubs, tourism',
    corridorStrength: 'direct',
    visa: 'Skilled Worker Visa (sponsor required)',
    payment: ['Bank Transfer', 'Stripe', 'PayPal'],
    topSectors: ['Nursing', 'Technology', 'Finance', 'Hospitality'],
  },
  {
    code: 'AE',
    name: 'UAE / Dubai',
    flag: '🇦🇪',
    highlight: 'Construction, hospitality, finance boom',
    corridorStrength: 'direct',
    visa: 'Work Permit via employer (quick turnaround)',
    payment: ['Bank Transfer', 'Western Union', 'Wise'],
    topSectors: ['Construction', 'Hospitality', 'Finance', 'Logistics'],
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    highlight: 'Tech, healthcare, creative arts',
    corridorStrength: 'partner',
    visa: 'H-1B / O-1 / EB visas (sponsor required)',
    payment: ['ACH', 'Stripe', 'PayPal'],
    topSectors: ['Technology', 'Healthcare', 'Creative', 'Research'],
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    highlight: 'Express Entry — fastest immigration route',
    corridorStrength: 'direct',
    visa: 'Express Entry / Provincial Nominee Program',
    payment: ['Interac', 'Bank Transfer', 'PayPal'],
    topSectors: ['Technology', 'Healthcare', 'Agriculture', 'Mining'],
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    highlight: 'Fintech, media, growing Pan-African corridor',
    corridorStrength: 'direct',
    visa: 'ECOWAS mobility agreement (most passports)',
    payment: ['Flutterwave', 'M-Pesa', 'Bank Transfer'],
    topSectors: ['Fintech', 'Media', 'Energy', 'Agriculture'],
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    highlight: 'Tourism, wine country, tech corridor',
    corridorStrength: 'partner',
    visa: 'General Work Visa / Critical Skills Visa',
    payment: ['Bank Transfer', 'PayFast', 'Wise'],
    topSectors: ['Tourism', 'Mining', 'Technology', 'Agriculture'],
  },
  {
    code: 'KE',
    name: 'Kenya (Local)',
    flag: '🇰🇪',
    highlight: 'Safari, tech hub, regional HQs',
    corridorStrength: 'direct',
    visa: 'No visa required (home market)',
    payment: ['M-Pesa', 'Bank Transfer', 'Card'],
    topSectors: ['Safari & Eco-Tourism', 'Technology', 'Finance', 'Agriculture'],
  },
]

const CORRIDOR_BADGES: Record<Destination['corridorStrength'], { label: string; className: string }> = {
  direct: { label: 'Direct Route', className: 'bg-green-100 text-green-800' },
  partner: { label: 'Partner Route', className: 'bg-blue-100 text-blue-800' },
  emerging: { label: 'Emerging', className: 'bg-orange-100 text-orange-800' },
}

type Step = 1 | 2 | 3 | 4

export default function CompassPage() {
  const [step, setStep] = useState<Step>(1)
  const [origin, setOrigin] = useState<string>('Kenya')
  const [destination, setDestination] = useState<Destination | null>(null)
  const [pioneerType, setPioneerType] = useState<PioneerType | null>(null)

  const handleDestinationSelect = (dest: Destination) => {
    setDestination(dest)
    setStep(3)
  }

  const handlePioneerSelect = (type: PioneerType) => {
    setPioneerType(type)
    setStep(4)
  }

  const handleReset = () => {
    setStep(1)
    setDestination(null)
    setPioneerType(null)
  }

  const topSectorsForPioneer = destination && pioneerType
    ? destination.topSectors.filter(sector =>
        PIONEER_TYPES[pioneerType].sectors.some(ps =>
          sector.toLowerCase().includes(ps.toLowerCase().split(' ')[0].toLowerCase())
        )
      ).slice(0, 3)
    : []

  const displaySectors = topSectorsForPioneer.length > 0
    ? topSectorsForPioneer
    : (destination?.topSectors.slice(0, 3) ?? [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Hero */}
      <div className="pt-20 pb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Your Compass is active
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Your Compass is ready.
          <br />
          <span className="text-[#FF6B35]">Let&apos;s find your path.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          {VOCAB.tagline} Tell us where you are and where you&apos;re going.
          We&apos;ll build your route.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= s
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    step > s ? 'bg-[#FF6B35]' : 'bg-gray-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Where you are</span>
          <span>Destination</span>
          <span>Pioneer type</span>
          <span>Your route</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">

        {/* STEP 1: Origin detection */}
        {step === 1 && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-xl">
                  🌍
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Step 1 of 4</div>
                  <div className="text-white font-semibold">Where are you currently based?</div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇰🇪</span>
                  <div>
                    <div className="text-white font-medium">Currently in {origin}</div>
                    <div className="text-gray-500 text-sm">Auto-detected — tap to change</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = origin === 'Kenya' ? 'Nigeria' : origin === 'Nigeria' ? 'Germany' : 'Kenya'
                    setOrigin(next)
                  }}
                  className="text-[#FF6B35] text-sm font-medium hover:text-orange-400 transition-colors"
                >
                  Change
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                We use your location to find the strongest routes and payment corridors for you.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#FF6B35] text-white font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors text-lg"
              >
                Confirmed — I&apos;m in {origin} →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Destination selection */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-xl">
                  🧭
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Step 2 of 4</div>
                  <div className="text-white font-semibold">Where do you want to go?</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DESTINATIONS.map((dest) => {
                  const badge = CORRIDOR_BADGES[dest.corridorStrength]
                  return (
                    <button
                      key={dest.code}
                      onClick={() => handleDestinationSelect(dest)}
                      className="bg-gray-800/60 border border-gray-700 hover:border-[#FF6B35]/50 hover:bg-gray-800 rounded-xl p-4 text-left transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{dest.flag}</span>
                          <span className="text-white font-semibold group-hover:text-[#FF6B35] transition-colors">
                            {dest.name}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{dest.highlight}</p>
                    </button>
                  )
                })}
              </div>
            </div>
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              ← Back
            </button>
          </div>
        )}

        {/* STEP 3: Pioneer type */}
        {step === 3 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-xl">
                  ✦
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Step 3 of 4</div>
                  <div className="text-white font-semibold">What kind of Pioneer are you?</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.entries(PIONEER_TYPES) as [PioneerType, typeof PIONEER_TYPES[PioneerType]][]).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => handlePioneerSelect(key)}
                    className="bg-gray-800/60 border border-gray-700 hover:border-[#FF6B35]/50 hover:bg-gray-800 rounded-xl p-4 text-center transition-all duration-200 group"
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-white font-semibold text-sm group-hover:text-[#FF6B35] transition-colors mb-1">
                      {type.label}
                    </div>
                    <div className="text-gray-500 text-xs leading-relaxed">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              ← Back
            </button>
          </div>
        )}

        {/* STEP 4: Route result */}
        {step === 4 && destination && pioneerType && (
          <div className="animate-[fadeIn_0.3s_ease] space-y-4">
            {/* Route card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 border border-[#FF6B35]/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs text-[#FF6B35] font-semibold uppercase tracking-wider mb-4">
                <span>Your Route</span>
              </div>

              {/* From → To */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl mb-1">🇰🇪</div>
                  <div className="text-white font-medium text-sm">{origin}</div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-[#FF6B35]/50"></div>
                  <span className="text-[#FF6B35] font-bold text-lg">→</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#FF6B35]/50 to-gray-700"></div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">{destination.flag}</div>
                  <div className="text-white font-medium text-sm">{destination.name}</div>
                </div>
              </div>

              {/* Corridor strength */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CORRIDOR_BADGES[destination.corridorStrength].className}`}>
                  {CORRIDOR_BADGES[destination.corridorStrength].label}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {PIONEER_TYPES[pioneerType].icon} {PIONEER_TYPES[pioneerType].label} Pioneer
                </span>
              </div>

              {/* Route details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Visa Route</div>
                  <div className="text-white text-sm leading-relaxed">{destination.visa}</div>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Payments</div>
                  <div className="flex flex-wrap gap-1">
                    {destination.payment.map((p) => (
                      <span key={p} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Top Sectors</div>
                  <div className="space-y-1">
                    {displaySectors.map((sector) => (
                      <div key={sector} className="text-white text-xs flex items-center gap-1">
                        <span className="text-[#FF6B35]">•</span>
                        {sector}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/ventures"
                className="block w-full bg-[#FF6B35] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors text-center text-lg"
              >
                {VOCAB.pioneer_join} — See Open Paths →
              </Link>
            </div>

            {/* Start over */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                ← Navigate a different route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

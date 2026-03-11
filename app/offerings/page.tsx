'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Compass,
  Clock,
  Users,
  MapPin,
  Heart,
  TrendingUp,
  CreditCard,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { COUNTRIES, type CountryCode } from '@/lib/countries'
import { detectCountryFromIP } from '@/lib/compass'
import { formatPackagePrice } from '@/lib/safari-packages'
import {
  OFFERING_PURPOSES,
  getCountryOfferings,
  getRecommendedDestinations,
  getPurposeAvailability,
  type OfferingPurpose,
} from '@/lib/offerings'

const ALL_COUNTRIES = Object.values(COUNTRIES)

export default function OfferingsPage() {
  const [originCode, setOriginCode] = useState<CountryCode>(
    (process.env.NEXT_PUBLIC_COUNTRY_CODE as CountryCode) || 'KE'
  )
  const [destinationCode, setDestinationCode] = useState<CountryCode | null>(null)
  const [purpose, setPurpose] = useState<OfferingPurpose | 'all'>('all')
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [detected, setDetected] = useState(false)

  // Auto-detect origin country on mount
  useEffect(() => {
    detectCountryFromIP().then(({ country }) => {
      const code = country as CountryCode
      if (COUNTRIES[code]) {
        setOriginCode(code)
        setDetected(true)
      }
    })
  }, [])

  // Active country = destination if selected, otherwise origin
  const activeCode = destinationCode ?? originCode
  const activeCountry = COUNTRIES[activeCode]
  const offerings = getCountryOfferings(activeCode)
  const purposeAvailability = getPurposeAvailability(activeCode)
  const recommendations = getRecommendedDestinations(originCode)

  // Filter by purpose
  const showTravel = purpose === 'all' || purpose === 'travel'
  const showProfessional = purpose === 'all' || purpose === 'professional'
  const showBusiness = purpose === 'all' || purpose === 'business'

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* ── Hero + Country Context ────────────────────────────────── */}
      <section
        className="pt-16 pb-10 px-4"
        style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 65%)' }}
      >
        <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto">
          {/* Origin indicator */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              <span className="text-gray-400">Your location:</span>
              <button
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                className="flex items-center gap-1.5 text-white font-semibold hover:text-[#C9A227] transition-colors"
              >
                <span>{COUNTRIES[originCode]?.flag}</span>
                {COUNTRIES[originCode]?.name}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {detected && (
                <span className="text-[10px] text-[#C9A227]/60 font-medium">auto-detected</span>
              )}
            </div>

            {destinationCode && (
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 text-sm">
                  <span>{COUNTRIES[destinationCode]?.flag}</span>
                  <span className="text-[#C9A227] font-semibold">
                    {COUNTRIES[destinationCode]?.name}
                  </span>
                  <button
                    onClick={() => setDestinationCode(null)}
                    className="text-gray-500 hover:text-white ml-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Country picker dropdown */}
          {showCountryPicker && (
            <div className="mb-6 bg-gray-900/90 border border-gray-700 rounded-xl p-4 max-w-lg">
              <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wider">
                Change your origin country
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {ALL_COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setOriginCode(c.code)
                      setDetected(false)
                      setShowCountryPicker(false)
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      originCode === c.code
                        ? 'bg-[#5C0A14] text-[#C9A227] border border-[#C9A227]/30'
                        : 'bg-white/5 text-gray-300 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl font-bold text-white mb-4 leading-tight">
            {destinationCode ? (
              <>
                Offerings in <span style={{ color: '#C9A227' }}>{activeCountry?.name}</span>
              </>
            ) : (
              <>
                Where Do You Want <span style={{ color: '#C9A227' }}>to Go?</span>
              </>
            )}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-8">
            {destinationCode
              ? `Explore what ${activeCountry?.name} has to offer — experiences, professional paths, and business opportunities tailored to your route.`
              : 'Select a destination below, or browse recommended routes based on your location. Travel, work, or build — your path starts here.'}
          </p>

          {/* Purpose tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPurpose('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                purpose === 'all'
                  ? 'bg-[#5C0A14] text-[#C9A227] border border-[#C9A227]/50 shadow-lg shadow-[#5C0A14]/40'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              🌍 All
            </button>
            {OFFERING_PURPOSES.map((p) => {
              const avail = purposeAvailability.find((a) => a.purpose === p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => setPurpose(p.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    purpose === p.id
                      ? 'bg-[#5C0A14] text-[#C9A227] border border-[#C9A227]/50 shadow-lg shadow-[#5C0A14]/40'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>{p.icon}</span>
                  {p.label}
                  {avail && <span className="text-[10px] opacity-60">{avail.count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 pb-20 space-y-10">
        {/* ── If no destination selected: show route recommendations ── */}
        {!destinationCode && (
          <section>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#C9A227]" />
              Recommended Destinations from {COUNTRIES[originCode]?.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 6).map((rec) => {
                const strengthBadge = {
                  direct: {
                    label: 'Direct Route',
                    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  },
                  partner: {
                    label: 'Partner',
                    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  },
                  emerging: {
                    label: 'Emerging',
                    cls: 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/20',
                  },
                  none: { label: 'Explore', cls: 'bg-gray-800 text-gray-400 border-gray-700' },
                }[rec.routeStrength]

                return (
                  <button
                    key={rec.country.code}
                    onClick={() => setDestinationCode(rec.country.code)}
                    className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 text-left hover:border-[#C9A227]/40 hover:shadow-lg hover:shadow-[#5C0A14]/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{rec.country.flag}</span>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-[#C9A227] transition-colors">
                            {rec.country.name}
                          </h3>
                          <span className="text-gray-500 text-xs">{rec.country.brandName}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${strengthBadge.cls}`}
                      >
                        {strengthBadge.label}
                      </span>
                    </div>

                    {/* Top sectors */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rec.relevantSectors.slice(0, 3).map((s) => (
                        <span
                          key={s.name}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                        >
                          {s.emoji} {s.name}
                        </span>
                      ))}
                    </div>

                    {rec.paymentRails.length > 0 && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <CreditCard className="w-3 h-3" />
                        {rec.paymentRails.join(', ')}
                      </div>
                    )}

                    <div className="mt-3 text-[#C9A227] text-xs font-semibold flex items-center gap-1">
                      Explore{' '}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Destination selected: show offerings ───────────────── */}
        {destinationCode && (
          <>
            {/* Travel & Experiences */}
            {showTravel && offerings.experiences.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  🦁 Safari Experiences
                  <span className="text-xs font-normal text-gray-500">
                    {offerings.experiences.length} available
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offerings.experiences.map((pkg) => (
                    <Link key={pkg.id} href={`/experiences/${pkg.id}`}>
                      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden hover:border-[#C9A227]/40 transition-all duration-200 h-full group">
                        <div
                          className="h-32 flex items-center justify-center text-4xl"
                          style={{ background: 'linear-gradient(135deg, #3D1A00, #7B3F00)' }}
                        >
                          {pkg.type === 'deep_sea_fishing'
                            ? '🎣'
                            : pkg.type === 'wildlife_safari'
                              ? '🦁'
                              : '🏡'}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-sm mb-1 group-hover:text-[#C9A227] transition-colors">
                            {pkg.name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2">
                            {pkg.destination} · {pkg.duration}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-white text-sm">
                              {formatPackagePrice(pkg)}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 text-xs">
                              <Users className="w-3 h-3" />
                              {pkg.maxGuests}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Eco-Tourism */}
            {showTravel && offerings.ecoTourism.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  🌿 Eco-Tourism
                  <span className="text-xs font-normal text-gray-500">
                    {offerings.ecoTourism.length} available
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offerings.ecoTourism.map((eco) => (
                    <div
                      key={eco.id}
                      className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 hover:border-[#C9A227]/40 transition-all duration-200"
                    >
                      <h3 className="font-bold text-white text-lg mb-1">{eco.name}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        {eco.location}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {eco.highlights.slice(0, 3).map((h) => (
                          <span
                            key={h}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                      <div className="bg-emerald-900/20 border border-emerald-800/20 rounded-lg px-3 py-2 mb-3">
                        <p className="text-emerald-400 text-xs">
                          <Heart className="w-3 h-3 inline mr-1" />
                          {eco.impactNote}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white">${eco.priceUSD}</span>
                        <span className="flex items-center gap-2 text-gray-500 text-xs">
                          <Clock className="w-3 h-3" />
                          {eco.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Professional Sectors */}
            {showProfessional && offerings.sectors.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  💼 Professional Sectors in {activeCountry?.name}
                  <span className="text-xs font-normal text-gray-500">
                    {offerings.sectors.length} sectors
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {offerings.sectors.map((sector) => (
                    <Link
                      key={sector.name}
                      href={`/ventures?sector=${encodeURIComponent(sector.name)}`}
                      className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-[#C9A227]/40 transition-all duration-200 group"
                    >
                      <div className="text-2xl mb-2">{sector.emoji}</div>
                      <h3 className="font-semibold text-white text-sm group-hover:text-[#C9A227] transition-colors">
                        {sector.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">
                        {sector.count.toLocaleString()}+ paths
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Trade Corridors */}
            {showBusiness && offerings.tradeCorridors.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  🌍 Trade Corridors
                  <span className="text-xs font-normal text-gray-500">
                    {offerings.tradeCorridors.length} active
                  </span>
                </h2>
                <div className="space-y-4">
                  {offerings.tradeCorridors.map((corridor) => (
                    <div
                      key={corridor.id}
                      className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 hover:border-[#C9A227]/30 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{corridor.fromFlag}</span>
                          <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                          <span className="text-2xl">{corridor.toFlag}</span>
                          <div className="ml-2">
                            <h3 className="font-bold text-white">{corridor.name}</h3>
                            <p className="text-gray-400 text-sm">{corridor.tradeVolume}</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {corridor.growthRate}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            Key Sectors
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {corridor.sectors.map((s) => (
                              <span
                                key={s}
                                className="text-xs px-2.5 py-1 rounded-full bg-[#5C0A14]/30 text-[#C9A227] border border-[#C9A227]/15"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Opportunities
                          </h4>
                          <ul className="space-y-1">
                            {corridor.opportunities.slice(0, 2).map((o) => (
                              <li key={o} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-[#C9A227] mt-0.5 flex-shrink-0">›</span>
                                {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No content state */}
            {offerings.experiences.length === 0 &&
              offerings.ecoTourism.length === 0 &&
              offerings.sectors.length === 0 &&
              offerings.tradeCorridors.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🧭</div>
                  <p className="text-lg font-semibold text-white mb-2">
                    Offerings for {activeCountry?.name} are coming soon
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    We&apos;re expanding to new countries. Use the Compass to explore available
                    routes.
                  </p>
                  <Link
                    href="/compass"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)',
                      border: '1px solid rgba(201,162,39,0.35)',
                    }}
                  >
                    <Compass className="w-4 h-4" />
                    Open the Compass
                  </Link>
                </div>
              )}
          </>
        )}

        {/* ── CTA ───────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #5C0A14 0%, #0A0A0F 100%)',
            border: '1px solid #C9A22740',
          }}
        >
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="text-2xl font-bold text-white mb-2">Every Venture Has Impact</h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
            A percentage of every venture booked through BeNetwork goes to community organizations —
            funding education, healthcare, and local development.
          </p>
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 text-[#C9A227] font-semibold text-sm hover:text-[#C9A227]/70 transition-colors"
          >
            Learn about UTAMADUNI <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

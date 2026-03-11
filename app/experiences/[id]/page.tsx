'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MapPin, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { SAFARI_PACKAGES, getPackageById, formatPackagePrice } from '@/lib/safari-packages'
import { VOCAB } from '@/lib/vocabulary'

export default function ExperiencePage() {
  const params = useParams()
  const id =
    typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const pkg = getPackageById(id)
  const [openDay, setOpenDay] = useState<number | null>(0)
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('card')

  // 3 related packages (exclude current)
  const related = SAFARI_PACKAGES.filter((p) => p.id !== id).slice(0, 3)

  if (!pkg) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🧭</div>
          <h1 className="text-2xl font-bold text-white mb-2">Venture Not Found</h1>
          <p className="text-gray-400 mb-6">
            This path may have already been claimed, or doesn&apos;t exist yet. Explore other open
            ventures below.
          </p>
          <Link
            href="/ventures"
            className="inline-block text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              border: '1px solid rgb(var(--color-accent-rgb) / 0.35)',
            }}
          >
            ← Back to Ventures
          </Link>
        </div>
      </div>
    )
  }

  const TYPE_LABELS: Record<string, string> = {
    deep_sea_fishing: '🎣 Deep Sea Fishing',
    wildlife_safari: '🦁 Wildlife Safari',
    eco_lodge: '🏡 Eco-Lodge',
    cultural: '🎭 Cultural',
  }

  const TYPE_EMOJI: Record<string, string> = {
    deep_sea_fishing: '🎣',
    wildlife_safari: '🦁',
    eco_lodge: '🏡',
    cultural: '🎭',
  }

  const SEASON_LABELS: Record<string, string> = {
    high: 'High Season',
    low: 'Low Season',
    all: 'Year-Round',
  }

  const hasFessyMarkup = pkg.markup && pkg.markup > 0

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-primary/80 to-brand-bg text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-8 transition-colors"
          >
            ← Back to Ventures
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                pkg.type === 'wildlife_safari'
                  ? 'bg-brand-accent text-brand-bg'
                  : pkg.type === 'deep_sea_fishing'
                    ? 'bg-blue-400 text-blue-900'
                    : 'bg-green-400 text-green-900'
              }`}
            >
              {TYPE_LABELS[pkg.type] ?? pkg.type}
            </span>
            {pkg.season && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                {SEASON_LABELS[pkg.season] ?? pkg.season}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{pkg.name}</h1>
          <p className="text-gray-300 text-lg mb-6">by {pkg.provider}</p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-300 text-xs mb-1">
                <Clock size={14} />
                Duration
              </div>
              <div className="text-white font-semibold">{pkg.duration}</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-300 text-xs mb-1">
                <Users size={14} />
                Max Pioneers
              </div>
              <div className="text-white font-semibold">{pkg.maxGuests} guests</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-300 text-xs mb-1">
                <MapPin size={14} />
                Destination
              </div>
              <div className="text-white font-semibold text-sm">{pkg.destination}</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="text-gray-300 text-xs mb-1">Starting from</div>
              <div className="text-white font-bold text-xl">{formatPackagePrice(pkg)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highlights */}
            <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-bold text-white mb-4">✦ Why This Venture</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-brand-accent text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Included / Excluded */}
            <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-bold text-white mb-6">What&apos;s Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs">
                      ✓
                    </span>
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">
                      ✗
                    </span>
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {hasFessyMarkup && (
                <div className="mt-6 bg-brand-primary/10 border border-brand-accent/20 rounded-xl p-4">
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold">Transparency note:</span> This venture includes
                    a FessyTours service fee ({Math.round((pkg.markup ?? 0) * 100)}%). This fee
                    funds platform operations and Pioneer support services.
                  </p>
                </div>
              )}
            </section>

            {/* Itinerary */}
            <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-bold text-white mb-4">Day-by-Day Itinerary</h2>
              <div className="space-y-3">
                {pkg.days.map((day, i) => (
                  <div key={i} className="border border-gray-800 rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                      onClick={() => setOpenDay(openDay === i ? null : i)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-sm flex-shrink-0">
                          {day.day}
                        </div>
                        <span className="font-semibold text-white">{day.title}</span>
                      </div>
                      {openDay === i ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </button>
                    {openDay === i && (
                      <div className="px-4 pb-4 border-t border-gray-800">
                        <p className="text-gray-400 text-sm leading-relaxed mt-3 mb-3">
                          {day.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium">Meals:</span>
                          <span>{day.meals}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Optional Activities */}
            {pkg.optionalActivities && pkg.optionalActivities.length > 0 && (
              <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-6">
                <h2 className="text-lg font-bold text-white mb-4">Optional Extras</h2>
                <div className="space-y-3">
                  {pkg.optionalActivities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-800/60 rounded-xl"
                    >
                      <span className="text-gray-200 font-medium text-sm">{activity.name}</span>
                      <div className="text-right">
                        <div className="font-bold text-brand-accent text-sm">
                          ${activity.priceUSD.toLocaleString('en-US')}
                        </div>
                        <div className="text-gray-400 text-xs">{activity.unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-md p-6 sticky top-6">
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white">{formatPackagePrice(pkg)}</div>
                {pkg.priceNote && <div className="text-gray-500 text-sm mt-1">{pkg.priceNote}</div>}
              </div>

              {/* Payment method toggle */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Pay with
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'bg-brand-success text-white border-brand-success'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    📱 M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#0891B2] text-white border-[#0891B2]'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    💳 Card
                  </button>
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <p className="text-green-800 text-xs leading-relaxed">
                    Pay via M-Pesa Paybill. You&apos;ll receive payment instructions after booking
                    confirmation. Perfect for Kenya-based Pioneers.
                  </p>
                </div>
              )}

              <button
                className="w-full text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] text-base mb-3"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                  border: '1px solid rgb(var(--color-accent-rgb) / 0.35)',
                }}
              >
                Book This Venture
              </button>

              <p className="text-center text-gray-400 text-xs">
                Free cancellation up to 48 hours before departure
              </p>

              {/* Quick info */}
              <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Max group size</span>
                  <span className="font-medium text-gray-200">{pkg.maxGuests} people</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-200">{pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Provider</span>
                  <span className="font-medium text-gray-200">{pkg.provider}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Destination</span>
                  <span className="font-medium text-gray-200">{pkg.destination}</span>
                </div>
              </div>

              <Link
                href="/compass"
                className="mt-6 flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--color-accent)' }}
              >
                🧭 Use the Compass to plan your route
              </Link>
            </div>
          </div>
        </div>

        {/* More Ventures */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">More Ventures to Explore</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((relPkg) => (
                <Link key={relPkg.id} href={`/experiences/${relPkg.id}`}>
                  <div className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md hover:border-gray-700 transition-all duration-200 overflow-hidden h-full">
                    <div className="bg-gradient-to-br from-gray-800 to-brand-primary/30 h-28 flex items-center justify-center text-4xl">
                      {TYPE_EMOJI[relPkg.type] ?? '🌍'}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-1 leading-tight">
                        {relPkg.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin size={11} />
                        {relPkg.destination}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-accent text-sm">
                          {formatPackagePrice(relPkg)}
                        </span>
                        <span className="text-brand-accent text-xs font-semibold">
                          {VOCAB.chapter_open} →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  MapPin,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Shield,
  Star,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { SAFARI_PACKAGES, getPackageById, formatPackagePrice } from '@/lib/safari-packages'
import { VOCAB } from '@/lib/vocabulary'
import MpesaModal from '@/components/MpesaModal'

// ── Engagement helpers ──────────────────────────────────────────────
// Deterministic "random" values seeded by package ID for consistency
function seededNumber(seed: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i)
  return min + (Math.abs(hash) % (max - min + 1))
}

function getNextDeparture(id: string): string {
  const daysOut = seededNumber(id, 4, 18)
  const date = new Date()
  date.setDate(date.getDate() + daysOut)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Booking states ──────────────────────────────────────────────────
type BookingState = 'browsing' | 'details' | 'paying' | 'confirmed'

interface BookingInfo {
  guests: number
  date: string
  phone: string
  checkoutId: string
}

export default function ExperiencePage() {
  const params = useParams()
  const id =
    typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const pkg = getPackageById(id)
  const [openDay, setOpenDay] = useState<number | null>(0)
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa')
  const [bookingState, setBookingState] = useState<BookingState>('browsing')
  const [mpesaOpen, setMpesaOpen] = useState(false)
  const [booking, setBooking] = useState<BookingInfo>({
    guests: 2,
    date: '',
    phone: '',
    checkoutId: '',
  })

  // Live "viewers" count — subtle social proof
  const [viewers, setViewers] = useState(0)
  useEffect(() => {
    if (!pkg) return
    setViewers(seededNumber(id + 'v', 3, 12))
    const interval = setInterval(() => {
      setViewers((v) => v + (Math.random() > 0.6 ? 1 : Math.random() < 0.3 ? -1 : 0))
    }, 8000)
    return () => clearInterval(interval)
  }, [id, pkg])

  // Engagement numbers (deterministic per package)
  const spotsLeft = pkg ? seededNumber(id + 's', 2, 6) : 0
  const recentBookings = pkg ? seededNumber(id + 'b', 8, 24) : 0
  const nextDeparture = pkg ? getNextDeparture(id) : ''
  const rating = pkg ? (4 + seededNumber(id + 'r', 3, 9) / 10).toFixed(1) : '4.8'

  // 3 related packages (exclude current)
  const related = pkg ? SAFARI_PACKAGES.filter((p) => p.id !== id).slice(0, 3) : []

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
  const totalPrice = pkg.priceKES ?? (pkg.priceEUR ? pkg.priceEUR * 165 : (pkg.priceUSD ?? 0) * 130)

  // ── Booking handlers ────────────────────────────────────────────
  function handleBookClick() {
    if (paymentMethod === 'mpesa') {
      setMpesaOpen(true)
    } else {
      // Mock card payment — simulate processing
      setBookingState('paying')
      setTimeout(() => {
        setBooking((b) => ({
          ...b,
          checkoutId: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        }))
        setBookingState('confirmed')
      }, 2500)
    }
  }

  function handleMpesaSuccess(checkoutId: string) {
    setBooking((b) => ({ ...b, checkoutId }))
    setMpesaOpen(false)
    setBookingState('confirmed')
  }

  // ── Confirmed state ─────────────────────────────────────────────
  if (bookingState === 'confirmed') {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Celebration header */}
          <div className="text-center mb-10">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-brand-success/20 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">You&apos;re going!</h1>
            <p className="text-gray-400 text-lg">
              Your adventure to {pkg.destination} is confirmed.
            </p>
          </div>

          {/* Receipt card */}
          <div className="bg-gray-900/60 rounded-2xl border border-gray-800 overflow-hidden">
            {/* Receipt header */}
            <div
              className="p-6"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Booking Confirmed
                  </div>
                  <div className="text-white font-bold text-xl">{pkg.name}</div>
                </div>
                <div className="text-4xl">{TYPE_EMOJI[pkg.type] ?? '🌍'}</div>
              </div>
            </div>

            {/* Receipt details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Destination
                  </div>
                  <div className="text-white font-medium">{pkg.destination}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Duration
                  </div>
                  <div className="text-white font-medium">{pkg.duration}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Provider
                  </div>
                  <div className="text-white font-medium">{pkg.provider}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Next Departure
                  </div>
                  <div className="text-white font-medium">{nextDeparture}</div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Amount paid</span>
                  <span className="text-white font-bold text-lg">{formatPackagePrice(pkg)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Payment</span>
                  <span className="text-gray-300 text-sm">
                    {booking.checkoutId.startsWith('card') ? '💳 Card' : '📱 M-Pesa'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-400">Reference</span>
                  <span className="text-gray-400 text-xs font-mono">{booking.checkoutId}</span>
                </div>
              </div>

              {/* UTAMADUNI impact */}
              <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🌱</div>
                  <div>
                    <div className="text-brand-accent font-semibold text-sm">
                      You just made an impact
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      KES 50 from your booking goes directly to UTAMADUNI Community Based
                      Organisation — funding education, healthcare, and opportunity in Kenya.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt footer */}
            <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/40">
              <p className="text-gray-400 text-xs text-center">
                Confirmation sent to your phone. Provider will contact you within 24 hours with
                detailed pickup instructions.
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/pioneers/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                border: '1px solid rgb(var(--color-accent-rgb) / 0.35)',
              }}
            >
              My Dashboard →
            </Link>
            <Link
              href="/ventures"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all"
            >
              Browse More Ventures
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Card payment processing overlay ─────────────────────────────
  if (bookingState === 'paying') {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-white mb-2">Processing your payment...</h2>
          <p className="text-gray-400">This will only take a moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-20 lg:pb-0">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-primary/80 to-brand-bg text-white">
        <div className="max-w-5xl mx-auto px-4 py-phi-7">
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-8 transition-colors"
          >
            ← Back to Ventures
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
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
            {/* Social proof badge */}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-accent/20 text-brand-accent flex items-center gap-1">
              <Star size={11} className="fill-current" />
              {rating} · {recentBookings} booked this month
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{pkg.name}</h1>
          <p className="text-gray-300 text-lg mb-phi-5">by {pkg.provider}</p>

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

      <div className="max-w-5xl mx-auto px-4 py-phi-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highlights */}
            <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-phi-5">
              <h2 className="text-lg font-bold text-white mb-phi-4">✦ Why This Venture</h2>
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
            <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-phi-5">
              <h2 className="text-lg font-bold text-white mb-phi-5">What&apos;s Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 text-xs">
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
                  <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-900/50 flex items-center justify-center text-red-400 text-xs">
                      ✗
                    </span>
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
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
            <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-phi-5">
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
                        <div className="flex items-center gap-2 text-xs text-gray-400">
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
              <section className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-sm p-phi-5">
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

          {/* ── Booking sidebar ──────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/60 rounded-2xl border border-gray-800 shadow-md p-phi-5 sticky top-6">
              {/* Price */}
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white">{formatPackagePrice(pkg)}</div>
                {pkg.priceNote && <div className="text-gray-400 text-sm mt-1">{pkg.priceNote}</div>}
              </div>

              {/* Urgency & scarcity nudges */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 font-medium">
                    Only {spotsLeft} spots left for {nextDeparture}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <TrendingUp size={12} className="text-brand-accent" />
                  <span>{recentBookings} Pioneers booked this month</span>
                </div>
                {viewers > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>{viewers} people viewing right now</span>
                  </div>
                )}
              </div>

              {/* Next departure */}
              <div className="flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 rounded-xl px-3 py-2 mb-4">
                <Calendar size={14} className="text-brand-accent flex-shrink-0" />
                <div className="text-xs">
                  <span className="text-gray-400">Next departure: </span>
                  <span className="text-brand-accent font-semibold">{nextDeparture}</span>
                </div>
              </div>

              {/* Payment method toggle */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                        ? 'bg-brand-primary-light text-white border-brand-primary-light'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    💳 Card
                  </button>
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="bg-green-900/30 border border-green-800/50 rounded-xl p-3 mb-4">
                  <p className="text-green-300 text-xs leading-relaxed">
                    Pay via M-Pesa STK Push. You&apos;ll get a prompt on your phone to confirm with
                    your PIN. Perfect for Kenya-based Pioneers.
                  </p>
                </div>
              )}

              <button
                onClick={handleBookClick}
                className="w-full text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-base mb-3 relative overflow-hidden group"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                  border: '1px solid rgb(var(--color-accent-rgb) / 0.35)',
                }}
              >
                <span className="relative z-10">Book This Venture — {formatPackagePrice(pkg)}</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                  }}
                />
              </button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Shield size={11} />
                  <span>48hr free cancel</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={11} />
                  <span>Verified provider</span>
                </div>
              </div>

              {/* UTAMADUNI impact nudge */}
              <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-3 mb-4">
                <p className="text-gray-400 text-xs text-center">
                  🌱 <span className="text-brand-accent font-medium">KES 50</span> from your booking
                  funds UTAMADUNI community work
                </p>
              </div>

              {/* Quick info */}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Max group size</span>
                  <span className="font-medium text-gray-200">{pkg.maxGuests} people</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-medium text-gray-200">{pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Provider</span>
                  <span className="font-medium text-gray-200">{pkg.provider}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Destination</span>
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
            <h2 className="text-xl font-bold text-white mb-phi-5">More Ventures to Explore</h2>
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
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
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

      {/* Mobile sticky CTA — visible only on mobile where sidebar is below fold */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-brand-bg/95 backdrop-blur-sm border-t border-gray-800 px-4 py-3 safe-bottom">
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          <div>
            <div className="text-white font-bold text-lg">{formatPackagePrice(pkg)}</div>
            <div className="text-gray-400 text-xs">
              {pkg.duration} · {pkg.destination}
            </div>
          </div>
          <button
            onClick={handleBookClick}
            className="text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              border: '1px solid rgb(var(--color-accent-rgb) / 0.35)',
            }}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* M-Pesa Modal */}
      <MpesaModal
        isOpen={mpesaOpen}
        onClose={() => setMpesaOpen(false)}
        amount={totalPrice}
        currency="KES"
        description="Safari booking"
        itemType="venture"
        itemId={id}
        onSuccess={handleMpesaSuccess}
      />
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Compass,
  MapPin,
  ArrowRight,
  Plane,
  CreditCard,
  Briefcase,
  Shield,
  Globe,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import { COUNTRY_ROUTES, getRecommendedRoutes } from '@/lib/compass'
import { useIdentity } from '@/lib/identity-context'

/* ── Country name lookup ──────────────────────────────────────────── */
const COUNTRY_NAMES: Record<string, string> = {
  KE: 'Kenya',
  DE: 'Germany',
  GB: 'United Kingdom',
  AE: 'United Arab Emirates',
  US: 'United States',
  CA: 'Canada',
  NG: 'Nigeria',
  ZA: 'South Africa',
  TZ: 'Tanzania',
  UG: 'Uganda',
  RW: 'Rwanda',
  GH: 'Ghana',
  FR: 'France',
  NL: 'Netherlands',
  IN: 'India',
  CH: 'Switzerland',
}

/* ── Country flag emoji ───────────────────────────────────────────── */
function flag(code: string) {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

/* ── Strength badge ───────────────────────────────────────────────── */
function StrengthBadge({ strength }: { strength: string }) {
  const config = {
    direct: {
      label: 'Direct Route',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    partner: {
      label: 'Partner Route',
      color: 'bg-brand-accent/20 text-brand-accent border-brand-accent/30',
    },
    emerging: { label: 'Emerging Route', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  }[strength] || { label: strength, color: 'bg-white/10 text-white/60 border-white/10' }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-phi-xs font-medium border ${config.color}`}
    >
      <Sparkles className="w-3 h-3" />
      {config.label}
    </span>
  )
}

/* ── Route card ───────────────────────────────────────────────────── */
function RouteCard({
  routeKey,
  selected,
  onClick,
}: {
  routeKey: string
  selected: boolean
  onClick: () => void
}) {
  const route = COUNTRY_ROUTES[routeKey]
  if (!route) return null
  const [from, to] = routeKey.split('-')
  const toName = COUNTRY_NAMES[to] || to

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border p-5 transition-all duration-300 ${
        selected
          ? 'bg-brand-primary/30 border-brand-accent/50 shadow-lg shadow-brand-accent/10'
          : 'bg-brand-surface border-white/[0.06] hover:border-white/20 hover:bg-white/[0.03]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-phi-lg">{flag(from)}</span>
          <ArrowRight className="w-4 h-4 text-white/30" />
          <span className="text-phi-lg">{flag(to)}</span>
        </div>
        <StrengthBadge strength={route.strength} />
      </div>

      {/* Destination */}
      <h3 className="text-white font-bold text-phi-base mb-1">{toName}</h3>

      {/* Top sectors */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {route.primarySectors.slice(0, 3).map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 bg-white/[0.06] rounded-full text-phi-xs text-white/50"
          >
            {s}
          </span>
        ))}
        {route.primarySectors.length > 3 && (
          <span className="px-2 py-0.5 text-phi-xs text-white/30">
            +{route.primarySectors.length - 3}
          </span>
        )}
      </div>

      {/* Expand indicator */}
      <ChevronRight
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform ${
          selected ? 'rotate-90 text-brand-accent' : 'text-white/20 group-hover:text-white/40'
        }`}
      />
    </button>
  )
}

/* ── Main Compass Page ────────────────────────────────────────────── */
export default function CompassPage() {
  const { identity } = useIdentity()
  const originCountry = identity.country || 'KE'
  const originName = COUNTRY_NAMES[originCountry] || originCountry

  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  // Outbound routes (from user's country)
  const outboundKeys = useMemo(() => {
    const targets = getRecommendedRoutes(originCountry)
    return targets.map((to) => `${originCountry}-${to}`)
  }, [originCountry])

  // Inbound routes (to user's country)
  const inboundKeys = useMemo(() => {
    return Object.keys(COUNTRY_ROUTES).filter((k) => {
      const [, to] = k.split('-')
      return to === originCountry
    })
  }, [originCountry])

  const selectedRouteData = selectedRoute ? COUNTRY_ROUTES[selectedRoute] : null
  const selectedTo = selectedRoute ? selectedRoute.split('-')[1] : null

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-phi-xs font-medium mb-6">
            <Compass className="w-4 h-4" />
            Route Compass
          </div>
          <h1 className="text-phi-2xl md:text-phi-3xl font-bold text-white mb-3">
            Find Your Route
          </h1>
          <p className="text-white/50 text-phi-base max-w-xl mx-auto">
            Discover the best corridors for your skills, languages, and goals. Each Route connects
            you to Paths, Pioneers, and opportunities abroad.
          </p>

          {/* Origin badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-surface border border-white/[0.06]">
            <MapPin className="w-4 h-4 text-brand-accent" />
            <span className="text-white/60 text-phi-sm">Your origin:</span>
            <span className="text-white font-bold text-phi-sm">
              {flag(originCountry)} {originName}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* Outbound Routes */}
        {outboundKeys.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-5 h-5 text-brand-accent" />
              <h2 className="text-phi-lg font-bold text-white">Routes from {originName}</h2>
              <span className="text-white/30 text-phi-sm">({outboundKeys.length} corridors)</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {outboundKeys.map((key) => (
                <RouteCard
                  key={key}
                  routeKey={key}
                  selected={selectedRoute === key}
                  onClick={() => setSelectedRoute(selectedRoute === key ? null : key)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Inbound Routes */}
        {inboundKeys.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h2 className="text-phi-lg font-bold text-white">Routes to {originName}</h2>
              <span className="text-white/30 text-phi-sm">({inboundKeys.length} corridors)</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {inboundKeys.map((key) => (
                <RouteCard
                  key={key}
                  routeKey={key}
                  selected={selectedRoute === key}
                  onClick={() => setSelectedRoute(selectedRoute === key ? null : key)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Selected Route Detail Panel */}
        {selectedRouteData && selectedTo && (
          <section className="rounded-2xl border border-brand-accent/20 bg-gradient-to-br from-brand-surface to-brand-primary/10 p-6 md:p-8 mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Left — Info */}
              <div className="flex-1 space-y-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-phi-xl">{flag(selectedRoute!.split('-')[0])}</span>
                    <ArrowRight className="w-5 h-5 text-brand-accent" />
                    <span className="text-phi-xl">{flag(selectedTo)}</span>
                    <StrengthBadge strength={selectedRouteData.strength} />
                  </div>
                  <h3 className="text-phi-lg font-bold text-white">
                    {COUNTRY_NAMES[selectedRoute!.split('-')[0]]} →{' '}
                    {COUNTRY_NAMES[selectedTo] || selectedTo}
                  </h3>
                </div>

                {/* Visa */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-emerald-500/10">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-phi-xs font-medium uppercase tracking-wider mb-1">
                      Visa Info
                    </p>
                    <p className="text-white/80 text-phi-sm leading-relaxed">
                      {selectedRouteData.visaNote}
                    </p>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-brand-accent/10">
                    <CreditCard className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-white/40 text-phi-xs font-medium uppercase tracking-wider mb-1">
                      Payment Methods
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRouteData.paymentMethods.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-1 bg-white/[0.06] rounded-lg text-phi-xs text-white/70 border border-white/[0.06]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sectors */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-blue-500/10">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-phi-xs font-medium uppercase tracking-wider mb-1">
                      Top Sectors
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRouteData.primarySectors.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 bg-white/[0.06] rounded-lg text-phi-xs text-white/70 border border-white/[0.06]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — CTAs */}
              <div className="flex flex-col gap-3 md:w-56 shrink-0">
                <Link
                  href={`/exchange?focus=${selectedRouteData.primarySectors[0]?.toLowerCase().replace(/\s+/g, '-') || ''}`}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-accent text-white font-bold text-phi-sm hover:opacity-90 transition-opacity"
                >
                  <Briefcase className="w-4 h-4" />
                  Explore Paths
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06] text-white font-medium text-phi-sm hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Find Pioneers
                </Link>
                <Link
                  href={`/be/${selectedTo.toLowerCase()}`}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.04] text-white/60 text-phi-sm hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  View {COUNTRY_NAMES[selectedTo] || selectedTo} Gate
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Empty state when no routes */}
        {outboundKeys.length === 0 && inboundKeys.length === 0 && (
          <div className="text-center py-16">
            <p className="text-phi-2xl mb-4">🧭</p>
            <h2 className="text-phi-lg font-bold text-white mb-2">No routes mapped yet</h2>
            <p className="text-white/50 text-phi-sm mb-6 max-w-md mx-auto">
              Routes for {originName} are being mapped. In the meantime, explore Paths on the
              Exchange or connect with Pioneers.
            </p>
            <Link
              href="/exchange"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-accent text-white font-bold hover:opacity-90 transition-opacity"
            >
              Explore Exchange <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

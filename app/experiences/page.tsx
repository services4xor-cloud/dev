'use client'

import Link from 'next/link'
import { MapPin, Clock, Users, Star, Fish, Leaf, Camera, Globe } from 'lucide-react'
import { SAFARI_PACKAGES } from '@/lib/safari-packages'

const TYPE_ICONS = {
  deep_sea_fishing: Fish,
  wildlife_safari:  Camera,
  eco_lodge:        Leaf,
  cultural:         Globe,
}

const TYPE_LABELS = {
  deep_sea_fishing: 'Deep Sea Fishing',
  wildlife_safari:  'Wildlife Safari',
  eco_lodge:        'Eco Lodge',
  cultural:         'Cultural',
}

function formatPrice(pkg: typeof SAFARI_PACKAGES[0]): string {
  if (pkg.priceEUR) return `€${pkg.priceEUR}`
  if (pkg.priceUSD) return `$${pkg.priceUSD}`
  if (pkg.priceKES) return `KES ${pkg.priceKES.toLocaleString()}`
  return 'Contact for price'
}

export default function ExperiencesPage() {
  const available = SAFARI_PACKAGES.filter(p => p.status === 'available')
  const comingSoon = SAFARI_PACKAGES.filter(p => p.status === 'coming_soon')

  return (
    <div className="min-h-screen bg-[#0A0A0F]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative pt-20 pb-16 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 60%)' }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 text-[#C9A227] text-sm font-medium mb-6">
            <Leaf className="w-3.5 h-3.5" />
            Kenya Experiences · Verified operators
          </div>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
            Experiences that<br />
            <span style={{ color: '#C9A227' }}>change your world.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            From the game-rich plains of the Maasai Mara to the deep waters of Lake Victoria —
            every experience is run by a verified Anchor with real community impact.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              KES 50 per booking → UTAMADUNI
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#C9A227]" />
              Verified Anchor operators only
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
              {available.length} experiences available now
            </span>
          </div>
        </div>
      </section>

      {/* ── Experience Cards ───────────────────────────────────────── */}
      <section className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#C9A227' }}>
              Available Now
            </p>
            <h2 className="text-2xl font-bold text-white">{available.length} Experiences</h2>
          </div>
          <Link
            href="/ventures"
            className="text-sm text-[#C9A227]/70 hover:text-[#C9A227] transition-colors"
          >
            See all Ventures →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {available.map(pkg => {
            const Icon = TYPE_ICONS[pkg.type] ?? Camera
            return (
              <Link
                key={pkg.id}
                href={`/experiences/${pkg.id}`}
                className="group block rounded-2xl border border-gray-800 bg-gray-900/60 hover:border-[#C9A227]/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                {/* Image placeholder with gradient */}
                <div
                  className="h-44 flex items-end p-4 relative"
                  style={{ background: 'linear-gradient(135deg, #5C0A14 0%, #1a0a0f 100%)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Icon className="w-32 h-32 text-[#C9A227]" />
                  </div>
                  <div className="relative z-10 flex items-end justify-between w-full">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/25">
                      <Icon className="w-3 h-3" />
                      {TYPE_LABELS[pkg.type]}
                    </span>
                    <span className="text-xl font-black text-white">
                      {formatPrice(pkg)}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-[#C9A227] transition-colors leading-snug">
                    {pkg.name}
                  </h3>
                  <p className="text-[#C9A227]/70 text-xs mb-3 font-medium">{pkg.provider}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{pkg.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{pkg.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />Max {pkg.maxGuests}
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {pkg.highlights.slice(0, 2).join(' · ')}
                  </p>

                  {pkg.priceNote && (
                    <p className="text-[#C9A227]/50 text-xs mt-2 italic">{pkg.priceNote}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-6">
              Coming Soon
            </p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {comingSoon.map(pkg => (
                <div
                  key={pkg.id}
                  className="rounded-2xl border border-gray-800/50 bg-gray-900/30 p-5 opacity-60"
                >
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-500 border border-gray-700 mb-3">
                    Coming soon
                  </div>
                  <h3 className="text-gray-400 font-semibold text-sm">{pkg.name}</h3>
                  <p className="text-gray-600 text-xs mt-1">{pkg.destination}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── UTAMADUNI callout ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 xl:px-8 py-12">
        <div
          className="rounded-2xl p-8 text-center border border-[#C9A227]/20"
          style={{ background: 'linear-gradient(135deg, #5C0A14 0%, #0A0A0F 100%)' }}
        >
          <div className="text-3xl mb-3">🌿</div>
          <h3 className="text-xl font-bold text-white mb-2">Every booking feeds the mission</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
            KES 50 from every booking flows directly to UTAMADUNI — funding local guides, conservation
            workers, and cultural educators in the communities that make these experiences possible.
          </p>
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#C9A227] hover:text-[#D4AF37] transition-colors"
          >
            Learn about UTAMADUNI →
          </Link>
        </div>
      </section>

    </div>
  )
}

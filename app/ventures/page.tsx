'use client'

/**
 * Ventures — Unified feed of Paths + Experiences
 *
 * Single filter system: one row of category chips controls everything.
 * Previously had TWO overlapping filter systems (activePioneer + activeTab) — now unified.
 *
 * Filter categories map to:
 *   'all'          → all paths + all safari packages
 *   'explorer'     → safari/eco-tourism experiences only
 *   'professional' → professional & healthcare paths
 *   'creative'     → creative & media paths
 *   'community'    → community & guardian paths
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Star, Zap, Globe, ArrowRight } from 'lucide-react'
import { VOCAB } from '@/lib/vocabulary'
import { SAFARI_PACKAGES, formatPackagePrice } from '@/lib/safari-packages'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import type { FilterCategory, PathListItem } from '@/types/domain'

// ─────────────────────────────────────────────────────────────────────────────
// Filter config
// ─────────────────────────────────────────────────────────────────────────────

const FILTERS: { id: FilterCategory; label: string; icon: string; desc: string }[] = [
  { id: 'all', label: 'All Ventures', icon: '🌍', desc: 'Everything' },
  { id: 'explorer', label: 'Explorer', icon: '🌿', desc: 'Safaris & eco-tourism' },
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Tech, finance, healthcare' },
  { id: 'creative', label: 'Creative', icon: '🎬', desc: 'Media, design, arts' },
  { id: 'community', label: 'Community', icon: '🤝', desc: 'Social impact & guardian' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function VenturesPage() {
  const [filter, setFilter] = useState<FilterCategory>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const featuredSafari =
    SAFARI_PACKAGES.find((p) => p.id === 'maasai-mara-3day') ?? SAFARI_PACKAGES[0]

  const filteredPaths = MOCK_VENTURE_PATHS.filter((p) => filter === 'all' || p.category === filter)

  const showSafaris = filter === 'all' || filter === 'explorer'
  const visibleSafaris = SAFARI_PACKAGES.slice(0, filter === 'explorer' ? 6 : 3)

  const featuredPaths = filteredPaths.filter((p) => p.isFeatured)
  const regularPaths = filteredPaths.filter((p) => !p.isFeatured)

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="pt-16 pb-10 px-4 text-center"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 65%)',
        }}
      >
        <div className="max-w-4xl 3xl:max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
            </span>
            {MOCK_VENTURE_PATHS.length + SAFARI_PACKAGES.length}+ open ventures across 30+ countries
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 3xl:text-7xl font-bold text-white mb-4 leading-tight">
            Open Paths.
            <br />
            <span style={{ color: 'var(--color-accent)' }}>Real Ventures.</span>
            <br />
            Your Chapter Starts Here.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            From Maasai Mara game drives to London fintech floors — every path here is a real
            chapter waiting to be written by a Pioneer like you.
          </p>

          {/* ── Unified filter — one row, no duplicates ── */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === f.id
                    ? 'bg-brand-primary text-brand-accent border border-brand-accent/50 shadow-lg shadow-brand-primary/40'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 pb-20 space-y-12">
        {/* ── Loading skeleton ─────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-6 animate-pulse -mt-4">
            {/* Featured card skeleton */}
            <div className="rounded-2xl h-32 bg-gray-800/60 border border-gray-700/50" />
            {/* Section header skeleton */}
            <div className="h-6 w-48 bg-gray-800/60 rounded-lg" />
            {/* Card grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-900/60 border border-brand-primary/30 rounded-2xl overflow-hidden"
                >
                  <div className="h-36 bg-gray-800/40" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-20 bg-gray-800/60 rounded-full" />
                    <div className="h-4 w-full bg-gray-800/60 rounded" />
                    <div className="h-3 w-2/3 bg-gray-800/40 rounded" />
                    <div className="flex justify-between">
                      <div className="h-5 w-24 bg-gray-800/60 rounded" />
                      <div className="h-4 w-16 bg-gray-800/40 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Path list skeleton */}
            <div className="h-6 w-36 bg-gray-800/60 rounded-lg" />
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-gray-900/60 border border-brand-primary/30"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-800/60 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-800/60 rounded" />
                  <div className="h-3 w-1/2 bg-gray-800/40 rounded" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-gray-800/40 rounded-full" />
                    <div className="h-5 w-20 bg-gray-800/40 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Featured Maasai Mara card ─────────────────────────────────── */}
        {!loading && showSafaris && (
          <Link href={`/experiences/${featuredSafari.id}`} className="block -mt-4">
            <div
              className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border hover:scale-[1.01] transition-transform duration-200 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #7B3F00 0%, var(--color-accent) 100%)',
                border: '1px solid var(--color-accent)50',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">🦁</div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-accent text-brand-bg text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      Featured Venture
                    </span>
                    <span className="text-white/70 text-xs">{featuredSafari.provider}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{featuredSafari.name}</h3>
                  <p className="text-white/80 text-sm">
                    {featuredSafari.destination} · {featuredSafari.duration} · Max{' '}
                    {featuredSafari.maxGuests} Pioneers
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-black text-white">
                  {formatPackagePrice(featuredSafari)}
                </div>
                <div className="text-white/60 text-xs mb-3">{featuredSafari.priceNote}</div>
                <div className="inline-flex items-center gap-1.5 bg-brand-accent text-brand-primary font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-accent/80 transition-colors">
                  {VOCAB.chapter_open} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Explorer Ventures (safari packages) ──────────────────────── */}
        {!loading && showSafaris && visibleSafaris.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🌿 <span>Explorer Ventures</span>
                <span className="text-xs font-normal text-gray-400 ml-1">
                  {visibleSafaris.length} available
                </span>
              </h2>
              <Link
                href="/experiences"
                className="text-brand-accent text-sm font-medium hover:text-brand-accent/70 flex items-center gap-1 transition-colors"
              >
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleSafaris.map((pkg) => (
                <Link key={pkg.id} href={`/experiences/${pkg.id}`}>
                  <div className="bg-gray-900/60 border border-brand-primary/30 rounded-2xl overflow-hidden hover:border-brand-accent/40 hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-200 h-full group">
                    {/* Image area */}
                    <div
                      className="h-36 flex items-center justify-center text-5xl"
                      style={{ background: 'linear-gradient(135deg, #3D1A00, #7B3F00)' }}
                    >
                      {pkg.type === 'deep_sea_fishing'
                        ? '🎣'
                        : pkg.type === 'wildlife_safari'
                          ? '🦁'
                          : pkg.type === 'eco_lodge'
                            ? '🏡'
                            : '🎭'}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-brand-primary/60 text-brand-accent border border-brand-accent/20">
                          {pkg.type === 'wildlife_safari'
                            ? '🦁 Wildlife Safari'
                            : pkg.type === 'eco_lodge'
                              ? '🏡 Eco-Lodge'
                              : pkg.type === 'deep_sea_fishing'
                                ? '🎣 Deep Sea'
                                : '🎭 Cultural'}
                        </span>
                        {pkg.season === 'high' && (
                          <span className="text-xs text-brand-accent font-medium">High Season</span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-sm leading-tight mb-1 group-hover:text-brand-accent transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                        {pkg.highlights.slice(0, 2).join(' · ')}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-black text-white text-base">
                            {formatPackagePrice(pkg)}
                          </span>
                          <span className="text-gray-400 text-xs ml-1">/ person</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          {pkg.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Featured Paths (highlighted) ─────────────────────────────── */}
        {!loading && featuredPaths.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-4 h-4 text-brand-accent" />
              <h2 className="text-xl font-bold text-white">Featured Paths</h2>
              <span className="text-xs font-normal text-gray-400">{featuredPaths.length} open</span>
            </div>
            <div className="space-y-3">
              {featuredPaths.map((path) => (
                <PathCard key={path.id} path={path} featured />
              ))}
            </div>
          </section>
        )}

        {/* ── All / Regular Paths ───────────────────────────────────────── */}
        {!loading && regularPaths.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {filter === 'explorer'
                  ? '🌿 Explorer Paths'
                  : filter === 'professional'
                    ? '💼 Professional Paths'
                    : filter === 'creative'
                      ? '🎬 Creative Paths'
                      : filter === 'community'
                        ? '🤝 Community Paths'
                        : '💼 All Paths'}
                <span className="text-xs font-normal text-gray-400">
                  {filteredPaths.length} open
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {regularPaths.map((path) => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          </section>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!loading && filteredPaths.length === 0 && !showSafaris && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🧭</div>
            <p className="text-xl font-semibold text-white mb-2">No Paths match this filter yet</p>
            <p className="text-gray-400 text-sm mb-6">
              New paths are added every day. Check back or try another category.
            </p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold border border-brand-accent/30 hover:bg-brand-primary-light transition-colors"
            >
              Show all ventures
            </button>
          </div>
        )}

        {/* ── CTA strip ─────────────────────────────────────────────────── */}
        {!loading && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
              border: '1px solid rgb(var(--color-accent-rgb) / 0.25)',
            }}
          >
            <Globe className="w-8 h-8 text-brand-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Are you an Anchor?</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Post a Path and reach 12,000+ Pioneers across 50+ countries. Local payment rails
              included.
            </p>
            <Link
              href="/anchors/post-path"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white border border-brand-accent/40 hover:bg-brand-accent/10 transition-colors"
            >
              Post a Path →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PathCard sub-component
// ─────────────────────────────────────────────────────────────────────────────

function PathCard({ path, featured = false }: { path: PathListItem; featured?: boolean }) {
  return (
    <Link href={`/ventures/${path.id}`}>
      <div
        className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.005] hover:shadow-lg ${
          featured
            ? 'bg-brand-primary/20 border-brand-accent/30 hover:border-brand-accent/60 hover:shadow-brand-primary/30'
            : 'bg-gray-900/60 border-brand-primary/30 hover:border-brand-accent/30 hover:shadow-brand-primary/20'
        }`}
      >
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            featured ? 'bg-brand-primary/60 border border-brand-accent/20' : 'bg-gray-800'
          }`}
        >
          {path.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3
              className={`font-bold text-base leading-tight group-hover:text-brand-accent transition-colors ${
                featured ? 'text-brand-accent' : 'text-white'
              }`}
            >
              {path.title}
            </h3>
            {featured && (
              <span className="flex-shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-accent text-brand-bg uppercase tracking-wide">
                Featured
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 mb-3">
            <span className="font-medium text-gray-300">{path.anchorName}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {path.location}
            </span>
            {path.isRemote && (
              <span className="text-brand-accent text-xs font-semibold">Remote</span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {path.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm flex-shrink-0">
              <span className="font-bold text-white">{path.salary}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {path.posted}
              </span>
            </div>
          </div>
          {path.pioneersNeeded && (
            <div className="mt-2 text-xs text-brand-accent/80 flex items-center gap-1">
              <Star className="w-3 h-3" />
              {path.pioneersNeeded} Pioneer{path.pioneersNeeded > 1 ? 's' : ''} needed
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

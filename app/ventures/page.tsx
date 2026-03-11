'use client'

/**
 * Ventures — Bolt-style direct engagement feed
 *
 * NOT a job board. Like Bolt: open → see exactly what you need → engage.
 *
 * Ranking algorithm (identity-driven):
 *   1. YOUR country paths first (local demand)
 *   2. Corridor partner paths (where money flows)
 *   3. Remote/global paths (accessible from anywhere)
 *   4. Everything else fills in — NEVER empty
 *
 * Shows country flag + currency on every card so you see the
 * business context instantly (currency leverage, corridor strength).
 */

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  MapPin,
  Clock,
  Star,
  Zap,
  Globe,
  ArrowRight,
  Database,
  TrendingUp,
  Users,
} from 'lucide-react'
import { VOCAB, PIONEER_TYPES, type PioneerType } from '@/lib/vocabulary'
import { SAFARI_PACKAGES, formatPackagePrice } from '@/lib/safari-packages'
import { usePaths } from '@/lib/hooks/use-paths'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import type { FilterCategory, PathListItem } from '@/types/domain'

// ─────────────────────────────────────────────────────────────────────────────
// Filter config
// ─────────────────────────────────────────────────────────────────────────────

// Filter labels are resolved at render time via useTranslation
const FILTER_DEFS: { id: FilterCategory; labelKey: string; icon: string }[] = [
  { id: 'all', labelKey: 'ventures.allVentures', icon: '🌍' },
  { id: 'explorer', labelKey: 'ventures.explorer', icon: '🌿' },
  { id: 'professional', labelKey: 'ventures.professional', icon: '💼' },
  { id: 'creative', labelKey: 'ventures.creative', icon: '🎬' },
  { id: 'community', labelKey: 'ventures.community', icon: '🤝' },
]

/** Map pioneer types → filter category for auto-filtering */
const TYPE_TO_FILTER: Partial<Record<PioneerType, FilterCategory>> = {
  explorer: 'explorer',
  professional: 'professional',
  artisan: 'creative',
  creator: 'creative',
  guardian: 'community',
  healer: 'community',
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function VenturesPage() {
  const searchParams = useSearchParams()
  const { identity, brandName, localizeCountry } = useIdentity()
  const { t } = useTranslation()

  // ── Read Compass flags from URL ──────────────────────────────────────────
  const compassType = (searchParams.get('type') as PioneerType) ?? ''
  const pioneerTypeInfo = compassType ? PIONEER_TYPES[compassType] : null

  // ── Filter state ─────────────────────────────────────────────────────────
  const initialFilter: FilterCategory = compassType ? (TYPE_TO_FILTER[compassType] ?? 'all') : 'all'
  const [filter, setFilter] = useState<FilterCategory>(initialFilter)

  // Fetch + rank paths (ranked by identity context automatically)
  const {
    paths: allPaths,
    total,
    loading,
    fromDB,
    localCount,
    corridorCount,
  } = usePaths({
    limit: 50,
  })

  // Current identity info
  const myCountry = COUNTRY_OPTIONS.find((c) => c.code === identity.country)
  const myFlag = myCountry?.flag ?? '🌍'
  const myCurrency = myCountry?.currency ?? 'USD'

  // Safari packages — Kenya-specific
  const featuredSafari =
    SAFARI_PACKAGES.find((p) => p.id === 'maasai-mara-3day') ?? SAFARI_PACKAGES[0]
  const showSafaris = (filter === 'all' || filter === 'explorer') && identity.country === 'KE'
  const visibleSafaris = SAFARI_PACKAGES.slice(0, filter === 'explorer' ? 6 : 3)

  // Apply category filter
  const filteredPaths = allPaths.filter((p) => filter === 'all' || p.category === filter)
  const featuredPaths = filteredPaths.filter((p) => p.isFeatured)
  const regularPaths = filteredPaths.filter((p) => !p.isFeatured)

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* ── Compact Hero — action-first, no fluff ─────────────────────── */}
      <section
        className="pt-14 pb-8 px-4"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 60%)',
        }}
      >
        <div className="max-w-5xl 3xl:max-w-6xl mx-auto">
          {/* Context bar — what you're seeing and why */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent" />
              </span>
              {total + (showSafaris ? SAFARI_PACKAGES.length : 0)}{' '}
              {t('ventures.allVentures').toLowerCase()}
              {fromDB && (
                <span className="ml-1 flex items-center gap-0.5 text-green-400 text-[10px]">
                  <Database className="w-2.5 h-2.5" /> Live
                </span>
              )}
            </div>

            {/* Demand signals */}
            {localCount > 0 && (
              <span className="text-xs text-white/50 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                {localCount} in {myFlag} {localizeCountry(identity.country)}
              </span>
            )}
            {corridorCount > 0 && (
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Globe className="w-3 h-3 text-brand-accent/60" />
                {corridorCount} from corridor partners
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {myFlag}{' '}
            {pioneerTypeInfo ? (
              <>
                <span className="text-brand-accent">{pioneerTypeInfo.label}</span> Paths
              </>
            ) : (
              <>
                {t('ventures.openPaths')} <span className="text-brand-accent">{myCurrency}</span>
              </>
            )}
          </h1>
          <p className="text-gray-400 text-sm mb-6 max-w-lg">
            Ranked by relevance to your identity. Local first, corridors next, global always
            available.
          </p>

          {/* ── Filter chips — compact ── */}
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_DEFS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  filter === f.id
                    ? 'bg-brand-primary text-brand-accent border border-brand-accent/50 shadow-lg shadow-brand-primary/40'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{f.icon}</span>
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 pb-20 space-y-8">
        {/* ── Loading skeleton ─────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-900/60 border border-brand-primary/30"
              >
                <div className="w-11 h-11 rounded-lg bg-gray-800/60 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-800/60 rounded" />
                  <div className="h-3 w-1/2 bg-gray-800/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Featured Safari (Kenya only) ────────────────────────────── */}
        {!loading && showSafaris && (
          <Link href={`/experiences/${featuredSafari.id}`} className="block">
            <div
              className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border hover:scale-[1.005] transition-transform duration-200"
              style={{
                background: 'linear-gradient(135deg, #7B3F00 0%, var(--color-accent) 100%)',
                border: '1px solid var(--color-accent)50',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">🦁</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-brand-accent text-brand-bg text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Featured
                    </span>
                    <span className="text-white/60 text-[10px]">{featuredSafari.provider}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{featuredSafari.name}</h3>
                  <p className="text-white/70 text-xs">
                    {featuredSafari.destination} · {featuredSafari.duration}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xl font-black text-white">
                  {formatPackagePrice(featuredSafari)}
                </div>
                <div className="text-white/50 text-[10px] mb-2">{featuredSafari.priceNote}</div>
                <div className="inline-flex items-center gap-1 bg-brand-accent text-brand-primary font-bold px-4 py-2 rounded-lg text-xs">
                  {VOCAB.chapter_open} <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Safari grid (Kenya only) ────────────────────────────────── */}
        {!loading && showSafaris && visibleSafaris.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                🌿 {t('ventures.explorerVentures')}
                <span className="text-[10px] font-normal text-gray-500">
                  {visibleSafaris.length} available
                </span>
              </h2>
              <Link
                href="/experiences"
                className="text-brand-accent text-xs font-medium hover:text-brand-accent/70 flex items-center gap-1"
              >
                {t('ventures.seeAll')} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleSafaris.map((pkg) => (
                <Link key={pkg.id} href={`/experiences/${pkg.id}`}>
                  <div className="bg-gray-900/60 border border-brand-primary/30 rounded-xl overflow-hidden hover:border-brand-accent/40 transition-all duration-200 h-full group">
                    <div
                      className="h-28 flex items-center justify-center text-4xl"
                      style={{ background: 'var(--gradient-experience)' }}
                    >
                      {pkg.type === 'deep_sea_fishing'
                        ? '🎣'
                        : pkg.type === 'wildlife_safari'
                          ? '🦁'
                          : pkg.type === 'eco_lodge'
                            ? '🏡'
                            : '🎭'}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-white text-sm leading-tight mb-1 group-hover:text-brand-accent transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-sm">
                          {formatPackagePrice(pkg)}
                        </span>
                        <span className="text-gray-500 text-[10px] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {pkg.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Featured Paths ──────────────────────────────────────────── */}
        {!loading && featuredPaths.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-brand-accent" />
              <h2 className="text-lg font-bold text-white">{t('ventures.featuredPaths')}</h2>
              <span className="text-[10px] text-gray-500">{featuredPaths.length} open</span>
            </div>
            <div className="space-y-2">
              {featuredPaths.map((path) => (
                <PathCard key={path.id} path={path} featured myCountry={identity.country} />
              ))}
            </div>
          </section>
        )}

        {/* ── All Paths (ranked by identity) ──────────────────────────── */}
        {!loading && regularPaths.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-white">
                {filter !== 'all'
                  ? `${FILTER_DEFS.find((f) => f.id === filter)?.icon} ${t(FILTER_DEFS.find((f) => f.id === filter)?.labelKey ?? 'ventures.allVentures')} Paths`
                  : `💼 ${t('ventures.allVentures')}`}
              </h2>
              <span className="text-[10px] text-gray-500">{regularPaths.length} open</span>
            </div>
            <div className="space-y-2">
              {regularPaths.map((path) => (
                <PathCard key={path.id} path={path} myCountry={identity.country} />
              ))}
            </div>
          </section>
        )}

        {/* ── Empty state — should be rare with ranking ───────────────── */}
        {!loading && filteredPaths.length === 0 && !showSafaris && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🧭</div>
            <p className="text-lg font-semibold text-white mb-1">{t('ventures.noMatch')}</p>
            <p className="text-gray-400 text-xs mb-4">{t('ventures.noMatchHint')}</p>
            <button
              onClick={() => setFilter('all')}
              className="px-5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold border border-brand-accent/30 hover:bg-brand-primary-light transition-colors"
            >
              {t('ventures.showAll')}
            </button>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        {!loading && (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
              border: '1px solid rgb(var(--color-accent-rgb) / 0.25)',
            }}
          >
            <Globe className="w-6 h-6 text-brand-accent mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">{t('ventures.areYouAnchor')}</h3>
            <p className="text-gray-400 text-xs mb-4 max-w-md mx-auto">{t('ventures.anchorCta')}</p>
            <Link
              href="/anchors/post-path"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-white border border-brand-accent/40 hover:bg-brand-accent/10 transition-colors"
            >
              {t('ventures.postPath')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PathCard — shows country flag + currency for business context
// ─────────────────────────────────────────────────────────────────────────────

function PathCard({
  path,
  featured = false,
  myCountry,
}: {
  path: PathListItem
  featured?: boolean
  myCountry: string
}) {
  const pathCountry = COUNTRY_OPTIONS.find((c) => c.code === path.country)
  const isLocal = path.country === myCountry
  const isRemote = path.isRemote

  return (
    <Link href={`/ventures/${path.id}`}>
      <div
        className={`group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.003] hover:shadow-lg ${
          featured
            ? 'bg-brand-primary/20 border-brand-accent/30 hover:border-brand-accent/60'
            : isLocal
              ? 'bg-gray-900/80 border-brand-primary/40 hover:border-brand-accent/30'
              : 'bg-gray-900/40 border-gray-800/50 hover:border-brand-primary/40'
        }`}
      >
        {/* Icon + country flag */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
              featured ? 'bg-brand-primary/60 border border-brand-accent/20' : 'bg-gray-800/80'
            }`}
          >
            {path.icon}
          </div>
          {/* Country flag badge */}
          <span className="text-sm" title={pathCountry?.name ?? 'Global'}>
            {isRemote ? '🌐' : (pathCountry?.flag ?? '🌍')}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3
              className={`font-bold text-sm leading-tight group-hover:text-brand-accent transition-colors ${
                featured ? 'text-brand-accent' : 'text-white'
              }`}
            >
              {path.title}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {featured && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-brand-accent text-brand-bg uppercase tracking-wide">
                  ★
                </span>
              )}
              {isLocal && !featured && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                  Local
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400 mb-2">
            <span className="font-medium text-gray-300">{path.anchorName}</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {path.location}
            </span>
            {isRemote && <span className="text-brand-accent font-semibold">🌐 Remote</span>}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {path.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800/80 text-gray-500 border border-gray-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs flex-shrink-0">
              <span className="font-bold text-white">{path.salary}</span>
              {pathCountry && !isRemote && (
                <span className="text-[10px] text-gray-500 font-mono">{pathCountry.currency}</span>
              )}
              <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {path.posted}
              </span>
            </div>
          </div>

          {path.pioneersNeeded && path.pioneersNeeded > 1 && (
            <div className="mt-1.5 text-[10px] text-brand-accent/70 flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              {path.pioneersNeeded} Pioneers needed — active demand
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

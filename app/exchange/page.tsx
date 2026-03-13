'use client'

/**
 * Exchange — Smart feed of People + Opportunities
 *
 * People are AI agent personas scored via the 8-dimension engine.
 * Opportunities come from mock venture paths.
 *
 * Filters: type (All / People / Opportunities), sector
 * Sorted by dimension score descending.
 */

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, Filter, Users, Briefcase, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { areSkillsEquivalent } from '@/lib/semantic-skills'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
// Real paths fetched from /api/paths (Prisma → Neon PostgreSQL)
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { computeCompleteness } from '@/lib/profile-completeness'
import type { DimensionPriority } from '@/lib/hooks/use-profile-sync'
import { getSignalsForRegion } from '@/lib/market-data'
import ExchangeCard, { type ExchangeCardData } from '@/components/ExchangeCard'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'
import SectionHeader from '@/components/SectionHeader'

// ─── Helpers ────────────────────────────────────────────────────────

/** Resolve language codes to display names */
function langCodeToName(code: string): string {
  const lang = LANGUAGE_REGISTRY[code as LanguageCode]
  return lang ? lang.name : code
}

/** Build DimensionProfile from user identity */
function identityToProfile(identity: {
  country: string
  city?: string
  languages: string[]
  interests: string[]
  faith: string[]
  craft?: string[]
  reach?: string[]
  culture?: string
}): DimensionProfile {
  return {
    country: identity.country,
    city: identity.city,
    languages: identity.languages,
    faith: identity.faith,
    craft: identity.craft ?? [],
    interests: identity.interests,
    reach: identity.reach ?? [],
    culture: identity.culture,
    isHuman: true,
  }
}

/** Build DimensionProfile from an AI agent */
function agentToProfile(agent: AgentPersona): DimensionProfile {
  return {
    country: agent.country,
    city: agent.city,
    languages: agent.languages,
    faith: agent.faith,
    craft: agent.craft,
    interests: agent.interests,
    reach: agent.reach,
    culture: agent.culture,
    isHuman: false,
  }
}

/** Map agent's primary interest to an exchange category */
function agentSector(agent: AgentPersona): { label: string; icon: string } {
  if (agent.interests.length > 0) {
    const cat = EXCHANGE_CATEGORIES.find((c) => c.id === agent.interests[0])
    if (cat) return { label: cat.label, icon: cat.icon }
  }
  return { label: 'General', icon: '🌐' }
}

/** Score a DB path opportunity against user identity, with breakdown */
function scoreDbPath(
  path: {
    skills: string[]
    sector: string | null
    tier: string
    isRemote: boolean
    country: string
  },
  userInterests: string[],
  userCraft: string[],
  userCountry: string
): { score: number; breakdown: ExchangeCardData['matchBreakdown'] & object } {
  let craftScore = 0
  let locationScore = 0
  let marketScore = 0

  // Semantic skill matching against user craft
  const skillMatches = path.skills.filter((skill) =>
    userCraft.some((uc) => areSkillsEquivalent(uc, skill))
  )
  craftScore = Math.min(40, skillMatches.length * 15)

  // Sector / interest matching
  const interestLabels = userInterests
    .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => c!.label.toLowerCase())
  const sectorMatch = interestLabels.some(
    (il) =>
      (path.sector || '').toLowerCase().includes(il) ||
      il.includes((path.sector || '').toLowerCase())
  )
  if (sectorMatch) marketScore += 15

  if (path.tier === 'FEATURED' || path.tier === 'PREMIUM') marketScore += 10
  if (path.isRemote) marketScore += 5
  if (path.country === userCountry) locationScore = 15

  const total = Math.min(100, 25 + craftScore + locationScore + marketScore)
  return {
    score: total,
    breakdown: {
      craft: craftScore,
      location: locationScore,
      market: marketScore,
      language: 0,
      passion: 0,
      faith: 0,
      reach: 0,
      culture: 0,
    },
  }
}

function sectorToIcon(sector: string | null): string {
  switch (sector) {
    case 'tech':
      return '💻'
    case 'healthcare':
      return '🏥'
    case 'safari':
      return '🦁'
    case 'hospitality':
      return '🏨'
    case 'finance':
      return '💰'
    default:
      return '📡'
  }
}

// ─── Filter types ───────────────────────────────────────────────────

type TypeFilter = 'all' | 'people' | 'opportunities'

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangePage() {
  return (
    <Suspense fallback={<ExchangeSkeleton />}>
      <ExchangeInner />
    </Suspense>
  )
}

/** Skeleton shown while Suspense resolves useSearchParams */
function ExchangeSkeleton() {
  return (
    <SectionLayout>
      <div className="mb-phi-5">
        <div className="h-4 w-24 bg-white/5 rounded mb-phi-3" />
        <div className="h-8 w-64 bg-white/5 rounded mb-2" />
        <div className="h-4 w-96 bg-white/5 rounded" />
      </div>
      <div className="grid gap-phi-4 sm:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-brand-surface border border-white/10 rounded-xl p-5 animate-pulse"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  )
}

/** Text search: does `query` match any field of an agent? */
function agentMatchesQuery(agent: AgentPersona, query: string): boolean {
  const q = query.toLowerCase()
  if (agent.name.toLowerCase().includes(q)) return true
  if (agent.city.toLowerCase().includes(q)) return true
  if (agent.craft.some((c) => c.toLowerCase().includes(q))) return true
  if (agent.craft.some((c) => areSkillsEquivalent(q, c))) return true
  if (agent.interests.some((i) => i.toLowerCase().includes(q))) return true
  if (agent.bio.toLowerCase().includes(q)) return true
  return false
}

/** Text search: does `query` match any field of a path? */
function pathMatchesQuery(
  path: { title: string; company: string; skills: string[]; sector: string | null },
  query: string
): boolean {
  const q = query.toLowerCase()
  if (path.title.toLowerCase().includes(q)) return true
  if (path.company.toLowerCase().includes(q)) return true
  if (path.skills.some((s) => s.toLowerCase().includes(q))) return true
  if (path.skills.some((s) => areSkillsEquivalent(q, s))) return true
  if (path.sector?.toLowerCase().includes(q)) return true
  return false
}

function ExchangeInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const { t } = useTranslation()

  // Read query params from needs "Find matching people" button
  const urlSkills = searchParams.get('skills') // comma-separated category IDs
  const urlQuery = searchParams.get('q') // free-text search

  // Redirect if discovery not complete
  useEffect(() => {
    if (!hasCompletedDiscovery) {
      router.push('/')
    }
  }, [hasCompletedDiscovery, router])

  // Load user priorities from localStorage (saved by Me page / profile sync)
  const [priorities, setPriorities] = useState<Record<string, DimensionPriority>>({})
  useEffect(() => {
    try {
      const stored = localStorage.getItem('be-priorities')
      if (stored) setPriorities(JSON.parse(stored))
    } catch {
      // Ignore
    }
  }, [])

  // Compute profile completeness for match boost
  const completeness = useMemo(() => computeCompleteness(identity, false, false), [identity])

  // Initialize filters from URL params (needs flow)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(urlSkills ? 'people' : 'all')
  const [sectorFilter, setSectorFilter] = useState<string>(urlSkills?.split(',')[0] || 'all')
  const [textSearch, setTextSearch] = useState(urlQuery || '')
  const [mounted, setMounted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20)
  }, [typeFilter, sectorFilter, textSearch])

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 20)
  }, [])
  const [dbPaths, setDbPaths] = useState<
    Array<{
      id: string
      title: string
      company: string
      anchorName?: string
      location: string
      country: string
      sector: string | null
      skills: string[]
      isRemote: boolean
      tier: string
    }>
  >([])

  // Fetch real paths from DB, fallback to mock data for demo
  useEffect(() => {
    fetch('/api/paths?limit=50&status=OPEN')
      .then((r) => r.json())
      .then((data) => {
        if (data.paths && data.paths.length > 0) {
          setDbPaths(data.paths)
        } else {
          // Fallback: use mock data when DB is empty
          setDbPaths(
            MOCK_VENTURE_PATHS.map((p) => ({
              id: p.id,
              title: p.title,
              company: p.anchorName,
              anchorName: p.anchorName,
              location: p.location,
              country: p.country ?? 'KE',
              sector:
                p.category === 'professional'
                  ? 'tech'
                  : p.category === 'explorer'
                    ? 'safari'
                    : p.category,
              skills: p.tags,
              isRemote: p.isRemote,
              tier: p.isFeatured ? 'FEATURED' : 'BASIC',
            }))
          )
        }
      })
      .catch(() => {
        // API failed — use mock data
        setDbPaths(
          MOCK_VENTURE_PATHS.map((p) => ({
            id: p.id,
            title: p.title,
            company: p.anchorName,
            anchorName: p.anchorName,
            location: p.location,
            country: p.country ?? 'KE',
            sector:
              p.category === 'professional'
                ? 'tech'
                : p.category === 'explorer'
                  ? 'safari'
                  : p.category,
            skills: p.tags,
            isRemote: p.isRemote,
            tier: p.isFeatured ? 'FEATURED' : 'BASIC',
          }))
        )
      })
  }, [])

  // Resolve user language codes to names for display
  const userLangNames = useMemo(() => identity.languages.map(langCodeToName), [identity.languages])

  // Generate and score AI agents (memoized)
  const scoredAgents = useMemo(() => {
    const allAgents = generateAllAgents()
    const meProfile = identityToProfile(identity)
    const signals = getSignalsForRegion(identity.country)

    return allAgents
      .map((agent) => {
        const themProfile = agentToProfile(agent)
        const dimScore = scoreDimensions(meProfile, themProfile, signals, priorities)
        // Normalize 0-110 to 0-100, then apply completeness matchBoost
        const rawDisplay = Math.min(100, Math.round((dimScore.total / 110) * 100))
        const displayScore = Math.min(100, Math.round(rawDisplay * completeness.matchBoost))
        return { agent, score: displayScore, breakdown: dimScore.breakdown }
      })
      .sort((a, b) => b.score - a.score)
  }, [identity, priorities, completeness.matchBoost])

  // Build scored feed items
  const feedItems = useMemo(() => {
    const items: { type: 'person' | 'opportunity'; data: ExchangeCardData; score: number }[] = []

    const query = textSearch.trim()

    // Add AI agent people
    if (typeFilter !== 'opportunities') {
      for (const { agent, score, breakdown } of scoredAgents) {
        const sector = agentSector(agent)

        // Text search filter
        if (query && !agentMatchesQuery(agent, query)) continue

        // Sector filter
        if (sectorFilter !== 'all') {
          const cat = EXCHANGE_CATEGORIES.find((c) => c.id === sectorFilter)
          if (cat && !agent.interests.includes(sectorFilter)) continue
        }

        const typeBadge = agent.type === 'ai' ? '🤖 AI' : '✨ Human'
        const countryName =
          COUNTRY_OPTIONS.find((c) => c.code === agent.country)?.name ?? agent.country

        items.push({
          type: 'person',
          score,
          data: {
            id: agent.id,
            title: agent.name,
            subtitle: `${typeBadge} · ${agent.city}, ${countryName}`,
            flag: agent.avatar,
            languages: agent.languages.map(langCodeToName),
            skills: agent.craft.slice(0, 3),
            matchScore: score,
            sector: sector.label,
            sectorIcon: sector.icon,
            // Extended dimensions from agent profile
            faith: agent.faith,
            reach: agent.reach,
            culture: agent.culture,
            interests: agent.interests.map((id: string) => {
              const cat = EXCHANGE_CATEGORIES.find((c) => c.id === id)
              return cat?.label ?? id
            }),
            matchBreakdown: breakdown,
          },
        })
      }
    }

    // Score opportunities from real DB
    if (typeFilter !== 'people') {
      for (const path of dbPaths) {
        // Text search filter
        if (query && !pathMatchesQuery(path, query)) continue

        const { score, breakdown } = scoreDbPath(
          path,
          identity.interests,
          identity.craft ?? [],
          identity.country
        )

        // Sector filter
        if (sectorFilter !== 'all') {
          const cat = EXCHANGE_CATEGORIES.find((c) => c.id === sectorFilter)
          if (cat) {
            const catLower = cat.label.toLowerCase()
            const sectorLower = (path.sector || '').toLowerCase()
            const skillMatch = path.skills.some((s) => catLower.includes(s.toLowerCase()))
            if (!catLower.includes(sectorLower) && !skillMatch) continue
          }
        }

        items.push({
          type: 'opportunity',
          score,
          data: {
            id: path.id,
            title: path.title,
            subtitle: `${path.anchorName || path.company} · ${path.location}`,
            flag: COUNTRY_OPTIONS.find((c) => c.code === path.country)?.flag,
            languages: [],
            skills: path.skills.slice(0, 5),
            matchScore: score,
            matchBreakdown: breakdown,
            sector: path.sector || 'general',
            sectorIcon: sectorToIcon(path.sector),
          },
        })
      }
    }

    // Sort by score descending
    return items.sort((a, b) => b.score - a.score)
  }, [
    typeFilter,
    sectorFilter,
    textSearch,
    identity.interests,
    identity.craft,
    identity.country,
    scoredAgents,
    dbPaths,
  ])

  // Guide user to set up identity if not done
  if (!hasCompletedDiscovery) {
    return (
      <SectionLayout>
        <div className="text-center py-phi-7">
          <p className="text-phi-2xl mb-phi-3">🌍</p>
          <h2 className="text-phi-xl font-bold text-white mb-phi-2">
            {t('exchange.setupIdentity')}
          </h2>
          <p className="text-white/60 mb-phi-5 max-w-md mx-auto">
            {t('exchange.setupIdentityDesc')}
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-accent text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-colors"
          >
            {t('exchange.goDiscovery')} &rarr;
          </Link>
        </div>
      </SectionLayout>
    )
  }

  return (
    <SectionLayout>
      {/* ── Header ── */}
      <div className="mb-phi-5">
        <Link
          href="/"
          className="mb-phi-3 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('exchange.home')}
        </Link>
        <SectionHeader
          title={t('exchange.title')}
          subtitle={t('exchange.subtitle')}
          accent={false}
          className="text-left mb-0"
        />
      </div>

      {/* ── Filter bar ── */}
      <div className="mb-phi-5 flex flex-col gap-phi-3 sm:flex-row sm:items-center">
        {/* Type filter pills */}
        <div className="flex gap-phi-2 overflow-x-auto pb-1">
          {(
            [
              { id: 'all', label: t('exchange.all'), icon: Filter },
              { id: 'people', label: t('exchange.people'), icon: Users },
              { id: 'opportunities', label: t('exchange.paths'), icon: Briefcase },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTypeFilter(id)}
              className={`flex items-center gap-phi-1 whitespace-nowrap rounded-full px-phi-3 py-phi-1 text-phi-sm font-medium transition-all ${
                typeFilter === id
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Sector dropdown */}
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-brand-surface px-phi-3 py-phi-2 text-phi-sm text-white outline-none focus:border-brand-accent/50"
        >
          <option value="all">{t('exchange.allSectors')}</option>
          {EXCHANGE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {t(cat.i18nKey) || cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Search bar ── */}
      <div className="mb-phi-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          type="text"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
          placeholder={t('exchange.searchPlaceholder') || 'Search by name, skill, or keyword...'}
          className="w-full bg-brand-surface border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-phi-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-colors"
        />
        {textSearch && (
          <button
            onClick={() => setTextSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Results count ── */}
      <p className="mb-phi-3 text-phi-sm text-white/40">
        {feedItems.length} {feedItems.length === 1 ? t('exchange.result') : t('exchange.results')}
        {textSearch && (
          <span className="ml-1">
            {t('exchange.searchingFor') || 'for'} &ldquo;{textSearch}&rdquo;
          </span>
        )}
      </p>

      {/* ── Feed grid ── */}
      {!mounted ? (
        <div className="grid gap-phi-4 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-brand-surface border border-white/10 rounded-xl p-5 animate-pulse"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-white/5 rounded" />
                  <div className="h-3 w-1/2 bg-white/5 rounded" />
                </div>
                <div className="h-8 w-12 bg-white/5 rounded-lg" />
              </div>
              <div className="flex gap-1.5 mt-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-16 bg-white/5 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : feedItems.length > 0 ? (
        <>
          <div className="grid gap-phi-4 sm:grid-cols-2">
            {feedItems.slice(0, visibleCount).map((item) => (
              <ExchangeCard
                key={`${item.type}-${item.data.id}`}
                type={item.type}
                data={item.data}
                userLanguages={userLangNames}
                userInterests={identity.interests}
              />
            ))}
          </div>
          {visibleCount < feedItems.length && (
            <div className="mt-phi-5 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-phi-sm hover:bg-white/10 hover:text-white transition-colors"
              >
                {t('exchange.loadMore') || 'Load more'} ({feedItems.length - visibleCount}{' '}
                remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <GlassCard padding="lg" className="text-center">
          <p className="text-phi-lg text-white/50">{t('exchange.noMatches')}</p>
          <p className="mt-phi-1 text-phi-sm text-white/30">{t('exchange.noMatchesDesc')}</p>
        </GlassCard>
      )}
    </SectionLayout>
  )
}

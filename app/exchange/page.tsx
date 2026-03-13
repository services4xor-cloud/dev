'use client'

/**
 * Exchange — Profile-driven matching feed
 *
 * Shows people and opportunities scored against YOUR profile.
 * No manual filters — the 8-dimension engine does the matching.
 * Only shows results that actually match (score > 25%).
 */

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, Search, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { areSkillsEquivalent } from '@/lib/semantic-skills'
import { COUNTRY_OPTIONS, langCodeToName } from '@/lib/country-selector'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import {
  scoreDimensions,
  identityToProfile,
  agentToProfile,
  type DimensionProfile,
} from '@/lib/dimension-scoring'
import { computeCompleteness } from '@/lib/profile-completeness'
import type { DimensionPriority } from '@/lib/hooks/use-profile-sync'
import { getSignalsForRegion } from '@/lib/market-data'
import ExchangeCard, { type ExchangeCardData } from '@/components/ExchangeCard'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

// ─── Constants ─────────────────────────────────────────────────────

/** Minimum match score to show in feed (0-100) */
const MIN_MATCH_SCORE = 25

// ─── Helpers ────────────────────────────────────────────────────────

function agentSector(agent: AgentPersona): { label: string; icon: string } {
  if (agent.interests.length > 0) {
    const cat = EXCHANGE_CATEGORIES.find((c) => c.id === agent.interests[0])
    if (cat) return { label: cat.label, icon: cat.icon }
  }
  return { label: 'General', icon: '🌐' }
}

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

  const skillMatches = path.skills.filter((skill) =>
    userCraft.some((uc) => areSkillsEquivalent(uc, skill))
  )
  craftScore = Math.min(40, skillMatches.length * 15)

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

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangePage() {
  return (
    <Suspense fallback={<ExchangeSkeleton />}>
      <ExchangeInner />
    </Suspense>
  )
}

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

function ExchangeInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const { t } = useTranslation()

  const urlQuery = searchParams.get('q') || ''

  // Redirect if discovery not complete
  useEffect(() => {
    if (!hasCompletedDiscovery) {
      router.push('/')
    }
  }, [hasCompletedDiscovery, router])

  // Load user priorities from localStorage
  const [priorities, setPriorities] = useState<Record<string, DimensionPriority>>({})
  useEffect(() => {
    try {
      const stored = localStorage.getItem('be-priorities')
      if (stored) setPriorities(JSON.parse(stored))
    } catch {
      // Ignore
    }
  }, [])

  const completeness = useMemo(() => computeCompleteness(identity, false, false), [identity])

  const [textSearch, setTextSearch] = useState(urlQuery)
  const [mounted, setMounted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setVisibleCount(20)
  }, [textSearch])

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 20)
  }, [])

  // Fetch real paths from DB
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

  useEffect(() => {
    fetch('/api/paths?limit=50&status=OPEN')
      .then((r) => r.json())
      .then((data) => {
        if (data.paths && data.paths.length > 0) {
          setDbPaths(data.paths)
        } else {
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

  const userLangNames = useMemo(() => identity.languages.map(langCodeToName), [identity.languages])

  const userCountryName = useMemo(
    () => COUNTRY_OPTIONS.find((c) => c.code === identity.country)?.name ?? '',
    [identity.country]
  )

  // Build profile summary for the header
  const profileSummary = useMemo(() => {
    const parts: string[] = []
    const countryName = COUNTRY_OPTIONS.find((c) => c.code === identity.country)?.name
    if (countryName) parts.push(countryName)
    if (identity.languages.length > 0) {
      parts.push(identity.languages.slice(0, 3).map(langCodeToName).join(', '))
    }
    if (identity.interests.length > 0) {
      const labels = identity.interests
        .slice(0, 2)
        .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id)?.label)
        .filter(Boolean)
      if (labels.length > 0) parts.push(labels.join(', '))
    }
    return parts
  }, [identity.country, identity.languages, identity.interests])

  // Generate and score all agents
  const scoredAgents = useMemo(() => {
    const allAgents = generateAllAgents()
    const meProfile = identityToProfile(identity)
    const signals = getSignalsForRegion(identity.country)

    return allAgents
      .map((agent) => {
        const themProfile = agentToProfile(agent)
        const dimScore = scoreDimensions(meProfile, themProfile, signals, priorities)
        const rawDisplay = Math.min(100, Math.round((dimScore.total / 110) * 100))
        const displayScore = Math.min(100, Math.round(rawDisplay * completeness.matchBoost))
        return {
          agent,
          score: displayScore,
          breakdown: dimScore.breakdown,
          highlights: dimScore.highlights,
        }
      })
      .filter((a) => a.score >= MIN_MATCH_SCORE) // Only keep real matches
      .sort((a, b) => b.score - a.score)
  }, [identity, priorities, completeness.matchBoost])

  // Build feed items — profile-driven, no manual filters
  const feedItems = useMemo(() => {
    const items: { type: 'person' | 'opportunity'; data: ExchangeCardData; score: number }[] = []
    const query = textSearch.trim()

    // Add matched agents
    for (const { agent, score, breakdown } of scoredAgents) {
      if (query && !agentMatchesQuery(agent, query)) continue

      const sector = agentSector(agent)
      const countryName =
        COUNTRY_OPTIONS.find((c) => c.code === agent.country)?.name ?? agent.country

      items.push({
        type: 'person',
        score,
        data: {
          id: agent.id,
          title: agent.name,
          subtitle: `${agent.city}, ${countryName}`,
          flag: agent.avatar,
          languages: agent.languages.map(langCodeToName),
          skills: agent.craft.slice(0, 3),
          matchScore: score,
          sector: sector.label,
          sectorIcon: sector.icon,
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

    // Add opportunities from DB
    for (const path of dbPaths) {
      if (query && !pathMatchesQuery(path, query)) continue

      const { score, breakdown } = scoreDbPath(
        path,
        identity.interests,
        identity.craft ?? [],
        identity.country
      )

      if (score < MIN_MATCH_SCORE) continue

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

    return items.sort((a, b) => b.score - a.score)
  }, [textSearch, identity.interests, identity.craft, identity.country, scoredAgents, dbPaths])

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
      {/* ── Back link ── */}
      <Link
        href="/"
        className="mb-phi-3 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('exchange.home')}
      </Link>

      {/* ── Profile-driven header ── */}
      <div className="mb-phi-5">
        <h1 className="text-phi-2xl font-bold text-white mb-phi-2">
          {t('exchange.yourMatches') || 'Your Matches'}
        </h1>
        <p className="text-phi-base text-white/50 mb-phi-3">
          {t('exchange.matchedBasedOn') || 'Matched based on your profile'}
        </p>

        {/* Profile chips — what the algorithm is matching against */}
        {profileSummary.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-phi-3">
            {profileSummary.map((part) => (
              <span
                key={part}
                className="rounded-full px-3 py-1 text-phi-xs bg-brand-primary/20 text-white/70 border border-brand-primary/30"
              >
                {part}
              </span>
            ))}
            {(identity.craft?.length ?? 0) > 0 && (
              <span className="rounded-full px-3 py-1 text-phi-xs bg-brand-accent/10 text-brand-accent/80 border border-brand-accent/20">
                {identity.craft!.slice(0, 2).join(', ')}
              </span>
            )}
          </div>
        )}

        {/* Profile completeness nudge */}
        {completeness.score < 70 && (
          <Link
            href="/me"
            className="inline-flex items-center gap-2 text-phi-sm text-brand-accent/80 hover:text-brand-accent transition-colors"
          >
            Complete your profile for better matches ({completeness.score}% complete)
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* ── Search (only filter — algorithm handles the rest) ── */}
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
        {feedItems.length} {feedItems.length === 1 ? 'match' : 'matches'}
        {textSearch && <span className="ml-1">for &ldquo;{textSearch}&rdquo;</span>}
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
                userCountryName={userCountryName}
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
          <p className="text-phi-lg text-white/50">
            {textSearch
              ? `No matches for "${textSearch}"`
              : t('exchange.noMatches') || 'No matches yet'}
          </p>
          <p className="mt-phi-2 text-phi-sm text-white/30">
            {textSearch
              ? 'Try a different search term'
              : 'Complete your profile to find people who match your interests, language, and beliefs'}
          </p>
          {!textSearch && (
            <Link
              href="/me"
              className="mt-phi-4 inline-block bg-brand-accent text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-colors text-phi-sm"
            >
              Complete your profile
            </Link>
          )}
        </GlassCard>
      )}
    </SectionLayout>
  )
}

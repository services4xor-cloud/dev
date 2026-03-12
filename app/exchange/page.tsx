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

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Filter, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { getSignalsForRegion } from '@/lib/market-data'
import ExchangeCard, { type ExchangeCardData } from '@/components/ExchangeCard'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

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
  faith?: string
  craft?: string[]
  reach?: string[]
  culture?: string
}): DimensionProfile {
  return {
    country: identity.country,
    city: identity.city,
    languages: identity.languages,
    faith: (identity as Record<string, unknown>).faith as string | undefined,
    craft: ((identity as Record<string, unknown>).craft as string[]) ?? [],
    interests: identity.interests,
    reach: ((identity as Record<string, unknown>).reach as string[]) ?? [],
    culture: (identity as Record<string, unknown>).culture as string | undefined,
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

/** Score an opportunity against user identity */
function scoreOpportunity(path: (typeof MOCK_VENTURE_PATHS)[0], userInterests: string[]): number {
  let score = 25

  const interestLabels = userInterests
    .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => c!.label.toLowerCase())

  const tagMatches = path.tags.filter((tag) =>
    interestLabels.some(
      (il) => il.includes(tag.toLowerCase()) || tag.toLowerCase().includes(il.split(' ')[0])
    )
  )
  score += Math.min(40, tagMatches.length * 15)

  const catMatch = EXCHANGE_CATEGORIES.find((c) => {
    const catLower = c.label.toLowerCase()
    return (
      catLower.includes(path.category.toLowerCase()) || path.category.toLowerCase().includes(c.id)
    )
  })
  if (catMatch && userInterests.includes(catMatch.id)) score += 20
  if (path.isFeatured) score += 10
  if (path.isRemote) score += 5

  return Math.min(100, score)
}

// ─── Filter types ───────────────────────────────────────────────────

type TypeFilter = 'all' | 'people' | 'opportunities'

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangePage() {
  const router = useRouter()
  const { identity, hasCompletedDiscovery } = useIdentity()

  // Redirect if discovery not complete
  useEffect(() => {
    if (!hasCompletedDiscovery) {
      router.push('/')
    }
  }, [hasCompletedDiscovery, router])

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sectorFilter, setSectorFilter] = useState<string>('all')

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
        const dimScore = scoreDimensions(meProfile, themProfile, signals)
        // Normalize 0-110 to 0-100
        const displayScore = Math.min(100, Math.round((dimScore.total / 110) * 100))
        return { agent, score: displayScore }
      })
      .sort((a, b) => b.score - a.score)
  }, [identity])

  // Build scored feed items
  const feedItems = useMemo(() => {
    const items: { type: 'person' | 'opportunity'; data: ExchangeCardData; score: number }[] = []

    // Add AI agent people
    if (typeFilter !== 'opportunities') {
      for (const { agent, score } of scoredAgents) {
        const sector = agentSector(agent)

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
          },
        })
      }
    }

    // Score opportunities
    if (typeFilter !== 'people') {
      for (const path of MOCK_VENTURE_PATHS) {
        const score = scoreOpportunity(path, identity.interests)

        // Sector filter
        if (sectorFilter !== 'all') {
          const cat = EXCHANGE_CATEGORIES.find((c) => c.id === sectorFilter)
          if (cat) {
            const catLower = cat.label.toLowerCase()
            const pathCatLower = path.category.toLowerCase()
            const tagMatch = path.tags.some((t) => catLower.includes(t.toLowerCase()))
            if (!catLower.includes(pathCatLower) && !tagMatch) continue
          }
        }

        items.push({
          type: 'opportunity',
          score,
          data: {
            id: path.id,
            title: path.title,
            subtitle: `${path.anchorName} · ${path.location}`,
            flag: COUNTRY_OPTIONS.find((c) => c.code === path.country)?.flag,
            languages: [],
            skills: path.tags,
            matchScore: score,
            sector: path.category,
            sectorIcon: path.icon,
          },
        })
      }
    }

    // Sort by score descending
    return items.sort((a, b) => b.score - a.score)
  }, [typeFilter, sectorFilter, identity.interests, scoredAgents])

  // Don't render until identity is checked
  if (!hasCompletedDiscovery) {
    return null
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
          Home
        </Link>
        <h1 className="text-phi-2xl font-bold gradient-text">Exchange</h1>
        <p className="mt-phi-1 text-phi-base text-white/60">
          Pioneers and Paths matched to your identity
        </p>
      </div>

      {/* ── Filter bar ── */}
      <div className="mb-phi-5 flex flex-col gap-phi-3 sm:flex-row sm:items-center">
        {/* Type filter pills */}
        <div className="flex gap-phi-2 overflow-x-auto pb-1">
          {(
            [
              { id: 'all', label: 'All', icon: Filter },
              { id: 'people', label: 'People', icon: Users },
              { id: 'opportunities', label: 'Paths', icon: Briefcase },
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
          <option value="all">All Sectors</option>
          {EXCHANGE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Results count ── */}
      <p className="mb-phi-3 text-phi-sm text-white/40">
        {feedItems.length} {feedItems.length === 1 ? 'result' : 'results'}
      </p>

      {/* ── Feed grid ── */}
      {feedItems.length > 0 ? (
        <div className="grid gap-phi-4 sm:grid-cols-2">
          {feedItems.map((item) => (
            <ExchangeCard
              key={`${item.type}-${item.data.id}`}
              type={item.type}
              data={item.data}
              userLanguages={userLangNames}
              userInterests={identity.interests}
            />
          ))}
        </div>
      ) : (
        <GlassCard padding="lg" className="text-center">
          <p className="text-phi-lg text-white/50">No matches found</p>
          <p className="mt-phi-1 text-phi-sm text-white/30">
            Try changing your filters or updating your interests
          </p>
        </GlassCard>
      )}
    </SectionLayout>
  )
}

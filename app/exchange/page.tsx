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
import { useTranslation } from '@/lib/hooks/use-translation'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
// Real paths fetched from /api/paths (Prisma → Neon PostgreSQL)
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
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

/** Score a DB path opportunity against user identity */
function scoreDbPath(
  path: {
    skills: string[]
    sector: string | null
    tier: string
    isRemote: boolean
    country: string
  },
  userInterests: string[],
  userCountry: string
): number {
  let score = 25
  const interestLabels = userInterests
    .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => c!.label.toLowerCase())

  const skillMatches = path.skills.filter((skill) =>
    interestLabels.some(
      (il) => il.includes(skill.toLowerCase()) || skill.toLowerCase().includes(il.split(' ')[0])
    )
  )
  score += Math.min(40, skillMatches.length * 15)
  if (path.tier === 'FEATURED' || path.tier === 'PREMIUM') score += 10
  if (path.isRemote) score += 5
  if (path.country === userCountry) score += 10
  return Math.min(100, score)
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
  const router = useRouter()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const { t } = useTranslation()

  // Redirect if discovery not complete
  useEffect(() => {
    if (!hasCompletedDiscovery) {
      router.push('/')
    }
  }, [hasCompletedDiscovery, router])

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
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

    // Score opportunities from real DB
    if (typeFilter !== 'people') {
      for (const path of dbPaths) {
        const score = scoreDbPath(path, identity.interests, identity.country)

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
            sector: path.sector || 'general',
            sectorIcon: sectorToIcon(path.sector),
          },
        })
      }
    }

    // Sort by score descending
    return items.sort((a, b) => b.score - a.score)
  }, [typeFilter, sectorFilter, identity.interests, identity.country, scoredAgents, dbPaths])

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
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Results count ── */}
      <p className="mb-phi-3 text-phi-sm text-white/40">
        {feedItems.length} {feedItems.length === 1 ? t('exchange.result') : t('exchange.results')}
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
          <p className="text-phi-lg text-white/50">{t('exchange.noMatches')}</p>
          <p className="mt-phi-1 text-phi-sm text-white/30">{t('exchange.noMatchesDesc')}</p>
        </GlassCard>
      )}
    </SectionLayout>
  )
}

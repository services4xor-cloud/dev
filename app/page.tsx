'use client'

/**
 * Homepage — The gateway to the BeNetwork
 *
 * First visit: WowHero animation → Discovery flow
 * Returning user: Rich dashboard with live matched agents, paths, and network preview
 */

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  ArrowRight,
  Globe,
  Sparkles,
  Users,
  MapPin,
  Zap,
  MessageCircle,
  Shield,
} from 'lucide-react'
import { useIdentity } from '@/lib/identity-context'
import WowHero from '@/components/WowHero'
import Discovery from '@/components/Discovery'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { getSignalsForRegion } from '@/lib/market-data'
// Real paths fetched from /api/paths (Prisma → Neon PostgreSQL)
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'

// ─── Helpers ────────────────────────────────────────────────────────

function langName(code: string): string {
  const lang = LANGUAGE_REGISTRY[code as LanguageCode]
  return lang ? lang.name : code
}

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

// ─── Component ──────────────────────────────────────────────────────

export default function HomePage() {
  const { identity, hasCompletedDiscovery, brandName, localizeCountry } = useIdentity()
  const { data: session } = useSession()
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
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
      salaryMin: number | null
      salaryMax: number | null
      currency: string
    }>
  >([])
  const router = useRouter()

  // Fetch real paths from DB, fallback to mock data for demo
  useEffect(() => {
    fetch('/api/paths?limit=20&status=OPEN')
      .then((r) => r.json())
      .then((data) => {
        if (data.paths && data.paths.length > 0) {
          setDbPaths(data.paths)
        } else {
          // Fallback: use mock data when DB is empty
          setDbPaths(
            MOCK_VENTURE_PATHS.slice(0, 20).map((p) => ({
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
              salaryMin: null,
              salaryMax: null,
              currency: 'KES',
            }))
          )
        }
      })
      .catch(() => {
        // API failed — use mock data
        setDbPaths(
          MOCK_VENTURE_PATHS.slice(0, 20).map((p) => ({
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
            salaryMin: null,
            salaryMax: null,
            currency: 'KES',
          }))
        )
      })
  }, [])

  // Top matched agents (computed only when Discovery is done)
  const topAgents = useMemo(() => {
    if (!hasCompletedDiscovery) return []
    const meProfile = identityToProfile(identity)
    const signals = getSignalsForRegion(identity.country)
    const allAgents = generateAllAgents()

    return allAgents
      .map((agent) => {
        const themProfile = agentToProfile(agent)
        const dimScore = scoreDimensions(meProfile, themProfile, signals)
        const score = Math.min(100, Math.round((dimScore.total / 110) * 100))
        return { agent, score, breakdown: dimScore.breakdown }
      })
      .sort((a, b) => b.score - a.score)
      .filter(({ agent }) => {
        if (!identity.focusTopic) return true
        return agent.interests.includes(identity.focusTopic)
      })
      .slice(0, 6)
  }, [hasCompletedDiscovery, identity])

  // Top venture paths scored against user identity
  const topPaths = useMemo(() => {
    if (!hasCompletedDiscovery || dbPaths.length === 0) return []
    const interestLabels = identity.interests
      .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id)?.label?.toLowerCase() ?? '')
      .filter(Boolean)

    return dbPaths
      .filter((path) => {
        if (!identity.focusTopic) return true
        const cat = EXCHANGE_CATEGORIES.find((c) => c.id === identity.focusTopic)
        if (!cat) return true
        const catLower = cat.label.toLowerCase()
        return path.skills.some(
          (t) =>
            catLower.includes(t.toLowerCase()) || t.toLowerCase().includes(catLower.split(' ')[0])
        )
      })
      .map((path) => {
        let score = 25
        const skillMatch = path.skills.some((skill) =>
          interestLabels.some(
            (il) => il.includes(skill.toLowerCase()) || skill.toLowerCase().includes(il)
          )
        )
        if (skillMatch) score += 40
        if (path.tier === 'FEATURED' || path.tier === 'PREMIUM') score += 15
        if (path.isRemote) score += 10
        if (path.country === identity.country) score += 10
        // Map DB path to display shape
        const displayPath = {
          id: path.id,
          title: path.title,
          anchorName: path.anchorName || path.company,
          location: path.location,
          country: path.country,
          icon:
            path.sector === 'tech'
              ? '💻'
              : path.sector === 'healthcare'
                ? '🏥'
                : path.sector === 'safari'
                  ? '🦁'
                  : '📡',
          tags: path.skills.slice(0, 5),
          isRemote: path.isRemote,
          isFeatured: path.tier !== 'BASIC',
        }
        return { path: displayPath, score: Math.min(100, score) }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [hasCompletedDiscovery, identity.interests, identity.country, identity.focusTopic, dbPaths])

  // ─── First-time visitor flow ──────────────────────────────────
  if (!hasCompletedDiscovery) {
    if (!showDiscovery) {
      return (
        <main className="bg-brand-bg min-h-screen">
          <WowHero onBegin={() => setShowDiscovery(true)} />
        </main>
      )
    }
    return (
      <main className="bg-brand-bg min-h-screen">
        <Discovery />
      </main>
    )
  }

  // ─── Returning user: rich dashboard ───────────────────────────
  const userName = session?.user?.name ?? identity.city ?? 'Explorer'
  const countryFlag = COUNTRY_OPTIONS.find((c) => c.code === identity.country)?.flag ?? '🌍'

  // Location-aware corridor detection
  const instanceCountry = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase()
  const detectedLoc = identity.detectedLocation
  const isVisitingFromAbroad = detectedLoc && detectedLoc !== instanceCountry
  const detectedCountryName = detectedLoc ? localizeCountry(detectedLoc) : ''
  const detectedFlag = detectedLoc
    ? (COUNTRY_OPTIONS.find((c) => c.code === detectedLoc)?.flag ?? '🌍')
    : ''
  const instanceCountryName = localizeCountry(instanceCountry)

  return (
    <main className="bg-brand-bg min-h-screen">
      {/* ── Hero: Welcome back ── */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgb(var(--color-primary-rgb) / 0.15) 0%, transparent 60%)',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <p className="text-brand-accent text-phi-sm font-medium mb-2">
                {countryFlag} {brandName}
              </p>
              <h1 className="text-phi-3xl md:text-phi-4xl font-bold text-white mb-2">
                Welcome back, {userName.split(' ')[0]}
              </h1>
              <p className="text-white/50 text-phi-base max-w-lg">
                {topAgents.length} people matched to your identity across{' '}
                {new Set(topAgents.map((a) => a.agent.country)).size} countries
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/world"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-white font-semibold text-phi-sm
                           hover:bg-brand-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]
                           border border-[rgb(var(--color-accent-rgb)/0.3)]"
              >
                <Globe className="w-4 h-4" />
                My World
              </Link>
              <Link
                href="/exchange"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white/80 font-medium text-phi-sm
                           hover:bg-white/10 transition-all border border-white/10"
              >
                <Sparkles className="w-4 h-4" />
                Exchange
              </Link>
            </div>
          </div>

          {/* Identity summary chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            {identity.languages.slice(0, 4).map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-full text-xs bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
              >
                {langName(lang)}
              </span>
            ))}
            {identity.craft?.slice(0, 3).map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full text-xs bg-brand-primary/20 text-white/70 border border-brand-primary/30"
              >
                {c}
              </span>
            ))}
            {identity.interests.slice(0, 2).map((id) => {
              const cat = EXCHANGE_CATEGORIES.find((c) => c.id === id)
              return cat ? (
                <span
                  key={id}
                  className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/50 border border-white/10"
                >
                  {cat.icon} {cat.label}
                </span>
              ) : null
            })}
          </div>
          {identity.focusTopic && (
            <div className="mt-3 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-brand-accent/15 text-brand-accent border border-brand-accent/30 flex items-center gap-1.5">
                Focus:{' '}
                {EXCHANGE_CATEGORIES.find((c) => c.id === identity.focusTopic)?.label ??
                  identity.focusTopic}
              </span>
            </div>
          )}

          {/* Account nudge — only show if not signed in */}
          {!session && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-primary/20 border border-brand-primary/30 px-5 py-3">
              <Shield className="w-5 h-5 text-brand-accent shrink-0" />
              <div className="flex-1">
                <p className="text-white text-phi-sm font-medium">Save your identity</p>
                <p className="text-white/40 text-phi-xs">
                  Your profile is stored locally. Create an account to keep it across devices.
                </p>
              </div>
              <Link
                href="/signup"
                className="shrink-0 px-4 py-1.5 rounded-lg bg-brand-accent text-white text-phi-xs font-bold hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Location-aware corridor banner ── */}
      {isVisitingFromAbroad && (
        <SectionLayout size="lg" className="mb-2">
          <GlassCard variant="subtle" padding="md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{detectedFlag}</span>
                <div>
                  <p className="text-white font-semibold text-phi-sm">
                    Visiting from {detectedCountryName}?
                  </p>
                  <p className="text-white/40 text-phi-xs">
                    Explore the {instanceCountryName} &harr; {detectedCountryName} corridor &mdash;
                    paths, agents, and opportunities connecting both countries.
                  </p>
                </div>
              </div>
              <Link
                href="/compass"
                className="shrink-0 flex items-center gap-2 px-5 py-2 rounded-full bg-brand-accent/10 text-brand-accent font-semibold text-phi-sm
                           hover:bg-brand-accent/20 transition-all border border-brand-accent/20"
              >
                View Routes
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </GlassCard>
        </SectionLayout>
      )}

      {/* ── What to do next ── */}
      <SectionLayout size="lg" className="mb-2">
        <h2 className="text-phi-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-accent" />
          What to do next
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Corridor route card — shown first when visiting from abroad */}
          {isVisitingFromAbroad && (
            <Link href="/compass" className="block group">
              <GlassCard
                variant="subtle"
                padding="md"
                className="group-hover:border-brand-accent/30 transition-colors border-brand-accent/15"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧭</span>
                  <div>
                    <p className="text-white font-semibold text-phi-sm">
                      {instanceCountryName} &rarr; {detectedCountryName} Route
                    </p>
                    <p className="text-white/40 text-phi-xs">
                      Explore your cross-border corridor in Compass
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          )}
          <Link href="/exchange" className="block group">
            <GlassCard
              variant="subtle"
              padding="md"
              className="group-hover:border-brand-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="text-white font-semibold text-phi-sm">Browse the Exchange</p>
                  <p className="text-white/40 text-phi-xs">Find people and paths matched to you</p>
                </div>
              </div>
            </GlassCard>
          </Link>
          <Link href="/messages" className="block group">
            <GlassCard
              variant="subtle"
              padding="md"
              className="group-hover:border-brand-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-white font-semibold text-phi-sm">Chat with Pioneers</p>
                  <p className="text-white/40 text-phi-xs">Start conversations with your matches</p>
                </div>
              </div>
            </GlassCard>
          </Link>
          {/* Hide "Refine Identity" when corridor card takes the slot */}
          {!isVisitingFromAbroad && (
            <Link href="/me" className="block group">
              <GlassCard
                variant="subtle"
                padding="md"
                className="group-hover:border-brand-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <p className="text-white font-semibold text-phi-sm">Refine Your Identity</p>
                    <p className="text-white/40 text-phi-xs">
                      Add faith, craft, culture for better matches
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          )}
        </div>
      </SectionLayout>

      {/* ── Top Matched People ── */}
      <SectionLayout size="lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-phi-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-accent" />
              Your Top Matches
            </h2>
            <p className="text-white/40 text-phi-sm mt-1">
              People scored by your 8 identity dimensions
            </p>
          </div>
          <Link
            href="/exchange"
            className="text-brand-accent text-phi-sm hover:underline flex items-center gap-1"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topAgents.map(({ agent, score, breakdown }) => {
            const isHovered = hoveredAgent === agent.id
            const countryInfo = COUNTRY_OPTIONS.find((c) => c.code === agent.country)
            const typeBadge = agent.type === 'ai' ? '🤖' : '✨'

            return (
              <GlassCard
                key={agent.id}
                variant={isHovered ? 'featured' : 'subtle'}
                padding="md"
                className={`group cursor-pointer transition-all duration-300 ${isHovered ? 'scale-[1.02] shadow-lg shadow-brand-accent/10' : ''}`}
                onClick={() => router.push(`/messages?dm=${agent.id}`)}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{agent.avatar}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${score}%`,
                          background:
                            score >= 80
                              ? '#C9A227'
                              : score >= 50
                                ? '#d4af37'
                                : 'rgba(255,255,255,0.3)',
                        }}
                      />
                    </div>
                    <span className="text-brand-accent text-xs font-bold">{score}%</span>
                  </div>
                </div>

                <h3 className="text-white font-semibold text-phi-base mb-0.5">{agent.name}</h3>
                <p className="text-white/40 text-phi-xs mb-3">
                  {typeBadge} {agent.city}, {countryInfo?.name ?? agent.country}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {breakdown.language > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-accent/10 text-brand-accent/80">
                      🗣 Language +{breakdown.language}
                    </span>
                  )}
                  {breakdown.craft > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-900/40 text-emerald-400/80">
                      🔧 Craft +{breakdown.craft}
                    </span>
                  )}
                  {breakdown.location > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-900/40 text-blue-400/80">
                      📍 Location +{breakdown.location}
                    </span>
                  )}
                </div>

                {agent.languages.filter((l) => identity.languages.includes(l)).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <p className="text-white/30 text-[10px] mb-1">Shared languages</p>
                    <div className="flex gap-1">
                      {agent.languages
                        .filter((l) => identity.languages.includes(l))
                        .map((l) => (
                          <span key={l} className="text-brand-accent text-[11px]">
                            {langName(l)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Chat CTA */}
                <div className="mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-brand-accent/10 text-brand-accent text-xs font-medium group-hover:bg-brand-accent/20 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Start Conversation
                </div>
              </GlassCard>
            )
          })}
        </div>
      </SectionLayout>

      {/* ── Matched Paths ── */}
      {topPaths.length > 0 && (
        <SectionLayout size="lg" className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-phi-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-accent" />
                Paths For You
              </h2>
              <p className="text-white/40 text-phi-sm mt-1">
                Opportunities matched to your interests and craft
              </p>
            </div>
            <Link
              href="/exchange"
              className="text-brand-accent text-phi-sm hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topPaths.map(({ path, score }) => {
              const countryInfo = COUNTRY_OPTIONS.find((c) => c.code === path.country)
              return (
                <GlassCard
                  key={path.id}
                  variant="subtle"
                  padding="md"
                  className="cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                  onClick={() => router.push('/exchange')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{path.icon}</span>
                    <span className="text-brand-accent text-xs font-bold">{score}%</span>
                  </div>
                  <h3 className="text-white font-semibold text-phi-sm mb-1 group-hover:text-brand-accent transition-colors">
                    {path.title.length > 30 ? path.title.slice(0, 28) + '...' : path.title}
                  </h3>
                  <p className="text-white/40 text-phi-xs mb-2">
                    {countryInfo?.flag} {path.anchorName} · {path.location}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {path.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </SectionLayout>
      )}

      {/* ── Quick Stats ── */}
      <SectionLayout size="lg" className="mt-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Countries', value: '193', icon: '🌍', color: 'text-brand-accent' },
            {
              label: 'you speak',
              value: `${identity.languages.length}`,
              icon: '🗣',
              color: 'text-emerald-400',
            },
            { label: 'AI Agents', value: '700+', icon: '🤖', color: 'text-blue-400' },
            {
              label: 'top match',
              value: topAgents[0] ? `${topAgents[0].score}%` : '—',
              icon: '⚡',
              color: 'text-brand-accent',
            },
          ].map((stat) => (
            <GlassCard key={stat.label} variant="subtle" padding="md" className="text-center">
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <p className={`text-phi-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-white/40 text-phi-xs">{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* ── Explore CTA ── */}
      <section className="py-16 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgb(var(--color-primary-rgb) / 0.1), transparent)',
          }}
        />
        <div className="max-w-2xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Your world is growing</h2>
          <p className="text-white/50 text-phi-base mb-8">
            Every dimension you share opens new connections. Explore your full network graph or
            browse the exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/world"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-primary text-white font-bold
                         hover:bg-brand-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]
                         border border-[rgb(var(--color-accent-rgb)/0.3)] shadow-[0_8px_24px_rgb(var(--color-primary-rgb)/0.3)]"
            >
              <Globe className="w-5 h-5" />
              Enter My World
            </Link>
            <Link
              href="/me"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/5 text-white/80 font-medium
                         hover:bg-white/10 transition-all border border-white/10"
            >
              <MapPin className="w-5 h-5" />
              Edit Identity
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

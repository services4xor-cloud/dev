'use client'

/**
 * Exchange Detail — Shows an Agent or Opportunity in full detail
 *
 * Agents: Looks up by ID from the full generateAllAgents() system (~700 agents)
 * Paths: Looks up from MOCK_VENTURE_PATHS
 *
 * Shows full profile with dimension scoring, bio, languages, craft,
 * exchange proposals, and action buttons that link to /messages.
 */

import { useParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { ArrowLeft, Globe, MapPin, Briefcase, Star, MessageCircle, Zap, Send } from 'lucide-react'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { generateAllAgents } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { getSignalsForRegion } from '@/lib/market-data'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

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
  faith?: string
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

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const id = params.id as string
  const [messageSent, setMessageSent] = useState(false)

  // Find agent from the real system
  const agentData = useMemo(() => {
    const allAgents = generateAllAgents()
    const agent = allAgents.find((a) => a.id === id)
    if (!agent) return null

    const meProfile = identityToProfile(identity)
    const themProfile: DimensionProfile = {
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
    const signals = getSignalsForRegion(identity.country)
    const dimScore = scoreDimensions(meProfile, themProfile, signals)
    const score = Math.min(100, Math.round((dimScore.total / 110) * 100))

    return { agent, score, breakdown: dimScore.breakdown }
  }, [id, identity])

  // Find path from mock data
  const path = MOCK_VENTURE_PATHS.find((p) => p.id === id)

  // Not found
  if (!agentData && !path) {
    return (
      <SectionLayout>
        <div className="py-phi-7 text-center">
          <h1 className="text-phi-xl font-bold text-white">Not Found</h1>
          <p className="mt-phi-2 text-white/50">This exchange item could not be found.</p>
          <Link
            href="/exchange"
            className="mt-phi-4 inline-flex items-center gap-phi-1 text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exchange
          </Link>
        </div>
      </SectionLayout>
    )
  }

  // ── Agent detail ──
  if (agentData) {
    const { agent, score, breakdown } = agentData
    const countryInfo = COUNTRY_OPTIONS.find((c) => c.code === agent.country)
    const sharedLangs = agent.languages.filter((l) => identity.languages.includes(l))
    const sharedCraft = agent.craft.filter((c) =>
      (identity.craft ?? []).some(
        (uc) =>
          uc.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(uc.toLowerCase())
      )
    )

    const handleConnect = () => {
      setMessageSent(true)
      setTimeout(() => router.push(`/messages?dm=${agent.id}`), 1500)
    }

    return (
      <SectionLayout>
        <Link
          href="/exchange"
          className="mb-phi-4 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exchange
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard variant="featured" padding="lg">
              {/* Header */}
              <div className="flex items-start justify-between mb-phi-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{agent.avatar}</span>
                    <span className="px-2 py-0.5 rounded-full text-phi-xs bg-brand-primary/30 text-white">
                      {agent.type === 'ai' ? '🤖 AI Agent' : '✨ Human'}
                    </span>
                  </div>
                  <h1 className="text-phi-2xl font-bold text-white">{agent.name}</h1>
                  <div className="mt-1 flex items-center gap-2 text-white/50">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {agent.city}, {countryInfo?.name ?? agent.country}
                    </span>
                    <span>{countryInfo?.flag}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-phi-2xl font-bold text-brand-accent">{score}%</div>
                  <div className="text-phi-xs text-white/40">match</div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-phi-5">
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">About</h2>
                <p className="text-white/60 leading-relaxed">{agent.bio}</p>
              </div>

              {/* Exchange Proposals */}
              {agent.exchangeProposals.length > 0 && (
                <div className="mb-phi-5">
                  <h2 className="text-phi-base font-semibold text-white/70 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-accent" />
                    Exchange Proposals
                  </h2>
                  <div className="space-y-2">
                    {agent.exchangeProposals.map((proposal, i) => (
                      <div
                        key={i}
                        className="glass-subtle rounded-lg p-3 text-phi-sm text-white/70 border-l-2 border-brand-accent/30"
                      >
                        {proposal}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              <div className="mb-phi-5">
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {agent.languages.map((code) => {
                    const shared = sharedLangs.includes(code)
                    return (
                      <span
                        key={code}
                        className={`rounded-full px-3 py-1 text-phi-sm flex items-center gap-1 ${
                          shared
                            ? 'border border-brand-accent/50 bg-brand-accent/10 text-brand-accent'
                            : 'bg-white/5 text-white/50'
                        }`}
                      >
                        <Globe className="h-3.5 w-3.5" />
                        {langName(code)}
                        {shared && <Star className="h-3 w-3" />}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Craft & Skills */}
              <div className="mb-phi-5">
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">Craft & Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {agent.craft.map((skill) => {
                    const shared = sharedCraft.includes(skill)
                    return (
                      <span
                        key={skill}
                        className={`rounded-full px-3 py-1 text-phi-sm ${
                          shared
                            ? 'border border-brand-accent/50 bg-brand-accent/10 text-brand-accent'
                            : 'bg-white/5 text-white/50'
                        }`}
                      >
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {agent.interests.map((intId) => {
                    const cat = EXCHANGE_CATEGORIES.find((c) => c.id === intId)
                    const shared = identity.interests.includes(intId)
                    return cat ? (
                      <span
                        key={intId}
                        className={`rounded-full px-3 py-1 text-phi-sm flex items-center gap-1 ${
                          shared
                            ? 'border border-brand-accent/50 bg-brand-accent/10 text-brand-accent'
                            : 'bg-white/5 text-white/50'
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Dimension Breakdown */}
            <GlassCard padding="md">
              <h3 className="text-phi-base font-semibold text-white mb-3">Match Breakdown</h3>
              <div className="space-y-2.5">
                {(
                  [
                    { key: 'language', label: '🗣 Language', max: 20 },
                    { key: 'craft', label: '🔧 Craft', max: 15 },
                    { key: 'location', label: '📍 Location', max: 10 },
                    { key: 'passion', label: '❤️ Passion', max: 15 },
                    { key: 'faith', label: '🙏 Faith', max: 8 },
                    { key: 'reach', label: '🌐 Reach', max: 7 },
                    { key: 'culture', label: '🌿 Culture', max: 5 },
                    { key: 'market', label: '📊 Market', max: 20 },
                  ] as const
                ).map(({ key, label, max }) => {
                  const val = breakdown[key] ?? 0
                  const pct = Math.round((val / max) * 100)
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-phi-xs mb-1">
                        <span className="text-white/60">{label}</span>
                        <span className="text-white/40">
                          {val}/{max}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-accent transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-between">
                <span className="text-phi-sm text-white/60 font-medium">Total</span>
                <span className="text-phi-sm text-brand-accent font-bold">{score}%</span>
              </div>
            </GlassCard>

            {/* Shared Languages */}
            {sharedLangs.length > 0 && (
              <GlassCard padding="md">
                <h3 className="text-phi-sm font-semibold text-white/70 mb-2">You both speak</h3>
                <div className="flex flex-wrap gap-1.5">
                  {sharedLangs.map((l) => (
                    <span
                      key={l}
                      className="px-2.5 py-1 rounded-full text-phi-xs bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                    >
                      {langName(l)}
                    </span>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Connect Action */}
            <GlassCard padding="md">
              {messageSent ? (
                <div className="text-center py-2">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-brand-accent font-semibold text-phi-sm">Connection sent!</p>
                  <p className="text-white/40 text-phi-xs mt-1">Redirecting to messages...</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleConnect}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-primary py-3 text-phi-base font-semibold text-white transition-all hover:bg-brand-primary/80 active:scale-[0.98] mb-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Connect with {agent.name.split(' ')[0]}
                  </button>
                  <p className="text-center text-phi-xs text-white/30">
                    Opens a conversation in Messages
                  </p>
                </>
              )}
            </GlassCard>
          </div>
        </div>
      </SectionLayout>
    )
  }

  // ── Opportunity detail ──
  if (path) {
    const countryInfo = COUNTRY_OPTIONS.find((c) => c.code === path.country)

    return (
      <SectionLayout>
        <Link
          href="/exchange"
          className="mb-phi-4 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exchange
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard variant="featured" padding="lg">
              {/* Header */}
              <div className="mb-phi-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full border border-brand-accent/30 px-2 py-0.5 text-phi-xs text-brand-accent">
                    Path
                  </span>
                  {path.isFeatured && (
                    <span className="rounded-full bg-brand-accent/20 px-2 py-0.5 text-phi-xs text-brand-accent">
                      Featured
                    </span>
                  )}
                  {path.isRemote && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-phi-xs text-white/60">
                      Remote
                    </span>
                  )}
                </div>
                <h1 className="text-phi-2xl font-bold text-white">
                  {path.icon} {path.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-white/50">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {path.anchorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {countryInfo?.flag} {path.location}
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="mb-phi-5 grid grid-cols-2 gap-3">
                <div className="glass-subtle rounded-lg p-3">
                  <p className="text-phi-xs text-white/40">Compensation</p>
                  <p className="text-phi-sm font-semibold text-white">{path.salary}</p>
                </div>
                <div className="glass-subtle rounded-lg p-3">
                  <p className="text-phi-xs text-white/40">Posted</p>
                  <p className="text-phi-sm font-semibold text-white">{path.posted}</p>
                </div>
                {path.pioneersNeeded && (
                  <div className="glass-subtle rounded-lg p-3">
                    <p className="text-phi-xs text-white/40">Pioneers Needed</p>
                    <p className="text-phi-sm font-semibold text-white">{path.pioneersNeeded}</p>
                  </div>
                )}
                <div className="glass-subtle rounded-lg p-3">
                  <p className="text-phi-xs text-white/40">Category</p>
                  <p className="text-phi-sm font-semibold text-white capitalize">{path.category}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h2 className="mb-2 text-phi-base font-semibold text-white/70">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {path.tags.map((tag) => {
                    const shared = (identity.craft ?? []).some(
                      (c) =>
                        c.toLowerCase().includes(tag.toLowerCase()) ||
                        tag.toLowerCase().includes(c.toLowerCase())
                    )
                    return (
                      <span
                        key={tag}
                        className={`rounded-full px-3 py-1 text-phi-sm ${
                          shared
                            ? 'border border-brand-accent/50 bg-brand-accent/10 text-brand-accent'
                            : 'bg-white/5 text-white/50'
                        }`}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <GlassCard padding="md">
              <button
                onClick={() => router.push('/messages')}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-brand-accent/40 py-3 text-phi-base font-semibold text-brand-accent transition-all hover:bg-brand-accent/10 active:scale-[0.98] mb-2"
              >
                <Send className="w-4 h-4" />
                Apply for this Path
              </button>
              <p className="text-center text-phi-xs text-white/30">
                Opens a conversation with the Anchor
              </p>
            </GlassCard>

            <GlassCard padding="md">
              <h3 className="text-phi-sm font-semibold text-white/70 mb-2">Posted by</h3>
              <p className="text-white font-medium">{path.anchorName}</p>
              <p className="text-white/40 text-phi-xs mt-1">
                {countryInfo?.flag} {path.location}
              </p>
            </GlassCard>
          </div>
        </div>
      </SectionLayout>
    )
  }

  return null
}

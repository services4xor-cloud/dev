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
import { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  Globe,
  MapPin,
  Briefcase,
  Star,
  MessageCircle,
  Zap,
  Send,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
// Real paths fetched from /api/paths/[id] (Prisma → Neon PostgreSQL)
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import { generateAllAgents } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { getSignalsForRegion } from '@/lib/market-data'
import { resolveSkillId, areSkillsEquivalent } from '@/lib/semantic-skills'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'
import { useXPContext } from '@/components/XPProvider'
import PaymentCheckout from '@/components/PaymentCheckout'

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

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { identity, hasCompletedDiscovery } = useIdentity()
  const { t } = useTranslation()
  const { awardXP } = useXPContext()
  const id = params.id as string
  const [messageSent, setMessageSent] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  // Award XP for viewing a path
  useEffect(() => {
    awardXP('VIEW_PATH')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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

  // Fetch real path from DB
  const [dbPath, setDbPath] = useState<{
    id: string
    title: string
    company: string
    description: string
    location: string
    country: string
    isRemote: boolean
    skills: string[]
    sector: string | null
    salaryMin: number | null
    salaryMax: number | null
    currency: string
    status: string
    tier: string
    createdAt: string
    anchor?: { name: string | null }
    _count?: { chapters: number; savedBy: number }
  } | null>(null)

  useEffect(() => {
    if (agentData) {
      setLoading(false)
      return
    }

    const mockFallback = (pathId: string) => {
      const mock = MOCK_VENTURE_PATHS.find((p) => p.id === pathId)
      if (mock) {
        setDbPath({
          id: mock.id,
          title: mock.title,
          company: mock.anchorName,
          description: `${mock.title} at ${mock.anchorName}. Located in ${mock.location}. ${mock.tags.join(', ')} skills required.`,
          location: mock.location,
          country: mock.country ?? 'KE',
          isRemote: mock.isRemote,
          skills: mock.tags,
          sector:
            mock.category === 'professional'
              ? 'tech'
              : mock.category === 'explorer'
                ? 'safari'
                : mock.category,
          salaryMin: null,
          salaryMax: null,
          currency: 'USD',
          status: 'OPEN',
          tier: mock.isFeatured ? 'FEATURED' : 'BASIC',
          createdAt: new Date().toISOString(),
        })
      }
    }

    // Try DB first, fallback to mock data
    fetch(`/api/paths/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.path) {
          setDbPath(data.path)
        } else {
          mockFallback(id)
        }
      })
      .catch(() => {
        mockFallback(id)
      })
      .finally(() => setLoading(false))
  }, [id, agentData])

  const path = dbPath

  // Show skeleton while loading path data
  if (loading && !agentData) {
    return (
      <SectionLayout>
        <div className="mb-phi-4 h-4 w-32 bg-white/5 rounded animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <GlassCard padding="lg">
              <div className="space-y-4 animate-pulse">
                <div className="h-6 w-24 bg-white/5 rounded-full" />
                <div className="h-8 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
                <div className="h-32 bg-white/5 rounded-lg mt-6" />
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 w-20 bg-white/5 rounded-full" />
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
          <div className="space-y-4">
            <GlassCard padding="md">
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-3 w-full bg-white/5 rounded mb-1" />
                    <div className="h-1.5 bg-white/5 rounded-full" />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </SectionLayout>
    )
  }

  // Not found (only after loading completes)
  if (!agentData && !path) {
    return (
      <SectionLayout>
        <div className="py-phi-7 text-center">
          <h1 className="text-phi-xl font-bold text-white">{t('exchangeDetail.notFound')}</h1>
          <p className="mt-phi-2 text-white/50">{t('exchangeDetail.notFoundDesc')}</p>
          <button
            onClick={() => (window.history.length > 1 ? router.back() : router.push('/exchange'))}
            className="mt-phi-4 inline-flex items-center gap-phi-1 text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('exchangeDetail.backToExchange')}
          </button>
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
      (identity.craft ?? []).some((uc) => areSkillsEquivalent(uc, c))
    )

    const handleConnect = () => {
      setMessageSent(true)
      setTimeout(() => router.push(`/messages?dm=${agent.id}`), 1500)
    }

    return (
      <SectionLayout>
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/exchange'))}
          className="mb-phi-4 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('exchangeDetail.backToExchange')}
        </button>

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
                      {agent.type === 'ai'
                        ? `🤖 ${t('exchangeDetail.aiAgent')}`
                        : `✨ ${t('exchangeDetail.human')}`}
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
                  <div className="text-phi-xs text-white/40">{t('exchangeDetail.match')}</div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-phi-5">
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">
                  {t('exchangeDetail.about')}
                </h2>
                <p className="text-white/60 leading-relaxed">{agent.bio}</p>
              </div>

              {/* Exchange Proposals */}
              {agent.exchangeProposals.length > 0 && (
                <div className="mb-phi-5">
                  <h2 className="text-phi-base font-semibold text-white/70 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-brand-accent" />
                    {t('exchangeDetail.proposals')}
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
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">
                  {t('exchangeDetail.languages')}
                </h2>
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
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">
                  {t('exchangeDetail.craftSkills')}
                </h2>
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
                <h2 className="text-phi-base font-semibold text-white/70 mb-2">
                  {t('exchangeDetail.interests')}
                </h2>
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
              <h3 className="text-phi-base font-semibold text-white mb-3">
                {t('exchangeDetail.matchBreakdown')}
              </h3>
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
                <span className="text-phi-sm text-white/60 font-medium">
                  {t('exchangeDetail.total')}
                </span>
                <span className="text-phi-sm text-brand-accent font-bold">{score}%</span>
              </div>
            </GlassCard>

            {/* Shared Languages */}
            {sharedLangs.length > 0 && (
              <GlassCard padding="md">
                <h3 className="text-phi-sm font-semibold text-white/70 mb-2">
                  {t('exchangeDetail.youBothSpeak')}
                </h3>
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
                  <p className="text-brand-accent font-semibold text-phi-sm">
                    {t('exchangeDetail.connectionSent')}
                  </p>
                  <p className="text-white/40 text-phi-xs mt-1">
                    {t('exchangeDetail.redirecting')}
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleConnect}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-primary py-3 text-phi-base font-semibold text-white transition-all hover:bg-brand-primary/80 active:scale-[0.98] mb-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t('exchangeDetail.connectWith', { name: agent.name.split(' ')[0] })}
                  </button>
                  <p className="text-center text-phi-xs text-white/30">
                    {t('exchangeDetail.opensConversation')}
                  </p>
                </>
              )}
            </GlassCard>
          </div>
        </div>
      </SectionLayout>
    )
  }

  // ── Opportunity detail (from real DB) ──
  if (path) {
    const countryInfo = COUNTRY_OPTIONS.find((c) => c.code === path.country)
    const anchorName = path.anchor?.name || path.company
    const salaryDisplay =
      path.salaryMin || path.salaryMax
        ? `${path.currency} ${(path.salaryMin || 0).toLocaleString()}${path.salaryMax ? ` - ${path.salaryMax.toLocaleString()}` : '+'}`
        : t('exchangeDetail.competitive')
    const postedAgo = (() => {
      const diff = Date.now() - new Date(path.createdAt).getTime()
      const h = Math.floor(diff / 3600000)
      if (h < 24) return `${h}h ago`
      return `${Math.floor(h / 24)}d ago`
    })()
    const sectorIcon =
      path.sector === 'tech'
        ? '💻'
        : path.sector === 'healthcare'
          ? '🏥'
          : path.sector === 'safari'
            ? '🦁'
            : '📡'

    return (
      <SectionLayout>
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/exchange'))}
          className="mb-phi-4 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('exchangeDetail.backToExchange')}
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard variant="featured" padding="lg">
              {/* Header */}
              <div className="mb-phi-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full border border-brand-accent/30 px-2 py-0.5 text-phi-xs text-brand-accent">
                    Path
                  </span>
                  {(path.tier === 'FEATURED' || path.tier === 'PREMIUM') && (
                    <span className="rounded-full bg-brand-accent/20 px-2 py-0.5 text-phi-xs text-brand-accent">
                      {path.tier === 'PREMIUM' ? 'Premium' : 'Featured'}
                    </span>
                  )}
                  {path.isRemote && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-phi-xs text-white/60">
                      Remote
                    </span>
                  )}
                </div>
                <h1 className="text-phi-2xl font-bold text-white">
                  {sectorIcon} {path.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-white/50">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {anchorName}
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
                  <p className="text-phi-xs text-white/40">{t('exchangeDetail.compensation')}</p>
                  <p className="text-phi-sm font-semibold text-white">{salaryDisplay}</p>
                </div>
                <div className="glass-subtle rounded-lg p-3">
                  <p className="text-phi-xs text-white/40">{t('exchangeDetail.posted')}</p>
                  <p className="text-phi-sm font-semibold text-white">{postedAgo}</p>
                </div>
                {path._count && path._count.chapters > 0 && (
                  <div className="glass-subtle rounded-lg p-3">
                    <p className="text-phi-xs text-white/40">
                      {t('exchangeDetail.chaptersOpened')}
                    </p>
                    <p className="text-phi-sm font-semibold text-white">{path._count.chapters}</p>
                  </div>
                )}
                {path.sector && (
                  <div className="glass-subtle rounded-lg p-3">
                    <p className="text-phi-xs text-white/40">{t('exchangeDetail.sector')}</p>
                    <p className="text-phi-sm font-semibold text-white capitalize">{path.sector}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {path.description && (
                <div className="mb-phi-5">
                  <h2 className="mb-2 text-phi-base font-semibold text-white/70">
                    {t('exchangeDetail.aboutPath')}
                  </h2>
                  <p className="text-white/60 text-phi-sm leading-relaxed whitespace-pre-line">
                    {path.description}
                  </p>
                </div>
              )}

              {/* Skills */}
              <div>
                <h2 className="mb-2 text-phi-base font-semibold text-white/70">
                  {t('exchangeDetail.skillsRequired')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill) => {
                    const shared = (identity.craft ?? []).some((c) => areSkillsEquivalent(c, skill))
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
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <GlassCard padding="md">
              {showPayment && path.salaryMin ? (
                <PaymentCheckout
                  amount={path.salaryMin}
                  currency={path.currency}
                  pathId={path.id}
                  description={`Chapter: ${path.title}`.slice(0, 13)}
                  onSuccess={() => {
                    setShowPayment(false)
                    setApplied(true)
                  }}
                  onCancel={() => setShowPayment(false)}
                />
              ) : applied ? (
                <div className="text-center py-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-semibold text-phi-sm">Chapter opened!</p>
                  <p className="text-white/40 text-phi-xs mt-1">
                    The Anchor will review your profile.
                  </p>
                  <Link
                    href="/me"
                    className="mt-3 inline-block text-brand-accent text-phi-xs hover:underline"
                  >
                    View in My Exchanges →
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      setApplying(true)
                      setApplyError('')
                      try {
                        const res = await fetch('/api/chapters', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            pathId: path.id,
                            pathSkills: path.skills,
                            pathSectors: path.sector ? [path.sector] : [],
                            userCrafts: identity.craft ?? [],
                            userInterests: identity.interests,
                          }),
                        })
                        const data = await res.json()
                        if (data.success) {
                          setApplied(true)
                          awardXP('APPLY_PATH')
                        } else {
                          setApplyError(data.error || 'Could not apply. Please log in first.')
                        }
                      } catch {
                        setApplyError('Network error. Please try again.')
                      } finally {
                        setApplying(false)
                      }
                    }}
                    disabled={applying}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-primary py-3 text-phi-base font-semibold text-white transition-all hover:bg-brand-primary/80 active:scale-[0.98] mb-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {applying ? 'Opening Chapter...' : t('exchangeDetail.applyForPath')}
                  </button>
                  {applyError && (
                    <p className="text-center text-phi-xs text-red-400 mt-1">{applyError}</p>
                  )}
                  <p className="text-center text-phi-xs text-white/30">
                    Opens a Chapter — the Anchor reviews your profile
                  </p>
                </>
              )}
            </GlassCard>

            <GlassCard padding="md">
              <h3 className="text-phi-sm font-semibold text-white/70 mb-2">
                {t('exchangeDetail.postedBy')}
              </h3>
              <p className="text-white font-medium">{anchorName}</p>
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

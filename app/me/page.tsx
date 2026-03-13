'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { LANGUAGE_REGISTRY, COUNTRY_OPTIONS, type LanguageCode } from '@/lib/country-selector'
import { getCategoriesByIds, EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
// Real data fetched from API routes (chapters, paths, profile)
import {
  FAITH_OPTIONS,
  REACH_OPTIONS,
  DIMENSION_META,
  CRAFT_SUGGESTIONS,
  getFaithOption,
  getReachOption,
  getCultureSuggestionsForCountry,
} from '@/lib/dimensions'
import { getMarketScore, getSignalsForRegion } from '@/lib/market-data'
import ModeToggle from '@/components/ModeToggle'
import GlassCard from '@/components/ui/GlassCard'
import StatCard from '@/components/ui/StatCard'
import { SkeletonDashboard } from '@/components/Skeleton'
import JourneyProgress from '@/components/JourneyProgress'
import { useProfileSync, type DimensionPriority } from '@/lib/hooks/use-profile-sync'
import { computeCompleteness } from '@/lib/profile-completeness'
import StatHexagon from '@/components/StatHexagon'
import { getRouteInfo } from '@/lib/compass'
import { getCountryHighlights } from '@/lib/country-highlights'
import { useXPContext } from '@/components/XPProvider'

// ─── Tab definitions ────────────────────────────────────────────────────────

const EXPLORER_TAB_IDS = ['Dashboard', 'Saved', 'Exchanges', 'Referrals'] as const
const HOST_TAB_IDS = ['Dashboard', 'Offerings', 'Requests', 'Earnings'] as const
const SHARED_TAB_IDS = ['Profile', 'Settings'] as const

const TAB_KEYS: Record<string, string> = {
  Dashboard: 'me.tabDashboard',
  Saved: 'me.tabSaved',
  Exchanges: 'me.tabExchanges',
  Referrals: 'me.tabReferrals',
  Offerings: 'me.tabOfferings',
  Requests: 'me.tabRequests',
  Earnings: 'me.tabEarnings',
  Profile: 'me.tabProfile',
  Settings: 'me.tabSettings',
}

type TabId = string

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCountryFlag(code: string): string {
  return COUNTRY_OPTIONS.find((c) => c.code === code)?.flag ?? '🌍'
}

function getLanguageName(code: string): string {
  const lang = LANGUAGE_REGISTRY[code as LanguageCode]
  return lang?.nativeName ?? lang?.name ?? code
}

// ─── Chapter status badge ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    SHORTLISTED: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/40',
    REVIEWED: 'bg-blue-900/60 text-blue-300 border-blue-700/40',
    PENDING: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
    ACCEPTED: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/40',
    REJECTED: 'bg-red-900/60 text-red-300 border-red-700/40',
  }
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border ${colors[status] ?? 'bg-white/10 text-white/60 border-white/20'}`}
    >
      {status}
    </span>
  )
}

// ─── Page component ─────────────────────────────────────────────────────────

export default function MePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    identity,
    countryName,
    hasCompletedDiscovery,
    localizeCountry,
    setMode,
    setLanguages,
    setInterests,
    setCity,
    setFaith,
    setCraft,
    setReach,
    setCulture,
    setToCountries,
  } = useIdentity()

  const [activeTab, setActiveTab] = useState<TabId>('Profile')
  const [mounted, setMounted] = useState(false)
  const [destSearch, setDestSearch] = useState('')
  const { saving, lastSaved, pioneerId, saveProfile } = useProfileSync()
  const { totalXP, level, levelName, progressToNext, awardXP } = useXPContext()
  const [priorities, setPriorities] = useState<Record<string, DimensionPriority>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = localStorage.getItem('be-priorities')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Persist priorities to localStorage for Exchange page access
  useEffect(() => {
    try {
      localStorage.setItem('be-priorities', JSON.stringify(priorities))
    } catch {
      // Ignore
    }
  }, [priorities])

  // Auto-save identity dimensions to DB when they change
  const syncIdentity = useCallback(() => {
    saveProfile({
      country: identity.country,
      language: identity.language,
      languages: identity.languages,
      interests: identity.interests,
      reach: identity.reach,
      faith: identity.faith,
      culture: identity.culture ?? '',
      crafts: identity.craft,
      city: identity.city ?? '',
      toCountries: identity.toCountries,
      priorities,
    })
  }, [
    identity.country,
    identity.language,
    identity.languages,
    identity.interests,
    identity.reach,
    identity.faith,
    identity.culture,
    identity.craft,
    identity.city,
    identity.toCountries,
    priorities,
    saveProfile,
  ])

  // Trigger save when identity changes (after initial mount)
  useEffect(() => {
    if (mounted) {
      syncIdentity()
      // Award one-time XP for setting identity (idempotent via API)
      awardXP('SET_IDENTITY')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    identity.country,
    identity.language,
    identity.interests.length,
    identity.reach.length,
    identity.faith.length,
    identity.culture,
    identity.craft.length,
    identity.city,
    identity.toCountries.length,
    priorities,
  ])

  // Real data from API
  const [dbChapters, setDbChapters] = useState<
    Array<{
      id: string
      pathId: string
      status: string
      createdAt: string
      path?: { title: string; company: string }
    }>
  >([])
  const [dbPaths, setDbPaths] = useState<
    Array<{
      id: string
      title: string
      company: string
      anchorName?: string
      location: string
      sector: string | null
      skills: string[]
      createdAt: string
    }>
  >([])
  const [userProfile, setUserProfile] = useState<{
    name?: string
    referralCode?: string
  } | null>(null)

  // Form state for Profile tab
  const [editCity, setEditCity] = useState(identity.city ?? '')
  const [editBio, setEditBio] = useState('')
  const [editHeadline, setEditHeadline] = useState('')
  const [editExperience, setEditExperience] = useState<number | ''>('')
  const [editPioneerType, setEditPioneerType] = useState('')
  const [editLinkedin, setEditLinkedin] = useState('')
  const [editUpwork, setEditUpwork] = useState('')
  const [editFiverr, setEditFiverr] = useState('')
  const [editVideoUrl, setEditVideoUrl] = useState('')
  const [craftSearch, setCraftSearch] = useState('')
  const [langSearch, setLangSearch] = useState('')

  // Dimension keys for priority selector
  const DIMENSION_KEYS = [
    { key: 'language', icon: '🗣', labelKey: 'me.dimLanguage' },
    { key: 'craft', icon: '🔧', labelKey: 'me.dimCraft' },
    { key: 'faith', icon: '🙏', labelKey: 'me.dimFaith' },
    { key: 'reach', icon: '🌐', labelKey: 'me.dimReach' },
    { key: 'culture', icon: '🌿', labelKey: 'me.dimCulture' },
    { key: 'interests', icon: '❤️', labelKey: 'me.dimInterests' },
    { key: 'location', icon: '📍', labelKey: 'me.dimLocation' },
    { key: 'market', icon: '📊', labelKey: 'me.dimMarket' },
  ] as const

  useEffect(() => {
    setMounted(true)

    // Fetch chapters (user's exchanges) — requires auth
    fetch('/api/chapters')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setDbChapters(data.data)
      })
      .catch(() => {})

    // Fetch paths for host offerings tab
    fetch('/api/paths?limit=20&status=OPEN')
      .then((r) => r.json())
      .then((data) => {
        if (data.paths) setDbPaths(data.paths)
      })
      .catch(() => {})

    // Fetch user profile
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setUserProfile(data.data)
          const p = data.data.profile
          if (p?.priorities) {
            setPriorities(p.priorities as Record<string, DimensionPriority>)
          }
          if (p?.bio) setEditBio(p.bio)
          if (p?.headline) setEditHeadline(p.headline)
          if (p?.experience !== null && p?.experience !== undefined) setEditExperience(p.experience)
          if (p?.pioneerType) setEditPioneerType(p.pioneerType)
          if (p?.linkedinUrl) setEditLinkedin(p.linkedinUrl)
          if (p?.upworkUrl) setEditUpwork(p.upworkUrl)
          if (p?.fiverrUrl) setEditFiverr(p.fiverrUrl)
          if (p?.videoUrl) setEditVideoUrl(p.videoUrl)
        }
      })
      .catch(() => {})
  }, [])

  // Reset tab to Dashboard when mode changes
  const handleModeChange = (newMode: 'explorer' | 'host') => {
    setMode(newMode)
    setActiveTab('Dashboard')
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <div className="max-w-3xl mx-auto px-phi-4 py-phi-7">
          <SkeletonDashboard />
        </div>
      </main>
    )
  }

  if (!hasCompletedDiscovery) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <p className="text-phi-2xl mb-4">👤</p>
          <h2 className="text-phi-xl font-bold text-white mb-3">{t('me.setupTitle')}</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">{t('me.setupDescription')}</p>
          <Link
            href="/"
            className="inline-block bg-brand-accent text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-colors"
          >
            {t('me.goToDiscovery')}
          </Link>
        </div>
      </main>
    )
  }

  // ─── Profile completeness (self-enrichment engine) ──────────────────
  const completeness = computeCompleteness(identity, !!editBio, false)

  // ─── Dimension activity count ──────────────────────────────────────
  const activeDimensions = completeness.dimensions.filter((d) => d.filled).length

  const marketSignals = getSignalsForRegion(identity.country)
  const marketScore = getMarketScore(
    { country: identity.country, craft: identity.craft, interests: identity.interests },
    marketSignals
  )

  // ─── Stat Hexagon breakdown (self-assessment from profile richness) ─────
  const hexBreakdown = {
    language: Math.min(20, (identity.languages?.length || 0) * 5),
    market: Math.min(20, marketScore),
    craft: Math.min(15, (identity.craft?.length || 0) * 3),
    passion: Math.min(15, (identity.interests?.length || 0) * 3),
    location: identity.city ? 10 : identity.country ? 5 : 0,
    faith: Math.min(8, (identity.faith?.length || 0) * 4),
    reach: Math.min(7, (identity.reach?.length || 0) * 2),
    culture: identity.culture ? 5 : 0,
  }

  const modeTabs = identity.mode === 'explorer' ? EXPLORER_TAB_IDS : HOST_TAB_IDS
  const allTabs = [...modeTabs, ...SHARED_TAB_IDS]
  const userInterests = getCategoriesByIds(identity.interests)
  const flag = getCountryFlag(identity.country)
  // Derive display name from profile or identity
  const displayName = userProfile?.name || identity.city || countryName || t('me.defaultName')
  const referralCode =
    userProfile?.referralCode || `BE-${displayName.replace(/\s+/g, '').toUpperCase().slice(0, 6)}`
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // ─── Tab content renderers ─────────────────────────────────────────────

  function renderExplorerDashboard() {
    return (
      <div className="space-y-phi-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-phi-4">
          <StatCard label={t('me.connections')} value={12} icon={<span>🤝</span>} accent />
          <StatCard label={t('me.matches')} value={42} icon={<span>🎯</span>} />
          <StatCard label={t('me.active')} value={3} icon={<span>⚡</span>} />
        </div>

        {/* Profile completeness — self-enrichment motivator */}
        {completeness.score < 100 && (
          <GlassCard padding="md">
            <div className="flex items-center gap-4">
              {/* Circular score */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={
                      completeness.score >= 80
                        ? '#22c55e'
                        : completeness.score >= 50
                          ? '#C9A227'
                          : '#ef4444'
                    }
                    strokeWidth="3"
                    strokeDasharray={`${completeness.score}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {completeness.score}%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-phi-sm">
                  {t('me.profileComplete', { score: String(completeness.score) })}
                </p>
                <p className="text-white/40 text-phi-xs mt-0.5">
                  {completeness.matchBoost >= 1.2
                    ? t('me.matchBoostMax')
                    : completeness.matchBoost >= 1.0
                      ? t('me.matchBoostGood')
                      : t('me.matchBoostLow')}
                </p>
                {/* Unfilled dimensions as quick-fill chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {completeness.dimensions
                    .filter((d) => !d.filled)
                    .slice(0, 4)
                    .map((d) => (
                      <Link
                        key={d.key}
                        href={d.route}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-[10px] hover:bg-brand-accent/10 hover:text-brand-accent transition-colors border border-white/10"
                      >
                        {d.icon} {d.label}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    )
  }

  function renderHostDashboard() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-phi-4">
        <StatCard label={t('me.views')} value={156} icon={<span>👁️</span>} accent />
        <StatCard label={t('me.requestsCount')} value={8} icon={<span>📩</span>} />
        <StatCard label={t('me.earningsLabel')} value="$0" icon={<span>💰</span>} />
      </div>
    )
  }

  function renderSaved() {
    return (
      <GlassCard variant="subtle" padding="lg">
        <div className="text-center py-phi-7">
          <p className="text-phi-2xl mb-phi-2">🔖</p>
          <p className="text-white/60">{t('me.noSavedItems')}</p>
          <p className="text-phi-sm text-white/40 mt-phi-1">{t('me.savedItemsHint')}</p>
        </div>
      </GlassCard>
    )
  }

  function renderExchanges() {
    if (dbChapters.length === 0) {
      return (
        <GlassCard variant="subtle" padding="lg">
          <p className="text-center text-white/60">{t('me.noExchanges')}</p>
          <p className="text-phi-sm text-white/40 mt-phi-1 text-center">{t('me.exchangesHint')}</p>
        </GlassCard>
      )
    }
    return (
      <div className="space-y-phi-3">
        {dbChapters.map((ch) => (
          <GlassCard key={ch.id} hover padding="md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{ch.path?.title ?? t('me.defaultPath')}</h3>
                <p className="text-phi-sm text-white/50">
                  {ch.path?.company ?? t('me.unknownAnchor')}
                </p>
              </div>
              <StatusBadge status={ch.status} />
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  function renderReferrals() {
    return (
      <div className="space-y-phi-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-phi-4">
          <StatCard label={t('me.referralsSent')} value={3} icon={<span>📤</span>} />
          <StatCard label={t('me.successful')} value={1} icon={<span>✅</span>} accent />
        </div>
        <GlassCard variant="subtle" padding="md">
          <p className="text-phi-sm text-white/60">
            {t('me.yourReferralCode')}{' '}
            <span className="text-brand-accent font-mono font-medium">{referralCode}</span>
          </p>
        </GlassCard>
        <Link
          href="/referral"
          className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-accent-light text-phi-sm transition-colors mt-phi-2"
        >
          View full referral page &rarr;
        </Link>
      </div>
    )
  }

  function renderOfferings() {
    if (dbPaths.length === 0) {
      return (
        <GlassCard variant="subtle" padding="lg">
          <div className="text-center py-phi-7">
            <p className="text-phi-2xl mb-phi-2">📋</p>
            <p className="text-white/60">{t('me.noOfferings')}</p>
            <p className="text-phi-sm text-white/40 mt-phi-1">{t('me.offeringsHint')}</p>
          </div>
        </GlassCard>
      )
    }
    return (
      <div className="space-y-phi-3">
        {dbPaths.slice(0, 6).map((p) => {
          const icon =
            p.sector === 'tech'
              ? '💻'
              : p.sector === 'healthcare'
                ? '🏥'
                : p.sector === 'safari'
                  ? '🦁'
                  : p.sector === 'hospitality'
                    ? '🏨'
                    : p.sector === 'finance'
                      ? '💰'
                      : '📡'
          return (
            <GlassCard key={p.id} hover padding="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-phi-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <h3 className="text-white font-medium">{p.title}</h3>
                    <p className="text-phi-sm text-white/50">
                      {p.anchorName || p.company} &middot; {p.location}
                    </p>
                  </div>
                </div>
                <span className="text-phi-sm text-white/40">{p.skills.slice(0, 2).join(', ')}</span>
              </div>
            </GlassCard>
          )
        })}
      </div>
    )
  }

  function renderRequests() {
    return (
      <GlassCard variant="subtle" padding="lg">
        <div className="text-center py-phi-7">
          <p className="text-phi-2xl mb-phi-2">📬</p>
          <p className="text-white/60">{t('me.noRequests')}</p>
          <p className="text-phi-sm text-white/40 mt-phi-1">{t('me.requestsHint')}</p>
        </div>
      </GlassCard>
    )
  }

  function renderEarnings() {
    return (
      <GlassCard variant="subtle" padding="lg">
        <div className="text-center py-phi-7">
          <p className="text-phi-2xl mb-phi-2">💵</p>
          <p className="text-white/60">{t('me.noEarnings')}</p>
          <p className="text-phi-sm text-white/40 mt-phi-1">{t('me.earningsHint')}</p>
        </div>
      </GlassCard>
    )
  }

  function renderProfile() {
    const faithOptions = identity.faith.map((f) => getFaithOption(f)).filter(Boolean)

    return (
      <div className="space-y-phi-5">
        {/* 1. Location */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">
            <span className="mr-1">📍</span> {t('me.location')}
          </label>
          <input
            type="text"
            value={editCity}
            onChange={(e) => setEditCity(e.target.value)}
            onBlur={() => setCity(editCity)}
            placeholder={t('me.locationPlaceholder')}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors"
          />
          <p className="text-xs text-white/30 mt-phi-1">
            {flag} {localizeCountry(identity.country)}
            {identity.city ? ` \u00b7 ${identity.city}` : ''}
          </p>
        </GlassCard>

        {/* 2. Languages */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🗣️</span> {t('me.languages')}
          </label>
          <div className="flex flex-wrap gap-phi-2">
            {identity.languages.map((code) => (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/30 text-phi-sm"
              >
                {getLanguageName(code)}
                <button
                  type="button"
                  onClick={() => setLanguages(identity.languages.filter((l) => l !== code))}
                  className="ml-1 text-brand-accent/60 hover:text-brand-accent"
                  aria-label={`Remove ${getLanguageName(code)}`}
                >
                  &times;
                </button>
              </span>
            ))}
            {identity.languages.length === 0 && (
              <span className="text-phi-sm text-white/30 italic">{t('me.noLanguages')}</span>
            )}
          </div>
          {/* Add languages */}
          <div className="mt-phi-3">
            <input
              type="text"
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              placeholder={t('me.langSearchPlaceholder') || 'Search languages...'}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-phi-sm text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors mb-phi-2"
            />
            {langSearch.length >= 2 && (
              <div className="flex flex-wrap gap-phi-1">
                {Object.entries(LANGUAGE_REGISTRY)
                  .filter(
                    ([code, lang]) =>
                      (lang.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
                        lang.name.toLowerCase().includes(langSearch.toLowerCase())) &&
                      !identity.languages.includes(code as LanguageCode)
                  )
                  .slice(0, 8)
                  .map(([code, lang]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setLanguages([...identity.languages, code as LanguageCode])
                        setLangSearch('')
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-phi-xs hover:bg-brand-accent/20 hover:text-white/70 transition-colors"
                    >
                      + {lang.nativeName}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* 3. Craft */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🛠️</span> {t('me.craftAndSkills')}
          </label>
          <div className="flex flex-wrap gap-phi-2">
            {identity.craft.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary/20 text-white/90 border border-brand-primary/40 text-phi-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => setCraft(identity.craft.filter((c) => c !== skill))}
                  className="ml-1 text-white/40 hover:text-white"
                  aria-label={`Remove ${skill}`}
                >
                  &times;
                </button>
              </span>
            ))}
            {identity.craft.length === 0 && (
              <span className="text-phi-sm text-white/30 italic">{t('me.noCrafts')}</span>
            )}
          </div>
          {/* Craft search + suggestions */}
          <div className="mt-phi-3">
            <input
              type="text"
              value={craftSearch}
              onChange={(e) => setCraftSearch(e.target.value)}
              placeholder={t('me.craftSearchPlaceholder')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-phi-sm text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors mb-phi-2"
            />
            {craftSearch.length >= 2 && (
              <div className="flex flex-wrap gap-phi-1">
                {CRAFT_SUGGESTIONS.filter(
                  (c) =>
                    c.toLowerCase().includes(craftSearch.toLowerCase()) &&
                    !identity.craft.includes(c)
                )
                  .slice(0, 8)
                  .map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCraft([...identity.craft, c])
                        setCraftSearch('')
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-phi-xs hover:bg-brand-primary/20 hover:text-white/70 transition-colors"
                    >
                      + {c}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* 4. Interests / Passion */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">❤️</span> {t('me.passionAndInterests')}
          </label>
          <div className="flex flex-wrap gap-phi-2">
            {userInterests.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/80 border border-white/10 text-phi-sm"
              >
                <span>{cat.icon}</span>
                {t(cat.i18nKey) || cat.label}
                <button
                  type="button"
                  onClick={() => setInterests(identity.interests.filter((i) => i !== cat.id))}
                  className="ml-1 text-white/40 hover:text-white"
                  aria-label={`Remove ${t(cat.i18nKey) || cat.label}`}
                >
                  &times;
                </button>
              </span>
            ))}
            {userInterests.length === 0 && (
              <span className="text-phi-sm text-white/30 italic">{t('me.noInterests')}</span>
            )}
          </div>
          {/* Available interest categories to add */}
          {EXCHANGE_CATEGORIES.filter((c) => !identity.interests.includes(c.id)).length > 0 &&
            identity.interests.length < 5 && (
              <div className="flex flex-wrap gap-phi-1 mt-phi-3">
                {EXCHANGE_CATEGORIES.filter((c) => !identity.interests.includes(c.id))
                  .slice(0, 8)
                  .map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setInterests([...identity.interests, cat.id])}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-phi-xs hover:bg-white/10 hover:text-white/70 transition-colors"
                    >
                      <span>{cat.icon}</span>
                      {t(cat.i18nKey) || cat.label}
                    </button>
                  ))}
              </div>
            )}
        </GlassCard>

        {/* 5. Reach */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🌐</span> {t('me.reach')}
          </label>
          <div className="flex flex-wrap gap-phi-2">
            {identity.reach.map((id) => {
              const opt = getReachOption(id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/80 border border-white/10 text-phi-sm"
                >
                  <span>{opt?.icon ?? '🌐'}</span>
                  {(opt?.labelKey ? t(opt.labelKey) : '') || opt?.label || id}
                  <button
                    type="button"
                    onClick={() => setReach(identity.reach.filter((r) => r !== id))}
                    className="ml-1 text-white/40 hover:text-white"
                    aria-label={`Remove ${(opt?.labelKey ? t(opt.labelKey) : '') || opt?.label || id}`}
                  >
                    &times;
                  </button>
                </span>
              )
            })}
            {identity.reach.length === 0 && (
              <span className="text-phi-sm text-white/30 italic">{t('me.noReach')}</span>
            )}
          </div>
          {/* Available reach options to add */}
          {REACH_OPTIONS.filter((ro) => !identity.reach.includes(ro.id)).length > 0 && (
            <div className="flex flex-wrap gap-phi-1 mt-phi-3">
              {REACH_OPTIONS.filter((ro) => !identity.reach.includes(ro.id)).map((ro) => (
                <button
                  key={ro.id}
                  type="button"
                  onClick={() => setReach([...identity.reach, ro.id])}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-phi-xs hover:bg-white/10 hover:text-white/70 transition-colors"
                  title={ro.description}
                >
                  <span>{ro.icon}</span>
                  {t(ro.labelKey) || ro.label}
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        {/* 6. Faith (multi-select) */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🙏</span> {t('me.faith')}
          </label>
          {/* Selected faith badges with remove */}
          {faithOptions.length > 0 && (
            <div className="flex flex-wrap gap-phi-2 mb-phi-3">
              {faithOptions.map((opt) => (
                <span
                  key={opt!.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/30 text-phi-sm"
                >
                  <span>{opt!.icon}</span>
                  {t(opt!.labelKey) || opt!.label}
                  <button
                    type="button"
                    onClick={() => setFaith(identity.faith.filter((f) => f !== opt!.id))}
                    className="ml-1 text-brand-accent/60 hover:text-brand-accent"
                    aria-label={`Remove ${t(opt!.labelKey) || opt!.label}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
          {/* Available faith options to add */}
          {FAITH_OPTIONS.filter((fo) => !identity.faith.includes(fo.id)).length > 0 && (
            <div className="flex flex-wrap gap-phi-1">
              {FAITH_OPTIONS.filter((fo) => !identity.faith.includes(fo.id)).map((fo) => (
                <button
                  key={fo.id}
                  type="button"
                  onClick={() => setFaith([...identity.faith, fo.id])}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-phi-xs hover:bg-white/10 hover:text-white/70 transition-colors"
                >
                  <span>{fo.icon}</span>
                  {t(fo.labelKey) || fo.label}
                </button>
              ))}
            </div>
          )}
          {faithOptions.length === 0 && FAITH_OPTIONS.length === 0 && (
            <span className="text-phi-sm text-white/30 italic">{t('me.notSpecified')}</span>
          )}
        </GlassCard>

        {/* 7. Culture */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🌿</span> {t('me.culture')}
          </label>
          {identity.culture ? (
            <div className="flex items-center gap-phi-2 mb-phi-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/30 text-phi-sm">
                {identity.culture}
                <button
                  type="button"
                  onClick={() => setCulture(undefined)}
                  className="ml-1 text-brand-accent/60 hover:text-brand-accent"
                  aria-label={`Remove ${identity.culture}`}
                >
                  &times;
                </button>
              </span>
            </div>
          ) : (
            <p className="text-phi-sm text-white/30 italic mb-phi-3">{t('me.notSpecified')}</p>
          )}
          {/* Suggestions based on country */}
          {(() => {
            const suggestions = getCultureSuggestionsForCountry(identity.country)
            const available = suggestions.filter((s) => s !== identity.culture)
            if (available.length === 0) return null
            return (
              <div className="flex flex-wrap gap-phi-1">
                {available.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCulture(s)}
                    className="px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-phi-xs hover:bg-white/10 hover:text-white/70 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )
          })()}
        </GlassCard>

        {/* 8. Market Score */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">📊</span> {t('me.marketRelevance')}
          </label>
          <div className="flex items-center gap-phi-3 mb-phi-2">
            <span className="text-phi-xl font-bold text-brand-accent">{marketScore}/20</span>
            <div className="flex-1">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-accent rounded-full transition-all duration-500"
                  style={{ width: `${(marketScore / 20) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-white/30">{t('me.marketDescription')}</p>
        </GlassCard>

        {/* 9. Priorities — what matters most */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">
            <span className="mr-1">⚡</span> {t('me.priorities')}
          </label>
          <p className="text-xs text-white/30 mb-phi-3">{t('me.prioritiesDescription')}</p>
          <div className="space-y-2">
            {DIMENSION_KEYS.map(({ key, icon, labelKey }) => {
              const current = priorities[key] ?? 'medium'
              return (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-phi-sm text-white/70 min-w-[100px]">
                    {icon} {t(labelKey)}
                  </span>
                  <div className="flex gap-1">
                    {(['high', 'medium', 'low'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setPriorities((prev) => ({ ...prev, [key]: level }))
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-phi-xs font-medium transition-all ${
                          current === level
                            ? level === 'high'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                              : level === 'medium'
                                ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/40'
                                : 'bg-white/10 text-white/50 border border-white/20'
                            : 'bg-white/5 text-white/25 border border-transparent hover:bg-white/10 hover:text-white/40'
                        }`}
                      >
                        {t(`me.priority${level.charAt(0).toUpperCase() + level.slice(1)}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Bio */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">{t('me.bio')}</label>
          <textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            onBlur={() => saveProfile({ bio: editBio })}
            placeholder={t('me.bioPlaceholder')}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors resize-none"
          />
        </GlassCard>

        {/* Headline */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">
            <span className="mr-1">✨</span> {t('me.headline')}
          </label>
          <input
            type="text"
            value={editHeadline}
            onChange={(e) => setEditHeadline(e.target.value.slice(0, 100))}
            onBlur={() => saveProfile({ headline: editHeadline })}
            placeholder={t('me.headlinePlaceholder')}
            maxLength={100}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors"
          />
          <p className="text-xs text-white/30 mt-phi-1">{editHeadline.length}/100</p>
        </GlassCard>

        {/* Pioneer Type */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🧭</span> {t('me.pioneerType')}
          </label>
          <p className="text-xs text-white/40 mb-phi-2">{t('me.pioneerTypeDescription')}</p>
          <div className="flex flex-wrap gap-phi-2">
            {(
              ['explorer', 'professional', 'artisan', 'guardian', 'creator', 'healer'] as const
            ).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setEditPioneerType(type)
                  saveProfile({ pioneerType: type })
                }}
                className={`px-phi-3 py-phi-1 rounded-full text-phi-sm border transition-colors ${
                  editPioneerType === type
                    ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Experience */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">
            <span className="mr-1">📈</span> {t('me.experience')}
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={editExperience}
            onChange={(e) => setEditExperience(e.target.value === '' ? '' : Number(e.target.value))}
            onBlur={() => {
              if (editExperience !== '') saveProfile({ experience: Number(editExperience) })
            }}
            placeholder={t('me.experiencePlaceholder')}
            className="w-32 bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors"
          />
        </GlassCard>

        {/* External Profiles */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🔗</span> {t('me.externalProfiles')}
          </label>
          <div className="space-y-phi-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">LinkedIn</label>
              <input
                type="url"
                value={editLinkedin}
                onChange={(e) => setEditLinkedin(e.target.value)}
                onBlur={() => saveProfile({ linkedin: editLinkedin })}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors text-phi-sm"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Upwork</label>
              <input
                type="url"
                value={editUpwork}
                onChange={(e) => setEditUpwork(e.target.value)}
                onBlur={() => saveProfile({ upworkUrl: editUpwork })}
                placeholder="https://upwork.com/freelancers/..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors text-phi-sm"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Fiverr</label>
              <input
                type="url"
                value={editFiverr}
                onChange={(e) => setEditFiverr(e.target.value)}
                onBlur={() => saveProfile({ fiverrUrl: editFiverr })}
                placeholder="https://fiverr.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors text-phi-sm"
              />
            </div>
          </div>
        </GlassCard>

        {/* Video Introduction */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">
            <span className="mr-1">🎥</span> {t('me.videoUrl')}
          </label>
          <input
            type="url"
            value={editVideoUrl}
            onChange={(e) => setEditVideoUrl(e.target.value)}
            onBlur={() => saveProfile({ videoUrl: editVideoUrl })}
            placeholder={t('me.videoUrlPlaceholder')}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors text-phi-sm"
          />
          <p className="text-xs text-white/30 mt-phi-1">{t('me.videoUrlHint')}</p>
        </GlassCard>

        {/* Destination Preferences */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">
            <span className="mr-1">🌍</span> Where do you want to go?
          </label>

          {/* Selected destinations as removable pills */}
          {identity.toCountries.length > 0 && (
            <div className="flex flex-wrap gap-phi-2 mb-phi-3">
              {identity.toCountries.map((code) => {
                const name = localizeCountry(code)
                const flag = COUNTRY_OPTIONS.find((c) => c.code === code)?.flag || ''
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-phi-3 py-phi-1 rounded-full bg-brand-accent/15 text-brand-accent text-phi-sm border border-brand-accent/30"
                  >
                    {flag} {name}
                    <button
                      onClick={() => {
                        const updated = identity.toCountries.filter((c) => c !== code)
                        setToCountries(updated)
                        saveProfile({ toCountries: updated })
                      }}
                      className="ml-1 text-white/40 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Search input */}
          {identity.toCountries.length < 10 && (
            <div className="relative">
              <input
                type="text"
                value={destSearch}
                onChange={(e) => setDestSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors text-phi-sm"
              />
              {destSearch.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-brand-surface border border-white/10 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {COUNTRY_OPTIONS.filter(
                    (c) =>
                      c.name.toLowerCase().includes(destSearch.toLowerCase()) &&
                      c.code !== identity.country &&
                      !identity.toCountries.includes(c.code)
                  )
                    .slice(0, 8)
                    .map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          const updated = [...identity.toCountries, c.code]
                          setToCountries(updated)
                          saveProfile({ toCountries: updated })
                          setDestSearch('')
                        }}
                        className="w-full text-left px-phi-3 py-phi-2 text-phi-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                      >
                        {c.flag} {c.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Route suggestions for selected destinations */}
          {identity.toCountries.length > 0 && (
            <div className="mt-phi-3 space-y-phi-2">
              <p className="text-xs text-white/40">Route strength:</p>
              {identity.toCountries.map((code) => {
                const route = getRouteInfo(identity.country, code)
                const name = localizeCountry(code)
                const highlights = getCountryHighlights(code).slice(0, 2)
                return (
                  <div
                    key={code}
                    className="p-phi-2 rounded-lg bg-white/3 border border-white/5 text-phi-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">
                        {identity.country} → {code}: <strong className="text-white">{name}</strong>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          route?.strength === 'direct'
                            ? 'bg-green-500/20 text-green-400'
                            : route?.strength === 'partner'
                              ? 'bg-brand-accent/20 text-brand-accent'
                              : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {route?.strength || 'emerging'}
                      </span>
                    </div>
                    {route && (
                      <p className="text-white/40 mt-1">
                        {route.primarySectors.slice(0, 3).join(', ')}
                      </p>
                    )}
                    {highlights.length > 0 && (
                      <p className="text-white/30 mt-0.5">
                        {highlights.map((h) => h.name).join(' · ')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>

        {/* Redo Discovery */}
        <div className="mt-phi-7 pt-phi-5 border-t border-white/10">
          <div className="text-center">
            <p className="text-phi-sm text-white/40 mb-phi-3">
              {t('me.redoDiscoveryHint') || 'Want to start fresh? Redo the discovery process.'}
            </p>
            <Link
              href="/onboarding?redo=true"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 border border-white/10 text-phi-sm hover:bg-white/10 hover:text-white transition-colors"
            >
              {t('me.redoDiscovery') || 'Redo Discovery'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  function renderSettings() {
    return (
      <div className="space-y-phi-4">
        <GlassCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{t('me.pushNotifications')}</h3>
              <p className="text-phi-sm text-white/50">{t('me.pushNotificationsDesc')}</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-brand-accent/30 relative cursor-pointer">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-brand-accent transition-transform" />
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{t('me.emailUpdates')}</h3>
              <p className="text-phi-sm text-white/50">{t('me.emailUpdatesDesc')}</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-white/10 relative cursor-pointer">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/40 transition-transform" />
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{t('me.profileVisibility')}</h3>
              <p className="text-phi-sm text-white/50">{t('me.profileVisibilityDesc')}</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-brand-accent/30 relative cursor-pointer">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-brand-accent transition-transform translate-x-4" />
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  function renderTabContent() {
    if (activeTab === 'Profile') return renderProfile()
    if (activeTab === 'Settings') return renderSettings()

    if (identity.mode === 'explorer') {
      switch (activeTab) {
        case 'Dashboard':
          return renderExplorerDashboard()
        case 'Saved':
          return renderSaved()
        case 'Exchanges':
          return renderExchanges()
        case 'Referrals':
          return renderReferrals()
      }
    } else {
      switch (activeTab) {
        case 'Dashboard':
          return renderHostDashboard()
        case 'Offerings':
          return renderOfferings()
        case 'Requests':
          return renderRequests()
        case 'Earnings':
          return renderEarnings()
      }
    }
    return null
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-brand-bg">
      <div className="max-w-3xl mx-auto px-phi-4 py-phi-7">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-phi-7">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-white text-phi-xl font-bold mb-phi-3 border-2 border-brand-accent/30">
            {initials}
          </div>

          {/* Name */}
          <h1 className="text-phi-2xl font-bold text-white mb-phi-1">{displayName}</h1>

          {/* Location */}
          <p className="text-white/60 mb-phi-2">
            {flag} {localizeCountry(identity.country)}
            {identity.city ? ` \u00b7 ${identity.city}` : ''}
          </p>

          {/* Language badges */}
          <div className="flex flex-wrap justify-center gap-phi-1 mb-phi-3">
            {identity.languages.map((code) => (
              <span
                key={code}
                className="px-2 py-0.5 rounded-full bg-white/5 text-white/60 text-xs border border-white/10"
              >
                {getLanguageName(code)}
              </span>
            ))}
          </div>

          {/* Pioneer ID (shareable) */}
          {pioneerId && (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(pioneerId)
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono mb-phi-2 hover:bg-brand-accent/20 transition-colors"
              title={t('me.copyId')}
            >
              🆔 {pioneerId}
              <span className="text-[9px] text-brand-accent/60 uppercase tracking-wider">
                {t('me.tapToCopy')}
              </span>
            </button>
          )}

          {/* Dimension count */}
          <p className="text-phi-sm text-white/40">
            {t('me.dimensionsActive', { count: String(activeDimensions) })}
          </p>

          {/* Save indicator */}
          {saving && (
            <p className="text-[10px] text-white/30 mt-phi-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-accent/50 animate-pulse" />
              {t('me.saving')}
            </p>
          )}
          {!saving && lastSaved && (
            <p className="text-[10px] text-white/20 mt-phi-1">✓ {t('me.saved')}</p>
          )}

          {/* ── XP Progress Bar ──────────────────────────────────────── */}
          <div className="mt-phi-3 w-full max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-brand-accent">
                Lv.{level} — {levelName}
              </span>
              <span className="text-[10px] text-white/40 font-mono">{totalXP} XP</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent/80 to-brand-accent transition-all duration-700"
                style={{ width: `${Math.round(progressToNext * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Next Steps (contextual prompts) ─────────────────────────── */}
        {(() => {
          const steps: Array<{ text: string; href: string }> = []
          if (identity.languages.length === 0)
            steps.push({
              text: 'Add your languages to find matching pioneers',
              href: '/?discover=true',
            })
          if (identity.interests.length === 0)
            steps.push({ text: 'Select your interests to discover paths', href: '/?discover=true' })
          if (identity.craft.length === 0)
            steps.push({
              text: 'Set your craft to attract the right opportunities',
              href: '/?discover=true',
            })
          if (steps.length === 0)
            steps.push({
              text: 'Explore the Exchange to find people and opportunities',
              href: '/exchange',
            })
          return steps.length > 0 ? (
            <div className="mb-phi-4 space-y-phi-1">
              {steps.slice(0, 2).map((s) => (
                <a
                  key={s.text}
                  href={s.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-accent/5 border border-brand-accent/15 text-brand-accent text-xs hover:bg-brand-accent/10 transition-colors"
                >
                  <span className="text-sm">→</span>
                  {s.text}
                </a>
              ))}
            </div>
          ) : null
        })()}

        {/* ── Dimension Summary Card ───────────────────────────────────── */}
        <GlassCard padding="md" className="mb-phi-5">
          <div className="flex flex-wrap justify-center gap-phi-3">
            {DIMENSION_META.map((dim) => {
              const isActive = (() => {
                switch (dim.key) {
                  case 'location':
                    return true
                  case 'languages':
                    return identity.languages.length > 0
                  case 'faith':
                    return identity.faith.length > 0
                  case 'craft':
                    return identity.craft.length > 0
                  case 'interests':
                    return identity.interests.length > 0
                  case 'reach':
                    return identity.reach.length > 0
                  case 'culture':
                    return !!identity.culture
                  case 'market':
                    return true
                  default:
                    return false
                }
              })()
              return (
                <div
                  key={dim.key}
                  className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                    isActive ? 'text-brand-accent' : 'text-white/20'
                  }`}
                >
                  <span className="text-lg">{dim.icon}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    {t(dim.labelKey)}
                  </span>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* ── Stat Hexagon — always visible ───────────────────────── */}
        <GlassCard padding="md" className="mb-phi-5">
          <div className="flex justify-center">
            <StatHexagon
              breakdown={hexBreakdown}
              priorities={priorities as Record<string, 'high' | 'medium' | 'low'>}
              onPriorityChange={(dim, priority) => {
                const updated = { ...priorities, [dim]: priority }
                setPriorities(updated)
                saveProfile({ priorities: updated })
              }}
              className="max-w-[320px]"
            />
          </div>
          <p className="text-xs text-white/30 text-center mt-phi-2">
            Click dimension labels to adjust priority
          </p>
        </GlassCard>

        {/* ── Journey Progress ──────────────────────────────────────── */}
        <div className="mb-phi-5">
          <JourneyProgress />
        </div>

        {/* ── Mode Toggle ─────────────────────────────────────────────── */}
        <div className="flex justify-center mb-phi-7">
          <ModeToggle mode={identity.mode} onChange={handleModeChange} />
        </div>

        {/* ── Tab Navigation ──────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-phi-2 mb-phi-5">
          {allTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-phi-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'glass-subtle border border-brand-accent/40 text-brand-accent'
                  : 'glass-subtle text-white/60 hover:text-white/80'
              }`}
            >
              {t(TAB_KEYS[tab] || tab)}
            </button>
          ))}
        </div>

        {/* ── Tab Content ─────────────────────────────────────────────── */}
        <div>{renderTabContent()}</div>
      </div>
    </main>
  )
}

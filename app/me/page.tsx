'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import { LANGUAGE_REGISTRY, COUNTRY_OPTIONS, type LanguageCode } from '@/lib/country-selector'
import { getCategoriesByIds } from '@/lib/exchange-categories'
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
  } = useIdentity()

  const [activeTab, setActiveTab] = useState<TabId>('Dashboard')
  const [mounted, setMounted] = useState(false)

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
  const [craftSearch, setCraftSearch] = useState('')

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
        if (data.success && data.data) setUserProfile(data.data)
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

  // ─── Dimension activity count ──────────────────────────────────────
  const activeDimensions = [
    identity.country, // location — always active
    identity.languages.length > 0,
    identity.faith.length > 0,
    identity.craft.length > 0,
    identity.interests.length > 0,
    identity.reach.length > 0,
    identity.culture,
    true, // market — always computed
  ].filter(Boolean).length

  const marketSignals = getSignalsForRegion(identity.country)
  const marketScore = getMarketScore(
    { country: identity.country, craft: identity.craft, interests: identity.interests },
    marketSignals
  )

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-phi-4">
        <StatCard label={t('me.connections')} value={12} icon={<span>🤝</span>} accent />
        <StatCard label={t('me.matches')} value={42} icon={<span>🎯</span>} />
        <StatCard label={t('me.active')} value={3} icon={<span>⚡</span>} />
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

        {/* Bio */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">{t('me.bio')}</label>
          <textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder={t('me.bioPlaceholder')}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors resize-none"
          />
        </GlassCard>
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

          {/* Match count + dimension count */}
          <p className="text-phi-sm text-brand-accent">{t('me.connectedTo', { count: '42' })}</p>
          <p className="text-phi-sm text-white/40 mt-phi-1">
            {t('me.dimensionsActive', { count: String(activeDimensions) })}
          </p>
        </div>

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

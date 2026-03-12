'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIdentity } from '@/lib/identity-context'
import { LANGUAGE_REGISTRY, COUNTRY_OPTIONS, type LanguageCode } from '@/lib/country-selector'
import { getCategoriesByIds } from '@/lib/exchange-categories'
import { MOCK_CHAPTERS, MOCK_CURRENT_PIONEER } from '@/data/mock'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import ModeToggle from '@/components/ModeToggle'
import GlassCard from '@/components/ui/GlassCard'
import StatCard from '@/components/ui/StatCard'

// ─── Tab definitions ────────────────────────────────────────────────────────

const EXPLORER_TABS = ['Dashboard', 'Saved', 'Exchanges', 'Referrals'] as const
const HOST_TABS = ['Dashboard', 'Offerings', 'Requests', 'Earnings'] as const
const SHARED_TABS = ['Profile', 'Settings'] as const

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
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[status] ?? 'bg-white/10 text-white/60 border-white/20'}`}>
      {status}
    </span>
  )
}

// ─── Page component ─────────────────────────────────────────────────────────

export default function MePage() {
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
  } = useIdentity()

  const [activeTab, setActiveTab] = useState<TabId>('Dashboard')
  const [mounted, setMounted] = useState(false)

  // Form state for Profile tab
  const [editCity, setEditCity] = useState(identity.city ?? '')
  const [editBio, setEditBio] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !hasCompletedDiscovery) {
      router.push('/')
    }
  }, [mounted, hasCompletedDiscovery, router])

  // Reset tab to Dashboard when mode changes
  const handleModeChange = (newMode: 'explorer' | 'host') => {
    setMode(newMode)
    setActiveTab('Dashboard')
  }

  if (!mounted || !hasCompletedDiscovery) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-white/40">Loading...</div>
      </main>
    )
  }

  const modeTabs = identity.mode === 'explorer' ? EXPLORER_TABS : HOST_TABS
  const allTabs = [...modeTabs, ...SHARED_TABS]
  const userInterests = getCategoriesByIds(identity.interests)
  const flag = getCountryFlag(identity.country)
  const initials = MOCK_CURRENT_PIONEER.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // ─── Tab content renderers ─────────────────────────────────────────────

  function renderExplorerDashboard() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-phi-4">
        <StatCard label="Connections" value={12} icon={<span>🤝</span>} accent />
        <StatCard label="Matches" value={42} icon={<span>🎯</span>} />
        <StatCard label="Active" value={3} icon={<span>⚡</span>} />
      </div>
    )
  }

  function renderHostDashboard() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-phi-4">
        <StatCard label="Views" value={156} icon={<span>👁️</span>} accent />
        <StatCard label="Requests" value={8} icon={<span>📩</span>} />
        <StatCard label="Earnings" value="$0" icon={<span>💰</span>} />
      </div>
    )
  }

  function renderSaved() {
    return (
      <GlassCard variant="subtle" padding="lg">
        <div className="text-center py-phi-7">
          <p className="text-phi-2xl mb-phi-2">🔖</p>
          <p className="text-white/60">No saved items yet</p>
          <p className="text-phi-sm text-white/40 mt-phi-1">
            Save Paths and Experiences to find them here
          </p>
        </div>
      </GlassCard>
    )
  }

  function renderExchanges() {
    if (MOCK_CHAPTERS.length === 0) {
      return (
        <GlassCard variant="subtle" padding="lg">
          <p className="text-center text-white/60">No exchanges yet</p>
        </GlassCard>
      )
    }
    return (
      <div className="space-y-phi-3">
        {MOCK_CHAPTERS.map((ch) => (
          <GlassCard key={ch.id} hover padding="md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{ch.pathTitle}</h3>
                <p className="text-phi-sm text-white/50">{ch.anchorName}</p>
              </div>
              <div className="flex items-center gap-phi-3">
                <span className="text-phi-sm text-brand-accent font-medium">
                  {ch.matchScore}% match
                </span>
                <StatusBadge status={ch.status} />
              </div>
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
          <StatCard label="Referrals Sent" value={3} icon={<span>📤</span>} />
          <StatCard label="Successful" value={1} icon={<span>✅</span>} accent />
        </div>
        <GlassCard variant="subtle" padding="md">
          <p className="text-phi-sm text-white/60">
            Your referral code:{' '}
            <span className="text-brand-accent font-mono font-medium">
              {MOCK_CURRENT_PIONEER.referralCode}
            </span>
          </p>
        </GlassCard>
      </div>
    )
  }

  function renderOfferings() {
    const hostPaths = MOCK_VENTURE_PATHS.slice(0, 4)
    return (
      <div className="space-y-phi-3">
        {hostPaths.map((p) => (
          <GlassCard key={p.id} hover padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-phi-3">
                <span className="text-xl">{p.icon}</span>
                <div>
                  <h3 className="text-white font-medium">{p.title}</h3>
                  <p className="text-phi-sm text-white/50">
                    {p.anchorName} &middot; {p.location}
                  </p>
                </div>
              </div>
              <span className="text-phi-sm text-white/40">{p.posted}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  function renderRequests() {
    return (
      <GlassCard variant="subtle" padding="lg">
        <div className="text-center py-phi-7">
          <p className="text-phi-2xl mb-phi-2">📬</p>
          <p className="text-white/60">No incoming requests</p>
          <p className="text-phi-sm text-white/40 mt-phi-1">
            Requests from Explorers will appear here
          </p>
        </div>
      </GlassCard>
    )
  }

  function renderEarnings() {
    return (
      <GlassCard variant="subtle" padding="lg">
        <div className="text-center py-phi-7">
          <p className="text-phi-2xl mb-phi-2">💵</p>
          <p className="text-white/60">No earnings yet</p>
          <p className="text-phi-sm text-white/40 mt-phi-1">
            Start hosting to earn through the platform
          </p>
        </div>
      </GlassCard>
    )
  }

  function renderProfile() {
    return (
      <div className="space-y-phi-5">
        {/* Location */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">City</label>
          <input
            type="text"
            value={editCity}
            onChange={(e) => setEditCity(e.target.value)}
            onBlur={() => setCity(editCity)}
            placeholder="e.g. Nairobi"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-phi-3 py-phi-2 text-white placeholder:text-white/30 focus:border-brand-accent/50 focus:outline-none transition-colors"
          />
        </GlassCard>

        {/* Languages */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">Languages you speak</label>
          <div className="flex flex-wrap gap-phi-2">
            {identity.languages.map((code) => (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/30 text-phi-sm"
              >
                {getLanguageName(code)}
                <button
                  type="button"
                  onClick={() =>
                    setLanguages(identity.languages.filter((l) => l !== code))
                  }
                  className="ml-1 text-brand-accent/60 hover:text-brand-accent"
                  aria-label={`Remove ${getLanguageName(code)}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Interests */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-2">Interests</label>
          <div className="flex flex-wrap gap-phi-2">
            {userInterests.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/80 border border-white/10 text-phi-sm"
              >
                <span>{cat.icon}</span>
                {cat.label}
                <button
                  type="button"
                  onClick={() =>
                    setInterests(identity.interests.filter((i) => i !== cat.id))
                  }
                  className="ml-1 text-white/40 hover:text-white"
                  aria-label={`Remove ${cat.label}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Bio */}
        <GlassCard padding="md">
          <label className="block text-phi-sm text-white/60 mb-phi-1">Bio</label>
          <textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder="Tell others about yourself..."
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
              <h3 className="text-white font-medium">Push notifications</h3>
              <p className="text-phi-sm text-white/50">Get notified about new matches</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-brand-accent/30 relative cursor-pointer">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-brand-accent transition-transform" />
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Email updates</h3>
              <p className="text-phi-sm text-white/50">Weekly digest of opportunities</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-white/10 relative cursor-pointer">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/40 transition-transform" />
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Profile visibility</h3>
              <p className="text-phi-sm text-white/50">Allow others to find you</p>
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
          <h1 className="text-phi-2xl font-bold text-white mb-phi-1">
            {MOCK_CURRENT_PIONEER.name}
          </h1>

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

          {/* Match count */}
          <p className="text-phi-sm text-brand-accent">Connected to 42 people</p>
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
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab Content ─────────────────────────────────────────────── */}
        <div>{renderTabContent()}</div>
      </div>
    </main>
  )
}

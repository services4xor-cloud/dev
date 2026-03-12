'use client'

/**
 * Pioneer Dashboard — KISS version
 *
 * 3 tabs: Compass (overview + matched paths), Chapters, Referrals
 * Uses shared StatusBadge. No duplicate header (main Nav handles it).
 * Consistent max-w-6xl xl:px-8 matching nav/footer.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PIONEER_TYPES } from '@/lib/vocabulary'
import { useTranslation } from '@/lib/hooks/use-translation'
import StatusBadge from '@/components/StatusBadge'
import JourneyProgress from '@/components/JourneyProgress'
import { SkeletonDashboard } from '@/components/Skeleton'
import GlassCard from '@/components/ui/GlassCard'
import StatCard from '@/components/ui/StatCard'
import SectionLayout from '@/components/ui/SectionLayout'
import {
  MOCK_CURRENT_PIONEER,
  MOCK_CHAPTERS as CHAPTERS_DATA,
  MOCK_MATCHING_PATHS,
  BRAND_NAME,
} from '@/data/mock'

// ─── Data shaping ─────────────────────────────────────────────────────────────

const pioneer = MOCK_CURRENT_PIONEER
const typeInfo = PIONEER_TYPES[pioneer.pioneerType]

const CHAPTERS = CHAPTERS_DATA.map((ch) => ({
  id: ch.id,
  pathTitle: ch.pathTitle,
  anchor: ch.anchorName,
  date: ch.openedAt,
  status:
    ch.status === 'SHORTLISTED' ? 'shortlisted' : ch.status === 'REVIEWED' ? 'under review' : 'new',
  matchScore: ch.matchScore,
}))

const TOP_PATHS = [MOCK_MATCHING_PATHS[0], MOCK_MATCHING_PATHS[1], MOCK_MATCHING_PATHS[7]]
const MATCH_SCORES = [92, 87, 74]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MatchScore({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-400' : 'text-brand-accent'
  return <span className={`text-sm font-bold ${color}`}>{score}%</span>
}

// ─── Tab: Compass (overview + matched paths) ──────────────────────────────────

function CompassTab() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-phi-3">
        <StatCard label={t('pioneer.compassRoute')} value={pioneer.route || '—'} accent />
        <StatCard label={t('pioneer.profile')} value={`${pioneer.profileComplete}%`} />
        <StatCard label={t('pioneer.openChapters')} value={CHAPTERS.length} />
        <StatCard label={t('pioneer.newMatches')} value={3} accent />
      </div>

      {/* Top matched paths */}
      <div>
        <h3 className="text-white font-semibold mb-3">{t('pioneer.topPaths')}</h3>
        <div className="space-y-3">
          {TOP_PATHS.map((path, i) => (
            <Link key={path.id} href={`/ventures/${path.id}`} className="block">
              <GlassCard hover padding="sm" className="flex items-center gap-3 group">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm group-hover:text-brand-accent transition-colors">
                    {path.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {path.anchorName} · {path.location}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {path.requiredSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full border border-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <MatchScore score={MATCH_SCORES[i]} />
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <Link
          href="/compass"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
        >
          {t('pioneer.updateCompass')}
        </Link>
        <Link
          href="/ventures"
          className="flex items-center gap-2 px-5 py-2.5 border border-brand-accent/40 text-brand-accent rounded-xl text-sm font-medium hover:bg-brand-accent/10 transition-colors"
        >
          {t('pioneer.browseAllPaths')}
        </Link>
      </div>
    </div>
  )
}

// ─── Tab: Chapters ────────────────────────────────────────────────────────────

function ChaptersTab() {
  const { t } = useTranslation()
  if (CHAPTERS.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📖</p>
        <p>{t('pioneer.noChapters')}</p>
        <Link
          href="/ventures"
          className="mt-4 inline-block text-brand-accent hover:underline text-sm"
        >
          {t('pioneer.browseVentures')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {CHAPTERS.map((chapter) => (
        <GlassCard key={chapter.id} hover padding="sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold text-sm">{chapter.pathTitle}</span>
                <StatusBadge status={chapter.status} size="sm" />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {chapter.anchor} · {t('pioneer.opened')} {chapter.date}
              </div>
            </div>
            <MatchScore score={chapter.matchScore} />
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

// ─── Tab: Referrals ───────────────────────────────────────────────────────────

function ReferralsTab() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(pioneer.referralCode ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Referral code */}
      <GlassCard padding="md">
        <p className="text-gray-400 text-sm mb-2">{t('pioneer.yourReferralCode')}</p>
        <div className="flex items-center gap-3">
          <code className="text-xl font-mono font-bold text-brand-accent bg-gray-900 px-4 py-2 rounded-lg">
            {pioneer.referralCode}
          </code>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-brand-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
          >
            {copied ? t('pioneer.copied') : t('pioneer.copy')}
          </button>
        </div>
      </GlassCard>

      {/* Incentive */}
      <GlassCard padding="sm" className="flex items-center gap-4 !border-green-500/30">
        <span className="text-3xl">💰</span>
        <div>
          <p className="text-green-400 font-bold text-sm">
            {t('pioneer.perPlacement', { amount: 'KES 5,000' })}
          </p>
          <p className="text-gray-400 text-xs">{t('pioneer.referralIncentive')}</p>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-phi-3">
        <StatCard label={t('pioneer.referrals')} value={3} />
        <StatCard label={t('pioneer.placements')} value={1} />
        <StatCard label={t('pioneer.earned')} value="KES 5,000" accent />
      </div>

      {/* Share */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const msg = `Join BeNetwork with my code ${pioneer.referralCode}! https://${BRAND_NAME.toLowerCase()}.com?ref=${pioneer.referralCode}`
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
          }}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          💬 WhatsApp
        </button>
        <button
          onClick={copyCode}
          className="flex items-center gap-2 border border-gray-600 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          🔗 {t('pioneer.copyLink')}
        </button>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'compass' | 'chapters' | 'referrals'

const TAB_KEYS: Tab[] = ['compass', 'chapters', 'referrals']
const TAB_I18N: Record<Tab, string> = {
  compass: 'pioneer.tabCompass',
  chapters: 'pioneer.tabChapters',
  referrals: 'pioneer.tabReferrals',
}

export default function PioneerDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('compass')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top bar */}
      <div className="glass-subtle border-b border-brand-accent/10">
        <div className="max-w-6xl mx-auto px-4 xl:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-sm font-bold text-white">
                {pioneer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{pioneer.name}</div>
                <div className="text-gray-400 text-xs">
                  {typeInfo.icon} {typeInfo.label} Pioneer · {pioneer.route}
                </div>
              </div>
            </div>
            <Link
              href="/compass"
              className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
            >
              <span className="hidden sm:inline">{t('pioneer.update')}</span> Compass
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {TAB_KEYS.map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tabKey
                    ? 'bg-brand-accent/10 text-brand-accent'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                {t(TAB_I18N[tabKey])}
                {tabKey === 'chapters' && CHAPTERS.length > 0 && (
                  <span className="ml-1.5 text-xs bg-brand-accent text-white rounded-full w-5 h-5 inline-flex items-center justify-center font-bold">
                    {CHAPTERS.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <SectionLayout size="sm">
        <div className="space-y-phi-5">
          {loading ? (
            <SkeletonDashboard />
          ) : (
            <>
              <JourneyProgress />
              {activeTab === 'compass' && <CompassTab />}
              {activeTab === 'chapters' && <ChaptersTab />}
              {activeTab === 'referrals' && <ReferralsTab />}
            </>
          )}
        </div>
      </SectionLayout>
    </div>
  )
}

'use client'

/**
 * Anchor Dashboard — KISS version
 *
 * Simplified from 1,144 lines → ~450 lines.
 * - Top tabs instead of sidebar (mobile-friendly)
 * - Uses shared StatusBadge component
 * - Overview merged into Paths view
 * - Settings & Analytics secondary
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Eye, Users, Bell, BarChart3, Radio, Target, Zap } from 'lucide-react'
import { PIONEER_TYPES, PATH_CATEGORIES, type PioneerType } from '@/lib/vocabulary'
import { SkeletonDashboard } from '@/components/Skeleton'
import StatusBadge from '@/components/StatusBadge'
import {
  MOCK_ANCHOR,
  MOCK_PATHS,
  MOCK_ANCHOR_CHAPTERS as MOCK_CHAPTERS,
  MOCK_COMPASS_RECOMMENDATIONS,
  MOCK_ACTIVITY,
  BRAND_NAME,
  type PathStatus,
  type ChapterStatus,
} from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'paths' | 'chapters' | 'insights'

const TAB_KEYS: Tab[] = ['paths', 'chapters', 'insights']
const TAB_I18N: Record<Tab, string> = {
  paths: 'anchor.tabPaths',
  chapters: 'anchor.tabChapters',
  insights: 'anchor.tabInsights',
}

const TAB_ICONS: Record<Tab, React.ComponentType<{ className?: string }>> = {
  paths: Radio,
  chapters: Users,
  insights: BarChart3,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MatchScore({ score }: { score: number }) {
  const color = score >= 90 ? 'text-green-400' : 'text-brand-accent'
  return <span className={`text-sm font-bold ${color}`}>{score}%</span>
}

// ─── Tab: Paths (includes overview stats) ─────────────────────────────────────

function PathsTab() {
  const { t } = useTranslation()
  const [pathStatuses, setPathStatuses] = useState<Record<string, PathStatus>>(
    Object.fromEntries(MOCK_PATHS.map((p) => [p.id, p.status]))
  )

  const cycleStatus = (id: string) => {
    const cycle: PathStatus[] = ['open', 'paused', 'closed']
    setPathStatuses((prev) => {
      const next = cycle[(cycle.indexOf(prev[id]) + 1) % cycle.length]
      return { ...prev, [id]: next }
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: t('anchor.activePaths'),
            value: 3,
            icon: <Radio className="w-4 h-4" />,
            accent: true,
          },
          { label: t('anchor.totalChapters'), value: 47, icon: <Users className="w-4 h-4" /> },
          { label: t('anchor.pioneersMatched'), value: 12, icon: <Target className="w-4 h-4" /> },
          { label: t('anchor.views7d'), value: 284, icon: <Eye className="w-4 h-4" /> },
        ].map((s) => (
          <div key={s.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div
              className={`flex items-center gap-2 text-sm mb-1 ${s.accent ? 'text-brand-accent' : 'text-gray-400'}`}
            >
              {s.icon}
              {s.label}
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Path list */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold">{t('anchor.yourPaths')}</h2>
        <Link
          href="/anchors/post-path"
          className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('anchor.newPath')}
        </Link>
      </div>

      <div className="space-y-3">
        {MOCK_PATHS.map((path) => {
          const status = pathStatuses[path.id]
          const cat = PATH_CATEGORIES.find((c) => c.id === path.category)

          return (
            <div
              key={path.id}
              className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-lg shrink-0">
                  {cat?.icon || '🌍'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{path.title}</span>
                    <StatusBadge status={status} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>
                      {path.chapters} {t('anchor.chapters')}
                    </span>
                    <span>
                      {path.views} {t('anchor.views')}
                    </span>
                    <span>{t('anchor.avgMatch', { score: String(path.matchScoreAvg) })}</span>
                    <span className="hidden sm:inline">{path.posted}</span>
                  </div>
                </div>

                <button
                  onClick={() => cycleStatus(path.id)}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors shrink-0"
                >
                  {t('anchor.toggle')}
                </button>
              </div>
            </div>
          )
        })}

        <Link
          href="/anchors/post-path"
          className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-brand-accent hover:text-brand-accent transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('anchor.openNewPath')}
        </Link>
      </div>

      {/* Recent activity */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-brand-accent" />
          {t('anchor.recentChapters')}
        </h3>
        <div className="space-y-2">
          {MOCK_ACTIVITY.slice(0, 4).map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-gray-700/50 last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 font-bold shrink-0">
                {a.pioneer.split('#')[1]?.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white">{a.pioneer}</div>
                <div className="text-xs text-gray-400 truncate">{a.path}</div>
              </div>
              <MatchScore score={a.score} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Chapters ────────────────────────────────────────────────────────────

function ChaptersTab() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<ChapterStatus | 'all'>('all')
  const [chapterStatuses, setChapterStatuses] = useState<Record<string, ChapterStatus>>(
    Object.fromEntries(MOCK_CHAPTERS.map((c) => [c.id, c.status]))
  )

  const updateStatus = (id: string, status: ChapterStatus) =>
    setChapterStatuses((prev) => ({ ...prev, [id]: status }))

  const visible = MOCK_CHAPTERS.filter((c) =>
    filter === 'all' ? true : chapterStatuses[c.id] === filter
  )

  const counts: Record<string, number> = {
    all: MOCK_CHAPTERS.length,
    new: MOCK_CHAPTERS.filter((c) => chapterStatuses[c.id] === 'new').length,
    shortlisted: MOCK_CHAPTERS.filter((c) => chapterStatuses[c.id] === 'shortlisted').length,
    declined: MOCK_CHAPTERS.filter((c) => chapterStatuses[c.id] === 'declined').length,
  }

  const FILTER_I18N: Record<string, string> = {
    all: 'anchor.filterAll',
    new: 'anchor.tabChapters',
    shortlisted: 'anchor.shortlist',
    declined: 'anchor.decline',
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'new', 'shortlisted', 'declined'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === key
                ? 'bg-brand-accent border-brand-accent text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {key === 'all'
              ? t('anchor.filterAll')
              : key === 'new'
                ? 'New'
                : key.charAt(0).toUpperCase() + key.slice(1)}{' '}
            <span className="opacity-70">{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Chapter cards */}
      {visible.length === 0 && (
        <div className="text-center py-12 text-gray-400">{t('anchor.noChapters')}</div>
      )}
      <div className="space-y-3">
        {visible.map((chapter) => {
          const status = chapterStatuses[chapter.id]
          return (
            <div
              key={chapter.id}
              className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg shrink-0">
                  {PIONEER_TYPES[chapter.type].icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{chapter.alias}</span>
                    <span className="text-xs text-gray-400">
                      {PIONEER_TYPES[chapter.type].label}
                    </span>
                    <StatusBadge status={status} size="sm" />
                  </div>
                  <div className="text-gray-300 text-sm mt-0.5">{chapter.headline}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {chapter.pathTitle} · {chapter.country} · {chapter.openedAt}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {chapter.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full border border-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    {status !== 'shortlisted' && status !== 'declined' && (
                      <button
                        onClick={() => updateStatus(chapter.id, 'shortlisted')}
                        className="px-3 py-1 bg-brand-primary/30 text-brand-accent border border-brand-accent/30 rounded-lg text-xs font-medium hover:bg-brand-primary/40 transition-colors"
                      >
                        {t('anchor.shortlist')}
                      </button>
                    )}
                    {status !== 'declined' && (
                      <button
                        onClick={() => updateStatus(chapter.id, 'declined')}
                        className="px-3 py-1 bg-gray-700 text-gray-400 border border-gray-600 rounded-lg text-xs font-medium hover:bg-gray-600 transition-colors"
                      >
                        {t('anchor.decline')}
                      </button>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <MatchScore score={chapter.matchScore} />
                  <div className="text-xs text-gray-400">{t('anchor.match')}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab: Insights (replaces Analytics + Compass Recommendations) ────────────

function InsightsTab() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {/* Compass recommendations */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-brand-accent" />
          {t('anchor.compassRecs')}
        </h3>
        <p className="text-gray-400 text-xs mb-4">{t('anchor.compassRecsDesc')}</p>
        <div className="space-y-2">
          {MOCK_COMPASS_RECOMMENDATIONS.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 p-3 bg-gray-700/40 rounded-lg border border-gray-700"
            >
              <div className="w-9 h-9 rounded-full bg-brand-primary/30 border border-brand-accent/30 flex items-center justify-center text-sm shrink-0">
                {PIONEER_TYPES[r.type].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{r.alias}</div>
                <div className="text-xs text-gray-400 truncate">
                  {r.headline} · {r.matchedPath}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <MatchScore score={r.score} />
                <button className="text-xs text-brand-accent hover:text-brand-accent/80 px-2 py-1 rounded-lg bg-brand-primary/20 border border-brand-accent/30">
                  {t('anchor.invite')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best performing paths */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-brand-accent" />
          {t('anchor.pathPerformance')}
        </h3>
        <div className="space-y-2">
          {[...MOCK_PATHS]
            .sort((a, b) => b.chapters * b.matchScoreAvg - a.chapters * a.matchScoreAvg)
            .map((p, i) => {
              const cat = PATH_CATEGORIES.find((c) => c.id === p.category)
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 bg-gray-700/40 rounded-lg border border-gray-700"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? 'bg-brand-accent/20 text-brand-accent'
                        : 'bg-gray-600/40 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-base">{cat?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{p.title}</div>
                    <div className="text-xs text-gray-400">
                      {p.chapters} {t('anchor.chapters')} · {p.views} {t('anchor.views')}
                    </div>
                  </div>
                  <MatchScore score={p.matchScoreAvg} />
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AnchorDashboardPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('paths')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 xl:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-xl">
                {MOCK_ANCHOR.logo}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{MOCK_ANCHOR.name}</div>
                <div className="text-gray-400 text-xs">
                  {MOCK_ANCHOR.sector} · {MOCK_ANCHOR.country}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/anchors/post-path"
                className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('anchor.newPath')}</span>
              </Link>
              <button
                className="relative p-2 text-gray-400 hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-accent rounded-full" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {TAB_KEYS.map((tabKey) => {
              const Icon = TAB_ICONS[tabKey]
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tabKey
                      ? 'bg-brand-accent/10 text-brand-accent'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(TAB_I18N[tabKey])}
                  {tabKey === 'chapters' && (
                    <span className="text-xs bg-brand-accent text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      7
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 xl:px-8 py-6">
        {loading ? (
          <SkeletonDashboard />
        ) : (
          <>
            {activeTab === 'paths' && <PathsTab />}
            {activeTab === 'chapters' && <ChaptersTab />}
            {activeTab === 'insights' && <InsightsTab />}
          </>
        )}
      </div>
    </div>
  )
}

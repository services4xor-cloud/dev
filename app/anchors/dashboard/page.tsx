'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Eye, Users, TrendingUp, Bell, BarChart3,
  MapPin, Globe, Star, ChevronDown, ChevronRight,
  CheckCircle, PauseCircle, XCircle, Clock,
  Zap, Target, Radio, Settings, Layout,
  ArrowUpRight, Filter, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { PIONEER_TYPES, PATH_CATEGORIES, type PioneerType } from '@/lib/vocabulary'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ANCHOR = {
  name: 'Ol Pejeta Conservancy',
  logo: '🦏',
  country: 'Kenya',
  sector: 'Safari & Wildlife',
  verified: true,
  memberSince: 'March 2024',
}

const MOCK_PATHS = [
  {
    id: 'p1',
    title: 'Senior Wildlife Guide — Big Five',
    category: 'safari',
    type: 'Full Path',
    chapters: 14,
    status: 'open' as PathStatus,
    posted: '3 days ago',
    postedDate: '2026-03-05',
    matchScoreAvg: 87,
    views: 312,
    topMatches: [
      { id: 'pn001', alias: 'Pioneer #2847', type: 'explorer', score: 96, headline: 'Bush guide, 8 yrs Maasai Mara', country: 'Kenya' },
      { id: 'pn002', alias: 'Pioneer #1193', type: 'explorer', score: 91, headline: 'FGASA Level 3, fluent German', country: 'South Africa' },
      { id: 'pn003', alias: 'Pioneer #3341', type: 'explorer', score: 89, headline: 'Conservation MSc, tracking specialist', country: 'Kenya' },
    ],
  },
  {
    id: 'p2',
    title: 'Eco-Lodge Operations Manager',
    category: 'ecotourism',
    type: 'Full Path',
    chapters: 7,
    status: 'open' as PathStatus,
    posted: '1 week ago',
    postedDate: '2026-03-01',
    matchScoreAvg: 79,
    views: 184,
    topMatches: [
      { id: 'pn004', alias: 'Pioneer #0921', type: 'professional', score: 88, headline: 'Hospitality GM, 6-lodge portfolio', country: 'Kenya' },
      { id: 'pn005', alias: 'Pioneer #4412', type: 'professional', score: 82, headline: 'Sustainability manager, eco-certified', country: 'Tanzania' },
      { id: 'pn006', alias: 'Pioneer #2203', type: 'guardian', score: 77, headline: 'Ops lead, camp logistics expert', country: 'Uganda' },
    ],
  },
  {
    id: 'p3',
    title: 'Content Creator — Safari Stories',
    category: 'media',
    type: 'Part Path',
    chapters: 22,
    status: 'open' as PathStatus,
    posted: '2 weeks ago',
    postedDate: '2026-02-22',
    matchScoreAvg: 74,
    views: 521,
    topMatches: [
      { id: 'pn007', alias: 'Pioneer #5501', type: 'creator', score: 93, headline: 'Wildlife photographer, 2M IG followers', country: 'Germany' },
      { id: 'pn008', alias: 'Pioneer #3388', type: 'creator', score: 85, headline: 'Video journalist, BBC contributor', country: 'UK' },
      { id: 'pn009', alias: 'Pioneer #1024', type: 'creator', score: 81, headline: 'Drone pilot + editor, 50+ safari reels', country: 'Kenya' },
    ],
  },
  {
    id: 'p4',
    title: 'Community Health Liaison',
    category: 'health',
    type: 'Full Path',
    chapters: 4,
    status: 'paused' as PathStatus,
    posted: '3 weeks ago',
    postedDate: '2026-02-15',
    matchScoreAvg: 68,
    views: 97,
    topMatches: [],
  },
]

const MOCK_CHAPTERS = [
  {
    id: 'ch001',
    alias: 'Pioneer #2847',
    pathTitle: 'Senior Wildlife Guide — Big Five',
    pathId: 'p1',
    type: 'explorer' as PioneerType,
    matchScore: 96,
    skills: ['Big Five tracking', 'Bush safety', 'German language', 'FGASA L3'],
    headline: 'Bush guide with 8 years in the Maasai Mara ecosystem',
    status: 'new' as ChapterStatus,
    openedAt: '2 hours ago',
    country: 'Kenya',
  },
  {
    id: 'ch002',
    alias: 'Pioneer #5501',
    pathTitle: 'Content Creator — Safari Stories',
    pathId: 'p3',
    type: 'creator' as PioneerType,
    matchScore: 93,
    skills: ['Wildlife photography', 'Drone operation', 'Instagram reels', 'Adobe Suite'],
    headline: 'Wildlife photographer with 2M+ Instagram followers',
    status: 'shortlisted' as ChapterStatus,
    openedAt: '5 hours ago',
    country: 'Germany',
  },
  {
    id: 'ch003',
    alias: 'Pioneer #0921',
    pathTitle: 'Eco-Lodge Operations Manager',
    pathId: 'p2',
    type: 'professional' as PioneerType,
    matchScore: 88,
    skills: ['Lodge management', 'P&L ownership', 'Eco-certification', 'Staff training'],
    headline: 'Hospitality GM with 6-lodge portfolio across East Africa',
    status: 'reviewed' as ChapterStatus,
    openedAt: '1 day ago',
    country: 'Kenya',
  },
  {
    id: 'ch004',
    alias: 'Pioneer #1193',
    pathTitle: 'Senior Wildlife Guide — Big Five',
    pathId: 'p1',
    type: 'explorer' as PioneerType,
    matchScore: 91,
    skills: ['FGASA L3', 'German', 'Botany', 'Night drives'],
    headline: 'South African guide, fluent German, 5-star private reserves',
    status: 'new' as ChapterStatus,
    openedAt: '1 day ago',
    country: 'South Africa',
  },
  {
    id: 'ch005',
    alias: 'Pioneer #3388',
    pathTitle: 'Content Creator — Safari Stories',
    pathId: 'p3',
    type: 'creator' as PioneerType,
    matchScore: 85,
    skills: ['Video journalism', 'Documentary', 'Final Cut Pro', 'Swahili'],
    headline: 'BBC contributor and video journalist covering East Africa',
    status: 'declined' as ChapterStatus,
    openedAt: '2 days ago',
    country: 'UK',
  },
  {
    id: 'ch006',
    alias: 'Pioneer #4412',
    pathTitle: 'Eco-Lodge Operations Manager',
    pathId: 'p2',
    type: 'professional' as PioneerType,
    matchScore: 82,
    skills: ['Sustainability', 'Carbon offsetting', 'Team leadership', 'Swahili'],
    headline: 'Sustainability manager, eco-certified, Tanzania experience',
    status: 'new' as ChapterStatus,
    openedAt: '3 days ago',
    country: 'Tanzania',
  },
  {
    id: 'ch007',
    alias: 'Pioneer #2203',
    pathTitle: 'Eco-Lodge Operations Manager',
    pathId: 'p2',
    type: 'guardian' as PioneerType,
    matchScore: 77,
    skills: ['Camp logistics', 'Vehicle fleet', 'Supply chain', 'Radio comms'],
    headline: 'Ops lead specialising in remote camp logistics and safety',
    status: 'reviewed' as ChapterStatus,
    openedAt: '4 days ago',
    country: 'Uganda',
  },
]

const MOCK_COMPASS_RECOMMENDATIONS = [
  { id: 'pn010', alias: 'Pioneer #7731', type: 'explorer' as PioneerType, score: 98, headline: 'Master tracker, 12yr Amboseli, FGASA L3+', country: 'Kenya', matchedPath: 'Senior Wildlife Guide' },
  { id: 'pn011', alias: 'Pioneer #6642', type: 'creator' as PioneerType, score: 94, headline: 'Wildlife filmmaker — Netflix credits, 4K drone', country: 'South Africa', matchedPath: 'Content Creator — Safari Stories' },
  { id: 'pn012', alias: 'Pioneer #4499', type: 'professional' as PioneerType, score: 91, headline: 'Eco-lodge GM, Aman & Four Seasons background', country: 'UK', matchedPath: 'Eco-Lodge Operations Manager' },
]

const MOCK_ACTIVITY = [
  { pioneer: 'Pioneer #2847', path: 'Senior Wildlife Guide — Big Five', when: '2 hours ago', score: 96 },
  { pioneer: 'Pioneer #5501', path: 'Content Creator — Safari Stories', when: '5 hours ago', score: 93 },
  { pioneer: 'Pioneer #1193', path: 'Senior Wildlife Guide — Big Five', when: '1 day ago', score: 91 },
  { pioneer: 'Pioneer #0921', path: 'Eco-Lodge Operations Manager', when: '1 day ago', score: 88 },
  { pioneer: 'Pioneer #4412', path: 'Eco-Lodge Operations Manager', when: '3 days ago', score: 82 },
]

const COUNTRY_BREAKDOWN = [
  { country: 'Kenya', flag: '🇰🇪', count: 21, pct: 45 },
  { country: 'South Africa', flag: '🇿🇦', count: 9, pct: 19 },
  { country: 'Germany', flag: '🇩🇪', count: 6, pct: 13 },
  { country: 'Tanzania', flag: '🇹🇿', count: 5, pct: 11 },
  { country: 'United Kingdom', flag: '🇬🇧', count: 4, pct: 9 },
  { country: 'Uganda', flag: '🇺🇬', count: 2, pct: 4 },
]

const ROUTE_CORRIDORS = [
  { route: 'Kenya → Germany', count: 6, trend: '+2 this week' },
  { route: 'Kenya → UAE', count: 4, trend: '+1 this week' },
  { route: 'South Africa → Kenya', count: 3, trend: 'Stable' },
  { route: 'Tanzania → Kenya', count: 3, trend: '+3 this week' },
  { route: 'Uganda → Kenya', count: 2, trend: 'New' },
]

const PIONEER_TYPE_BREAKDOWN: { type: PioneerType; count: number }[] = [
  { type: 'explorer', count: 18 },
  { type: 'professional', count: 12 },
  { type: 'creator', count: 9 },
  { type: 'guardian', count: 4 },
  { type: 'artisan', count: 3 },
  { type: 'healer', count: 1 },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'paths' | 'chapters' | 'analytics' | 'settings'
type PathStatus = 'open' | 'paused' | 'closed'
type ChapterStatus = 'new' | 'reviewed' | 'shortlisted' | 'declined'

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-teal-400 mt-1">{sub}</div>}
    </div>
  )
}

function PathStatusBadge({ status }: { status: PathStatus }) {
  const cfg = {
    open: { label: 'Open', class: 'bg-green-900/50 text-green-400 border-green-700/50', icon: CheckCircle },
    paused: { label: 'Paused', class: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50', icon: PauseCircle },
    closed: { label: 'Closed', class: 'bg-gray-700/50 text-gray-400 border-gray-600/50', icon: XCircle },
  }[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${cfg.class}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function ChapterStatusBadge({ status }: { status: ChapterStatus }) {
  const cfg = {
    new: { label: 'New', class: 'bg-orange-900/50 text-orange-400 border-orange-700/50' },
    reviewed: { label: 'Reviewed', class: 'bg-blue-900/50 text-blue-400 border-blue-700/50' },
    shortlisted: { label: 'Shortlisted', class: 'bg-green-900/50 text-green-400 border-green-700/50' },
    declined: { label: 'Declined', class: 'bg-gray-700/50 text-gray-500 border-gray-600/50' },
  }[status]
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.class}`}>
      {cfg.label}
    </span>
  )
}

function MatchScoreDot({ score }: { score: number }) {
  const color = score >= 90 ? 'text-green-400' : score >= 75 ? 'text-yellow-400' : 'text-orange-400'
  return <span className={`text-sm font-bold ${color}`}>{score}%</span>
}

function PioneerTypeBadge({ type }: { type: PioneerType }) {
  const cfg = PIONEER_TYPES[type]
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
      {cfg.icon} {cfg.label}
    </span>
  )
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ setActiveTab }: { setActiveTab: (t: Tab) => void }) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {MOCK_ANCHOR.logo} {MOCK_ANCHOR.name}
          </h1>
          <p className="text-gray-400 mt-1">
            {MOCK_ANCHOR.sector} · {MOCK_ANCHOR.country}
            {MOCK_ANCHOR.verified && (
              <span className="ml-2 inline-flex items-center gap-1 text-teal-400 text-xs">
                <CheckCircle className="w-3 h-3" /> Verified Anchor
              </span>
            )}
          </p>
        </div>
        <Link
          href="/anchors/post-path"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-xl font-medium text-sm hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Open New Path
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Radio className="w-5 h-5" />} label="Active Paths" value={3} sub="+1 this month" color="bg-orange-500/20 text-[#FF6B35]" />
        <StatCard icon={<Layout className="w-5 h-5" />} label="Total Chapters" value={47} sub="14 new this week" color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={<Users className="w-5 h-5" />} label="Pioneers Matched" value={12} sub="via Compass" color="bg-teal-500/20 text-teal-400" />
        <StatCard icon={<Eye className="w-5 h-5" />} label="Path Views" value={284} sub="Last 7 days" color="bg-purple-500/20 text-purple-400" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/anchors/post-path" className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-[#FF6B35] hover:bg-gray-750 transition-all group">
          <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-[#FF6B35] group-hover:bg-orange-500/30">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Open New Path</div>
            <div className="text-xs text-gray-500">Post an opportunity</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-[#FF6B35]" />
        </Link>
        <button onClick={() => setActiveTab('chapters')} className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-teal-500 hover:bg-gray-750 transition-all group text-left">
          <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/30">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Review Chapters</div>
            <div className="text-xs text-gray-500">7 awaiting review</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-teal-400" />
        </button>
        <button onClick={() => setActiveTab('analytics')} className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-purple-500 hover:bg-gray-750 transition-all group text-left">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">See Analytics</div>
            <div className="text-xs text-gray-500">Compass insights</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-purple-400" />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity feed */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF6B35]" />
              Recent Chapter Openings
            </h2>
            <button onClick={() => setActiveTab('chapters')} className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-700/50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 font-mono font-bold flex-shrink-0">
                  {a.pioneer.split('#')[1]?.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium">{a.pioneer}</div>
                  <div className="text-xs text-gray-500 truncate">{a.path}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <MatchScoreDot score={a.score} />
                  <div className="text-xs text-gray-600 mt-0.5">{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compass recommendations */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-400" />
              Compass Recommendations
            </h2>
            <span className="text-xs text-gray-500">Pioneers matching your open paths</span>
          </div>
          <div className="space-y-3">
            {MOCK_COMPASS_RECOMMENDATIONS.map((r) => (
              <div key={r.id} className="flex items-start gap-3 p-3 bg-gray-700/40 rounded-xl border border-gray-700 hover:border-teal-500/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-teal-900/50 border border-teal-700/50 flex items-center justify-center text-sm flex-shrink-0">
                  {PIONEER_TYPES[r.type].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">{r.alias}</span>
                    <PioneerTypeBadge type={r.type} />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">{r.headline}</div>
                  <div className="text-xs text-gray-500 mt-1">Matches: {r.matchedPath}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-green-400">{r.score}%</div>
                  <button className="text-xs text-teal-400 hover:text-teal-300 mt-1">Invite</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Paths ───────────────────────────────────────────────────────────────

function PathsTab() {
  const [expandedPath, setExpandedPath] = useState<string | null>(null)
  const [pathStatuses, setPathStatuses] = useState<Record<string, PathStatus>>(
    Object.fromEntries(MOCK_PATHS.map(p => [p.id, p.status]))
  )

  const cycleStatus = (id: string) => {
    const cycle: PathStatus[] = ['open', 'paused', 'closed']
    setPathStatuses(prev => {
      const next = cycle[(cycle.indexOf(prev[id]) + 1) % cycle.length]
      return { ...prev, [id]: next }
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Your Paths</h2>
          <p className="text-gray-400 text-sm">{MOCK_PATHS.length} paths in total · {MOCK_PATHS.filter(p => p.status === 'open').length} open</p>
        </div>
        <Link
          href="/anchors/post-path"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-xl font-medium text-sm hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Open New Path
        </Link>
      </div>

      <div className="space-y-3">
        {MOCK_PATHS.map(path => {
          const currentStatus = pathStatuses[path.id]
          const isExpanded = expandedPath === path.id
          const cat = PATH_CATEGORIES.find(c => c.id === path.category)

          return (
            <div key={path.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Category icon */}
                  <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
                    {cat?.icon || '🌍'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <span className="text-white font-semibold">{path.title}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                        {path.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Layout className="w-3.5 h-3.5" />
                        {path.chapters} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {path.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400" />
                        {path.matchScoreAvg}% avg match
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {path.posted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <PathStatusBadge status={currentStatus} />
                    <button
                      onClick={() => cycleStatus(path.id)}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600"
                      title="Click to change status"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                      className="p-1.5 text-gray-500 hover:text-white transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && path.topMatches.length > 0 && (
                <div className="border-t border-gray-700 px-5 py-4 bg-gray-750/30">
                  <div className="text-xs font-medium text-teal-400 mb-3 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Top Compass Matches for this Path
                  </div>
                  <div className="grid gap-2">
                    {path.topMatches.map(m => (
                      <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-xs flex-shrink-0">
                          {PIONEER_TYPES[m.type as PioneerType].icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium">{m.alias}</div>
                          <div className="text-xs text-gray-400 truncate">{m.headline} · {m.country}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MatchScoreDot score={m.score} />
                          <button className="text-xs text-teal-400 hover:text-teal-300 px-2 py-1 rounded-lg bg-teal-900/30 border border-teal-700/50">
                            Invite to Route
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isExpanded && path.topMatches.length === 0 && (
                <div className="border-t border-gray-700 px-5 py-4 text-center text-gray-500 text-sm">
                  No top matches yet — Compass is still routing.
                </div>
              )}
            </div>
          )
        })}

        <Link
          href="/anchors/post-path"
          className="flex items-center justify-center gap-2 p-5 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Open a new Path
        </Link>
      </div>
    </div>
  )
}

// ─── Tab: Chapters ────────────────────────────────────────────────────────────

function ChaptersTab() {
  const [filter, setFilter] = useState<ChapterStatus | 'all'>('all')
  const [chapterStatuses, setChapterStatuses] = useState<Record<string, ChapterStatus>>(
    Object.fromEntries(MOCK_CHAPTERS.map(c => [c.id, c.status]))
  )

  const updateStatus = (id: string, status: ChapterStatus) => {
    setChapterStatuses(prev => ({ ...prev, [id]: status }))
  }

  const visible = MOCK_CHAPTERS.filter(c =>
    filter === 'all' ? true : chapterStatuses[c.id] === filter
  )

  const counts = {
    all: MOCK_CHAPTERS.length,
    new: MOCK_CHAPTERS.filter(c => chapterStatuses[c.id] === 'new').length,
    reviewed: MOCK_CHAPTERS.filter(c => chapterStatuses[c.id] === 'reviewed').length,
    shortlisted: MOCK_CHAPTERS.filter(c => chapterStatuses[c.id] === 'shortlisted').length,
    declined: MOCK_CHAPTERS.filter(c => chapterStatuses[c.id] === 'declined').length,
  }

  const filterButtons: { key: ChapterStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'reviewed', label: 'Reviewed' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'declined', label: 'Declined' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Chapters</h2>
          <p className="text-gray-400 text-sm">Pioneer applications to your open paths</p>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterButtons.map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 border ${
              filter === btn.key
                ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {btn.label}
            <span className="text-xs opacity-70">
              {counts[btn.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Chapter cards */}
      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No chapters in this category yet.
          </div>
        )}
        {visible.map(chapter => {
          const status = chapterStatuses[chapter.id]
          return (
            <div key={chapter.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-5 hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-xl flex-shrink-0">
                  {PIONEER_TYPES[chapter.type].icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold">{chapter.alias}</span>
                        <PioneerTypeBadge type={chapter.type} />
                        <ChapterStatusBadge status={status} />
                      </div>
                      <div className="text-gray-300 text-sm mt-0.5">{chapter.headline}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Applied to: <span className="text-gray-400">{chapter.pathTitle}</span> · {chapter.country} · {chapter.openedAt}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold">
                        <MatchScoreDot score={chapter.matchScore} />
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">match</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {chapter.skills.map(skill => (
                      <span key={skill} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full border border-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {status !== 'shortlisted' && status !== 'declined' && (
                      <button
                        onClick={() => updateStatus(chapter.id, 'shortlisted')}
                        className="px-3 py-1.5 bg-teal-900/50 text-teal-400 border border-teal-700/50 rounded-xl text-xs font-medium hover:bg-teal-900 transition-colors"
                      >
                        Invite to Route
                      </button>
                    )}
                    {status !== 'reviewed' && status !== 'declined' && status !== 'shortlisted' && (
                      <button
                        onClick={() => updateStatus(chapter.id, 'reviewed')}
                        className="px-3 py-1.5 bg-blue-900/50 text-blue-400 border border-blue-700/50 rounded-xl text-xs font-medium hover:bg-blue-900 transition-colors"
                      >
                        Mark Reviewed
                      </button>
                    )}
                    {status !== 'declined' && (
                      <button
                        onClick={() => updateStatus(chapter.id, 'declined')}
                        className="px-3 py-1.5 bg-gray-700 text-gray-400 border border-gray-600 rounded-xl text-xs font-medium hover:bg-gray-600 transition-colors"
                      >
                        Decline
                      </button>
                    )}
                    <button className="px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-xl text-xs font-medium hover:bg-gray-600 transition-colors">
                      View Full Profile
                    </button>
                    {status === 'shortlisted' && (
                      <button
                        onClick={() => updateStatus(chapter.id, 'new')}
                        className="px-3 py-1.5 bg-gray-700 text-gray-400 border border-gray-600 rounded-xl text-xs font-medium hover:bg-gray-600 transition-colors"
                      >
                        Undo Shortlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab: Analytics ───────────────────────────────────────────────────────────

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white font-bold text-lg">Compass Analytics</h2>
        <p className="text-gray-400 text-sm">Where your Pioneers are coming from, and where your paths perform best</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Country breakdown */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FF6B35]" />
            Where are Pioneers coming from?
          </h3>
          <p className="text-gray-500 text-xs mb-4">By chapter origin country</p>
          <div className="space-y-3">
            {COUNTRY_BREAKDOWN.map(c => (
              <div key={c.country}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">{c.flag} {c.country}</span>
                  <span className="text-gray-400">{c.count} pioneers</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B35] to-orange-400 rounded-full transition-all"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route corridors */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            Which Routes are most active?
          </h3>
          <p className="text-gray-500 text-xs mb-4">Country-to-country pioneer corridors</p>
          <div className="space-y-3">
            {ROUTE_CORRIDORS.map((r, i) => (
              <div key={r.route} className="flex items-center justify-between p-3 bg-gray-700/40 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-300">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-200">{r.route}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{r.count}</div>
                  <div className="text-xs text-teal-400">{r.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pioneer type breakdown */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Pioneer Type Breakdown
          </h3>
          <p className="text-gray-500 text-xs mb-4">Who is opening chapters with you</p>
          <div className="space-y-2">
            {PIONEER_TYPE_BREAKDOWN.map(({ type, count }) => {
              const cfg = PIONEER_TYPES[type]
              const pct = Math.round((count / 47) * 100)
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-8 text-base">{cfg.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-300">{cfg.label}</span>
                      <span className="text-gray-400">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Best performing paths */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
          <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Best Performing Paths
          </h3>
          <p className="text-gray-500 text-xs mb-4">Ranked by chapters + average match score</p>
          <div className="space-y-3">
            {[...MOCK_PATHS]
              .sort((a, b) => (b.chapters * b.matchScoreAvg) - (a.chapters * a.matchScoreAvg))
              .map((p, i) => {
                const cat = PATH_CATEGORIES.find(c => c.id === p.category)
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-700/40 rounded-xl border border-gray-700">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-gray-500/20 text-gray-300' :
                      'bg-orange-900/30 text-orange-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="text-lg">{cat?.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.chapters} chapters · {p.views} views</div>
                    </div>
                    <div className="text-right">
                      <MatchScoreDot score={p.matchScoreAvg} />
                      <div className="text-xs text-gray-500">avg</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Settings ────────────────────────────────────────────────────────────

function SettingsTab() {
  const [whatsapp, setWhatsapp] = useState(true)
  const [email, setEmail] = useState(true)
  const [instagram, setInstagram] = useState(false)
  const [linkedin, setLinkedin] = useState(true)
  const [twitter, setTwitter] = useState(false)
  const [facebook, setFacebook] = useState(false)

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className="focus:outline-none">
      {value
        ? <ToggleRight className="w-8 h-8 text-teal-400" />
        : <ToggleLeft className="w-8 h-8 text-gray-600" />
      }
    </button>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white font-bold text-lg">Anchor Settings</h2>
        <p className="text-gray-400 text-sm">Manage your profile, payments, and automation</p>
      </div>

      {/* Anchor Profile */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-[#FF6B35]" />
          Anchor Profile
        </h3>
        <div className="grid gap-4">
          {[
            { label: 'Anchor Name', value: 'Ol Pejeta Conservancy', placeholder: 'Your organisation name' },
            { label: 'Description', value: 'Kenya\'s largest black rhino sanctuary. We offer paths in wildlife conservation, eco-tourism, and community development.', placeholder: 'Describe your organisation', textarea: true },
            { label: 'Country', value: 'Kenya', placeholder: 'Country of operation' },
            { label: 'Primary Sectors', value: 'Safari & Wildlife, Eco-Tourism, Community Development', placeholder: 'Your sectors (comma separated)' },
            { label: 'Website', value: 'https://www.olpejetaconservancy.org', placeholder: 'https://...' },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
              {field.textarea ? (
                <textarea
                  defaultValue={field.value}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF6B35] min-h-[80px] resize-y"
                />
              ) : (
                <input
                  defaultValue={field.value}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF6B35]"
                />
              )}
            </div>
          ))}
        </div>
        <button className="px-4 py-2 bg-[#FF6B35] text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
          Save Profile
        </button>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-400" />
          Payment Methods Linked
        </h3>
        <div className="space-y-2">
          {[
            { label: 'M-Pesa', icon: '📱', status: 'Connected', color: 'text-green-400' },
            { label: 'Stripe (Card)', icon: '💳', status: 'Connected', color: 'text-green-400' },
            { label: 'Flutterwave', icon: '🌍', status: 'Not connected', color: 'text-gray-500' },
            { label: 'PayPal', icon: '🅿️', status: 'Not connected', color: 'text-gray-500' },
          ].map(pm => (
            <div key={pm.label} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-lg">{pm.icon}</span>
                <span className="text-sm text-gray-300">{pm.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${pm.color}`}>{pm.status}</span>
                <button className="text-xs text-teal-400 hover:text-teal-300">
                  {pm.status === 'Connected' ? 'Manage' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { label: 'WhatsApp Alerts', desc: 'New chapters, shortlist updates', value: whatsapp, toggle: () => setWhatsapp(v => !v) },
            { label: 'Email Notifications', desc: 'Weekly digest, match reports', value: email, toggle: () => setEmail(v => !v) },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
              <div>
                <div className="text-sm text-gray-200">{n.label}</div>
                <div className="text-xs text-gray-500">{n.desc}</div>
              </div>
              <Toggle value={n.value} onChange={n.toggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Autoposts */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#FF6B35]" />
          Social Media Autoposts
        </h3>
        <p className="text-gray-500 text-xs mb-4">Auto-share when you open a new path</p>
        <div className="space-y-2">
          {[
            { label: 'Instagram', icon: '📸', value: instagram, toggle: () => setInstagram(v => !v) },
            { label: 'LinkedIn', icon: '💼', value: linkedin, toggle: () => setLinkedin(v => !v) },
            { label: 'Twitter / X', icon: '🐦', value: twitter, toggle: () => setTwitter(v => !v) },
            { label: 'Facebook', icon: '👥', value: facebook, toggle: () => setFacebook(v => !v) },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="text-sm text-gray-300">{p.label}</span>
              </div>
              <Toggle value={p.value} onChange={p.toggle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AnchorDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: 'Overview', icon: Layout },
    { key: 'paths', label: 'Paths', icon: Radio },
    { key: 'chapters', label: 'Chapters', icon: Users },
    { key: 'analytics', label: 'Compass', icon: BarChart3 },
    { key: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-850 border-r border-gray-700/50 flex flex-col flex-shrink-0 bg-gray-900">
        {/* Logo */}
        <div className="p-5 border-b border-gray-700/50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm">B</div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">BeKenya</div>
              <div className="text-gray-500 text-xs">Anchor Portal</div>
            </div>
          </Link>
        </div>

        {/* Anchor info */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-xl">
              {MOCK_ANCHOR.logo}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{MOCK_ANCHOR.name}</div>
              <div className="text-gray-500 text-xs flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {MOCK_ANCHOR.country}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeTab === tab.key
                    ? 'bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.key === 'chapters' && (
                  <span className="ml-auto text-xs bg-[#FF6B35] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    7
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom: new path CTA */}
        <div className="p-4 border-t border-gray-700/50">
          <Link
            href="/anchors/post-path"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-xl font-medium text-sm hover:bg-orange-600 transition-colors w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Open New Path
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-gray-700/50 flex items-center justify-between px-6 bg-gray-900 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Anchor Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{tabs.find(t => t.key === activeTab)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-base">
              {MOCK_ANCHOR.logo}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
          {activeTab === 'paths' && <PathsTab />}
          {activeTab === 'chapters' && <ChaptersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

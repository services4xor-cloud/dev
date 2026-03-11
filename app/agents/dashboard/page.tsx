'use client'

/**
 * Agent Dashboard — 3 tabs: Demand Feed, My Forwards, Earnings
 *
 * Agents are real people who bridge Anchors and Pioneers.
 * They forward demand signals to their network (WhatsApp, in-person).
 * Tracks: forward -> click -> signup -> chapter -> placement -> commission.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Send,
  Eye,
  Users,
  DollarSign,
  MapPin,
  Copy,
  Check,
  TrendingUp,
  Share2,
  Briefcase,
} from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import { SkeletonDashboard } from '@/components/Skeleton'
import { BRAND_NAME } from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_AGENT_PROFILE = {
  name: 'David Kimani',
  agentCode: 'AGT-DK2024',
  territory: 'KE-Nairobi',
  sectors: ['healthcare', 'tech', 'hospitality'],
  networkSize: 156,
  totalEarnings: 45000,
  totalPlacements: 3,
  totalForwards: 47,
  commissionRate: 0.1,
  pendingPayout: 15000,
}

const MOCK_DEMAND = [
  {
    id: 'd1',
    title: 'Registered Nurse',
    company: 'Charite Berlin',
    location: 'Berlin, Germany',
    country: 'DE',
    salary: '\u20AC3,200 \u2013 \u20AC4,100/mo',
    skills: ['Nursing', 'German B2', 'Patient Care'],
    pioneersNeeded: 5,
    posted: '2d ago',
  },
  {
    id: 'd2',
    title: 'Full-Stack Developer',
    company: 'Swisscom',
    location: 'Zurich, Switzerland',
    country: 'CH',
    salary: 'CHF 8,500 \u2013 11,000/mo',
    skills: ['React', 'Node.js', 'TypeScript'],
    pioneersNeeded: 2,
    posted: '1d ago',
  },
  {
    id: 'd3',
    title: 'Hotel Operations Manager',
    company: 'Centara Hotels',
    location: 'Phuket, Thailand',
    country: 'TH',
    salary: '\u0E3F65,000 \u2013 95,000/mo',
    skills: ['Hospitality', 'English', 'Team Leadership'],
    pioneersNeeded: 1,
    posted: '3h ago',
  },
  {
    id: 'd4',
    title: 'Safari Guide Trainer',
    company: 'Basecamp Explorer',
    location: 'Maasai Mara, Kenya',
    country: 'KE',
    salary: 'KES 120,000 \u2013 180,000/mo',
    skills: ['Wildlife Knowledge', 'First Aid', 'Languages'],
    pioneersNeeded: 3,
    posted: '5h ago',
  },
  {
    id: 'd5',
    title: 'Data Analyst',
    company: 'SAP',
    location: 'Walldorf, Germany',
    country: 'DE',
    salary: '\u20AC4,500 \u2013 6,200/mo',
    skills: ['Python', 'SQL', 'Power BI'],
    pioneersNeeded: 2,
    posted: '1d ago',
  },
]

const MOCK_FORWARDS = [
  {
    id: 'f1',
    workerName: 'Jane Kamau',
    pathTitle: 'Registered Nurse \u2014 Charite Berlin',
    status: 'PLACED',
    forwardedAt: '2026-02-15',
    commission: 15000,
  },
  {
    id: 'f2',
    workerName: 'Mike Odhiambo',
    pathTitle: 'Full-Stack Developer \u2014 Swisscom',
    status: 'APPLIED',
    forwardedAt: '2026-03-01',
  },
  {
    id: 'f3',
    workerName: 'Grace Wanjiku',
    pathTitle: 'Registered Nurse \u2014 Charite Berlin',
    status: 'SIGNED_UP',
    forwardedAt: '2026-03-05',
  },
  {
    id: 'f4',
    workerName: 'Peter Mwangi',
    pathTitle: 'Hotel Operations \u2014 Centara',
    status: 'CLICKED',
    forwardedAt: '2026-03-08',
  },
  {
    id: 'f5',
    workerName: 'Sarah Atieno',
    pathTitle: 'Data Analyst \u2014 SAP',
    status: 'SENT',
    forwardedAt: '2026-03-10',
  },
]

// ─── Country flag helper ──────────────────────────────────────────────────────

const COUNTRY_FLAGS: Record<string, string> = {
  DE: '\uD83C\uDDE9\uD83C\uDDEA',
  CH: '\uD83C\uDDE8\uD83C\uDDED',
  TH: '\uD83C\uDDF9\uD83C\uDDED',
  KE: '\uD83C\uDDF0\uD83C\uDDEA',
  GB: '\uD83C\uDDEC\uD83C\uDDE7',
  NG: '\uD83C\uDDF3\uD83C\uDDEC',
}

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = 'demand' | 'forwards' | 'earnings'

const TAB_KEYS: Tab[] = ['demand', 'forwards', 'earnings']
const TAB_I18N: Record<Tab, string> = {
  demand: 'agentDash.tabDemand',
  forwards: 'agentDash.tabForwards',
  earnings: 'agentDash.tabEarnings',
}
const TAB_ICONS: Record<Tab, React.ComponentType<{ className?: string }>> = {
  demand: Briefcase,
  forwards: Send,
  earnings: DollarSign,
}

// ─── Tab: Demand Feed ─────────────────────────────────────────────────────────

function DemandFeedTab() {
  const { t } = useTranslation()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const getForwardLink = (pathId: string) =>
    `https://bekenya.com/ventures/${pathId}?ref=${MOCK_AGENT_PROFILE.agentCode}`

  const copyLink = (pathId: string) => {
    navigator.clipboard.writeText(getForwardLink(pathId))
    setCopiedId(pathId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const forwardWhatsApp = (demand: (typeof MOCK_DEMAND)[0]) => {
    const link = getForwardLink(demand.id)
    const msg = `${demand.title} at ${demand.company} (${demand.location})\n${demand.salary}\n\nApply here: ${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{t('agentDash.pathsMatching')}</p>
        <span className="text-xs text-brand-accent font-medium">
          {t('agentDash.openPaths', { count: String(MOCK_DEMAND.length) })}
        </span>
      </div>

      {MOCK_DEMAND.map((demand) => (
        <div
          key={demand.id}
          className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-lg shrink-0">
              {COUNTRY_FLAGS[demand.country] || '\uD83C\uDF0D'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold text-sm">{demand.title}</span>
                <span className="text-xs text-gray-400">
                  {t('agentDash.needed', { count: String(demand.pioneersNeeded) })}
                </span>
              </div>
              <div className="text-gray-300 text-sm mt-0.5">{demand.company}</div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <MapPin className="w-3 h-3" />
                {demand.location}
                <span className="text-brand-accent font-medium">{demand.salary}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mt-2">
                {demand.skills.map((skill) => (
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
                <button
                  onClick={() => forwardWhatsApp(demand)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Send className="w-3 h-3" />
                  {t('agentDash.forwardWhatsApp')}
                </button>
                <button
                  onClick={() => copyLink(demand.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedId === demand.id ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      {t('agentDash.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      {t('agentDash.copyLink')}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-xs text-gray-400">{demand.posted}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Tab: My Forwards ─────────────────────────────────────────────────────────

function ForwardsTab() {
  const { t } = useTranslation()
  const statusCounts = MOCK_FORWARDS.reduce(
    (acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const FUNNEL_I18N: Record<string, string> = {
    SENT: 'agentDash.sent',
    CLICKED: 'agentDash.clicked',
    SIGNED_UP: 'agentDash.signedUp',
    APPLIED: 'agentDash.applied',
    PLACED: 'agentDash.placed',
  }

  return (
    <div className="space-y-5">
      {/* Funnel stats */}
      <div className="grid grid-cols-5 gap-2">
        {(['SENT', 'CLICKED', 'SIGNED_UP', 'APPLIED', 'PLACED'] as const).map((step) => (
          <div key={step} className="bg-gray-800 rounded-xl border border-gray-700 p-3 text-center">
            <div className="text-xl font-bold text-white">{statusCounts[step] || 0}</div>
            <div className="text-xs text-gray-400 mt-0.5">{t(FUNNEL_I18N[step])}</div>
          </div>
        ))}
      </div>

      {/* Forward list */}
      <div className="space-y-3">
        {MOCK_FORWARDS.map((forward) => (
          <div
            key={forward.id}
            className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{forward.workerName}</span>
                  <StatusBadge status={forward.status.toLowerCase()} size="sm" />
                </div>
                <div className="text-xs text-gray-400 mt-1">{forward.pathTitle}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {t('agentDash.forwarded', { date: forward.forwardedAt })}
                </div>
              </div>

              {forward.status === 'PLACED' && forward.commission && (
                <div className="shrink-0 text-right">
                  <div className="text-green-400 font-bold text-sm">
                    +KES {forward.commission.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">{t('agentDash.commission')}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Earnings ────────────────────────────────────────────────────────────

function EarningsTab() {
  const { t } = useTranslation()
  const profile = MOCK_AGENT_PROFILE

  return (
    <div className="space-y-6">
      {/* Earnings overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: t('agentDash.totalEarnings'),
            value: `KES ${profile.totalEarnings.toLocaleString()}`,
            icon: <DollarSign className="w-4 h-4" />,
            accent: true,
          },
          {
            label: t('agentDash.placements'),
            value: profile.totalPlacements,
            icon: <Users className="w-4 h-4" />,
          },
          {
            label: t('agentDash.totalForwards'),
            value: profile.totalForwards,
            icon: <Send className="w-4 h-4" />,
          },
          {
            label: t('agentDash.conversionRate'),
            value: `${((profile.totalPlacements / profile.totalForwards) * 100).toFixed(1)}%`,
            icon: <TrendingUp className="w-4 h-4" />,
          },
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

      {/* Commission structure */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-brand-accent" />
          {t('agentDash.commissionStructure')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700/40 rounded-lg">
            <span className="text-gray-300 text-sm">{t('agentDash.commissionRate')}</span>
            <span className="text-brand-accent font-bold">
              {(profile.commissionRate * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700/40 rounded-lg">
            <span className="text-gray-300 text-sm">{t('agentDash.pendingPayout')}</span>
            <span className="text-white font-bold">
              KES {profile.pendingPayout.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700/40 rounded-lg">
            <span className="text-gray-300 text-sm">{t('agentDash.networkSize')}</span>
            <span className="text-white font-bold">
              {t('agentDash.workers', { count: String(profile.networkSize) })}
            </span>
          </div>
        </div>
      </div>

      {/* Placement history */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-brand-accent" />
          {t('agentDash.successfulPlacements')}
        </h3>
        {MOCK_FORWARDS.filter((f) => f.status === 'PLACED').length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">{t('agentDash.noPlacementsYet')}</p>
        ) : (
          <div className="space-y-2">
            {MOCK_FORWARDS.filter((f) => f.status === 'PLACED').map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-3 bg-gray-700/40 rounded-lg border border-green-700/30"
              >
                <div>
                  <div className="text-white text-sm font-medium">{f.workerName}</div>
                  <div className="text-xs text-gray-400">{f.pathTitle}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-sm">
                    +KES {(f.commission || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">{f.forwardedAt}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AgentDashboardPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('demand')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const profile = MOCK_AGENT_PROFILE

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 xl:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-sm font-bold text-white">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{profile.name}</div>
                <div className="text-gray-400 text-xs">
                  Agent · {profile.territory} · {profile.sectors.join(', ')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-brand-accent font-bold text-sm">
                  KES {profile.totalEarnings.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">{t('agentDash.totalEarned')}</div>
              </div>
              <Link
                href="/agents"
                className="flex items-center gap-2 px-4 py-2 border border-brand-accent/40 text-brand-accent rounded-xl text-sm font-medium hover:bg-brand-accent/10 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('agentDash.agentHub')}</span>
              </Link>
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
                  {tabKey === 'forwards' && (
                    <span className="text-xs bg-brand-accent text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {MOCK_FORWARDS.length}
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
            {activeTab === 'demand' && <DemandFeedTab />}
            {activeTab === 'forwards' && <ForwardsTab />}
            {activeTab === 'earnings' && <EarningsTab />}
          </>
        )}
      </div>
    </div>
  )
}

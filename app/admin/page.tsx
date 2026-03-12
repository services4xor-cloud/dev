'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MOCK_PLATFORM_STATS as PLATFORM_STATS,
  MOCK_RECENT_PIONEERS as RECENT_PIONEERS,
  MOCK_RECENT_CHAPTERS as RECENT_CHAPTERS,
  MOCK_ALL_PIONEERS as ALL_PIONEERS,
  MOCK_ALL_ANCHORS,
  MOCK_ALL_PATHS as ALL_PATHS,
  MOCK_SOCIAL_PLATFORMS as SOCIAL_PLATFORMS,
  MOCK_SOCIAL_QUEUE,
  MOCK_ENV_VARS as ENV_VARS,
} from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'
import StatCard from '@/components/ui/StatCard'
import SectionLayout from '@/components/ui/SectionLayout'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PioneerTypeBadge({ type }: { type: string }) {
  const icons: Record<string, string> = {
    Explorer: '🌿',
    Professional: '💼',
    Artisan: '✨',
    Guardian: '🛡️',
    Creator: '🎬',
    Healer: '🌱',
  }
  return (
    <span className="text-xs bg-brand-primary/50 text-brand-accent border border-brand-accent/20 px-2 py-0.5 rounded-full">
      {icons[type] ?? '👤'} {type}
    </span>
  )
}

function StatusDot({ status }: { status: 'Open' | 'Closed' | 'Paused' | string }) {
  const colors: Record<string, string> = {
    Open: 'bg-green-500',
    Closed: 'bg-gray-500',
    Paused: 'bg-brand-accent',
  }
  return (
    <span className="flex items-center gap-1 text-xs">
      <span className={`w-2 h-2 rounded-full ${colors[status] ?? 'bg-gray-500'}`}></span>
      {status}
    </span>
  )
}

function ChapterStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    New: 'text-brand-accent',
    'Under Review': 'text-blue-400',
    Shortlisted: 'text-green-400',
    Offer: 'text-brand-accent',
    Declined: 'text-gray-400',
  }
  return (
    <span className={`text-xs font-semibold ${styles[status] ?? 'text-gray-400'}`}>{status}</span>
  )
}

// ─── Tab types + i18n ────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'pioneers' | 'anchors' | 'paths' | 'social' | 'settings'

const TAB_KEYS: AdminTab[] = ['overview', 'pioneers', 'anchors', 'paths', 'social', 'settings']

const TAB_I18N: Record<AdminTab, string> = {
  overview: 'admin.tabOverview',
  pioneers: 'admin.tabPioneers',
  anchors: 'admin.tabAnchors',
  paths: 'admin.tabPaths',
  social: 'admin.tabSocial',
  settings: 'admin.tabSettings',
}

const TAB_ICONS: Record<AdminTab, string> = {
  overview: '📊',
  pioneers: '👤',
  anchors: '⚓',
  paths: '🗺️',
  social: '📱',
  settings: '⚙️',
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab() {
  const { t } = useTranslation()

  const stats = [
    {
      label: t('admin.pioneers'),
      value: PLATFORM_STATS.pioneers.toLocaleString('en-US'),
      icon: '👤',
    },
    { label: t('admin.anchors'), value: PLATFORM_STATS.anchors, icon: '⚓' },
    { label: t('admin.openPaths'), value: PLATFORM_STATS.openPaths, icon: '🗺️' },
    { label: t('admin.chapters'), value: PLATFORM_STATS.chapters, icon: '📖' },
    { label: t('admin.venturesBooked'), value: PLATFORM_STATS.venturesBooked, icon: '🌍' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-phi-3 reveal-stagger">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={<span className="text-phi-xl">{stat.icon}</span>}
          />
        ))}
      </div>

      {/* Revenue Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-phi-3">
        <GlassCard variant="featured" padding="md">
          <p className="text-phi-sm text-gray-300">{t('admin.revenueThisMonth')}</p>
          <p className="text-phi-3xl font-bold text-brand-accent mt-1">
            KES {PLATFORM_STATS.revenueKES.toLocaleString('en-US')}
          </p>
        </GlassCard>
        <GlassCard padding="md">
          <p className="text-phi-sm text-gray-300">{t('admin.mpesaTransactions')}</p>
          <p className="text-phi-3xl font-bold text-brand-accent mt-1">
            {t('admin.pending', { count: String(PLATFORM_STATS.mpesaPending) })}
          </p>
          <p className="text-phi-xs text-gray-400 mt-1">{t('admin.checkMpesa')}</p>
        </GlassCard>
      </div>

      {/* Recent Signups */}
      <div className="glass p-phi-5">
        <h3 className="text-brand-accent font-semibold mb-4">{t('admin.recentSignups')}</h3>
        <div className="space-y-3">
          {RECENT_PIONEERS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-2 border-b border-brand-primary/20 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xs font-bold text-white">
                  {p.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-gray-400 text-xs">{p.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PioneerTypeBadge type={p.type} />
                <span className="text-gray-400 text-xs">{p.joined}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Chapters */}
      <div className="glass p-phi-5">
        <h3 className="text-brand-accent font-semibold mb-4">{t('admin.recentChapters')}</h3>
        <div className="space-y-3">
          {RECENT_CHAPTERS.map((ch, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-brand-primary/20 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  <span className="text-brand-accent">{ch.pioneer}</span> → {ch.path}
                </p>
                <p className="text-gray-400 text-xs">@ {ch.anchor}</p>
              </div>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                <span
                  className={`text-xs font-bold ${ch.score >= 80 ? 'text-green-400' : 'text-brand-accent'}`}
                >
                  {ch.score}%
                </span>
                <ChapterStatusBadge status={ch.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="glass p-phi-5">
        <h3 className="text-brand-accent font-semibold mb-4">{t('admin.systemHealth')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Database', icon: '🗄️', status: 'warning', msg: 'Not connected' },
            { name: 'M-Pesa', icon: '💳', status: 'ok', msg: 'Sandbox ✓' },
            { name: 'WhatsApp', icon: '💬', status: 'warning', msg: 'Keys needed' },
            { name: 'Social Media', icon: '📱', status: 'warning', msg: 'Keys needed' },
          ].map((item) => (
            <div
              key={item.name}
              className={`rounded-lg p-3 border ${item.status === 'ok' ? 'border-green-500/30 bg-green-900/10' : 'border-brand-accent/30 bg-brand-accent/5'}`}
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-white text-sm font-medium">{item.name}</p>
              <p
                className={`text-xs ${item.status === 'ok' ? 'text-green-400' : 'text-brand-accent'}`}
              >
                {item.status === 'ok' ? '✓' : '⚠️'} {item.msg}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Pioneers ────────────────────────────────────────────────────────────

function PioneersTab() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('All')
  const filters = [
    'All',
    'Active',
    'Incomplete',
    'Explorer',
    'Professional',
    'Creator',
    'Artisan',
    'Guardian',
    'Healer',
  ]

  const filtered =
    filter === 'All'
      ? ALL_PIONEERS
      : filter === 'Active'
        ? ALL_PIONEERS.filter((p) => p.status === 'Active')
        : filter === 'Incomplete'
          ? ALL_PIONEERS.filter((p) => p.status === 'Incomplete')
          : ALL_PIONEERS.filter((p) => p.type === filter)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-brand-accent text-black'
                : 'border border-brand-primary/50 text-gray-400 hover:border-brand-accent/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-primary/30">
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.name')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.type')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.route')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.skills')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.chapters')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.joined')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-brand-primary/20 hover:bg-[#220d15] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xs font-bold text-white">
                        {p.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <PioneerTypeBadge type={p.type} />
                  </td>
                  <td className="p-4 text-gray-300">
                    {p.from} → {p.to}
                  </td>
                  <td className="p-4 text-gray-300">{p.skills}</td>
                  <td className="p-4 text-gray-300">{p.chapters}</td>
                  <td className="p-4 text-gray-400 text-xs">{p.joined}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-xs text-brand-accent hover:underline">
                        {t('admin.view')}
                      </button>
                      <button className="text-xs text-blue-400 hover:underline">
                        {t('admin.message')}
                      </button>
                      <button className="text-xs text-red-400 hover:underline">
                        {t('admin.deactivate')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}

// ─── Tab: Anchors ─────────────────────────────────────────────────────────────

function AnchorsTab() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-primary/30">
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.anchor')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.country')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.openPaths')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">
                  {t('admin.totalChapters')}
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.verified')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ALL_ANCHORS.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-brand-primary/20 hover:bg-[#220d15] transition-colors"
                >
                  <td className="p-4 text-white font-medium">{a.name}</td>
                  <td className="p-4 text-gray-300">{a.country}</td>
                  <td className="p-4 text-gray-300">{a.openPaths}</td>
                  <td className="p-4 text-gray-300">{a.totalChapters}</td>
                  <td className="p-4">
                    {a.verified ? (
                      <span className="text-green-400 text-xs font-semibold">
                        {t('admin.verifiedLabel')}
                      </span>
                    ) : (
                      <span className="text-brand-accent text-xs font-semibold">
                        {t('admin.pendingLabel')}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!a.verified && (
                        <button className="text-xs text-green-400 hover:underline">
                          {t('admin.verify')}
                        </button>
                      )}
                      <button className="text-xs text-brand-accent hover:underline">
                        {t('admin.view')}
                      </button>
                      <button className="text-xs text-blue-400 hover:underline">
                        {t('admin.message')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}

// ─── Tab: Paths ───────────────────────────────────────────────────────────────

function PathsTab() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button className="text-xs border border-brand-accent/30 text-brand-accent px-3 py-1.5 rounded-lg hover:bg-brand-accent/10 transition-colors">
          {t('admin.pauseAllOpen')}
        </button>
        <button className="text-xs border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-colors">
          {t('admin.archiveOld')}
        </button>
      </div>

      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-primary/30">
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.pathTitle')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.anchor')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.type')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.chapters')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.matchAvg')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.status')}</th>
                <th className="text-left p-4 text-gray-400 font-medium">{t('admin.posted')}</th>
              </tr>
            </thead>
            <tbody>
              {ALL_PATHS.map((pt) => (
                <tr
                  key={pt.id}
                  className="border-b border-brand-primary/20 hover:bg-[#220d15] transition-colors"
                >
                  <td className="p-4 text-white font-medium max-w-xs truncate">{pt.title}</td>
                  <td className="p-4 text-gray-300 text-xs">{pt.anchor}</td>
                  <td className="p-4 text-gray-400 text-xs">{pt.type}</td>
                  <td className="p-4 text-gray-300">{pt.chapters}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-bold ${pt.matchAvg >= 80 ? 'text-green-400' : 'text-brand-accent'}`}
                    >
                      {pt.matchAvg}%
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusDot status={pt.status} />
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{pt.posted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}

// ─── Tab: Social Media ────────────────────────────────────────────────────────

function SocialTab() {
  const { t } = useTranslation()
  const [testResult, setTestResult] = useState<string | null>(null)

  const sendTestPost = async (platform: string) => {
    setTestResult(`Sending test to ${platform}...`)
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform.toLowerCase().replace('/', '_'),
          content: `Test post from BeNetwork admin — ${new Date().toISOString()}`,
        }),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      setTestResult(data.success ? `✓ Posted to ${platform}!` : `✗ ${data.error ?? 'Failed'}`)
    } catch {
      setTestResult(`✗ Network error`)
    }
    setTimeout(() => setTestResult(null), 4000)
  }

  return (
    <div className="space-y-6">
      {testResult && (
        <div className="bg-brand-surface-elevated border border-brand-accent/30 rounded-xl px-4 py-3 text-brand-accent text-sm">
          {testResult}
        </div>
      )}

      {/* Platform Status */}
      <div>
        <h3 className="text-brand-accent font-semibold mb-3">{t('admin.platformConnections')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.name} className="glass p-phi-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{platform.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{platform.name}</p>
                  <p className="text-gray-400 text-xs">{platform.envKey}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${platform.connected ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}
                >
                  {platform.connected ? t('admin.live') : t('admin.notSet')}
                </span>
                <button
                  onClick={() => sendTestPost(platform.name)}
                  className="text-xs text-brand-accent hover:underline"
                >
                  {t('admin.testPost')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Queue */}
      <div>
        <h3 className="text-brand-accent font-semibold mb-3">{t('admin.postQueue')}</h3>
        <div className="space-y-3">
          {MOCK_SOCIAL_QUEUE.map((post) => (
            <div key={post.id} className="glass p-phi-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-brand-accent font-medium">{post.platform}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === 'posted'
                        ? 'bg-green-900/40 text-green-400'
                        : post.status === 'failed'
                          ? 'bg-red-900/40 text-red-400'
                          : 'bg-brand-accent/10 text-brand-accent'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm truncate">{post.content}</p>
                <p className="text-gray-400 text-xs mt-1">{post.created}</p>
              </div>
              {post.status === 'failed' && (
                <button className="text-xs text-brand-accent hover:underline shrink-0">
                  {t('admin.retry')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Settings ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="glass p-phi-5">
        <h3 className="text-brand-accent font-semibold mb-4">{t('admin.envVars')}</h3>
        <div className="space-y-2">
          {ENV_VARS.map((ev) => (
            <div
              key={ev.key}
              className="flex items-center justify-between py-2 border-b border-brand-primary/20 last:border-0"
            >
              <div>
                <code className="text-sm text-white">{ev.key}</code>
                <p className="text-gray-400 text-xs">{ev.note}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  ev.status === 'set'
                    ? 'bg-green-900/40 text-green-400'
                    : 'bg-red-900/40 text-red-400'
                }`}
              >
                {ev.status === 'set' ? t('admin.set') : t('admin.missing')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-5">
        <h3 className="text-brand-accent font-semibold mb-3">{t('admin.setupGuides')}</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>
            •{' '}
            <Link
              href="https://neon.tech"
              className="text-blue-400 hover:underline"
              target="_blank"
            >
              Neon DB
            </Link>{' '}
            — Get DATABASE_URL from dashboard
          </li>
          <li>
            •{' '}
            <Link
              href="https://developer.safaricom.co.ke"
              className="text-blue-400 hover:underline"
              target="_blank"
            >
              Daraja API
            </Link>{' '}
            — Get M-Pesa consumer keys
          </li>
          <li>
            •{' '}
            <Link
              href="https://console.cloud.google.com"
              className="text-blue-400 hover:underline"
              target="_blank"
            >
              Google Cloud Console
            </Link>{' '}
            — Google OAuth credentials
          </li>
          <li>
            •{' '}
            <Link
              href="https://dashboard.stripe.com"
              className="text-blue-400 hover:underline"
              target="_blank"
            >
              Stripe Dashboard
            </Link>{' '}
            — Test API keys
          </li>
          <li>
            •{' '}
            <Link
              href="https://business.whatsapp.com"
              className="text-blue-400 hover:underline"
              target="_blank"
            >
              WhatsApp Business
            </Link>{' '}
            — API token
          </li>
        </ul>
      </div>
    </div>
  )
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      {/* Header */}
      <header className="glass-subtle border-b border-brand-accent/10 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦁</span>
            <div>
              <span className="text-phi-lg font-bold text-brand-accent">{t('admin.title')}</span>
              <span className="ml-2 text-xs bg-brand-primary text-brand-accent border border-brand-accent/30 px-2 py-0.5 rounded-full">
                {t('admin.badge')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              {t('admin.backToSite')}
            </Link>
            <Link href="/pioneers/dashboard" className="hover:text-white transition-colors">
              {t('admin.pioneerView')}
            </Link>
          </div>
        </div>
      </header>

      <SectionLayout size="sm" maxWidth="max-w-7xl">
        {/* Admin Warning Banner */}
        <GlassCard
          padding="sm"
          className="mb-phi-5 text-phi-sm text-brand-accent flex items-center gap-2 !border-brand-accent/30"
        >
          <span>⚠️</span>
          <span>{t('admin.mockWarning')}</span>
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8 border-b border-brand-primary/30 pb-0">
          {TAB_KEYS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-brand-accent border-brand-accent bg-brand-surface-elevated'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-brand-primary'
              }`}
            >
              {TAB_ICONS[tab]} {t(TAB_I18N[tab])}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'pioneers' && <PioneersTab />}
          {activeTab === 'anchors' && <AnchorsTab />}
          {activeTab === 'paths' && <PathsTab />}
          {activeTab === 'social' && <SocialTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </SectionLayout>
    </div>
  )
}

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
    <span className="text-xs bg-[#5C0A14]/50 text-[#C9A227] border border-[#C9A227]/20 px-2 py-0.5 rounded-full">
      {icons[type] ?? '👤'} {type}
    </span>
  )
}

function StatusDot({ status }: { status: 'Open' | 'Closed' | 'Paused' | string }) {
  const colors: Record<string, string> = {
    Open: 'bg-green-500',
    Closed: 'bg-gray-500',
    Paused: 'bg-[#C9A227]',
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
    New: 'text-[#C9A227]',
    'Under Review': 'text-blue-400',
    Shortlisted: 'text-green-400',
    Offer: 'text-[#C9A227]',
    Declined: 'text-gray-400',
  }
  return (
    <span className={`text-xs font-semibold ${styles[status] ?? 'text-gray-400'}`}>{status}</span>
  )
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Pioneers', value: PLATFORM_STATS.pioneers.toLocaleString('en-US'), icon: '👤' },
          { label: 'Anchors', value: PLATFORM_STATS.anchors, icon: '⚓' },
          { label: 'Open Paths', value: PLATFORM_STATS.openPaths, icon: '🗺️' },
          { label: 'Chapters', value: PLATFORM_STATS.chapters, icon: '📖' },
          { label: 'Ventures Booked', value: PLATFORM_STATS.venturesBooked, icon: '🌍' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#5C0A14] to-[#7a1020] border border-[#C9A227]/20 rounded-xl p-5">
          <p className="text-gray-300 text-sm">Revenue This Month</p>
          <p className="text-3xl font-bold text-[#C9A227] mt-1">
            KES {PLATFORM_STATS.revenueKES.toLocaleString('en-US')}
          </p>
        </div>
        <div className="bg-[#1a0a0f] border border-[#C9A227]/30 rounded-xl p-5">
          <p className="text-gray-300 text-sm">M-Pesa Transactions</p>
          <p className="text-3xl font-bold text-[#C9A227] mt-1">
            {PLATFORM_STATS.mpesaPending} pending
          </p>
          <p className="text-gray-500 text-xs mt-1">Check M-Pesa sandbox dashboard</p>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-5">
        <h3 className="text-[#C9A227] font-semibold mb-4">Recent Pioneer Signups</h3>
        <div className="space-y-3">
          {RECENT_PIONEERS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-2 border-b border-[#5C0A14]/20 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5C0A14] to-[#C9A227] flex items-center justify-center text-xs font-bold text-white">
                  {p.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-gray-500 text-xs">{p.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PioneerTypeBadge type={p.type} />
                <span className="text-gray-500 text-xs">{p.joined}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Chapters */}
      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-5">
        <h3 className="text-[#C9A227] font-semibold mb-4">Recent Chapters</h3>
        <div className="space-y-3">
          {RECENT_CHAPTERS.map((ch, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-[#5C0A14]/20 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  <span className="text-[#C9A227]">{ch.pioneer}</span> → {ch.path}
                </p>
                <p className="text-gray-500 text-xs">@ {ch.anchor}</p>
              </div>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                <span
                  className={`text-xs font-bold ${ch.score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}
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
      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-5">
        <h3 className="text-[#C9A227] font-semibold mb-4">System Health</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Database', icon: '🗄️', status: 'warning', msg: 'Not connected' },
            { name: 'M-Pesa', icon: '💳', status: 'ok', msg: 'Sandbox ✓' },
            { name: 'WhatsApp', icon: '💬', status: 'warning', msg: 'Keys needed' },
            { name: 'Social Media', icon: '📱', status: 'warning', msg: 'Keys needed' },
          ].map((item) => (
            <div
              key={item.name}
              className={`rounded-lg p-3 border ${item.status === 'ok' ? 'border-green-500/30 bg-green-900/10' : 'border-yellow-500/30 bg-yellow-900/10'}`}
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-white text-sm font-medium">{item.name}</p>
              <p
                className={`text-xs ${item.status === 'ok' ? 'text-green-400' : 'text-yellow-400'}`}
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
                ? 'bg-[#C9A227] text-black'
                : 'border border-[#5C0A14]/50 text-gray-400 hover:border-[#C9A227]/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#5C0A14]/30">
                <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Route</th>
                <th className="text-left p-4 text-gray-400 font-medium">Skills</th>
                <th className="text-left p-4 text-gray-400 font-medium">Chapters</th>
                <th className="text-left p-4 text-gray-400 font-medium">Joined</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#5C0A14]/20 hover:bg-[#220d15] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5C0A14] to-[#C9A227] flex items-center justify-center text-xs font-bold text-white">
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
                  <td className="p-4 text-gray-500 text-xs">{p.joined}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-xs text-[#C9A227] hover:underline">View</button>
                      <button className="text-xs text-blue-400 hover:underline">Message</button>
                      <button className="text-xs text-red-400 hover:underline">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Anchors ─────────────────────────────────────────────────────────────

function AnchorsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#5C0A14]/30">
                <th className="text-left p-4 text-gray-400 font-medium">Anchor</th>
                <th className="text-left p-4 text-gray-400 font-medium">Country</th>
                <th className="text-left p-4 text-gray-400 font-medium">Open Paths</th>
                <th className="text-left p-4 text-gray-400 font-medium">Total Chapters</th>
                <th className="text-left p-4 text-gray-400 font-medium">Verified</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ALL_ANCHORS.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-[#5C0A14]/20 hover:bg-[#220d15] transition-colors"
                >
                  <td className="p-4 text-white font-medium">{a.name}</td>
                  <td className="p-4 text-gray-300">{a.country}</td>
                  <td className="p-4 text-gray-300">{a.openPaths}</td>
                  <td className="p-4 text-gray-300">{a.totalChapters}</td>
                  <td className="p-4">
                    {a.verified ? (
                      <span className="text-green-400 text-xs font-semibold">✓ Verified</span>
                    ) : (
                      <span className="text-yellow-400 text-xs font-semibold">⚠ Pending</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!a.verified && (
                        <button className="text-xs text-green-400 hover:underline">Verify</button>
                      )}
                      <button className="text-xs text-[#C9A227] hover:underline">View</button>
                      <button className="text-xs text-blue-400 hover:underline">Message</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Paths ───────────────────────────────────────────────────────────────

function PathsTab() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button className="text-xs border border-[#C9A227]/30 text-[#C9A227] px-3 py-1.5 rounded-lg hover:bg-[#C9A227]/10 transition-colors">
          Pause All Open
        </button>
        <button className="text-xs border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-colors">
          Archive Old (pre-2024)
        </button>
      </div>

      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#5C0A14]/30">
                <th className="text-left p-4 text-gray-400 font-medium">Path Title</th>
                <th className="text-left p-4 text-gray-400 font-medium">Anchor</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Chapters</th>
                <th className="text-left p-4 text-gray-400 font-medium">Match Avg</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                <th className="text-left p-4 text-gray-400 font-medium">Posted</th>
              </tr>
            </thead>
            <tbody>
              {ALL_PATHS.map((pt) => (
                <tr
                  key={pt.id}
                  className="border-b border-[#5C0A14]/20 hover:bg-[#220d15] transition-colors"
                >
                  <td className="p-4 text-white font-medium max-w-xs truncate">{pt.title}</td>
                  <td className="p-4 text-gray-300 text-xs">{pt.anchor}</td>
                  <td className="p-4 text-gray-400 text-xs">{pt.type}</td>
                  <td className="p-4 text-gray-300">{pt.chapters}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-bold ${pt.matchAvg >= 80 ? 'text-green-400' : 'text-yellow-400'}`}
                    >
                      {pt.matchAvg}%
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusDot status={pt.status} />
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{pt.posted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Social Media ────────────────────────────────────────────────────────

function SocialTab() {
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
        <div className="bg-[#1a0a0f] border border-[#C9A227]/30 rounded-xl px-4 py-3 text-[#C9A227] text-sm">
          {testResult}
        </div>
      )}

      {/* Platform Status */}
      <div>
        <h3 className="text-[#C9A227] font-semibold mb-3">Platform Connections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{platform.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{platform.name}</p>
                  <p className="text-gray-500 text-xs">{platform.envKey}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${platform.connected ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}
                >
                  {platform.connected ? '✓ Live' : '✗ Not set'}
                </span>
                <button
                  onClick={() => sendTestPost(platform.name)}
                  className="text-xs text-[#C9A227] hover:underline"
                >
                  Test post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Queue */}
      <div>
        <h3 className="text-[#C9A227] font-semibold mb-3">Post Queue</h3>
        <div className="space-y-3">
          {MOCK_SOCIAL_QUEUE.map((post) => (
            <div
              key={post.id}
              className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#C9A227] font-medium">{post.platform}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === 'posted'
                        ? 'bg-green-900/40 text-green-400'
                        : post.status === 'failed'
                          ? 'bg-red-900/40 text-red-400'
                          : 'bg-[#C9A227]/10 text-[#C9A227]'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm truncate">{post.content}</p>
                <p className="text-gray-500 text-xs mt-1">{post.created}</p>
              </div>
              {post.status === 'failed' && (
                <button className="text-xs text-[#C9A227] hover:underline shrink-0">Retry</button>
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
  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-5">
        <h3 className="text-[#C9A227] font-semibold mb-4">Environment Variables</h3>
        <div className="space-y-2">
          {ENV_VARS.map((ev) => (
            <div
              key={ev.key}
              className="flex items-center justify-between py-2 border-b border-[#5C0A14]/20 last:border-0"
            >
              <div>
                <code className="text-sm text-white">{ev.key}</code>
                <p className="text-gray-500 text-xs">{ev.note}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  ev.status === 'set'
                    ? 'bg-green-900/40 text-green-400'
                    : 'bg-red-900/40 text-red-400'
                }`}
              >
                {ev.status === 'set' ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a0a0f] border border-[#C9A227]/20 rounded-xl p-5">
        <h3 className="text-[#C9A227] font-semibold mb-3">Setup Guides</h3>
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

const TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'pioneers', label: '👤 Pioneers' },
  { id: 'anchors', label: '⚓ Anchors' },
  { id: 'paths', label: '🗺️ Paths' },
  { id: 'social', label: '📱 Social Media' },
  { id: 'settings', label: '⚙️ Settings' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-[#0a0005] text-white">
      {/* Header */}
      <header className="bg-[#0d0208] border-b border-[#5C0A14]/50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦁</span>
            <div>
              <span className="text-lg font-bold text-[#C9A227]">BeNetwork</span>
              <span className="ml-2 text-xs bg-[#5C0A14] text-[#C9A227] border border-[#C9A227]/30 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              ← Back to site
            </Link>
            <Link href="/pioneers/dashboard" className="hover:text-white transition-colors">
              Pioneer View
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Warning Banner */}
        <div className="bg-[#5C0A14]/30 border border-[#C9A227]/30 rounded-xl px-4 py-3 mb-6 text-sm text-[#C9A227] flex items-center gap-2">
          <span>⚠️</span>
          <span>Admin dashboard — all data is mock until DATABASE_URL is configured</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8 border-b border-[#5C0A14]/30 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-[#C9A227] border-[#C9A227] bg-[#1a0a0f]'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-[#5C0A14]'
              }`}
            >
              {tab.label}
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
      </div>
    </div>
  )
}

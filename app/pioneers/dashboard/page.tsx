'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PIONEER_TYPES } from '@/lib/vocabulary'
import { MOCK_PATHS } from '@/lib/matching'
import type { PioneerType } from '@/lib/vocabulary'

// ─── Mock Pioneer Data ─────────────────────────────────────────────────────────
const MOCK_PIONEER = {
  name: 'Amara Osei',
  type: 'explorer' as PioneerType,
  fromCountry: 'KE',
  toCountries: ['DE', 'GB'],
  route: 'Kenya → Germany',
  routeStrength: 'Direct Route',
  profileComplete: 78,
  referralCode: 'PIONEER-AMARA',
  whatsapp: '+254 712 345 678',
  headline: 'Safari Guide & Wildlife Educator with 5 years in Maasai Mara',
  bio: 'Passionate about connecting people with Kenya\'s breathtaking wildlife. Specializing in eco-tourism and conservation storytelling.',
  skills: ['Wildlife knowledge', 'Swahili', 'First Aid', 'Guest relations', 'Photography'],
  yearsExperience: 5,
  joinedDate: 'Jan 2024',
}

const MOCK_CHAPTERS = [
  {
    id: 'ch-001',
    pathTitle: 'Safari Guide & Wildlife Educator',
    anchor: 'Orpul Safaris',
    date: '2024-03-01',
    status: 'Shortlisted',
    matchScore: 92,
  },
  {
    id: 'ch-002',
    pathTitle: 'Wildlife Photographer — Conservation Storytelling',
    anchor: 'African Wildlife Foundation',
    date: '2024-02-20',
    status: 'Under Review',
    matchScore: 87,
  },
  {
    id: 'ch-003',
    pathTitle: 'Eco-Lodge Operations Manager',
    anchor: 'Victoria Paradise',
    date: '2024-02-10',
    status: 'New',
    matchScore: 74,
  },
]

const MOCK_SAVED_PATHS = [
  MOCK_PATHS[0],
  MOCK_PATHS[1],
  MOCK_PATHS[7],
]

const MATCH_SCORES = [92, 87, 74]

const MOCK_REFERRAL_STATS = {
  referrals: 3,
  hires: 1,
  earned: 5000,
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    New: 'bg-[#5C0A14] text-[#C9A227] border border-[#C9A227]/30 animate-pulse',
    'Under Review': 'bg-blue-600 text-white',
    Shortlisted: 'bg-green-600 text-white shadow-lg shadow-green-500/30',
    Offer: 'bg-yellow-500 text-black font-bold',
    Declined: 'bg-gray-600 text-gray-300',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] ?? 'bg-gray-600 text-gray-300'}`}>
      {status}
    </span>
  )
}

function MatchScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-[#C9A227]'
  return (
    <span className={`text-sm font-bold ${color}`}>{score}% match</span>
  )
}

function ProfileRing({ percent }: { percent: number }) {
  const r = 52
  const circumference = 2 * Math.PI * r
  const offset = circumference - (percent / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#3f0a0a" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#C9A227"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-yellow-400">{percent}%</span>
          <span className="text-xs text-gray-400">complete</span>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: My Compass ─────────────────────────────────────────────────────────

function CompassTab() {
  const pioneer = MOCK_PIONEER
  const typeInfo = PIONEER_TYPES[pioneer.type]
  const featuredPaths = MOCK_PATHS.slice(0, 3)
  const scores = [92, 87, 78]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5C0A14] to-[#8B1A2A] rounded-2xl p-6 border border-[#C9A227]/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Welcome back, {pioneer.name}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40 px-3 py-1 rounded-full text-sm font-medium">
                {typeInfo.icon} {typeInfo.label} Pioneer
              </span>
            </div>
            <p className="text-gray-300 text-sm max-w-lg">{pioneer.headline}</p>
          </div>
          <div className="text-5xl hidden sm:block">🦁</div>
        </div>
      </div>

      {/* Compass Reading + Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Compass Route */}
        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 col-span-1">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Your Compass Route</p>
          <p className="text-lg font-bold text-white">{pioneer.route}</p>
          <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">
            ✓ {pioneer.routeStrength}
          </span>
        </div>

        {/* Profile Completeness */}
        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 col-span-1">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Profile Strength</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Completeness</span>
                <span className="text-sm font-bold text-yellow-400">{pioneer.profileComplete}%</span>
              </div>
              <div className="w-full bg-[#3f0a0a] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#C9A227] to-[#C9A227] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pioneer.profileComplete}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* New Matches */}
        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 col-span-1">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">New Matches</p>
          <p className="text-3xl font-bold text-white">3</p>
          <span className="text-xs bg-[#5C0A14]/30 text-[#C9A227] border border-[#C9A227]/30 px-2 py-0.5 rounded-full">
            🔥 New this week
          </span>
        </div>
      </div>

      {/* Featured Matched Paths */}
      <div>
        <h3 className="text-lg font-semibold text-[#C9A227] mb-3">Top Paths for Your Compass</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredPaths.map((path, i) => (
            <Link
              key={path.id}
              href={`/ventures/${path.id}`}
              className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 hover:border-[#C9A227]/50 hover:bg-[#220d15] transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400">{path.anchorName}</span>
                <MatchScoreBadge score={scores[i]} />
              </div>
              <h4 className="text-white font-semibold text-sm group-hover:text-[#C9A227] transition-colors mb-1">
                {path.title}
              </h4>
              <p className="text-xs text-gray-500">{path.location}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {path.requiredSkills.slice(0, 2).map(skill => (
                  <span key={skill} className="text-xs bg-[#5C0A14]/40 text-[#C9A227] px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href="/compass"
          className="bg-[#C9A227] text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Update My Compass
        </Link>
        <Link
          href="/ventures"
          className="border border-[#C9A227]/40 text-[#C9A227] px-6 py-3 rounded-xl hover:bg-[#C9A227]/10 transition-colors"
        >
          Browse All Paths
        </Link>
      </div>
    </div>
  )
}

// ─── Tab: My Chapters ────────────────────────────────────────────────────────

function ChaptersTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#C9A227]">My Chapters</h2>
      {MOCK_CHAPTERS.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📖</p>
          <p className="text-lg">You haven&apos;t opened any chapters yet.</p>
          <Link href="/ventures" className="mt-4 inline-block bg-[#C9A227] text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400">
            Browse Ventures
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_CHAPTERS.map(chapter => (
            <div
              key={chapter.id}
              className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#C9A227]/30 transition-all"
            >
              <div className="flex-1">
                <h4 className="text-white font-semibold">{chapter.pathTitle}</h4>
                <p className="text-gray-400 text-sm">{chapter.anchor}</p>
                <p className="text-gray-500 text-xs mt-1">Opened {chapter.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <MatchScoreBadge score={chapter.matchScore} />
                <StatusBadge status={chapter.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Tab: Saved Paths ─────────────────────────────────────────────────────────

function SavedPathsTab() {
  const [saved, setSaved] = useState(MOCK_SAVED_PATHS)

  if (saved.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">♡</p>
        <p>Save a path by clicking ♡ on any venture</p>
        <Link href="/ventures" className="mt-4 inline-block text-[#C9A227] underline">
          Browse Ventures
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#C9A227]">Saved Paths</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {saved.map((path, i) => (
          <div
            key={path.id}
            className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 hover:border-[#C9A227]/50 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400">{path.anchorName}</span>
              <button
                onClick={() => setSaved(prev => prev.filter(p => p.id !== path.id))}
                className="text-red-400 hover:text-red-300 transition-colors text-lg"
                title="Remove from saved"
              >
                ♥
              </button>
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">{path.title}</h4>
            <p className="text-xs text-gray-500 mb-3">{path.location}</p>
            <MatchScoreBadge score={MATCH_SCORES[i] ?? 70} />
            <div className="mt-3">
              <Link
                href={`/ventures/${path.id}`}
                className="block text-center bg-[#5C0A14] text-[#C9A227] text-sm font-semibold py-2 rounded-lg hover:bg-[#7a0f1e] transition-colors"
              >
                Open Chapter
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: My Profile ─────────────────────────────────────────────────────────

function ProfileTab() {
  const pioneer = MOCK_PIONEER
  const typeInfo = PIONEER_TYPES[pioneer.type]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#C9A227]">My Profile</h2>

      {/* Profile Completeness */}
      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <ProfileRing percent={pioneer.profileComplete} />
        <div className="flex-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5C0A14] to-[#C9A227] flex items-center justify-center text-2xl font-bold text-white mb-3">
            {pioneer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h3 className="text-xl font-bold text-white">{pioneer.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{pioneer.headline}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40 px-2 py-0.5 rounded-full text-xs">
              {typeInfo.icon} {typeInfo.label}
            </span>
            <span className="text-gray-500 text-xs">Joined {pioneer.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Edit Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4">
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Pioneer Type</label>
          <p className="text-white font-medium">{typeInfo.icon} {typeInfo.label}</p>
          <p className="text-gray-500 text-xs mt-1">{typeInfo.description}</p>
          <Link href="/onboarding" className="text-[#C9A227] text-xs mt-2 inline-block hover:underline">Change type →</Link>
        </div>

        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4">
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Route</label>
          <p className="text-white font-medium">{pioneer.fromCountry} → {pioneer.toCountries.join(', ')}</p>
          <Link href="/compass" className="text-[#C9A227] text-xs mt-2 inline-block hover:underline">Update compass →</Link>
        </div>

        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4">
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Skills</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {pioneer.skills.map(skill => (
              <span key={skill} className="text-xs bg-[#5C0A14]/40 text-[#C9A227] px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
          <Link href="/profile" className="text-[#C9A227] text-xs mt-2 inline-block hover:underline">Edit skills →</Link>
        </div>

        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4">
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">WhatsApp Notifications</label>
          <p className="text-white font-medium">{pioneer.whatsapp}</p>
          <Link href="/profile" className="text-[#C9A227] text-xs mt-2 inline-block hover:underline">Update →</Link>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4">
        <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Bio</label>
        <p className="text-gray-300 text-sm">{pioneer.bio}</p>
        <Link href="/profile" className="text-[#C9A227] text-xs mt-2 inline-block hover:underline">Edit bio →</Link>
      </div>
    </div>
  )
}

// ─── Tab: Earnings & Referrals ────────────────────────────────────────────────

function ReferralsTab() {
  const pioneer = MOCK_PIONEER
  const stats = MOCK_REFERRAL_STATS
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(pioneer.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const msg = `Join BeNetwork — the platform for Pioneers! Use my code ${pioneer.referralCode} and let's go together. https://bekenya.com?ref=${pioneer.referralCode}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const shareTwitter = () => {
    const msg = `Finding my path with @BeKenya — the BeNetwork for Pioneers! Join me with code ${pioneer.referralCode} 🦁 #BeKenya #Pioneer`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#C9A227]">Earnings & Referrals</h2>

      {/* Referral code */}
      <div className="bg-gradient-to-r from-[#5C0A14] to-[#8B1A2A] border border-[#C9A227]/30 rounded-2xl p-6">
        <p className="text-gray-300 text-sm mb-2">Your Referral Code</p>
        <div className="flex items-center gap-3">
          <code className="text-2xl font-mono font-bold text-[#C9A227] bg-black/30 px-4 py-2 rounded-lg">
            {pioneer.referralCode}
          </code>
          <button
            onClick={copyCode}
            className="bg-[#C9A227] text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Incentive Banner */}
      <div className="bg-[#1a0a0f] border border-green-500/30 rounded-xl p-4 flex items-center gap-4">
        <span className="text-3xl">💰</span>
        <div>
          <p className="text-green-400 font-bold">KES 5,000 per hire</p>
          <p className="text-gray-400 text-sm">When a Pioneer you referred gets hired, you earn KES 5,000. No limit.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{stats.referrals}</p>
          <p className="text-gray-400 text-xs mt-1">Referrals</p>
        </div>
        <div className="bg-[#1a0a0f] border border-[#5C0A14]/50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{stats.hires}</p>
          <p className="text-gray-400 text-xs mt-1">Hire</p>
        </div>
        <div className="bg-[#1a0a0f] border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#C9A227]">KES {stats.earned.toLocaleString('en-US')}</p>
          <p className="text-gray-400 text-xs mt-1">Earned</p>
        </div>
      </div>

      {/* Share buttons */}
      <div>
        <p className="text-gray-400 text-sm mb-3">Share your code:</p>
        <div className="flex gap-3">
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            <span>💬</span> WhatsApp
          </button>
          <button
            onClick={shareTwitter}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            <span>🐦</span> Twitter
          </button>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 border border-[#C9A227]/40 text-[#C9A227] px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#C9A227]/10 transition-colors"
          >
            <span>🔗</span> Copy Link
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'compass', label: '🧭 My Compass' },
  { id: 'chapters', label: '📖 My Chapters' },
  { id: 'saved', label: '♡ Saved Paths' },
  { id: 'profile', label: '👤 My Profile' },
  { id: 'earnings', label: '💰 Earnings & Referrals' },
]

export default function PioneerDashboard() {
  const [activeTab, setActiveTab] = useState('compass')

  return (
    <div className="min-h-screen bg-[#0a0005] text-white">
      {/* Header */}
      <header className="bg-[#0d0208] border-b border-[#5C0A14]/50 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦁</span>
            <span className="text-xl font-bold text-[#C9A227]">BeNetwork</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="/ventures" className="hover:text-white transition-colors">Browse Paths</Link>
            <Link href="/compass" className="hover:text-white transition-colors">Compass</Link>
            <Link href="/pioneers/notifications" className="hover:text-white transition-colors relative">
              Notifications
              <span className="absolute -top-1 -right-3 w-2 h-2 bg-[#C9A227] rounded-full"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5C0A14] to-[#C9A227] flex items-center justify-center text-sm font-bold text-white">
              AO
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8 border-b border-[#5C0A14]/30 pb-0">
          {TABS.map(tab => (
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
          {activeTab === 'compass' && <CompassTab />}
          {activeTab === 'chapters' && <ChaptersTab />}
          {activeTab === 'saved' && <SavedPathsTab />}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'earnings' && <ReferralsTab />}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Notification Types & Mock Data ──────────────────────────────────────────

type NotificationType = 'path' | 'chapter' | 'compass' | 'community' | 'earnings'

interface Notification {
  id: string
  type: NotificationType
  icon: string
  title: string
  body: string
  link?: string
  time: string
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'path',
    icon: '🔥',
    title: 'New Path Match',
    body: 'Safari Guide & Wildlife Educator at Orpul Safaris (92% match)',
    link: '/ventures/path-001',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'chapter',
    icon: '📖',
    title: 'Chapter Reviewed',
    body: 'Orpul Safaris reviewed your chapter for Safari Guide — status updated to Shortlisted!',
    link: '/pioneers/dashboard',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'compass',
    icon: '🌍',
    title: 'New Compass Route',
    body: 'KE → DE route now has 12 new open Paths this week. Your compass is showing strong signals.',
    link: '/compass',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'community',
    icon: '🎉',
    title: 'UTAMADUNI Milestone',
    body: 'Your bookings and contributions helped fund 5 children\'s education this month. Asante sana!',
    link: '/charity',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'earnings',
    icon: '💰',
    title: 'Referral Reward',
    body: 'KES 5,000 earned — James Mwangi found his path at Kenyatta Conference Centre!',
    link: '/pioneers/dashboard',
    time: '3 days ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'path',
    icon: '🦁',
    title: 'New Safari Venture Available',
    body: 'Victoria Paradise: New boat ready! Deep Sea Fishing Venture now open — 3 spots left.',
    link: '/ventures/path-002',
    time: '4 days ago',
    read: true,
  },
  {
    id: 'n7',
    type: 'path',
    icon: '🔥',
    title: 'New Path Match',
    body: 'Wildlife Photographer at African Wildlife Foundation (87% match) — aligns with your compass.',
    link: '/ventures/path-008',
    time: '5 days ago',
    read: true,
  },
  {
    id: 'n8',
    type: 'chapter',
    icon: '📖',
    title: 'Chapter Opened',
    body: 'You opened a chapter for Eco-Lodge Operations Manager at Victoria Paradise. Good luck, Pioneer!',
    link: '/pioneers/dashboard',
    time: '1 week ago',
    read: true,
  },
  {
    id: 'n9',
    type: 'compass',
    icon: '🧭',
    title: 'Compass Updated',
    body: 'Your compass route was updated. We\'re now matching you with 24 new paths across 3 countries.',
    link: '/compass',
    time: '1 week ago',
    read: true,
  },
  {
    id: 'n10',
    type: 'community',
    icon: '🌿',
    title: 'Pioneer Network Growing',
    body: '847 Pioneers are now on BeNetwork. Your referral code PIONEER-AMARA has been used 3 times.',
    link: '/pioneers/dashboard',
    time: '2 weeks ago',
    read: true,
  },
]

type TabFilter = 'all' | 'unread' | 'path' | 'chapter' | 'compass' | 'community'

const TABS: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'path', label: 'Paths' },
  { id: 'chapter', label: 'Chapters' },
  { id: 'compass', label: 'Compass' },
  { id: 'community', label: 'Community' },
]

function getTypeAccentClass(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    path: 'border-l-orange-500',
    chapter: 'border-l-blue-500',
    compass: 'border-l-teal-500',
    community: 'border-l-green-500',
    earnings: 'border-l-yellow-500',
  }
  return map[type] ?? 'border-l-gray-500'
}

function getTypeBadgeClass(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    path: 'bg-orange-900/30 text-orange-400',
    chapter: 'bg-blue-900/30 text-blue-400',
    compass: 'bg-teal-900/30 text-teal-400',
    community: 'bg-green-900/30 text-green-400',
    earnings: 'bg-yellow-900/30 text-yellow-400',
  }
  return map[type] ?? 'bg-gray-900/30 text-gray-400'
}

function getTypeLabel(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    path: 'Path', chapter: 'Chapter', compass: 'Compass',
    community: 'Community', earnings: 'Earnings',
  }
  return map[type] ?? type
}

// ─── Notification Card ────────────────────────────────────────────────────────

function NotificationCard({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: string) => void
}) {
  const accentBorder = getTypeAccentClass(notification.type)
  const badgeClass = getTypeBadgeClass(notification.type)
  const typeLabel = getTypeLabel(notification.type)

  return (
    <div
      className={`relative bg-gradient-to-r from-[#1a0a0f] to-[#0d0208] border border-[#5C0A14]/40 border-l-4 ${accentBorder} rounded-xl p-5 transition-all hover:border-[#C9A227]/30 hover:shadow-lg hover:shadow-[#5C0A14]/20 ${
        !notification.read ? 'bg-[#220d15]/50' : ''
      }`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-[#5C0A14]/50 flex items-center justify-center text-xl shrink-0">
          {notification.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
              {typeLabel}
            </span>
            <span className="text-gray-500 text-xs">{notification.time}</span>
          </div>

          <h4 className="text-white font-semibold text-sm mb-1">{notification.title}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{notification.body}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            {notification.link && (
              <Link
                href={notification.link}
                className="text-[#C9A227] text-xs font-semibold hover:underline"
              >
                View →
              </Link>
            )}
            {!notification.read && (
              <button
                onClick={() => onRead(notification.id)}
                className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🧭</div>
      <h3 className="text-xl font-semibold text-white mb-2">Your compass is quiet right now.</h3>
      <p className="text-gray-400 mb-6">Check back soon — new paths and updates will appear here.</p>
      <Link
        href="/ventures"
        className="inline-block bg-[#C9A227] text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
      >
        Browse Paths
      </Link>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markOneRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !n.read
    return n.type === activeTab
  })

  return (
    <div className="min-h-screen bg-[#0a0005] text-white">
      {/* Header */}
      <header className="bg-[#0d0208] border-b border-[#5C0A14]/50 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/pioneers/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
              ← Dashboard
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🦁</span>
            <span className="text-lg font-bold text-[#C9A227]">BeNetwork</span>
          </Link>
          <Link
            href="/profile"
            className="text-[#C9A227] text-sm hover:underline"
          >
            Preferences
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-orange-400 text-sm mt-0.5">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-[#C9A227] border border-[#C9A227]/30 px-3 py-1.5 rounded-lg hover:bg-[#C9A227]/10 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6 border-b border-[#5C0A14]/30 pb-0">
          {TABS.map(tab => {
            const count = tab.id === 'unread' ? unreadCount
              : tab.id === 'all' ? notifications.length
              : notifications.filter(n => n.type === tab.id).length
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'text-[#C9A227] border-[#C9A227] bg-[#1a0a0f]'
                    : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-[#5C0A14]'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center ${
                    activeTab === tab.id
                      ? 'bg-[#C9A227]/20 text-[#C9A227]'
                      : 'bg-[#5C0A14]/50 text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Notifications Timeline */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {/* Group: Today */}
            {filtered.some(n => n.time.includes('hour') || n.time === 'Just now') && (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1 mt-4 mb-2">Today</p>
                {filtered
                  .filter(n => n.time.includes('hour') || n.time === 'Just now')
                  .map(n => (
                    <NotificationCard key={n.id} notification={n} onRead={markOneRead} />
                  ))}
              </>
            )}

            {/* Group: This Week */}
            {filtered.some(n => n.time.includes('day') && !n.time.includes('week')) && (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1 mt-6 mb-2">This Week</p>
                {filtered
                  .filter(n => n.time.includes('day') && !n.time.includes('week'))
                  .map(n => (
                    <NotificationCard key={n.id} notification={n} onRead={markOneRead} />
                  ))}
              </>
            )}

            {/* Group: Earlier */}
            {filtered.some(n => n.time.includes('week')) && (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1 mt-6 mb-2">Earlier</p>
                {filtered
                  .filter(n => n.time.includes('week'))
                  .map(n => (
                    <NotificationCard key={n.id} notification={n} onRead={markOneRead} />
                  ))}
              </>
            )}
          </div>
        )}

        {/* Notification Preferences Footer */}
        <div className="mt-10 pt-6 border-t border-[#5C0A14]/30 text-center">
          <p className="text-gray-500 text-sm">
            Notifications are sent via WhatsApp and email.{' '}
            <Link href="/profile" className="text-[#C9A227] hover:underline">
              Update preferences →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

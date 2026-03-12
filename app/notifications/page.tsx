'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslation } from '@/lib/hooks/use-translation'
import { useIdentity } from '@/lib/identity-context'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

// ─── Types ───────────────────────────────────────────────────────────────────

type NotificationCategory = 'match' | 'message' | 'path' | 'system'

interface Notification {
  id: string
  category: NotificationCategory
  icon: string
  title: string
  description: string
  timeAgo: string
  read: boolean
  link?: string
}

// ─── Mock Notifications ──────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    category: 'match',
    icon: '🎯',
    title: 'New Compass Match — 94%',
    description:
      'Safari Guide & Wildlife Educator at Orpul Safaris matches your compass profile strongly.',
    timeAgo: '12 minutes ago',
    read: false,
    link: '/ventures',
  },
  {
    id: 'n2',
    category: 'message',
    icon: '💬',
    title: 'Message from Orpul Safaris',
    description: 'Thank you for your chapter! We would love to schedule a conversation this week.',
    timeAgo: '1 hour ago',
    read: false,
    link: '/threads',
  },
  {
    id: 'n3',
    category: 'path',
    icon: '🛤️',
    title: 'New Path: Eco-Lodge Operations Manager',
    description:
      'Victoria Paradise posted a new Path in Diani Beach — aligns with your hospitality interests.',
    timeAgo: '3 hours ago',
    read: false,
    link: '/ventures',
  },
  {
    id: 'n4',
    category: 'match',
    icon: '🌍',
    title: 'Compass Route Update: KE → DE',
    description:
      '8 new Paths opened on your KE to DE route this week. Your compass signals are strong.',
    timeAgo: '1 day ago',
    read: false,
    link: '/compass',
  },
  {
    id: 'n5',
    category: 'message',
    icon: '💬',
    title: 'Message from African Wildlife Foundation',
    description:
      'We reviewed your portfolio — impressive work. Can you share availability for next month?',
    timeAgo: '2 days ago',
    read: true,
    link: '/threads',
  },
  {
    id: 'n6',
    category: 'path',
    icon: '🦁',
    title: 'Safari Venture: Deep Sea Fishing',
    description: 'Victoria Paradise launched a new Deep Sea Fishing Venture — only 3 spots remain.',
    timeAgo: '3 days ago',
    read: true,
    link: '/ventures',
  },
  {
    id: 'n7',
    category: 'match',
    icon: '🎯',
    title: 'New Match — Wildlife Photographer (87%)',
    description:
      'African Wildlife Foundation is looking for a Wildlife Photographer — strong alignment with your craft.',
    timeAgo: '5 days ago',
    read: true,
    link: '/ventures',
  },
  {
    id: 'n8',
    category: 'system',
    icon: '🌿',
    title: 'UTAMADUNI CBO Milestone',
    description: 'Your contributions helped fund education for 5 children this month. Asante sana!',
    timeAgo: '1 week ago',
    read: true,
    link: '/charity',
  },
  {
    id: 'n9',
    category: 'path',
    icon: '🛤️',
    title: 'Path Closing Soon: Tour Coordinator',
    description:
      'Kenyatta Conference Centre Tour Coordinator closes in 48 hours — 12 chapters received so far.',
    timeAgo: '1 week ago',
    read: true,
    link: '/ventures',
  },
  {
    id: 'n10',
    category: 'system',
    icon: '🏅',
    title: 'Referral Reward Earned',
    description: 'KES 5,000 earned — James Mwangi found his path through your referral code.',
    timeAgo: '2 weeks ago',
    read: true,
    link: '/referral',
  },
]

// ─── Tab Config ──────────────────────────────────────────────────────────────

type TabKey = 'all' | 'match' | 'message' | 'path'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'match', label: 'Matches' },
  { key: 'message', label: 'Messages' },
  { key: 'path', label: 'Paths' },
]

// ─── Category Badge Styles ───────────────────────────────────────────────────

function getCategoryBadge(category: NotificationCategory): {
  label: string
  className: string
} {
  const map: Record<NotificationCategory, { label: string; className: string }> = {
    match: { label: 'Match', className: 'bg-brand-accent/15 text-brand-accent' },
    message: { label: 'Message', className: 'bg-blue-500/15 text-blue-400' },
    path: { label: 'Path', className: 'bg-emerald-500/15 text-emerald-400' },
    system: { label: 'System', className: 'bg-brand-primary/20 text-gray-300' },
  }
  return map[category]
}

// ─── Notification Card ───────────────────────────────────────────────────────

function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const badge = getCategoryBadge(notification.category)

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id)
    }
  }

  const content = (
    <GlassCard
      variant={notification.read ? 'subtle' : 'default'}
      hover
      padding="md"
      className={`cursor-pointer ${!notification.read ? 'border-l-2 border-l-brand-accent' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-brand-primary/40 flex items-center justify-center text-xl shrink-0">
          {notification.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
              {badge.label}
            </span>
            <span className="text-gray-500 text-xs">{notification.timeAgo}</span>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse ml-auto shrink-0" />
            )}
          </div>

          <h4
            className={`text-sm font-semibold mb-1 ${notification.read ? 'text-gray-300' : 'text-white'}`}
          >
            {notification.title}
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed">{notification.description}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            {notification.link && (
              <Link
                href={notification.link}
                className="text-brand-accent text-xs font-semibold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View details
              </Link>
            )}
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkRead(notification.id)
                }}
                className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  )

  return content
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabKey }) {
  const messages: Record<TabKey, { icon: string; title: string; desc: string }> = {
    all: {
      icon: '🔔',
      title: 'No notifications yet',
      desc: 'When you receive matches, messages, or path updates, they will appear here.',
    },
    match: {
      icon: '🎯',
      title: 'No matches yet',
      desc: 'Complete your compass profile to start receiving match notifications.',
    },
    message: {
      icon: '💬',
      title: 'No messages yet',
      desc: 'Messages from Anchors and the community will appear here.',
    },
    path: {
      icon: '🛤️',
      title: 'No path updates',
      desc: 'Path notifications will appear when new opportunities match your interests.',
    },
  }

  const msg = messages[tab]

  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">{msg.icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{msg.title}</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">{msg.desc}</p>
      <Link
        href="/compass"
        className="inline-block bg-brand-accent text-black font-bold px-6 py-3 rounded-xl hover:bg-brand-accent/80 transition-colors text-sm"
      >
        Open Compass
      </Link>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { t } = useTranslation()
  const { identity } = useIdentity()
  const { data: session } = useSession()

  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const markOneRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const filtered =
    activeTab === 'all' ? notifications : notifications.filter((n) => n.category === activeTab)

  // Group by time
  const todayItems = filtered.filter(
    (n) => n.timeAgo.includes('minute') || n.timeAgo.includes('hour')
  )
  const thisWeekItems = filtered.filter(
    (n) => n.timeAgo.includes('day') && !n.timeAgo.includes('week')
  )
  const earlierItems = filtered.filter((n) => n.timeAgo.includes('week'))

  const displayName = session?.user?.name || 'Pioneer'

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <SectionLayout size="sm" maxWidth="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-brand-accent text-sm mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-brand-accent border border-brand-accent/30 px-4 py-2 rounded-lg hover:bg-brand-accent/10 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10 pb-0">
          {TABS.map((tab) => {
            const count =
              tab.key === 'all'
                ? notifications.length
                : notifications.filter((n) => n.category === tab.key).length
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'text-brand-accent border-brand-accent bg-brand-surface/50'
                    : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-white/20'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center ${
                      activeTab === tab.key
                        ? 'bg-brand-accent/20 text-brand-accent'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="space-y-3">
            {todayItems.length > 0 && (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1 mt-2 mb-2">
                  Today
                </p>
                {todayItems.map((n) => (
                  <NotificationCard key={n.id} notification={n} onMarkRead={markOneRead} />
                ))}
              </>
            )}

            {thisWeekItems.length > 0 && (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1 mt-6 mb-2">
                  This Week
                </p>
                {thisWeekItems.map((n) => (
                  <NotificationCard key={n.id} notification={n} onMarkRead={markOneRead} />
                ))}
              </>
            )}

            {earlierItems.length > 0 && (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1 mt-6 mb-2">
                  Earlier
                </p>
                {earlierItems.map((n) => (
                  <NotificationCard key={n.id} notification={n} onMarkRead={markOneRead} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            Manage your notification preferences in{' '}
            <Link href="/profile" className="text-brand-accent hover:underline">
              profile settings
            </Link>
          </p>
        </div>
      </SectionLayout>
    </div>
  )
}

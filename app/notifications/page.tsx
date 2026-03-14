'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'MESSAGE' | 'MATCH' | 'REVIEW' | 'PAYMENT' | 'SYSTEM'
  title: string
  body: string | null
  link: string | null
  read: boolean
  createdAt: string
}

const TYPE_ICONS: Record<string, string> = {
  MESSAGE: '💬',
  MATCH: '🤝',
  REVIEW: '⭐',
  PAYMENT: '💳',
  SYSTEM: '🔔',
}

const TYPE_LABELS: Record<string, string> = {
  MESSAGE: 'Messages',
  MATCH: 'Matches',
  REVIEW: 'Reviews',
  PAYMENT: 'Payments',
  SYSTEM: 'System',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=50')
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') loadNotifications()
  }, [status, loadNotifications])

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  async function markRead(id: string) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    })
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  const filtered = filter ? notifications.filter((n) => n.type === filter) : notifications
  const types = Array.from(new Set(notifications.map((n) => n.type)))

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted text-sm">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-semibold text-brand-accent">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-xs font-bold text-brand-accent">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-brand-text-muted hover:text-brand-accent transition"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      {types.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-white/5 px-4 py-2 sm:px-6">
          <button
            onClick={() => setFilter(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              !filter
                ? 'bg-brand-accent/20 text-brand-accent'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type === filter ? null : type)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filter === type
                  ? 'bg-brand-accent/20 text-brand-accent'
                  : 'text-brand-text-muted hover:text-brand-text'
              }`}
            >
              {TYPE_ICONS[type]} {TYPE_LABELS[type] ?? type}
            </button>
          ))}
        </div>
      )}

      {/* Notification list */}
      <div className="mx-auto max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-brand-text-muted">Loading notifications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-3xl">🔔</p>
            <p className="mt-3 text-sm font-medium text-brand-text">No notifications yet</p>
            <p className="mt-1 text-xs text-brand-text-muted">
              You&apos;ll see messages, matches, and reviews here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((notif) => {
              const inner = (
                <div
                  className={`flex items-start gap-3 px-4 py-4 sm:px-6 transition ${
                    !notif.read ? 'bg-brand-accent/5' : ''
                  } hover:bg-brand-surface/40`}
                >
                  <span className="mt-0.5 text-lg flex-shrink-0">
                    {TYPE_ICONS[notif.type] ?? '🔔'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${!notif.read ? 'font-semibold text-brand-text' : 'text-brand-text-muted'}`}
                    >
                      {notif.title}
                    </p>
                    {notif.body && (
                      <p className="mt-0.5 text-xs text-brand-text-muted line-clamp-2">
                        {notif.body}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-brand-text-muted/60">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-accent" />
                  )}
                </div>
              )

              return (
                <li key={notif.id}>
                  {notif.link ? (
                    <Link
                      href={notif.link}
                      onClick={() => !notif.read && markRead(notif.id)}
                      className="block"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      onClick={() => !notif.read && markRead(notif.id)}
                      className="w-full text-left"
                    >
                      {inner}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

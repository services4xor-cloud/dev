'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Prefs {
  email: boolean
  push: boolean
  messages: boolean
  matches: boolean
  marketing: boolean
}

const PREF_LABELS: { key: keyof Prefs; label: string; detail: string }[] = [
  { key: 'email', label: 'Email Notifications', detail: 'Receive updates via email' },
  { key: 'push', label: 'Push Notifications', detail: 'Browser push notifications (coming soon)' },
  { key: 'messages', label: 'Message Alerts', detail: 'Notify when you receive new messages' },
  { key: 'matches', label: 'Match Alerts', detail: 'Notify when new corridors match your profile' },
  { key: 'marketing', label: 'Marketing', detail: 'Product updates and community highlights' },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/notifications/preferences')
      .then((r) => r.json())
      .then(setPrefs)
      .catch(() => {})
  }, [session])

  const toggle = async (key: keyof Prefs) => {
    if (!prefs) return
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    setSaving(true)
    try {
      await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: updated[key] }),
      })
    } catch {
      /* ignore */
    }
    setSaving(false)
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted">Please sign in to view settings.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <header className="border-b border-brand-accent/20 bg-brand-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold text-brand-accent hover:opacity-80 transition-opacity"
          >
            Be[X]
          </Link>
          <Link
            href="/me"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors"
          >
            ← Back to Profile
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold text-brand-text">Settings</h1>
        <p className="mt-2 text-sm text-brand-text-muted">Manage your notification preferences</p>

        <div className="mt-8 space-y-4">
          {PREF_LABELS.map(({ key, label, detail }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-brand-accent/20 bg-brand-surface p-4"
            >
              <div>
                <p className="font-medium text-brand-text">{label}</p>
                <p className="text-xs text-brand-text-muted">{detail}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                disabled={!prefs || saving}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  prefs?.[key]
                    ? 'bg-brand-accent'
                    : 'bg-brand-surface border border-brand-accent/30'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    prefs?.[key] ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {saving && <p className="mt-4 text-xs text-brand-text-muted">Saving...</p>}
      </main>
    </div>
  )
}

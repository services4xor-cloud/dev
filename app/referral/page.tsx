'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ReferralStats {
  code: string
  link: string
  totalReferred: number
  totalJoined: number
}

export default function ReferralPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/referral')
      .then((r) => r.json())
      .then((data: ReferralStats) => setStats(data))
      .catch(() => setError('Failed to load referral data.'))
      .finally(() => setLoading(false))
  }, [status])

  const copyLink = async () => {
    if (!stats?.link) return
    try {
      await navigator.clipboard.writeText(stats.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted text-sm animate-pulse">Loading…</p>
      </div>
    )
  }

  if (!session) return null

  return (
    <main className="min-h-screen bg-brand-bg px-4 py-10">
      {/* Header */}
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-xs text-brand-text-muted hover:text-brand-accent transition">
          ← Back to Map
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-brand-accent">Refer Explorers</h1>
        <p className="mt-1 text-sm text-brand-text-muted">
          Invite others to join the Be[X] network. Share your unique link.
        </p>
      </div>

      {error && (
        <div className="mx-auto mt-4 max-w-lg rounded-lg border border-red-800/40 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {stats && (
        <div className="mx-auto mt-8 max-w-lg space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-brand-surface border border-brand-accent/10 p-5 text-center">
              <p className="text-3xl font-bold text-brand-accent">{stats.totalReferred}</p>
              <p className="mt-1 text-xs text-brand-text-muted">Explorers Referred</p>
            </div>
            <div className="rounded-xl bg-brand-surface border border-brand-accent/10 p-5 text-center">
              <p className="text-3xl font-bold text-brand-accent">{stats.totalJoined}</p>
              <p className="mt-1 text-xs text-brand-text-muted">Joined the Network</p>
            </div>
          </div>

          {/* Referral code */}
          <div className="rounded-xl bg-brand-surface border border-brand-accent/10 p-5 space-y-3">
            <p className="text-xs text-brand-text-muted uppercase tracking-widest">Your Code</p>
            <p className="text-xl font-mono font-bold text-brand-accent tracking-widest">
              {stats.code}
            </p>
          </div>

          {/* Share section */}
          <div className="rounded-xl bg-brand-surface border border-brand-accent/10 p-5 space-y-3">
            <p className="text-xs text-brand-text-muted uppercase tracking-widest">Your Link</p>
            <div className="flex items-center gap-2 rounded-lg bg-brand-bg border border-brand-accent/10 px-3 py-2">
              <span className="flex-1 truncate text-xs text-brand-text-muted font-mono">
                {stats.link}
              </span>
            </div>
            <button
              onClick={copyLink}
              className="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-medium text-brand-accent transition hover:opacity-90"
            >
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* How it works */}
          <div className="rounded-xl bg-brand-surface border border-brand-accent/10 p-5 space-y-3">
            <p className="text-xs text-brand-text-muted uppercase tracking-widest">How it works</p>
            <ol className="space-y-2 text-sm text-brand-text-muted list-decimal list-inside">
              <li>Share your unique link with an Explorer</li>
              <li>They sign up using your link</li>
              <li>They join the Be[X] network — your count grows</li>
            </ol>
          </div>
        </div>
      )}

      {/* Toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-6 py-2 text-sm font-medium text-brand-accent shadow-lg">
          Link copied to clipboard
        </div>
      )}
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { KIND_LABELS, type OpportunityKind } from '@/lib/opportunities'

interface MyExchange {
  id: string
  status: string
  createdAt: string
  opportunity: { id: string; label: string; icon: string | null; kind: OpportunityKind }
  host: string | null
  accessUrl?: string
}

const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: {
    label: 'Waiting for the host',
    cls: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  },
  ACCEPTED: { label: 'Confirmed', cls: 'border-green-500/30 bg-green-500/10 text-green-400' },
  REJECTED: { label: 'Declined', cls: 'border-red-500/30 bg-red-500/10 text-red-400' },
}

/** Explorer's bookings (Exchanges) with access links once confirmed. */
export default function BookingsPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<MyExchange[] | null>(null)
  const role = (session?.user as { role?: string } | undefined)?.role

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/exchanges?role=explorer')
      .then((r) => (r.ok ? (r.json() as Promise<MyExchange[]>) : []))
      .then(setItems)
      .catch(() => setItems([]))
  }, [status])

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <a href="/login?callbackUrl=/bookings" className="text-brand-accent hover:underline">
          Sign in to see your bookings
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-xl font-bold text-brand-accent">My bookings</h1>
          <div className="flex gap-4 text-sm">
            {(role === 'HOST' || role === 'ADMIN') && (
              <Link
                href="/host"
                className="text-brand-text-muted transition hover:text-brand-accent"
              >
                Requests for my listings
              </Link>
            )}
            <a href="/" className="text-brand-text-muted transition hover:text-brand-accent">
              &larr; Map
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">
        {items === null ? (
          <p className="text-sm text-brand-text-muted">Loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-brand-surface px-8 py-12 text-center">
            <p className="text-brand-text-muted">No bookings yet.</p>
            <Link
              href="/opportunities"
              className="mt-2 inline-block text-sm text-brand-accent hover:underline"
            >
              Find a journey or service →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-brand-surface">
            {items.map((x) => {
              const st = STATUS[x.status] ?? STATUS.PENDING
              return (
                <div key={x.id} className="flex flex-wrap items-center gap-3 px-4 py-4">
                  <span className="text-2xl">{x.opportunity.icon}</span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/exchange/${x.opportunity.id}`}
                      className="font-medium text-brand-text hover:text-brand-accent"
                    >
                      {x.opportunity.label}
                    </Link>
                    <p className="text-xs text-brand-text-muted">
                      {KIND_LABELS[x.opportunity.kind]}
                      {x.host ? ` · ${x.host}` : ''} · {new Date(x.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded border px-2 py-0.5 text-xs ${st.cls}`}>{st.label}</span>
                  {x.accessUrl && (
                    <a
                      href={x.accessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-brand-accent hover:opacity-90"
                    >
                      Open →
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
        <p className="mt-6 text-xs text-brand-text-muted">
          Hosts confirm each request. For services like social media automation, your access link
          appears here once you are confirmed.
        </p>
      </main>
    </div>
  )
}

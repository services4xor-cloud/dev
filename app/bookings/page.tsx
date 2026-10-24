'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
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
      <PageShell eyebrow="Bookings" title="Your bookings">
        <a href="/login?callbackUrl=/bookings" className="btn btn-primary">
          Sign in to see your bookings
        </a>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Bookings"
      title="Your bookings"
      intro="Every journey and service you asked for, and where each one stands."
    >
      {(role === 'HOST' || role === 'ADMIN') && (
        <p className="-mt-4 mb-6 text-sm">
          <Link href="/host" className="text-brand-accent hover:underline">
            See requests for your listings
          </Link>
        </p>
      )}
      {items === null ? (
        <p className="text-sm text-brand-text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card px-8 py-12 text-center">
          <p className="text-brand-text-muted">No bookings yet.</p>
          <Link
            href="/opportunities"
            className="mt-2 inline-block text-sm text-brand-accent hover:underline"
          >
            Find a journey or service
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-brand-line">
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
                    className="btn btn-primary btn-sm"
                  >
                    Open
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
    </PageShell>
  )
}

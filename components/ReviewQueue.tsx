'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPrice, KIND_LABELS, type OpportunityDTO } from '@/lib/opportunities'

/** Admin: listings from Hosts waiting to be published on the map. */
export default function ReviewQueue() {
  const [items, setItems] = useState<OpportunityDTO[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/opportunities?review=1')
      .then((r) => (r.ok ? (r.json() as Promise<OpportunityDTO[]>) : []))
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  async function decide(id: string, status: 'PUBLISHED' | 'ARCHIVED') {
    setBusy(id)
    const res = await fetch(`/api/opportunities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setItems((prev) => prev?.filter((o) => o.id !== id) ?? null)
    setBusy(null)
  }

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-text-muted">
        Listings to review {items?.length ? `(${items.length})` : ''}
      </h2>
      {items === null ? (
        <div className="h-16 animate-pulse rounded-lg border border-brand-accent/10 bg-brand-surface" />
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-brand-accent/20 bg-brand-surface p-5 text-sm text-brand-text-muted">
          Nothing waiting. New listings from Hosts show up here before they go on the map.
        </p>
      ) : (
        <div className="divide-y divide-white/5 rounded-lg border border-brand-accent/20 bg-brand-surface">
          {items.map((o) => (
            <div key={o.id} className="flex flex-wrap items-start gap-4 p-4">
              <span className="text-2xl">{o.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-brand-text">{o.label}</p>
                <p className="text-xs text-brand-text-muted">
                  {KIND_LABELS[o.properties.kind]} · {o.host?.label ?? 'Unknown host'} ·{' '}
                  {formatPrice(o.properties) ?? 'Price on request'}
                </p>
                <p className="mt-2 line-clamp-3 text-xs text-brand-text-muted/80">
                  {o.properties.description}
                </p>
                {(o.properties.demoUrl || o.accessUrl) && (
                  <p className="mt-1 break-all text-xs text-brand-text-muted">
                    Links: {[o.properties.demoUrl, o.accessUrl].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/opportunities/${o.id}/edit`}
                  className="rounded border border-white/10 px-3 py-1 text-xs text-brand-text-muted hover:text-brand-accent"
                >
                  Edit
                </Link>
                <button
                  disabled={busy === o.id}
                  onClick={() => void decide(o.id, 'PUBLISHED')}
                  className="rounded border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400 hover:bg-green-500/20 disabled:opacity-40"
                >
                  Publish
                </button>
                <button
                  disabled={busy === o.id}
                  onClick={() => void decide(o.id, 'ARCHIVED')}
                  className="rounded border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20 disabled:opacity-40"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

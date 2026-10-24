'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ApplyButton from '@/components/ApplyButton'
import { formatPrice, type OpportunityDTO } from '@/lib/opportunities'
import { getSelected, SELECTION_EVENT, setSelected } from '@/lib/selection'

/** The listings picked for the agent, each with remove and Book. */
export default function SelectedOpportunities({ onChange }: { onChange: (ids: string[]) => void }) {
  const [items, setItems] = useState<OpportunityDTO[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const ids = getSelected()
      onChange(ids)
      if (!ids.length) {
        setItems([])
        return
      }
      const res = await fetch('/api/opportunities').catch(() => null)
      const all = res?.ok ? ((await res.json()) as OpportunityDTO[]) : []
      if (!cancelled) setItems(all.filter((o) => ids.includes(o.id)))
    }
    void load()
    window.addEventListener(SELECTION_EVENT, load)
    return () => {
      cancelled = true
      window.removeEventListener(SELECTION_EVENT, load)
    }
  }, [onChange])

  if (!items.length) {
    return (
      <p className="mb-3 text-xs text-brand-text-muted">
        Tip: pick journeys or services on the{' '}
        <Link href="/" className="text-brand-accent hover:underline">
          map
        </Link>{' '}
        or in{' '}
        <Link href="/opportunities" className="text-brand-accent hover:underline">
          Opportunities
        </Link>{' '}
        with &ldquo;Ask agent&rdquo;, and the agent will advise on exactly those.
      </p>
    )
  }

  return (
    <div className="mb-3 space-y-2">
      <p className="text-xs uppercase tracking-wide text-brand-text-muted">Asking about</p>
      {items.map((o) => (
        <div
          key={o.id}
          className="flex flex-wrap items-center gap-2 rounded-lg border border-brand-accent/20 bg-brand-surface px-3 py-2"
        >
          <span>{o.icon}</span>
          <Link
            href={`/exchange/${o.id}`}
            className="min-w-0 flex-1 truncate text-sm text-brand-text hover:text-brand-accent"
          >
            {o.label}
          </Link>
          <span className="text-xs text-brand-text-muted">
            {formatPrice(o.properties) ?? 'On request'}
          </span>
          <ApplyButton opportunityId={o.id} label="Book" compact />
          <button
            onClick={() => setSelected(getSelected().filter((id) => id !== o.id))}
            aria-label={`Remove ${o.label}`}
            className="px-1 text-brand-text-muted hover:text-red-400"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

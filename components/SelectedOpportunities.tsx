'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import KindDot from '@/components/map/KindDot'
import { formatPrice, KIND_LABELS, type OpportunityDTO } from '@/lib/opportunities'
import { getSelected, SELECTION_EVENT, setSelected } from '@/lib/selection'

/** The offerings picked for the agent, each with a remove button. */
export default function SelectedOpportunities({
  onChange,
}: {
  onChange: (items: OpportunityDTO[]) => void
}) {
  const [items, setItems] = useState<OpportunityDTO[] | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const ids = getSelected()
      if (!ids.length) {
        setItems([])
        onChange([])
        return
      }
      const res = await fetch('/api/opportunities').catch(() => null)
      const all = res?.ok ? ((await res.json()) as OpportunityDTO[]) : []
      const picked = all.filter((o) => ids.includes(o.id))
      if (!cancelled) {
        setItems(picked)
        onChange(picked)
      }
    }
    void load()
    window.addEventListener(SELECTION_EVENT, load)
    return () => {
      cancelled = true
      window.removeEventListener(SELECTION_EVENT, load)
    }
  }, [onChange])

  if (items === null) return <div className="h-16 animate-pulse rounded-lg bg-brand-surface-2" />
  if (!items.length)
    return (
      <p className="text-sm text-brand-text-muted">
        None yet. Open an offering on the{' '}
        <Link href="/map" className="text-brand-accent hover:underline">
          map
        </Link>{' '}
        and press &ldquo;Ask agent&rdquo;.
      </p>
    )

  return (
    <ul className="grid gap-2">
      {items.map((o) => (
        <li
          key={o.id}
          className="flex items-start gap-2.5 rounded-lg border border-brand-line bg-brand-surface-2 px-3 py-2.5"
        >
          <span className="mt-1.5">
            <KindDot kind={o.properties.kind} />
          </span>
          <span className="min-w-0 flex-1">
            <Link
              href={`/exchange/${o.id}`}
              className="block text-sm font-medium leading-snug text-brand-text hover:text-brand-accent"
            >
              {o.label}
            </Link>
            <span className="text-xs text-brand-text-muted">
              {KIND_LABELS[o.properties.kind]} · {formatPrice(o.properties) ?? 'On request'}
            </span>
          </span>
          <button
            onClick={() => setSelected(getSelected().filter((id) => id !== o.id))}
            aria-label={`Remove ${o.label}`}
            className="px-1 text-lg leading-none text-brand-text-muted hover:text-brand-text"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

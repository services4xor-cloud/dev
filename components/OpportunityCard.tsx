'use client'

import Link from 'next/link'
import ApplyButton from '@/components/ApplyButton'
import { formatPrice, KIND_LABELS, type OpportunityDTO } from '@/lib/opportunities'

interface OpportunityCardProps {
  opp: OpportunityDTO
  selected: boolean
  onToggleSelect: (id: string) => void
  /** Hide booking for the Host's own listing */
  isOwn?: boolean
}

/** One Opportunity: type, price, place, plus "Ask agent" and "Book". */
export default function OpportunityCard({
  opp,
  selected,
  onToggleSelect,
  isOwn,
}: OpportunityCardProps) {
  const p = opp.properties
  const price = formatPrice(p)
  return (
    <div
      className={`flex flex-col rounded-xl border bg-brand-surface p-5 transition ${
        selected ? 'border-brand-accent/60' : 'border-white/10 hover:border-brand-accent/30'
      }`}
    >
      <Link href={`/exchange/${opp.id}`} className="group mb-3 flex items-start gap-3">
        <span className="text-2xl">{opp.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-accent/70">
            {KIND_LABELS[p.kind]}
          </div>
          <h3 className="font-semibold text-brand-text transition group-hover:text-brand-accent">
            {opp.label}
          </h3>
          {opp.host && (
            <p className="mt-0.5 text-xs text-brand-text-muted">
              {opp.host.icon} {opp.host.label}
            </p>
          )}
        </div>
      </Link>

      <div className="space-y-1 text-xs text-brand-text-muted">
        {p.location && <div>📍 {p.location}</div>}
        {(p.startsOn || p.endsOn) && (
          <div>
            📅 {p.startsOn ?? '…'} – {p.endsOn ?? '…'}
          </div>
        )}
        <div className="font-medium text-brand-text">{price ?? 'Price on request'}</div>
      </div>

      {p.description && (
        <p className="mt-3 line-clamp-3 text-xs text-brand-text-muted/80">{p.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => onToggleSelect(opp.id)}
          aria-pressed={selected}
          className={`rounded-lg border px-3 py-1.5 text-xs transition ${
            selected
              ? 'border-brand-accent/60 bg-brand-accent/15 text-brand-accent'
              : 'border-white/10 text-brand-text-muted hover:border-brand-accent/30 hover:text-brand-accent'
          }`}
        >
          {selected ? '✓ Selected for agent' : '+ Ask agent'}
        </button>
        {!isOwn && <ApplyButton opportunityId={opp.id} label="Book" compact />}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import ApplyButton from '@/components/ApplyButton'
import ContactButton from '@/components/ContactButton'
import KindDot from '@/components/map/KindDot'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import {
  formatPrice,
  KIND_LABELS,
  projectLinkLabel,
  type OpportunityDTO,
} from '@/lib/opportunities'

interface OpportunityCardProps {
  opp: OpportunityDTO
  selected: boolean
  onToggleSelect: (id: string) => void
  /** Hide booking for the Host's own listing */
  isOwn?: boolean
  /** On the map: show the listing's country in the panel */
  onShowCountry?: () => void
}

/** One offering: what it is, who offers it, price and place, then book, contact or ask the agent. */
export default function OpportunityCard({
  opp,
  selected,
  onToggleSelect,
  isOwn,
  onShowCountry,
}: OpportunityCardProps) {
  const p = opp.properties
  const price = formatPrice(p)
  const country = p.countryCode ? COUNTRY_OPTIONS.find((c) => c.code === p.countryCode) : null
  const place =
    p.location && country && p.location.includes(country.name)
      ? p.location
      : [p.location, country?.name].filter(Boolean).join(', ')

  return (
    <article
      className={`card flex h-full flex-col p-5 ${selected ? 'ring-1 ring-brand-accent/60' : ''}`}
    >
      <p className="flex items-center gap-2 pr-8 text-[0.78rem] text-brand-text-muted">
        <KindDot kind={p.kind} />
        {KIND_LABELS[p.kind]}
        {p.sector && <span>· {p.sector}</span>}
      </p>
      <h3 className="mt-2 font-display text-[1.35rem] font-medium leading-snug text-brand-text">
        <Link href={`/exchange/${opp.id}`} className="hover:text-brand-accent">
          {opp.label}
        </Link>
      </h3>
      {opp.host && <p className="mt-1 text-sm text-brand-text-muted">by {opp.host.label}</p>}

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[0.72rem] text-brand-text-muted">Price</dt>
          <dd className="font-semibold text-brand-text">{price ?? 'On request'}</dd>
        </div>
        {place && (
          <div>
            <dt className="text-[0.72rem] text-brand-text-muted">Where</dt>
            <dd className="text-brand-text">
              {onShowCountry && country ? (
                <button
                  onClick={onShowCountry}
                  className="text-left hover:text-brand-accent hover:underline"
                >
                  {country.flag} {place}
                </button>
              ) : (
                <>
                  {country?.flag} {place}
                </>
              )}
            </dd>
          </div>
        )}
        {(p.startsOn || p.endsOn) && (
          <div>
            <dt className="text-[0.72rem] text-brand-text-muted">Dates</dt>
            <dd className="text-brand-text">
              {p.startsOn ?? '…'} to {p.endsOn ?? '…'}
            </dd>
          </div>
        )}
        {p.capacity ? (
          <div>
            <dt className="text-[0.72rem] text-brand-text-muted">Places</dt>
            <dd className="text-brand-text">{p.capacity}</dd>
          </div>
        ) : null}
      </dl>

      {p.description && (
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-brand-text/80">
          {p.description}
        </p>
      )}

      {(p.demoUrl || opp.contactEmail) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {p.demoUrl && (
            <a
              href={p.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-accent hover:underline"
            >
              {projectLinkLabel(p.demoUrl)}
            </a>
          )}
          {opp.contactEmail && (
            <a href={`mailto:${opp.contactEmail}`} className="text-brand-accent hover:underline">
              {opp.contactEmail}
            </a>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        {!isOwn && <ApplyButton opportunityId={opp.id} label="Book" compact />}
        {!isOwn && <ContactButton opportunityId={opp.id} compact />}
        <button
          onClick={() => onToggleSelect(opp.id)}
          aria-pressed={selected}
          className={`btn btn-sm ${selected ? 'border-brand-accent bg-brand-accent/15' : ''}`}
        >
          {selected ? '✓ In agent' : 'Ask agent'}
        </button>
        {isOwn && (
          <Link href={`/opportunities/${opp.id}/edit`} className="btn btn-sm">
            Edit
          </Link>
        )}
      </div>
    </article>
  )
}

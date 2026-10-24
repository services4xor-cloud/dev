'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import OpportunityCard from '@/components/OpportunityCard'
import KindDot from '@/components/map/KindDot'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import {
  KIND_LABELS,
  OPPORTUNITY_KINDS,
  type OpportunityDTO,
  type OpportunityKind,
} from '@/lib/opportunities'
import { getSelected, SELECTION_EVENT, toggleSelected } from '@/lib/selection'

const COUNTRY = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: 'border-brand-accent/40 bg-brand-accent/10 text-brand-accent',
  IN_REVIEW: 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold',
  ARCHIVED: 'border-brand-line bg-white/5 text-brand-text-muted',
}
const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Live',
  IN_REVIEW: 'In review',
  ARCHIVED: 'Archived',
}

export default function OpportunitiesPage() {
  const { data: session } = useSession()
  const user = session?.user as { id?: string; role?: string } | undefined
  const [all, setAll] = useState<OpportunityDTO[] | null>(null)
  const [mine, setMine] = useState<OpportunityDTO[]>([])
  const [kind, setKind] = useState<OpportunityKind | null>(null)
  const [country, setCountry] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelectedIds] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSelectedIds(getSelected())
    setSubmitted(new URLSearchParams(window.location.search).has('submitted'))
    const sync = () => setSelectedIds(getSelected())
    window.addEventListener(SELECTION_EVENT, sync)
    fetch('/api/opportunities')
      .then((r) => (r.ok ? (r.json() as Promise<OpportunityDTO[]>) : []))
      .catch(() => [] as OpportunityDTO[])
      .then(setAll)
    return () => window.removeEventListener(SELECTION_EVENT, sync)
  }, [])

  useEffect(() => {
    if (!user?.id) return
    fetch('/api/opportunities?mine=1')
      .then((r) => (r.ok ? (r.json() as Promise<OpportunityDTO[]>) : []))
      .then(setMine)
      .catch(() => {})
  }, [user?.id])

  const list = useMemo(() => all ?? [], [all])
  const countries = useMemo(
    () =>
      Array.from(new Set(list.map((o) => o.properties.countryCode).filter(Boolean) as string[]))
        .map((c) => COUNTRY.get(c))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [list]
  )
  const q = query.trim().toLowerCase()
  const shown = list.filter((o) => {
    const p = o.properties
    if (kind && p.kind !== kind) return false
    if (country && p.countryCode !== country) return false
    if (!q) return true
    return [o.label, p.description, p.location, p.sector, o.host?.label].some((v) =>
      v?.toLowerCase().includes(q)
    )
  })
  const kinds = OPPORTUNITY_KINDS.filter((k) => list.some((o) => o.properties.kind === k))

  return (
    <PageShell
      eyebrow="Offerings"
      title="Journeys, services and automations"
      intro="Everything listed on Be[X], from Hosts around the world. Book, write to the Host, or pick a few and ask the agent."
    >
      {submitted && (
        <p className="mb-6 rounded-lg border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-text">
          Thanks. Your offering is in review and goes on the map once it is approved.
        </p>
      )}

      {user && (
        <section id="yours" className="mb-12 scroll-mt-24">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-brand-text">Your listings</h2>
            <Link href="/opportunities/new" className="btn btn-primary btn-sm">
              List an offering
            </Link>
          </div>
          {mine.length ? (
            <ul className="card divide-y divide-brand-line">
              {mine.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <KindDot kind={o.properties.kind} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-brand-text">{o.label}</p>
                    <p className="text-xs text-brand-text-muted">
                      {KIND_LABELS[o.properties.kind]}
                      {o.host && !o.host.userId ? ` · ${o.host.label}` : ''}
                    </p>
                  </div>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs ${STATUS_STYLES[o.properties.status]}`}
                  >
                    {STATUS_LABELS[o.properties.status]}
                  </span>
                  {o.properties.status === 'PUBLISHED' && (
                    <Link
                      href={`/map?select=${encodeURIComponent(o.code || o.id)}`}
                      className="text-sm text-brand-text-muted hover:text-brand-accent"
                    >
                      On the map
                    </Link>
                  )}
                  <Link
                    href={`/opportunities/${o.id}/edit`}
                    className="text-sm font-medium text-brand-accent hover:underline"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brand-text-muted">
              You have not listed anything yet.{' '}
              <Link href="/opportunities/new" className="text-brand-accent hover:underline">
                List your first offering
              </Link>
            </p>
          )}
        </section>
      )}

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Type of offering">
          {[null, ...kinds].map((k) => (
            <button
              key={k ?? 'all'}
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition ${
                kind === k
                  ? 'border-brand-accent bg-brand-accent/15 text-brand-text'
                  : 'border-brand-line text-brand-text-muted hover:text-brand-text'
              }`}
            >
              {k && <KindDot kind={k} />}
              {k ? `${KIND_LABELS[k]}s` : 'All'}
            </button>
          ))}
        </div>
        <div className="flex gap-2 lg:ml-auto">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Country"
            className="input w-44 text-sm"
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search offerings"
            className="input w-48 text-sm"
          />
        </div>
      </div>

      {all === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-[10px] bg-brand-surface" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="card px-6 py-12 text-center">
          <p className="text-brand-text-muted">
            {list.length ? 'Nothing matches these filters.' : 'No offerings yet.'}
          </p>
          {list.length > 0 && (
            <button
              onClick={() => {
                setKind(null)
                setCountry('')
                setQuery('')
              }}
              className="mt-3 text-sm text-brand-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((o) => (
            <OpportunityCard
              key={o.id}
              opp={o}
              selected={selected.includes(o.id)}
              onToggleSelect={(id) => setSelectedIds(toggleSelected(id))}
              isOwn={!!user?.id && o.host?.userId === user.id}
            />
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="sticky bottom-4 mt-8 flex justify-center">
          <Link href="/agent" className="btn btn-primary shadow-2xl">
            Ask the agent about {selected.length} {selected.length === 1 ? 'offering' : 'offerings'}
          </Link>
        </div>
      )}
    </PageShell>
  )
}

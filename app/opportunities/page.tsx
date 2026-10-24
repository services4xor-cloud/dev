'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import DimensionOverlapBar from '@/components/DimensionOverlapBar'
import OpportunityCard from '@/components/OpportunityCard'
import OpportunityForm, { emptyOpportunityForm } from '@/components/OpportunityForm'
import {
  KIND_LABELS,
  OPPORTUNITY_KINDS,
  type OpportunityDTO,
  type OpportunityKind,
} from '@/lib/opportunities'
import { getSelected, SELECTION_EVENT, toggleSelected } from '@/lib/selection'

/** Greeting in user's browser language */
const GREETINGS: Record<string, string> = {
  en: 'Hello',
  de: 'Hallo',
  fr: 'Bonjour',
  es: 'Hola',
  pt: 'Olá',
  it: 'Ciao',
  nl: 'Hallo',
  pl: 'Cześć',
  ru: 'Привет',
  uk: 'Привіт',
  ja: 'こんにちは',
  ko: '안녕하세요',
  zh: '你好',
  ar: 'مرحبا',
  hi: 'नमस्ते',
  sw: 'Habari',
  tr: 'Merhaba',
  th: 'สวัสดี',
  vi: 'Xin chào',
  id: 'Halo',
  ms: 'Halo',
  ro: 'Bună',
  cs: 'Ahoj',
  hu: 'Szia',
  sv: 'Hej',
  no: 'Hei',
  da: 'Hej',
  fi: 'Hei',
  el: 'Γεια σου',
  he: 'שלום',
  bn: 'হ্যালো',
  ta: 'வணக்கம்',
  te: 'హలో',
  fa: 'سلام',
}

function getBrowserGreeting(): string {
  if (typeof navigator === 'undefined') return GREETINGS.en
  const lang = navigator.language?.slice(0, 2)?.toLowerCase()
  return GREETINGS[lang] ?? GREETINGS.en
}

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: 'border-green-500/30 bg-green-500/10 text-green-400',
  IN_REVIEW: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  ARCHIVED: 'border-white/10 bg-white/5 text-brand-text-muted',
}
const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Live',
  IN_REVIEW: 'Waiting for review',
  ARCHIVED: 'Archived',
}

export default function OpportunitiesPage() {
  const { data: session } = useSession()
  const [opportunities, setOpportunities] = useState<OpportunityDTO[]>([])
  const [mine, setMine] = useState<OpportunityDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [focusedValue, setFocusedValue] = useState<string | null>(null)
  const [filterSector, setFilterSector] = useState<string | null>(null)
  const [filterKind, setFilterKind] = useState<OpportunityKind | null>(null)
  const [selected, setSelectedIds] = useState<string[]>([])
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    setGreeting(getBrowserGreeting())
    setSelectedIds(getSelected())
    const sync = () => setSelectedIds(getSelected())
    window.addEventListener(SELECTION_EVENT, sync)
    return () => window.removeEventListener(SELECTION_EVENT, sync)
  }, [])

  const user = session?.user as { id?: string; role?: string } | undefined
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await fetch('/api/opportunities')
        if (res.ok) setOpportunities((await res.json()) as OpportunityDTO[])
      } catch {
        // silently fail — empty state shown
      } finally {
        setLoading(false)
      }
    }
    void fetchOpportunities()
  }, [])

  useEffect(() => {
    if (!user?.id) return
    fetch('/api/opportunities?mine=1')
      .then((r) => (r.ok ? (r.json() as Promise<OpportunityDTO[]>) : []))
      .then(setMine)
      .catch(() => {})
  }, [user?.id])

  // Dimension click → filter opportunities by matching sector
  const handleDimensionClick = useCallback(
    (dimension: string, value: string) => {
      const key = `${dimension}:${value}`
      if (focusedValue === key) {
        setFocusedValue(null)
        setFilterSector(null)
      } else {
        setFocusedValue(key)
        setFilterSector(dimension === 'sector' ? value : null)
      }
    },
    [focusedValue]
  )

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filterKind && opp.properties.kind !== filterKind) return false
    if (filterSector) {
      const sector = opp.properties.sector?.toLowerCase() ?? ''
      return sector.includes(filterSector.toLowerCase().replace(/-/g, ' '))
    }
    return true
  })

  async function create(body: Record<string, unknown>): Promise<string | null> {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json()) as OpportunityDTO & { error?: string }
    if (!res.ok) return data.error ?? 'Failed to create opportunity'
    setMine((prev) => [data, ...prev])
    if (data.properties.status === 'PUBLISHED') setOpportunities((prev) => [data, ...prev])
    setShowForm(false)
    setSuccess(
      data.properties.status === 'PUBLISHED'
        ? 'Published. It is now on the map.'
        : 'Saved. It goes on the map once an admin approves it.'
    )
    setTimeout(() => setSuccess(null), 5000)
    return null
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">{greeting} — Opportunities</h1>
            {user ? (
              <button
                onClick={() => setShowForm((v) => !v)}
                className="mt-1 text-sm text-brand-text-muted transition hover:text-brand-accent"
              >
                {showForm ? 'Cancel' : '+ List a journey, service or automation'}
              </button>
            ) : (
              <a
                href="/login?callbackUrl=/opportunities"
                className="mt-1 inline-block text-sm text-brand-text-muted transition hover:text-brand-accent"
              >
                Sign in to list your own
              </a>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            {selected.length > 0 && (
              <Link href="/agent" className="text-brand-accent hover:underline">
                Ask agent about {selected.length} →
              </Link>
            )}
            <a href="/" className="text-brand-text-muted transition hover:text-brand-accent">
              &larr; Map
            </a>
          </div>
        </div>
      </header>

      <DimensionOverlapBar onDimensionClick={handleDimensionClick} focusedValue={focusedValue} />

      <div className="mx-auto max-w-5xl px-6 py-8">
        {success && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {showForm && user && (
          <div className="mb-8">
            <OpportunityForm
              initial={emptyOpportunityForm()}
              submitLabel={isAdmin ? 'Publish' : 'Submit for review'}
              note={
                isAdmin
                  ? 'As an admin, your listing goes live right away.'
                  : 'An admin checks every new listing before it appears on the map.'
              }
              onSubmit={create}
            />
          </div>
        )}

        {mine.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
              Your listings
            </h2>
            <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-brand-surface">
              {mine.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="text-xl">{o.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brand-text">{o.label}</p>
                    <p className="text-xs text-brand-text-muted">
                      {KIND_LABELS[o.properties.kind]}
                    </p>
                  </div>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs ${STATUS_STYLES[o.properties.status]}`}
                  >
                    {STATUS_LABELS[o.properties.status]}
                  </span>
                  <Link
                    href={`/opportunities/${o.id}/edit`}
                    className="text-xs text-brand-accent hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mb-5 flex flex-wrap gap-2">
          {[null, ...OPPORTUNITY_KINDS].map((k) => (
            <button
              key={k ?? 'all'}
              onClick={() => setFilterKind(k)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                filterKind === k
                  ? 'border-brand-accent/60 bg-brand-accent/15 text-brand-accent'
                  : 'border-white/10 text-brand-text-muted hover:text-brand-accent'
              }`}
            >
              {k ? `${KIND_LABELS[k]}s` : 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-brand-text-muted">Loading opportunities…</div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-brand-surface px-8 py-16 text-center">
            <div className="mb-3 text-4xl">{'\u{1F30D}'}</div>
            <p className="text-brand-text-muted">
              {filterSector || filterKind
                ? 'Nothing matches this filter.'
                : 'No opportunities yet.'}
            </p>
            {(filterSector || filterKind) && (
              <button
                onClick={() => {
                  setFocusedValue(null)
                  setFilterSector(null)
                  setFilterKind(null)
                }}
                className="mt-2 text-sm text-brand-accent/70 transition hover:text-brand-accent"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                selected={selected.includes(opp.id)}
                onToggleSelect={(id) => setSelectedIds(toggleSelected(id))}
                isOwn={!!user?.id && opp.host?.userId === user.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

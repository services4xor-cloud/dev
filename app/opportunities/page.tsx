'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { ActiveFilter } from '@/components/DimensionFilters'

interface OpportunityHost {
  label: string
  icon: string
}

interface OpportunityProperties {
  description?: string
  location?: string
  sector?: string
}

interface Opportunity {
  id: string
  label: string
  icon: string
  properties: OpportunityProperties | null
  host: OpportunityHost | null
}

interface FormState {
  title: string
  description: string
  location: string
  sector: string
  icon: string
}

const emptyForm: FormState = {
  title: '',
  description: '',
  location: '',
  sector: '',
  icon: '',
}

export default function OpportunitiesPage() {
  const { data: session } = useSession()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [mapFilters, setMapFilters] = useState<ActiveFilter[]>([])

  // Load active filters from sessionStorage (set by map page)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bex-map-filters')
      if (raw) setMapFilters(JSON.parse(raw) as ActiveFilter[])
    } catch {
      // ignore
    }
  }, [])

  const role = (session?.user as { role?: string } | undefined)?.role
  const canPost = role === 'HOST' || role === 'ADMIN'

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await fetch('/api/opportunities')
        if (res.ok) {
          const data = (await res.json()) as Opportunity[]
          setOpportunities(data)
        }
      } catch {
        // silently fail — empty state shown
      } finally {
        setLoading(false)
      }
    }
    void fetchOpportunities()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = (await res.json()) as Opportunity & { error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Failed to post opportunity')
        return
      }

      setOpportunities((prev) => [data, ...prev])
      setForm(emptyForm)
      setShowForm(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header — matches agent page layout */}
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">Opportunities</h1>
            {canPost && (
              <button
                onClick={() => setShowForm((v) => !v)}
                className="mt-1 text-sm text-brand-text-muted transition hover:text-brand-accent"
              >
                {showForm ? 'Cancel' : '+ Post an Opportunity'}
              </button>
            )}
          </div>
          <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
            ← Map
          </a>
        </div>
      </header>

      {/* Active context bar — shows what dimensions the user selected on map */}
      {mapFilters.length > 0 && (
        <div className="border-b border-brand-accent/5 bg-brand-surface/50 px-6 py-2">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-brand-text-muted/50 self-center mr-1">
              Context:
            </span>
            {mapFilters.map((f) => (
              <span
                key={f.dimension}
                className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs text-brand-accent"
              >
                {f.icon ?? '◆'} {f.label ?? f.nodeCode}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Success banner */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            Opportunity posted successfully.
          </div>
        )}

        {/* Post Opportunity Form */}
        {showForm && canPost && (
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="mb-8 rounded-xl border border-white/10 bg-brand-surface p-6"
          >
            <h2 className="mb-5 text-lg font-semibold text-brand-accent">New Opportunity</h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-text-muted">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Swahili Cooking Masterclass"
                  className="w-full rounded-lg border border-white/10 bg-brand-bg px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted/50 outline-none focus:border-brand-accent/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-brand-text-muted">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  maxLength={1000}
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the opportunity..."
                  className="w-full rounded-lg border border-white/10 bg-brand-bg px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted/50 outline-none focus:border-brand-accent/40"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text-muted">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Nairobi, Kenya"
                    className="w-full rounded-lg border border-white/10 bg-brand-bg px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted/50 outline-none focus:border-brand-accent/40"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-text-muted">
                    Sector <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={form.sector}
                    onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                    placeholder="e.g. Hospitality"
                    className="w-full rounded-lg border border-white/10 bg-brand-bg px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted/50 outline-none focus:border-brand-accent/40"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-brand-text-muted">
                  Icon <span className="text-brand-text-muted/50">(optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="💼"
                  className="w-32 rounded-lg border border-white/10 bg-brand-bg px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted/50 outline-none focus:border-brand-accent/40"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-brand-accent transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Posting…' : 'Post Opportunity'}
              </button>
            </div>
          </form>
        )}

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-16 text-brand-text-muted">Loading opportunities…</div>
        ) : opportunities.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-brand-surface px-8 py-16 text-center">
            <div className="mb-3 text-4xl">🌍</div>
            <p className="text-brand-text-muted">No opportunities yet.</p>
            {canPost && (
              <p className="mt-1 text-sm text-brand-text-muted/70">
                Be the first to post one using the button above.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <Link
                key={opp.id}
                href={`/exchange/${opp.id}`}
                className="group rounded-xl border border-white/10 bg-brand-surface p-5 transition hover:border-brand-accent/30 hover:bg-brand-surface/80"
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="text-2xl">{opp.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-semibold text-brand-text group-hover:text-brand-accent transition">
                      {opp.label}
                    </h3>
                    {opp.host && (
                      <p className="mt-0.5 text-xs text-brand-text-muted">
                        {opp.host.icon} {opp.host.label}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {opp.properties?.sector && (
                    <div className="flex items-center gap-1.5 text-xs text-brand-text-muted">
                      <span className="text-brand-accent/70">◆</span>
                      {opp.properties.sector}
                    </div>
                  )}
                  {opp.properties?.location && (
                    <div className="flex items-center gap-1.5 text-xs text-brand-text-muted">
                      <span className="text-brand-accent/70">📍</span>
                      {opp.properties.location}
                    </div>
                  )}
                </div>

                {opp.properties?.description && (
                  <p className="mt-3 line-clamp-2 text-xs text-brand-text-muted/80">
                    {opp.properties.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

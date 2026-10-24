'use client'

import { useState } from 'react'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import {
  KIND_LABELS,
  OPPORTUNITY_KINDS,
  PRICE_UNIT_LABELS,
  PRICE_UNITS,
  type OpportunityDTO,
  type OpportunityKind,
  type PriceUnit,
} from '@/lib/opportunities'

const SORTED_COUNTRIES = [...COUNTRY_OPTIONS].sort((a, b) => a.name.localeCompare(b.name))

export interface OpportunityFormValues {
  title: string
  description: string
  kind: OpportunityKind
  countryCode: string
  location: string
  lat: string
  lng: string
  sector: string
  icon: string
  price: string
  currency: string
  priceUnit: PriceUnit
  capacity: string
  startsOn: string
  endsOn: string
  demoUrl: string
  accessUrl: string
  contactEmail: string
  contactPublic: boolean
}

export function emptyOpportunityForm(): OpportunityFormValues {
  return {
    title: '',
    description: '',
    kind: 'JOURNEY',
    countryCode: 'KE',
    location: '',
    lat: '',
    lng: '',
    sector: '',
    icon: '',
    price: '',
    currency: 'EUR',
    priceUnit: 'PERSON',
    capacity: '',
    startsOn: '',
    endsOn: '',
    demoUrl: '',
    accessUrl: '',
    contactEmail: '',
    contactPublic: false,
  }
}

export function formFromOpportunity(o: OpportunityDTO): OpportunityFormValues {
  const p = o.properties
  return {
    ...emptyOpportunityForm(),
    title: o.label,
    description: p.description ?? '',
    kind: p.kind,
    countryCode: p.countryCode ?? 'KE',
    location: p.location ?? '',
    lat: o.lat?.toString() ?? '',
    lng: o.lng?.toString() ?? '',
    sector: p.sector ?? '',
    icon: o.icon ?? '',
    price: p.price?.toString() ?? '',
    currency: p.currency ?? 'EUR',
    priceUnit: p.priceUnit ?? 'PERSON',
    capacity: p.capacity?.toString() ?? '',
    startsOn: p.startsOn ?? '',
    endsOn: p.endsOn ?? '',
    demoUrl: p.demoUrl ?? '',
    accessUrl: o.accessUrl ?? '',
    contactEmail: o.contactEmail ?? '',
    contactPublic: p.contactPublic ?? false,
  }
}

interface OpportunityFormProps {
  initial: OpportunityFormValues
  submitLabel: string
  /** Shown under the button, e.g. that listings are reviewed first */
  note?: string
  onSubmit: (body: Record<string, unknown>) => Promise<string | null>
}

/** Create / edit form for an Opportunity. onSubmit returns an error message or null. */
export default function OpportunityForm({
  initial,
  submitLabel,
  note,
  onSubmit,
}: OpportunityFormProps) {
  const [form, setForm] = useState(initial)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof OpportunityFormValues>(key: K, value: OpportunityFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const body: Record<string, unknown> = {
      title: form.title,
      description: form.description,
      kind: form.kind,
      countryCode: form.countryCode,
      location: form.location,
      sector: form.sector,
      icon: form.icon,
      price: form.price,
      currency: form.currency,
      priceUnit: form.priceUnit,
      capacity: form.capacity,
      startsOn: form.startsOn,
      endsOn: form.endsOn,
      demoUrl: form.demoUrl,
      accessUrl: form.accessUrl,
      contactEmail: form.contactEmail,
      contactPublic: form.contactPublic,
      ...(form.lat.trim() && form.lng.trim() ? { lat: form.lat, lng: form.lng } : {}),
    }
    try {
      const err = await onSubmit(body)
      if (err) setError(err)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const input =
    'w-full rounded-lg border border-white/10 bg-brand-bg px-4 py-2 text-sm text-brand-text placeholder-brand-text-muted/50 outline-none focus:border-brand-accent/40'
  const label = 'mb-1 block text-sm font-medium text-brand-text-muted'
  const isDated = form.kind === 'JOURNEY' || form.kind === 'EXPERIENCE'
  const isAccess = form.kind === 'SERVICE' || form.kind === 'AUTOMATION'

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-4 rounded-xl border border-white/10 bg-brand-surface p-6"
    >
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr]">
        <div>
          <label htmlFor="opp-kind" className={label}>
            Type
          </label>
          <select
            id="opp-kind"
            value={form.kind}
            onChange={(e) => set('kind', e.target.value as OpportunityKind)}
            className={input}
          >
            {OPPORTUNITY_KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="opp-title" className={label}>
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="opp-title"
            required
            maxLength={120}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. 7-day Maasai Mara journey"
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="opp-description" className={label}>
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="opp-description"
          required
          maxLength={2000}
          rows={5}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What people get, what is included, who it is for…"
          className={input}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="opp-country" className={label}>
            Country on the map <span className="text-red-400">*</span>
          </label>
          <select
            id="opp-country"
            value={form.countryCode}
            onChange={(e) => set('countryCode', e.target.value)}
            className={input}
          >
            {SORTED_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="opp-location" className={label}>
            Place
          </label>
          <input
            id="opp-location"
            maxLength={120}
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Nairobi, or Online"
            className={input}
          />
        </div>
      </div>

      <details className="rounded-lg border border-white/5 px-4 py-2">
        <summary className="cursor-pointer text-xs text-brand-text-muted">
          Exact map position (optional, otherwise the country&apos;s capital)
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <input
            id="opp-lat"
            inputMode="decimal"
            value={form.lat}
            onChange={(e) => set('lat', e.target.value)}
            placeholder="Latitude, e.g. -1.29"
            className={input}
          />
          <input
            id="opp-lng"
            inputMode="decimal"
            value={form.lng}
            onChange={(e) => set('lng', e.target.value)}
            placeholder="Longitude, e.g. 36.82"
            className={input}
          />
        </div>
      </details>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="opp-price" className={label}>
            Price
          </label>
          <input
            id="opp-price"
            inputMode="decimal"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="Empty = on request"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="opp-currency" className={label}>
            Currency
          </label>
          <input
            id="opp-currency"
            maxLength={3}
            value={form.currency}
            onChange={(e) => set('currency', e.target.value.toUpperCase())}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="opp-unit" className={label}>
            Per
          </label>
          <select
            id="opp-unit"
            value={form.priceUnit}
            onChange={(e) => set('priceUnit', e.target.value as PriceUnit)}
            className={input}
          >
            {PRICE_UNITS.map((u) => (
              <option key={u} value={u}>
                {PRICE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isDated && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="opp-starts" className={label}>
              Starts
            </label>
            <input
              id="opp-starts"
              type="date"
              value={form.startsOn}
              onChange={(e) => set('startsOn', e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="opp-ends" className={label}>
              Ends
            </label>
            <input
              id="opp-ends"
              type="date"
              value={form.endsOn}
              onChange={(e) => set('endsOn', e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="opp-capacity" className={label}>
              Places
            </label>
            <input
              id="opp-capacity"
              inputMode="numeric"
              value={form.capacity}
              onChange={(e) => set('capacity', e.target.value)}
              placeholder="e.g. 12"
              className={input}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="opp-sector" className={label}>
            Sector
          </label>
          <input
            id="opp-sector"
            maxLength={80}
            value={form.sector}
            onChange={(e) => set('sector', e.target.value)}
            placeholder="e.g. Tourism and Hospitality"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="opp-icon" className={label}>
            Icon (emoji)
          </label>
          <input
            id="opp-icon"
            maxLength={10}
            value={form.icon}
            onChange={(e) => set('icon', e.target.value)}
            placeholder="🧭"
            className={input}
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${isAccess ? 'sm:grid-cols-2' : ''}`}>
        <div>
          <label htmlFor="opp-demo" className={label}>
            Public link (website or demo)
          </label>
          <input
            id="opp-demo"
            type="url"
            value={form.demoUrl}
            onChange={(e) => set('demoUrl', e.target.value)}
            placeholder="https://"
            className={input}
          />
        </div>
        {isAccess && (
          <div>
            <label htmlFor="opp-access" className={label}>
              Access link after booking (private)
            </label>
            <input
              id="opp-access"
              type="url"
              value={form.accessUrl}
              onChange={(e) => set('accessUrl', e.target.value)}
              placeholder="https://studio.4xor.de"
              className={input}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="opp-contact" className={label}>
          Contact email
        </label>
        <input
          id="opp-contact"
          type="email"
          value={form.contactEmail}
          onChange={(e) => set('contactEmail', e.target.value)}
          placeholder="you@company.com"
          className={input}
        />
        <label className="mt-2 flex items-center gap-2 text-xs text-brand-text">
          <input
            type="checkbox"
            checked={form.contactPublic}
            onChange={(e) => set('contactPublic', e.target.checked)}
          />
          Show this email on the map (for business addresses)
        </label>
        <p className="mt-1 text-xs text-brand-text-muted">
          Visitors can always write to you through the listing. Empty = your account email.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {note && <p className="mr-auto text-xs text-brand-text-muted">{note}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-brand-accent transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

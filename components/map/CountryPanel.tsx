'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { CountryInsights } from '@/lib/country-insights'
import { formatCompact } from '@/lib/format'
import type { OpportunityDTO } from '@/lib/opportunities'
import KindDot from '@/components/map/KindDot'

export type CountryData = CountryInsights & { bex: { offerings: number; explorers: number } }
export type HighlightMode = 'language' | 'currency' | null

interface CountryPanelProps {
  code: string
  offerings: OpportunityDTO[]
  highlightMode: HighlightMode
  onHighlightMode: (mode: HighlightMode) => void
  onData: (data: CountryData | null) => void
  onOpenOffering: (id: string) => void
  onSelectCountry: (code: string) => void
  onClose: () => void
  onAskAgent: () => void
  /** Start comparing: the next country picked on the map is added */
  onCompare: () => void
  /** Waiting for the second country */
  comparing: boolean
}

const cache = new Map<string, CountryData>()

/** Live facts for one country, cached for the page's lifetime. */
export function loadCountryData(code: string): Promise<CountryData> {
  const hit = cache.get(code)
  if (hit) return Promise.resolve(hit)
  return fetch(`/api/country/${code}/insights`)
    .then((r) => (r.ok ? (r.json() as Promise<CountryData>) : Promise.reject(new Error())))
    .then((d) => {
      cache.set(code, d)
      return d
    })
}

export function cachedCountryData(code: string): CountryData | null {
  return cache.get(code) ?? null
}

/** Country facts (live public data) + what Be[X] has there + how it connects. */
export default function CountryPanel({
  code,
  offerings,
  highlightMode,
  onHighlightMode,
  onData,
  onOpenOffering,
  onSelectCountry,
  onClose,
  onAskAgent,
  onCompare,
  comparing,
}: CountryPanelProps) {
  const [data, setData] = useState<CountryData | null>(cache.get(code) ?? null)
  const [failed, setFailed] = useState(false)
  const [flagFailed, setFlagFailed] = useState(false)

  useEffect(() => {
    let live = true
    const hit = cache.get(code)
    setFailed(false)
    if (hit) {
      setData(hit)
      onData(hit)
      return
    }
    setData(null)
    onData(null)
    loadCountryData(code)
      .then((d) => {
        if (live) {
          setData(d)
          onData(d)
        }
      })
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [code, onData])

  const ind = data?.indicators ?? {}
  const figures = [
    data?.population ? { label: 'Population', value: formatCompact(data.population) } : null,
    ind.gdp ? { label: 'GDP', value: formatCompact(ind.gdp.value, '$'), year: ind.gdp.year } : null,
    ind.gdpPerCapita
      ? {
          label: 'GDP per person',
          value: formatCompact(ind.gdpPerCapita.value, '$'),
          year: ind.gdpPerCapita.year,
        }
      : null,
    ind.gdpGrowth
      ? {
          label: 'Growth',
          value: `${ind.gdpGrowth.value > 0 ? '+' : ''}${ind.gdpGrowth.value.toFixed(1)}%`,
          year: ind.gdpGrowth.year,
        }
      : null,
    ind.internet
      ? { label: 'Online', value: `${Math.round(ind.internet.value)}%`, year: ind.internet.year }
      : null,
    ind.urban
      ? { label: 'In cities', value: `${Math.round(ind.urban.value)}%`, year: ind.urban.year }
      : null,
    ind.youth
      ? { label: 'Under 15', value: `${Math.round(ind.youth.value)}%`, year: ind.youth.year }
      : null,
  ]
    .filter((f): f is { label: string; value: string; year?: string } => !!f)
    .slice(0, 6)
  // The last figure fills the row, so the grid never shows an empty slot
  const lastSpan = ['', 'col-span-3', 'col-span-2'][figures.length % 3]

  const structure =
    ind.agriculture && ind.industry && ind.services
      ? [
          { label: 'Services', value: ind.services.value, color: 'bg-brand-accent' },
          { label: 'Industry', value: ind.industry.value, color: 'bg-brand-gold' },
          { label: 'Agriculture', value: ind.agriculture.value, color: 'bg-[#4f7a6d]' },
        ]
      : null

  const neighbours =
    highlightMode === 'language'
      ? (data?.sharedLanguage ?? [])
      : highlightMode === 'currency'
        ? (data?.sharedCurrency ?? [])
        : []

  return (
    <div className="flex flex-col gap-5">
      {/* Heading */}
      <div className="flex items-start gap-3">
        {data?.flagUrl && !flagFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.flagUrl}
            alt=""
            onError={() => setFlagFailed(true)}
            className="mt-1 h-8 w-12 shrink-0 rounded-[3px] object-cover shadow"
          />
        ) : (
          <span className="mt-0.5 text-3xl">{data?.flag ?? '🌍'}</span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[1.7rem] font-medium leading-tight text-brand-text">
            {data?.name ?? code}
          </h2>
          <p className="text-sm text-brand-text-muted">
            {[data?.region, data?.capital && `Capital ${data.capital}`]
              .filter(Boolean)
              .join(' · ') || (failed ? 'Live data unavailable right now' : 'Loading live data…')}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close country"
          className="rounded-md px-2 py-1 text-xl leading-none text-brand-text-muted hover:bg-white/5 hover:text-brand-text"
        >
          ×
        </button>
      </div>

      {data?.summary && (
        <p className="line-clamp-4 text-[0.92rem] leading-relaxed text-brand-text/85">
          {data.summary}{' '}
          {data.wikipediaUrl && (
            <a
              href={data.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline"
            >
              More
            </a>
          )}
        </p>
      )}

      {/* Key figures */}
      {figures.length > 0 ? (
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-brand-line bg-brand-line">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={`bg-brand-surface px-3 py-2.5 ${i === figures.length - 1 ? lastSpan : ''}`}
            >
              <dt className="text-[0.72rem] text-brand-text-muted">{f.label}</dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-brand-text">{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        !failed && <div className="h-[118px] animate-pulse rounded-[10px] bg-brand-surface" />
      )}

      {/* Economy structure */}
      {structure && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-brand-text">Where the economy is</h3>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-brand-surface-2">
            {structure.map((s) => (
              <div key={s.label} className={s.color} style={{ width: `${s.value}%` }} />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-text-muted">
            {structure.map((s) => (
              <span key={s.label} className="inline-flex items-center gap-1.5">
                <i className={`h-2 w-2 rounded-full ${s.color}`} />
                {s.label} {Math.round(s.value)}%
              </span>
            ))}
          </div>
          {data && data.sectors.length > 0 && (
            <p className="mt-2.5 text-xs leading-relaxed text-brand-text-muted">
              Strong in:{' '}
              <span className="text-brand-text/85">{data.sectors.slice(0, 5).join(', ')}</span>
            </p>
          )}
        </section>
      )}

      {/* Culture and connections */}
      {data && (
        <section>
          <h3 className="text-sm font-semibold text-brand-text">No borders, just differences</h3>
          <p className="mt-1 text-xs leading-relaxed text-brand-text-muted">
            Speaks{' '}
            {data.languages
              .slice(0, 4)
              .map((l) => l.name)
              .join(', ')}
            {data.currency ? ` · pays in ${data.currency.name ?? data.currency.code}` : ''}. Show
            who shares it:
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2" role="group" aria-label="Show connections">
            {(
              [
                ['language', 'Same language', data.sharedLanguage.length],
                ['currency', 'Same currency', data.sharedCurrency.length],
              ] as const
            ).map(([mode, label, n]) => (
              <button
                key={mode}
                onClick={() => onHighlightMode(highlightMode === mode ? null : mode)}
                aria-pressed={highlightMode === mode}
                disabled={n === 0}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition disabled:opacity-40 ${
                  highlightMode === mode
                    ? 'border-brand-accent bg-brand-accent/15 text-brand-text'
                    : 'border-brand-line bg-brand-surface-2 text-brand-text-muted hover:border-brand-accent/60 hover:text-brand-text'
                }`}
              >
                <span className="block font-medium">{label}</span>
                <span className="text-xs">
                  {n} {n === 1 ? 'country' : 'countries'}
                </span>
              </button>
            ))}
          </div>
          {neighbours.length > 0 && (
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {neighbours.slice(0, 12).map((n) => (
                <li key={n.code}>
                  <button
                    onClick={() => onSelectCountry(n.code)}
                    className="rounded-md border border-brand-line px-2 py-1 text-xs text-brand-text/85 hover:border-brand-accent hover:text-brand-text"
                    title={'languages' in n ? (n.languages as string[]).join(', ') : undefined}
                  >
                    {n.flag} {n.name}
                  </button>
                </li>
              ))}
              {neighbours.length > 12 && (
                <li className="px-1 py-1 text-xs text-brand-text-muted">
                  +{neighbours.length - 12} more on the map
                </li>
              )}
            </ul>
          )}
        </section>
      )}

      {/* Be[X] here */}
      <section>
        <h3 className="text-sm font-semibold text-brand-text">On Be[X] in {data?.name ?? code}</h3>
        {offerings.length > 0 ? (
          <ul className="mt-2 grid grid-cols-1 gap-1.5">
            {offerings.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => onOpenOffering(o.id)}
                  className="flex w-full items-center gap-2.5 rounded-lg border border-brand-line bg-brand-surface-2 px-3 py-2 text-left text-sm hover:border-brand-accent/60"
                >
                  <KindDot kind={o.properties.kind} />
                  <span className="min-w-0 flex-1 truncate text-brand-text">{o.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-brand-text-muted">
            No offerings here yet.{' '}
            <Link
              href={`/opportunities/new?country=${code}`}
              className="text-brand-accent hover:underline"
            >
              List the first one
            </Link>
          </p>
        )}
        {data && data.bex.explorers > 0 && (
          <p className="mt-2 text-xs text-brand-text-muted">
            {data.bex.explorers} {data.bex.explorers === 1 ? 'Explorer lives' : 'Explorers live'}{' '}
            here.
          </p>
        )}
      </section>

      <div className="grid gap-2">
        <button
          onClick={onCompare}
          aria-pressed={comparing}
          className={`btn w-full ${comparing ? 'border-brand-gold text-brand-text' : ''}`}
        >
          {comparing
            ? 'Now pick a second country on the map'
            : `Compare ${data?.name ?? code} with another country`}
        </button>
        <button onClick={onAskAgent} className="btn btn-primary w-full">
          Ask the agent about {data?.name ?? code}
        </button>
      </div>

      {data && (
        <p className="text-[0.7rem] leading-relaxed text-brand-text-muted">
          Live data:{' '}
          {data.sources.map((s, i) => (
            <span key={s.name}>
              {i > 0 && ', '}
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-accent"
              >
                {s.name}
              </a>
            </span>
          ))}
          {figures.find((f) => f.year)
            ? ` (latest year: ${figures.find((f) => f.year)?.year})`
            : ''}
        </p>
      )}
    </div>
  )
}

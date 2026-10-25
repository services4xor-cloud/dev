'use client'

import { useEffect, useMemo, useState } from 'react'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { compareCountries, connectedOfferings, MAX_COMPARE, type LinkKind } from '@/lib/compare'
import { formatCompact } from '@/lib/format'
import type { OpportunityDTO } from '@/lib/opportunities'
import KindDot from '@/components/map/KindDot'
import { cachedCountryData, loadCountryData, type CountryData } from '@/components/map/CountryPanel'

const COUNTRY = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))

const LINK_LABELS: Record<LinkKind, string> = {
  language: 'Language',
  currency: 'Currency',
  region: 'Region',
  sector: 'Strong sectors',
  faith: 'Faith',
}

type Row = { label: string; value: (d: CountryData) => string | null }

const ROWS: Row[] = [
  { label: 'Population', value: (d) => (d.population ? formatCompact(d.population) : null) },
  {
    label: 'GDP',
    value: (d) => (d.indicators.gdp ? formatCompact(d.indicators.gdp.value, '$') : null),
  },
  {
    label: 'GDP per person',
    value: (d) =>
      d.indicators.gdpPerCapita ? formatCompact(d.indicators.gdpPerCapita.value, '$') : null,
  },
  {
    label: 'Growth',
    value: (d) => {
      const g = d.indicators.gdpGrowth?.value
      return g === undefined ? null : `${g > 0 ? '+' : ''}${g.toFixed(1)}%`
    },
  },
  { label: 'Services', value: (d) => pct(d.indicators.services?.value) },
  { label: 'Industry', value: (d) => pct(d.indicators.industry?.value) },
  { label: 'Agriculture', value: (d) => pct(d.indicators.agriculture?.value) },
  { label: 'In cities', value: (d) => pct(d.indicators.urban?.value) },
  { label: 'Online', value: (d) => pct(d.indicators.internet?.value) },
  { label: 'Under 15', value: (d) => pct(d.indicators.youth?.value) },
  { label: 'Currency', value: (d) => d.currency?.code ?? null },
]

function pct(v: number | undefined) {
  return v === undefined ? null : `${Math.round(v)}%`
}

interface ComparePanelProps {
  codes: string[]
  offerings: OpportunityDTO[]
  onRemove: (code: string) => void
  onClear: () => void
  onOpenOffering: (id: string) => void
  onAskAgent: () => void
}

/** Two or three countries side by side: what connects them, where they differ, what fits. */
export default function ComparePanel({
  codes,
  offerings,
  onRemove,
  onClear,
  onOpenOffering,
  onAskAgent,
}: ComparePanelProps) {
  const cmp = useMemo(() => compareCountries(codes), [codes])
  const [live, setLive] = useState<Record<string, CountryData>>(
    () =>
      Object.fromEntries(
        codes.map((c) => [c, cachedCountryData(c)]).filter(([, d]) => d)
      ) as Record<string, CountryData>
  )

  useEffect(() => {
    let alive = true
    for (const c of codes)
      loadCountryData(c)
        .then((d) => alive && setLive((prev) => ({ ...prev, [c]: d })))
        .catch(() => {})
    return () => {
      alive = false
    }
  }, [codes])

  const fits = useMemo(() => (cmp ? connectedOfferings(offerings, cmp) : []), [offerings, cmp])
  if (!cmp) return null

  const name = (c: string) => COUNTRY.get(c)?.name ?? c
  const flag = (c: string) => COUNTRY.get(c)?.flag ?? ''
  const names = cmp.codes.map(name)
  const groups = (Object.keys(LINK_LABELS) as LinkKind[])
    .map((kind) => ({ kind, items: cmp.shared.filter((s) => s.kind === kind) }))
    .filter((g) => g.items.length)
  // A row needs a value for at least two countries, else there is nothing to compare
  const rows = ROWS.filter((r) => cmp.codes.filter((c) => live[c] && r.value(live[c])).length >= 2)
  const cols =
    cmp.codes.length === 2
      ? 'grid-cols-[1fr_5.5rem_5.5rem]'
      : 'grid-cols-[1fr_4.6rem_4.6rem_4.6rem]'

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <p className="eyebrow">Compare</p>
          <button onClick={onClear} className="text-xs text-brand-text-muted hover:text-brand-text">
            Clear
          </button>
        </div>
        <ul className="mt-2 grid grid-cols-1 gap-1.5">
          {cmp.codes.map((c) => (
            <li
              key={c}
              className="flex items-center gap-2.5 rounded-lg border border-brand-gold/40 bg-brand-gold/5 px-3 py-2"
            >
              <Flag code={c} />
              <span className="min-w-0 flex-1 truncate font-display text-lg text-brand-text">
                {name(c)}
              </span>
              <button
                onClick={() => onRemove(c)}
                aria-label={`Remove ${name(c)}`}
                className="rounded px-1.5 text-lg leading-none text-brand-text-muted hover:bg-white/5 hover:text-brand-text"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        {cmp.codes.length < MAX_COMPARE && (
          <p className="mt-2 text-xs text-brand-text-muted">
            Click another country on the map to add a third.
          </p>
        )}
      </div>

      {/* Distance and time */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-brand-text">Distance and time</h3>
        <ul className="grid gap-1.5 text-sm">
          {cmp.routes.map((r) => (
            <li key={`${r.from}-${r.to}`} className="text-brand-text-muted">
              <span className="text-brand-text">
                {name(r.from)} to {name(r.to)}
              </span>
              : {r.distance}, {r.flight} flight,{' '}
              {r.hoursAhead === 0
                ? 'same time'
                : `${Math.abs(r.hoursAhead)}h ${r.hoursAhead > 0 ? 'ahead' : 'behind'}`}
            </li>
          ))}
        </ul>
      </section>

      {/* What connects them */}
      <section>
        <h3 className="text-sm font-semibold text-brand-text">What connects them</h3>
        {groups.length ? (
          <dl className="mt-2 grid gap-2.5">
            {groups.map((g) => (
              <div key={g.kind}>
                <dt className="text-[0.72rem] text-brand-text-muted">{LINK_LABELS[g.kind]}</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span
                      key={s.key}
                      title={s.codes.map(name).join(', ')}
                      className={`rounded-md border px-2 py-0.5 text-[0.82rem] ${
                        s.codes.length === cmp.codes.length
                          ? 'border-brand-accent/50 bg-brand-accent/10 text-brand-text'
                          : 'border-brand-line text-brand-text/85'
                      }`}
                    >
                      {s.label}
                      {s.codes.length < cmp.codes.length && (
                        <span className="ml-1 text-brand-text-muted">
                          {s.codes.map(flag).join('')}
                        </span>
                      )}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-1 text-sm text-brand-text-muted">
            No shared language, currency or sector in our data. That is where the differences are.
          </p>
        )}
      </section>

      {/* Where they differ */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-brand-text">Where they differ</h3>
        <div className="overflow-hidden rounded-[10px] border border-brand-line text-sm">
          <div
            className={`grid ${cols} bg-brand-surface-2 px-3 py-2 text-[0.72rem] text-brand-text-muted`}
          >
            <span />
            {cmp.codes.map((c) => (
              <span key={c} className="truncate text-right">
                {name(c)}
              </span>
            ))}
          </div>
          {rows.length === 0 && (
            <div className="h-24 animate-pulse bg-brand-surface" aria-label="Loading live data" />
          )}
          {rows.map((r) => (
            <div key={r.label} className={`grid ${cols} border-t border-brand-line px-3 py-1.5`}>
              <span className="text-brand-text-muted">{r.label}</span>
              {cmp.codes.map((c) => (
                <span key={c} className="text-right tabular-nums text-brand-text">
                  {(live[c] && r.value(live[c])) ?? '–'}
                </span>
              ))}
            </div>
          ))}
        </div>
        <dl className="mt-3 grid gap-2 text-sm">
          {cmp.codes.map((c) => {
            const o = cmp.only[c]
            const bits = [
              o.languages.length && `speaks ${o.languages.slice(0, 4).join(', ')}`,
              o.sectors.length && `strong in ${o.sectors.slice(0, 3).join(', ')}`,
              o.faiths.length && `mostly ${o.faiths.join(', ')}`,
            ].filter(Boolean)
            if (!bits.length) return null
            return (
              <div key={c}>
                <dt className="inline font-medium text-brand-text">Only {name(c)}: </dt>
                <dd className="inline text-brand-text-muted">{bits.join('; ')}</dd>
              </div>
            )
          })}
        </dl>
      </section>

      {/* Offerings that fit */}
      <section>
        <h3 className="text-sm font-semibold text-brand-text">Offerings that fit</h3>
        {fits.length ? (
          <ul className="mt-2 grid grid-cols-1 gap-1.5">
            {fits.slice(0, 8).map(({ offering: o, reasons }) => (
              <li key={o.id} className="min-w-0">
                <button
                  onClick={() => onOpenOffering(o.id)}
                  className="w-full rounded-lg border border-brand-line bg-brand-surface-2 px-3 py-2 text-left text-sm hover:border-brand-accent/60"
                >
                  <span className="flex items-center gap-2.5">
                    <KindDot kind={o.properties.kind} />
                    <span className="min-w-0 flex-1 truncate text-brand-text">{o.label}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-brand-text-muted">
                    {reasons.slice(0, 2).join(' · ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-brand-text-muted">
            Nothing listed for these countries or their sectors yet.
          </p>
        )}
      </section>

      <button onClick={onAskAgent} className="btn btn-primary w-full">
        Ask the agent to compare {names.join(names.length > 2 ? ', ' : ' and ')}
      </button>
    </div>
  )
}

/** Flag image, with the emoji as fallback when the image can't load. */
function Flag({ code }: { code: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className="w-6 shrink-0 text-center">{COUNTRY.get(code)?.flag}</span>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
      alt=""
      onError={() => setFailed(true)}
      className="h-4 w-6 shrink-0 rounded-[2px] object-cover"
    />
  )
}

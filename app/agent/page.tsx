'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AgentChat from '@/components/AgentChat'
import SelectedOpportunities from '@/components/SelectedOpportunities'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { getAgentCountries, setAgentCountries } from '@/lib/agent-context'
import type { OpportunityDTO } from '@/lib/opportunities'

const COUNTRY = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))
const SORTED = [...COUNTRY_OPTIONS].sort((a, b) => a.name.localeCompare(b.name))

function suggestionsFor(countries: string[], offerings: OpportunityDTO[]): string[] {
  const names = countries.map((c) => COUNTRY.get(c)?.name ?? c)
  const out: string[] = []
  if (offerings[0]) out.push(`What do I get with "${offerings[0].label}", and who is it for?`)
  if (names.length >= 2)
    out.push(
      `Compare ${names[0]} and ${names[1]}: what connects them in language, trade and business?`
    )
  if (names[0]) {
    out.push(
      `Which industries are growing in ${names[0]}, and what kinds of business partners should I look for?`
    )
    out.push(
      `What should I know about culture, language and payments before doing business in ${names[0]}?`
    )
  }
  if (out.length < 3)
    out.push(
      'Which countries share a language with Switzerland and have a fast-growing tech sector?',
      'Where could an AI automation service find its first clients outside Europe?',
      'Plan three weeks in Kenya that mix safari, culture and meeting local businesses.'
    )
  return out.slice(0, 4)
}

export default function AgentPage() {
  const [countries, setCountries] = useState<string[]>([])
  const [offerings, setOfferings] = useState<OpportunityDTO[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setCountries(getAgentCountries())
    setReady(true)
  }, [])
  const update = (next: string[]) => {
    setCountries(next)
    setAgentCountries(next)
  }
  const onOfferings = useCallback((items: OpportunityDTO[]) => setOfferings(items), [])
  const suggestions = useMemo(() => suggestionsFor(countries, offerings), [countries, offerings])

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-12">
      <p className="eyebrow mb-3">Be[X] agent</p>
      <h1 className="font-display text-4xl font-medium leading-tight text-brand-text sm:text-5xl">
        Ask about countries, partners and offerings.
      </h1>
      <p className="mt-3 max-w-2xl text-brand-text-muted">
        The agent works with live public data (World Bank, REST Countries, Wikipedia) and the
        offerings listed on Be[X]. It never books or pays for you.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col">
          {ready && (
            <AgentChat
              countries={countries}
              opportunityIds={offerings.map((o) => o.id)}
              suggestions={suggestions}
            />
          )}
        </div>

        <aside className="space-y-5 lg:order-none">
          <section className="card p-4">
            <h2 className="text-sm font-semibold text-brand-text">Countries in focus</h2>
            {countries.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {countries.map((c) => (
                  <li key={c}>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-line bg-brand-surface-2 py-1 pl-2.5 pr-1 text-sm text-brand-text">
                      {COUNTRY.get(c)?.flag} {COUNTRY.get(c)?.name ?? c}
                      <button
                        onClick={() => update(countries.filter((x) => x !== c))}
                        aria-label={`Remove ${COUNTRY.get(c)?.name ?? c}`}
                        className="rounded px-1 text-brand-text-muted hover:text-brand-text"
                      >
                        ×
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-brand-text-muted">None. Add one to compare.</p>
            )}
            {countries.length < 3 && (
              <select
                value=""
                onChange={(e) => e.target.value && update([...countries, e.target.value])}
                className="input mt-3 text-sm"
                aria-label="Add a country"
              >
                <option value="">Add a country…</option>
                {SORTED.filter((c) => !countries.includes(c.code)).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            )}
          </section>

          <section className="card p-4">
            <h2 className="mb-3 text-sm font-semibold text-brand-text">Offerings you picked</h2>
            <SelectedOpportunities onChange={onOfferings} />
          </section>

          <Link href="/map" className="btn w-full">
            Back to the map
          </Link>
        </aside>
      </div>
    </main>
  )
}

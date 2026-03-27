import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import CountryDimensions from '@/components/CountryDimensions'
import { getCountryData } from '@/lib/country-api'

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  const data = await getCountryData(code)
  const name = data?.name ?? code.toUpperCase()
  return {
    title: `Be${name}`,
    description: `Explore ${name} on Be[X] — discover languages, culture, opportunities, and connections.`,
  }
}

export default async function CountryHubPage({ params }: PageProps) {
  const { code } = await params
  const upperCode = code.toUpperCase()
  const data = await getCountryData(code)

  // Display values — API data with fallbacks
  const name = data?.name ?? upperCode
  const flagPng = data?.flagPng ?? `https://flagcdn.com/w80/${upperCode.toLowerCase()}.png`
  const region = data?.region ?? null
  const currency = data?.currency ?? null
  const payments = data?.payment ?? []
  const capital = data?.capital ?? null
  const tz = data?.timezone ? data.timezone.replace(/^.*\//, '') : null
  const population = data?.population ?? null
  // Preserve priority order from COUNTRY_OPTIONS (primary/official first).
  // Multi-country overlap sorting happens client-side in CountryDimensions.
  const languages = data?.languages ?? []
  const topFaiths = data?.topFaiths ?? []
  const topSectors = data?.topSectors ?? []

  // Format population for display
  const popDisplay = population
    ? population >= 1_000_000
      ? `${(population / 1_000_000).toFixed(1)}M`
      : `${(population / 1_000).toFixed(0)}K`
    : null

  // Current local time in the country's timezone
  const localTime = data?.timezone
    ? new Date().toLocaleTimeString('en-GB', {
        timeZone: data.timezone,
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <PageShell backHref="/" backLabel="← Map" title={`Be${name}`}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface via-brand-bg to-brand-bg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-20">
          <h1 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-brand-accent sm:mb-5 sm:text-5xl">
            <Image
              src={flagPng}
              alt={`${name} flag`}
              width={48}
              height={36}
              className="inline-block rounded shadow-md sm:h-[48px] sm:w-[64px]"
              unoptimized
            />
            Be{name}
          </h1>
          {region && (
            <span className="inline-block rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent sm:px-4 sm:text-sm">
              {region}
            </span>
          )}
          {payments.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {payments.map((p) => (
                <span
                  key={p}
                  className="inline-block rounded-full border border-brand-accent/20 bg-brand-surface px-2.5 py-0.5 text-xs text-brand-text-muted sm:px-3 sm:py-1 sm:text-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-brand-accent/10 bg-brand-surface">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-brand-accent/10 sm:grid-cols-4">
          {[
            ...(capital ? [{ label: 'Capital', value: capital }] : []),
            ...(localTime ? [{ label: 'Local Time', value: localTime }] : []),
            ...(popDisplay ? [{ label: 'Population', value: popDisplay }] : []),
            { label: 'Languages', value: String(languages.length) },
          ]
            .slice(0, 4)
            .map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center px-2 py-4 text-center sm:px-6 sm:py-5"
              >
                <span className="text-lg font-bold leading-tight text-brand-accent sm:text-2xl">
                  {value}
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-brand-text-muted sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-12">
        {/* Languages → Sectors → Currency → Faiths (overlap-aware) */}
        <CountryDimensions
          code={upperCode}
          name={name}
          flagPng={flagPng}
          languages={languages}
          topSectors={topSectors}
          topFaiths={topFaiths}
          currency={currency ?? '—'}
          capital={capital}
          timezone={data?.timezone ?? null}
          population={population}
        />

        {/* Action Cards — harmonized with main nav */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Discover
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <Link
              href="/agent"
              className="group rounded-xl border border-brand-accent/15 bg-brand-surface p-5 text-center transition hover:border-brand-accent/40 sm:p-6"
            >
              <div className="mb-2 text-2xl">🤖</div>
              <p className="text-sm font-semibold text-brand-text group-hover:text-brand-accent">
                Ask the Agent
              </p>
              <p className="mt-1 text-xs text-brand-text-muted">AI-guided routing for {name}</p>
            </Link>
            <Link
              href="/opportunities"
              className="group rounded-xl border border-brand-accent/15 bg-brand-surface p-5 text-center transition hover:border-brand-accent/40 sm:p-6"
            >
              <div className="mb-2 text-2xl">🚀</div>
              <p className="text-sm font-semibold text-brand-text group-hover:text-brand-accent">
                Browse Opportunities
              </p>
              <p className="mt-1 text-xs text-brand-text-muted">Opportunities in {name}</p>
            </Link>
          </div>
        </section>

        {/* Back to map — subtle, not the main CTA */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-sm text-brand-text-muted transition hover:text-brand-accent"
          >
            ← Back to the Map
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

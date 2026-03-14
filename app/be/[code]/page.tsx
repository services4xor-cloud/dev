// @ts-nocheck — async server component (React 18 types don't support async components)
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  const upperCode = code.toUpperCase()
  const country = await db.node.findUnique({
    where: { type_code: { type: 'COUNTRY', code: upperCode } },
  })
  const name = country?.label ?? upperCode
  return {
    title: `Be${upperCode} — ${name}`,
    description: `Explore ${name} on Be[X] — discover languages, culture, paths, and connections.`,
  }
}

export default async function CountryHubPage({ params }: PageProps) {
  const { code } = await params
  const upperCode = code.toUpperCase()

  const country = await db.node.findUnique({
    where: { type_code: { type: 'COUNTRY', code: upperCode } },
    include: {
      outEdges: { include: { to: true } },
      inEdges: { include: { from: true } },
    },
  })

  if (!country) notFound()

  const languages = country.outEdges.filter((e) => e.relation === 'OFFICIAL_LANG').map((e) => e.to)
  const currencies = country.outEdges
    .filter((e) => e.relation === 'COUNTRY_CURRENCY')
    .map((e) => e.to)
  const corridors = country.outEdges
    .filter((e) => e.relation === 'CORRIDOR' && e.to.type === 'COUNTRY')
    .map((e) => e.to)
  const sectors = country.outEdges.filter((e) => e.relation === 'HAS_SECTOR').map((e) => e.to)
  const explorerCount = country.inEdges.filter(
    (e) => e.relation === 'LOCATED_IN' && e.from.type === 'USER'
  ).length

  const properties = country.properties as Record<string, unknown> | null
  const region = properties?.region ? String(properties.region) : null

  return (
    <PageShell backHref="/" backLabel="← Back to Map">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface via-brand-bg to-brand-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mb-4 text-7xl leading-none">{country.icon}</div>
          <h1 className="mb-3 text-5xl font-bold tracking-tight text-brand-accent">
            Be{upperCode}
          </h1>
          <p className="mb-5 text-2xl font-light text-brand-text">{country.label}</p>
          {region && (
            <span className="inline-block rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1 text-sm font-medium text-brand-accent">
              {region}
            </span>
          )}
          {currencies.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {currencies.map((curr) => (
                <span
                  key={curr.id}
                  className="inline-block rounded-full border border-brand-accent/20 bg-brand-surface px-3 py-1 text-sm text-brand-text-muted"
                >
                  {curr.label}
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
            { label: 'Languages', value: languages.length },
            { label: 'Sectors', value: sectors.length },
            { label: 'Corridors', value: corridors.length },
            { label: 'Explorers', value: explorerCount },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center px-6 py-5">
              <span className="text-3xl font-bold text-brand-accent">{value}</span>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-brand-text-muted">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-12">
        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <span
                  key={lang.id}
                  className="rounded-full border border-brand-accent/25 bg-brand-surface px-5 py-2 text-base font-medium text-brand-accent"
                >
                  {lang.icon && <span className="mr-2">{lang.icon}</span>}
                  {lang.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Corridors */}
        {corridors.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
              Corridors
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {corridors.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/be/${dest.code.toLowerCase()}`}
                  className="flex items-center gap-3 rounded-xl border border-brand-accent/20 bg-brand-surface px-4 py-3 transition-colors hover:border-brand-accent/50 hover:bg-brand-accent/5"
                >
                  <span className="text-2xl leading-none">{dest.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brand-text">{dest.label}</p>
                    <p className="text-xs text-brand-text-muted">Be{dest.code}</p>
                  </div>
                  <span className="ml-auto text-brand-accent opacity-50">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sectors */}
        {sectors.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
              Sectors
            </h2>
            <div className="flex flex-wrap gap-3">
              {sectors.map((sector) => (
                <span
                  key={sector.id}
                  className="flex items-center gap-2 rounded-xl border border-brand-accent/10 bg-brand-surface px-4 py-2 text-sm text-brand-text"
                >
                  {sector.icon && <span className="text-base">{sector.icon}</span>}
                  {sector.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-2xl border border-brand-accent/20 bg-brand-surface p-8 text-center">
          <p className="mb-2 text-lg font-semibold text-brand-text">
            Ready to explore {country.label}?
          </p>
          <p className="mb-6 text-sm text-brand-text-muted">
            Discover Paths, Pioneers, and Ventures in this country.
          </p>
          <Link
            href={`/?country=${upperCode}`}
            className="inline-block rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Explore {country.label} on the Map
          </Link>
        </section>
      </div>
    </PageShell>
  )
}

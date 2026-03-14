// @ts-nocheck — async server component (React 18 types don't support async components)
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

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
    },
  })

  if (!country) notFound()

  const languages = country.outEdges.filter((e) => e.relation === 'OFFICIAL_LANG').map((e) => e.to)
  const currencies = country.outEdges
    .filter((e) => e.relation === 'COUNTRY_CURRENCY')
    .map((e) => e.to)
  const properties = country.properties as Record<string, unknown> | null

  return (
    <div className="min-h-screen bg-brand-bg p-6">
      <a
        href="/"
        className="mb-4 inline-block text-sm text-brand-text-muted hover:text-brand-accent"
      >
        ← Back to Map
      </a>
      <h1 className="mb-2 text-4xl font-bold text-brand-accent">
        {country.icon} Be{upperCode}
      </h1>
      <p className="mb-8 text-lg text-brand-text">{country.label}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Languages */}
        <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-4">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <span
                key={lang.id}
                className="rounded-full bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent"
              >
                {lang.label}
              </span>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-4">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
            Currency
          </h2>
          <div className="flex flex-wrap gap-2">
            {currencies.map((curr) => (
              <span
                key={curr.id}
                className="rounded-full bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent"
              >
                {curr.label}
              </span>
            ))}
          </div>
        </div>

        {/* Region */}
        {properties?.region && (
          <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-4">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
              Region
            </h2>
            <p className="text-brand-text">{String(properties.region)}</p>
          </div>
        )}

        {/* Top Sectors */}
        {Array.isArray(properties?.topSectors) && (
          <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-4">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
              Top Sectors
            </h2>
            <div className="flex flex-wrap gap-2">
              {(properties.topSectors as string[]).map((sector) => (
                <span
                  key={sector}
                  className="rounded-full bg-brand-primary/20 px-3 py-1 text-sm text-brand-text"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

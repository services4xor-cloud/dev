// @ts-nocheck — async server component (React 18 types don't support async components)
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ApplyButton from '@/components/ApplyButton'
import ContactButton from '@/components/ContactButton'
import KindDot from '@/components/map/KindDot'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { formatPrice, KIND_LABELS, readProps } from '@/lib/opportunities'

interface PageProps {
  params: Promise<{ id: string }>
}

const COUNTRY = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))

async function loadOffering(id: string) {
  const node = await db.node.findUnique({
    where: { id },
    include: { inEdges: { where: { relation: 'OFFERS' }, include: { from: true } } },
  })
  if (!node || node.type !== 'EXPERIENCE' || !node.active) return null
  const opp = readProps(node)
  // Unpublished listings are only visible to their Host (via the edit page)
  if (opp.status !== 'PUBLISHED') return null
  return { node, opp, host: node.inEdges[0]?.from ?? null }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const found = await loadOffering(id)
  if (!found) return { title: 'Not found' }
  return {
    title: found.node.label,
    description: found.opp.description?.slice(0, 160) ?? `${found.node.label} on Be[X]`,
  }
}

export default async function OfferingPage({ params }: PageProps) {
  const { id } = await params
  const found = await loadOffering(id)
  if (!found) notFound()
  const { node, opp, host } = found

  const country = opp.countryCode ? COUNTRY.get(opp.countryCode) : undefined
  const where = [opp.location, country?.name]
    .filter(Boolean)
    .filter((v, i, a) => a.findIndex((x) => x?.toLowerCase().includes(v!.toLowerCase())) === i)
    .join(', ')
  const price = formatPrice(opp)
  const bookLabel =
    opp.kind === 'JOURNEY'
      ? 'Book this journey'
      : opp.kind === 'SERVICE' || opp.kind === 'AUTOMATION'
        ? 'Book this service'
        : 'Book this'

  const facts: [string, string][] = [
    ['Price', price ?? 'On request'],
    ...(where ? ([['Where', where]] as [string, string][]) : []),
    ...(opp.startsOn || opp.endsOn
      ? ([['Dates', `${opp.startsOn ?? '…'} to ${opp.endsOn ?? '…'}`]] as [string, string][])
      : []),
    ...(opp.capacity ? ([['Places', String(opp.capacity)]] as [string, string][]) : []),
    ...(opp.sector ? ([['Sector', opp.sector]] as [string, string][]) : []),
  ]

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-text-muted">
        <Link href="/opportunities" className="hover:text-brand-accent">
          Offerings
        </Link>
        {country && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/map?country=${country.code}`} className="hover:text-brand-accent">
              {country.flag} {country.name}
            </Link>
          </>
        )}
      </nav>

      <p className="flex items-center gap-2 text-sm text-brand-text-muted">
        {opp.kind && <KindDot kind={opp.kind} />}
        {opp.kind ? KIND_LABELS[opp.kind] : 'Offering'}
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-brand-text sm:text-5xl">
        {node.label}
      </h1>
      {host && <p className="mt-3 text-brand-text-muted">by {host.label}</p>}

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_18rem]">
        <div>
          {opp.description && (
            <p className="whitespace-pre-line leading-relaxed text-brand-text">{opp.description}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {opp.demoUrl && (
              <a
                href={opp.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline"
              >
                Project page ↗
              </a>
            )}
            {opp.contactPublic && opp.contactEmail && (
              <a href={`mailto:${opp.contactEmail}`} className="text-brand-accent hover:underline">
                {opp.contactEmail}
              </a>
            )}
          </div>
        </div>

        <aside className="card h-fit p-5">
          <dl className="grid gap-3 text-sm">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-brand-text-muted">{k}</dt>
                <dd className="text-right text-brand-text">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid gap-2 border-t border-brand-line pt-5">
            <ApplyButton opportunityId={node.id} label={bookLabel} />
            <ContactButton opportunityId={node.id} />
            <Link
              href={`/map?select=${encodeURIComponent(node.code || node.id)}`}
              className="btn btn-sm"
            >
              Show on the map
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}

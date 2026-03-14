// @ts-nocheck — async server component (React 18 types don't support async components)
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExchangePage({ params }: PageProps) {
  const { id } = await params

  const node = await db.node.findUnique({
    where: { id },
    include: {
      outEdges: { include: { to: true } },
      inEdges: { include: { from: true } },
    },
  })

  if (!node) notFound()

  const offeredBy = node.inEdges.filter((e) => e.relation === 'OFFERS').map((e) => e.from)

  return (
    <div className="min-h-screen bg-brand-bg p-6">
      <a
        href="/"
        className="mb-4 inline-block text-sm text-brand-text-muted hover:text-brand-accent"
      >
        ← Back to Map
      </a>
      <h1 className="mb-2 text-3xl font-bold text-brand-accent">
        {node.icon} {node.label}
      </h1>
      <p className="mb-6 text-sm text-brand-text-muted">{node.type}</p>

      {offeredBy.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
            Offered by
          </h2>
          <div className="flex flex-wrap gap-2">
            {offeredBy.map((host) => (
              <span
                key={host.id}
                className="rounded-full bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent"
              >
                {host.icon} {host.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {node.outEdges.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-brand-text-muted">
            Dimensions
          </h2>
          <div className="space-y-2">
            {node.outEdges.map((edge) => (
              <div key={edge.id} className="flex items-center gap-2 text-sm text-brand-text">
                <span className="text-brand-text-muted">{edge.relation.replace(/_/g, ' ')}</span>
                <span>→</span>
                <span>{edge.to.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

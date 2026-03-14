// @ts-nocheck
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface DimensionItem {
  code: string
  label: string
}

interface ExplorerDetail {
  id: string
  userId: string
  name: string
  image: string | null
  country: string
  createdAt: string
  dimensions: Record<string, DimensionItem[]>
}

const DIMENSION_CONFIG: Record<string, string> = {
  SPEAKS: 'Speaks',
  LOCATED_IN: 'Located In',
  WORKS_IN: 'Works In',
  HAS_SKILL: 'Skills',
  INTERESTED_IN: 'Interested In',
  PRACTICES: 'Practices',
  BELONGS_TO: 'Culture',
}

const DIMENSION_ORDER = [
  'SPEAKS',
  'LOCATED_IN',
  'WORKS_IN',
  'HAS_SKILL',
  'INTERESTED_IN',
  'PRACTICES',
  'BELONGS_TO',
]

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary text-brand-accent font-bold text-2xl select-none">
      {initials || '?'}
    </div>
  )
}

function DimensionCard({ relation, items }: { relation: string; items: DimensionItem[] }) {
  const label = DIMENSION_CONFIG[relation] ?? relation.replace(/_/g, ' ')
  return (
    <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.code}
            className="inline-block rounded-full border border-brand-accent/20 px-3 py-1 text-sm text-brand-text"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

async function getExplorer(id: string): Promise<ExplorerDetail | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const res = await fetch(`${baseUrl}/api/explorers/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function ExplorerDetailPage({ params }: { params: { id: string } }) {
  const explorer = await getExplorer(params.id)

  if (!explorer) {
    notFound()
  }

  const joined = new Date(explorer.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
  })

  const orderedDimensions = [
    ...DIMENSION_ORDER.filter((r) => explorer.dimensions[r]?.length > 0),
    ...Object.keys(explorer.dimensions).filter(
      (r) => !DIMENSION_ORDER.includes(r) && explorer.dimensions[r]?.length > 0
    ),
  ]

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      {/* Top bar */}
      <div className="flex items-center border-b border-brand-accent/10 px-4 py-4 sm:px-6">
        <Link
          href="/explorers"
          className="text-sm text-brand-text-muted hover:text-brand-accent transition"
        >
          ← Explorers
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Profile header */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          {explorer.image ? (
            <Image
              src={explorer.image}
              alt={explorer.name}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="flex-shrink-0">
              <AvatarPlaceholder name={explorer.name} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-brand-text">{explorer.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              {explorer.country && (
                <span className="text-sm text-brand-text-muted">{explorer.country}</span>
              )}
              <span className="text-brand-accent/30">·</span>
              <span className="text-sm text-brand-text-muted">Joined {joined}</span>
            </div>

            {/* Message button */}
            <div className="mt-4">
              <Link
                href={`/messages?to=${explorer.userId}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-accent hover:bg-brand-primary/80 transition"
              >
                Send Message
              </Link>
            </div>
          </div>
        </div>

        {/* Dimension groups */}
        {orderedDimensions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {orderedDimensions.map((relation) => (
              <DimensionCard
                key={relation}
                relation={relation}
                items={explorer.dimensions[relation]}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-brand-text-muted">
              This Explorer hasn&apos;t added any dimensions yet.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

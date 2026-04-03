'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Exchange {
  id: string
  status: string
  message: string | null
  createdAt: string
  explorer: {
    nodeId: string
    userId: string | null
    name: string
    image: string | null
  }
  opportunity: {
    id: string
    label: string
    icon: string | null
  }
}

interface Opportunity {
  id: string
  label: string
  icon: string | null
  properties: Record<string, unknown> | null
  createdAt: string
}

interface RecentPayment {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

interface HostStats {
  opportunities: Opportunity[]
  totalOpportunities: number
  totalPayments: number
  totalRevenue: number
  recentPayments: RecentPayment[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCESS: 'bg-green-500/15 text-green-400 border-green-500/30',
    PENDING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    FAILED: 'bg-red-500/15 text-red-400 border-red-500/30',
    REFUNDED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  }
  const cls = styles[status] ?? 'bg-brand-surface text-brand-text-muted border-brand-accent/20'
  return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>
}

export default function HostDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<HostStats | null>(null)
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const user = session?.user as { id?: string; role?: string } | undefined
  const role = user?.role

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    if (role !== 'HOST' && role !== 'ADMIN') return

    Promise.all([
      fetch('/api/host/stats').then((res) => {
        if (!res.ok) throw new Error('Failed to load stats')
        return res.json() as Promise<HostStats>
      }),
      fetch('/api/exchanges?role=host').then((res) =>
        res.ok ? (res.json() as Promise<Exchange[]>) : []
      ),
    ])
      .then(([statsData, exchangeData]) => {
        setStats(statsData)
        setExchanges(exchangeData)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [status, role])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted">Loading...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  // Role gate
  if (role !== 'HOST' && role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-bg px-6 text-center">
        <p className="text-lg font-semibold text-brand-text">This Hub is for Hosts</p>
        <p className="text-sm text-brand-text-muted">
          Your current role does not have access to this area.
        </p>
        <Link
          href="/me"
          className="mt-2 rounded-md bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Go to My Profile
        </Link>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Opportunities',
      value: stats?.totalOpportunities ?? 0,
    },
    {
      label: 'Total Payments',
      value: stats?.totalPayments ?? 0,
    },
    {
      label: 'Revenue',
      value: stats ? formatAmount(stats.totalRevenue, 'KES') : '—',
    },
    {
      label: 'Active Listings',
      value: stats?.opportunities.length ?? 0,
    },
  ]

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Header */}
      <header className="border-b border-brand-accent/20 bg-brand-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold text-brand-accent hover:opacity-80 transition-opacity"
          >
            Be[X]
          </Link>
          <Link
            href="/"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors"
          >
            ← Back to Map
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Page title */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
              Host Hub
            </h1>
            <p className="mt-1 text-sm text-brand-text-muted">
              Manage your opportunities and track activity
            </p>
          </div>
          <Link
            href="/opportunities"
            className="rounded-md bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Post New Opportunity
          </Link>
        </div>

        {error && (
          <div className="mb-8 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Stats grid */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-brand-accent/20 bg-brand-surface p-5"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-brand-text-muted">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-brand-text">
                {loading ? (
                  <span className="animate-pulse text-brand-text-muted">—</span>
                ) : (
                  card.value
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Exchanges section */}
        {exchanges.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-base font-semibold text-brand-text">
              Exchanges ({exchanges.filter((e) => e.status === 'PENDING').length} pending)
            </h2>
            <div className="space-y-3">
              {exchanges.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-lg border border-brand-accent/20 bg-brand-surface p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {ex.explorer.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ex.explorer.image}
                            alt={ex.explorer.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-brand-accent">
                            {ex.explorer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-brand-text">{ex.explorer.name}</p>
                          <p className="text-xs text-brand-text-muted">
                            Engaged with {ex.opportunity.icon} {ex.opportunity.label}
                          </p>
                        </div>
                      </div>
                      {ex.message && (
                        <p className="mt-2 text-xs text-brand-text-muted italic">
                          &ldquo;{ex.message}&rdquo;
                        </p>
                      )}
                      <p className="mt-1 text-xs text-brand-text-muted/60">
                        {formatDate(ex.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ex.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={async () => {
                              setUpdating(ex.id)
                              try {
                                const res = await fetch(`/api/exchanges/${ex.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: 'ACCEPTED' }),
                                })
                                if (res.ok) {
                                  setExchanges((prev) =>
                                    prev.map((e) =>
                                      e.id === ex.id ? { ...e, status: 'ACCEPTED' } : e
                                    )
                                  )
                                }
                              } finally {
                                setUpdating(null)
                              }
                            }}
                            disabled={updating === ex.id}
                            className="rounded-md bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/30 transition disabled:opacity-40"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              setUpdating(ex.id)
                              try {
                                const res = await fetch(`/api/exchanges/${ex.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: 'REJECTED' }),
                                })
                                if (res.ok) {
                                  setExchanges((prev) =>
                                    prev.map((e) =>
                                      e.id === ex.id ? { ...e, status: 'REJECTED' } : e
                                    )
                                  )
                                }
                              } finally {
                                setUpdating(null)
                              }
                            }}
                            disabled={updating === ex.id}
                            className="rounded-md bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30 transition disabled:opacity-40"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span
                          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            ex.status === 'ACCEPTED'
                              ? 'bg-green-500/15 text-green-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {ex.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Opportunities list */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-brand-text">Your Opportunities</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-lg border border-brand-accent/10 bg-brand-surface"
                  />
                ))}
              </div>
            ) : stats?.opportunities.length === 0 ? (
              <div className="rounded-lg border border-brand-accent/20 bg-brand-surface p-8 text-center">
                <p className="text-brand-text-muted">No opportunities posted yet</p>
                <Link
                  href="/opportunities"
                  className="mt-4 inline-block text-sm text-brand-accent hover:underline"
                >
                  Post your first opportunity →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.opportunities.map((opp) => {
                  const props = opp.properties as {
                    sector?: string
                    location?: string
                    country?: string
                  } | null
                  return (
                    <Link
                      key={opp.id}
                      href={`/exchange/${opp.id}`}
                      className="block rounded-lg border border-brand-accent/20 bg-brand-surface p-4 transition-colors hover:border-brand-accent/40"
                    >
                      <div className="flex items-start gap-3">
                        {opp.icon && <span className="text-xl leading-none">{opp.icon}</span>}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-brand-text">{opp.label}</p>
                          <p className="mt-1 text-xs text-brand-text-muted">
                            {[props?.sector, props?.location ?? props?.country]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                          <p className="mt-1 text-xs text-brand-text-muted">
                            Posted {formatDate(opp.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {/* Recent payments */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-brand-text">Recent Payments</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-lg border border-brand-accent/10 bg-brand-surface"
                  />
                ))}
              </div>
            ) : stats?.recentPayments.length === 0 ? (
              <div className="rounded-lg border border-brand-accent/20 bg-brand-surface p-8 text-center">
                <p className="text-brand-text-muted">No payments recorded yet</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-brand-accent/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-accent/20 bg-brand-surface">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-accent/10 bg-brand-surface">
                    {stats?.recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 font-medium text-brand-text">
                          {formatAmount(payment.amount, payment.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="px-4 py-3 text-brand-text-muted">
                          {formatDate(payment.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(stats?.totalPayments ?? 0) > 5 && (
              <Link
                href="/payments"
                className="mt-3 block text-center text-sm text-brand-accent hover:underline"
              >
                View all payments →
              </Link>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

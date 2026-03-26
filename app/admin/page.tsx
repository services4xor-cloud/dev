'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface AdminStats {
  explorers: number
  hosts: number
  nodes: { total: number; byType: Record<string, number> }
  edges: number
  payments: { total: number; byStatus: Record<string, number> }
  conversations: number
  recentUsers: {
    id: string
    name: string | null
    email: string | null
    role: string
    createdAt: string
  }[]
}

const NODE_TYPE_ORDER = [
  'COUNTRY',
  'LANGUAGE',
  'FAITH',
  'SECTOR',
  'CURRENCY',
  'LOCATION',
  'CULTURE',
  'SKILL',
  'EXPERIENCE',
  'USER',
]

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'text-green-400',
  PENDING: 'text-yellow-400',
  FAILED: 'text-red-400',
  REFUNDED: 'text-blue-400',
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-brand-accent/20 bg-brand-surface p-5">
      <p className="text-sm text-brand-text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold text-brand-accent">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const user = session?.user as { role?: string } | undefined
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (status === 'loading') return
    if (!isAdmin) {
      setLoading(false)
      return
    }

    fetch('/api/admin/stats')
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error((body as { error?: string }).error ?? 'Failed to load stats')
        }
        return res.json() as Promise<AdminStats>
      })
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unexpected error')
        setLoading(false)
      })
  }, [status, isAdmin])

  if (status === 'loading' || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted">Loading Hub...</p>
      </main>
    )
  }

  if (!session || !isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-bg">
        <p className="text-xl font-semibold text-brand-text">Access denied</p>
        <p className="text-brand-text-muted">This area is restricted to administrators.</p>
        <Link href="/" className="text-brand-accent underline hover:opacity-80">
          Back to map
        </Link>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-bg">
        <p className="text-xl font-semibold text-red-400">Error</p>
        <p className="text-brand-text-muted">{error}</p>
        <Link href="/" className="text-brand-accent underline hover:opacity-80">
          Back to map
        </Link>
      </main>
    )
  }

  if (!stats) return null

  const nodeTypes = NODE_TYPE_ORDER.filter((t) => t in stats.nodes.byType)
  const otherTypes = Object.keys(stats.nodes.byType).filter((t) => !NODE_TYPE_ORDER.includes(t))
  const orderedTypes = [...nodeTypes, ...otherTypes]

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      {/* Header */}
      <header className="border-b border-brand-accent/20 bg-brand-surface px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">Admin Hub</h1>
            <p className="text-sm text-brand-text-muted">Be[X] Platform Overview</p>
          </div>
          <Link
            href="/"
            className="rounded-md border border-brand-accent/30 px-4 py-2 text-sm text-brand-accent transition-opacity hover:opacity-80"
          >
            Back to map
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Primary stat cards */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-text-muted">
            Platform Stats
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total Explorers" value={stats.explorers} />
            <StatCard label="Total Hosts" value={stats.hosts} />
            <StatCard label="Total Nodes" value={stats.nodes.total} />
            <StatCard label="Total Edges" value={stats.edges} />
            <StatCard label="Total Payments" value={stats.payments.total} />
            <StatCard label="Active Conversations" value={stats.conversations} />
          </div>
        </section>

        {/* Node breakdown + Payment breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Nodes by type */}
          <section className="rounded-lg border border-brand-accent/20 bg-brand-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-text-muted">
              Nodes by Type
            </h2>
            <div className="flex flex-wrap gap-2">
              {orderedTypes.map((type) => (
                <span
                  key={type}
                  className="flex items-center gap-1.5 rounded-full border border-brand-accent/20 px-3 py-1 text-xs"
                >
                  <span className="font-medium text-brand-accent">{stats.nodes.byType[type]}</span>
                  <span className="text-brand-text-muted">{type}</span>
                </span>
              ))}
            </div>
          </section>

          {/* Payments by status */}
          <section className="rounded-lg border border-brand-accent/20 bg-brand-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-text-muted">
              Payments by Status
            </h2>
            {Object.keys(stats.payments.byStatus).length === 0 ? (
              <p className="text-sm text-brand-text-muted">No payment data</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats.payments.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${PAYMENT_STATUS_COLORS[status] ?? 'text-brand-text'}`}
                    >
                      {status}
                    </span>
                    <span className="text-sm text-brand-text-muted">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Recent users table */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-text-muted">
            Recent Users
          </h2>
          <div className="overflow-x-auto rounded-lg border border-brand-accent/20 bg-brand-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-accent/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-accent/10">
                {stats.recentUsers.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-brand-accent/5">
                    <td className="px-4 py-3 font-medium text-brand-text">{u.name ?? '—'}</td>
                    <td className="px-4 py-3 text-brand-text-muted">{u.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-brand-accent/30 px-2 py-0.5 text-xs text-brand-accent">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-text-muted">
                      {new Date(u.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
                {stats.recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-brand-text-muted">
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

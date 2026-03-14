'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Payment {
  id: string
  amount: number
  currency: string
  method: string
  status: string
  description: string | null
  createdAt: string
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCESS: 'bg-green-500/15 text-green-400 border-green-500/30',
    PENDING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    FAILED: 'bg-red-500/15 text-red-400 border-red-500/30',
    REFUNDED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  }
  const cls = styles[status] ?? 'bg-brand-surface text-brand-text-muted border-brand-accent/20'
  return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>
}

function MethodBadge({ method }: { method: string }) {
  const styles: Record<string, string> = {
    MPESA: 'bg-green-500/15 text-green-400 border-green-500/30',
    STRIPE: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    FLUTTERWAVE: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    PAYPAL: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    SEPA: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  }
  const cls = styles[method] ?? 'bg-brand-surface text-brand-text-muted border-brand-accent/20'
  return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{method}</span>
}

// Desktop table row
function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <tr className="border-b border-brand-accent/10 last:border-0">
      <td className="px-4 py-3 text-sm text-brand-text-muted">{payment.description ?? '—'}</td>
      <td className="px-4 py-3 text-sm font-medium text-brand-text">
        {formatAmount(payment.amount, payment.currency)}
      </td>
      <td className="px-4 py-3">
        <MethodBadge method={payment.method} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={payment.status} />
      </td>
      <td className="px-4 py-3 text-sm text-brand-text-muted">{formatDate(payment.createdAt)}</td>
    </tr>
  )
}

// Mobile card
function PaymentCard({ payment }: { payment: Payment }) {
  return (
    <div className="rounded-lg border border-brand-accent/20 bg-brand-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-brand-text">
            {payment.description ?? 'Payment'}
          </p>
          <p className="mt-0.5 text-xs text-brand-text-muted">{formatDate(payment.createdAt)}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-brand-text">
          {formatAmount(payment.amount, payment.currency)}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <MethodBadge method={payment.method} />
        <StatusBadge status={payment.status} />
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    fetch('/api/payments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load payments')
        return res.json() as Promise<Payment[]>
      })
      .then(setPayments)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [status])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-brand-text-muted">Loading...</p>
      </div>
    )
  }

  // Suppress unused variable warning — session is checked implicitly via status
  void session

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Header */}
      <header className="border-b border-brand-accent/20 bg-brand-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
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

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
            Payment History
          </h1>
          <p className="mt-1 text-sm text-brand-text-muted">All transactions on your account</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg border border-brand-accent/10 bg-brand-surface"
              />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-lg border border-brand-accent/20 bg-brand-surface py-16 text-center">
            <p className="text-brand-text-muted">No payments yet</p>
            <Link
              href="/discovery"
              className="mt-4 inline-block text-sm text-brand-accent hover:underline"
            >
              Explore opportunities →
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-lg border border-brand-accent/20 md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-accent/20 bg-brand-surface">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-brand-surface">
                  {payments.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>

            <p className="mt-4 text-right text-xs text-brand-text-muted">
              {payments.length} transaction{payments.length !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </main>
    </div>
  )
}

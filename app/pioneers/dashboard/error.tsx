'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PioneerDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Pioneer Dashboard Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-primary flex items-center justify-center text-3xl border border-brand-accent/30">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Dashboard unavailable</h2>
        <p className="text-gray-400 text-sm mb-6">
          We couldn&apos;t load your Pioneer dashboard. This might be a temporary issue.
        </p>
        {error?.message && (
          <p className="text-xs text-gray-400 mb-6 px-4 py-2 rounded-lg bg-gray-900/60 font-mono">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-accent text-brand-bg hover:opacity-90 active:scale-95 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-900 text-brand-accent border border-brand-primary hover:opacity-90 transition-all"
          >
            Return Home
          </Link>
        </div>
        {error?.digest && <p className="mt-6 text-xs text-gray-600">Error ID: {error.digest}</p>}
      </div>
    </div>
  )
}

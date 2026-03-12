'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[BeNetwork Admin Error]', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl"
          style={{
            backgroundColor: 'var(--color-primary)',
            border: '2px solid var(--color-accent)',
          }}
        >
          ⚙️
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-accent)' }}>
          Admin panel error
        </h1>
        <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
          Something went wrong loading the admin dashboard.
        </p>
        {error?.message && (
          <p
            className="text-xs mb-6 px-4 py-2 rounded-lg font-mono"
            style={{ color: '#9CA3AF', backgroundColor: 'var(--color-surface-2)' }}
          >
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-primary)',
            }}
          >
            Return to Compass
          </Link>
        </div>
        {error?.digest && (
          <p className="mt-6 text-xs" style={{ color: '#4B5563' }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}

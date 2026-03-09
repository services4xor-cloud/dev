'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[BeKenya Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A12' }}>
      <div className="max-w-md w-full text-center">
        {/* Lion logo / emblem */}
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl"
          style={{ backgroundColor: '#5C0A14', border: '2px solid #C9A227' }}
        >
          🦁
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-black mb-2" style={{ color: '#C9A227' }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>
          Something went wrong on this route.
        </p>

        {/* Error detail */}
        {error?.message && (
          <p className="text-xs mt-2 mb-6 px-4 py-2 rounded-lg font-mono" style={{ color: '#6B7280', backgroundColor: '#1A1A25' }}>
            {error.message}
          </p>
        )}
        {!error?.message && <div className="mb-6" />}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#C9A227', color: '#0A0A12' }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#1A1A25', color: '#C9A227', border: '1px solid #5C0A14' }}
          >
            Return to Compass
          </Link>
        </div>

        {/* Digest for support */}
        {error?.digest && (
          <p className="mt-6 text-xs" style={{ color: '#4B5563' }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}

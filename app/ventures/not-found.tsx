'use client'

import Link from 'next/link'
import { Compass } from 'lucide-react'

/**
 * 404 for /ventures — fallback if a sub-route doesn't match.
 */
export default function VenturesNotFound() {
  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl"
          style={{
            backgroundColor: 'var(--color-primary)',
            border: '2px solid var(--color-accent)',
          }}
        >
          🗺️
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-accent)' }}>
          Path not found
        </h1>
        <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
          This Path or Venture doesn&apos;t exist. Browse all available Paths and Ventures to find
          your match.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/exchange"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <Compass className="w-4 h-4" />
            Browse All Ventures
          </Link>
          <Link
            href="/compass"
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-primary)',
            }}
          >
            Open Compass
          </Link>
        </div>
      </div>
    </div>
  )
}

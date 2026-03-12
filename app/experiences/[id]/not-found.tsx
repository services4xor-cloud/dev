'use client'

import Link from 'next/link'
import { Compass } from 'lucide-react'

/**
 * 404 for /experiences/[id] — when package ID doesn't match any safari package.
 */
export default function ExperienceNotFound() {
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
          🌍
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-accent)' }}>
          Venture not found
        </h1>
        <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
          This experience may have been removed or the link is incorrect. Explore our other Ventures
          to find your next adventure.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/exchange"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <Compass className="w-4 h-4" />
            Browse Ventures
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-primary)',
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

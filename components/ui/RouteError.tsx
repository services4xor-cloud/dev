'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface RouteErrorProps {
  emoji: string
  title: string
  description: string
  error: Error & { digest?: string }
  reset: () => void
  returnHref?: string
  returnLabel?: string
  retryLabel?: string
  contextLabel?: string
}

export default function RouteError({
  emoji,
  title,
  description,
  error,
  reset,
  returnHref = '/',
  returnLabel = 'Return Home',
  retryLabel = 'Try Again',
  contextLabel = 'Route',
}: RouteErrorProps) {
  useEffect(() => {
    console.error(`[${contextLabel} Error]`, error)
  }, [error, contextLabel])

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-primary flex items-center justify-center text-3xl border border-brand-accent/30">
          {emoji}
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
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
            {retryLabel}
          </button>
          <Link
            href={returnHref}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-900 text-brand-accent border border-brand-primary hover:opacity-90 transition-all"
          >
            {returnLabel}
          </Link>
        </div>
        {error?.digest && <p className="mt-6 text-xs text-gray-600">Error ID: {error.digest}</p>}
      </div>
    </div>
  )
}

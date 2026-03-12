'use client'

import Link from 'next/link'

/**
 * /compass — Route Compass
 * Smart wizard helping Pioneers find the best Route (country corridor).
 * TODO: Wire to /api/compass (fully implemented but not connected to UI)
 */
export default function CompassPage() {
  return (
    <main className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-center py-16 px-4 max-w-lg">
        <p className="text-phi-2xl mb-4">🧭</p>
        <h1 className="text-phi-xl font-bold text-white mb-3">Route Compass</h1>
        <p className="text-white/60 mb-6">
          The Compass helps you find your ideal Route — the best country corridor for your skills,
          languages, and goals. Coming soon with AI-powered recommendations.
        </p>
        <Link
          href="/exchange"
          className="inline-block bg-brand-accent text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-colors"
        >
          Explore Paths &rarr;
        </Link>
      </div>
    </main>
  )
}

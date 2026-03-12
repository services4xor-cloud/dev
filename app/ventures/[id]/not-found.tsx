import Link from 'next/link'

export default function VentureDetailNotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-primary flex items-center justify-center text-3xl border border-brand-accent/30">
          🗺️
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Path not found</h2>
        <p className="text-gray-400 text-sm mb-6">
          This Path or Venture doesn&apos;t exist or may have been closed by the Anchor.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/exchange"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-accent text-brand-bg hover:opacity-90 transition-all"
          >
            Browse Ventures
          </Link>
          <Link
            href="/compass"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-900 text-brand-accent border border-brand-primary hover:opacity-90 transition-all"
          >
            Open Compass
          </Link>
        </div>
      </div>
    </div>
  )
}

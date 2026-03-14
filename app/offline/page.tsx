'use client'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 text-center">
      <h1 className="mb-4 text-3xl font-bold text-brand-accent">You&apos;re Offline</h1>
      <p className="mb-6 text-brand-text-muted">Check your connection and try again.</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-medium text-brand-accent"
      >
        Retry
      </button>
    </div>
  )
}

'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4">
      <h1 className="mb-4 text-2xl font-bold text-brand-accent">Something went wrong</h1>
      <p className="mb-6 text-sm text-brand-text-muted">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-medium text-brand-accent transition hover:opacity-90"
      >
        Try again
      </button>
      <a href="/" className="mt-4 text-sm text-brand-text-muted hover:text-brand-accent transition">
        ← Back to Map
      </a>
    </div>
  )
}

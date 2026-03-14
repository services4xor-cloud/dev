import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4">
      <h1 className="mb-2 text-6xl font-bold text-brand-accent">404</h1>
      <p className="mb-6 text-brand-text-muted">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-medium text-brand-accent transition hover:opacity-90"
      >
        Back to Map
      </Link>
    </div>
  )
}

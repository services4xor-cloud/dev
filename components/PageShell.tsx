import Link from 'next/link'
import Footer from '@/components/Footer'

interface PageShellProps {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
  /** Override the header logo text (default: "Be[X]") */
  title?: string
}

export default function PageShell({
  children,
  backHref = '/',
  backLabel = '← Back to Map',
  title,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <header className="border-b border-brand-accent/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <h1 className="min-w-0 truncate text-lg font-bold text-brand-accent sm:text-xl">
            {title ?? 'Be[X]'}
          </h1>
          <Link
            href={backHref}
            className="shrink-0 text-sm text-brand-text-muted transition hover:text-brand-accent"
          >
            {backLabel}
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  )
}

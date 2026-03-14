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
      <header className="border-b border-brand-accent/20 bg-brand-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold text-brand-accent hover:opacity-80 transition-opacity"
          >
            {title ?? 'Be[X]'}
          </Link>
          <Link
            href={backHref}
            className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors"
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

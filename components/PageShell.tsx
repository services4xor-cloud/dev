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
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">{title ?? 'Be[X]'}</h1>
          </div>
          <Link
            href={backHref}
            className="text-sm text-brand-text-muted hover:text-brand-accent transition"
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

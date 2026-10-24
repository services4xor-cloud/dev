interface PageShellProps {
  children: React.ReactNode
  /** Page heading */
  title?: string
  /** Short line under the heading */
  intro?: string
  /** Small label above the heading */
  eyebrow?: string
  /** Max content width */
  width?: 'narrow' | 'wide'
}

/**
 * Content page frame. Header and footer come from the root layout (SiteChrome);
 * this adds the heading block and the content column.
 */
export default function PageShell({
  children,
  title,
  intro,
  eyebrow,
  width = 'wide',
}: PageShellProps) {
  return (
    <main
      className={`mx-auto w-full px-4 pb-8 pt-10 sm:px-6 sm:pt-14 ${width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl'}`}
    >
      {(title || eyebrow) && (
        <div className="mb-8 sm:mb-10">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          {title && (
            <h1 className="font-display text-4xl font-medium leading-[1.08] text-brand-text sm:text-5xl">
              {title}
            </h1>
          )}
          {intro && <p className="mt-4 max-w-2xl text-lg text-brand-text-muted">{intro}</p>}
        </div>
      )}
      {children}
    </main>
  )
}

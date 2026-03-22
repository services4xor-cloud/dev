import PageShell from '@/components/PageShell'

export default function ContactPage() {
  return (
    <PageShell backLabel="← Back">
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold text-brand-text">Get in Touch</h2>
          <p className="max-w-xl text-brand-text-muted">
            We&apos;d love to hear from you. Whether you&apos;re an Explorer looking for
            opportunities, a Host with offerings to share, or have feedback about the platform —
            reach out.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Email */}
          <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/20">
              <svg
                className="h-5 w-5 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-sm font-medium text-brand-text-muted uppercase tracking-wide">
              Email
            </h3>
            <a
              href="mailto:services4xor@gmail.com"
              className="text-brand-accent transition-opacity hover:opacity-80"
            >
              services4xor@gmail.com
            </a>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/20">
              <svg
                className="h-5 w-5 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-sm font-medium text-brand-text-muted uppercase tracking-wide">
              Location
            </h3>
            <p className="text-brand-text">Nairobi, Kenya</p>
          </div>

          {/* Platform */}
          <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/20">
              <svg
                className="h-5 w-5 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-sm font-medium text-brand-text-muted uppercase tracking-wide">
              Platform
            </h3>
            <p className="text-brand-text">
              Be[X] — <span className="text-brand-accent">BeNetwork</span>
            </p>
          </div>
        </div>

        {/* Divider + note */}
        <div className="mt-16 border-t border-brand-accent/10 pt-12">
          <p className="text-sm text-brand-text-muted">
            We typically respond within 1–2 business days. For urgent matters, email directly and
            mention &ldquo;urgent&rdquo; in the subject line.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

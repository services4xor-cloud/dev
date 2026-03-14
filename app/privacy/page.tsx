import PageShell from '@/components/PageShell'

const sections = [
  {
    id: 'what-we-collect',
    title: 'What We Collect',
    content: [
      'Identity dimensions you provide: country, tribe, language, faith, craft, skills, and any other dimensions you choose to add to your profile.',
      'Account information: email address, display name, and profile photo (if signing in via Google).',
      'Graph connections: the corridors, opportunities, and experiences you engage with on the platform.',
      'Payment records: transaction amounts, currency, method (M-Pesa / Stripe), and status. We do not store raw card numbers or M-Pesa PINs.',
      'Usage data: pages visited, discovery queries, and interactions — to improve routing and relevance.',
      'Device and browser information: IP address, browser type, and operating system for security and fraud prevention.',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use It',
    content: [
      'Route you to opportunities, experiences, and connections that match your identity dimensions.',
      'Power the Discovery engine — surfacing corridors, Hosts, and Explorers whose dimensions overlap with yours.',
      'Process payments for experiences and opportunities via M-Pesa (Kenya) or Stripe (international).',
      'Send transactional emails: sign-in links, payment confirmations, and opportunity updates via Resend.',
      'Improve platform recommendations through aggregated, anonymised analytics.',
      'Detect and prevent fraud, abuse, and unauthorised access.',
      'We do not sell your data. We do not use your identity dimensions for advertising profiling.',
    ],
  },
  {
    id: 'data-storage',
    title: 'Data Storage',
    content: [
      'Data is stored in a PostgreSQL database hosted on Neon (EU region, SOC 2 Type II certified).',
      'Authentication tokens are short-lived JWTs stored in secure, httpOnly cookies.',
      'Payment records are retained for 7 years to comply with financial regulations in Kenya and the EU.',
      'Profile data is retained for as long as your account is active. You may request deletion at any time.',
      'Backups are encrypted at rest and retained for 30 days.',
      'All data in transit is encrypted via TLS 1.3.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: [
      'Access: request a full export of your data at any time via contact@benetwork.app.',
      'Correction: update your identity dimensions and profile details directly in your account settings.',
      'Deletion: request account deletion — we will remove your personal data within 30 days, subject to legal retention requirements.',
      'Portability: receive your identity dimension data and graph connections in JSON format on request.',
      'Objection: opt out of analytics tracking by contacting us. Core platform functionality remains available.',
      'For EU/EEA Explorers: these rights are guaranteed under GDPR. For Kenya residents: rights are provided under the Kenya Data Protection Act, 2019.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: [
      'Session cookie (next-auth.session-token): required for authentication. HttpOnly, Secure, SameSite=Lax. Expires after 30 days of inactivity.',
      'CSRF cookie (next-auth.csrf-token): required for form security. Session-scoped.',
      'We do not use third-party advertising cookies or cross-site tracking pixels.',
      'Analytics are server-side and do not require any cookies on your device.',
      'You can clear cookies at any time via your browser settings. Doing so will sign you out.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    content: [
      'Data Controller: Be[X] / BeNetwork (services4xor-cloud)',
      'Email: contact@benetwork.app',
      'For data requests, corrections, or deletion: privacy@benetwork.app',
      'We aim to respond to all privacy requests within 10 business days.',
      'This policy was last updated: March 2026.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-brand-text-muted">
            How Be[X] collects, uses, and protects your identity data.
          </p>
          <p className="mt-1 text-sm text-brand-text-muted">Last updated: March 2026</p>
        </div>

        {/* Table of contents */}
        <nav className="mb-12 rounded-lg border border-brand-accent/20 bg-brand-surface p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
            Contents
          </p>
          <ol className="space-y-2">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-brand-text transition-colors hover:text-brand-accent"
                >
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <h2 className="text-xl font-semibold text-brand-text">
                <span className="mr-2 text-brand-accent/60">{i + 1}.</span>
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent/50" />
                    <p className="text-sm leading-relaxed text-brand-text-muted">{item}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-lg border border-brand-accent/20 bg-brand-surface p-6">
          <p className="font-semibold text-brand-text">Questions about your data?</p>
          <p className="mt-1 text-sm text-brand-text-muted">
            Contact us at{' '}
            <a href="mailto:privacy@benetwork.app" className="text-brand-accent hover:underline">
              privacy@benetwork.app
            </a>{' '}
            — we respond within 10 business days.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

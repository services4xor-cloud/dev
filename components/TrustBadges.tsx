const badges = [
  {
    label: 'Identity Verified',
    detail: 'Every Explorer profile is dimension-verified',
    icon: '✓',
  },
  {
    label: 'Secure Payments',
    detail: 'M-Pesa and Stripe with end-to-end encryption',
    icon: '🔒',
  },
  {
    label: 'Privacy First',
    detail: 'Your identity data stays yours — always',
    icon: '🛡',
  },
  {
    label: 'Global Network',
    detail: '120+ countries connected through identity corridors',
    icon: '🌍',
  },
]

export default function TrustBadges() {
  return (
    <section className="border-t border-brand-accent/10 bg-brand-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center text-center">
              <span className="text-2xl">{badge.icon}</span>
              <p className="mt-3 font-semibold text-brand-text">{badge.label}</p>
              <p className="mt-1 text-sm text-brand-text-muted">{badge.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

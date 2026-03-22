import Link from 'next/link'
import PageShell from '@/components/PageShell'

interface PricingTier {
  name: string
  badge?: string
  price: string
  priceNote?: string
  description: string
  features: string[]
  highlighted: boolean
  cta: string
  ctaHref: string
  comingSoon: boolean
}

const tiers: PricingTier[] = [
  {
    name: 'Explorer',
    price: 'Free',
    description: 'Everything you need to discover your route and connect with the world.',
    features: [
      'Create your identity profile',
      'Browse opportunities',
      'Use Discovery wizard',
      'Connect with other Explorers',
      'AI Agent conversations',
    ],
    highlighted: true,
    cta: 'Get Started',
    ctaHref: '/signup',
    comingSoon: false,
  },
  {
    name: 'Host',
    badge: 'Coming Soon',
    price: 'Contact us',
    description: 'Post opportunities and find the right Explorers for your organisation.',
    features: [
      'Post unlimited Opportunities',
      'Featured listings',
      'Analytics dashboard',
      'Priority support',
      'Exchange management tools',
    ],
    highlighted: false,
    cta: 'Contact Us',
    ctaHref: '/contact',
    comingSoon: true,
  },
  {
    name: 'Enterprise',
    badge: 'Coming Soon',
    price: 'Contact us',
    description: 'Custom solutions for organisations operating across multiple corridors.',
    features: [
      'Everything in Host',
      'Custom Route corridors',
      'API access',
      'Dedicated support',
      'White-label options',
    ],
    highlighted: false,
    cta: 'Contact Us',
    ctaHref: '/contact',
    comingSoon: true,
  },
]

export default function PricingPage() {
  return (
    <PageShell backLabel="← Back">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-brand-text">Simple, Honest Pricing</h2>
          <p className="mx-auto max-w-xl text-brand-text-muted">
            Start free as an Explorer. When you&apos;re ready to post Opportunities and grow your
            network as a Host, we&apos;ll be ready for you.
          </p>
        </div>

        {/* Tiers grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={[
                'relative flex flex-col rounded-2xl border p-8 transition-shadow',
                tier.highlighted
                  ? 'border-brand-accent/50 bg-brand-surface shadow-[0_0_40px_rgba(201,162,39,0.08)]'
                  : 'border-brand-accent/15 bg-brand-surface/60',
              ].join(' ')}
            >
              {/* Badge */}
              {tier.badge && (
                <span className="absolute right-6 top-6 rounded-full bg-brand-primary/30 px-3 py-0.5 text-xs font-medium text-brand-accent">
                  {tier.badge}
                </span>
              )}

              {/* Tier name */}
              <h3 className="mb-2 text-lg font-semibold text-brand-text">{tier.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span
                  className={[
                    'text-3xl font-bold',
                    tier.highlighted ? 'text-brand-accent' : 'text-brand-text',
                  ].join(' ')}
                >
                  {tier.price}
                </span>
              </div>

              {/* Description */}
              <p className="mb-6 text-sm text-brand-text-muted">{tier.description}</p>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-brand-text">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.ctaHref}
                className={[
                  'block rounded-xl px-6 py-3 text-center text-sm font-semibold transition-opacity',
                  tier.highlighted
                    ? 'bg-brand-primary text-white hover:opacity-90'
                    : 'border border-brand-accent/30 text-brand-accent hover:border-brand-accent/60',
                ].join(' ')}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 border-t border-brand-accent/10 pt-12 text-center">
          <p className="text-sm text-brand-text-muted">
            All plans include access to the full Be[X] network. Explorers always free.{' '}
            <Link href="/contact" className="text-brand-accent hover:opacity-80 transition-opacity">
              Questions? Contact us.
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  )
}

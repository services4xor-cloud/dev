import Link from 'next/link'
import Image from 'next/image'
import {
  FOOTER_PIONEER_LINKS as PIONEER_LINKS,
  FOOTER_ANCHOR_LINKS as ANCHOR_LINKS,
  FOOTER_DISCOVER_LINKS as DISCOVER_LINKS,
  FOOTER_COMPANY_LINKS as COMPANY_LINKS,
} from '@/lib/nav-structure'

// ── Component ──────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-bg border-t border-brand-accent/15">
      <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-phi-7 3xl:py-phi-8">
        {/* Top — brand + columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
              aria-label="Be[Country] — Home"
            >
              <Image src="/logo.svg" alt="Be[Country] compass" width={36} height={36} unoptimized />
              <span className="text-brand-accent font-bold text-lg tracking-wide">Be[Country]</span>
            </Link>
            <p className="text-[#9D9BAA] text-sm leading-relaxed max-w-xs">
              An identity-first compass. Find where you belong — work, live, experience, and build
              across countries. Starting with Kenya.
            </p>
            <p className="mt-4 text-xs text-[#9D9BAA]/60">
              5% of every booking supports UTAMADUNI community projects.
            </p>
          </div>

          {/* Pioneers */}
          <FooterColumn title="For Pioneers" links={PIONEER_LINKS} />

          {/* Anchors */}
          <FooterColumn title="For Anchors" links={ANCHOR_LINKS} />

          {/* Discover + Company */}
          <div className="space-y-6">
            <FooterColumn title="Discover" links={DISCOVER_LINKS} />
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-accent/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#9D9BAA]/70">
          <span>© {year} BeKenya Family Ltd. Built for dignity, everywhere.</span>
          <span className="flex items-center gap-2">
            <span>🇰🇪 Nairobi</span>
            <span aria-hidden="true">·</span>
            <span>M-Pesa · Stripe · Flutterwave</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

// ── Helper ─────────────────────────────────────────────────────────
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h3 className="text-brand-text font-semibold text-sm mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[#9D9BAA] text-sm hover:text-brand-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

import Link from 'next/link'
import { COUNTRIES } from '@/lib/countries'

const CC = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase() as keyof typeof COUNTRIES
const COUNTRY_FLAG: Record<string, string> = {
  KE: '🇰🇪',
  DE: '🇩🇪',
  CH: '🇨🇭',
  TH: '🇹🇭',
  NG: '🇳🇬',
  GB: '🇬🇧',
}
const flag = COUNTRY_FLAG[CC] ?? '🌍'
import {
  FOOTER_PIONEER_LINKS as PIONEER_LINKS,
  FOOTER_ANCHOR_LINKS as ANCHOR_LINKS,
  FOOTER_DISCOVER_LINKS as DISCOVER_LINKS,
  FOOTER_COMPANY_LINKS as COMPANY_LINKS,
} from '@/lib/nav-structure'
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  IMPACT_PARTNER,
  CONTACT,
  LEGAL,
  PAYMENT_BADGES,
} from '@/data/mock'

// ── Component ──────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-brand-bg relative">
      {/* Gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />
      <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-phi-7 3xl:py-phi-8">
        {/* Top — brand + columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-phi-6 mb-phi-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
              aria-label={`${BRAND_NAME} — Home`}
            >
              <span
                className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary border border-brand-accent/40 text-lg"
                role="img"
                aria-label={`${BRAND_NAME} logo`}
              >
                {flag}
              </span>
              <span className="text-brand-accent font-bold text-lg tracking-wide">
                {BRAND_NAME}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{BRAND_TAGLINE}</p>
            <p className="mt-4 text-xs text-gray-400/60">
              {IMPACT_PARTNER.sharePercent} of every booking supports {IMPACT_PARTNER.name}{' '}
              community projects.
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

        {/* Social links */}
        <div className="flex items-center gap-4 mb-6">
          {CONTACT.socialLinks &&
            Object.entries(CONTACT.socialLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400/70 hover:text-brand-accent transition-colors text-sm capitalize"
                aria-label={`${BRAND_NAME} on ${platform}`}
              >
                {platform === 'instagram' && '📸'}
                {platform === 'facebook' && '👥'}
                {platform === 'tiktok' && '🎵'} {platform}
              </a>
            ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-accent/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-400/70">
          <span>
            © {LEGAL.copyrightYear} {LEGAL.companyName}. Inc. {LEGAL.incorporationNumber}. Built for
            dignity, everywhere.
          </span>
          <span className="flex items-center gap-2">
            <span>{CONTACT.location}</span>
            <span aria-hidden="true">·</span>
            <span>{PAYMENT_BADGES.map((b) => b.name).join(' · ')}</span>
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
              className="text-gray-400 text-sm hover:text-brand-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

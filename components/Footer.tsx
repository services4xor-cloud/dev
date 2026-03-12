import Link from 'next/link'
import { FOOTER_LINKS } from '@/lib/nav-structure'
import { BRAND_NAME, CONTACT, LEGAL } from '@/data/mock'

// ── Component ──────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-brand-bg relative">
      {/* Gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />

      <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-phi-6">
        {/* Links row — horizontal on desktop, stacked on mobile */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6"
        >
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-400 text-sm hover:text-brand-accent transition-colors duration-150
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Social links */}
        {CONTACT.socialLinks && (
          <div className="flex items-center justify-center gap-4 mb-6">
            {Object.entries(CONTACT.socialLinks).map(([platform, url]) => (
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
        )}

        {/* Copyright */}
        <div className="border-t border-brand-accent/10 pt-6 text-center text-xs text-gray-400/70">
          <span>
            © {new Date().getFullYear()} {LEGAL.companyName}. Inc. {LEGAL.incorporationNumber}.
            Built for dignity, everywhere.
          </span>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import { FOOTER_COLUMNS } from '@/lib/nav-structure'
import { BRAND_NAME, CONTACT, LEGAL } from '@/data/mock'
import { VOCAB } from '@/lib/vocabulary'

// ── Component ──────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-brand-bg relative">
      {/* Gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />

      <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-phi-6">
        {/* Brand header */}
        <div className="mb-phi-5">
          <h2 className="text-phi-xl font-bold text-white">The {BRAND_NAME}</h2>
          <p className="text-white/50 text-phi-sm mt-1">{VOCAB.tagline}</p>
        </div>

        {/* 4-column grid */}
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-phi-5"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-brand-accent text-phi-sm font-bold uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-gray-400 text-sm hover:text-white transition-colors duration-150
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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

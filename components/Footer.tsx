'use client'

import Link from 'next/link'

const footerLinks = {
  Explore: [
    { label: 'Discovery', href: '/discovery' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Explorers', href: '/explorers' },
  ],
  Account: [
    { label: 'Sign In', href: '/login' },
    { label: 'Sign Up', href: '/signup' },
    { label: 'My Identity', href: '/me' },
  ],
  About: [
    { label: 'About', href: '/about' },
    { label: 'Privacy', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-brand-accent/20 bg-brand-bg">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-1 lg:col-span-1">
            <p className="text-xl font-bold text-brand-accent">Be[X]</p>
            <p className="mt-2 text-sm text-brand-text-muted leading-relaxed">
              Identity-first life routing
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-brand-text transition-colors hover:text-brand-accent"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-brand-accent/10 pt-6 text-center">
          <p className="text-xs text-brand-text-muted">© 2026 Be[X]. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

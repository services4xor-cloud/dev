'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

// ──────────────────────────────────────────────
// Primary nav links
// ──────────────────────────────────────────────
const PRIMARY_LINKS = [
  { href: '/ventures',    label: 'Ventures',    aria: 'Explore venture opportunities' },
  { href: '/compass',     label: 'Compass',     aria: 'Get career guidance and find your path' },
  { href: '/experiences', label: 'Experiences', aria: 'Safari and cultural experiences' },
  { href: '/charity',     label: 'Charity',     aria: 'UTAMADUNI charity programmes' },
  { href: '/pricing',     label: 'Pricing',     aria: 'View pricing plans' },
]

// "About" dropdown entries
const ABOUT_LINKS = [
  { href: '/about',    label: 'About BeKenya',        aria: 'Learn about BeKenya' },
  { href: '/business', label: 'BeKenya Family Ltd',   aria: 'BeKenya business and legal structure' },
  { href: '/referral', label: 'Referral Programme',   aria: 'Join our referral programme' },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const pathname = usePathname()
  const aboutRef = useRef<HTMLDivElement>(null)
  const mobileMenuId = 'mobile-navigation-menu'

  // Close "About" dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setAboutOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isAboutActive = ABOUT_LINKS.some(l => isActive(l.href))

  return (
    <header>
      {/* Skip to main content — visible on focus for keyboard users */}
      <a
        href="#main-content"
        className="skip-to-content focus:not-sr-only"
      >
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="bg-[#5C0A14] border-b border-[#C9A227]/30 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] rounded-lg"
              aria-label="BeKenya — Home"
            >
              <Image
                src="/logo-bekenya.svg"
                alt="BeKenya — Find where you belong"
                width={40}
                height={40}
                className="rounded-md"
                priority
              />
              <span
                className="text-xl font-bold text-[#C9A227] tracking-wide"
                aria-hidden="true"
              >
                BeKenya
              </span>
            </Link>

            {/* ── Desktop primary links ── */}
            <ul className="hidden md:flex items-center gap-1 list-none" role="list">
              {PRIMARY_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] ${
                      isActive(link.href)
                        ? 'bg-[#C9A227]/15 text-[#C9A227]'
                        : 'text-[#C9A227]/80 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* About dropdown */}
              <li>
                <div className="relative" ref={aboutRef}>
                  <button
                    onClick={() => setAboutOpen(v => !v)}
                    aria-expanded={aboutOpen}
                    aria-haspopup="true"
                    aria-controls="about-dropdown"
                    aria-label="About BeKenya — expand for sub-pages"
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] ${
                      isAboutActive
                        ? 'bg-[#C9A227]/15 text-[#C9A227]'
                        : 'text-[#C9A227]/80 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
                    }`}
                  >
                    About
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {aboutOpen && (
                    <ul
                      id="about-dropdown"
                      role="list"
                      className="absolute left-0 top-full mt-1.5 w-56 bg-[#3D0610] border border-[#C9A227]/30 rounded-2xl shadow-xl py-1.5 z-50 list-none"
                    >
                      {ABOUT_LINKS.map(link => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setAboutOpen(false)}
                            aria-label={link.aria}
                            aria-current={isActive(link.href) ? 'page' : undefined}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors rounded-xl mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
                              isActive(link.href)
                                ? 'bg-[#C9A227]/15 text-[#C9A227]'
                                : 'text-[#C9A227]/70 hover:bg-[#C9A227]/10 hover:text-[#C9A227]'
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            </ul>

            {/* ── Desktop auth / CTA ── */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/anchors/dashboard"
                aria-label="Anchors dashboard — manage your listings"
                aria-current={isActive('/anchors/dashboard') ? 'page' : undefined}
                className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] rounded-md px-1 ${
                  isActive('/anchors/dashboard')
                    ? 'text-[#C9A227]'
                    : 'text-[#C9A227]/70 hover:text-[#C9A227]'
                }`}
              >
                Anchors
              </Link>
              <Link
                href="/login"
                aria-label="Sign in to your BeKenya account"
                className="text-sm font-medium text-[#C9A227]/70 hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] rounded-md px-1"
              >
                Sign In
              </Link>
              <Link
                href="/compass"
                aria-label="Start My Compass — find your path with BeKenya"
                className="bg-[#FF6B35] text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-orange-500 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14]"
              >
                Start My Compass
              </Link>
            </div>

            {/* ── Mobile menu toggle ── */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl text-[#C9A227]/80 hover:text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14]"
            >
              {mobileOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          id={mobileMenuId}
          hidden={!mobileOpen}
          className={`md:hidden border-t border-[#C9A227]/20 bg-[#3D0610] px-4 py-4 space-y-1 ${mobileOpen ? '' : 'hidden'}`}
        >
          <ul role="list" className="list-none space-y-1">
            {PRIMARY_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-label={link.aria}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
                    isActive(link.href)
                      ? 'bg-[#C9A227]/15 text-[#C9A227]'
                      : 'text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* About section in mobile */}
          <div className="pt-2">
            <p className="px-4 pt-1 pb-1 text-xs font-semibold text-[#C9A227]/50 uppercase tracking-wider">
              About
            </p>
            <ul role="list" className="list-none space-y-1">
              {ABOUT_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
                      isActive(link.href)
                        ? 'bg-[#C9A227]/15 text-[#C9A227]'
                        : 'text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth / CTA */}
          <div className="pt-3 border-t border-[#C9A227]/20 space-y-2">
            <Link
              href="/anchors/dashboard"
              onClick={() => setMobileOpen(false)}
              aria-label="Anchors dashboard — manage your listings"
              aria-current={isActive('/anchors/dashboard') ? 'page' : undefined}
              className="block px-4 py-3 rounded-xl text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              Anchors Dashboard
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              aria-label="Sign in to your BeKenya account"
              className="block px-4 py-3 rounded-xl text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              Sign In
            </Link>
            <Link
              href="/compass"
              onClick={() => setMobileOpen(false)}
              aria-label="Start My Compass — find your path with BeKenya"
              className="bg-[#FF6B35] text-white font-semibold block text-center py-3 rounded-xl hover:bg-orange-500 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
            >
              Start My Compass
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

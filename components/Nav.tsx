'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'

// ── Brand name derives from env — "BeKenya", "BeGermany", etc. ────
const CC = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase() as keyof typeof COUNTRIES
const BRAND = `Be${COUNTRIES[CC]?.name ?? 'Country'}`

// ── Primary nav links ──────────────────────────────────────────────
const PRIMARY_LINKS = [
  { href: '/ventures',    label: 'Ventures',    aria: 'Explore all paths and experiences' },
  { href: '/compass',     label: 'Compass',     aria: 'Find your route across countries' },
  { href: '/experiences', label: 'Experiences', aria: 'Safari and cultural experiences' },
  { href: '/charity',     label: 'Community',   aria: 'UTAMADUNI community impact' },
  { href: '/pricing',     label: 'Pricing',     aria: 'Anchor pricing plans' },
]

// ── "About" dropdown ──────────────────────────────────────────────
const ABOUT_LINKS = [
  { href: '/about',    label: 'About',          aria: `About the ${BRAND} platform` },
  { href: '/business', label: 'Family Ltd',     aria: 'Business and legal structure' },
  { href: '/referral', label: 'Refer & Earn',   aria: 'Referral programme' },
]

// ─────────────────────────────────────────────────────────────────
export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen]   = useState(false)
  const pathname = usePathname()
  const aboutRef = useRef<HTMLDivElement>(null)
  const mobileMenuId = 'mobile-nav'

  // Close dropdown when clicking outside
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setAboutOpen(false)
  }, [pathname])

  const isActive      = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isAboutActive = ABOUT_LINKS.some(l => isActive(l.href))

  return (
    <header>
      {/* Keyboard skip link — visible only on focus */}
      <a href="#main-content" className="skip-to-content focus:not-sr-only">
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="bg-[#5C0A14] border-b border-[#C9A227]/25 sticky top-0 z-50"
      >
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ─────────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14]"
              aria-label={`${BRAND} — Home`}
            >
              <Image
                src="/logo.svg"
                alt=""
                width={36}
                height={36}
                priority
                unoptimized
                aria-hidden="true"
              />
              <span className="text-[#C9A227] font-bold text-lg tracking-wide" aria-hidden="true">
                {BRAND}
              </span>
            </Link>

            {/* ── Desktop links ─────────────────────────────── */}
            <ul className="hidden xl:flex items-center gap-0.5 list-none" role="list">
              {PRIMARY_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] ${
                      isActive(link.href)
                        ? 'bg-[#C9A227]/15 text-[#C9A227]'
                        : 'text-[#C9A227]/75 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
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
                    type="button"
                    onClick={() => setAboutOpen(v => !v)}
                    aria-expanded={aboutOpen}
                    aria-haspopup="listbox"
                    aria-controls="about-dropdown"
                    aria-label="About — expand sub-pages"
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] ${
                      isAboutActive
                        ? 'bg-[#C9A227]/15 text-[#C9A227]'
                        : 'text-[#C9A227]/75 hover:text-[#C9A227] hover:bg-[#C9A227]/10'
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
                      role="listbox"
                      className="absolute left-0 top-full mt-1.5 w-52 bg-[#3D0610] border border-[#C9A227]/25 rounded-2xl shadow-xl py-1.5 z-50 list-none"
                    >
                      {ABOUT_LINKS.map(link => (
                        <li key={link.href} role="option" aria-selected={isActive(link.href)}>
                          <Link
                            href={link.href}
                            onClick={() => setAboutOpen(false)}
                            aria-label={link.aria}
                            aria-current={isActive(link.href) ? 'page' : undefined}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors duration-150 rounded-xl mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
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

            {/* ── Desktop auth / CTA ────────────────────────── */}
            <div className="hidden xl:flex items-center gap-3">
              <Link
                href="/anchors/dashboard"
                aria-label="Anchors — manage your paths"
                aria-current={isActive('/anchors/dashboard') ? 'page' : undefined}
                className={`text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] rounded-md px-1 ${
                  isActive('/anchors/dashboard') ? 'text-[#C9A227]' : 'text-[#C9A227]/65 hover:text-[#C9A227]'
                }`}
              >
                Anchors
              </Link>
              <Link
                href="/login"
                aria-label="Sign in"
                className="text-sm font-medium text-[#C9A227]/65 hover:text-[#C9A227] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14] rounded-md px-1"
              >
                Sign In
              </Link>
              <Link
                href="/compass"
                aria-label="Start My Compass — find your path"
                className="bg-[#C9A227] text-[#0A0A0F] font-semibold px-5 py-2 rounded-xl text-sm hover:bg-[#D4AF35] active:scale-[0.97] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14]"
              >
                Start Compass
              </Link>
            </div>

            {/* ── Mobile toggle ─────────────────────────────── */}
            <button
              type="button"
              onClick={() => setMobileOpen(v => !v)}
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="xl:hidden p-2 rounded-xl text-[#C9A227]/80 hover:text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5C0A14]"
            >
              {mobileOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────── */}
        <div
          id={mobileMenuId}
          hidden={!mobileOpen}
          className="xl:hidden border-t border-[#C9A227]/20 bg-[#3D0610] px-4 py-4 space-y-1"
        >
          <ul role="list" className="list-none space-y-1">
            {PRIMARY_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-label={link.aria}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
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

          <div className="pt-2">
            <p className="px-4 py-1 text-xs font-semibold text-[#C9A227]/50 uppercase tracking-widest">
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
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
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

          <div className="pt-3 border-t border-[#C9A227]/20 space-y-2">
            <Link
              href="/anchors/dashboard"
              onClick={() => setMobileOpen(false)}
              aria-label="Anchors dashboard"
              className="block px-4 py-3 rounded-xl text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              Anchors Dashboard
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              Sign In
            </Link>
            <Link
              href="/compass"
              onClick={() => setMobileOpen(false)}
              aria-label="Start My Compass"
              className="bg-[#C9A227] text-[#0A0A0F] font-semibold block text-center py-3 rounded-xl hover:bg-[#D4AF35] active:scale-[0.97] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              Start Compass
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

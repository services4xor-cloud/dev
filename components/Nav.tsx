'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Menu, X, ChevronDown } from 'lucide-react'

// ──────────────────────────────────────────────
// Primary nav links (updated vocabulary)
// ──────────────────────────────────────────────
const PRIMARY_LINKS = [
  { href: '/ventures',    label: 'Ventures' },      // was: /jobs → Find Jobs
  { href: '/compass',     label: 'Compass' },        // career guidance / path finder
  { href: '/experiences', label: 'Experiences' },    // safari & cultural packages
  { href: '/charity',     label: 'Charity' },        // UTAMADUNI charity arm
  { href: '/pricing',     label: 'Pricing' },
]

// "About" dropdown entries — appear when user hovers/clicks the About button
const ABOUT_LINKS = [
  { href: '/about',       label: 'About BeKenya' },
  { href: '/business',    label: 'BeKenya Family Ltd' }, // legal / business structure page
  { href: '/referral',    label: 'Referral Programme' },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const pathname = usePathname()
  const aboutRef = useRef<HTMLDivElement>(null)

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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gray-900">Beke</span>
              <span className="text-brand-orange">nya</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-1">
            {PRIMARY_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-orange-50 text-brand-orange'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* About dropdown */}
            <div className="relative" ref={aboutRef}>
              <button
                onClick={() => setAboutOpen(v => !v)}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isAboutActive
                    ? 'bg-orange-50 text-brand-orange'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                aria-expanded={aboutOpen}
                aria-haspopup="true"
              >
                About
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {aboutOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-2xl shadow-lg py-1 z-50">
                  {ABOUT_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAboutOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium transition-colors rounded-xl mx-1 ${
                        isActive(link.href)
                          ? 'bg-orange-50 text-brand-orange'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Desktop auth / CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/anchors/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/anchors/dashboard')
                  ? 'text-brand-orange'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anchors
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/ventures" className="btn-primary px-4 py-2 text-sm">
              Find a Venture
            </Link>
          </div>

          {/* ── Mobile menu toggle ── */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">

          {PRIMARY_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-orange-50 text-brand-orange'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* About section in mobile */}
          <div className="pt-1 pb-1">
            <p className="px-4 pt-1 pb-0.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              About
            </p>
            {ABOUT_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-orange-50 text-brand-orange'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth / CTA */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <Link
              href="/anchors/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium"
            >
              Anchors Dashboard
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/ventures"
              onClick={() => setMobileOpen(false)}
              className="btn-primary block text-center py-3"
            >
              Find a Venture
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

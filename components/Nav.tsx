'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Compass, DollarSign, LogIn } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import {
  PRIMARY_LINKS,
  PIONEER_NAV_LINKS as PIONEER_LINKS,
  ANCHOR_NAV_LINKS as ANCHOR_LINKS,
  ABOUT_NAV_LINKS as ABOUT_LINKS,
} from '@/lib/nav-structure'

const CC = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase() as keyof typeof COUNTRIES
const BRAND = `Be${COUNTRIES[CC]?.name ?? 'Country'}`

// ─────────────────────────────────────────────────────────────────
export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [anchorOpen, setAnchorOpen] = useState(false)
  const pathname = usePathname()
  const aboutRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false)
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) setAnchorOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setAboutOpen(false)
    setAnchorOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isAboutActive = ABOUT_LINKS.some((l) => isActive(l.href))
  const isAnchorActive = ANCHOR_LINKS.some((l) => isActive(l.href))

  // Shared link class helpers
  const desktopLink = (active: boolean) =>
    `relative inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]
     ${
       active ? 'text-[#C9A227] bg-[#C9A227]/8' : 'text-white/65 hover:text-white hover:bg-white/5'
     }`

  const dropdownLink = (active: boolean) =>
    `flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 mx-1
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]
     ${
       active ? 'text-[#C9A227] bg-[#C9A227]/10' : 'text-white/70 hover:text-white hover:bg-white/6'
     }`

  return (
    <header>
      {/* Skip link */}
      <a href="#main-content" className="skip-to-content focus:not-sr-only">
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/8 sticky top-0 z-50"
      >
        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-between h-15" style={{ height: '60px' }}>
            {/* ── Logo ─────────────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 rounded-lg
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]
                         focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              aria-label={`${BRAND} — Home`}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-lg blur-sm opacity-40"
                  style={{ background: '#C9A227' }}
                  aria-hidden="true"
                />
                <Image
                  src="/logo.svg"
                  alt=""
                  width={32}
                  height={32}
                  priority
                  unoptimized
                  aria-hidden="true"
                  className="relative rounded-lg"
                />
              </div>
              <span className="font-bold text-[15px] tracking-wide" aria-hidden="true">
                <span className="text-[#C9A227]">Be</span>
                <span className="text-white">{COUNTRIES[CC]?.name ?? 'Country'}</span>
              </span>
            </Link>

            {/* ── Desktop links ─────────────────────────────────── */}
            <ul className="hidden xl:flex items-center gap-0.5 list-none">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={desktopLink(isActive(link.href))}
                  >
                    {isActive(link.href) && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#C9A227' }}
                        aria-hidden="true"
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* For Anchors dropdown */}
              <li>
                <div className="relative" ref={anchorRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setAnchorOpen((v) => !v)
                      setAboutOpen(false)
                    }}
                    aria-expanded={anchorOpen}
                    aria-haspopup="listbox"
                    aria-controls="anchor-dropdown"
                    aria-label="For Anchors — expand sub-pages"
                    className={desktopLink(isAnchorActive)}
                  >
                    {isAnchorActive && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A227]"
                        aria-hidden="true"
                      />
                    )}
                    For Anchors
                    <ChevronDown
                      className={`inline-block ml-0.5 w-3.5 h-3.5 transition-transform duration-200 ${anchorOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {anchorOpen && (
                    <ul
                      id="anchor-dropdown"
                      role="listbox"
                      className="absolute left-0 top-full mt-2 w-56 rounded-2xl shadow-2xl py-1.5 list-none
                                 border border-white/10 backdrop-blur-xl"
                      style={{ background: 'rgba(17,17,24,0.97)' }}
                    >
                      {ANCHOR_LINKS.map((link) => {
                        const Icon = link.icon
                        return (
                          <li key={link.href} role="option" aria-selected={isActive(link.href)}>
                            <Link
                              href={link.href}
                              onClick={() => setAnchorOpen(false)}
                              aria-label={link.aria}
                              className={dropdownLink(isActive(link.href))}
                            >
                              <Icon
                                className="w-4 h-4 shrink-0 text-[#C9A227]/60"
                                aria-hidden="true"
                              />
                              {link.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </li>

              {/* About dropdown */}
              <li>
                <div className="relative" ref={aboutRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setAboutOpen((v) => !v)
                      setAnchorOpen(false)
                    }}
                    aria-expanded={aboutOpen}
                    aria-haspopup="listbox"
                    aria-controls="about-dropdown"
                    aria-label="About — expand sub-pages"
                    className={desktopLink(isAboutActive)}
                  >
                    {isAboutActive && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A227]"
                        aria-hidden="true"
                      />
                    )}
                    About
                    <ChevronDown
                      className={`inline-block ml-0.5 w-3.5 h-3.5 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {aboutOpen && (
                    <ul
                      id="about-dropdown"
                      role="listbox"
                      className="absolute left-0 top-full mt-2 w-52 rounded-2xl shadow-2xl py-1.5 list-none
                                 border border-white/10 backdrop-blur-xl"
                      style={{ background: 'rgba(17,17,24,0.97)' }}
                    >
                      {ABOUT_LINKS.map((link) => {
                        const Icon = link.icon
                        return (
                          <li key={link.href} role="option" aria-selected={isActive(link.href)}>
                            <Link
                              href={link.href}
                              onClick={() => setAboutOpen(false)}
                              aria-label={link.aria}
                              className={dropdownLink(isActive(link.href))}
                            >
                              <Icon
                                className="w-4 h-4 shrink-0 text-[#C9A227]/60"
                                aria-hidden="true"
                              />
                              {link.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </li>
            </ul>

            {/* ── Desktop auth / CTA ─────────────────────────────── */}
            <div className="hidden xl:flex items-center gap-2">
              <div className="w-px h-5 bg-white/10 mx-1" aria-hidden="true" />
              <Link
                href="/login"
                aria-label="Sign in to your account"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white/60
                           hover:text-white hover:bg-white/5 transition-all duration-150
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign In
              </Link>
              <Link
                href="/compass"
                aria-label="Start My Compass — find your path across countries"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-[#0A0A0F]
                           hover:brightness-110 active:scale-[0.97] transition-all duration-150
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]
                           focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
                style={{
                  background: 'linear-gradient(135deg, #C9A227, #D4AF37)',
                  boxShadow: '0 2px 12px rgba(201,162,39,0.3)',
                }}
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                Start Compass
              </Link>
            </div>

            {/* ── Mobile toggle ───────────────────────────────────── */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="xl:hidden p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/8
                         transition-all duration-150 focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-[#C9A227]"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu — full-width overlay ─────────────────────── */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="xl:hidden border-t border-white/8"
            style={{ background: 'rgba(10,10,15,0.98)' }}
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-60px)] overflow-y-auto">
              {/* EXPLORE section */}
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
                Explore
              </p>
              {PIONEER_LINKS.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-xl font-medium transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]
                      ${
                        isActive(link.href)
                          ? 'bg-[#C9A227]/12 text-[#C9A227]'
                          : 'text-white/75 hover:bg-white/6 hover:text-white'
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${isActive(link.href) ? 'text-[#C9A227]' : 'text-white/30'}`}
                      aria-hidden="true"
                    />
                    {link.label}
                    {isActive(link.href) && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A227]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                )
              })}

              {/* FOR ANCHORS section */}
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
                For Anchors
              </p>
              {ANCHOR_LINKS.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-xl font-medium transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]
                      ${
                        isActive(link.href)
                          ? 'bg-[#C9A227]/12 text-[#C9A227]'
                          : 'text-white/75 hover:bg-white/6 hover:text-white'
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${isActive(link.href) ? 'text-[#C9A227]' : 'text-white/30'}`}
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                )
              })}

              {/* ABOUT section */}
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
                About
              </p>
              {[
                ...ABOUT_LINKS,
                { href: '/pricing', label: 'Pricing', icon: DollarSign, aria: 'Plans and pricing' },
              ].map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-xl font-medium transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]
                      ${
                        isActive(link.href)
                          ? 'bg-[#C9A227]/12 text-[#C9A227]'
                          : 'text-white/75 hover:bg-white/6 hover:text-white'
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${isActive(link.href) ? 'text-[#C9A227]' : 'text-white/30'}`}
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                )
              })}

              {/* Auth / CTA */}
              <div className="pt-4 border-t border-white/8 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-white/70 hover:bg-white/6 hover:text-white
                             font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
                >
                  <LogIn className="w-5 h-5 text-white/30" aria-hidden="true" />
                  Sign In
                </Link>
                <Link
                  href="/compass"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Start My Compass"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[#0A0A0F]
                             active:scale-[0.98] transition-all duration-150
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
                  style={{
                    background: 'linear-gradient(135deg, #C9A227, #D4AF37)',
                    boxShadow: '0 4px 16px rgba(201,162,39,0.25)',
                  }}
                >
                  <Compass className="w-5 h-5" aria-hidden="true" />
                  Start My Compass
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

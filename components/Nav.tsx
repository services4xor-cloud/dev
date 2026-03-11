'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Compass, LogIn } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import {
  PRIMARY_LINKS,
  PIONEER_NAV_LINKS as PIONEER_LINKS,
  ANCHOR_NAV_LINKS as ANCHOR_LINKS,
  ABOUT_NAV_LINKS as ABOUT_LINKS,
} from '@/lib/nav-structure'
import type { ThreadType } from '@/lib/threads'
import { MOCK_THREADS } from '@/data/mock/threads'

const CC = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase() as keyof typeof COUNTRIES
const BRAND = `Be${COUNTRIES[CC]?.name ?? 'Country'}`

// Countries to cycle through in the logo teaser
const TEASER_COUNTRIES = COUNTRY_OPTIONS.slice(0, 12).map((c) => ({
  name: c.name,
  flag: c.flag,
}))

// ─── Identity Switcher Tabs ─────────────────────────────────────────
const IDENTITY_TABS: { type: ThreadType; label: string; icon: string }[] = [
  { type: 'country', label: 'Countries', icon: '🌍' },
  { type: 'language', label: 'Languages', icon: '🗣️' },
  { type: 'tribe', label: 'Tribes', icon: '🦁' },
  { type: 'interest', label: 'Interests', icon: '⭐' },
  { type: 'science', label: 'Sciences', icon: '🔬' },
  { type: 'location', label: 'Locations', icon: '📍' },
]

/** Get the URL for a thread */
function getThreadUrl(thread: { type: ThreadType; slug: string }): string {
  if (thread.type === 'country') return `/be/${thread.slug}`
  return `/threads/${thread.slug}`
}

// ─────────────────────────────────────────────────────────────────
export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'anchors' | 'about' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [teaserIdx, setTeaserIdx] = useState(0)
  const [teaserFade, setTeaserFade] = useState(true)
  const [identityOpen, setIdentityOpen] = useState(false)
  const [identityTab, setIdentityTab] = useState<ThreadType>('country')
  const [hoveredThread, setHoveredThread] = useState<{
    icon: string
    brandName: string
  } | null>(null)
  const pathname = usePathname()
  const anchorsRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const identityRef = useRef<HTMLDivElement>(null)

  // Scroll-aware background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Rotate Be[Country] teaser every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setTeaserFade(false)
      setTimeout(() => {
        setTeaserIdx((i) => (i + 1) % TEASER_COUNTRIES.length)
        setTeaserFade(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (
        anchorsRef.current &&
        !anchorsRef.current.contains(e.target as Node) &&
        aboutRef.current &&
        !aboutRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null)
      }
      if (identityRef.current && !identityRef.current.contains(e.target as Node)) {
        setIdentityOpen(false)
        setHoveredThread(null)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setIdentityOpen(false)
    setHoveredThread(null)
  }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + '/'),
    [pathname]
  )
  const isAnchorActive = ANCHOR_LINKS.some((l) => isActive(l.href))
  const isAboutActive = ABOUT_LINKS.some((l) => isActive(l.href))

  const currentTeaser = TEASER_COUNTRIES[teaserIdx]

  // ── Shared styles ────────────────────────────
  const desktopLink = (active: boolean) =>
    `relative inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg
     ${active ? 'text-brand-accent' : 'text-white/60 hover:text-white'}`

  const ddLink = (active: boolean) =>
    `flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
     ${active ? 'text-brand-accent bg-brand-accent/8' : 'text-white/70 hover:text-white hover:bg-white/5'}`

  const mobLink = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
     ${active ? 'bg-brand-accent/10 text-brand-accent' : 'text-white/70 hover:bg-white/5 hover:text-white'}`

  // ── Dropdown ─────────────────────────────────
  const DropdownMenu = ({
    id,
    label,
    links,
    isGroupActive,
    dropdownRef,
  }: {
    id: 'anchors' | 'about'
    label: string
    links: typeof ANCHOR_LINKS
    isGroupActive: boolean
    dropdownRef: React.RefObject<HTMLDivElement | null>
  }) => (
    <div className="relative" ref={dropdownRef as React.LegacyRef<HTMLDivElement>}>
      <button
        type="button"
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        aria-expanded={openDropdown === id}
        aria-haspopup="menu"
        aria-controls={`${id}-dropdown`}
        className={desktopLink(isGroupActive)}
      >
        {label}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${openDropdown === id ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`${id}-dropdown`}
        role="menu"
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 ${
          openDropdown === id
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="w-52 rounded-xl bg-[#16161e] border border-white/10 shadow-2xl shadow-black/40 py-1.5">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpenDropdown(null)}
                aria-label={link.aria}
                className={ddLink(isActive(link.href))}
              >
                <Icon className="w-4 h-4 shrink-0 text-brand-accent/50" aria-hidden="true" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <header>
      {/* Skip link */}
      <a href="#main-content" className="skip-to-content focus:not-sr-only">
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-brand-bg/95 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-black/40 to-transparent'
        }`}
      >
        {/* Subtle gold accent line at very top */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />

        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo with Identity Switcher Dropdown ────────── */}
            <div className="relative" ref={identityRef}>
              <button
                type="button"
                onClick={() => setIdentityOpen((v) => !v)}
                aria-expanded={identityOpen}
                aria-haspopup="menu"
                aria-label={`${BRAND} — Switch identity context`}
                className="group flex items-center gap-2.5 shrink-0 rounded-lg cursor-pointer
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
                           focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              >
                <Link
                  href="/"
                  onClick={(e) => {
                    if (identityOpen) e.preventDefault()
                  }}
                  className="relative"
                >
                  <div
                    className="absolute inset-0 rounded-lg blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                    style={{ background: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  <Image
                    src="/logo.svg"
                    alt=""
                    width={30}
                    height={30}
                    priority
                    unoptimized
                    aria-hidden="true"
                    className="relative rounded-lg"
                  />
                </Link>
                {/* Brand name — reacts to hovered thread */}
                <div className="flex flex-col leading-none" aria-hidden="true">
                  <span className="font-bold text-[15px] tracking-wide transition-all duration-200">
                    {hoveredThread ? (
                      <>
                        <span className="text-lg mr-1">{hoveredThread.icon}</span>
                        <span className="text-brand-accent">Be</span>
                        <span className="text-white">
                          {hoveredThread.brandName.replace(/^Be/, '')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-brand-accent">Be</span>
                        <span className="text-white">{COUNTRIES[CC]?.name ?? 'Country'}</span>
                      </>
                    )}
                  </span>
                  {/* Rotating teaser: cycles through countries (hidden when hovering) */}
                  <span
                    className={`text-[9px] font-medium tracking-wider text-white/30 mt-0.5 transition-all duration-300 ${
                      hoveredThread
                        ? 'opacity-0 -translate-y-1'
                        : teaserFade
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 -translate-y-1'
                    }`}
                  >
                    {currentTeaser.flag} Be{currentTeaser.name}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3 h-3 text-white/30 transition-transform duration-200 ${identityOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {/* ── Identity Switcher Panel ──────────────────────── */}
              <div
                role="menu"
                className={`absolute left-0 top-full mt-2 transition-all duration-200 ${
                  identityOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="w-[calc(100vw-2rem)] sm:w-96 max-w-[24rem] rounded-xl bg-[#16161e] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
                  {/* Tab row */}
                  <div className="flex gap-0.5 px-2 pt-2 pb-1 overflow-x-auto scrollbar-hide border-b border-white/5">
                    {IDENTITY_TABS.map((tab) => {
                      const count = MOCK_THREADS.filter(
                        (t) => t.type === tab.type && t.active
                      ).length
                      if (count === 0) return null
                      return (
                        <button
                          key={tab.type}
                          type="button"
                          onClick={() => setIdentityTab(tab.type)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
                            identityTab === tab.type
                              ? 'bg-brand-accent/15 text-brand-accent'
                              : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <span className="text-xs">{tab.icon}</span>
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Thread list */}
                  <div className="max-h-64 overflow-y-auto py-1.5 px-1.5">
                    {MOCK_THREADS.filter((t) => t.type === identityTab && t.active)
                      .sort((a, b) => b.memberCount - a.memberCount)
                      .map((thread) => (
                        <Link
                          key={thread.slug}
                          href={getThreadUrl(thread)}
                          role="menuitem"
                          onClick={() => {
                            setIdentityOpen(false)
                            setHoveredThread(null)
                          }}
                          onMouseEnter={() =>
                            setHoveredThread({ icon: thread.icon, brandName: thread.brandName })
                          }
                          onMouseLeave={() => setHoveredThread(null)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                                     hover:bg-white/8 group/item"
                        >
                          <span className="text-lg shrink-0">{thread.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white group-hover/item:text-brand-accent transition-colors truncate">
                                {thread.brandName}
                              </span>
                              {thread.slug === CC.toLowerCase() && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent uppercase tracking-wider">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/40 truncate mt-0.5">
                              {thread.memberCount.toLocaleString()} pioneers ·{' '}
                              {thread.tagline.slice(0, 50)}
                            </p>
                          </div>
                        </Link>
                      ))}
                  </div>

                  {/* Footer — Browse all + Home link */}
                  <div className="border-t border-white/5 px-3 py-2 flex items-center justify-between">
                    <Link
                      href="/threads"
                      onClick={() => setIdentityOpen(false)}
                      className="text-[11px] font-medium text-brand-accent/70 hover:text-brand-accent transition-colors"
                    >
                      Browse all threads →
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setIdentityOpen(false)}
                      className="text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors"
                    >
                      Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Desktop links ─────────────────────────────────── */}
            <ul className="hidden lg:flex items-center gap-0.5 list-none">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-label={link.aria}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={desktopLink(isActive(link.href))}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-brand-accent"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <DropdownMenu
                  id="anchors"
                  label="For Anchors"
                  links={ANCHOR_LINKS}
                  isGroupActive={isAnchorActive}
                  dropdownRef={anchorsRef}
                />
              </li>
              <li>
                <DropdownMenu
                  id="about"
                  label="About"
                  links={ABOUT_LINKS}
                  isGroupActive={isAboutActive}
                  dropdownRef={aboutRef}
                />
              </li>
            </ul>

            {/* ── Desktop auth / CTA ─────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                aria-label="Sign in to your account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white/50
                           hover:text-white transition-all duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                Sign In
              </Link>
              <Link
                href="/compass"
                aria-label="Start My Compass — find your path across countries"
                className="group/cta relative flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-bold
                           text-brand-bg overflow-hidden
                           hover:shadow-[0_4px_24px_rgb(var(--color-accent-rgb)/0.4)]
                           active:scale-[0.97] transition-all duration-300
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
                           focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
                }}
              >
                {/* Shimmer effect on hover */}
                <span
                  className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  aria-hidden="true"
                />
                <Compass className="w-3.5 h-3.5 relative" aria-hidden="true" />
                <span className="relative">Start Compass</span>
              </Link>
            </div>

            {/* ── Mobile toggle ───────────────────────────────────── */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5
                         transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-brand-accent"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu — fullscreen overlay ─────────────────────── */}
      <div
        id="mobile-nav"
        className={`lg:hidden fixed inset-0 top-0 z-40 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-bg/98 backdrop-blur-xl"
          onClick={() => setMobileOpen(false)}
        />

        {/* Content — below nav height */}
        <div className="relative h-full pt-[68px] overflow-y-auto">
          <div className="px-5 py-6 space-y-1">
            {/* Identity switcher — mobile */}
            <div className="mb-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/20 border border-brand-accent/10">
                <span className="text-lg">{currentTeaser.flag}</span>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-brand-accent/80 uppercase tracking-wider">
                    One platform, every identity
                  </p>
                  <p className="text-sm text-white/50 mt-0.5">
                    Be<span className="text-white font-semibold">{currentTeaser.name}</span>
                    {' · '}
                    Be
                    <span className="text-white font-semibold">
                      {COUNTRIES[CC]?.name ?? 'Country'}
                    </span>
                    {' · '}
                    Be<span className="text-white font-semibold">You</span>
                  </p>
                </div>
              </div>
              {/* Quick identity tabs — mobile */}
              <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-hide px-1">
                {IDENTITY_TABS.map((tab) => {
                  const threads = MOCK_THREADS.filter((t) => t.type === tab.type && t.active)
                  if (threads.length === 0) return null
                  return (
                    <Link
                      key={tab.type}
                      href={`/threads?type=${tab.type}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap
                                 bg-white/5 text-white/50 hover:text-brand-accent hover:bg-brand-accent/10 border border-white/5
                                 transition-all duration-200"
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* EXPLORE section */}
            <p className="px-4 pt-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent/50">
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
                  className={mobLink(isActive(link.href))}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${isActive(link.href) ? 'text-brand-accent' : 'text-white/25'}`}
                    aria-hidden="true"
                  />
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}

            <div className="h-px bg-white/6 mx-4 my-3" />

            {/* FOR ANCHORS section */}
            <p className="px-4 pt-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent/50">
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
                  className={mobLink(isActive(link.href))}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${isActive(link.href) ? 'text-brand-accent' : 'text-white/25'}`}
                    aria-hidden="true"
                  />
                  {link.label}
                </Link>
              )
            })}

            <div className="h-px bg-white/6 mx-4 my-3" />

            {/* ABOUT section */}
            <p className="px-4 pt-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent/50">
              About
            </p>
            {ABOUT_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-label={link.aria}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={mobLink(isActive(link.href))}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${isActive(link.href) ? 'text-brand-accent' : 'text-white/25'}`}
                    aria-hidden="true"
                  />
                  {link.label}
                </Link>
              )
            })}

            {/* Auth / CTA */}
            <div className="pt-4 mx-1 space-y-2.5">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10
                           text-white/70 hover:text-white hover:border-white/20 font-medium transition-all duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign In
              </Link>
              <Link
                href="/compass"
                onClick={() => setMobileOpen(false)}
                aria-label="Start My Compass"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-brand-bg
                           active:scale-[0.98] transition-all duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
                  boxShadow: '0 4px 20px rgb(var(--color-accent-rgb) / 0.25)',
                }}
              >
                <Compass className="w-5 h-5" aria-hidden="true" />
                Start My Compass
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed nav */}
      <div className="h-16" />
    </header>
  )
}

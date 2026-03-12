'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, LogIn, ArrowRight, LogOut, Bell } from 'lucide-react'
import { PUBLIC_NAV_LINKS, MAIN_NAV_LINKS, LOGIN_LINK } from '@/lib/nav-structure'
import { useIdentity } from '@/lib/identity-context'

// ─────────────────────────────────────────────────────────────────
export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { hasCompletedDiscovery, brandName } = useIdentity()
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isAuthenticated = status === 'authenticated' && !!session?.user

  // Scroll-aware background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on route change
  useEffect(() => {
    setMobileOpen(false)
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

  // Show main nav if authenticated OR discovery complete, otherwise public nav
  const navLinks = isAuthenticated || hasCompletedDiscovery ? MAIN_NAV_LINKS : PUBLIC_NAV_LINKS

  // ── Shared styles ────────────────────────
  const desktopLink = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg
     ${active ? 'text-brand-accent' : 'text-white/60 hover:text-white'}`

  const mobLink = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
     ${active ? 'bg-brand-accent/10 text-brand-accent' : 'text-white/70 hover:bg-white/5 hover:text-white'}`

  // User avatar initials fallback
  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <header>
      {/* Skip link */}
      <a href="#main-content" className="skip-to-content focus:not-sr-only">
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-200 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-black/40 to-transparent'
        }`}
      >
        {/* Subtle gold accent line at very top */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />

        <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo ────────────────────────────────── */}
            <Link
              href="/"
              className="group flex items-center gap-2 shrink-0 rounded-lg
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
                         focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              aria-label={`${brandName} — Home`}
            >
              <span className="font-bold text-[15px] tracking-wide">
                <span className="text-brand-accent">Be</span>
                <span className="text-white">
                  {brandName.startsWith('Be') ? brandName.slice(2) : brandName}
                </span>
              </span>
            </Link>

            {/* ── Desktop links ─────────────────────────────────── */}
            <ul className="hidden lg:flex items-center gap-0.5 list-none">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-label={link.aria}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className={desktopLink(isActive(link.href))}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      {link.label}
                      {isActive(link.href) && (
                        <span
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-brand-accent"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* ── Desktop auth area ─────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                /* Logged in: notifications + avatar + sign out */
                <div className="flex items-center gap-3">
                  <Link
                    href="/notifications"
                    aria-label="Notifications"
                    className="relative p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-accent"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href="/me"
                    className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/5 transition-all"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? 'User'}
                        width={28}
                        height={28}
                        className="rounded-full ring-1 ring-brand-accent/30"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-[11px] font-bold text-brand-accent ring-1 ring-brand-accent/30">
                        {userInitials}
                      </div>
                    )}
                    <span className="text-[13px] text-white/70 font-medium max-w-[120px] truncate">
                      {session.user?.name ?? session.user?.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[12px] text-white/40 hover:text-white/70 transition-all"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Not logged in: Sign In + Begin CTA */
                <>
                  <Link
                    href={LOGIN_LINK.href}
                    aria-label={LOGIN_LINK.aria}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white/50
                               hover:text-white transition-all duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                    {LOGIN_LINK.label}
                  </Link>
                  <Link
                    href="/"
                    aria-label="Begin your journey"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-bold text-white
                               bg-brand-primary hover:bg-brand-primary/90
                               active:scale-[0.97] transition-all duration-300
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent
                               focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
                  >
                    <span>Begin</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </>
              )}
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
        className={`lg:hidden fixed inset-0 top-0 z-40 transition-opacity duration-150 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-bg"
          onClick={() => setMobileOpen(false)}
          role="presentation"
          aria-hidden="true"
        />

        {/* Content — below nav height */}
        <div className="relative h-full pt-[68px] overflow-y-auto">
          <div className="px-5 py-6 space-y-1">
            {/* Nav links */}
            {navLinks.map((link) => {
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

            {/* Mobile auth area */}
            <div className="pt-4 mx-1 space-y-2.5">
              {isAuthenticated ? (
                /* Logged in: profile link + sign out */
                <>
                  <Link
                    href="/me"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? 'User'}
                        width={36}
                        height={36}
                        className="rounded-full ring-1 ring-brand-accent/30"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-sm font-bold text-brand-accent ring-1 ring-brand-accent/30">
                        {userInitials}
                      </div>
                    )}
                    <div>
                      <div className="text-white font-medium text-sm">
                        {session.user?.name ?? 'Profile'}
                      </div>
                      <div className="text-white/40 text-xs">{session.user?.email}</div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-white/10
                               text-white/50 hover:text-white hover:border-white/20 font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                /* Not logged in: sign in + begin */
                <>
                  <Link
                    href={LOGIN_LINK.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10
                               text-white/70 hover:text-white hover:border-white/20 font-medium transition-all duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    {LOGIN_LINK.label}
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Begin your journey"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white
                               bg-brand-primary hover:bg-brand-primary/90
                               active:scale-[0.98] transition-all duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    <span>Begin</span>
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed nav */}
      <div className="h-16" />
    </header>
  )
}

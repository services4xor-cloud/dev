'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Logo from '@/components/site/Logo'
import { getSelected, SELECTION_EVENT } from '@/lib/selection'

const NAV = [
  { href: '/map', label: 'Map', match: ['/', '/map', '/be'] },
  { href: '/opportunities', label: 'Offerings', match: ['/opportunities', '/exchange'] },
  { href: '/agent', label: 'Agent', match: ['/agent'] },
]

/**
 * Shared header in the 4xor.com design: deep green bar with a teal rule on top,
 * the mark on the left, the site map in the middle and one call to action.
 * `compact` drops the promo bar (map page, where every pixel goes to the map).
 */
export default function SiteHeader({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname() ?? '/'
  const { data: session, status } = useSession()
  const user = session?.user as
    | { name?: string | null; email?: string | null; role?: string }
    | undefined
  const [selected, setSelectedCount] = useState(0)
  const menuRef = useRef<HTMLDetailsElement>(null)
  const accountRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const sync = () => setSelectedCount(getSelected().length)
    sync()
    window.addEventListener(SELECTION_EVENT, sync)
    return () => window.removeEventListener(SELECTION_EVENT, sync)
  }, [])

  // Close the menus after navigation and on Escape
  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false
    if (accountRef.current) accountRef.current.open = false
  }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (menuRef.current) menuRef.current.open = false
      if (accountRef.current) accountRef.current.open = false
    }
    const onClick = (e: MouseEvent) => {
      if (accountRef.current?.open && !accountRef.current.contains(e.target as Node))
        accountRef.current.open = false
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [])

  const isCurrent = (match: string[]) =>
    match.some((m) =>
      m === '/' ? pathname === '/' : pathname === m || pathname.startsWith(`${m}/`)
    )
  const displayName = user?.name || user?.email?.split('@')[0] || 'Account'
  const agentLabel = selected ? `Agent (${selected})` : 'Agent'

  return (
    <>
      {!compact && (
        <aside
          aria-label="4XOR"
          className="bg-gradient-to-r from-brand-deep via-brand-primary to-brand-deep"
        >
          <a
            href="https://4xor.com"
            className="flex min-h-[34px] items-center justify-center px-4 py-1.5 text-center text-[0.85rem] text-[#e3ece7] hover:underline"
          >
            <span>
              <b className="font-semibold text-[#f1c25a]">A 4XOR project.</b> AI agents and
              automation from Switzerland, see 4xor.com
            </span>
          </a>
        </aside>
      )}
      <header className="sticky top-0 z-50 border-b border-white/10 border-t-[3px] border-t-brand-accent bg-brand-deep text-[#f3f5f2]">
        <div
          className={`mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 ${compact ? '' : 'max-w-6xl'}`}
        >
          <Link href="/map" aria-label="Be[X] map" className="shrink-0 text-[#f3f5f2]">
            <Logo size={34} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 text-[0.95rem] md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isCurrent(n.match) ? 'page' : undefined}
                className="nav-link"
              >
                {n.href === '/agent' ? agentLabel : n.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/bookings"
                aria-current={isCurrent(['/bookings']) ? 'page' : undefined}
                className="nav-link"
              >
                Bookings
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {status !== 'loading' &&
              (user ? (
                <details ref={accountRef} className="relative hidden md:block">
                  <summary className="nav-link cursor-pointer list-none text-[0.95rem]">
                    {displayName} <span aria-hidden="true">▾</span>
                  </summary>
                  <div className="absolute right-0 top-full mt-3 min-w-[14rem] rounded-[10px] border border-brand-line bg-brand-surface p-1.5 text-brand-text shadow-2xl">
                    <MenuLink href="/opportunities#yours">Your listings</MenuLink>
                    <MenuLink href="/bookings">Your bookings</MenuLink>
                    <MenuLink href="/profile">Profile</MenuLink>
                    {user.role === 'ADMIN' && <MenuLink href="/admin">Admin</MenuLink>}
                    <button
                      onClick={() => void signOut({ callbackUrl: '/map' })}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-brand-text-muted hover:bg-brand-accent/10 hover:text-brand-text"
                    >
                      Sign out
                    </button>
                  </div>
                </details>
              ) : (
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                  className="nav-link hidden text-[0.95rem] md:inline"
                >
                  Sign in
                </Link>
              ))}
            <Link
              href="/opportunities/new"
              className="btn btn-on-deep btn-sm hidden sm:inline-flex"
            >
              List an offering
            </Link>

            {/* Phones and tablets: one compact panel, works without JS */}
            <details ref={menuRef} className="md:hidden">
              <summary className="cursor-pointer list-none rounded-md border border-white/20 px-3 py-1.5 text-sm">
                Menu
              </summary>
              <div className="absolute inset-x-0 top-full border-b border-white/10 bg-brand-deep px-4 pb-5 pt-3 shadow-2xl">
                <div className="grid grid-cols-2 gap-1">
                  {NAV.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      aria-current={isCurrent(n.match) ? 'page' : undefined}
                      className="rounded-md px-3 py-2.5 hover:bg-white/10 aria-[current=page]:bg-white/10"
                    >
                      {n.href === '/agent' ? agentLabel : n.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Link href="/bookings" className="rounded-md px-3 py-2.5 hover:bg-white/10">
                        Bookings
                      </Link>
                      <Link
                        href="/opportunities#yours"
                        className="rounded-md px-3 py-2.5 hover:bg-white/10"
                      >
                        Your listings
                      </Link>
                      <Link href="/profile" className="rounded-md px-3 py-2.5 hover:bg-white/10">
                        Profile
                      </Link>
                      <button
                        onClick={() => void signOut({ callbackUrl: '/map' })}
                        className="rounded-md px-3 py-2.5 text-left hover:bg-white/10"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                      className="rounded-md px-3 py-2.5 hover:bg-white/10"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
                <Link href="/opportunities/new" className="btn btn-on-deep mt-4 w-full">
                  List an offering
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  )
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm text-brand-text hover:bg-brand-accent/10"
    >
      {children}
    </Link>
  )
}

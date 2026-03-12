/**
 * Shared navigation link definitions for Nav + Footer
 *
 * Single source of truth for site-wide link structure.
 * Nav.tsx and Footer.tsx both import from here.
 *
 * Navigation architecture:
 *   Public:    Home + Compass + Exchange + About + [Sign In] + [Begin →]
 *   Logged in: Home + Compass + Exchange + Messages + Me
 */

import type { LucideIcon } from 'lucide-react'
import { Info, Send, Users, LogIn, Compass, Sparkles } from 'lucide-react'

export interface NavLink {
  href: string
  label: string
  icon: LucideIcon
  aria: string
}

export interface FooterLink {
  href: string
  label: string
}

// ── Navigation links ──────────────────────────────
export const PUBLIC_NAV_LINKS: NavLink[] = [
  { href: '/compass', label: 'Compass', icon: Compass, aria: 'Find your route' },
  { href: '/exchange', label: 'Exchange', icon: Sparkles, aria: 'Browse people and opportunities' },
  { href: '/about', label: 'About', icon: Info, aria: 'About the platform' },
]

export const MAIN_NAV_LINKS: NavLink[] = [
  { href: '/compass', label: 'Compass', icon: Compass, aria: 'Find your route' },
  { href: '/exchange', label: 'Exchange', icon: Sparkles, aria: 'Browse people and opportunities' },
  { href: '/messages', label: 'Messages', icon: Send, aria: 'Your conversations' },
  { href: '/me', label: 'Me', icon: Users, aria: 'Your profile and settings' },
]

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { href: '/compass', label: 'Compass' },
      { href: '/exchange', label: 'Exchange' },
      { href: '/messages', label: 'Messages' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/charity', label: 'Charity' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/business', label: 'Business' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
]

export const FOOTER_LINKS: FooterLink[] = FOOTER_COLUMNS.flatMap((col) => col.links)

export const LOGIN_LINK: NavLink = {
  href: '/login',
  label: 'Sign In',
  icon: LogIn,
  aria: 'Sign in to your account',
}

// ── DEPRECATED: Legacy exports (kept for backward compat) ──
export const PRIMARY_LINKS = PUBLIC_NAV_LINKS
export const PIONEER_NAV_LINKS = MAIN_NAV_LINKS
export const ANCHOR_NAV_LINKS: NavLink[] = []
export const AGENT_NAV_LINKS: NavLink[] = []
export const ABOUT_NAV_LINKS = PUBLIC_NAV_LINKS
export const FOOTER_PIONEER_LINKS: FooterLink[] = FOOTER_LINKS
export const FOOTER_ANCHOR_LINKS: FooterLink[] = []
export const FOOTER_AGENT_LINKS: FooterLink[] = []
export const FOOTER_DISCOVER_LINKS: FooterLink[] = FOOTER_LINKS
export const FOOTER_COMPANY_LINKS: FooterLink[] = FOOTER_LINKS

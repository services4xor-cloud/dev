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
      { href: '/world', label: 'World Map' },
      { href: '/fashion', label: 'Fashion' },
      { href: '/media', label: 'Media' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/charity', label: 'Charity' },
      { href: '/contact', label: 'Contact' },
      { href: '/referral', label: 'Referral' },
      { href: `/be/${process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE'}`, label: 'Gates' },
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

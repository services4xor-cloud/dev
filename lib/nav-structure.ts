/**
 * Shared navigation link definitions for Nav + Footer
 *
 * Single source of truth for site-wide link structure.
 * Nav.tsx and Footer.tsx both import from here.
 *
 * Human Exchange Network architecture:
 *   Logged out: logo + About + Pricing + [Sign In] + [Begin →]
 *   Logged in:  logo + My World + Exchange + Messages + Me
 */

import type { LucideIcon } from 'lucide-react'
import { DollarSign, Info, Globe, Map, Send, Users, LogIn } from 'lucide-react'

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

// ── New Human Exchange Network navigation ──────────────────
export const PUBLIC_NAV_LINKS: NavLink[] = [
  { href: '/about', label: 'About', icon: Info, aria: 'About the platform' },
  { href: '/pricing', label: 'Pricing', icon: DollarSign, aria: 'Pricing plans' },
]

export const MAIN_NAV_LINKS: NavLink[] = [
  { href: '/world', label: 'My World', icon: Globe, aria: 'Your network graph' },
  { href: '/exchange', label: 'Exchange', icon: Map, aria: 'Browse people and opportunities' },
  { href: '/messages', label: 'Messages', icon: Send, aria: 'Your conversations' },
  { href: '/me', label: 'Me', icon: Users, aria: 'Your profile and settings' },
]

export const FOOTER_LINKS: FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/charity', label: 'Community' },
  { href: '/business', label: 'Business' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
]

export const LOGIN_LINK: NavLink = {
  href: '/login',
  label: 'Sign In',
  icon: LogIn,
  aria: 'Sign in to your account',
}

// ── DEPRECATED: Legacy exports (kept for backward compat) ──
// These will be removed in Phase 3 cleanup
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

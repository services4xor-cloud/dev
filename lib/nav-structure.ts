/**
 * Shared navigation link definitions for Nav + Footer
 *
 * Single source of truth for site-wide link structure.
 * Nav.tsx and Footer.tsx both import from here.
 */

import type { LucideIcon } from 'lucide-react'
import {
  Compass,
  Map,
  DollarSign,
  Heart,
  Info,
  Building2,
  Gift,
  LayoutDashboard,
  PlusSquare,
  LogIn,
  Globe,
} from 'lucide-react'

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

// ── Primary desktop nav links ──────────────────────────────────────
export const PRIMARY_LINKS: NavLink[] = [
  {
    href: '/ventures',
    label: 'Ventures',
    icon: Map,
    aria: 'Explore all paths and experiences',
  },
  {
    href: '/compass',
    label: 'Compass',
    icon: Compass,
    aria: 'Find your route across countries',
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: DollarSign,
    aria: 'Anchor pricing plans',
  },
]

// ── Pioneer-facing links (mobile nav "Explore" section) ────────────
export const PIONEER_NAV_LINKS: NavLink[] = [
  {
    href: '/ventures',
    label: 'Browse Ventures',
    icon: Map,
    aria: 'Explore all paths and experiences',
  },
  {
    href: '/offerings',
    label: 'Offerings',
    icon: Globe,
    aria: 'Country offerings — travel, work, business',
  },
  {
    href: '/compass',
    label: 'Find My Path',
    icon: Compass,
    aria: 'Smart route wizard',
  },
  {
    href: '/charity',
    label: 'Community',
    icon: Heart,
    aria: 'UTAMADUNI community impact',
  },
]

// ── Anchor-facing links ────────────────────────────────────────────
export const ANCHOR_NAV_LINKS: NavLink[] = [
  {
    href: '/anchors/dashboard',
    label: 'Anchor Dashboard',
    icon: LayoutDashboard,
    aria: 'Manage your paths and chapters',
  },
  {
    href: '/anchors/post-path',
    label: 'Post a Path',
    icon: PlusSquare,
    aria: 'Create a new opportunity',
  },
]

// ── About / company links ──────────────────────────────────────────
export const ABOUT_NAV_LINKS: NavLink[] = [
  {
    href: '/about',
    label: 'About',
    icon: Info,
    aria: 'About the platform',
  },
  {
    href: '/business',
    label: 'Family Ltd',
    icon: Building2,
    aria: 'Business and legal structure',
  },
  {
    href: '/referral',
    label: 'Refer & Earn',
    icon: Gift,
    aria: 'Referral programme',
  },
]

// ── Auth CTA link ──────────────────────────────────────────────────
export const LOGIN_LINK: NavLink = {
  href: '/login',
  label: 'Sign In',
  icon: LogIn,
  aria: 'Sign in to your account',
}

// ── Footer-specific column links ───────────────────────────────────
export const FOOTER_PIONEER_LINKS: FooterLink[] = [
  { href: '/ventures', label: 'Browse Ventures' },
  { href: '/compass', label: 'Find My Path' },
  { href: '/onboarding', label: 'Create Profile' },
  { href: '/referral', label: 'Refer & Earn' },
]

export const FOOTER_ANCHOR_LINKS: FooterLink[] = [
  { href: '/anchors/post-path', label: 'Post a Path' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/anchors/dashboard', label: 'Anchor Dashboard' },
]

export const FOOTER_DISCOVER_LINKS: FooterLink[] = [
  { href: '/offerings', label: 'Country Offerings' },
  { href: '/experiences', label: 'Safari Experiences' },
  { href: '/be/ke', label: 'BeKenya' },
  { href: '/charity', label: 'UTAMADUNI' },
  { href: '/media', label: 'Media & Stories' },
]

export const FOOTER_COMPANY_LINKS: FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/business', label: 'BeKenya Family Ltd' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
]

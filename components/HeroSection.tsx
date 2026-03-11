/**
 * Shared hero gradient section used across all public pages.
 *
 * Provides consistent branding with the gradient from brand-primary to brand-bg
 * and optional radial glow overlay. Supports icon, badge, title, and subtitle.
 *
 * Usage:
 *   <HeroSection title="About" subtitle="Our story" />
 *   <HeroSection title="Contact" subtitle="Get in touch" icon={<Mail />} badge="24h response" />
 */

import type { ReactNode } from 'react'

interface HeroSectionProps {
  /** Page title (h1) */
  title: string
  /** Optional subtitle text below the title */
  subtitle?: string
  /** Optional icon rendered above the title */
  icon?: ReactNode
  /** Optional badge text rendered as a pill above the title */
  badge?: string
  /** Optional badge icon (rendered before badge text) */
  badgeIcon?: ReactNode
  /** Vertical padding size: 'sm' (py-16), 'md' (py-20), 'lg' (py-28) */
  size?: 'sm' | 'md' | 'lg'
  /** Optional children rendered below the subtitle */
  children?: ReactNode
}

const PADDING = {
  sm: 'py-16',
  md: 'py-20',
  lg: 'py-28',
} as const

export default function HeroSection({
  title,
  subtitle,
  icon,
  badge,
  badgeIcon,
  size = 'md',
  children,
}: HeroSectionProps) {
  return (
    <section
      className={`relative bg-gradient-to-b from-brand-primary to-brand-bg ${PADDING[size]} text-center overflow-hidden`}
    >
      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto px-4">
        {/* Optional badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 bg-brand-primary/30 text-brand-accent px-4 py-2 rounded-full text-sm font-medium mb-4 border border-brand-accent/20">
            {badgeIcon}
            {badge}
          </div>
        )}

        {/* Optional icon */}
        {icon && <div className="mb-5">{icon}</div>}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">{title}</h1>

        {/* Subtitle */}
        {subtitle && <p className="text-gray-300 text-lg max-w-xl mx-auto">{subtitle}</p>}

        {/* Optional children below subtitle */}
        {children}
      </div>
    </section>
  )
}

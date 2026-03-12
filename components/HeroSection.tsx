import type { ReactNode } from 'react'

interface HeroSectionProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  badge?: string
  badgeIcon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  gradientTitle?: boolean
}

const PADDING = {
  sm: 'py-phi-7',
  md: 'py-phi-8',
  lg: 'py-phi-9',
} as const

export default function HeroSection({
  title,
  subtitle,
  icon,
  badge,
  badgeIcon,
  size = 'md',
  children,
  gradientTitle = false,
}: HeroSectionProps) {
  return (
    <section
      className={`relative bg-gradient-to-b from-brand-primary to-brand-bg ${PADDING[size]} text-center overflow-hidden`}
    >
      {/* Ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_70%)]" />

      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-brand-accent/20 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-brand-accent/15 rounded-full animate-pulse-slow [animation-delay:1s]" />
        <div className="absolute bottom-1/3 left-1/2 w-0.5 h-0.5 bg-brand-accent/10 rounded-full animate-pulse-slow [animation-delay:2s]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 reveal-stagger">
        {badge && (
          <div className="inline-flex items-center gap-2 glass-subtle px-phi-4 py-phi-2 text-phi-sm font-medium mb-phi-4 text-brand-accent">
            {badgeIcon}
            {badge}
          </div>
        )}

        {icon && <div className="mb-phi-4">{icon}</div>}

        <h1
          className={`font-display text-phi-2xl sm:text-phi-3xl md:text-phi-4xl font-black leading-phi-tight mb-phi-3 ${
            gradientTitle ? 'gradient-text' : 'text-white'
          }`}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-300 text-phi-lg max-w-xl mx-auto leading-phi">{subtitle}</p>
        )}

        {children}
      </div>
    </section>
  )
}

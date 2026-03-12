import type { ReactNode } from 'react'

interface GlassCardProps {
  variant?: 'default' | 'featured' | 'subtle'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
}

const VARIANT_CLASSES = {
  default: 'glass',
  featured: 'glass-strong gradient-border',
  subtle: 'glass-subtle',
} as const

const PADDING_CLASSES = {
  none: '',
  sm: 'p-phi-3',
  md: 'p-phi-5',
  lg: 'p-phi-7',
} as const

export default function GlassCard({
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  children,
}: GlassCardProps) {
  return (
    <div
      className={`${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]} ${
        hover
          ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/10'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

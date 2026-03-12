import type { ReactNode } from 'react'

interface SectionLayoutProps {
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: string
  ambient?: boolean
  stagger?: boolean
  as?: 'section' | 'div'
  className?: string
  children: ReactNode
}

const SIZE_CLASSES = {
  sm: 'py-phi-6',
  md: 'py-phi-7',
  lg: 'py-phi-8',
} as const

export default function SectionLayout({
  size = 'md',
  maxWidth = 'max-w-6xl 3xl:max-w-[1600px]',
  ambient = false,
  stagger = false,
  as: Tag = 'section',
  className = '',
  children,
}: SectionLayoutProps) {
  return (
    <Tag className={`${SIZE_CLASSES[size]} ${ambient ? 'ambient-glow' : ''} ${className}`}>
      <div className={`${maxWidth} mx-auto px-4 xl:px-8 ${stagger ? 'reveal-stagger' : ''}`}>
        {children}
      </div>
    </Tag>
  )
}

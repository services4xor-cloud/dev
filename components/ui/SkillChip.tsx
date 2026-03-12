interface SkillChipProps {
  label: string
  variant?: 'default' | 'accent' | 'muted'
  className?: string
}

const VARIANT_CLASSES = {
  default: 'bg-gray-800/80 text-gray-300 border-gray-700',
  accent: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  muted: 'bg-gray-800/40 text-gray-500 border-gray-700/50',
} as const

export default function SkillChip({ label, variant = 'default', className = '' }: SkillChipProps) {
  return (
    <span
      className={`inline-flex items-center px-phi-3 py-phi-1 rounded-full text-phi-sm font-medium border
        transition-transform duration-150 hover:scale-105
        ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {label}
    </span>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  accent?: boolean
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  accent = true,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-phi-6 ${className}`}>
      <h2 className="font-display text-phi-2xl md:text-phi-3xl font-bold text-white mb-phi-3">
        {title}
      </h2>
      {accent && (
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-phi-4" />
      )}
      {subtitle && (
        <p className="text-gray-400 text-phi-lg max-w-xl mx-auto leading-phi">{subtitle}</p>
      )}
    </div>
  )
}

/**
 * SectionHeader — reusable section title + subtitle pattern
 *
 * Used across media, fashion, business, charity, and content pages.
 * Centered by default — matches the standard section layout.
 */

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-gray-400 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  )
}

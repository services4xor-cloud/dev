import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  accent?: boolean
  className?: string
}

export default function StatCard({
  label,
  value,
  icon,
  accent = false,
  className = '',
}: StatCardProps) {
  return (
    <div className={`glass p-phi-5 ${className}`}>
      <div className="flex items-center gap-phi-3">
        {icon && (
          <div className={`text-xl ${accent ? 'text-brand-accent' : 'text-gray-400'}`}>{icon}</div>
        )}
        <div>
          <p className="text-phi-sm text-gray-400">{label}</p>
          <p
            className={`text-phi-xl font-bold tabular-nums ${accent ? 'text-brand-accent' : 'text-white'}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

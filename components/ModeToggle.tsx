'use client'

import { useTranslation } from '@/lib/hooks/use-translation'

interface ModeToggleProps {
  mode: 'explorer' | 'host'
  onChange: (mode: 'explorer' | 'host') => void
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const { t } = useTranslation()
  return (
    <div className="glass-subtle inline-flex rounded-full p-1 relative">
      {/* Sliding background indicator */}
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-brand-primary transition-transform duration-300 ease-out"
        style={{
          transform: mode === 'host' ? 'translateX(calc(100% + 8px))' : 'translateX(0)',
        }}
      />

      <button
        type="button"
        onClick={() => onChange('explorer')}
        className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-phi-sm font-medium transition-colors duration-300 ${
          mode === 'explorer' ? 'text-white' : 'text-white/60 hover:text-white/80'
        }`}
      >
        <span aria-hidden="true">🔍</span>
        {t('mode.explorer')}
      </button>

      <button
        type="button"
        onClick={() => onChange('host')}
        className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-phi-sm font-medium transition-colors duration-300 ${
          mode === 'host' ? 'text-white' : 'text-white/60 hover:text-white/80'
        }`}
      >
        <span aria-hidden="true">🏠</span>
        {t('mode.host')}
      </button>
    </div>
  )
}

'use client'

interface CountryPanelProps {
  countryCode: string | null
  onClose: () => void
}

export default function CountryPanel({ countryCode, onClose }: CountryPanelProps) {
  if (!countryCode) return null

  return (
    <div className="fixed right-0 top-0 z-30 h-full w-80 overflow-y-auto border-l border-brand-accent/20 bg-brand-surface p-6">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-brand-text-muted hover:text-brand-text"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold text-brand-accent">Be{countryCode}</h2>
      {/* Country hub content populated from graph edges */}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useIdentity } from '@/lib/identity-context'
import { LANGUAGE_REGISTRY, COUNTRY_OPTIONS, type LanguageCode } from '@/lib/country-selector'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'

// ─── Step Progress ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-3">
          {step > 1 && (
            <div
              className="w-8 h-px"
              style={{
                background:
                  step <= current ? 'var(--color-accent)' : 'rgb(var(--color-surface-2-rgb) / 0.8)',
              }}
            />
          )}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={{
              background:
                step === current
                  ? 'var(--color-accent)'
                  : step < current
                    ? 'var(--color-primary)'
                    : 'rgb(var(--color-surface-2-rgb) / 0.6)',
              color:
                step === current
                  ? 'var(--color-bg)'
                  : step < current
                    ? 'var(--color-accent)'
                    : 'rgb(var(--color-text-rgb) / 0.3)',
              border:
                step <= current
                  ? '1px solid rgb(var(--color-accent-rgb) / 0.5)'
                  : '1px solid rgb(var(--color-text-rgb) / 0.1)',
            }}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: You + Your World ────────────────────────────────────────────────

function Step1({
  selectedCountry,
  selectedLanguages,
  onCountryChange,
  onToggleLanguage,
  onNext,
}: {
  selectedCountry: string
  selectedLanguages: LanguageCode[]
  onCountryChange: (code: string) => void
  onToggleLanguage: (code: LanguageCode) => void
  onNext: () => void
}) {
  const countryOption = COUNTRY_OPTIONS.find((c) => c.code === selectedCountry)

  // Compute connected countries from selected languages
  const connectedCountries = useMemo(() => {
    const codes = new Set<string>()
    for (const lang of selectedLanguages) {
      const reg = LANGUAGE_REGISTRY[lang]
      if (reg) {
        for (const cc of reg.countries) codes.add(cc)
      }
    }
    return codes.size
  }, [selectedLanguages])

  const allLanguages = Object.values(LANGUAGE_REGISTRY)

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white text-center mb-3">
        You + Your World
      </h2>
      <p className="text-white/60 text-center mb-8">
        Where are you based, and what languages do you speak?
      </p>

      {/* Country display + change */}
      <div className="glass-subtle p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{countryOption?.flag || '\uD83C\uDF0D'}</span>
          <div>
            <div className="text-white font-bold">{countryOption?.name || 'Unknown'}</div>
            <div className="text-white/40 text-phi-xs">Detected from your timezone</div>
          </div>
        </div>
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="appearance-none bg-brand-surface text-white text-phi-sm rounded-lg px-4 py-2 pr-8 border border-white/10 cursor-pointer focus:outline-none focus:border-brand-accent/50"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">
            \u25BC
          </span>
        </div>
      </div>

      {/* Language grid */}
      <p className="text-white/80 font-semibold mb-4">Select your languages</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {allLanguages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.code)
          return (
            <button
              key={lang.code}
              onClick={() => onToggleLanguage(lang.code)}
              className={`glass-subtle p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? 'border-brand-accent/60 bg-brand-accent/10'
                  : 'border-transparent hover:border-white/10'
              }`}
              style={
                isSelected
                  ? {
                      borderColor: 'rgb(var(--color-accent-rgb) / 0.6)',
                      background: 'rgb(var(--color-accent-rgb) / 0.1)',
                    }
                  : {}
              }
            >
              <div className="font-bold text-white text-phi-sm">{lang.name}</div>
              <div className="text-white/40 text-phi-xs">{lang.nativeName}</div>
            </button>
          )
        })}
      </div>

      {/* Live feedback */}
      {selectedLanguages.length > 0 && (
        <div className="text-center mb-8">
          <p className="text-brand-accent text-phi-sm font-medium">
            You speak {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
            . This connects you to {connectedCountries} countr
            {connectedCountries !== 1 ? 'ies' : 'y'}.
          </p>
        </div>
      )}

      {/* Next */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={selectedLanguages.length === 0}
          className={`px-8 py-4 rounded-full text-phi-lg font-bold transition-all duration-200 ${
            selectedLanguages.length > 0
              ? 'bg-brand-primary text-white hover:scale-[1.02] active:scale-[0.98] border border-[rgb(var(--color-accent-rgb)/0.4)] shadow-[0_8px_24px_rgb(var(--color-primary-rgb)/0.35)]'
              : 'btn-disabled'
          }`}
        >
          Next \u2192
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: What Matters ────────────────────────────────────────────────────

function Step2({
  selectedInterests,
  onToggleInterest,
  onNext,
  onBack,
}: {
  selectedInterests: string[]
  onToggleInterest: (id: string) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white text-center mb-3">
        What matters to you?
      </h2>
      <p className="text-white/60 text-center mb-8">Pick up to 5 areas that interest you most.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {EXCHANGE_CATEGORIES.map((cat) => {
          const isSelected = selectedInterests.includes(cat.id)
          const atMax = selectedInterests.length >= 5 && !isSelected
          return (
            <button
              key={cat.id}
              onClick={() => !atMax && onToggleInterest(cat.id)}
              disabled={atMax}
              className={`glass-subtle p-4 text-left transition-all duration-200 ${
                atMax ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
              } ${isSelected ? '' : 'hover:border-white/10'}`}
              style={
                isSelected
                  ? {
                      borderColor: 'rgb(var(--color-accent-rgb) / 0.6)',
                      background: 'rgb(var(--color-accent-rgb) / 0.1)',
                      boxShadow: '0 0 20px rgb(var(--color-accent-rgb) / 0.08)',
                    }
                  : {}
              }
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-bold text-white text-phi-sm">{cat.label}</div>
              <div className="text-white/40 text-phi-xs line-clamp-1">{cat.description}</div>
            </button>
          )
        })}
      </div>

      {/* Live feedback */}
      <div className="text-center mb-8">
        <p className="text-brand-accent text-phi-sm font-medium">
          {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Nav */}
      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="btn-ghost px-8 py-4 rounded-full text-phi-lg">
          \u2190 Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedInterests.length === 0}
          className={`px-8 py-4 rounded-full text-phi-lg font-bold transition-all duration-200 ${
            selectedInterests.length > 0
              ? 'bg-brand-primary text-white hover:scale-[1.02] active:scale-[0.98] border border-[rgb(var(--color-accent-rgb)/0.4)] shadow-[0_8px_24px_rgb(var(--color-primary-rgb)/0.35)]'
              : 'btn-disabled'
          }`}
        >
          Next \u2192
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Your Network Appears ────────────────────────────────────────────

function Step3({
  onComplete,
  onBack,
  interestCount,
  languageCount,
}: {
  onComplete: () => void
  onBack: () => void
  interestCount: number
  languageCount: number
}) {
  // Node positions in a concentric layout around center
  const nodes = useMemo(() => {
    const result: { x: number; y: number; type: 'people' | 'opportunity'; delay: number }[] = []
    const count = Math.min(interestCount + languageCount, 8)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2
      const radius = 120
      result.push({
        x: 200 + radius * Math.cos(angle),
        y: 200 + radius * Math.sin(angle),
        type: i % 2 === 0 ? 'people' : 'opportunity',
        delay: i * 150,
      })
    }
    return result
  }, [interestCount, languageCount])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white mb-3">
        Your Network Appears
      </h2>
      <p className="text-white/60 mb-8">This is your world. Explore it.</p>

      {/* Animated SVG network */}
      <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] mx-auto mb-10">
        <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
          {/* Lines from center to nodes */}
          {nodes.map((node, i) => (
            <line
              key={`line-${i}`}
              x1="200"
              y1="200"
              x2={node.x}
              y2={node.y}
              stroke={node.type === 'people' ? 'var(--color-accent)' : 'var(--color-primary-light)'}
              strokeWidth="1"
              opacity="0.3"
              style={{
                animation: `step3-fade-in 0.6s ease-out ${node.delay}ms both`,
              }}
            />
          ))}

          {/* Outer nodes */}
          {nodes.map((node, i) => (
            <circle
              key={`node-${i}`}
              cx={node.x}
              cy={node.y}
              r="8"
              fill={node.type === 'people' ? 'var(--color-accent)' : 'var(--color-primary-light)'}
              opacity="0.8"
              style={{
                animation: `step3-scale-in 0.5s ease-out ${node.delay + 100}ms both`,
                transformOrigin: `${node.x}px ${node.y}px`,
              }}
            />
          ))}

          {/* Center — YOU */}
          <circle cx="200" cy="200" r="14" fill="var(--color-accent)">
            <animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite" />
          </circle>
          <text
            x="200"
            y="240"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="13"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            YOU
          </text>

          {/* Legend */}
          <circle cx="30" cy="370" r="5" fill="var(--color-accent)" opacity="0.8" />
          <text x="42" y="374" fill="white" opacity="0.5" fontSize="10" fontFamily="sans-serif">
            People
          </text>
          <circle cx="110" cy="370" r="5" fill="var(--color-primary-light)" opacity="0.8" />
          <text x="122" y="374" fill="white" opacity="0.5" fontSize="10" fontFamily="sans-serif">
            Opportunities
          </text>
        </svg>
      </div>

      {/* CTAs */}
      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="btn-ghost px-8 py-4 rounded-full text-phi-lg">
          \u2190 Back
        </button>
        <button
          onClick={onComplete}
          className="bg-brand-primary text-white px-8 py-4 rounded-full text-phi-lg font-bold
                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                     border border-[rgb(var(--color-accent-rgb)/0.4)]
                     shadow-[0_8px_32px_rgb(var(--color-primary-rgb)/0.40)]"
        >
          Enter My World \u2192
        </button>
      </div>

      {/* CSS for step 3 animations */}
      <style jsx>{`
        @keyframes step3-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.3;
          }
        }
        @keyframes step3-scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 0.8;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// ─── Main Discovery Component ────────────────────────────────────────────────

export default function Discovery() {
  const router = useRouter()
  const { identity, setCountry, setLanguages, setInterests } = useIdentity()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCountry, setSelectedCountry] = useState(identity.country)
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code)
    setCountry(code)
  }

  const toggleLanguage = (code: LanguageCode) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    )
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleComplete = () => {
    // Commit all selections to identity context
    setLanguages(selectedLanguages)
    setInterests(selectedInterests)
    router.push('/ventures')
  }

  return (
    <section className="min-h-screen bg-brand-bg py-16 px-4">
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1
          selectedCountry={selectedCountry}
          selectedLanguages={selectedLanguages}
          onCountryChange={handleCountryChange}
          onToggleLanguage={toggleLanguage}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2
          selectedInterests={selectedInterests}
          onToggleInterest={toggleInterest}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3
          onComplete={handleComplete}
          onBack={() => setStep(2)}
          interestCount={selectedInterests.length}
          languageCount={selectedLanguages.length}
        />
      )}
    </section>
  )
}

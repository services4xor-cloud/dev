'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useIdentity } from '@/lib/identity-context'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { WORLD_LANGUAGES } from '@/lib/world-data'
import { getCitiesForCountry, getLanguageCodesForCountry } from '@/lib/agents'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import {
  FAITH_OPTIONS,
  CRAFT_SUGGESTIONS,
  REACH_OPTIONS,
  getCultureSuggestionsForCountry,
} from '@/lib/dimensions'

// Convert Record to array for iteration
const LANGUAGE_LIST = Object.values(WORLD_LANGUAGES)

// ─── Step Progress ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {[1, 2, 3, 4, 5].map((step) => (
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

// ─── Shared button styles ────────────────────────────────────────────────────

const nextBtnActive =
  'bg-brand-primary text-white hover:scale-[1.02] active:scale-[0.98] border border-[rgb(var(--color-accent-rgb)/0.4)] shadow-[0_8px_24px_rgb(var(--color-primary-rgb)/0.35)]'

// ─── Step 1: Where & How ────────────────────────────────────────────────────

function Step1({
  selectedCountry,
  selectedLanguages,
  editCity,
  langSearch,
  onCountryChange,
  onToggleLanguage,
  onCityChange,
  onLangSearchChange,
  onNext,
}: {
  selectedCountry: string
  selectedLanguages: string[]
  editCity: string
  langSearch: string
  onCountryChange: (code: string) => void
  onToggleLanguage: (code: string) => void
  onCityChange: (city: string) => void
  onLangSearchChange: (q: string) => void
  onNext: () => void
}) {
  const countryOption = COUNTRY_OPTIONS.find((c) => c.code === selectedCountry)

  // Cities for the selected country
  const countryCities = useMemo(() => getCitiesForCountry(selectedCountry), [selectedCountry])

  // Country's primary language codes — these show first in the grid
  const countryLangCodes = useMemo(
    () => getLanguageCodesForCountry(selectedCountry),
    [selectedCountry]
  )

  const filteredLanguages = useMemo(() => {
    let list = LANGUAGE_LIST
    if (langSearch.trim()) {
      const q = langSearch.toLowerCase()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.nativeName.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q)
      )
    }
    // Sort: country languages first, then alphabetical
    return [...list].sort((a, b) => {
      const aLocal = countryLangCodes.includes(a.code)
      const bLocal = countryLangCodes.includes(b.code)
      if (aLocal && !bLocal) return -1
      if (!aLocal && bLocal) return 1
      return a.name.localeCompare(b.name)
    })
  }, [langSearch, countryLangCodes])

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white text-center mb-3">
        You + Your World
      </h2>
      <p className="text-white/60 text-center mb-8">
        Where are you based, and what languages do you speak?
      </p>

      {/* Country display + change */}
      <div className="glass-subtle p-5 mb-4 flex items-center justify-between">
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
            &#x25BC;
          </span>
        </div>
      </div>

      {/* City input with suggestions */}
      <div className="glass-subtle p-4 mb-8">
        <label className="text-white/60 text-phi-xs block mb-2">Your city</label>
        <input
          type="text"
          value={editCity}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder={
            countryCities.length > 0
              ? `e.g., ${countryCities.slice(0, 3).join(', ')}...`
              : 'Enter your city...'
          }
          className="w-full bg-transparent text-white text-phi-sm border-b border-white/10 pb-2 focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20"
        />
        {countryCities.length > 0 && !editCity && (
          <div className="flex flex-wrap gap-2 mt-3">
            {countryCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onCityChange(city)}
                className="px-3 py-1 rounded-full text-phi-xs text-white/50 border border-white/10 hover:border-brand-accent/40 hover:text-white/80 transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Language search */}
      <p className="text-white/80 font-semibold mb-3">Select your languages</p>
      <div className="mb-4">
        <input
          type="text"
          value={langSearch}
          onChange={(e) => onLangSearchChange(e.target.value)}
          placeholder="Search languages..."
          className="w-full bg-brand-surface text-white text-phi-sm rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:border-brand-accent/50 placeholder:text-white/30"
        />
      </div>

      {/* Language grid — country languages appear first with badge */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-h-[360px] overflow-y-auto pr-1">
        {filteredLanguages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.code)
          const isCountryLang = countryLangCodes.includes(lang.code)
          return (
            <button
              key={lang.code}
              onClick={() => onToggleLanguage(lang.code)}
              className={`glass-subtle p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? 'border-brand-accent/60 bg-brand-accent/10'
                  : isCountryLang
                    ? 'border-brand-primary/30 bg-brand-primary/5'
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
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-phi-sm">{lang.name}</span>
                {isCountryLang && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-accent/80">
                    local
                  </span>
                )}
              </div>
              <div className="text-white/40 text-phi-xs">{lang.nativeName}</div>
            </button>
          )
        })}
        {filteredLanguages.length === 0 && (
          <div className="col-span-full text-center text-white/40 py-8 text-phi-sm">
            No languages match &ldquo;{langSearch}&rdquo;
          </div>
        )}
      </div>

      {/* Live feedback */}
      {selectedLanguages.length > 0 && (
        <div className="text-center mb-8">
          <p className="text-brand-accent text-phi-sm font-medium">
            You speak {selectedLanguages.length} language
            {selectedLanguages.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Next */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={selectedLanguages.length === 0}
          className={`px-8 py-4 rounded-full text-phi-lg font-bold transition-all duration-200 ${
            selectedLanguages.length > 0 ? nextBtnActive : 'btn-disabled'
          }`}
        >
          Next &#x2192;
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: What You Do (Craft) ────────────────────────────────────────────

function Step2({
  selectedCrafts,
  craftSearch,
  onAddCraft,
  onRemoveCraft,
  onCraftSearchChange,
  onNext,
  onBack,
}: {
  selectedCrafts: string[]
  craftSearch: string
  onAddCraft: (craft: string) => void
  onRemoveCraft: (craft: string) => void
  onCraftSearchChange: (q: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const suggestions = useMemo(() => {
    if (!craftSearch.trim()) return []
    const q = craftSearch.toLowerCase()
    return CRAFT_SUGGESTIONS.filter(
      (s) => s.toLowerCase().includes(q) && !selectedCrafts.includes(s)
    ).slice(0, 8)
  }, [craftSearch, selectedCrafts])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && craftSearch.trim() && selectedCrafts.length < 5) {
      e.preventDefault()
      // Use top suggestion if available, otherwise the typed text
      const value = suggestions.length > 0 ? suggestions[0] : craftSearch.trim()
      if (!selectedCrafts.includes(value)) {
        onAddCraft(value)
        onCraftSearchChange('')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white text-center mb-3">
        What do you do?
      </h2>
      <p className="text-white/60 text-center mb-8">Add your skills and profession (1&ndash;5)</p>

      {/* Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={craftSearch}
          onChange={(e) => onCraftSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill or profession..."
          disabled={selectedCrafts.length >= 5}
          className="w-full bg-brand-surface text-white text-phi-sm rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:border-brand-accent/50 placeholder:text-white/30 disabled:opacity-40"
        />
        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-brand-surface border border-white/10 rounded-lg overflow-hidden shadow-xl">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onAddCraft(s)
                  onCraftSearchChange('')
                }}
                className="w-full text-left px-4 py-3 text-white text-phi-sm hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected crafts as pills */}
      {selectedCrafts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {selectedCrafts.map((craft) => (
            <span
              key={craft}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-phi-sm font-medium"
              style={{
                background: 'rgb(var(--color-accent-rgb) / 0.15)',
                border: '1px solid rgb(var(--color-accent-rgb) / 0.4)',
                color: 'var(--color-accent)',
              }}
            >
              {craft}
              <button
                onClick={() => onRemoveCraft(craft)}
                className="text-white/40 hover:text-white transition-colors ml-1"
                aria-label={`Remove ${craft}`}
              >
                &#x2715;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Feedback */}
      <div className="text-center mb-8">
        <p className="text-white/40 text-phi-xs">
          {selectedCrafts.length}/5 selected
          {selectedCrafts.length === 0 && ' \u2014 type to search or add your own'}
        </p>
      </div>

      {/* Nav */}
      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="btn-ghost px-8 py-4 rounded-full text-phi-lg">
          &#x2190; Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedCrafts.length === 0}
          className={`px-8 py-4 rounded-full text-phi-lg font-bold transition-all duration-200 ${
            selectedCrafts.length > 0 ? nextBtnActive : 'btn-disabled'
          }`}
        >
          Next &#x2192;
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: What Drives You (Interests + Reach) ────────────────────────────

function Step3({
  selectedInterests,
  selectedReach,
  onToggleInterest,
  onToggleReach,
  onNext,
  onBack,
}: {
  selectedInterests: string[]
  selectedReach: string[]
  onToggleInterest: (id: string) => void
  onToggleReach: (id: string) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white text-center mb-3">
        What matters to you?
      </h2>
      <p className="text-white/60 text-center mb-8">Pick up to 5 areas that interest you most.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
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

      {/* Reach capabilities */}
      <div className="mb-8">
        <p className="text-white/80 font-semibold mb-3">How can you connect?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {REACH_OPTIONS.map((opt) => {
            const isSelected = selectedReach.includes(opt.id)
            return (
              <button
                key={opt.id}
                onClick={() => onToggleReach(opt.id)}
                className={`glass-subtle p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected ? '' : 'hover:border-white/10'
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
                <div className="text-xl mb-1">{opt.icon}</div>
                <div className="font-bold text-white text-phi-sm">{opt.label}</div>
                <div className="text-white/40 text-phi-xs line-clamp-1">{opt.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Live feedback */}
      <div className="text-center mb-8">
        <p className="text-brand-accent text-phi-sm font-medium">
          {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
          {selectedReach.length > 0 &&
            ` \u00b7 ${selectedReach.length} reach mode${selectedReach.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Nav */}
      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="btn-ghost px-8 py-4 rounded-full text-phi-lg">
          &#x2190; Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedInterests.length === 0}
          className={`px-8 py-4 rounded-full text-phi-lg font-bold transition-all duration-200 ${
            selectedInterests.length > 0 ? nextBtnActive : 'btn-disabled'
          }`}
        >
          Next &#x2192;
        </button>
      </div>
    </div>
  )
}

// ─── Step 4: Who You Are (Faith + Culture, optional) ────────────────────────

function Step4({
  selectedCountry,
  selectedFaith,
  selectedCulture,
  onSelectFaith,
  onCultureChange,
  onNext,
  onBack,
}: {
  selectedCountry: string
  selectedFaith: string[]
  selectedCulture: string
  onSelectFaith: (id: string) => void
  onCultureChange: (val: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const cultureSuggestions = useMemo(
    () => getCultureSuggestionsForCountry(selectedCountry),
    [selectedCountry]
  )

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white text-center mb-2">
        Who you are
      </h2>
      <div className="flex justify-center mb-8">
        <span className="text-white/30 text-phi-xs border border-white/10 rounded-full px-3 py-1">
          optional
        </span>
      </div>

      {/* Faith grid */}
      <p className="text-white/80 font-semibold mb-3">Faith or belief</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {FAITH_OPTIONS.map((opt) => {
          const isSelected = selectedFaith.includes(opt.id)
          return (
            <button
              key={opt.id}
              onClick={() => onSelectFaith(opt.id)}
              className={`glass-subtle p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isSelected ? '' : 'hover:border-white/10'
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
              <span className="text-xl mr-2">{opt.icon}</span>
              <span className="font-bold text-white text-phi-sm">{opt.label}</span>
            </button>
          )
        })}
      </div>

      {/* Culture input */}
      <p className="text-white/80 font-semibold mb-3">Culture or ethnicity</p>
      <input
        type="text"
        value={selectedCulture}
        onChange={(e) => onCultureChange(e.target.value)}
        placeholder="e.g., Maasai, Yoruba, Bavarian..."
        className="w-full bg-brand-surface text-white text-phi-sm rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:border-brand-accent/50 placeholder:text-white/30 mb-3"
      />
      {cultureSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {cultureSuggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => onCultureChange(sug)}
              className="px-3 py-1 rounded-full text-phi-xs border border-white/10 text-white/50 hover:text-white hover:border-brand-accent/40 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-center gap-4 mt-8">
        <button onClick={onBack} className="btn-ghost px-8 py-4 rounded-full text-phi-lg">
          &#x2190; Back
        </button>
        <button
          onClick={onNext}
          className="btn-ghost px-8 py-4 rounded-full text-phi-lg font-medium text-white/60 hover:text-white"
        >
          Skip &#x2192;
        </button>
        <button
          onClick={onNext}
          className={`px-8 py-4 rounded-full text-phi-lg font-bold transition-all duration-200 ${nextBtnActive}`}
        >
          Next &#x2192;
        </button>
      </div>
    </div>
  )
}

// ─── Step 5: Your Network Appears ───────────────────────────────────────────

function Step5({
  onComplete,
  onBack,
  interestCount,
  languageCount,
  craftCount,
  reachCount,
  hasFaith,
  hasCulture,
}: {
  onComplete: () => void
  onBack: () => void
  interestCount: number
  languageCount: number
  craftCount: number
  reachCount: number
  hasFaith: boolean
  hasCulture: boolean
}) {
  // Node positions in a concentric layout around center
  const nodes = useMemo(() => {
    const result: { x: number; y: number; type: 'people' | 'opportunity'; delay: number }[] = []
    const count = Math.min(interestCount + languageCount + craftCount, 12)
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
  }, [interestCount, languageCount, craftCount])

  // Dimension summary
  const dimensions = [
    { label: 'Languages', value: languageCount, active: languageCount > 0 },
    { label: 'Crafts', value: craftCount, active: craftCount > 0 },
    { label: 'Interests', value: interestCount, active: interestCount > 0 },
    { label: 'Reach', value: reachCount, active: reachCount > 0 },
    { label: 'Faith', value: hasFaith ? 1 : 0, active: hasFaith },
    { label: 'Culture', value: hasCulture ? 1 : 0, active: hasCulture },
  ]

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white mb-3">
        Your Network Appears
      </h2>
      <p className="text-white/60 mb-8">This is your world. Explore it.</p>

      {/* Animated SVG network */}
      <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] mx-auto mb-8">
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
                animation: `step5-fade-in 0.6s ease-out ${node.delay}ms both`,
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
                animation: `step5-scale-in 0.5s ease-out ${node.delay + 100}ms both`,
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

      {/* Dimension breakdown */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {dimensions.map((d) => (
          <span
            key={d.label}
            className="text-phi-xs px-3 py-1 rounded-full"
            style={{
              background: d.active
                ? 'rgb(var(--color-accent-rgb) / 0.12)'
                : 'rgb(var(--color-surface-2-rgb) / 0.5)',
              color: d.active ? 'var(--color-accent)' : 'rgb(var(--color-text-rgb) / 0.3)',
              border: d.active
                ? '1px solid rgb(var(--color-accent-rgb) / 0.3)'
                : '1px solid rgb(var(--color-text-rgb) / 0.08)',
            }}
          >
            {d.label}
            {d.active && d.value > 0 && ` (${d.value})`}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="btn-ghost px-8 py-4 rounded-full text-phi-lg">
          &#x2190; Back
        </button>
        <button
          onClick={onComplete}
          className="bg-brand-primary text-white px-8 py-4 rounded-full text-phi-lg font-bold
                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                     border border-[rgb(var(--color-accent-rgb)/0.4)]
                     shadow-[0_8px_32px_rgb(var(--color-primary-rgb)/0.40)]"
        >
          Enter My World &#x2192;
        </button>
      </div>

      {/* CSS for step 5 animations */}
      <style jsx>{`
        @keyframes step5-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.3;
          }
        }
        @keyframes step5-scale-in {
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
  const {
    identity,
    setCountry,
    setLanguages,
    setInterests,
    setCraft,
    setReach,
    setFaith,
    setCulture,
    setCity,
  } = useIdentity()

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [selectedCountry, setSelectedCountry] = useState(identity.country)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [editCity, setEditCity] = useState('')
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([])
  const [selectedReach, setSelectedReach] = useState<string[]>([])
  const [selectedFaith, setSelectedFaith] = useState<string[]>([])
  const [selectedCulture, setSelectedCulture] = useState('')
  const [craftSearch, setCraftSearch] = useState('')
  const [langSearch, setLangSearch] = useState('')

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code)
    setCountry(code)
  }

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    )
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const addCraft = (craft: string) => {
    if (selectedCrafts.length < 5 && !selectedCrafts.includes(craft)) {
      setSelectedCrafts((prev) => [...prev, craft])
    }
  }

  const removeCraft = (craft: string) => {
    setSelectedCrafts((prev) => prev.filter((c) => c !== craft))
  }

  const toggleReach = (id: string) => {
    setSelectedReach((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  const handleComplete = () => {
    // Commit all selections to identity context
    setLanguages(selectedLanguages)
    setInterests(selectedInterests)
    setCraft(selectedCrafts)
    setReach(selectedReach)
    setFaith(selectedFaith)
    if (selectedCulture) setCulture(selectedCulture)
    if (editCity) setCity(editCity)
    router.push('/world')
  }

  return (
    <section className="min-h-screen bg-brand-bg py-16 px-4">
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1
          selectedCountry={selectedCountry}
          selectedLanguages={selectedLanguages}
          editCity={editCity}
          langSearch={langSearch}
          onCountryChange={handleCountryChange}
          onToggleLanguage={toggleLanguage}
          onCityChange={setEditCity}
          onLangSearchChange={setLangSearch}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2
          selectedCrafts={selectedCrafts}
          craftSearch={craftSearch}
          onAddCraft={addCraft}
          onRemoveCraft={removeCraft}
          onCraftSearchChange={setCraftSearch}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3
          selectedInterests={selectedInterests}
          selectedReach={selectedReach}
          onToggleInterest={toggleInterest}
          onToggleReach={toggleReach}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <Step4
          selectedCountry={selectedCountry}
          selectedFaith={selectedFaith}
          selectedCulture={selectedCulture}
          onSelectFaith={(id: string) =>
            setSelectedFaith((prev) =>
              prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
            )
          }
          onCultureChange={setSelectedCulture}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <Step5
          onComplete={handleComplete}
          onBack={() => setStep(4)}
          interestCount={selectedInterests.length}
          languageCount={selectedLanguages.length}
          craftCount={selectedCrafts.length}
          reachCount={selectedReach.length}
          hasFaith={selectedFaith.length > 0}
          hasCulture={!!selectedCulture}
        />
      )}
    </section>
  )
}

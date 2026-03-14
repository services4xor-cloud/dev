'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OptionItem {
  code: string
  label: string
  icon: string
}

interface CorridorResult {
  code: string
  label: string
  icon: string
  matchScore: number
  languages: string[]
  sectors: string[]
}

interface OptionsData {
  countries: OptionItem[]
  languages: OptionItem[]
  sectors: OptionItem[]
}

type Step = 1 | 2 | 3 | 4

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: Step; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const step = (i + 1) as Step
        const isDone = step < current
        const isActive = step === current
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                isActive
                  ? 'bg-brand-accent text-brand-bg'
                  : isDone
                    ? 'bg-brand-accent/30 text-brand-accent'
                    : 'bg-brand-surface text-brand-text-muted border border-brand-accent/20',
              ].join(' ')}
            >
              {isDone ? '✓' : step}
            </div>
            {i < total - 1 && (
              <div
                className={['h-px w-6', isDone ? 'bg-brand-accent/50' : 'bg-brand-accent/15'].join(
                  ' '
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Toggle pill ──────────────────────────────────────────────────────────────

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        selected
          ? 'border-brand-accent bg-brand-accent/20 text-brand-accent'
          : 'border-brand-accent/20 bg-brand-surface text-brand-text-muted hover:border-brand-accent/50 hover:text-brand-text',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-surface">
        <div
          className="h-full rounded-full bg-brand-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs text-brand-text-muted">{pct}%</span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DiscoveryPage() {
  const [step, setStep] = useState<Step>(1)

  // Options data (from /api/discovery/options)
  const [options, setOptions] = useState<OptionsData>({ countries: [], languages: [], sectors: [] })
  const [optionsLoading, setOptionsLoading] = useState(true)

  // Selections
  const [countryQuery, setCountryQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<OptionItem | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set())
  const [selectedSectors, setSelectedSectors] = useState<Set<string>>(new Set())

  // Results
  const [corridors, setCorridors] = useState<CorridorResult[]>([])
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState<string | null>(null)

  // ─── Load options on mount ───────────────────────────────────────────

  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch('/api/discovery/options')
        if (!res.ok) throw new Error('Failed to load options')
        const data = (await res.json()) as OptionsData
        setOptions(data)
      } catch {
        // Options remain empty — wizard still works, just no autocomplete data
      } finally {
        setOptionsLoading(false)
      }
    }
    void loadOptions()
  }, [])

  // ─── Fetch corridors on step 4 ───────────────────────────────────────

  const fetchCorridors = useCallback(async () => {
    setResultsLoading(true)
    setResultsError(null)
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry?.code ?? undefined,
          languages: selectedLanguages.size > 0 ? Array.from(selectedLanguages) : undefined,
          sectors: selectedSectors.size > 0 ? Array.from(selectedSectors) : undefined,
        }),
      })
      if (!res.ok) throw new Error('Discovery request failed')
      const data = (await res.json()) as { corridors: CorridorResult[] }
      setCorridors(data.corridors)
    } catch {
      setResultsError('Could not load Corridors. Please try again.')
    } finally {
      setResultsLoading(false)
    }
  }, [selectedCountry, selectedLanguages, selectedSectors])

  useEffect(() => {
    if (step === 4) {
      void fetchCorridors()
    }
  }, [step, fetchCorridors])

  // ─── Navigation ──────────────────────────────────────────────────────

  function goNext() {
    if (step < 4) setStep((step + 1) as Step)
  }

  function goBack() {
    if (step > 1) setStep((step - 1) as Step)
  }

  // ─── Country autocomplete ────────────────────────────────────────────

  const filteredCountries =
    countryQuery.trim().length > 0
      ? options.countries.filter((c) => c.label.toLowerCase().includes(countryQuery.toLowerCase()))
      : options.countries.slice(0, 8)

  function selectCountry(c: OptionItem) {
    setSelectedCountry(c)
    setCountryQuery(c.label)
  }

  function clearCountry() {
    setSelectedCountry(null)
    setCountryQuery('')
    // Reset downstream selections when origin country changes
    setSelectedLanguages(new Set())
    setSelectedSectors(new Set())
  }

  // ─── Toggle helpers ──────────────────────────────────────────────────

  function toggleLanguage(code: string) {
    setSelectedLanguages((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  function toggleSector(code: string) {
    setSelectedSectors((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  // ─── Step labels ─────────────────────────────────────────────────────

  const stepLabels: Record<Step, string> = {
    1: 'Where are you?',
    2: 'What do you speak?',
    3: 'What do you do?',
    4: 'Your Corridors',
  }

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Header */}
      <header className="border-b border-brand-accent/10 bg-brand-surface px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-brand-accent">Discovery</span>
            <span className="hidden text-xs text-brand-text-muted sm:inline">
              Find your Corridor
            </span>
          </div>
          <Link
            href="/"
            className="text-sm text-brand-text-muted transition hover:text-brand-accent"
          >
            ← Back to Map
          </Link>
        </div>
      </header>

      {/* Wizard container */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-between">
          <StepIndicator current={step} total={4} />
          <span className="text-xs text-brand-text-muted">Step {step} of 4</span>
        </div>

        {/* Step heading */}
        <h2 className="mb-6 text-2xl font-bold text-brand-text">{stepLabels[step]}</h2>

        {/* ── Step 1: Country ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-brand-text-muted">
              Select the country you are currently based in. This sets your starting point for
              finding Corridors.
            </p>

            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={countryQuery}
                onChange={(e) => {
                  setCountryQuery(e.target.value)
                  if (selectedCountry && e.target.value !== selectedCountry.label) {
                    clearCountry()
                  }
                }}
                placeholder="Type a country name…"
                className="w-full rounded-lg border border-brand-accent/20 bg-brand-surface px-4 py-3 text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/50"
              />
              {selectedCountry && (
                <button
                  type="button"
                  onClick={clearCountry}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text"
                  aria-label="Clear selection"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown list */}
            {!selectedCountry && !optionsLoading && (
              <div className="rounded-lg border border-brand-accent/15 bg-brand-surface">
                {filteredCountries.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-brand-text-muted">No countries found.</p>
                ) : (
                  <ul>
                    {filteredCountries.map((c, idx) => (
                      <li key={c.code}>
                        <button
                          type="button"
                          onClick={() => selectCountry(c)}
                          className={[
                            'flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-brand-accent/10',
                            idx < filteredCountries.length - 1
                              ? 'border-b border-brand-accent/10'
                              : '',
                          ].join(' ')}
                        >
                          <span className="text-base">{c.icon}</span>
                          <span className="text-brand-text">{c.label}</span>
                          <span className="ml-auto text-xs text-brand-text-muted">{c.code}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Selected badge */}
            {selectedCountry && (
              <div className="flex items-center gap-3 rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-4 py-3">
                <span className="text-xl">{selectedCountry.icon}</span>
                <div>
                  <p className="font-medium text-brand-accent">{selectedCountry.label}</p>
                  <p className="text-xs text-brand-text-muted">{selectedCountry.code}</p>
                </div>
              </div>
            )}

            {optionsLoading && <p className="text-sm text-brand-text-muted">Loading countries…</p>}
          </div>
        )}

        {/* ── Step 2: Languages ── */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-brand-text-muted">
              Select the languages you speak. Corridors with these official languages will rank
              higher. You can skip this step.
            </p>

            {optionsLoading ? (
              <p className="text-sm text-brand-text-muted">Loading languages…</p>
            ) : options.languages.length === 0 ? (
              <p className="text-sm text-brand-text-muted">No language data available yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {options.languages.map((lang) => (
                  <Pill
                    key={lang.code}
                    label={`${lang.icon} ${lang.label}`}
                    selected={selectedLanguages.has(lang.code)}
                    onClick={() => toggleLanguage(lang.code)}
                  />
                ))}
              </div>
            )}

            {selectedLanguages.size > 0 && (
              <p className="text-xs text-brand-accent">
                {selectedLanguages.size} language{selectedLanguages.size > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* ── Step 3: Sectors ── */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-brand-text-muted">
              Select the sectors or crafts that match your work. You can skip this step.
            </p>

            {optionsLoading ? (
              <p className="text-sm text-brand-text-muted">Loading sectors…</p>
            ) : options.sectors.length === 0 ? (
              <p className="text-sm text-brand-text-muted">No sector data available yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {options.sectors.map((sector) => (
                  <Pill
                    key={sector.code}
                    label={`${sector.icon} ${sector.label}`}
                    selected={selectedSectors.has(sector.code)}
                    onClick={() => toggleSector(sector.code)}
                  />
                ))}
              </div>
            )}

            {selectedSectors.size > 0 && (
              <p className="text-xs text-brand-accent">
                {selectedSectors.size} sector{selectedSectors.size > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* ── Step 4: Results ── */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-brand-text-muted">
              Corridors matched to your profile, ranked by compatibility.
            </p>

            {/* Active filters summary */}
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedCountry && (
                <span className="rounded-full border border-brand-accent/30 px-2 py-1 text-brand-accent">
                  From: {selectedCountry.icon} {selectedCountry.label}
                </span>
              )}
              {selectedLanguages.size > 0 && (
                <span className="rounded-full border border-brand-accent/20 px-2 py-1 text-brand-text-muted">
                  {selectedLanguages.size} language{selectedLanguages.size > 1 ? 's' : ''}
                </span>
              )}
              {selectedSectors.size > 0 && (
                <span className="rounded-full border border-brand-accent/20 px-2 py-1 text-brand-text-muted">
                  {selectedSectors.size} sector{selectedSectors.size > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {resultsLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-brand-surface" />
                ))}
              </div>
            )}

            {resultsError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {resultsError}
                <button
                  type="button"
                  onClick={() => void fetchCorridors()}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {!resultsLoading && !resultsError && corridors.length === 0 && (
              <div className="rounded-xl border border-brand-accent/10 bg-brand-surface px-6 py-8 text-center">
                <p className="text-brand-text-muted">
                  No Corridors found for your current selections.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-4 text-sm text-brand-accent hover:underline"
                >
                  Start over
                </button>
              </div>
            )}

            {!resultsLoading && !resultsError && corridors.length > 0 && (
              <ul className="space-y-3">
                {corridors.map((corridor) => (
                  <li key={corridor.code}>
                    <Link
                      href={`/be/${corridor.code.toLowerCase()}`}
                      className="block rounded-xl border border-brand-accent/15 bg-brand-surface p-4 transition-colors hover:border-brand-accent/40 hover:bg-brand-accent/5"
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-2xl">{corridor.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-brand-text">{corridor.label}</p>
                          <p className="text-xs text-brand-text-muted">{corridor.code}</p>
                        </div>
                        <span className="text-xs font-medium text-brand-accent">
                          {Math.round(corridor.matchScore * 100)}% match
                        </span>
                      </div>

                      <ScoreBar score={corridor.matchScore} />

                      {/* Language + sector tags */}
                      {(corridor.languages.length > 0 || corridor.sectors.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {corridor.languages.slice(0, 3).map((lang) => (
                            <span
                              key={lang}
                              className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs text-brand-accent"
                            >
                              {lang}
                            </span>
                          ))}
                          {corridor.sectors.slice(0, 3).map((sector) => (
                            <span
                              key={sector}
                              className="rounded-full bg-brand-primary/20 px-2 py-0.5 text-xs text-brand-text-muted"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-brand-accent/10 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="rounded-lg border border-brand-accent/20 px-5 py-2.5 text-sm text-brand-text-muted transition-colors hover:border-brand-accent/40 hover:text-brand-text disabled:cursor-not-allowed disabled:opacity-30"
          >
            Back
          </button>

          {step < 4 && (
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary/80"
            >
              {step === 1 && !selectedCountry ? 'Skip' : 'Next'}
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-brand-accent/20 px-5 py-2.5 text-sm text-brand-text-muted transition-colors hover:border-brand-accent/40 hover:text-brand-text"
            >
              Start over
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

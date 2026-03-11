'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PIONEER_TYPES, PioneerType } from '@/lib/vocabulary'
import { COUNTRY_OPTIONS, CORRIDOR_BADGE } from '@/lib/country-selector'
import { SKILLS_BY_TYPE } from '@/data/mock'

// ─── Timezone detection (uses canonical COUNTRY_OPTIONS from lib) ─────────────
function detectCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const match = COUNTRY_OPTIONS.find((c) => c.tz === tz || tz.startsWith(c.tz.split('/')[0]))
    return match?.code ?? 'KE'
  } catch {
    return 'KE'
  }
}

// ─── Confetti Component ───────────────────────────────────────────────────────
function ConfettiBlast() {
  const pieces = Array.from({ length: 30 }, (_, i) => i)
  const colors = ['#5C0A14', '#C9A227', '#006600', '#0891B2', '#FFD700', '#7C3AED']

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-sm animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${0.8 + Math.random() * 1.2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>
          Step {step} of {total}
        </span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#5C0A14] to-[#7a0e1a] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 5

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Form state
  const [pioneerType, setPioneerType] = useState<PioneerType | null>(null)
  const [fromCountry, setFromCountry] = useState<string>('')
  const [detectedCountry, setDetectedCountry] = useState<string>('')
  const [toCountries, setToCountries] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState('')
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Detect timezone on mount
  useEffect(() => {
    const code = detectCountryFromTimezone()
    setDetectedCountry(code)
    setFromCountry(code)
  }, [])

  const detectedCountryInfo = COUNTRY_OPTIONS.find((c) => c.code === detectedCountry)

  // ── Skill helpers ──
  const toggleSkill = (skill: string) => {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const addCustomSkill = () => {
    const trimmed = customSkill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed])
    }
    setCustomSkill('')
  }

  // ── Destination helpers ──
  const toggleDestination = (code: string) => {
    setToCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  // ── Navigation guards ──
  const canAdvance = () => {
    if (step === 1) return pioneerType !== null
    if (step === 2) return fromCountry !== ''
    if (step === 3) return toCountries.length >= 1
    if (step === 4) return skills.length >= 3
    if (step === 5) return headline.trim().length >= 5
    return false
  }

  const advance = () => {
    if (canAdvance() && step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  const back = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  // ── Submit ──
  const handleSubmit = async () => {
    if (!canAdvance()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pioneerType,
          fromCountry,
          toCountries,
          skills,
          headline,
          bio,
          phone,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setDone(true)
        setTimeout(() => router.push('/ventures'), 3000)
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error — please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Completed screen ──
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff8f0] to-[#f0faf4] flex items-center justify-center px-4">
        <ConfettiBlast />
        <div className="text-center max-w-lg">
          <div className="text-7xl mb-6">🌍</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the BeNetwork, Pioneer!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your profile is ready. We&apos;re finding the best Paths for you...
          </p>
          <div className="flex items-center justify-center gap-2 text-[#5C0A14]">
            <div
              className="w-2 h-2 rounded-full bg-[#5C0A14] animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-[#5C0A14] animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-[#5C0A14] animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-4">Taking you to your Ventures...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f0] via-white to-[#f0faf4]">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-bold text-[#5C0A14]">Be</span>
          <span className="text-2xl font-bold text-gray-800">Network</span>
        </div>
        <ProgressBar step={step} total={TOTAL_STEPS} />
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        {/* ── STEP 1: Pioneer Type ── */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">What kind of Pioneer are you?</h1>
            <p className="text-gray-500 mb-8">
              Pick the one that feels most like you. You can always refine later.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(
                Object.entries(PIONEER_TYPES) as [
                  PioneerType,
                  (typeof PIONEER_TYPES)[PioneerType],
                ][]
              ).map(([type, info]) => (
                <button
                  key={type}
                  onClick={() => setPioneerType(type)}
                  className={`
                    relative p-5 rounded-2xl border-2 text-left transition-all duration-200
                    hover:shadow-lg hover:-translate-y-0.5 active:scale-95
                    ${
                      pioneerType === type
                        ? 'border-[#5C0A14] bg-[#5C0A14/5] shadow-md ring-2 ring-[#C9A227/40] ring-offset-1'
                        : 'border-gray-200 bg-white hover:border-[#5C0A14/20]'
                    }
                  `}
                >
                  {pioneerType === type && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#5C0A14] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="text-4xl mb-3">{info.icon}</div>
                  <div className="font-semibold text-gray-900 mb-1">{info.label}</div>
                  <div className="text-xs text-gray-500 leading-snug">{info.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Current Country ── */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Where are you right now?</h1>
            {detectedCountryInfo && fromCountry === detectedCountry && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-xl">{detectedCountryInfo.flag}</span>
                <span className="text-sm text-blue-700">
                  We think you&apos;re in <strong>{detectedCountryInfo.name}</strong>. Correct?
                </span>
              </div>
            )}
            <p className="text-gray-500 mb-6">
              This helps us find the best routes for your journey.
            </p>
            <div className="relative">
              <select
                value={fromCountry}
                onChange={(e) => setFromCountry(e.target.value)}
                className="w-full p-4 pr-10 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 text-lg
                  appearance-none focus:outline-none focus:border-[#5C0A14] focus:ring-2 focus:ring-[#C9A227/20]
                  transition-all cursor-pointer"
              >
                <option value="">Select your country...</option>
                <option value="OTHER">🌍 Other</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {fromCountry && fromCountry !== detectedCountry && (
              <p className="mt-3 text-sm text-gray-500">
                Got it — your profile will be calibrated for{' '}
                {COUNTRY_OPTIONS.find((c) => c.code === fromCountry)?.name ?? fromCountry}.
              </p>
            )}
          </div>
        )}

        {/* ── STEP 3: Destinations ── */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Where do you want to go?</h1>
            <p className="text-gray-500 mb-6">
              Select one or more destinations. We&apos;ll prioritize Paths in these locations.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {COUNTRY_OPTIONS.map((dest) => {
                const isSelected = toCountries.includes(dest.code)
                const badge = CORRIDOR_BADGE[dest.corridorStrength]
                return (
                  <button
                    key={dest.code}
                    onClick={() => toggleDestination(dest.code)}
                    className={`
                      p-4 rounded-2xl border-2 text-left transition-all duration-200
                      hover:shadow-md hover:-translate-y-0.5 active:scale-95
                      ${
                        isSelected
                          ? 'border-[#5C0A14] bg-[#5C0A14]/5 shadow ring-2 ring-[#C9A227]/30 ring-offset-1'
                          : 'border-gray-200 bg-white hover:border-[#5C0A14]/30'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dest.flag}</span>
                        <span className="font-semibold text-gray-900">{dest.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#5C0A14] flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dest.topSectors.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
            {toCountries.length > 0 && (
              <p className="mt-4 text-sm text-[#5C0A14] font-medium">
                {toCountries.length} destination{toCountries.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* ── STEP 4: Skills ── */}
        {step === 4 && pioneerType && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">What skills do you bring?</h1>
            <p className="text-gray-500 mb-2">
              Select at least 3 skills. These power your match score.
            </p>
            {skills.length < 3 && (
              <p className="text-sm text-[#5C0A14] mb-4">
                {3 - skills.length} more needed to continue
              </p>
            )}
            {skills.length >= 3 && (
              <p className="text-sm text-green-600 font-medium mb-4">
                {skills.length} skills selected — great! Add more for better matches.
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {SKILLS_BY_TYPE[pioneerType].map((skill) => {
                const active = skills.includes(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
                      active:scale-95
                      ${
                        active
                          ? 'bg-[#5C0A14] text-white border-[#5C0A14] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#5C0A14/50] hover:text-[#5C0A14]'
                      }
                    `}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {skill}
                  </button>
                )
              })}
            </div>

            {/* Custom skills */}
            {skills.filter((s) => !SKILLS_BY_TYPE[pioneerType].includes(s)).length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  Your custom skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => !SKILLS_BY_TYPE[pioneerType].includes(s))
                    .map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-teal-500 text-white border border-teal-500 shadow-sm active:scale-95"
                      >
                        ✓ {skill}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                placeholder="Add your own skill..."
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#5C0A14] text-sm"
              />
              <button
                onClick={addCustomSkill}
                disabled={!customSkill.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#5C0A14] text-white text-sm font-medium
                  disabled:opacity-40 hover:bg-[#7a0e1a] active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Headline & Contact ── */}
        {step === 5 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us your chapter title</h1>
            <p className="text-gray-500 mb-6">
              Your headline is the first thing Anchors see. Make it yours.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your headline *
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Safari Guide with 5 years experience | Swahili & English"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none
                    focus:border-[#5C0A14] focus:ring-2 focus:ring-[#C9A227/20] text-gray-900
                    placeholder-gray-400 transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">{headline.length} / 120 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What makes you, you? <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short story about your journey, your passion, what drives you..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none
                    focus:border-[#5C0A14] focus:ring-2 focus:ring-[#C9A227/20] text-gray-900
                    placeholder-gray-400 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  WhatsApp number{' '}
                  <span className="text-gray-400 font-normal">
                    (optional — get notified about matches)
                  </span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-100 border-2 border-gray-200 rounded-l-2xl text-gray-500 text-sm border-r-0">
                    +
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="flex-1 px-4 py-3 rounded-r-2xl border-2 border-gray-200 focus:outline-none
                      focus:border-[#5C0A14] focus:ring-2 focus:ring-[#C9A227/20] text-gray-900
                      placeholder-gray-400 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Include country code. We&apos;ll send WhatsApp alerts for new Path matches.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Nav ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-xl px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={back}
              className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-medium
                hover:border-gray-300 active:scale-95 transition-all"
            >
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              onClick={advance}
              disabled={!canAdvance()}
              className={`
                flex-1 py-3 rounded-2xl font-semibold text-white transition-all active:scale-95
                ${
                  canAdvance()
                    ? 'bg-[#5C0A14] hover:bg-[#7a0e1a] shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance() || submitting}
              className={`
                flex-1 py-3 rounded-2xl font-semibold text-white transition-all active:scale-95
                ${
                  canAdvance() && !submitting
                    ? 'bg-gradient-to-r from-[#5C0A14] to-[#7a0e1a] hover:from-[#7a0e1a] hover:to-[#5C0A14] shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {submitting ? 'Opening your chapter...' : 'Open My First Chapter'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

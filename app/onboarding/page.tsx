'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PIONEER_TYPES, PioneerType } from '@/lib/vocabulary'
import { COUNTRY_OPTIONS, CORRIDOR_BADGE } from '@/lib/country-selector'
import { SKILLS_BY_TYPE } from '@/data/mock'
import { detectCountryFromTimezone } from '@/lib/geo'
import { saveIdentityFlags, getVenturesUrl } from '@/lib/identity-flags'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'

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
function ProgressBar({
  step,
  total,
  t,
}: {
  step: number
  total: number
  t: (key: string, vars?: Record<string, string>) => string
}) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>{t('onboarding.step', { step: String(step), total: String(total) })}</span>
        <span>
          {pct}
          {t('onboarding.complete')}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const { identity } = useIdentity()
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 5

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Form state — identity context takes priority over timezone detection
  const [pioneerType, setPioneerType] = useState<PioneerType | null>(null)
  const [fromCountry, setFromCountry] = useState<string>(identity.country || '')
  const [detectedCountry, setDetectedCountry] = useState<string>(identity.country || '')
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
    if (!canAdvance() || !pioneerType) return
    setSubmitting(true)
    setError(null)
    try {
      // Save identity flags locally (works without DB)
      saveIdentityFlags({
        pioneerType,
        fromCountry,
        toCountries,
        skills,
        headline,
        bio,
        phone,
      })

      // Also try API (will succeed when backend is live)
      try {
        await fetch('/api/onboarding', {
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
      } catch {
        // API not live yet — that's fine, flags are saved locally
      }

      setDone(true)
      // Redirect to personalized Ventures feed
      setTimeout(() => router.push(getVenturesUrl()), 3000)
    } catch {
      setError(t('onboarding.tryAgain'))
    } finally {
      setSubmitting(false)
    }
  }

  // ── Completed screen ──
  if (done) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <ConfettiBlast />
        <div className="text-center max-w-lg">
          <div className="text-7xl mb-6">🌍</div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('onboarding.welcome')}</h1>
          <p className="text-xl text-gray-400 mb-6">{t('onboarding.profileReady')}</p>
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-brand-accent animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-brand-accent animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-brand-accent animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-4">{t('onboarding.takingYou')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="max-w-2xl 3xl:max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl font-bold text-brand-accent">Be</span>
          <span className="text-2xl font-bold text-white">{t('onboarding.network')}</span>
        </div>
        <ProgressBar step={step} total={TOTAL_STEPS} t={t} />
      </div>

      {/* Step Content */}
      <div className="max-w-2xl 3xl:max-w-4xl mx-auto px-4 pb-24">
        {/* ── STEP 1: Pioneer Type ── */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.whatKind')}</h1>
            <p className="text-gray-400 mb-8">{t('onboarding.pickOne')}</p>
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
                        ? 'border-brand-accent bg-brand-primary/20 shadow-md ring-2 ring-brand-accent/30 ring-offset-1 ring-offset-[var(--color-bg)]'
                        : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
                    }
                  `}
                >
                  {pioneerType === type && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-brand-bg"
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
                  <div className="text-4xl mb-3">{info.icon}</div>
                  <div className="font-semibold text-white mb-1">{info.label}</div>
                  <div className="text-xs text-gray-400 leading-snug">{info.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Current Country ── */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.whereNow')}</h1>
            {detectedCountryInfo && fromCountry === detectedCountry && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-brand-primary/20 rounded-xl border border-brand-accent/30">
                <span className="text-xl">{detectedCountryInfo.flag}</span>
                <span className="text-sm text-brand-accent">
                  {t('onboarding.weThink', { country: detectedCountryInfo.name })}
                </span>
              </div>
            )}
            <p className="text-gray-400 mb-6">{t('onboarding.helpsRoutes')}</p>
            <div className="relative">
              <select
                value={fromCountry}
                onChange={(e) => setFromCountry(e.target.value)}
                className="w-full p-4 pr-10 rounded-2xl border-2 border-gray-700 bg-gray-900/60 text-white text-lg
                  appearance-none focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20
                  transition-all cursor-pointer"
              >
                <option value="">{t('onboarding.selectCountry')}</option>
                <option value="OTHER">{t('onboarding.other')}</option>
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
              <p className="mt-3 text-sm text-gray-400">
                {t('onboarding.calibrated', {
                  country: COUNTRY_OPTIONS.find((c) => c.code === fromCountry)?.name ?? fromCountry,
                })}
              </p>
            )}
          </div>
        )}

        {/* ── STEP 3: Destinations ── */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.whereTo')}</h1>
            <p className="text-gray-400 mb-6">{t('onboarding.selectDestinations')}</p>
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
                          ? 'border-brand-accent bg-brand-primary/20 shadow ring-2 ring-brand-accent/20 ring-offset-1 ring-offset-[var(--color-bg)]'
                          : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dest.flag}</span>
                        <span className="font-semibold text-white">{dest.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-brand-bg"
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
                          className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full"
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
              <p className="mt-4 text-sm text-brand-accent font-medium">
                {t('onboarding.destinationsSelected', {
                  count: String(toCountries.length),
                  s: toCountries.length > 1 ? 's' : '',
                })}
              </p>
            )}
          </div>
        )}

        {/* ── STEP 4: Skills ── */}
        {step === 4 && pioneerType && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.whatSkills')}</h1>
            <p className="text-gray-400 mb-2">{t('onboarding.selectSkills')}</p>
            {skills.length < 3 && (
              <p className="text-sm text-brand-accent mb-4">
                {t('onboarding.moreNeeded', { count: String(3 - skills.length) })}
              </p>
            )}
            {skills.length >= 3 && (
              <p className="text-sm text-green-400 font-medium mb-4">
                {t('onboarding.skillsSelected', { count: String(skills.length) })}
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
                          ? 'bg-brand-primary text-white border-brand-accent shadow-sm'
                          : 'bg-gray-900/60 text-gray-300 border-gray-700 hover:border-brand-accent/50 hover:text-white'
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
                  {t('onboarding.customSkills')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => !SKILLS_BY_TYPE[pioneerType].includes(s))
                    .map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-brand-accent/20 text-brand-accent border border-brand-accent/40 shadow-sm active:scale-95"
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
                placeholder={t('onboarding.addSkill')}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-700 bg-gray-900/60 text-white
                  placeholder-gray-500 focus:outline-none focus:border-brand-accent text-sm"
              />
              <button
                onClick={addCustomSkill}
                disabled={!customSkill.trim()}
                className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-medium
                  disabled:opacity-40 hover:bg-brand-primary-light active:scale-95 transition-all"
              >
                {t('onboarding.add')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Headline & Contact ── */}
        {step === 5 && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.chapterTitle')}</h1>
            <p className="text-gray-400 mb-6">{t('onboarding.headlineFirst')}</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  {t('onboarding.yourHeadline')}
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={t('onboarding.headlinePlaceholder')}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-700 bg-gray-900/60 text-white
                    placeholder-gray-500 focus:outline-none focus:border-brand-accent focus:ring-2
                    focus:ring-brand-accent/20 transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {headline.length} {t('onboarding.charLimit')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  {t('onboarding.whatMakesYou')}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t('onboarding.shortStory')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-700 bg-gray-900/60 text-white
                    placeholder-gray-500 focus:outline-none focus:border-brand-accent focus:ring-2
                    focus:ring-brand-accent/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  {t('onboarding.whatsapp')}{' '}
                  <span className="text-gray-400 font-normal">
                    {t('onboarding.whatsappOptional')}
                  </span>
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-800 border-2 border-gray-700 rounded-l-2xl text-gray-400 text-sm border-r-0">
                    +
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="flex-1 px-4 py-3 rounded-r-2xl border-2 border-gray-700 bg-gray-900/60 text-white
                      placeholder-gray-500 focus:outline-none focus:border-brand-accent focus:ring-2
                      focus:ring-brand-accent/20 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{t('onboarding.whatsappHint')}</p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Nav ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-primary/30 shadow-xl px-4 py-4">
        <div className="max-w-2xl 3xl:max-w-4xl mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={back}
              className="px-6 py-3 rounded-2xl border-2 border-gray-700 text-gray-300 font-medium
                hover:border-gray-600 active:scale-95 transition-all"
            >
              {t('common.back')}
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
                    ? 'bg-brand-primary hover:bg-brand-primary-light shadow-md hover:shadow-lg'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {t('onboarding.continue')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance() || submitting}
              className={`
                flex-1 py-3 rounded-2xl font-semibold text-white transition-all active:scale-95
                ${
                  canAdvance() && !submitting
                    ? 'bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-light hover:to-brand-primary shadow-md hover:shadow-lg'
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {submitting ? t('onboarding.openingChapter') : t('onboarding.openChapter')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

/**
 * Signup Page — Two-step registration
 *
 * Step 1: Choose role (Pioneer / Anchor)
 * Step 2: Google OAuth or email/password registration
 *
 * All text driven by useTranslation() for multi-language support.
 */

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Building2, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { MOCK_PROFILE } from '@/data/mock'
import { useIdentity } from '@/lib/identity-context'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'

type Role = 'PIONEER' | 'ANCHOR'

export default function SignupPage() {
  const { identity, brandName } = useIdentity()
  const { t } = useTranslation()
  const [role, setRole] = useState<Role>('PIONEER')
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: identity.country || MOCK_PROFILE.country,
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/onboarding'

  // Pick up NextAuth error from redirect
  useEffect(() => {
    const errCode = searchParams.get('error')
    if (errCode === 'OAuthAccountNotLinked') {
      setError(t('auth.emailExists'))
    } else if (errCode) {
      setError(t('auth.somethingWrong'))
    }
  }, [searchParams, t])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // ── Google OAuth ───────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    await signIn('google', { callbackUrl })
  }

  // ── Email/Password Registration ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          country: form.country,
          role,
          phone: form.phone || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? t('auth.somethingWrong'))
        setLoading(false)
        return
      }

      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError(t('auth.somethingWrong'))
        setLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError(t('auth.somethingWrong'))
      setLoading(false)
    }
  }

  const roleLabel = role === 'PIONEER' ? t('nav.pioneer') : t('common.anchor')

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-8 ambient-glow">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-phi-5">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.svg" alt={brandName} width={40} height={40} unoptimized />
            <span className="text-phi-xl font-bold text-brand-accent">{brandName}</span>
          </Link>
          <h1 className="mt-4 text-phi-2xl font-bold text-white">{t('auth.createAccount')}</h1>
          <p className="mt-1 text-phi-sm text-gray-400">{t('auth.freeForever')}</p>
        </div>

        <GlassCard padding="lg">
          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-6 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-4">{t('auth.iAmA')}</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Pioneer */}
                <button
                  onClick={() => setRole('PIONEER')}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                    role === 'PIONEER'
                      ? 'border-brand-accent bg-brand-primary/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {role === 'PIONEER' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-brand-accent rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-brand-bg" />
                    </div>
                  )}
                  <Users className="w-8 h-8 mb-2 text-brand-accent" />
                  <div className="font-semibold text-white">{t('nav.pioneer')}</div>
                  <div className="text-sm text-gray-400 mt-1">{t('auth.findMyPath')}</div>
                </button>

                {/* Anchor */}
                <button
                  onClick={() => setRole('ANCHOR')}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                    role === 'ANCHOR'
                      ? 'border-brand-accent bg-brand-primary/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {role === 'ANCHOR' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-brand-accent rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-brand-bg" />
                    </div>
                  )}
                  <Building2 className="w-8 h-8 mb-2 text-brand-accent" />
                  <div className="font-semibold text-white">{t('common.anchor')}</div>
                  <div className="text-sm text-gray-400 mt-1">{t('auth.openPathsTalent')}</div>
                </button>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full py-3 text-base">
                {t('auth.continueAs', { role: roleLabel })}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-gray-400 hover:text-gray-200 mb-4 flex items-center gap-1"
              >
                {t('auth.back')}
              </button>

              {/* Google SSO */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-xl py-3 px-4 font-medium text-gray-300 hover:bg-gray-800 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {googleLoading ? t('auth.connectingGoogle') : t('auth.continueGoogle')}
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-primary/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-brand-surface px-3 text-gray-400">
                    {t('auth.orFillDetails')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('auth.fullName')}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Kamau"
                      className="input w-full"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('auth.country')}
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="input w-full"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input w-full"
                    required
                    autoComplete="email"
                  />
                </div>

                {form.country === MOCK_PROFILE.country && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('auth.phoneOptional')}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="07XX XXX XXX"
                      className="input w-full"
                      autoComplete="tel"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('auth.password')}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={t('auth.minChars')}
                    className="input w-full"
                    minLength={8}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" />
                      {t('auth.creatingAccount')}
                    </span>
                  ) : (
                    t('auth.createAccountFree')
                  )}
                </button>

                <p className="text-xs text-center text-gray-400">
                  {t('auth.agreePrivacy')}{' '}
                  <Link href="/privacy" className="underline text-gray-400">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </>
          )}
        </GlassCard>

        <p className="text-center mt-phi-5 text-gray-400">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link href="/login" className="text-brand-accent font-semibold hover:underline">
            {t('auth.signInLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}

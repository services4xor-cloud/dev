'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: integrate NextAuth password reset when credentials are available
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 ambient-glow">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-brand-accent/60 hover:text-brand-accent text-phi-sm mb-phi-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('forgotPassword.backToSignIn')}
        </Link>

        <GlassCard padding="lg">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-phi-lg font-bold text-white mb-2">
                {t('forgotPassword.checkEmail')}
              </h2>
              <p className="text-gray-400 text-sm">{t('forgotPassword.sentDesc', { email })}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-phi-2xl font-bold text-white mb-1">
                  {t('forgotPassword.title')}
                </h1>
                <p className="text-gray-400 text-sm">{t('forgotPassword.desc')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {t('forgotPassword.emailLabel')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 font-bold disabled:opacity-60"
                >
                  {loading ? t('forgotPassword.sending') : t('forgotPassword.sendLink')}
                </button>
              </form>
            </>
          )}
        </GlassCard>

        <p className="text-center text-gray-400 text-phi-sm mt-phi-3">
          {t('forgotPassword.noAccount')}{' '}
          <Link
            href="/signup"
            className="text-brand-accent hover:text-brand-accent-light transition-colors"
          >
            {t('forgotPassword.signUpFree')}
          </Link>
        </p>
      </div>
    </div>
  )
}

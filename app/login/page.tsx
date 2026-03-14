'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)
    try {
      const result = await signIn('email', {
        email: email.trim(),
        redirect: false,
        callbackUrl: '/',
      })
      if (result?.error) {
        setError('Could not send sign-in link. Please try again.')
      } else {
        setMagicLinkSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-brand-surface p-8">
        <div className="text-center">
          <a href="/" className="text-xs text-brand-text-muted hover:text-brand-accent">
            ← Back to Map
          </a>
          <h1 className="mt-2 text-2xl font-bold text-brand-accent">Be[X]</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Sign in to explore</p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-brand-accent transition hover:opacity-90"
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-brand-text-muted">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Magic Link */}
        {magicLinkSent ? (
          <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/5 px-4 py-4 text-center">
            <p className="text-sm font-medium text-brand-accent">Check your email</p>
            <p className="mt-1 text-xs text-brand-text-muted">
              We sent a sign-in link to <strong className="text-brand-text">{email}</strong>
            </p>
            <button
              onClick={() => {
                setMagicLinkSent(false)
                setEmail('')
              }}
              className="mt-3 text-xs text-brand-text-muted hover:text-brand-accent transition"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-lg border border-white/10 bg-brand-bg px-4 py-3 text-sm text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/50 transition"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full rounded-lg border border-brand-accent/30 px-4 py-3 text-sm font-medium text-brand-text transition hover:bg-brand-accent/10 disabled:opacity-40"
            >
              {loading ? 'Sending…' : 'Sign in with Email'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-brand-text-muted">
          No password needed — we&apos;ll send you a secure sign-in link.
        </p>
      </div>
    </div>
  )
}

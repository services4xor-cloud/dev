'use client'

import { useEffect, useState, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

function SignupForm() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [referrerName, setReferrerName] = useState<string | null>(null)
  const [refCode, setRefCode] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validate ref param on load
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref) return
    setRefCode(ref)
    fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: ref }),
    })
      .then((r) => r.json())
      .then((data: { valid: boolean; referrerName?: string }) => {
        if (data.valid && data.referrerName) {
          setReferrerName(data.referrerName)
        }
      })
      .catch(() => {
        // Silently ignore — referral is optional
      })
  }, [searchParams])

  // After sign-in completes (session appears), claim the referral
  useEffect(() => {
    if (!session?.user || !refCode) return
    fetch('/api/referral/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: refCode }),
    }).catch(() => {
      // Silently ignore — claim is best-effort
    })
  }, [session, refCode])

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-brand-surface p-8">
        <div className="text-center">
          <a href="/" className="text-xs text-brand-text-muted hover:text-brand-accent">
            ← Back to Map
          </a>
          <h1 className="mt-2 text-2xl font-bold text-brand-accent">Be[X]</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Join the network</p>
        </div>

        {referrerName && (
          <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-center">
            <p className="text-xs text-brand-accent">
              Referred by <span className="font-semibold">{referrerName}</span>
            </p>
          </div>
        )}

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-brand-accent transition hover:opacity-90"
        >
          Sign up with Google
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
          <form
            onSubmit={async (e) => {
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
            }}
            className="space-y-3"
          >
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
              {loading ? 'Sending…' : 'Sign up with Email'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-brand-text-muted">
          No password needed — we&apos;ll email you a secure link.
        </p>

        <p className="text-center text-xs text-brand-text-muted">
          Already have an account?{' '}
          <a href="/login" className="text-brand-accent hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-bg">
          <p className="text-brand-text-muted text-sm animate-pulse">Loading…</p>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}

'use client'

import { useEffect, useState, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

function SignupForm() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [referrerName, setReferrerName] = useState<string | null>(null)
  const [refCode, setRefCode] = useState<string | null>(null)

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

'use client'

import { useEffect, useState, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import PasswordAuthForm from '@/components/PasswordAuthForm'

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

  const rawCallback = searchParams.get('callbackUrl') ?? '/'
  const callbackUrl =
    rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/'

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="card w-full max-w-sm space-y-6 p-6 sm:p-8">
        <div className="text-center">
          <p className="eyebrow">Be[X]</p>
          <h1 className="mt-2 font-display text-3xl text-brand-text">Create your account</h1>
          <p className="mt-2 text-sm text-brand-text-muted">
            Free. Book offerings, list your own and talk to the agent.
          </p>
        </div>

        {referrerName && (
          <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-center">
            <p className="text-xs text-brand-accent">
              Referred by <span className="font-semibold">{referrerName}</span>
            </p>
          </div>
        )}

        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="btn btn-primary w-full"
        >
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-line" />
          <span className="text-xs text-brand-text-muted">or</span>
          <div className="h-px flex-1 bg-brand-line" />
        </div>

        <PasswordAuthForm mode="register" callbackUrl={callbackUrl} />

        <p className="text-center text-sm text-brand-text-muted">
          Already have an account?{' '}
          <a
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-brand-accent hover:underline"
          >
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
        <div className="flex flex-1 items-center justify-center py-24">
          <p className="text-brand-text-muted text-sm animate-pulse">Loading…</p>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}

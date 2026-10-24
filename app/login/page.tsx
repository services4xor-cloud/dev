'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Suspense } from 'react'
import PasswordAuthForm from '@/components/PasswordAuthForm'

const ERROR_MESSAGES: Record<string, string> = {
  Callback: 'Google login is not configured yet. Please try again later.',
  OAuthSignin: 'Could not start Google sign-in. Please try again.',
  OAuthCallback: 'Google sign-in failed. Please try again.',
  OAuthAccountNotLinked: 'This email already has an account. Sign in the way you did before.',
  InvalidLink: 'That confirmation link is invalid or expired. Sign up again to get a new one.',
  Default: 'Something went wrong. Please try again.',
}

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : null
  const verified = searchParams.get('verified') === '1'
  const rawCallback = searchParams.get('callbackUrl') ?? '/'
  // Only allow same-site relative paths as post-login targets
  const callbackUrl =
    rawCallback.startsWith('/') && !rawCallback.startsWith('//') ? rawCallback : '/'

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="card w-full max-w-sm space-y-6 p-6 text-center sm:p-8">
        {errorMessage && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {verified && (
          <div className="rounded-lg border border-brand-accent/40 bg-brand-accent/10 px-4 py-3 text-sm text-brand-text">
            Email confirmed. Sign in with your password.
          </div>
        )}

        <div>
          <p className="eyebrow">Be[X]</p>
          <h1 className="mt-2 font-display text-3xl text-brand-text">Welcome back</h1>
          <p className="mt-2 text-sm text-brand-text-muted">
            Sign in to book, list offerings and talk to the agent.
          </p>
        </div>

        {/* Google Sign-In — official branding for trust */}
        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-4 py-3 text-sm font-medium text-[#1f1f1f] shadow-sm transition hover:bg-[#f8f8f8] hover:shadow-md active:bg-[#e8e8e8]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
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
          Sign in with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-line" />
          <span className="text-xs text-brand-text-muted">or with email</span>
          <div className="h-px flex-1 bg-brand-line" />
        </div>

        <PasswordAuthForm
          mode="signin"
          defaultEmail={searchParams.get('email') ?? ''}
          callbackUrl={callbackUrl}
        />

        <p className="text-sm text-brand-text-muted">
          New here?{' '}
          <a
            href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-brand-accent hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

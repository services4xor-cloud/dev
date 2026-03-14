'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
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
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full rounded-lg bg-brand-primary px-4 py-3 font-medium text-brand-accent transition hover:opacity-90"
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
}

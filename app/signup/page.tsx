'use client'

import { signIn } from 'next-auth/react'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-brand-surface p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-accent">Be[X]</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Join the network</p>
        </div>
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

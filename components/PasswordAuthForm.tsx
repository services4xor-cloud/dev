'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

const SIGN_IN_ERRORS: Record<string, string> = {
  CredentialsSignin: 'Email or password is wrong.',
  EmailNotVerified: 'Please confirm your email first. Check your inbox for the link.',
  TooManyAttempts: 'Too many attempts. Wait 15 minutes and try again.',
}

interface PasswordAuthFormProps {
  mode: 'signin' | 'register'
  defaultEmail?: string
  callbackUrl?: string
}

/** Email + password sign-in or registration (registration sends a confirmation email). */
export default function PasswordAuthForm({
  mode,
  defaultEmail = '',
  callbackUrl = '/',
}: PasswordAuthFormProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        if (!res.ok) {
          setError(data.error ?? 'Could not create your account. Please try again.')
          return
        }
        setRegistered(true)
        return
      }
      const result = await signIn('password', { email, password, redirect: false, callbackUrl })
      if (result?.error) {
        setError(SIGN_IN_ERRORS[result.error] ?? SIGN_IN_ERRORS.CredentialsSignin)
        return
      }
      window.location.href = result?.url ?? callbackUrl
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/5 px-4 py-4 text-center">
        <p className="text-sm font-medium text-brand-accent">Check your email</p>
        <p className="mt-1 text-xs text-brand-text-muted">
          We sent a confirmation link to <strong className="text-brand-text">{email}</strong>. After
          confirming, sign in with your password.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-brand-bg px-4 py-3 text-sm text-brand-text placeholder-brand-text-muted outline-none transition focus:border-brand-accent/50'

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-3 text-left">
      {mode === 'register' && (
        <input
          id="auth-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={80}
          autoComplete="name"
          className={inputClass}
        />
      )}
      <input
        id="auth-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        autoComplete="email"
        className={inputClass}
      />
      <input
        id="auth-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={mode === 'register' ? 'Password (at least 10 characters)' : 'Password'}
        required
        minLength={mode === 'register' ? 10 : undefined}
        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
        className={inputClass}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button type="submit" disabled={loading || !email.trim() || !password} className="btn w-full">
        {loading
          ? mode === 'register'
            ? 'Creating account…'
            : 'Signing in…'
          : mode === 'register'
            ? 'Create account'
            : 'Sign in with email'}
      </button>
    </form>
  )
}

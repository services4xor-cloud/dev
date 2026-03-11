'use client'

/**
 * Login Page — NextAuth-integrated sign in
 *
 * Two methods:
 *   1. Google OAuth (one-click) → redirects to Google, returns to /
 *   2. Email/password → Credentials provider with bcrypt lookup
 *
 * Displays errors from NextAuth error query params.
 */

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { BRAND_NAME } from '@/data/mock'

// Map NextAuth error codes to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Could not start Google sign-in. Please try again.',
  OAuthCallback: 'Google sign-in failed. Try again or use email.',
  OAuthAccountNotLinked: 'This email is already registered with a different method.',
  CredentialsSignin: 'Invalid email or password. Please check and try again.',
  SessionRequired: 'Please sign in to continue.',
  Default: 'Something went wrong. Please try again.',
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  // Pick up error from NextAuth redirect (e.g. ?error=OAuthAccountNotLinked)
  useEffect(() => {
    const errCode = searchParams.get('error')
    if (errCode) {
      setError(ERROR_MESSAGES[errCode] ?? ERROR_MESSAGES.Default)
    }
  }, [searchParams])

  // Where to redirect after login
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  // ── Google OAuth ───────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    await signIn('google', { callbackUrl })
    // signIn redirects — setGoogleLoading(false) won't be reached
  }

  // ── Email/Password ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(ERROR_MESSAGES.CredentialsSignin)
      setLoading(false)
    } else {
      // Success — redirect manually since we used redirect: false
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.svg" alt={BRAND_NAME} width={40} height={40} unoptimized />
            <span className="text-2xl font-bold text-brand-accent">{BRAND_NAME}</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-gray-400">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/60 rounded-2xl shadow-sm border border-brand-primary/30 p-8">
          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-6 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-primary/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900/60 px-3 text-gray-400">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10 w-full"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-sm text-brand-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10 w-full"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-400">
          New to {BRAND_NAME}?{' '}
          <Link href="/signup" className="text-brand-accent font-semibold hover:underline">
            Create free account →
          </Link>
        </p>
      </div>
    </div>
  )
}

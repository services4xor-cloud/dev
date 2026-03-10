'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
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
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#C9A227]/60 hover:text-[#C9A227] text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-gray-400 text-sm">
                If an account exists for <span className="text-[#C9A227]">{email}</span>,
                you&apos;ll receive a reset link shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Reset password</h1>
                <p className="text-gray-400 text-sm">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)',
                    border: '1px solid rgba(201,162,39,0.35)',
                  }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#C9A227] hover:text-[#D4AF37] transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

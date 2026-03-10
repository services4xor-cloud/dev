'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Briefcase, Users, Building2, Check } from 'lucide-react'

type Role = 'PIONEER' | 'ANCHOR'

export default function SignupPage() {
  const [role, setRole] = useState<Role>('PIONEER')
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', country: 'Kenya' })
  const [loading, setLoading] = useState(false)

  const countries = ['Kenya', 'Nigeria', 'Ghana', 'South Africa', 'Uganda', 'Tanzania', 'United Kingdom', 'United States', 'Canada', 'Germany', 'UAE', 'Australia']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5C0A14] rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Beke</span>
              <span className="text-[#C9A227]">nya</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-gray-400">Free forever. No credit card needed.</p>
        </div>

        <div className="bg-gray-900/60 rounded-2xl shadow-sm border border-gray-800 p-8">
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-4">I am a...</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Pioneer */}
                <button
                  onClick={() => setRole('PIONEER')}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                    role === 'PIONEER'
                      ? 'border-[#C9A227] bg-[#5C0A14]/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {role === 'PIONEER' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#C9A227] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#0A0A0F]" />
                    </div>
                  )}
                  <Users className="w-8 h-8 mb-2 text-[#C9A227]" />
                  <div className="font-semibold text-white">Pioneer</div>
                  <div className="text-sm text-gray-400 mt-1">Find my path</div>
                </button>

                {/* Anchor */}
                <button
                  onClick={() => setRole('ANCHOR')}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                    role === 'ANCHOR'
                      ? 'border-[#C9A227] bg-[#5C0A14]/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {role === 'ANCHOR' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#C9A227] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#0A0A0F]" />
                    </div>
                  )}
                  <Building2 className="w-8 h-8 mb-2 text-[#C9A227]" />
                  <div className="font-semibold text-white">Anchor</div>
                  <div className="text-sm text-gray-400 mt-1">Open Paths for talent</div>
                </button>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full py-3 text-base">
                Continue as {role === 'PIONEER' ? 'Pioneer' : 'Anchor'} →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-200 mb-4 flex items-center gap-1">
                ← Back
              </button>

              {/* Google SSO */}
              <button className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-xl py-3 px-4 font-medium text-gray-300 hover:bg-gray-800 transition-colors mb-6">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-900/60 px-3 text-gray-500">or fill in your details</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="John Kamau"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                    <select
                      value={form.country}
                      onChange={e => setForm({...form, country: e.target.value})}
                      className="input w-full"
                    >
                      {countries.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="you@example.com"
                    className="input w-full"
                    required
                  />
                </div>

                {form.country === 'Kenya' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone (M-Pesa) <span className="text-gray-500 font-normal">— optional</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="07XX XXX XXX"
                      className="input w-full"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="Min. 8 characters"
                    className="input w-full"
                    minLength={8}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                  {loading ? 'Creating account...' : 'Create Account — Free'}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By signing up you agree to our{' '}
                  <Link href="/privacy" className="underline text-gray-400">Privacy Policy</Link>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6 text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[#C9A227] font-semibold hover:underline">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}

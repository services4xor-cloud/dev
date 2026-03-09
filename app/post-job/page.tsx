'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Smartphone, CreditCard, Globe } from 'lucide-react'

const PAYMENT_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    priceKES: 500,
    priceUSD: 4,
    features: ['30-day listing', 'Up to 50 applicants', 'Standard visibility'],
    popular: false,
  },
  {
    id: 'featured',
    name: 'Featured',
    priceKES: 2000,
    priceUSD: 15,
    features: ['30-day listing', 'Unlimited applicants', 'Featured placement', 'Email alerts to matched candidates'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceKES: 5000,
    priceUSD: 38,
    features: ['60-day listing', 'Unlimited applicants', 'Top of results', 'AI candidate matching', 'WhatsApp + SMS alerts'],
    popular: false,
  },
]

const PAYMENT_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, desc: 'Pay via STK Push — fastest for Kenya', color: 'text-green-600' },
  { id: 'stripe', label: 'Card (Stripe)', icon: CreditCard, desc: 'Visa, Mastercard, Amex', color: 'text-indigo-600' },
  { id: 'flutterwave', label: 'Flutterwave', icon: Globe, desc: 'Bank transfer & mobile money — Africa', color: 'text-yellow-600' },
]

export default function PostJobPage() {
  const [selectedPlan, setSelectedPlan] = useState('featured')
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState(1) // 1: Job details, 2: Payment

  const plan = PAYMENT_PLANS.find((p) => p.id === selectedPlan)!

  return (
    <div className="min-h-screen bg-surface-light">
      <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <span className="font-semibold">Post a Job</span>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <span className={step >= 1 ? 'text-brand-orange font-medium' : ''}>Job Details</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-brand-orange font-medium' : ''}>Payment</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">Tell us about the role</h1>
              <p className="text-gray-500 mt-1">Fill in the job details to attract the best candidates.</p>
            </div>

            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                <input className="input" placeholder="e.g. Senior Software Engineer" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
                  <input className="input" placeholder="Your company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                  <select className="input">
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Construction</option>
                    <option>Education</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
                  <input className="input" placeholder="e.g. Nairobi, Kenya or Remote" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type *</label>
                  <select className="input">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary (Min)</label>
                  <input className="input" placeholder="e.g. 150,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                  <select className="input">
                    <option value="KES">KES — Kenyan Shilling</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="AED">AED — UAE Dirham</option>
                    <option value="CAD">CAD — Canadian Dollar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
                <textarea
                  className="input min-h-[150px] resize-y"
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Skills</label>
                <input className="input" placeholder="e.g. React, Node.js, AWS (comma separated)" />
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full text-center py-4">
              Continue to Payment →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">Choose your plan</h1>
              <p className="text-gray-500 mt-1">Pick how you want your job to be shown.</p>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-4">
              {PAYMENT_PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`card p-5 text-left transition-all ${
                    selectedPlan === p.id
                      ? 'ring-2 ring-brand-orange border-brand-orange'
                      : ''
                  }`}
                >
                  {p.popular && (
                    <div className="badge bg-orange-50 text-brand-orange mb-2">Most Popular</div>
                  )}
                  <div className="font-display font-bold text-lg text-gray-900">{p.name}</div>
                  <div className="text-2xl font-bold text-brand-orange mt-1">KES {p.priceKES.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mb-3">≈ ${p.priceUSD} USD</div>
                  <ul className="space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="text-sm text-gray-600 flex items-start gap-1.5">
                        <span className="text-green-500 flex-shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* Payment method */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === m.id ? 'border-brand-orange bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className="accent-brand-orange"
                    />
                    <m.icon size={22} className={m.color} />
                    <div>
                      <div className="font-medium text-gray-900">{m.label}</div>
                      <div className="text-sm text-gray-500">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* M-Pesa phone input */}
              {paymentMethod === 'mpesa' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your M-Pesa Phone Number
                  </label>
                  <div className="flex gap-2">
                    <span className="input w-auto px-3 flex items-center text-gray-500 text-sm bg-gray-50">
                      🇰🇪 +254
                    </span>
                    <input
                      className="input flex-1"
                      placeholder="7XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    You&apos;ll receive an M-Pesa prompt on this number. Enter your PIN to pay.
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="card p-5 bg-gray-50 border-gray-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{plan.name} Plan</span>
                <span className="font-semibold">KES {plan.priceKES.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>VAT (16%)</span>
                <span>KES {Math.round(plan.priceKES * 0.16).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>KES {Math.round(plan.priceKES * 1.16).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button className="btn-primary flex-1 py-4">
                {paymentMethod === 'mpesa' ? '📱 Pay with M-Pesa' : '💳 Pay Now'}
              </button>
            </div>

            <p className="text-xs text-center text-gray-400">
              Secured by Safaricom M-Pesa · Stripe · 256-bit encryption
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

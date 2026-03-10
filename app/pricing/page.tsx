'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, Star, Crown, Briefcase, Globe, Users } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 500,
    currency: 'KES',
    usd: 4,
    icon: Briefcase,
    color: 'gray',
    description: 'Perfect for small businesses posting occasionally',
    features: [
      '1 active job post (30 days)',
      'Basic listing placement',
      'Up to 50 applicants',
      'Email notifications',
      'Apply via M-Pesa',
    ],
    cta: 'Post for KES 500',
    popular: false,
  },
  {
    name: 'Featured',
    price: 2000,
    currency: 'KES',
    usd: 15,
    icon: Star,
    color: 'maroon',
    description: 'Stand out and attract 3× more qualified applicants',
    features: [
      '1 featured job post (45 days)',
      'Top of search results ⭐',
      'Unlimited applicants',
      'SMS + email notifications',
      'Company logo displayed',
      'Highlighted in category',
      'Social media boost',
    ],
    cta: 'Post Featured — KES 2,000',
    popular: true,
  },
  {
    name: 'Premium',
    price: 5000,
    currency: 'KES',
    usd: 37,
    icon: Crown,
    color: 'gold',
    description: 'Maximum visibility for serious hiring needs',
    features: [
      '3 premium job posts (60 days)',
      'Homepage banner placement',
      'Unlimited applicants',
      'Dedicated support',
      'CV screening assistance',
      'WhatsApp alerts',
      'Analytics dashboard',
      'Featured in newsletter',
      'International reach',
    ],
    cta: 'Go Premium — KES 5,000',
    popular: false,
  },
]

const paymentMethods = [
  { name: 'M-Pesa', flag: '🇰🇪', desc: 'Kenya, Tanzania, Uganda' },
  { name: 'Airtel Money', flag: '🌍', desc: 'East & Central Africa' },
  { name: 'Stripe', flag: '💳', desc: 'USA, UK, EU (cards)' },
  { name: 'Flutterwave', flag: '🌊', desc: 'Nigeria, Ghana, Africa' },
  { name: 'PayPal', flag: '🌐', desc: 'Worldwide' },
  { name: 'USSD', flag: '📱', desc: 'No smartphone needed' },
]

export default function PricingPage() {
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gray-900">Beke</span>
            <span className="text-[#C9A227]">nya</span>
          </Link>
          <Link href="/jobs" className="text-gray-600 hover:text-[#C9A227]">Browse Jobs</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#5C0A14]/5 text-[#C9A227] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Pay from anywhere — M-Pesa, card, or mobile money
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Post a job in minutes. Pay with M-Pesa. Reach thousands of qualified candidates across Kenya and beyond.
          </p>

          {/* Currency toggle */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrency('KES')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${currency === 'KES' ? 'bg-[#5C0A14] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
            >
              🇰🇪 KES
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${currency === 'USD' ? 'bg-[#5C0A14] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
            >
              🇺🇸 USD
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map(plan => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-transform hover:-translate-y-1 relative ${
                  plan.popular ? 'border-[#5C0A14] shadow-lg' : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5C0A14] text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  plan.popular ? 'bg-[#5C0A14]/5' : 'bg-gray-50'
                }`}>
                  <Icon className={`w-6 h-6 ${plan.popular ? 'text-[#C9A227]' : 'text-gray-500'}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-3xl font-black text-gray-900">
                    {currency === 'KES' ? `KES ${plan.price.toLocaleString()}` : `$${plan.usd}`}
                  </div>
                  <div className="text-gray-400 text-sm">one-time payment</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-[#C9A227]' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/post-job?plan=${plan.name.toLowerCase()}`}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-[#5C0A14] text-white hover:opacity-90'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pay from anywhere in Africa and the world</h2>
            <p className="text-gray-500 mt-2">We accept every major payment method so no one is excluded</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {paymentMethods.map(method => (
              <div key={method.name} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-1">{method.flag}</div>
                <div className="font-semibold text-gray-900 text-sm">{method.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{method.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* For Job Seekers */}
        <div className="bg-gradient-to-r from-[#5C0A14] to-[#7a0e1a] rounded-2xl p-8 text-white text-center">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Job seekers always free</h2>
          <p className="opacity-90 max-w-lg mx-auto mb-6">
            Creating a profile, applying to jobs, and getting hired is completely free for job seekers. Always.
          </p>
          <Link href="/signup?role=jobseeker" className="bg-white text-[#C9A227] font-bold px-6 py-3 rounded-xl hover:bg-[#5C0A14]/5 transition-colors inline-block">
            Create Free Profile →
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gift, Copy, Check, Users, DollarSign, Share2, ArrowRight, Star } from 'lucide-react'

const steps = [
  {
    n: 1,
    title: 'Share your link',
    desc: 'Copy your unique referral link and share it with friends seeking Paths.',
  },
  {
    n: 2,
    title: 'Friend signs up',
    desc: 'Your friend creates a free account using your referral link.',
  },
  {
    n: 3,
    title: 'Friend gets placed',
    desc: 'When your friend gets placed through Bekenya, the countdown starts.',
  },
  {
    n: 4,
    title: 'You earn KES 5,000',
    desc: 'M-Pesa payment lands in your account within 7 days. 🎉',
  },
]

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const mockLink = 'https://bekenya.com/ref/JK2024'

  const copy = () => {
    navigator.clipboard.writeText(mockLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Nav */}
      <div className="bg-[#0d0208] border-b border-brand-primary/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-white">Beke</span>
            <span className="text-brand-accent">nya</span>
          </Link>
          <Link href="/ventures" className="text-gray-400 hover:text-brand-accent text-sm">
            Browse Paths
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-primary to-brand-bg text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Gift className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Earn KES 5,000 per placement</h1>
          <p className="text-xl text-gray-300 max-w-xl mx-auto">
            Refer a friend who gets placed through Bekenya. We pay you KES 5,000 via M-Pesa — every
            time.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Referral link */}
        <div className="bg-gray-900/60 rounded-2xl p-8 shadow-sm border border-brand-primary/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Your referral link</h2>
          <p className="text-gray-400 mb-6">
            Share this link — every signup counts toward your earnings
          </p>

          <div className="flex items-center gap-3 bg-brand-bg rounded-xl p-4 border border-brand-primary/30 mb-4">
            <span className="flex-1 text-sm text-gray-300 font-mono truncate">{mockLink}</span>
            <button
              onClick={copy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-900/40 text-green-400'
                  : 'bg-brand-primary text-white hover:bg-brand-primary/80'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
              <Share2 className="w-4 h-4" />
              Share on Twitter/X
            </button>
          </div>
        </div>

        {/* How it works */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.n} className="relative">
                <div className="bg-gray-900/60 rounded-2xl p-6 shadow-sm border border-brand-primary/30 h-full">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                    {step.n}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-5 h-5 text-gray-300 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              value: '3,200+',
              label: 'Pioneers placed',
              color: 'text-brand-accent bg-brand-primary/20',
            },
            {
              icon: DollarSign,
              value: 'KES 16M+',
              label: 'Bonuses paid out',
              color: 'text-green-400 bg-green-900/20',
            },
            {
              icon: Star,
              value: '99%',
              label: 'On-time payments',
              color: 'text-teal-400 bg-teal-900/20',
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-gray-900/60 rounded-2xl p-6 text-center shadow-sm border border-brand-primary/30"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">Not signed up yet?</p>
          <Link href="/signup" className="btn-primary px-8 py-4 text-lg">
            Create Free Account & Start Earning →
          </Link>
        </div>
      </div>
    </div>
  )
}

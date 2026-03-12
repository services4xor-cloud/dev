'use client'

import { useState } from 'react'
import Link from 'next/link'
import { REFERRAL, REFERRAL_BONUS, BRAND_NAME } from '@/lib/platform-config'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL.mockLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const shareText = `Join The BeNetwork — where real humans connect across borders. Sign up with my link: ${REFERRAL.mockLink}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Join ${BRAND_NAME} — The BeNetwork`)}&body=${encodeURIComponent(shareText)}`

  const benefits = [
    {
      title: 'Higher Match Priority',
      desc: 'Real connections rank higher in the matching engine. Your referrals get seen first.',
      icon: '🎯',
    },
    {
      title: 'Real Connection Badge ✨',
      desc: 'Every person you bring earns the verified human badge — a mark of trust in the network.',
      icon: '✨',
    },
    {
      title: 'Premium Network Status',
      desc: 'Active referrers unlock premium features and priority support across the platform.',
      icon: '👑',
    },
  ]

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-primary/80 to-brand-bg text-white">
        <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-accent text-sm font-medium mb-8">
            <span>✨</span>
            <span>Real Humans Welcome</span>
          </div>

          <h1 className="text-phi-3xl md:text-phi-4xl font-black tracking-tight mb-4 text-white">
            Invite Real Humans to The BeNetwork
          </h1>

          <p className="text-phi-xl text-white/80 max-w-2xl leading-relaxed mb-8">
            Every real person you bring strengthens the network. Real connections have premium match
            priority.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={copyLink}
              className="inline-flex items-center justify-center gap-2 bg-brand-accent text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy My Referral Link
                </>
              )}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">Share via:</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/30 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              X / Twitter
            </a>
            <a
              href={emailUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* ── Human Premium ─────────────────────────────────────── */}
      <SectionLayout size="md">
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white mb-3">
            The Human Premium
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Real humans verified through referrals get the ✨ badge and +10 match score — because
            trust is the foundation of every connection.
          </p>
        </div>

        <GlassCard variant="subtle" padding="lg" className="mb-10 text-center rounded-2xl">
          <p className="text-white/80 text-phi-lg leading-relaxed max-w-2xl mx-auto">
            When you refer a real person, they enter the network with a{' '}
            <span className="text-brand-accent font-semibold">✨ verified badge</span> and a{' '}
            <span className="text-brand-accent font-semibold">+10 boost</span> to their match score.
            Real humans connect faster, match better, and build stronger networks.
          </p>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <GlassCard
              key={b.title}
              variant="subtle"
              hover
              padding="lg"
              className="text-center rounded-2xl"
            >
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="text-phi-lg font-bold text-white mb-2">{b.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{b.desc}</p>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* ── How It Works ──────────────────────────────────────── */}
      <SectionLayout size="md" className="border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-white/60">Four steps to earning {REFERRAL_BONUS} per referral</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-brand-accent/60 via-brand-accent/30 to-brand-accent/60" />

          <div className="space-y-8">
            {REFERRAL.steps.map((step, i) => (
              <div key={step.n} className="flex items-start gap-6 relative">
                {/* Step number */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center">
                  <span className="text-brand-accent font-bold text-phi-lg">{step.n}</span>
                </div>

                {/* Content */}
                <GlassCard variant="subtle" padding="md" className="flex-1 rounded-xl">
                  <h3 className="text-white font-bold text-phi-lg mb-1">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <SectionLayout size="md" className="border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white mb-3">Network Impact</h2>
          <p className="text-white/60">Real results from real human connections</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {REFERRAL.stats.map((stat) => (
            <GlassCard
              key={stat.label}
              variant="subtle"
              padding="lg"
              className="text-center rounded-2xl"
            >
              <div className="text-phi-2xl md:text-phi-3xl font-black text-brand-accent mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <SectionLayout size="lg" className="border-t border-white/5">
        <div className="text-center">
          <h2 className="text-phi-2xl md:text-phi-3xl font-bold text-white mb-4">
            Start Earning {REFERRAL_BONUS} Per Connection
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Every real human you bring to the network earns you {REFERRAL_BONUS} via{' '}
            {REFERRAL.paymentMethod} within {REFERRAL.paymentDays} days.
          </p>

          <Link
            href="/login"
            className="inline-block bg-brand-accent text-white font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-colors text-phi-lg"
          >
            Start Earning
          </Link>

          <p className="text-white/40 text-sm mt-4">Already a member? Share from your profile</p>
        </div>
      </SectionLayout>
    </div>
  )
}

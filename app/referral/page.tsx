'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gift, Copy, Check, Users, DollarSign, Share2, ArrowRight, Star } from 'lucide-react'
import { REFERRAL, BRAND_NAME, REFERRAL_BONUS } from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export default function ReferralPage() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const mockLink = REFERRAL.mockLink

  const copy = () => {
    navigator.clipboard.writeText(mockLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-primary to-brand-bg text-white py-phi-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Gift className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-phi-3xl md:text-phi-4xl font-black mb-4 gradient-text">
            {t('referral.heroTitle', { bonus: REFERRAL_BONUS })}
          </h1>
          <p className="text-phi-xl text-gray-300 max-w-xl mx-auto">
            {t('referral.heroDesc', {
              brand: BRAND_NAME,
              bonus: REFERRAL_BONUS,
              method: REFERRAL.paymentMethod,
            })}
          </p>
        </div>
      </div>

      <SectionLayout ambient maxWidth="max-w-4xl" className="space-y-16">
        {/* Referral link */}
        <GlassCard padding="lg" className="text-center">
          <h2 className="text-phi-xl font-bold text-white mb-2">{t('referral.linkTitle')}</h2>
          <p className="text-gray-400 mb-6">{t('referral.linkDesc')}</p>

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
                  <Check className="w-4 h-4" /> {t('referral.copied')}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> {t('referral.copy')}
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
              <Share2 className="w-4 h-4" />
              {t('referral.shareWhatsApp')}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
              <Share2 className="w-4 h-4" />
              {t('referral.shareTwitter')}
            </button>
          </div>
        </GlassCard>

        {/* How it works */}
        <div>
          <h2 className="text-phi-xl font-bold text-white text-center mb-8">
            {t('referral.howTitle')}
          </h2>
          <div className="grid md:grid-cols-4 gap-phi-5 reveal-stagger">
            {REFERRAL.steps.map((step, i) => (
              <div key={step.n} className="relative">
                <GlassCard hover className="h-full">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                    {step.n}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-phi-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </GlassCard>
                {i < REFERRAL.steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-5 h-5 text-gray-300 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-phi-5 reveal-stagger">
          {REFERRAL.stats.map((stat, i) => {
            const icons = [Users, DollarSign, Star]
            const colors = [
              'text-brand-accent bg-brand-primary/20',
              'text-green-400 bg-green-900/20',
              'text-brand-accent bg-brand-primary/20',
            ]
            const Icon = icons[i] ?? Star
            return (
              <GlassCard key={stat.label} hover className="text-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${colors[i]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-phi-xl font-black text-white">{stat.value}</div>
                <div className="text-phi-sm text-gray-400 mt-1">{stat.label}</div>
              </GlassCard>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t('referral.notSignedUp')}</p>
          <Link href="/signup" className="btn-primary px-8 py-4 text-lg">
            {t('referral.ctaBtn')}
          </Link>
        </div>
      </SectionLayout>
    </div>
  )
}

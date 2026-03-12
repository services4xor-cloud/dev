'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BRAND_NAME, LEGAL, IMPACT_PARTNER } from '@/lib/platform-config'
import { useTranslation } from '@/lib/hooks/use-translation'

// ─── Static Charity Data (inlined from mock) ────────────────────────────────

const IMPACT_STATS = [
  { number: '500+', label: 'Youth Trained', icon: '🎓' },
  { number: '12', label: 'Communities Reached', icon: '🌍' },
  { number: '3', label: 'Conservation Areas Supported', icon: '🌿' },
  { number: '20+', label: 'Women Mentored', icon: '👩' },
]

const PILLARS = [
  {
    icon: '🎓',
    title: 'Education',
    subtitle: 'Skills for a dignified future',
    description:
      'Digital literacy, vocational training, and mentorship programs that give young Kenyans the tools to write their own story. From coding bootcamps to safari guide certification — every skill is a new door.',
    programs: [
      'Digital Literacy Bootcamps',
      'Vocational Certifications',
      'Scholarship Pathways',
      'Mentor Matching',
    ],
    color: 'from-blue-950/30 to-indigo-950/20',
    border: 'border-blue-900/50',
    accent: 'text-blue-400',
    badge: 'bg-blue-900/40 text-blue-300',
  },
  {
    icon: '👩',
    title: "Women's Empowerment",
    subtitle: 'Safe paths, strong futures',
    description:
      'Professional paths, safe opportunities, and community support for women seeking a better life. We work to provide alternatives to unsafe or exploitative work situations through dignity-first programming.',
    programs: [
      'Safe Path Program',
      'Professional Mentorship',
      'Business Skills Training',
      'Community Networks',
    ],
    color: 'from-purple-950/30 to-pink-950/20',
    border: 'border-purple-900/50',
    accent: 'text-purple-400',
    badge: 'bg-purple-900/40 text-purple-300',
  },
  {
    icon: '🌿',
    title: 'Conservation',
    subtitle: 'Protecting what we love',
    description:
      'Eco-tourism ventures that directly fund wildlife conservation. When you book a safari through BeKenya, a portion flows back to UTAMADUNI to support rangers, anti-poaching efforts, and conservation education.',
    programs: [
      'Anti-Poaching Support',
      'Ranger Training',
      'Conservation Education',
      'Eco-Tourism Revenue Sharing',
    ],
    color: 'from-green-950/30 to-emerald-950/20',
    border: 'border-green-900/50',
    accent: 'text-green-400',
    badge: 'bg-green-900/40 text-green-300',
  },
  {
    icon: '🎭',
    title: 'Cultural Preservation',
    subtitle: 'Our heritage, our strength',
    description:
      'Documenting, celebrating, and sharing Kenyan traditions with the world. From Maasai beadwork to Luo music — culture is not just heritage, it is a living economy that feeds communities with pride.',
    programs: [
      'Cultural Documentation',
      'Artisan Marketplaces',
      'Storytelling Archives',
      'Cultural Tourism',
    ],
    color: 'from-[#5C0A14]/30 to-[#5C0A14]/10',
    border: 'border-[#C9A227]/30',
    accent: 'text-[#C9A227]',
    badge: 'bg-[#C9A227]/20 text-[#C9A227]',
  },
]

const STORIES = [
  {
    name: 'Wanjiru N.',
    location: 'Nairobi, Kenya',
    avatar: '👩🏾',
    title: 'From uncertainty to purpose',
    story:
      "Wanjiru came to UTAMADUNI after losing her office position during a difficult season. Through the Women's Empowerment program, she trained in hospitality management and found her path at a Naivasha eco-lodge. Today she manages a team of 8 and trains new staff.",
    outcome: 'Eco-lodge manager, Naivasha',
    pillar: "Women's Empowerment",
  },
  {
    name: 'Baraka M.',
    location: 'Maasai Mara, Kenya',
    avatar: '👨🏾',
    title: 'The ranger who became a guide',
    story:
      "Baraka grew up near the Mara. UTAMADUNI's Conservation program connected him with a ranger certification course. He now leads sunrise game drives for international Pioneers visiting through BeKenya — and sends remittances to his family every month.",
    outcome: 'Senior Safari Guide, Maasai Mara',
    pillar: 'Conservation',
  },
  {
    name: 'Aisha K.',
    location: 'Lamu, Kenya',
    avatar: '👩🏾',
    title: 'Weaving tradition into livelihood',
    story:
      "Aisha's grandmother taught her the ancient craft of Swahili basket weaving. UTAMADUNI's Cultural Preservation program helped her create an online artisan profile on BeKenya's marketplace. She now ships her baskets to Germany, the UK, and the UAE.",
    outcome: 'Artisan entrepreneur, global marketplace',
    pillar: 'Cultural Preservation',
  },
]

const PARTNER_TYPES = [
  {
    icon: '🏫',
    label: 'Schools & Children Homes',
    desc: "Feeding programs, education support — incl. Suvia Children's Home",
  },
  {
    icon: '🤝',
    label: 'FessyTours & Local Partners',
    desc: 'Joint safari programs, community feeding initiatives',
  },
  { icon: '🏢', label: 'Corporate Sponsors', desc: 'CSR investment, skills matching' },
  {
    icon: '🌍',
    label: 'International Organizations',
    desc: 'Bilateral programs, grant partnerships',
  },
]
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

type DonationAmount = 10 | 25 | 50 | 100 | 'custom'

export default function CharityPage() {
  const { t } = useTranslation()
  const [donationAmount, setDonationAmount] = useState<DonationAmount>(25)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [paymentTab, setPaymentTab] = useState<'mpesa' | 'card'>('mpesa')
  const [expandedStory, setExpandedStory] = useState<number | null>(null)

  const PRESET_AMOUNTS: DonationAmount[] = [10, 25, 50, 100]

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-success via-brand-success to-gray-900 text-white">
        <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-green-200 text-sm font-medium mb-8">
            <span>🇰🇪</span>
            <span>{t('charity.badge')}</span>
          </div>

          {/* IMPACT_PARTNER heading */}
          <div className="mb-6">
            <h1 className="text-phi-3xl md:text-phi-4xl font-black tracking-tight mb-3 text-white">
              {IMPACT_PARTNER.name}
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/20 max-w-xs"></div>
              <span className="text-green-300 font-medium italic text-phi-lg">
                {t('charity.tagline')}
              </span>
            </div>
          </div>

          <p className="text-phi-xl text-green-100 max-w-2xl leading-relaxed mb-8">
            {t('charity.heroDesc', { brand: BRAND_NAME })}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#donate"
              className="inline-block bg-brand-accent text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-colors text-center"
            >
              {t('charity.support', { partner: IMPACT_PARTNER.name })}
            </a>
            <a
              href="#pillars"
              className="inline-block bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-center"
            >
              {t('charity.learnMore')}
            </a>
          </div>
        </div>
      </div>

      {/* How it works banner */}
      <div className="bg-brand-accent/5 border-y border-brand-accent/10 py-6">
        <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 text-center">
          <p className="text-gray-300 text-phi-base font-medium">
            {t('charity.howBanner', { brand: BRAND_NAME, partner: IMPACT_PARTNER.name })
              .split('{accent}')
              .map((part, i) => {
                if (i === 0) return <span key={i}>{part}</span>
                const [accent, rest] = part.split('{/accent}')
                return (
                  <span key={i}>
                    <span className="text-brand-accent font-bold"> {accent} </span>
                    {rest}
                  </span>
                )
              })}
          </p>
        </div>
      </div>

      {/* Impact Numbers */}
      <SectionLayout ambient>
        <div className="text-center mb-10">
          <h2 className="text-phi-xl font-bold text-white mb-2">{t('charity.impactTitle')}</h2>
          <p className="text-gray-400">{t('charity.impactDesc')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-phi-5">
          {IMPACT_STATS.map((stat) => (
            <GlassCard key={stat.label} hover>
              <div className="text-center">
                <div className="text-phi-2xl mb-2">{stat.icon}</div>
                <div className="text-phi-2xl font-black text-brand-success mb-1">{stat.number}</div>
                <div className="text-gray-400 text-phi-sm font-medium">{stat.label}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* 4 Pillars */}
      <div id="pillars">
        <SectionLayout as="div" className="bg-gray-900/30">
          <div className="text-center mb-12">
            <h2 className="text-phi-2xl font-bold text-white mb-3">{t('charity.pillarsTitle')}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">{t('charity.pillarsDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-phi-5 reveal-stagger">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className={`bg-gradient-to-br ${pillar.color} border ${pillar.border} rounded-2xl p-phi-5`}
              >
                <div className="text-phi-2xl mb-4">{pillar.icon}</div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`text-phi-xl font-bold ${pillar.accent} mb-0.5`}>
                      {pillar.title}
                    </h3>
                    <p className="text-gray-400 text-phi-sm italic">{pillar.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-phi-sm leading-relaxed mb-4">
                  {pillar.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pillar.programs.map((program) => (
                    <span
                      key={program}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${pillar.badge}`}
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionLayout>
      </div>

      {/* How it works — platform connection */}
      <SectionLayout>
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">{t('charity.howTitle')}</h2>
          <p className="text-gray-400">{t('charity.howSubtitle', { brand: BRAND_NAME })}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-phi-4">
          <GlassCard variant="subtle" hover>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-phi-2xl mx-auto mb-4">
                🌍
              </div>
              <h3 className="font-bold text-white mb-2">{t('charity.step1Title')}</h3>
              <p className="text-gray-400 text-phi-sm leading-relaxed">
                {t('charity.step1Desc', { brand: BRAND_NAME })}
              </p>
            </div>
          </GlassCard>
          <GlassCard variant="subtle" hover>
            <div className="text-center relative">
              <div className="hidden sm:block absolute top-1/2 -left-8 transform -translate-y-1/2 text-gray-300 text-phi-xl">
                →
              </div>
              <div className="w-16 h-16 rounded-2xl bg-brand-success/10 flex items-center justify-center text-phi-2xl mx-auto mb-4">
                💚
              </div>
              <h3 className="font-bold text-white mb-2">
                {t('charity.step2Title', { partner: IMPACT_PARTNER.name })}
              </h3>
              <p className="text-gray-400 text-phi-sm leading-relaxed">
                {t('charity.step2Desc', { partner: IMPACT_PARTNER.name })}
              </p>
            </div>
          </GlassCard>
          <GlassCard variant="subtle" hover>
            <div className="text-center relative">
              <div className="hidden sm:block absolute top-1/2 -left-8 transform -translate-y-1/2 text-gray-300 text-phi-xl">
                →
              </div>
              <div className="w-16 h-16 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center text-phi-2xl mx-auto mb-4">
                🏘️
              </div>
              <h3 className="font-bold text-white mb-2">{t('charity.step3Title')}</h3>
              <p className="text-gray-400 text-phi-sm leading-relaxed">{t('charity.step3Desc')}</p>
            </div>
          </GlassCard>
        </div>
      </SectionLayout>

      {/* Impact Stories */}
      <SectionLayout className="bg-gray-900 text-white">
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold mb-3">{t('charity.storiesTitle')}</h2>
          <p className="text-gray-400">{t('charity.storiesDesc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5 reveal-stagger">
          {STORIES.map((story, i) => (
            <GlassCard key={story.name} hover className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-phi-xl">
                  {story.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{story.name}</div>
                  <div className="text-gray-400 text-xs flex items-center gap-1">
                    <span>📍</span>
                    {story.location}
                  </div>
                </div>
              </div>

              <h3 className="text-white font-bold mb-3 leading-tight">&quot;{story.title}&quot;</h3>

              <p
                className={`text-gray-300 text-phi-sm leading-relaxed mb-4 ${expandedStory === i ? '' : 'line-clamp-3'}`}
              >
                {story.story}
              </p>

              <button
                onClick={() => setExpandedStory(expandedStory === i ? null : i)}
                className="text-brand-accent text-xs font-medium mb-4 hover:text-brand-accent-light transition-colors text-left"
              >
                {expandedStory === i ? t('charity.showLess') : t('charity.readMore')}
              </button>

              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="text-brand-accent text-xs font-semibold mb-1">
                  {t('charity.today')}
                </div>
                <div className="text-gray-200 text-phi-sm font-medium">{story.outcome}</div>
                <div className="mt-2">
                  <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                    {story.pillar}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Partner With Us */}
      <SectionLayout>
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">
            {t('charity.partnerTitle', { partner: IMPACT_PARTNER.name })}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">{t('charity.partnerDesc')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-phi-4 mb-10 reveal-stagger">
          {PARTNER_TYPES.map((partner) => (
            <GlassCard key={partner.label} hover className="text-center">
              <div className="text-phi-2xl mb-3">{partner.icon}</div>
              <h3 className="font-semibold text-white text-phi-sm mb-1">{partner.label}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{partner.desc}</p>
            </GlassCard>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block bg-brand-success text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-800 transition-colors"
          >
            {t('charity.getInTouch')}
          </Link>
        </div>
      </SectionLayout>

      {/* Donation CTA */}
      <div id="donate" className="bg-gradient-to-br from-brand-success to-brand-success py-phi-7">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-phi-2xl font-bold text-white mb-3">
            {t('charity.donateTitle', { partner: IMPACT_PARTNER.name })}
          </h2>
          <p className="text-green-200 mb-8">{t('charity.donateDesc')}</p>

          {/* Amount selector */}
          <div className="bg-white rounded-2xl p-phi-5 shadow-xl mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 text-left">
              {t('charity.chooseAmount')}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setDonationAmount(amount)
                    setCustomAmount('')
                  }}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                    donationAmount === amount
                      ? 'bg-brand-success text-white border-brand-success'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="1"
                placeholder={t('charity.customAmount')}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setDonationAmount('custom')
                }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-success focus:border-transparent placeholder:text-gray-400 text-gray-900"
              />
            </div>

            {/* Payment tab */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setPaymentTab('mpesa')}
                className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                  paymentTab === 'mpesa'
                    ? 'bg-brand-success text-white border-brand-success'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                📱 M-Pesa
              </button>
              <button
                onClick={() => setPaymentTab('card')}
                className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                  paymentTab === 'card'
                    ? 'bg-[#0891B2] text-white border-[#0891B2]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                💳 Card
              </button>
            </div>

            {paymentTab === 'mpesa' && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4 text-left">
                <p className="text-green-800 text-xs">
                  {t('charity.mpesaInfo', { partner: IMPACT_PARTNER.name })}
                </p>
              </div>
            )}

            <button className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl hover:opacity-90 transition-colors text-phi-base">
              {t('charity.donateBtn', {
                amount:
                  donationAmount !== 'custom'
                    ? `$${donationAmount}`
                    : customAmount
                      ? `$${customAmount}`
                      : '',
                partner: IMPACT_PARTNER.name,
              })}
            </button>

            <p className="text-gray-400 text-xs mt-3">{t('charity.donateNote')}</p>
          </div>

          <p className="text-green-200 text-phi-sm">
            {t('charity.alsoContribute', { brand: BRAND_NAME, partner: IMPACT_PARTNER.name })
              .split('{link}')
              .map((part, i) => {
                if (i === 0) return <span key={i}>{part}</span>
                const [linkText, rest] = part.split('{/link}')
                return (
                  <span key={i}>
                    <Link
                      href="/exchange"
                      className="text-white underline font-medium hover:text-green-100"
                    >
                      {linkText}
                    </Link>
                    {rest}
                  </span>
                )
              })}
          </p>
        </div>
      </div>

      {/* Legal footer note */}
      <div className="bg-gray-900/30 py-6 text-center border-t border-brand-primary/30">
        <p className="text-gray-400 text-phi-sm max-w-2xl mx-auto px-4">
          {t('charity.legal', { partner: IMPACT_PARTNER.name, company: LEGAL.companyName })}
        </p>
      </div>
    </div>
  )
}

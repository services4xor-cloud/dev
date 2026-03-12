'use client'

import Link from 'next/link'
import {
  Globe,
  Shield,
  Building2,
  Users,
  Mail,
  Phone,
  ChevronRight,
  Layers,
  Landmark,
  Lock,
} from 'lucide-react'
import { CONTACT, BRAND_NAME, LEGAL, IMPACT_PARTNER } from '@/data/mock'
import { DIVISIONS, OPERATING_COUNTRIES, SHARE_BLOCKS } from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export default function BusinessPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-phi-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-phi-sm font-medium mb-6 border border-white/20">
            <Landmark className="w-4 h-4 text-brand-accent" />
            <span>{t('business.badge')}</span>
          </div>
          <h1 className="text-phi-3xl md:text-phi-4xl font-bold mb-4 leading-tight gradient-text">
            {LEGAL.companyName}
          </h1>
          <p className="text-phi-xl text-gray-300 font-light mb-3">{t('business.subtitle')}</p>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('business.heroDesc')}</p>
        </div>
      </section>

      {/* ── Mission ── */}
      <SectionLayout
        size="sm"
        ambient
        maxWidth="max-w-3xl"
        className="bg-brand-primary/10 border-b border-brand-primary/30"
      >
        <div className="text-center">
          <Globe className="w-10 h-10 text-brand-accent mx-auto mb-4" />
          <h2 className="text-phi-xl font-bold text-white mb-4">{t('business.missionTitle')}</h2>
          <p className="text-phi-lg text-gray-300 leading-relaxed">{t('business.missionDesc')}</p>
        </div>
      </SectionLayout>

      {/* ── Legal Status ── */}
      <SectionLayout size="sm" maxWidth="max-w-4xl" className="border-b border-brand-primary/30">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6 text-brand-accent" />
          <h2 className="text-phi-xl font-bold text-white">{t('business.legalTitle')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 reveal-stagger">
          {[
            {
              icon: <Landmark className="w-5 h-5 text-brand-accent" />,
              label: t('business.incorporation'),
              value: LEGAL.incorporationNumber,
              sub: t('business.certOfInc'),
            },
            {
              icon: <Building2 className="w-5 h-5 text-brand-accent" />,
              label: t('business.entityType'),
              value: t('business.privateLtd'),
              sub: LEGAL.companyName,
            },
            {
              icon: <Lock className="w-5 h-5 text-brand-accent" />,
              label: t('business.kraPin'),
              value: LEGAL.kraPin,
              sub: t('business.director', { name: LEGAL.directorName }),
            },
          ].map((item) => (
            <GlassCard key={item.label}>
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
              <p className="font-semibold text-white">{item.value}</p>
              <p className="text-phi-sm text-gray-400 mt-0.5">{item.sub}</p>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* ── Share Structure ── */}
      <SectionLayout size="sm" maxWidth="max-w-4xl" className="border-b border-brand-primary/30">
        <div className="flex items-center gap-3 mb-2">
          <Layers className="w-6 h-6 text-brand-accent" />
          <h2 className="text-phi-xl font-bold text-white">{t('business.shareTitle')}</h2>
        </div>
        <p className="text-gray-400 text-sm mb-8 ml-9">{t('business.shareDesc')}</p>

        {/* Bar */}
        <div className="flex h-8 rounded-full overflow-hidden mb-6 border border-brand-primary/30">
          {SHARE_BLOCKS.map((block) => (
            <div
              key={block.label}
              className={`${block.color} flex items-center justify-center text-white text-sm font-bold transition-all`}
              style={{ width: `${block.percent}%` }}
            >
              {block.percent}%
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid md:grid-cols-2 gap-4">
          {SHARE_BLOCKS.map((block) => (
            <GlassCard
              key={block.label}
              variant="subtle"
              padding="sm"
              className="flex items-start gap-3"
            >
              <div className={`w-3 h-3 rounded-full mt-1 ${block.color} shrink-0`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-phi-xl font-bold ${block.textColor}`}>
                    {block.percent}%
                  </span>
                  <span className="font-semibold text-gray-200 text-phi-sm">{block.label}</span>
                </div>
                <p className="text-phi-sm text-gray-400 mt-0.5">{block.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* ── Business Divisions ── */}
      <SectionLayout size="sm" maxWidth="max-w-4xl" className="border-b border-brand-primary/30">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-6 h-6 text-brand-accent" />
          <h2 className="text-phi-xl font-bold text-white">{t('business.divisionsTitle')}</h2>
        </div>
        <div className="space-y-4">
          {DIVISIONS.map((div) => (
            <div
              key={div.name}
              className="rounded-2xl border border-brand-primary/30 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-900/60 border-b border-brand-primary/30">
                <span className="text-2xl">{div.icon}</span>
                <h3 className="font-bold text-white text-lg">{div.name}</h3>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-300 mb-4 leading-relaxed">{div.description}</p>
                <div className="flex flex-wrap gap-2">
                  {div.ventures.map((v) => (
                    <span
                      key={v}
                      className="text-xs bg-brand-primary/20 text-brand-accent border border-brand-accent/20 rounded-full px-3 py-1 font-medium"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionLayout>

      {/* ── Operating Countries ── */}
      <SectionLayout size="sm" maxWidth="max-w-4xl" className="border-b border-brand-primary/30">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-6 h-6 text-brand-accent" />
          <h2 className="text-phi-xl font-bold text-white">{t('business.countriesTitle')}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {OPERATING_COUNTRIES.map((country) => (
            <div key={country.code} className={`rounded-2xl border p-6 ${country.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">{country.name}</h3>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${country.badge}`}
                    >
                      {country.role}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{country.details}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-phi-sm text-gray-400 mt-6">{t('business.countriesNext')}</p>
      </SectionLayout>

      {/* ── Payment & Financial Control ── */}
      <SectionLayout
        size="sm"
        maxWidth="max-w-4xl"
        className="border-b border-brand-primary/30 bg-brand-bg"
      >
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6 text-brand-accent" />
          <h2 className="text-phi-xl font-bold text-white">{t('business.paymentTitle')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 reveal-stagger">
          {[
            {
              icon: '🏦',
              title: t('business.bankTitle'),
              body: t('business.bankDesc'),
            },
            {
              icon: '📱',
              title: t('business.mpesaTitle'),
              body: t('business.mpesaDesc'),
            },
            {
              icon: '🌐',
              title: t('business.globalTitle'),
              body: t('business.globalDesc'),
            },
          ].map((item) => (
            <GlassCard key={item.title}>
              <div className="text-phi-2xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-phi-sm text-gray-300 leading-relaxed">{item.body}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard variant="featured" padding="md" className="mt-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-brand-accent mt-0.5 shrink-0" />
            <p className="text-phi-sm text-gray-300">
              {t('business.financeNote', { partner: IMPACT_PARTNER.name })}
            </p>
          </div>
        </GlassCard>
      </SectionLayout>

      {/* ── Partnership CTA ── */}
      <SectionLayout size="sm" maxWidth="max-w-4xl" className="border-b border-brand-primary/30">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-6 h-6 text-brand-accent" />
          <h2 className="text-phi-xl font-bold text-white">{t('business.partnerTitle')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: '🦁',
              type: t('business.safariPartner'),
              desc: t('business.safariPartnerDesc', { brand: BRAND_NAME }),
            },
            {
              icon: '🌍',
              type: t('business.ngoPartner'),
              desc: t('business.ngoPartnerDesc', { partner: IMPACT_PARTNER.name }),
            },
            {
              icon: '🏢',
              type: t('business.corpPartner'),
              desc: t('business.corpPartnerDesc'),
            },
          ].map((p) => (
            <div
              key={p.type}
              className="rounded-2xl border border-brand-primary/30 p-5 hover:border-brand-accent/50 transition-colors"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-semibold text-white mb-2">{p.type}</h3>
              <p className="text-sm text-gray-300">{p.desc}</p>
            </div>
          ))}
        </div>
      </SectionLayout>

      {/* ── Contact ── */}
      <SectionLayout size="sm" maxWidth="max-w-2xl" className="text-center">
        <h2 className="text-phi-xl font-bold text-white mb-3">{t('business.contactTitle')}</h2>
        <p className="text-gray-400 mb-8">{t('business.contactDesc')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href={`mailto:${CONTACT.emailBusiness}`}
            className="inline-flex items-center gap-2 bg-brand-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-brand-primary/80 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {CONTACT.emailBusiness}
          </a>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-green-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/exchange"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand-accent transition-colors font-medium"
          >
            Browse Exchange <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/experiences"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand-accent transition-colors font-medium"
          >
            {t('business.safariExperiences')} <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/charity"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand-accent transition-colors font-medium"
          >
            {t('business.charityLink', { partner: IMPACT_PARTNER.name })}{' '}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </SectionLayout>
    </div>
  )
}

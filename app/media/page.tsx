'use client'

import Link from 'next/link'
import {
  MEDIA_PATHS as mediaPaths,
  MEDIA_FEATURED_PROJECTS as featuredProjects,
  MEDIA_PLATFORMS as platforms,
  BRAND_NAME,
  LEGAL,
  IMPACT_PARTNER,
} from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export default function MediaPage() {
  const { t } = useTranslation()
  return (
    <main className="min-h-screen bg-[#0A0205] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0D1F3C] to-[#0A0205] py-phi-8 px-4">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-[18rem] leading-none">🎬</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-accent text-sm font-medium">
              {t('media.badge', { company: LEGAL.companyName })}
            </span>
          </div>
          <h1 className="text-phi-3xl md:text-phi-4xl font-black mb-4">
            <span className="gradient-text">{BRAND_NAME}</span>{' '}
            <span className="text-white">Media</span>{' '}
            <span className="text-phi-2xl md:text-phi-3xl">🎬</span>
          </h1>
          <p className="text-phi-xl md:text-phi-2xl font-light text-brand-accent mb-6 tracking-wide">
            {t('media.tagline')}
          </p>
          <p className="text-phi-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('media.heroDesc')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=creator"
              className="bg-brand-accent text-white font-bold px-8 py-4 rounded-full hover:opacity-90 transition-colors text-phi-lg"
            >
              {t('media.applyPioneer')}
            </Link>
            <Link
              href="/anchors"
              className="border border-brand-accent text-brand-accent font-semibold px-8 py-4 rounded-full hover:bg-brand-accent/10 transition-colors text-phi-lg"
            >
              {t('media.commissionContent')}
            </Link>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <SectionLayout size="lg" ambient>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-phi-2xl font-bold text-white mb-6">
              {t('media.opportunityTitle')}
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{t('media.opportunityP1')}</p>
              <p>{t('media.opportunityP2')}</p>
              <p className="text-brand-accent font-semibold text-phi-lg">
                {t('media.opportunityGap', { brand: BRAND_NAME })}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-phi-4 text-center">
              <GlassCard padding="sm">
                <div className="text-phi-xl font-black text-brand-accent">9</div>
                <div className="text-xs text-gray-400 mt-1">{t('media.statPlatforms')}</div>
              </GlassCard>
              <GlassCard padding="sm">
                <div className="text-phi-xl font-black text-brand-accent">4</div>
                <div className="text-xs text-gray-400 mt-1">{t('media.statPaths')}</div>
              </GlassCard>
              <GlassCard padding="sm">
                <div className="text-phi-xl font-black text-brand-accent">KES</div>
                <div className="text-xs text-gray-400 mt-1">{t('media.statPayments')}</div>
              </GlassCard>
            </div>
          </div>
          <GlassCard variant="featured" padding="lg">
            <h3 className="font-bold text-brand-accent mb-4 text-phi-lg">{t('media.whoHiring')}</h3>
            <ul className="space-y-3">
              {[
                'Safari lodges — Instagram, TikTok, YouTube content',
                'European travel brands — documentary films',
                'Kenyan government campaigns — digital content',
                'International NGOs — impact documentation',
                'Fashion brands — behind-the-scenes footage',
                'Tech companies — product photography & video',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-brand-accent mt-0.5 font-bold">→</span>
                  <span className="text-gray-300 text-phi-sm">{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </SectionLayout>

      {/* Media Paths */}
      <SectionLayout size="lg" className="bg-gradient-to-br from-brand-primary/20 to-transparent">
        <h2 className="text-phi-2xl font-bold text-white text-center mb-4">
          {t('media.pathsTitle')}
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">{t('media.pathsDesc')}</p>
        <div className="grid md:grid-cols-2 gap-phi-5 reveal-stagger">
          {mediaPaths.map((path) => (
            <GlassCard key={path.title} hover className="group">
              <div className="flex items-start gap-4">
                <div className="text-phi-2xl">{path.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-phi-xl font-bold text-white mb-2">{path.title}</h3>
                  <p className="text-gray-400 text-phi-sm leading-relaxed mb-4">
                    {path.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.sectors.map((sector) => (
                      <span
                        key={sector}
                        className="bg-brand-accent/20 text-brand-accent text-xs px-2 py-0.5 rounded-full"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                  <div className="text-brand-accent font-bold text-phi-sm">{path.earning}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Featured Projects */}
      <SectionLayout size="lg">
        <h2 className="text-phi-2xl font-bold text-white text-center mb-4">
          {t('media.featuredTitle')}
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
          {t('media.featuredDesc')}
        </p>
        <div className="space-y-6 reveal-stagger">
          {featuredProjects.map((project) => (
            <GlassCard key={project.title} hover>
              <div className="flex flex-col lg:flex-row lg:items-start gap-phi-5">
                <div className="text-phi-3xl">{project.flag}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-phi-xl font-bold text-white">{project.title}</h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        project.status === 'Urgent'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="text-brand-accent text-phi-sm font-medium mb-3">
                    {project.client}
                  </div>
                  <p className="text-gray-400 text-phi-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.needs.map((need) => (
                      <span
                        key={need}
                        className="bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-white/10"
                      >
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                  <div className="text-brand-accent font-black text-phi-lg text-right">
                    {project.value}
                  </div>
                  <Link
                    href="/onboarding?type=creator"
                    className="bg-brand-accent text-white text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-colors whitespace-nowrap"
                  >
                    {t('media.applyNow')}
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Social Media Automation */}
      <SectionLayout
        size="lg"
        className="bg-gradient-to-br from-brand-primary/30 via-[#0D1F3C]/30 to-transparent border-t border-brand-accent/10"
      >
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-4">{t('media.socialTitle')}</h2>
          <p className="text-phi-xl text-brand-accent font-semibold mb-4">
            {t('media.socialTagline')}
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('media.socialDesc', { brand: BRAND_NAME })}
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3 mb-12">
          {platforms.map((platform) => (
            <GlassCard key={platform.name} hover padding="sm" className="text-center">
              <div className="text-phi-xl mb-1">{platform.emoji}</div>
              <div className="text-xs text-gray-400 truncate">{platform.name}</div>
            </GlassCard>
          ))}
        </div>
        <GlassCard variant="featured" className="max-w-2xl mx-auto text-center">
          <div className="text-phi-2xl mb-4">⚡</div>
          <h3 className="font-bold text-brand-accent text-phi-xl mb-3">{t('media.howItWorks')}</h3>
          <ol className="text-left space-y-3 text-gray-300 text-phi-sm">
            <li className="flex gap-3">
              <span className="text-brand-accent font-bold">1.</span> {t('media.step1')}
            </li>
            <li className="flex gap-3">
              <span className="text-brand-accent font-bold">2.</span> {t('media.step2')}
            </li>
            <li className="flex gap-3">
              <span className="text-brand-accent font-bold">3.</span>{' '}
              {t('media.step3', { brand: BRAND_NAME })}
            </li>
            <li className="flex gap-3">
              <span className="text-brand-accent font-bold">4.</span> {t('media.step4')}
            </li>
            <li className="flex gap-3">
              <span className="text-brand-accent font-bold">5.</span> {t('media.step5')}
            </li>
          </ol>
        </GlassCard>
      </SectionLayout>

      {/* Impact Partner */}
      <SectionLayout
        size="sm"
        className="bg-brand-success/10 border-t border-brand-success/30"
        maxWidth="max-w-4xl"
      >
        <div className="text-center">
          <div className="text-phi-2xl mb-4">🌍</div>
          <h2 className="text-phi-xl font-bold text-white mb-4">
            {t('media.impactTitle', { partner: IMPACT_PARTNER.name })}
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            {t('media.impactDesc', { partner: IMPACT_PARTNER.name, brand: BRAND_NAME })}
          </p>
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 bg-brand-success text-white font-bold px-7 py-3 rounded-full hover:bg-[#007700] transition-colors"
          >
            {t('media.explorePartner', { partner: IMPACT_PARTNER.name })}
          </Link>
        </div>
      </SectionLayout>

      {/* CTA */}
      <SectionLayout
        size="lg"
        className="bg-gradient-to-br from-[#0D1F3C] to-[#0A0205]"
        maxWidth="max-w-3xl"
      >
        <div className="text-center">
          <h2 className="text-phi-2xl font-black text-white mb-4">{t('media.ctaTitle')}</h2>
          <p className="text-gray-300 text-phi-lg mb-10 leading-relaxed">
            {t('media.ctaDesc', { brand: BRAND_NAME })}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=creator"
              className="bg-brand-accent text-white font-black px-10 py-4 rounded-full hover:opacity-90 transition-colors text-phi-xl"
            >
              {t('media.applyPioneer')}
            </Link>
            <Link
              href="/fashion"
              className="border border-brand-accent text-brand-accent font-semibold px-8 py-4 rounded-full hover:bg-brand-accent/10 transition-colors"
            >
              {t('media.exploreFashion')}
            </Link>
          </div>
        </div>
      </SectionLayout>
    </main>
  )
}

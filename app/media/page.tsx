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

export default function MediaPage() {
  const { t } = useTranslation()
  return (
    <main className="min-h-screen bg-[#0A0205] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0D1F3C] to-[#0A0205] py-24 px-4">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-[18rem] leading-none">🎬</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-accent text-sm font-medium">
              {t('media.badge', { company: LEGAL.companyName })}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-brand-accent">{BRAND_NAME}</span>{' '}
            <span className="text-white">Media</span>{' '}
            <span className="text-4xl md:text-6xl">🎬</span>
          </h1>
          <p className="text-2xl md:text-3xl font-light text-brand-accent mb-6 tracking-wide">
            {t('media.tagline')}
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('media.heroDesc')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=creator"
              className="bg-brand-accent text-white font-bold px-8 py-4 rounded-full hover:opacity-90 transition-colors text-lg"
            >
              {t('media.applyPioneer')}
            </Link>
            <Link
              href="/anchors"
              className="border border-brand-accent text-brand-accent font-semibold px-8 py-4 rounded-full hover:bg-brand-accent/10 transition-colors text-lg"
            >
              {t('media.commissionContent')}
            </Link>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">{t('media.opportunityTitle')}</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>{t('media.opportunityP1')}</p>
                <p>{t('media.opportunityP2')}</p>
                <p className="text-brand-accent font-semibold text-lg">
                  {t('media.opportunityGap', { brand: BRAND_NAME })}
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="bg-brand-primary/30 border border-brand-accent/20 rounded-xl p-4">
                  <div className="text-2xl font-black text-brand-accent">9</div>
                  <div className="text-xs text-gray-400 mt-1">{t('media.statPlatforms')}</div>
                </div>
                <div className="bg-brand-primary/30 border border-brand-accent/20 rounded-xl p-4">
                  <div className="text-2xl font-black text-brand-accent">4</div>
                  <div className="text-xs text-gray-400 mt-1">{t('media.statPaths')}</div>
                </div>
                <div className="bg-brand-primary/30 border border-brand-accent/20 rounded-xl p-4">
                  <div className="text-2xl font-black text-brand-accent">KES</div>
                  <div className="text-xs text-gray-400 mt-1">{t('media.statPayments')}</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-primary/30 to-[#0D1F3C]/30 border border-brand-accent/20 rounded-2xl p-8">
              <h3 className="font-bold text-brand-accent mb-4 text-lg">{t('media.whoHiring')}</h3>
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
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Media Paths */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-primary/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {t('media.pathsTitle')}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">{t('media.pathsDesc')}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaPaths.map((path) => (
              <div
                key={path.title}
                className="bg-[#0A0205] border border-brand-accent/20 rounded-2xl p-7 hover:border-brand-accent/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{path.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{path.description}</p>
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
                    <div className="text-brand-accent font-bold text-sm">{path.earning}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {t('media.featuredTitle')}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            {t('media.featuredDesc')}
          </p>
          <div className="space-y-6">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="bg-gradient-to-r from-[#0D1F3C]/50 to-brand-primary/10 border border-brand-accent/20 rounded-2xl p-7 hover:border-brand-accent/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="text-5xl">{project.flag}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
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
                    <div className="text-brand-accent text-sm font-medium mb-3">
                      {project.client}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
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
                    <div className="text-brand-accent font-black text-lg text-right">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Automation */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-primary/30 via-[#0D1F3C]/30 to-transparent border-t border-brand-accent/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('media.socialTitle')}</h2>
            <p className="text-xl text-brand-accent font-semibold mb-4">
              {t('media.socialTagline')}
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('media.socialDesc', { brand: BRAND_NAME })}
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-3 mb-12">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-[#0A0205] border border-brand-accent/20 rounded-xl p-3 text-center hover:border-brand-accent/60 transition-colors"
              >
                <div className="text-2xl mb-1">{platform.emoji}</div>
                <div className="text-xs text-gray-400 truncate">{platform.name}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#0A0205] border border-brand-accent/30 rounded-2xl p-8 max-w-2xl mx-auto text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-bold text-brand-accent text-xl mb-3">{t('media.howItWorks')}</h3>
            <ol className="text-left space-y-3 text-gray-300 text-sm">
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
          </div>
        </div>
      </section>

      {/* Impact Partner */}
      <section className="py-16 px-4 bg-brand-success/10 border-t border-brand-success/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-white mb-4">
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
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#0D1F3C] to-[#0A0205]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">{t('media.ctaTitle')}</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            {t('media.ctaDesc', { brand: BRAND_NAME })}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=creator"
              className="bg-brand-accent text-white font-black px-10 py-4 rounded-full hover:opacity-90 transition-colors text-xl"
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
      </section>
    </main>
  )
}

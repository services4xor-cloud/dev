'use client'

import Link from 'next/link'
import {
  FASHION_PATHS as fashionPaths,
  FASHION_PARTNER_ANCHORS as partnerAnchors,
  FASHION_PROTECTIONS as protections,
  BRAND_NAME,
  LEGAL,
} from '@/data/mock'
import { useTranslation } from '@/lib/hooks/use-translation'

export default function FashionPage() {
  const { t } = useTranslation()
  return (
    <main className="min-h-screen bg-[#0A0205] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-[#3D0A0A] to-[#0A0205] py-24 px-4">
        {/* Lion watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-[20rem] leading-none">🦁</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-accent text-sm font-medium">
              {t('fashion.badge', { company: LEGAL.companyName })}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-brand-accent">{BRAND_NAME}</span>{' '}
            <span className="text-white">Fashion</span>
          </h1>
          <p className="text-2xl md:text-3xl font-light text-brand-accent mb-6 tracking-wide">
            {t('fashion.tagline')}
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('fashion.heroDesc')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=artisan"
              className="bg-brand-accent text-black font-bold px-8 py-4 rounded-full hover:bg-[#E5B93B] transition-colors text-lg"
            >
              {t('fashion.applyPioneer')}
            </Link>
            <Link
              href="/anchors"
              className="border border-brand-accent text-brand-accent font-semibold px-8 py-4 rounded-full hover:bg-brand-accent/10 transition-colors text-lg"
            >
              {t('fashion.hireTalent')}
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-brand-primary/20 border-y border-brand-accent/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-accent mb-6">{t('fashion.missionTitle')}</h2>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
            &ldquo;{t('fashion.missionQuote')}&rdquo;
          </p>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            {t('fashion.missionDesc', { brand: BRAND_NAME })}
          </p>
        </div>
      </section>

      {/* Three Paths */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {t('fashion.pathsTitle')}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            {t('fashion.pathsDesc')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-brand-primary/40 to-brand-primary/10 border border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent/60 transition-colors">
              <div className="text-5xl mb-4">👗</div>
              <h3 className="text-xl font-bold text-brand-accent mb-3">
                {t('fashion.modelTitle')}
              </h3>
              <p className="text-gray-300 leading-relaxed">{t('fashion.modelDesc')}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Photoshoots', 'Campaigns', 'Catalog'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-accent/20 text-brand-accent text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-b from-brand-primary/40 to-brand-primary/10 border border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent/60 transition-colors">
              <div className="text-5xl mb-4">✂️</div>
              <h3 className="text-xl font-bold text-brand-accent mb-3">
                {t('fashion.designerTitle')}
              </h3>
              <p className="text-gray-300 leading-relaxed">{t('fashion.designerDesc')}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Textiles', 'African Prints', 'Production'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-accent/20 text-brand-accent text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-b from-brand-primary/40 to-brand-primary/10 border border-brand-accent/30 rounded-2xl p-8 hover:border-brand-accent/60 transition-colors">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-brand-accent mb-3">
                {t('fashion.creativeTitle')}
              </h3>
              <p className="text-gray-300 leading-relaxed">{t('fashion.creativeDesc')}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Photography', 'Styling', 'Set Design'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-accent/20 text-brand-accent text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pioneer Protections */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-primary/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {t('fashion.protectionsTitle', { brand: BRAND_NAME })}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            {t('fashion.protectionsDesc')}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {protections.map((p) => (
              <div
                key={p.title}
                className="bg-[#0A0205] border border-brand-accent/20 rounded-xl p-6 hover:border-brand-accent/50 transition-colors"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-brand-accent mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Paths */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{t('fashion.openPaths')}</h2>
              <p className="text-gray-400">{t('fashion.openPathsDesc')}</p>
            </div>
            <Link
              href="/ventures"
              className="text-brand-accent hover:underline text-sm font-medium"
            >
              {t('fashion.viewAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {fashionPaths.map((path) => (
              <div
                key={path.id}
                className="bg-gradient-to-r from-brand-primary/20 to-transparent border border-brand-accent/20 rounded-2xl p-6 hover:border-brand-accent/50 transition-all hover:from-brand-primary/30 group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="text-4xl">{path.emoji}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{path.title}</h3>
                      <span className="bg-brand-accent/20 text-brand-accent text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {path.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{path.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {path.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/5 text-gray-300 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-brand-accent font-bold text-lg">{path.rate}</div>
                    <Link
                      href="/onboarding?type=artisan"
                      className="bg-brand-accent text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-[#E5B93B] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {t('fashion.apply')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Anchors */}
      <section className="py-20 px-4 bg-brand-primary/10 border-t border-brand-accent/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {t('fashion.partnersTitle')}
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            {t('fashion.partnersDesc', { brand: BRAND_NAME })}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {partnerAnchors.map((anchor) => (
              <div
                key={anchor.name}
                className="bg-[#0A0205] border border-brand-accent/20 rounded-xl p-6 text-center hover:border-brand-accent/50 transition-colors"
              >
                <div className="text-4xl mb-4">{anchor.logo}</div>
                <h3 className="font-bold text-brand-accent text-lg mb-2">{anchor.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{anchor.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-brand-primary to-[#3D0A0A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">{t('fashion.ctaTitle')}</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            {t('fashion.ctaDesc', { brand: BRAND_NAME })}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=artisan"
              className="bg-brand-accent text-black font-black px-10 py-4 rounded-full hover:bg-[#E5B93B] transition-colors text-xl"
            >
              {t('fashion.applyPioneer')}
            </Link>
            <Link
              href="/media"
              className="border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              {t('fashion.exploreMedia')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

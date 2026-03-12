'use client'

import Link from 'next/link'
// ─── Static content for fashion vertical ────────────────────────────────────

const FASHION_PATHS = [
  {
    id: 1,
    title: 'Catalog Model for Tourism Board',
    type: 'Model',
    rate: 'From $80/day',
    description:
      'Represent your country in international tourism campaigns. Professional photoshoots in iconic landscapes.',
    tags: ['Photoshoot', 'Tourism', 'Commercial'],
    emoji: '👗',
  },
  {
    id: 2,
    title: 'Textile Designer at Fashion Week',
    type: 'Designer',
    rate: 'From $450/month',
    description:
      'Sketch to stitch. Design collections featuring authentic cultural prints for fashion showcases.',
    tags: ['Textile', 'Cultural Prints', 'Fashion Week'],
    emoji: '✂️',
  },
  {
    id: 3,
    title: 'Brand Photographer (Remote Possible)',
    type: 'Creative',
    rate: 'From $600/month',
    description:
      'Capture brand stories for fashion houses. Portfolio building, creative direction, remote-friendly.',
    tags: ['Photography', 'Branding', 'Remote'],
    emoji: '📸',
  },
]

const FASHION_PARTNER_ANCHORS = [
  {
    name: 'Tourism Boards',
    focus: 'International tourism campaigns targeting global markets',
    logo: '🌍',
  },
  {
    name: 'Fashion Week Events',
    focus: 'Premier fashion showcases — designers to global stage',
    logo: '👑',
  },
  {
    name: 'Local Fabric Producers',
    focus: 'Authentic cultural print production and distribution',
    logo: '🎨',
  },
]

const FASHION_PROTECTIONS = [
  {
    icon: '📄',
    title: 'Contracts First',
    description: 'All contracts reviewed by Pioneer before any shoot begins. No surprises.',
  },
  {
    icon: '💰',
    title: 'Pioneer Sets Rates',
    description: 'You name your rate. Anchor matches it. No exploitation, no race to the bottom.',
  },
  {
    icon: '🛡️',
    title: 'Chaperone Service',
    description:
      'A BeNetwork chaperone available for every shoot. Never alone if you prefer not to be.',
  },
  {
    icon: '✅',
    title: 'All Work Compensated',
    description: 'No unpaid "test" shoots. Every call, every fitting, every shoot is paid work.',
  },
]
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export default function FashionPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-primary/80 to-gray-900 text-white">
        <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-accent text-sm font-medium mb-8">
            <span>✨</span>
            <span>Fashion Exchange</span>
          </div>

          <h1 className="text-phi-3xl md:text-phi-4xl font-black tracking-tight mb-4 text-white">
            BeNetwork Fashion
          </h1>

          <p className="text-phi-xl text-gray-200 max-w-2xl leading-relaxed mb-8">
            Connect with the fashion world on your terms. Models, designers, and creatives building
            authentic African fashion for the global stage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/exchange"
              className="inline-block bg-brand-accent text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-colors text-center"
            >
              Find Fashion Connections &rarr;
            </Link>
            <Link
              href="/me"
              className="inline-block bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-center"
            >
              Set Up Profile &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Fashion Paths */}
      <SectionLayout>
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Fashion Opportunities</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explore opportunities in modelling, design, and creative direction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5 reveal-stagger">
          {FASHION_PATHS.map((path) => (
            <GlassCard key={path.id} hover>
              <div className="text-phi-2xl mb-3">{path.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-phi-xl font-bold text-white">{path.title}</h3>
              </div>
              <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-brand-accent/10 text-brand-accent font-medium mb-3">
                {path.type}
              </span>
              <p className="text-gray-400 text-phi-sm leading-relaxed mb-4">{path.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {path.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-brand-accent text-phi-sm font-semibold">{path.rate}</div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Protections */}
      <SectionLayout className="bg-gray-900/30">
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Your Protections</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We put Explorers first. Every connection comes with built-in safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-phi-5 reveal-stagger">
          {FASHION_PROTECTIONS.map((protection) => (
            <GlassCard key={protection.title} hover>
              <div className="text-center">
                <div className="text-phi-2xl mb-3">{protection.icon}</div>
                <h3 className="text-white font-bold mb-2">{protection.title}</h3>
                <p className="text-gray-400 text-phi-sm leading-relaxed">
                  {protection.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Partner Connections */}
      <SectionLayout>
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Partner Connections</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Trusted hosts and organisations in the fashion industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5 reveal-stagger">
          {FASHION_PARTNER_ANCHORS.map((partner) => (
            <GlassCard key={partner.name} hover>
              <div className="text-center">
                <div className="text-phi-2xl mb-3">{partner.logo}</div>
                <h3 className="text-white font-bold mb-2">{partner.name}</h3>
                <p className="text-gray-400 text-phi-sm leading-relaxed">{partner.focus}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-primary/80 to-gray-900 py-phi-7">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Ready to Connect?</h2>
          <p className="text-gray-300 mb-8">
            Join the BeNetwork fashion community and start building connections today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/exchange"
              className="inline-block bg-brand-accent text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-colors text-center"
            >
              Find Fashion Connections &rarr;
            </Link>
            <Link
              href="/me"
              className="inline-block bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-center"
            >
              Set Up Profile &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

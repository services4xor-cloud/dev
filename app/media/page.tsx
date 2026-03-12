'use client'

import Link from 'next/link'
// ─── Static content for media vertical ──────────────────────────────────────

const MEDIA_PATHS = [
  {
    emoji: '🎬',
    title: 'Video / Documentary',
    description:
      "Documentary films, social media content, corporate video, NGO impact documentaries. Your landscapes deserve the world's screens.",
    sectors: ['Documentary', 'Corporate', 'NGO', 'Social Media'],
    earning: 'From $400/project',
  },
  {
    emoji: '📸',
    title: 'Photography',
    description:
      'Wildlife, fashion, events, real estate. Brands pay top dollar for authentic imagery that resonates globally.',
    sectors: ['Wildlife', 'Fashion', 'Events', 'Real Estate'],
    earning: 'From $80/day',
  },
  {
    emoji: '✍️',
    title: 'Content Writing',
    description:
      'Travel blogs, brand stories, social media management. Your words can take someone around the world before they book a flight.',
    sectors: ['Travel Blogs', 'Brand Stories', 'Social Media'],
    earning: 'From $200/month',
  },
  {
    emoji: '🎵',
    title: 'Music & Audio',
    description:
      'Soundtracks, podcast production, voice-over for brands. The sounds of culture, heard everywhere.',
    sectors: ['Soundtracks', 'Podcasts', 'Voice-Over'],
    earning: 'From $150/project',
  },
]

const MEDIA_FEATURED_PROJECTS = [
  {
    title: 'Documentary Series',
    client: 'Commissioned by international travel brand',
    description:
      'A multi-part documentary capturing wildlife, culture, and conservation stories for global audiences.',
    needs: ['Videographer', 'Editor', 'Guide-Narrator'],
    status: 'Seeking Pioneers',
    flag: '🌍',
    value: 'From $1,800',
  },
  {
    title: 'Digital Campaign',
    client: 'Tech Brand Team',
    description:
      'Content creators needed for a digital campaign celebrating innovation and everyday heroes.',
    needs: ['Content Creator x3', 'Social Media Manager'],
    status: 'Applications Open',
    flag: '🚀',
    value: 'From $450/creator',
  },
  {
    title: 'Resort Social Media',
    client: 'Luxury Lodge',
    description:
      'Full-time Instagram and TikTok manager needed for a luxury resort. Remote + occasional on-site.',
    needs: ['Instagram Manager', 'TikTok Creator'],
    status: 'Urgent',
    flag: '🌊',
    value: 'From $650/month',
  },
]

const MEDIA_PLATFORMS = [
  { name: 'Instagram', emoji: '📸' },
  { name: 'TikTok', emoji: '🎵' },
  { name: 'Facebook', emoji: '👥' },
  { name: 'Twitter/X', emoji: '✖️' },
  { name: 'LinkedIn', emoji: '💼' },
  { name: 'YouTube', emoji: '▶️' },
  { name: 'WhatsApp', emoji: '💬' },
  { name: 'Pinterest', emoji: '📌' },
  { name: 'Telegram', emoji: '✈️' },
]
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-primary/80 to-gray-900 text-white">
        <div className="max-w-5xl 3xl:max-w-[1600px] mx-auto px-4 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-accent text-sm font-medium mb-8">
            <span>🎬</span>
            <span>Creator Exchange</span>
          </div>

          <h1 className="text-phi-3xl md:text-phi-4xl font-black tracking-tight mb-4 text-white">
            BeNetwork Media
          </h1>

          <p className="text-phi-xl text-gray-200 max-w-2xl leading-relaxed mb-8">
            Connect with creators across Africa and the world. From documentary filmmakers to
            content writers, find your creative community and grow together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/exchange"
              className="inline-block bg-brand-accent text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-colors text-center"
            >
              Find Media Connections &rarr;
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

      {/* Creator Paths */}
      <SectionLayout>
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Creator Opportunities</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explore creative opportunities across media, content, and production.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-phi-5 reveal-stagger">
          {MEDIA_PATHS.map((path) => (
            <GlassCard key={path.title} hover>
              <div className="text-phi-2xl mb-3">{path.emoji}</div>
              <h3 className="text-phi-xl font-bold text-white mb-2">{path.title}</h3>
              <p className="text-gray-400 text-phi-sm leading-relaxed mb-4">{path.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {path.sectors.map((sector) => (
                  <span
                    key={sector}
                    className="text-xs px-2.5 py-1 rounded-full bg-brand-accent/10 text-brand-accent font-medium"
                  >
                    {sector}
                  </span>
                ))}
              </div>
              <div className="text-brand-accent text-phi-sm font-semibold">{path.earning}</div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Featured Projects */}
      <SectionLayout className="bg-gray-900/30">
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Featured Projects</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Active projects seeking creative talent right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5 reveal-stagger">
          {MEDIA_FEATURED_PROJECTS.map((project) => (
            <GlassCard key={project.title} hover className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-phi-xl">{project.flag}</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    project.status === 'Urgent'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-brand-accent/10 text-brand-accent'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <h3 className="text-white font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-phi-sm leading-relaxed mb-3">{project.client}</p>
              <p className="text-gray-300 text-phi-sm leading-relaxed mb-4 flex-1">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.needs.map((need) => (
                  <span
                    key={need}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 font-medium"
                  >
                    {need}
                  </span>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-brand-accent font-semibold text-phi-sm">{project.value}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionLayout>

      {/* Social Platforms */}
      <SectionLayout>
        <div className="text-center mb-12">
          <h2 className="text-phi-2xl font-bold text-white mb-3">Platforms We Cover</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Connect with creators and hosts across all major social platforms.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-phi-4 reveal-stagger">
          {MEDIA_PLATFORMS.map((platform) => (
            <GlassCard key={platform.name} variant="subtle" hover padding="sm">
              <div className="text-center">
                <div className="text-phi-2xl mb-2">{platform.emoji}</div>
                <div className="text-gray-300 text-xs font-medium">{platform.name}</div>
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
            Join the BeNetwork media community and start building creative connections today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/exchange"
              className="inline-block bg-brand-accent text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-colors text-center"
            >
              Find Media Connections &rarr;
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

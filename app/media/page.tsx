'use client'

import Link from 'next/link'

const mediaPaths = [
  {
    emoji: '🎬',
    title: 'Video / Documentary',
    description:
      "Safari films, social media content, corporate video, NGO impact documentaries. Kenya's landscapes deserve the world's screens.",
    sectors: ['Safari Films', 'Corporate', 'NGO', 'Social Media'],
    earning: 'KES 40,000 – 120,000/project',
  },
  {
    emoji: '📸',
    title: 'Photography',
    description:
      'Wildlife, fashion, events, real estate. Brands and lodges pay top dollar for authentic African imagery that resonates globally.',
    sectors: ['Wildlife', 'Fashion', 'Events', 'Real Estate'],
    earning: 'KES 8,000 – 50,000/day',
  },
  {
    emoji: '✍️',
    title: 'Content Writing',
    description:
      'Travel blogs, brand stories, social media management. Your words can take someone from Berlin to Nairobi before they book a flight.',
    sectors: ['Travel Blogs', 'Brand Stories', 'Social Media'],
    earning: 'KES 20,000 – 80,000/month',
  },
  {
    emoji: '🎵',
    title: 'Music & Audio',
    description:
      'Soundtracks for safari films, podcast production, voice-over for brands. The sound of Africa, heard everywhere.',
    sectors: ['Soundtracks', 'Podcasts', 'Voice-Over'],
    earning: 'KES 15,000 – 60,000/project',
  },
]

const featuredProjects = [
  {
    title: 'Maasai Mara Documentary Series',
    client: 'Commissioned by German travel brand',
    description:
      "A 6-part documentary series capturing the Great Migration, Maasai culture, and Kenya's conservation story for German-speaking audiences.",
    needs: ['Videographer', 'Editor', 'Guide-Narrator'],
    status: 'Seeking Pioneers',
    flag: '🇩🇪',
    value: 'KES 180,000',
  },
  {
    title: 'Safaricom Digital Campaign',
    client: 'Safaricom Brand Team',
    description:
      '3 content creators needed for a nationwide digital campaign celebrating Kenyan innovation and everyday heroes.',
    needs: ['Content Creator x3', 'Social Media Manager'],
    status: 'Applications Open',
    flag: '🇰🇪',
    value: 'KES 45,000/creator',
  },
  {
    title: 'Victoria Paradise Social Media',
    client: 'Victoria Paradise Lodge, Kisumu',
    description:
      'Full-time Instagram and TikTok manager needed for a luxury lodge on Lake Victoria. Remote + occasional on-site.',
    needs: ['Instagram Manager', 'TikTok Creator'],
    status: 'Urgent',
    flag: '🌊',
    value: 'KES 65,000/month',
  },
]

const platforms = [
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

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-[#0A0205] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0D1F3C] to-[#0A0205] py-24 px-4">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-[18rem] leading-none">🎬</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#C9A227] text-sm font-medium">
              BeKenya Family Ltd — Media Division
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-[#C9A227]">BeKenya</span>{' '}
            <span className="text-white">Media</span>{' '}
            <span className="text-4xl md:text-6xl">🎬</span>
          </h1>
          <p className="text-2xl md:text-3xl font-light text-[#C9A227] mb-6 tracking-wide">
            Tell Africa&apos;s Stories. Get Paid.
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Brands, NGOs, safari lodges, and governments need authentic African content. Pioneers
            who can shoot, edit, write, and create — earn globally from right here in Kenya.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=creator"
              className="bg-[#C9A227] text-white font-bold px-8 py-4 rounded-full hover:opacity-90 transition-colors text-lg"
            >
              Apply as Media Pioneer
            </Link>
            <Link
              href="/anchors"
              className="border border-[#C9A227] text-[#C9A227] font-semibold px-8 py-4 rounded-full hover:bg-[#C9A227]/10 transition-colors text-lg"
            >
              Commission Content
            </Link>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">The Opportunity Is Now</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  The world is hungry for authentic African content. A German travel brand needs a
                  Maasai documentary. A British NGO needs impact footage from Kibera. A US safari
                  lodge needs Instagram content that converts.
                </p>
                <p>
                  These clients have budgets. They want genuine, locally-created content — not stock
                  footage. And they struggle to find reliable, talented creators in Kenya.
                </p>
                <p className="text-[#C9A227] font-semibold text-lg">
                  That is the gap BeKenya Media exists to fill.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#5C0A14]/30 border border-[#C9A227]/20 rounded-xl p-4">
                  <div className="text-2xl font-black text-[#C9A227]">9</div>
                  <div className="text-xs text-gray-400 mt-1">Platforms Reached</div>
                </div>
                <div className="bg-[#5C0A14]/30 border border-[#C9A227]/20 rounded-xl p-4">
                  <div className="text-2xl font-black text-[#C9A227]">4</div>
                  <div className="text-xs text-gray-400 mt-1">Media Paths</div>
                </div>
                <div className="bg-[#5C0A14]/30 border border-[#C9A227]/20 rounded-xl p-4">
                  <div className="text-2xl font-black text-[#C9A227]">KES</div>
                  <div className="text-xs text-gray-400 mt-1">Local Payments</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#5C0A14]/30 to-[#0D1F3C]/30 border border-[#C9A227]/20 rounded-2xl p-8">
              <h3 className="font-bold text-[#C9A227] mb-4 text-lg">Who Is Hiring?</h3>
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
                    <span className="text-[#C9A227] mt-0.5 font-bold">→</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Media Paths */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#5C0A14]/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Media Paths Available</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Every creative skill has a market. Find where your talent earns.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaPaths.map((path) => (
              <div
                key={path.title}
                className="bg-[#0A0205] border border-[#C9A227]/20 rounded-2xl p-7 hover:border-[#C9A227]/50 transition-all group"
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
                          className="bg-[#C9A227]/20 text-[#C9A227] text-xs px-2 py-0.5 rounded-full"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                    <div className="text-[#C9A227] font-bold text-sm">{path.earning}</div>
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
          <h2 className="text-3xl font-bold text-white text-center mb-4">Featured Projects</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Real commissions from real Anchors. These paths are open — apply and tell Africa&apos;s
            story.
          </p>
          <div className="space-y-6">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="bg-gradient-to-r from-[#0D1F3C]/50 to-[#5C0A14]/10 border border-[#C9A227]/20 rounded-2xl p-7 hover:border-[#C9A227]/50 transition-all"
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
                    <div className="text-[#C9A227] text-sm font-medium mb-3">{project.client}</div>
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
                    <div className="text-[#C9A227] font-black text-lg text-right">
                      {project.value}
                    </div>
                    <Link
                      href="/onboarding?type=creator"
                      className="bg-[#C9A227] text-white text-sm font-bold px-5 py-2 rounded-full hover:opacity-90 transition-colors whitespace-nowrap"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Automation */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#5C0A14]/30 via-[#0D1F3C]/30 to-transparent border-t border-[#C9A227]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Social Media Automation</h2>
            <p className="text-xl text-[#C9A227] font-semibold mb-4">
              Create content + we auto-distribute to 9 platforms
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Pioneers who create for BeKenya Media clients get access to our distribution engine.
              Post once, reach everywhere. Your content goes from Nairobi to the world automatically
              — while you focus on the next shoot.
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-3 mb-12">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-[#0A0205] border border-[#C9A227]/20 rounded-xl p-3 text-center hover:border-[#C9A227]/60 transition-colors"
              >
                <div className="text-2xl mb-1">{platform.emoji}</div>
                <div className="text-xs text-gray-400 truncate">{platform.name}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#0A0205] border border-[#C9A227]/30 rounded-2xl p-8 max-w-2xl mx-auto text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-bold text-[#C9A227] text-xl mb-3">How it works</h3>
            <ol className="text-left space-y-3 text-gray-300 text-sm">
              <li className="flex gap-3">
                <span className="text-[#C9A227] font-bold">1.</span> Pioneer creates content for an
                Anchor (lodge, brand, NGO)
              </li>
              <li className="flex gap-3">
                <span className="text-[#C9A227] font-bold">2.</span> Content is approved by Anchor
                and marked for distribution
              </li>
              <li className="flex gap-3">
                <span className="text-[#C9A227] font-bold">3.</span> BeKenya auto-schedules posts
                across all 9 platforms
              </li>
              <li className="flex gap-3">
                <span className="text-[#C9A227] font-bold">4.</span> Analytics delivered to both
                Pioneer and Anchor
              </li>
              <li className="flex gap-3">
                <span className="text-[#C9A227] font-bold">5.</span> Pioneer gets paid via M-Pesa
                within 48 hours of delivery
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Document UTAMADUNI */}
      <section className="py-16 px-4 bg-[#006600]/10 border-t border-[#006600]/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Document UTAMADUNI&apos;s Impact for the World
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            UTAMADUNI is BeKenya&apos;s community charity arm — fighting poverty in Kenya through
            opportunity and dignity. Media Pioneers can document this impact and share it with the
            world.
          </p>
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 bg-[#006600] text-white font-bold px-7 py-3 rounded-full hover:bg-[#007700] transition-colors"
          >
            Explore UTAMADUNI →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#0D1F3C] to-[#0A0205]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Africa&apos;s story is waiting to be told.
          </h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Join BeKenya Media as a Pioneer. Shoot. Write. Create. Earn. Distribute to 9 platforms.
            Paid via M-Pesa.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=creator"
              className="bg-[#C9A227] text-white font-black px-10 py-4 rounded-full hover:opacity-90 transition-colors text-xl"
            >
              Apply as Media Pioneer
            </Link>
            <Link
              href="/fashion"
              className="border border-[#C9A227] text-[#C9A227] font-semibold px-8 py-4 rounded-full hover:bg-[#C9A227]/10 transition-colors"
            >
              Explore Fashion Division →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

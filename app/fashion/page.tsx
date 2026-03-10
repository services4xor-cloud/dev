'use client'

import Link from 'next/link'
import {
  FASHION_PATHS as fashionPaths,
  FASHION_PARTNER_ANCHORS as partnerAnchors,
  FASHION_PROTECTIONS as protections,
} from '@/data/mock'

export default function FashionPage() {
  return (
    <main className="min-h-screen bg-[#0A0205] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#5C0A14] via-[#3D0A0A] to-[#0A0205] py-24 px-4">
        {/* Lion watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-[20rem] leading-none">🦁</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#C9A227] text-sm font-medium">
              BeKenya Family Ltd — Fashion Division
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-[#C9A227]">BeKenya</span>{' '}
            <span className="text-white">Fashion</span>
          </h1>
          <p className="text-2xl md:text-3xl font-light text-[#C9A227] mb-6 tracking-wide">
            Style. Dignity. Africa.
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            From Nairobi to the World — African fashion that tells a story. Models, designers, and
            creatives building careers with dignity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=artisan"
              className="bg-[#C9A227] text-black font-bold px-8 py-4 rounded-full hover:bg-[#E5B93B] transition-colors text-lg"
            >
              Apply as Fashion Pioneer
            </Link>
            <Link
              href="/anchors"
              className="border border-[#C9A227] text-[#C9A227] font-semibold px-8 py-4 rounded-full hover:bg-[#C9A227]/10 transition-colors text-lg"
            >
              Hire Fashion Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-[#5C0A14]/20 border-y border-[#C9A227]/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#C9A227] mb-6">Our Mission</h2>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
            &ldquo;Fashion that empowers. Every model is a Pioneer. Every garment tells a
            story.&rdquo;
          </p>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            BeKenya Fashion exists because Africa&apos;s creative talent deserves global opportunity
            — without the exploitation, without the gatekeepers. We build safe, paid, professional
            pathways from Kenya to the world.
          </p>
        </div>
      </section>

      {/* Three Paths */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Three Paths in Fashion</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Whether you walk the runway, sketch the collection, or capture the image — there is a
            path with your name on it.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-[#5C0A14]/40 to-[#5C0A14]/10 border border-[#C9A227]/30 rounded-2xl p-8 hover:border-[#C9A227]/60 transition-colors">
              <div className="text-5xl mb-4">👗</div>
              <h3 className="text-xl font-bold text-[#C9A227] mb-3">Model</h3>
              <p className="text-gray-300 leading-relaxed">
                Professional photoshoots, brand campaigns, catalog work. Safe. Paid. Professional.
                Every engagement on your terms.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Photoshoots', 'Campaigns', 'Catalog'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#C9A227]/20 text-[#C9A227] text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#5C0A14]/40 to-[#5C0A14]/10 border border-[#C9A227]/30 rounded-2xl p-8 hover:border-[#C9A227]/60 transition-colors">
              <div className="text-5xl mb-4">✂️</div>
              <h3 className="text-xl font-bold text-[#C9A227] mb-3">Designer</h3>
              <p className="text-gray-300 leading-relaxed">
                Sketch to stitch. Local production. African prints. Global reach. Bring Kenya&apos;s
                textile tradition to international markets.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Textiles', 'African Prints', 'Production'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#C9A227]/20 text-[#C9A227] text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#5C0A14]/40 to-[#5C0A14]/10 border border-[#C9A227]/30 rounded-2xl p-8 hover:border-[#C9A227]/60 transition-colors">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-[#C9A227] mb-3">Creative</h3>
              <p className="text-gray-300 leading-relaxed">
                Photography, styling, hair and makeup, set design. The whole world behind the lens.
                Be the vision behind the brand.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Photography', 'Styling', 'Set Design'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#C9A227]/20 text-[#C9A227] text-xs px-2 py-1 rounded-full"
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
      <section className="py-20 px-4 bg-gradient-to-br from-[#5C0A14]/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            What Makes BeKenya Fashion Different
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Every Pioneer is protected. Full stop.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {protections.map((p) => (
              <div
                key={p.title}
                className="bg-[#0A0205] border border-[#C9A227]/20 rounded-xl p-6 hover:border-[#C9A227]/50 transition-colors"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-[#C9A227] mb-2">{p.title}</h3>
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
              <h2 className="text-3xl font-bold text-white mb-2">Open Fashion Paths</h2>
              <p className="text-gray-400">Paid opportunities waiting for the right Pioneer</p>
            </div>
            <Link href="/ventures" className="text-[#C9A227] hover:underline text-sm font-medium">
              View all paths →
            </Link>
          </div>
          <div className="space-y-4">
            {fashionPaths.map((path) => (
              <div
                key={path.id}
                className="bg-gradient-to-r from-[#5C0A14]/20 to-transparent border border-[#C9A227]/20 rounded-2xl p-6 hover:border-[#C9A227]/50 transition-all hover:from-[#5C0A14]/30 group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="text-4xl">{path.emoji}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{path.title}</h3>
                      <span className="bg-[#C9A227]/20 text-[#C9A227] text-xs font-semibold px-2.5 py-0.5 rounded-full">
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
                    <div className="text-[#C9A227] font-bold text-lg">{path.rate}</div>
                    <Link
                      href="/onboarding?type=artisan"
                      className="bg-[#C9A227] text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-[#E5B93B] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Anchors */}
      <section className="py-20 px-4 bg-[#5C0A14]/10 border-t border-[#C9A227]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Partner Anchors</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Organisations that trust BeKenya Fashion to connect them with verified, talented
            Pioneers
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {partnerAnchors.map((anchor) => (
              <div
                key={anchor.name}
                className="bg-[#0A0205] border border-[#C9A227]/20 rounded-xl p-6 text-center hover:border-[#C9A227]/50 transition-colors"
              >
                <div className="text-4xl mb-4">{anchor.logo}</div>
                <h3 className="font-bold text-[#C9A227] text-lg mb-2">{anchor.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{anchor.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#5C0A14] to-[#3D0A0A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to walk your path?</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Join BeKenya Fashion as a Pioneer. Set your rates. Choose your shoots. Build your career
            with dignity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/onboarding?type=artisan"
              className="bg-[#C9A227] text-black font-black px-10 py-4 rounded-full hover:bg-[#E5B93B] transition-colors text-xl"
            >
              Apply as Fashion Pioneer
            </Link>
            <Link
              href="/media"
              className="border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Explore Media Division →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

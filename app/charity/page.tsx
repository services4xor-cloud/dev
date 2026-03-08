'use client'

import { useState } from 'react'
import Link from 'next/link'

// Impact numbers
const IMPACT_STATS = [
  { number: '500+', label: 'Youth Trained', icon: '🎓' },
  { number: '12', label: 'Communities Reached', icon: '🌍' },
  { number: '3', label: 'Conservation Areas Supported', icon: '🌿' },
  { number: '20+', label: 'Women Mentored', icon: '👩' },
]

// The 4 pillars
const PILLARS = [
  {
    icon: '🎓',
    title: 'Education',
    subtitle: 'Skills for a dignified future',
    description:
      'Digital literacy, vocational training, and mentorship programs that give young Kenyans the tools to write their own story. From coding bootcamps to safari guide certification — every skill is a new door.',
    programs: ['Digital Literacy Bootcamps', 'Vocational Certifications', 'Scholarship Pathways', 'Mentor Matching'],
    color: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
    accent: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    icon: '👩',
    title: "Women's Empowerment",
    subtitle: 'Safe paths, strong futures',
    description:
      'Professional paths, safe opportunities, and community support for women seeking a better life. We work to provide alternatives to unsafe or exploitative work situations through dignity-first programming.',
    programs: ['Safe Path Program', 'Professional Mentorship', 'Business Skills Training', 'Community Networks'],
    color: 'from-purple-50 to-pink-50',
    border: 'border-purple-100',
    accent: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800',
  },
  {
    icon: '🌿',
    title: 'Conservation',
    subtitle: 'Protecting what we love',
    description:
      'Eco-tourism ventures that directly fund wildlife conservation. When you book a safari through BeKenya, a portion flows back to UTAMADUNI to support rangers, anti-poaching efforts, and conservation education.',
    programs: ['Anti-Poaching Support', 'Ranger Training', 'Conservation Education', 'Eco-Tourism Revenue Sharing'],
    color: 'from-green-50 to-emerald-50',
    border: 'border-green-100',
    accent: 'text-green-700',
    badge: 'bg-green-100 text-green-800',
  },
  {
    icon: '🎭',
    title: 'Cultural Preservation',
    subtitle: 'Our heritage, our strength',
    description:
      'Documenting, celebrating, and sharing Kenyan traditions with the world. From Maasai beadwork to Luo music — culture is not just heritage, it is a living economy that feeds communities with pride.',
    programs: ['Cultural Documentation', 'Artisan Marketplaces', 'Storytelling Archives', 'Cultural Tourism'],
    color: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    accent: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
  },
]

// Impact stories
const STORIES = [
  {
    name: 'Wanjiru N.',
    location: 'Nairobi, Kenya',
    avatar: '👩🏾',
    title: 'From uncertainty to purpose',
    story:
      'Wanjiru came to UTAMADUNI after losing her office position during a difficult season. Through the Women\'s Empowerment program, she trained in hospitality management and found her path at a Naivasha eco-lodge. Today she manages a team of 8 and trains new staff.',
    outcome: 'Eco-lodge manager, Naivasha',
    pillar: "Women's Empowerment",
  },
  {
    name: 'Baraka M.',
    location: 'Maasai Mara, Kenya',
    avatar: '👨🏾',
    title: 'The ranger who became a guide',
    story:
      'Baraka grew up near the Mara. UTAMADUNI\'s Conservation program connected him with a ranger certification course. He now leads sunrise game drives for international Pioneers visiting through BeKenya — and sends remittances to his family every month.',
    outcome: 'Senior Safari Guide, Maasai Mara',
    pillar: 'Conservation',
  },
  {
    name: 'Aisha K.',
    location: 'Lamu, Kenya',
    avatar: '👩🏾',
    title: 'Weaving tradition into livelihood',
    story:
      'Aisha\'s grandmother taught her the ancient craft of Swahili basket weaving. UTAMADUNI\'s Cultural Preservation program helped her create an online artisan profile on BeKenya\'s marketplace. She now ships her baskets to Germany, the UK, and the UAE.',
    outcome: 'Artisan entrepreneur, global marketplace',
    pillar: 'Cultural Preservation',
  },
]

// Partner types
const PARTNER_TYPES = [
  { icon: '🏫', label: 'Schools & Universities', desc: 'Curriculum collaboration, placement programs' },
  { icon: '🤝', label: 'NGOs & CBOs', desc: 'Joint programming, co-funding initiatives' },
  { icon: '🏢', label: 'Corporate Sponsors', desc: 'CSR investment, skills matching' },
  { icon: '🌍', label: 'International Organizations', desc: 'Bilateral programs, grant partnerships' },
]

type DonationAmount = 10 | 25 | 50 | 100 | 'custom'

export default function CharityPage() {
  const [donationAmount, setDonationAmount] = useState<DonationAmount>(25)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [paymentTab, setPaymentTab] = useState<'mpesa' | 'card'>('mpesa')
  const [expandedStory, setExpandedStory] = useState<number | null>(null)

  const PRESET_AMOUNTS: DonationAmount[] = [10, 25, 50, 100]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#006600] via-[#004d00] to-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-green-200 text-sm font-medium mb-8">
            <span>🇰🇪</span>
            <span>Community-Based Organization · Registered in Kenya</span>
          </div>

          {/* UTAMADUNI heading */}
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-3 text-white">
              UTAMADUNI
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/20 max-w-xs"></div>
              <span className="text-green-300 font-medium italic text-lg">Swahili for &quot;Culture &amp; Heritage&quot;</span>
            </div>
          </div>

          <p className="text-xl text-green-100 max-w-2xl leading-relaxed mb-8">
            The charitable arm of BeKenya. Every path opened on our platform contributes to
            communities, conservation, and culture across Kenya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#donate" className="inline-block bg-[#FF6B35] text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors text-center">
              Support UTAMADUNI
            </a>
            <a href="#pillars" className="inline-block bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-center">
              Learn what we do →
            </a>
          </div>
        </div>
      </div>

      {/* How it works banner */}
      <div className="bg-[#FF6B35]/5 border-y border-[#FF6B35]/10 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-700 text-base font-medium">
            When you book a Venture or open a Path on BeKenya,
            <span className="text-[#FF6B35] font-bold"> a percentage flows to UTAMADUNI </span>
            — funding real programs in real communities. No middlemen. Full transparency.
          </p>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Impact So Far</h2>
          <p className="text-gray-500">Aspirational targets for our first programme cycle</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-black text-[#006600] mb-1">{stat.number}</div>
              <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pillars */}
      <div id="pillars" className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Four Pillars</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything we do is built on these foundations — because dignified lives require
              education, safety, a healthy planet, and cultural pride.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className={`bg-gradient-to-br ${pillar.color} border ${pillar.border} rounded-2xl p-6`}
              >
                <div className="text-4xl mb-4">{pillar.icon}</div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`text-xl font-bold ${pillar.accent} mb-0.5`}>{pillar.title}</h3>
                    <p className="text-gray-500 text-sm italic">{pillar.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{pillar.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pillar.programs.map((program) => (
                    <span key={program} className={`text-xs px-2.5 py-1 rounded-full font-medium ${pillar.badge}`}>
                      {program}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works — platform connection */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500">The BeKenya circle of dignified work</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center text-3xl mx-auto mb-4">
              🌍
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Pioneers Book Ventures</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every safari, eco-lodge stay, or professional path opened on BeKenya generates value in the ecosystem.
            </p>
          </div>
          <div className="text-center p-6 relative">
            <div className="hidden sm:block absolute top-1/2 -left-4 transform -translate-y-1/2 text-gray-300 text-2xl">→</div>
            <div className="w-16 h-16 rounded-2xl bg-[#006600]/10 flex items-center justify-center text-3xl mx-auto mb-4">
              💚
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Portion Goes to UTAMADUNI</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              A transparent percentage of each transaction is allocated to UTAMADUNI programs — automatically.
            </p>
          </div>
          <div className="text-center p-6 relative">
            <div className="hidden sm:block absolute top-1/2 -left-4 transform -translate-y-1/2 text-gray-300 text-2xl">→</div>
            <div className="w-16 h-16 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center text-3xl mx-auto mb-4">
              🏘️
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Communities Thrive</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Funds go directly to skills training, conservation support, and women&apos;s empowerment in Kenyan communities.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Stories */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Stories from the Field</h2>
            <p className="text-gray-400">Real lives. Real change. Names used with permission.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORIES.map((story, i) => (
              <div
                key={story.name}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
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

                <p className={`text-gray-300 text-sm leading-relaxed mb-4 ${expandedStory === i ? '' : 'line-clamp-3'}`}>
                  {story.story}
                </p>

                <button
                  onClick={() => setExpandedStory(expandedStory === i ? null : i)}
                  className="text-[#FF6B35] text-xs font-medium mb-4 hover:text-orange-400 transition-colors text-left"
                >
                  {expandedStory === i ? 'Show less' : 'Read full story →'}
                </button>

                <div className="mt-auto pt-4 border-t border-gray-700">
                  <div className="text-[#FF6B35] text-xs font-semibold mb-1">Today</div>
                  <div className="text-gray-200 text-sm font-medium">{story.outcome}</div>
                  <div className="mt-2">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      {story.pillar}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner With Us */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Partner With UTAMADUNI</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We welcome partnerships with organisations who share our belief in dignified work,
            community development, and conservation.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PARTNER_TYPES.map((partner) => (
            <div key={partner.label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{partner.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{partner.label}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{partner.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block bg-[#006600] text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-800 transition-colors"
          >
            Get in Touch →
          </Link>
        </div>
      </div>

      {/* Donation CTA */}
      <div id="donate" className="bg-gradient-to-br from-[#006600] to-[#004d00] py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Support UTAMADUNI</h2>
          <p className="text-green-200 mb-8">
            Every contribution — big or small — builds skills, protects wildlife, and
            preserves Kenyan culture for generations to come.
          </p>

          {/* Amount selector */}
          <div className="bg-white rounded-2xl p-6 shadow-xl mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-3 text-left">Choose amount</div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setDonationAmount(amount); setCustomAmount('') }}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                    donationAmount === amount
                      ? 'bg-[#006600] text-white border-[#006600]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                min="1"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount('custom') }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006600] focus:border-transparent placeholder:text-gray-400 text-gray-900"
              />
            </div>

            {/* Payment tab */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setPaymentTab('mpesa')}
                className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                  paymentTab === 'mpesa'
                    ? 'bg-[#006600] text-white border-[#006600]'
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
                  Donate via M-Pesa: Paybill <strong>UTAMADUNI CBO</strong>. You&apos;ll receive full
                  payment instructions after clicking below.
                </p>
              </div>
            )}

            <button className="w-full bg-[#FF6B35] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors text-base">
              Donate {donationAmount !== 'custom' ? `$${donationAmount}` : customAmount ? `$${customAmount}` : ''} to UTAMADUNI
            </button>

            <p className="text-gray-400 text-xs mt-3">
              Donations are used directly for community programs. No political affiliations.
            </p>
          </div>

          <p className="text-green-200 text-sm">
            You can also contribute by{' '}
            <Link href="/ventures" className="text-white underline font-medium hover:text-green-100">
              booking a Venture
            </Link>{' '}
            on BeKenya — a percentage automatically supports UTAMADUNI.
          </p>
        </div>
      </div>

      {/* Legal footer note */}
      <div className="bg-gray-100 py-6 text-center">
        <p className="text-gray-500 text-sm max-w-2xl mx-auto px-4">
          UTAMADUNI is registered in Kenya as a Community Based Organisation (CBO).
          Partnered with BeKenya Family Ltd. All programmes are administered locally
          with full community involvement and transparent financial reporting.
        </p>
      </div>
    </div>
  )
}

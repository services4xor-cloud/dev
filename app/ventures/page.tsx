'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Star } from 'lucide-react'
import { PIONEER_TYPES, PioneerType, VOCAB } from '@/lib/vocabulary'
import { SAFARI_PACKAGES, formatPackagePrice } from '@/lib/safari-packages'

// Mock professional paths (renamed from jobs)
interface ProfessionalPath {
  id: string
  title: string
  anchor: string
  location: string
  category: 'professional' | 'explorer' | 'creative' | 'community'
  salary: string
  posted: string
  icon: string
  tags: string[]
  isRemote: boolean
  isFeatured: boolean
  pioneersNeeded?: number
}

const MOCK_PATHS: ProfessionalPath[] = [
  {
    id: 'p1',
    title: 'Senior Software Pioneer',
    anchor: 'Safaricom PLC',
    location: 'Nairobi, Kenya',
    category: 'professional',
    salary: 'KES 250,000 – 400,000/month',
    posted: '2 hours ago',
    icon: '📡',
    tags: ['React', 'Node.js', 'AWS'],
    isRemote: false,
    isFeatured: true,
    pioneersNeeded: 3,
  },
  {
    id: 'p2',
    title: 'Financial Pioneer — UK Markets',
    anchor: 'Barclays UK',
    location: 'London, UK (Visa Supported)',
    category: 'professional',
    salary: '£45,000 – £60,000/year',
    posted: '5 hours ago',
    icon: '🏦',
    tags: ['Excel', 'Python', 'Bloomberg'],
    isRemote: false,
    isFeatured: true,
    pioneersNeeded: 1,
  },
  {
    id: 'p3',
    title: 'Remote Community Support Pioneer',
    anchor: 'Shopify',
    location: 'Remote — Worldwide',
    category: 'professional',
    salary: '$40,000 – $55,000/year',
    posted: '1 day ago',
    icon: '🛍️',
    tags: ['Customer Service', 'Zendesk', 'Leadership'],
    isRemote: true,
    isFeatured: false,
  },
  {
    id: 'p4',
    title: 'Healer Pioneer — NHS Scotland',
    anchor: 'NHS Scotland',
    location: 'Edinburgh, UK (Relocation Support)',
    category: 'professional',
    salary: '£28,000 – £36,000/year',
    posted: '2 days ago',
    icon: '🏥',
    tags: ['Nursing', 'ICU', 'NMC'],
    isRemote: false,
    isFeatured: false,
    pioneersNeeded: 8,
  },
  {
    id: 'p5',
    title: 'Wildlife Photography Creator',
    anchor: 'Nat Geo Expeditions',
    location: 'Maasai Mara, Kenya',
    category: 'creative',
    salary: '$2,500 – $4,000/expedition',
    posted: '3 days ago',
    icon: '📸',
    tags: ['Photography', 'Wildlife', 'Documentary'],
    isRemote: false,
    isFeatured: false,
  },
  {
    id: 'p6',
    title: 'Community Garden Pioneer',
    anchor: 'UTAMADUNI CBO',
    location: 'Nairobi West, Kenya',
    category: 'community',
    salary: 'KES 45,000/month + training',
    posted: '1 week ago',
    icon: '🌱',
    tags: ['Community', 'Agriculture', 'Education'],
    isRemote: false,
    isFeatured: false,
  },
  {
    id: 'p7',
    title: 'Dubai Construction Guardian',
    anchor: 'EMAAR Properties',
    location: 'Dubai, UAE (Visa + Housing)',
    category: 'professional',
    salary: 'AED 12,000 – 18,000/month',
    posted: '4 days ago',
    icon: '🏗️',
    tags: ['Construction', 'Safety', 'Project Management'],
    isRemote: false,
    isFeatured: false,
  },
  {
    id: 'p8',
    title: 'Eco-Lodge Host Pioneer',
    anchor: 'Ol Pejeta Conservancy',
    location: 'Laikipia, Kenya',
    category: 'explorer',
    salary: 'KES 60,000 – 80,000/month',
    posted: '5 days ago',
    icon: '🏡',
    tags: ['Hospitality', 'Eco-Tourism', 'Conservation'],
    isRemote: false,
    isFeatured: false,
    pioneersNeeded: 4,
  },
]

type FilterTab = 'all' | 'professional' | 'explorer' | 'creative' | 'community'

const FILTER_TABS: { id: FilterTab; label: string; icon: string }[] = [
  { id: 'all', label: 'All Ventures', icon: '🌍' },
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'explorer', label: 'Explorer', icon: '🌿' },
  { id: 'creative', label: 'Creative', icon: '🎬' },
  { id: 'community', label: 'Community', icon: '🤝' },
]

const TYPE_COLORS: Record<string, string> = {
  deep_sea_fishing: 'bg-blue-100 text-blue-800',
  wildlife_safari: 'bg-amber-100 text-amber-800',
  eco_lodge: 'bg-green-100 text-green-800',
  cultural: 'bg-purple-100 text-purple-800',
}

const TYPE_LABELS: Record<string, string> = {
  deep_sea_fishing: '🎣 Deep Sea Fishing',
  wildlife_safari: '🦁 Wildlife Safari',
  eco_lodge: '🏡 Eco-Lodge',
  cultural: '🎭 Cultural',
}

export default function VenturesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [activePioneer, setActivePioneer] = useState<PioneerType | null>(null)

  const featuredSafari = SAFARI_PACKAGES.find(p => p.id === 'maasai-mara-3day') ?? SAFARI_PACKAGES[0]

  const filteredPaths = MOCK_PATHS.filter((path) => {
    if (activeTab !== 'all' && path.category !== activeTab) return false
    if (activePioneer) {
      const pioneerSectors = PIONEER_TYPES[activePioneer].sectors.map(s => s.toLowerCase())
      const matchesPioneer = path.tags.some(t =>
        pioneerSectors.some(ps => ps.includes(t.toLowerCase()) || t.toLowerCase().includes(ps.split(' ')[0]))
      )
      if (!matchesPioneer && path.category !== activePioneer) return false
    }
    return true
  })

  const visibleSafaris = SAFARI_PACKAGES
    .filter(p => activeTab === 'all' || activeTab === 'explorer')
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-[#006600]/30 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-6">
            <span>🌍</span>
            <span>Open Paths across 30+ countries</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Open Paths.
            <br />
            <span className="text-[#FF6B35]">Real Ventures.</span>
            <br />
            Your Chapter Starts Here.
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-8">
            From Maasai Mara game drives to London fintech floors — every path here is
            a real chapter waiting to be written by a Pioneer like you.
          </p>

          {/* Pioneer type filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActivePioneer(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activePioneer === null
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All Pioneers
            </button>
            {(Object.entries(PIONEER_TYPES) as [PioneerType, typeof PIONEER_TYPES[PioneerType]][]).map(([key, type]) => (
              <button
                key={key}
                onClick={() => setActivePioneer(activePioneer === key ? null : key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activePioneer === key
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Venture */}
      {(activeTab === 'all' || activeTab === 'explorer') && (
        <div className="max-w-5xl mx-auto px-4 -mt-6">
          <Link href={`/experiences/${featuredSafari.id}`}>
            <div className="bg-gradient-to-r from-amber-800 to-amber-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-amber-700/50">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🦁</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">FEATURED VENTURE</span>
                    <span className="text-amber-200 text-xs">{featuredSafari.provider}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{featuredSafari.name}</h3>
                  <p className="text-amber-100 text-sm">
                    {featuredSafari.destination} · {featuredSafari.duration} · Max {featuredSafari.maxGuests} Pioneers
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold">{formatPackagePrice(featuredSafari)}</div>
                <div className="text-amber-200 text-xs mb-3">{featuredSafari.priceNote}</div>
                <div className="bg-white text-amber-800 font-bold px-5 py-2 rounded-xl text-sm hover:bg-amber-50 transition-colors inline-block">
                  {VOCAB.chapter_open} →
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Filter tabs */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Safari / Experience Packages */}
        {(activeTab === 'all' || activeTab === 'explorer') && visibleSafaris.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                🌿 Explorer Ventures
              </h2>
              <Link href="/experiences" className="text-[#FF6B35] text-sm font-medium hover:text-orange-600">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleSafaris.map((pkg) => (
                <Link key={pkg.id} href={`/experiences/${pkg.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">
                    {/* Image placeholder */}
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-36 flex items-center justify-center text-5xl">
                      {pkg.type === 'deep_sea_fishing' ? '🎣' : pkg.type === 'wildlife_safari' ? '🦁' : pkg.type === 'eco_lodge' ? '🏡' : '🎭'}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[pkg.type] ?? 'bg-gray-100 text-gray-700'}`}>
                          {TYPE_LABELS[pkg.type] ?? pkg.type}
                        </span>
                        {pkg.season === 'high' && (
                          <span className="text-xs text-amber-600 font-medium">High Season</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 leading-tight">{pkg.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <MapPin size={13} />
                        <span>{pkg.destination}</span>
                        <span>·</span>
                        <Clock size={13} />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[#FF6B35]">{formatPackagePrice(pkg)}</div>
                        <div className="text-[#FF6B35] text-sm font-semibold hover:text-orange-600">
                          {VOCAB.chapter_open} →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Professional Paths */}
        {(activeTab === 'all' || activeTab !== 'explorer') && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {activeTab === 'creative' ? '🎬 Creative Paths' : activeTab === 'community' ? '🤝 Community Paths' : '💼 Professional Paths'}
              </h2>
              <div className="text-sm text-gray-500">
                {filteredPaths.length} {filteredPaths.length === 1 ? VOCAB.path.singular : VOCAB.path.plural} open
              </div>
            </div>

            {filteredPaths.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🧭</div>
                <p className="text-lg font-medium text-gray-600">No Paths match your filter yet.</p>
                <p className="text-sm mt-1">Try a different Pioneer type or filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPaths.map((path) => (
                  <Link
                    key={path.id}
                    href={`/paths/${path.id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4 group block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {path.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {path.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B35] text-xs font-medium mb-1">
                              <Star size={10} className="fill-current" /> Featured
                            </span>
                          )}
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                            {path.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                            <span>{path.anchor}</span>
                            <span>·</span>
                            <MapPin size={12} />
                            <span>{path.location}</span>
                          </div>
                        </div>
                        {path.pioneersNeeded && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                            {path.pioneersNeeded} spots open
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {path.isRemote && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                            🌍 Remote
                          </span>
                        )}
                        {path.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="font-semibold text-[#FF6B35] text-sm">{path.salary}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} />
                          {path.posted}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Load more */}
        <div className="text-center pt-4">
          <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all duration-150">
            Load More {VOCAB.venture.plural}
          </button>
        </div>
      </div>
    </div>
  )
}

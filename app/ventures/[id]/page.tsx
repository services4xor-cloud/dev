'use client'

/**
 * Venture Detail — Path detail page + "Open Chapter" action
 *
 * Core conversion page: Pioneer sees full Path details and decides
 * to open a Chapter (apply). Uses mock data until DB is connected.
 *
 * URL: /ventures/[id] where id matches MOCK_VENTURE_PATHS[].id
 */

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  Users,
  Star,
  ArrowLeft,
  Building2,
  Globe,
  CheckCircle2,
  Briefcase,
} from 'lucide-react'
import { VOCAB } from '@/lib/vocabulary'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import StatusBadge from '@/components/StatusBadge'

// ─── Extended mock details (until DB provides real data) ──────────────────────

const PATH_DETAILS: Record<
  string,
  { description: string; responsibilities: string[]; requirements: string[]; benefits: string[] }
> = {
  p1: {
    description:
      "Join Safaricom, East Africa's leading telco, to build next-generation digital financial services reaching 30M+ users. Work on M-Pesa integrations, real-time payment systems, and cutting-edge mobile infrastructure.",
    responsibilities: [
      'Design and build scalable React/Node.js microservices',
      'Collaborate with cross-functional teams on M-Pesa platform features',
      'Mentor junior engineers and contribute to engineering culture',
      'Drive code quality through reviews, testing, and best practices',
    ],
    requirements: [
      '5+ years experience with React and Node.js',
      'Strong AWS or cloud platform experience',
      'Experience with high-traffic, distributed systems',
      'Excellent communication skills in English',
    ],
    benefits: [
      'Competitive salary: KES 250,000 - 400,000/mo',
      'Medical cover for you and your family',
      'Annual learning & development budget',
      'Flexible hybrid work arrangement',
    ],
  },
  p2: {
    description:
      "Barclays UK is seeking Kenyan financial professionals for their UK Markets division. This is a unique Route for pioneers with strong analytical skills to build a career in one of the world's leading financial centres.",
    responsibilities: [
      'Analyse UK and European market trends and risk factors',
      'Build financial models and reporting dashboards',
      'Support senior analysts with client-facing research',
      'Collaborate with global teams across time zones',
    ],
    requirements: [
      'Degree in Finance, Economics, or related field',
      'Proficiency in Excel, Python, and Bloomberg Terminal',
      'Strong quantitative and analytical skills',
      'Right to work in the UK (visa sponsorship available)',
    ],
    benefits: [
      'Salary: \u00a345,000 - \u00a360,000/yr + bonus',
      'Visa sponsorship and relocation support',
      'Private healthcare and pension scheme',
      'Professional development (CFA support)',
    ],
  },
  p11: {
    description:
      'James Finlays Kenya is one of the largest tea producers in East Africa, managing over 4,000 hectares of tea estates in the Kericho highlands. Supervise production across estates, ensure quality standards, and lead a team of 200+ workers through the harvest cycle.',
    responsibilities: [
      'Oversee daily tea plucking operations across assigned estates',
      'Monitor leaf quality and processing standards',
      'Manage seasonal workforce scheduling and welfare',
      'Report on yield targets and implement improvement plans',
    ],
    requirements: [
      'Diploma or degree in Agriculture, Agronomy, or related field',
      'Experience in estate or farm management',
      'Strong leadership and Swahili communication skills',
      'Knowledge of sustainable farming practices',
    ],
    benefits: [
      'Salary: KES 85,000 - 120,000/mo',
      'On-estate housing and meals',
      'Healthcare for family',
      'Training in advanced tea production techniques',
    ],
  },
  p13: {
    description:
      "Hemingways Watamu is a luxury resort on Kenya's north coast, famous for world-class deep-sea fishing. Guide international guests on fishing expeditions for marlin, sailfish, and yellowfin tuna in the warm Indian Ocean waters.",
    responsibilities: [
      'Lead deep-sea fishing expeditions (full and half-day)',
      'Maintain fishing equipment and boat safety standards',
      'Brief guests on marine wildlife and conservation',
      'Coordinate with resort hospitality team for seamless experiences',
    ],
    requirements: [
      'Boat handling certification and fishing experience',
      'Strong swimming ability and water safety knowledge',
      'English and Swahili fluency',
      'Customer service orientation',
    ],
    benefits: [
      'Salary: KES 60,000 - 90,000/mo + guest tips',
      'Resort accommodation included',
      'Free diving and water sports access',
      'International tourism exposure',
    ],
  },
}

// Fallback for paths without detailed mock data
const DEFAULT_DETAILS = {
  description:
    'This is an exciting opportunity to grow your career with a forward-thinking organisation. Join a team that values diversity, innovation, and impact.',
  responsibilities: [
    'Contribute to core projects and team objectives',
    'Collaborate with local and international team members',
    'Bring your unique perspective and skills to the role',
    'Grow professionally in a supportive environment',
  ],
  requirements: [
    'Relevant experience or qualifications in this field',
    'Strong communication skills',
    'Self-motivated and eager to learn',
    'Team player with a positive attitude',
  ],
  benefits: [
    'Competitive compensation package',
    'Professional growth opportunities',
    'Supportive and inclusive team culture',
    'Meaningful, impactful work',
  ],
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VentureDetailPage() {
  const params = useParams()
  const pathId = params.id as string
  const [chapterOpened, setChapterOpened] = useState(false)

  // Find the path
  const path = MOCK_VENTURE_PATHS.find((p) => p.id === pathId)

  if (!path) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🧭</div>
          <h1 className="text-2xl font-bold text-white mb-2">Path Not Found</h1>
          <p className="text-gray-400 mb-6">This venture doesn&apos;t exist or has been closed.</p>
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Ventures
          </Link>
        </div>
      </div>
    )
  }

  const details = PATH_DETAILS[pathId] ?? DEFAULT_DETAILS
  const categoryLabels: Record<string, string> = {
    professional: 'Professional',
    explorer: 'Explorer',
    creative: 'Creative',
    community: 'Community',
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* ── Top bar with back nav ─────────────────────────────────────────── */}
      <div className="bg-gray-900 border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 xl:px-8 py-4">
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ventures
          </Link>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 xl:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left column: Path details ───────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-3xl">
                  {path.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white">{path.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {path.anchorName}
                    </span>
                    <span className="text-gray-600">|</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {path.location}
                    </span>
                    {path.isRemote && (
                      <>
                        <span className="text-gray-600">|</span>
                        <span className="flex items-center gap-1 text-brand-accent">
                          <Globe className="w-3.5 h-3.5" />
                          Remote OK
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status="open" />
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                  {categoryLabels[path.category] ?? path.category}
                </span>
                {path.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-white font-semibold mb-3">About This Path</h2>
              <p className="text-gray-300 leading-relaxed">{details.description}</p>
            </section>

            {/* Responsibilities */}
            <section>
              <h2 className="text-white font-semibold mb-3">What You&apos;ll Do</h2>
              <ul className="space-y-2">
                {details.responsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-300 text-sm">
                    <Briefcase className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-white font-semibold mb-3">What We&apos;re Looking For</h2>
              <ul className="space-y-2">
                {details.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-white font-semibold mb-3">What You&apos;ll Get</h2>
              <ul className="space-y-2">
                {details.benefits.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-300 text-sm">
                    <Star className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right column: Action card (sticky) ──────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Summary card */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-5">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Compensation</div>
                  <div className="text-xl font-bold text-white">{path.salary}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Posted</div>
                    <div className="flex items-center gap-1 text-sm text-white">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {path.posted}
                    </div>
                  </div>
                  {path.pioneersNeeded && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Pioneers Needed</div>
                      <div className="flex items-center gap-1 text-sm text-white">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        {path.pioneersNeeded}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="text-xs text-gray-400 mb-1">Anchor</div>
                  <div className="text-sm text-white font-medium">{path.anchorName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{path.location}</div>
                </div>

                {/* CTA — Open Chapter */}
                {chapterOpened ? (
                  <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-semibold text-sm">Chapter Opened!</p>
                    <p className="text-gray-400 text-xs mt-1">
                      The Anchor will review your profile. Check your dashboard for updates.
                    </p>
                    <Link
                      href="/pioneers/dashboard"
                      className="inline-block mt-3 text-brand-accent text-xs hover:underline"
                    >
                      Go to Dashboard →
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => setChapterOpened(true)}
                    className="w-full py-3 bg-brand-accent text-white rounded-xl text-sm font-bold hover:opacity-90 transition-colors"
                  >
                    {VOCAB.chapter_open}
                  </button>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Opening a {VOCAB.chapter.singular} shares your profile with this{' '}
                  {VOCAB.anchor.singular}.
                </p>
              </div>

              {/* Similar paths */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="text-white font-semibold text-sm mb-3">Similar Paths</h3>
                <div className="space-y-3">
                  {MOCK_VENTURE_PATHS.filter((p) => p.id !== pathId && p.category === path.category)
                    .slice(0, 3)
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/ventures/${p.id}`}
                        className="flex items-start gap-2 group"
                      >
                        <span className="text-lg flex-shrink-0">{p.icon}</span>
                        <div className="min-w-0">
                          <div className="text-sm text-white group-hover:text-brand-accent transition-colors font-medium truncate">
                            {p.title}
                          </div>
                          <div className="text-xs text-gray-400">{p.anchorName}</div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

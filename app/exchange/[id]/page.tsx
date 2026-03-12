'use client'

/**
 * Exchange Detail — Shows a Person or Opportunity in full detail
 *
 * Looks up the item by ID from mock data (people + paths).
 * Shows all info in a GlassCard layout with action button.
 */

import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { ArrowLeft, Globe, MapPin, Briefcase, Star } from 'lucide-react'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

// ─── Mock people (same as exchange page) ────────────────────────────

interface MockPerson {
  id: string
  name: string
  country: string
  flag: string
  languages: string[]
  skills: string[]
  mode: 'explorer' | 'host'
  sector: string
  sectorIcon: string
  city: string
  bio?: string
}

const MOCK_EXCHANGE_PEOPLE: MockPerson[] = [
  {
    id: 'ex-p1',
    name: 'Amara Osei',
    country: 'KE',
    flag: '🇰🇪',
    languages: ['English', 'Swahili'],
    skills: ['Wildlife knowledge', 'Photography', 'Guest relations'],
    mode: 'explorer',
    sector: 'Safari & Wildlife',
    sectorIcon: '🦁',
    city: 'Nairobi',
    bio: 'Passionate safari guide with 5 years in Maasai Mara. Specializing in eco-tourism and conservation storytelling.',
  },
  {
    id: 'ex-p2',
    name: 'Lukas Schneider',
    country: 'DE',
    flag: '🇩🇪',
    languages: ['German', 'English'],
    skills: ['Engineering', 'AutoCAD', 'Project Management'],
    mode: 'host',
    sector: 'Engineering',
    sectorIcon: '🔧',
    city: 'Munich',
    bio: 'Mechanical engineer offering mentorship and collaboration on infrastructure projects across Africa and Europe.',
  },
  {
    id: 'ex-p3',
    name: 'Priya Sharma',
    country: 'IN',
    flag: '🇮🇳',
    languages: ['Hindi', 'English'],
    skills: ['Nursing', 'Healthcare', 'First Aid'],
    mode: 'explorer',
    sector: 'Health & Wellness',
    sectorIcon: '❤️',
    city: 'Mumbai',
    bio: 'Healthcare professional looking to connect with hospitals and community health programmes in East Africa.',
  },
  {
    id: 'ex-p4',
    name: 'Fatuma Ali',
    country: 'KE',
    flag: '🇰🇪',
    languages: ['Swahili', 'English', 'Arabic'],
    skills: ['Community outreach', 'Teaching', 'Healthcare'],
    mode: 'explorer',
    sector: 'Community',
    sectorIcon: '🤝',
    city: 'Mombasa',
    bio: 'Community health worker passionate about bridging healthcare gaps in coastal Kenya.',
  },
  {
    id: 'ex-p5',
    name: 'James Mwangi',
    country: 'KE',
    flag: '🇰🇪',
    languages: ['English', 'Swahili'],
    skills: ['Security operations', 'Risk assessment', 'Emergency response'],
    mode: 'host',
    sector: 'Engineering',
    sectorIcon: '🔧',
    city: 'Nairobi',
    bio: 'Security operations lead with experience in high-profile events and venue management.',
  },
  {
    id: 'ex-p6',
    name: 'Sophie Dubois',
    country: 'FR',
    flag: '🇫🇷',
    languages: ['French', 'English'],
    skills: ['Fashion', 'Graphic design', 'Brand development'],
    mode: 'host',
    sector: 'Art & Fashion',
    sectorIcon: '🎨',
    city: 'Paris',
    bio: 'Fashion designer exploring African textiles and cross-cultural brand collaborations.',
  },
  {
    id: 'ex-p7',
    name: 'David Kiprop',
    country: 'KE',
    flag: '🇰🇪',
    languages: ['English', 'Swahili'],
    skills: ['Video production', 'TikTok', 'Photography'],
    mode: 'explorer',
    sector: 'Media & Content',
    sectorIcon: '📱',
    city: 'Nairobi',
    bio: 'Content creator and videographer telling stories of East African culture and innovation.',
  },
  {
    id: 'ex-p8',
    name: 'Chen Wei',
    country: 'TH',
    flag: '🇹🇭',
    languages: ['English'],
    skills: ['React', 'Node.js', 'Cloud', 'API design'],
    mode: 'host',
    sector: 'Technology',
    sectorIcon: '💻',
    city: 'Bangkok',
    bio: 'Full-stack developer offering remote collaboration and tech mentorship.',
  },
  {
    id: 'ex-p9',
    name: 'Aisha Mohammed',
    country: 'NG',
    flag: '🇳🇬',
    languages: ['English', 'Hausa', 'Yoruba'],
    skills: ['Agriculture', 'Farm Management', 'Export'],
    mode: 'explorer',
    sector: 'Agriculture',
    sectorIcon: '🌿',
    city: 'Lagos',
    bio: 'Agricultural entrepreneur connecting Nigerian produce with international markets.',
  },
  {
    id: 'ex-p10',
    name: 'Marco Rossi',
    country: 'CH',
    flag: '🇨🇭',
    languages: ['German', 'English', 'French'],
    skills: ['Finance', 'Private Banking', 'Hospitality'],
    mode: 'host',
    sector: 'Trade & Investment',
    sectorIcon: '💰',
    city: 'Zurich',
    bio: 'Wealth management associate looking to support African entrepreneurs entering European markets.',
  },
]

// ─── Helpers ────────────────────────────────────────────────────────

function langCodeToName(code: string): string {
  const lang = LANGUAGE_REGISTRY[code as LanguageCode]
  return lang ? lang.name : code
}

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { identity } = useIdentity()
  const id = params.id as string

  const userLangNames = useMemo(
    () => identity.languages.map(langCodeToName),
    [identity.languages]
  )

  // Find item — could be a person or an opportunity
  const person = MOCK_EXCHANGE_PEOPLE.find((p) => p.id === id)
  const path = MOCK_VENTURE_PATHS.find((p) => p.id === id)

  const isPerson = !!person
  const isOpportunity = !!path

  if (!isPerson && !isOpportunity) {
    return (
      <SectionLayout>
        <div className="py-phi-7 text-center">
          <h1 className="text-phi-xl font-bold text-white">Not Found</h1>
          <p className="mt-phi-2 text-white/50">This exchange item could not be found.</p>
          <Link
            href="/exchange"
            className="mt-phi-4 inline-flex items-center gap-phi-1 text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exchange
          </Link>
        </div>
      </SectionLayout>
    )
  }

  // ── Person detail ──
  if (isPerson && person) {
    const country = COUNTRY_OPTIONS.find((c) => c.code === person.country)
    const isSharedLang = (lang: string) =>
      userLangNames.some((ul) => ul.toLowerCase() === lang.toLowerCase())

    return (
      <SectionLayout>
        <Link
          href="/exchange"
          className="mb-phi-4 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exchange
        </Link>

        <GlassCard variant="featured" padding="lg">
          {/* Header */}
          <div className="mb-phi-5 flex items-start justify-between">
            <div>
              <div className="mb-phi-2 flex items-center gap-phi-2">
                <span className="rounded-full bg-brand-primary/30 px-phi-2 py-0.5 text-phi-xs text-white">
                  Pioneer
                </span>
                <span className="rounded-full bg-white/10 px-phi-2 py-0.5 text-phi-xs text-white/60">
                  {person.mode === 'explorer' ? 'Explorer' : 'Host'}
                </span>
              </div>
              <h1 className="text-phi-2xl font-bold text-white">
                {person.flag} {person.name}
              </h1>
              <div className="mt-phi-1 flex items-center gap-phi-2 text-white/50">
                <MapPin className="h-4 w-4" />
                <span>
                  {person.city}, {country?.name ?? person.country}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-phi-1 text-phi-sm text-white/40">
              {person.sectorIcon} {person.sector}
            </div>
          </div>

          {/* Bio */}
          {person.bio && (
            <div className="mb-phi-5">
              <h2 className="mb-phi-2 text-phi-base font-semibold text-white/70">About</h2>
              <p className="text-phi-base text-white/60 leading-relaxed">{person.bio}</p>
            </div>
          )}

          {/* Languages */}
          <div className="mb-phi-5">
            <h2 className="mb-phi-2 text-phi-base font-semibold text-white/70">Languages</h2>
            <div className="flex flex-wrap gap-phi-2">
              {person.languages.map((lang) => (
                <span
                  key={lang}
                  className={`rounded-full px-phi-3 py-phi-1 text-phi-sm ${
                    isSharedLang(lang)
                      ? 'border border-brand-accent/50 bg-brand-accent/10 text-brand-accent'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  <Globe className="mr-1 inline h-3.5 w-3.5" />
                  {lang}
                  {isSharedLang(lang) && (
                    <Star className="ml-1 inline h-3 w-3 text-brand-accent" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-phi-7">
            <h2 className="mb-phi-2 text-phi-base font-semibold text-white/70">Skills</h2>
            <div className="flex flex-wrap gap-phi-2">
              {person.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/5 px-phi-3 py-phi-1 text-phi-sm text-white/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <button className="w-full rounded-lg bg-brand-primary py-phi-3 text-phi-base font-semibold text-white transition-all hover:bg-brand-primary/80">
            Connect with {person.name.split(' ')[0]}
          </button>
        </GlassCard>
      </SectionLayout>
    )
  }

  // ── Opportunity detail ──
  if (isOpportunity && path) {
    const country = COUNTRY_OPTIONS.find((c) => c.code === path.country)

    return (
      <SectionLayout>
        <Link
          href="/exchange"
          className="mb-phi-4 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exchange
        </Link>

        <GlassCard variant="featured" padding="lg">
          {/* Header */}
          <div className="mb-phi-5">
            <div className="mb-phi-2 flex items-center gap-phi-2">
              <span className="rounded-full border border-brand-accent/30 px-phi-2 py-0.5 text-phi-xs text-brand-accent">
                Path
              </span>
              {path.isFeatured && (
                <span className="rounded-full bg-brand-accent/20 px-phi-2 py-0.5 text-phi-xs text-brand-accent">
                  Featured
                </span>
              )}
              {path.isRemote && (
                <span className="rounded-full bg-white/10 px-phi-2 py-0.5 text-phi-xs text-white/60">
                  Remote
                </span>
              )}
            </div>
            <h1 className="text-phi-2xl font-bold text-white">
              {path.icon} {path.title}
            </h1>
            <div className="mt-phi-2 flex flex-wrap items-center gap-phi-3 text-white/50">
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {path.anchorName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {country?.flag} {path.location}
              </span>
            </div>
          </div>

          {/* Details grid */}
          <div className="mb-phi-5 grid grid-cols-2 gap-phi-3">
            <div className="glass-subtle rounded-lg p-phi-3">
              <p className="text-phi-xs text-white/40">Compensation</p>
              <p className="text-phi-sm font-semibold text-white">{path.salary}</p>
            </div>
            <div className="glass-subtle rounded-lg p-phi-3">
              <p className="text-phi-xs text-white/40">Posted</p>
              <p className="text-phi-sm font-semibold text-white">{path.posted}</p>
            </div>
            {path.pioneersNeeded && (
              <div className="glass-subtle rounded-lg p-phi-3">
                <p className="text-phi-xs text-white/40">Pioneers Needed</p>
                <p className="text-phi-sm font-semibold text-white">{path.pioneersNeeded}</p>
              </div>
            )}
            <div className="glass-subtle rounded-lg p-phi-3">
              <p className="text-phi-xs text-white/40">Category</p>
              <p className="text-phi-sm font-semibold text-white capitalize">{path.category}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-phi-7">
            <h2 className="mb-phi-2 text-phi-base font-semibold text-white/70">Skills Required</h2>
            <div className="flex flex-wrap gap-phi-2">
              {path.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-phi-3 py-phi-1 text-phi-sm text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <button className="w-full rounded-lg border border-brand-accent/40 py-phi-3 text-phi-base font-semibold text-brand-accent transition-all hover:bg-brand-accent/10">
            Apply for this Path
          </button>
        </GlassCard>
      </SectionLayout>
    )
  }

  return null
}

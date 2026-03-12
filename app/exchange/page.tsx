'use client'

/**
 * Exchange — Smart feed of People + Opportunities
 *
 * Ranked by matching engine based on the Pioneer's identity:
 *   - Language overlap → shared languages score higher
 *   - Interest overlap → shared categories score higher
 *   - Sorted by combined score descending
 *
 * Filters: type (All / People / Opportunities), sector, language
 */

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Filter, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useIdentity } from '@/lib/identity-context'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { MOCK_VENTURE_PATHS } from '@/data/mock'
import ExchangeCard, { type ExchangeCardData } from '@/components/ExchangeCard'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

// ─── Mock Exchange People ───────────────────────────────────────────

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
  },
]

// ─── Scoring helpers ────────────────────────────────────────────────

/** Resolve language codes to display names */
function langCodeToName(code: string): string {
  const lang = LANGUAGE_REGISTRY[code as LanguageCode]
  return lang ? lang.name : code
}

/** Score a person against user identity */
function scorePerson(
  person: MockPerson,
  userLangs: string[],
  userInterests: string[]
): number {
  let score = 30 // base

  // Language overlap (up to 40 pts)
  const userLangNames = userLangs.map(langCodeToName)
  const sharedLangs = person.languages.filter((l) =>
    userLangNames.some((ul) => ul.toLowerCase() === l.toLowerCase())
  )
  score += Math.min(40, sharedLangs.length * 20)

  // Interest/sector overlap (up to 30 pts)
  const sectorMatch = EXCHANGE_CATEGORIES.find(
    (c) => c.label === person.sector || c.id === person.sector.toLowerCase()
  )
  if (sectorMatch && userInterests.includes(sectorMatch.id)) {
    score += 30
  } else {
    // Partial: check skill overlap
    const sharedSkills = person.skills.filter((s) =>
      userInterests.some((ui) => {
        const cat = EXCHANGE_CATEGORIES.find((c) => c.id === ui)
        return cat && cat.label.toLowerCase().includes(s.toLowerCase())
      })
    )
    score += Math.min(15, sharedSkills.length * 5)
  }

  return Math.min(100, score)
}

/** Score an opportunity against user identity */
function scoreOpportunity(
  path: (typeof MOCK_VENTURE_PATHS)[0],
  userLangs: string[],
  userInterests: string[]
): number {
  let score = 25 // base

  // Tag overlap with interest categories (up to 40 pts)
  const interestLabels = userInterests
    .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => c!.label.toLowerCase())

  const tagMatches = path.tags.filter((tag) =>
    interestLabels.some(
      (il) => il.includes(tag.toLowerCase()) || tag.toLowerCase().includes(il.split(' ')[0])
    )
  )
  score += Math.min(40, tagMatches.length * 15)

  // Category match boost
  const catMatch = EXCHANGE_CATEGORIES.find((c) => {
    const catLower = c.label.toLowerCase()
    return (
      catLower.includes(path.category.toLowerCase()) ||
      path.category.toLowerCase().includes(c.id)
    )
  })
  if (catMatch && userInterests.includes(catMatch.id)) {
    score += 20
  }

  // Featured boost
  if (path.isFeatured) score += 10

  // Remote bonus
  if (path.isRemote) score += 5

  return Math.min(100, score)
}

// ─── Filter types ───────────────────────────────────────────────────

type TypeFilter = 'all' | 'people' | 'opportunities'

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangePage() {
  const router = useRouter()
  const { identity, hasCompletedDiscovery } = useIdentity()

  // Redirect if discovery not complete
  useEffect(() => {
    if (!hasCompletedDiscovery) {
      router.push('/')
    }
  }, [hasCompletedDiscovery, router])

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sectorFilter, setSectorFilter] = useState<string>('all')

  // Resolve user language codes → names for display matching
  const userLangNames = useMemo(
    () => identity.languages.map(langCodeToName),
    [identity.languages]
  )

  // Build scored feed items
  const feedItems = useMemo(() => {
    const items: { type: 'person' | 'opportunity'; data: ExchangeCardData; score: number }[] = []

    // Score people
    if (typeFilter !== 'opportunities') {
      for (const person of MOCK_EXCHANGE_PEOPLE) {
        const score = scorePerson(person, identity.languages, identity.interests)

        // Sector filter
        if (sectorFilter !== 'all') {
          const cat = EXCHANGE_CATEGORIES.find((c) => c.id === sectorFilter)
          if (cat && cat.label !== person.sector) continue
        }

        items.push({
          type: 'person',
          score,
          data: {
            id: person.id,
            title: person.name,
            subtitle: `${person.city}, ${COUNTRY_OPTIONS.find((c) => c.code === person.country)?.name ?? person.country}`,
            flag: person.flag,
            languages: person.languages,
            skills: person.skills,
            matchScore: score,
            mode: person.mode,
            sector: person.sector,
            sectorIcon: person.sectorIcon,
          },
        })
      }
    }

    // Score opportunities
    if (typeFilter !== 'people') {
      for (const path of MOCK_VENTURE_PATHS) {
        const score = scoreOpportunity(path, identity.languages, identity.interests)

        // Sector filter
        if (sectorFilter !== 'all') {
          const cat = EXCHANGE_CATEGORIES.find((c) => c.id === sectorFilter)
          if (cat) {
            const catLower = cat.label.toLowerCase()
            const pathCatLower = path.category.toLowerCase()
            const tagMatch = path.tags.some((t) => catLower.includes(t.toLowerCase()))
            if (!catLower.includes(pathCatLower) && !tagMatch) continue
          }
        }

        items.push({
          type: 'opportunity',
          score,
          data: {
            id: path.id,
            title: path.title,
            subtitle: `${path.anchorName} · ${path.location}`,
            flag: COUNTRY_OPTIONS.find((c) => c.code === path.country)?.flag,
            languages: [], // Opportunities don't have languages
            skills: path.tags,
            matchScore: score,
            sector: path.category,
            sectorIcon: path.icon,
          },
        })
      }
    }

    // Sort by score descending
    return items.sort((a, b) => b.score - a.score)
  }, [typeFilter, sectorFilter, identity.languages, identity.interests])

  // Don't render until identity is checked
  if (!hasCompletedDiscovery) {
    return null
  }

  return (
    <SectionLayout>
      {/* ── Header ── */}
      <div className="mb-phi-5">
        <Link
          href="/"
          className="mb-phi-3 inline-flex items-center gap-phi-1 text-phi-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <h1 className="text-phi-2xl font-bold gradient-text">Exchange</h1>
        <p className="mt-phi-1 text-phi-base text-white/60">
          Pioneers and Paths matched to your identity
        </p>
      </div>

      {/* ── Filter bar ── */}
      <div className="mb-phi-5 flex flex-col gap-phi-3 sm:flex-row sm:items-center">
        {/* Type filter pills */}
        <div className="flex gap-phi-2 overflow-x-auto pb-1">
          {(
            [
              { id: 'all', label: 'All', icon: Filter },
              { id: 'people', label: 'People', icon: Users },
              { id: 'opportunities', label: 'Paths', icon: Briefcase },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTypeFilter(id)}
              className={`flex items-center gap-phi-1 whitespace-nowrap rounded-full px-phi-3 py-phi-1 text-phi-sm font-medium transition-all ${
                typeFilter === id
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Sector dropdown */}
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-brand-surface px-phi-3 py-phi-2 text-phi-sm text-white outline-none focus:border-brand-accent/50"
        >
          <option value="all">All Sectors</option>
          {EXCHANGE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Results count ── */}
      <p className="mb-phi-3 text-phi-sm text-white/40">
        {feedItems.length} {feedItems.length === 1 ? 'result' : 'results'}
      </p>

      {/* ── Feed grid ── */}
      {feedItems.length > 0 ? (
        <div className="grid gap-phi-4 sm:grid-cols-2">
          {feedItems.map((item) => (
            <ExchangeCard
              key={`${item.type}-${item.data.id}`}
              type={item.type}
              data={item.data}
              userLanguages={userLangNames}
              userInterests={identity.interests}
            />
          ))}
        </div>
      ) : (
        <GlassCard padding="lg" className="text-center">
          <p className="text-phi-lg text-white/50">No matches found</p>
          <p className="mt-phi-1 text-phi-sm text-white/30">
            Try changing your filters or updating your interests
          </p>
        </GlassCard>
      )}
    </SectionLayout>
  )
}

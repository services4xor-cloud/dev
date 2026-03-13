'use client'

/**
 * ExchangeCard — Unified card for People + Opportunities in the Exchange feed
 *
 * Two visual variants, one component:
 *   - 'person': shows a Pioneer with Connect action
 *   - 'opportunity': shows a Path/Venture with View action
 *
 * Highlights shared languages and skills with accent color.
 */

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/ui/GlassCard'
import { useTranslation } from '@/lib/hooks/use-translation'
import { areSkillsEquivalent } from '@/lib/semantic-skills'

// ─── Types ──────────────────────────────────────────────────────────

export interface ExchangeCardData {
  id: string
  /** Name (person) or title (opportunity) */
  title: string
  /** Location (person) or posted by (opportunity) */
  subtitle: string
  /** Country flag emoji */
  flag?: string
  /** Languages they speak */
  languages: string[]
  /** Skills or interests */
  skills: string[]
  /** Match score 0-100 */
  matchScore: number
  /** Explorer or Host (people only) */
  mode?: 'explorer' | 'host'
  /** Exchange category label */
  sector?: string
  /** Exchange category icon */
  sectorIcon?: string
  /** ── Extended dimensions (connected to profile) ── */
  faith?: string[]
  reach?: string[]
  culture?: string
  interests?: string[]
  /** Optional dimension score breakdown from the matching engine */
  matchBreakdown?: {
    language: number
    craft: number
    passion: number
    location: number
    faith: number
    reach: number
    culture: number
    market: number
  }
}

interface ExchangeCardProps {
  type: 'person' | 'opportunity'
  data: ExchangeCardData
  /** Current user's languages — shared ones get accent highlight */
  userLanguages: string[]
  /** Current user's interests — shared ones get accent highlight */
  userInterests: string[]
  /** Current user's country name — for "same country" match reason */
  userCountryName?: string
  onAction?: () => void
}

// ─── Helpers ────────────────────────────────────────────────────────

const DIMENSION_ICONS: Record<string, string> = {
  language: '\u{1F5E3}',
  craft: '\u{1F527}',
  passion: '\u2764\uFE0F',
  location: '\u{1F4CD}',
  faith: '\u{1F64F}',
  reach: '\u{1F310}',
  culture: '\u{1F33F}',
  market: '\u{1F4CA}',
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-brand-accent'
  if (score >= 40) return 'text-white/70'
  return 'text-white/40'
}

function getScoreLabel(score: number, t: (key: string) => string): string {
  if (score >= 80) return t('exchange.card.scorePerfect')
  if (score >= 60) return t('exchange.card.scoreStrong')
  if (score >= 40) return t('exchange.card.scoreGood')
  return t('exchange.card.scorePossible')
}

// ─── Component ──────────────────────────────────────────────────────

export default function ExchangeCard({
  type,
  data,
  userLanguages,
  userInterests,
  userCountryName,
  onAction,
}: ExchangeCardProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const sharedLangs = data.languages.filter((lang) =>
    userLanguages.some((ul) => ul.toLowerCase() === lang.toLowerCase())
  )
  const isSharedLang = (lang: string) =>
    userLanguages.some((ul) => ul.toLowerCase() === lang.toLowerCase())

  const isSharedSkill = (skill: string) =>
    userInterests.some((ui) => areSkillsEquivalent(ui, skill))
  const sharedSkills = data.skills.filter(isSharedSkill)

  // Build "why you match" reasons (for both person and opportunity cards)
  const matchReasons: string[] = []
  if (sharedLangs.length > 0)
    matchReasons.push(
      `🗣 ${sharedLangs.length} ${sharedLangs.length > 1 ? t('exchange.card.sharedLanguages') : t('exchange.card.sharedLanguage')}`
    )
  if (sharedSkills.length > 0)
    matchReasons.push(
      `🔧 ${sharedSkills.length} ${sharedSkills.length > 1 ? t('exchange.card.commonSkills') : t('exchange.card.commonSkill')}`
    )
  if (data.matchScore >= 80) matchReasons.push(`⚡ ${t('exchange.card.highCompatibility')}`)
  if (type === 'person' && userCountryName && data.subtitle.includes(userCountryName)) {
    matchReasons.push(`📍 ${t('exchange.card.sameCountry')}`)
  }

  return (
    <Link href={`/exchange/${data.id}`} className="block h-full">
      <GlassCard
        hover
        padding="md"
        className="group cursor-pointer transition-all duration-300 hover:shadow-brand-accent/10 hover:shadow-lg h-full flex flex-col"
      >
        {/* ── Header: Type badge + Online indicator + Match score ── */}
        <div className="mb-phi-3 flex items-center justify-between">
          <div className="flex items-center gap-phi-2">
            {type === 'person' && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            )}
            <span
              className={`rounded-full px-phi-2 py-0.5 text-phi-xs font-medium ${
                type === 'person'
                  ? 'bg-brand-primary/30 text-white'
                  : 'border border-brand-accent/30 text-brand-accent'
              }`}
            >
              {type === 'person' ? t('exchange.card.pioneer') : t('exchange.card.path')}
            </span>
            {data.mode && type === 'person' && (
              <span className="rounded-full bg-white/10 px-phi-2 py-0.5 text-phi-xs text-white/60">
                {data.mode === 'explorer' ? t('exchange.card.explorer') : t('exchange.card.host')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Score bar */}
            <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${data.matchScore}%`,
                  background:
                    data.matchScore >= 80
                      ? '#22c55e'
                      : data.matchScore >= 60
                        ? '#C9A227'
                        : 'rgba(255,255,255,0.3)',
                }}
              />
            </div>
            <span className={`text-phi-sm font-bold ${getScoreColor(data.matchScore)}`}>
              {data.matchScore}%
            </span>
          </div>
        </div>

        {/* ── Dimension breakdown (top 3 scoring dimensions) ── */}
        {data.matchBreakdown && (
          <div className="flex flex-wrap gap-1 mt-1 mb-phi-2">
            {Object.entries(data.matchBreakdown)
              .filter(([, v]) => v > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([key, value]) => (
                <span key={key} className="text-[9px] text-white/30">
                  {DIMENSION_ICONS[key]}
                  {value}
                </span>
              ))}
          </div>
        )}

        {/* ── Title + Subtitle ── */}
        <div className="mb-phi-2">
          <h3 className="text-phi-lg font-semibold text-white group-hover:text-brand-accent transition-colors">
            {data.flag && <span className="mr-phi-1">{data.flag}</span>}
            {data.title}
          </h3>
          <p className="mt-0.5 text-phi-sm text-white/50">{data.subtitle}</p>
        </div>

        {/* ── Why you match ── */}
        {matchReasons.length > 0 && (
          <div className="mb-phi-2 flex flex-wrap gap-1.5">
            {matchReasons.map((reason) => (
              <span
                key={reason}
                className="rounded-full px-2 py-0.5 text-[10px] bg-brand-accent/8 text-brand-accent/80 border border-brand-accent/15"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* ── Sector ── */}
        {data.sector && (
          <div className="mb-phi-2 flex items-center gap-phi-1 text-phi-xs text-white/40">
            {data.sectorIcon && <span>{data.sectorIcon}</span>}
            <span>{data.sector}</span>
          </div>
        )}

        {/* ── Languages row ── */}
        {data.languages.length > 0 && (
          <div className="mb-phi-2">
            <p className="mb-1 text-phi-xs text-white/30">{t('exchange.card.languages')}</p>
            <div className="flex flex-wrap gap-1">
              {data.languages.map((lang) => (
                <span
                  key={lang}
                  className={`rounded-full px-phi-2 py-0.5 text-phi-xs ${
                    isSharedLang(lang)
                      ? 'border border-brand-accent/50 bg-brand-accent/10 text-brand-accent font-medium'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {isSharedLang(lang) ? `✓ ${lang}` : lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Skills/Interests row ── */}
        {data.skills.length > 0 && (
          <div className="mb-phi-3">
            <p className="mb-1 text-phi-xs text-white/30">
              {type === 'person' ? t('exchange.card.craft') : t('exchange.card.skillsNeeded')}
            </p>
            <div className="flex flex-wrap gap-1">
              {data.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className={`rounded-full px-phi-2 py-0.5 text-phi-xs ${
                    isSharedSkill(skill)
                      ? 'border border-brand-accent/50 bg-brand-accent/10 text-brand-accent font-medium'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {isSharedSkill(skill) ? `✓ ${skill}` : skill}
                </span>
              ))}
              {data.skills.length > 5 && (
                <span className="rounded-full bg-white/5 px-phi-2 py-0.5 text-phi-xs text-white/30">
                  +{data.skills.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Extended dimensions (person cards only, when data present) ── */}
        {type === 'person' &&
        (data.faith?.length || data.reach?.length || data.culture || data.interests?.length) ? (
          <div className="mb-phi-3 flex flex-wrap gap-1.5">
            {data.culture && (
              <span className="rounded-full px-phi-2 py-0.5 text-[10px] bg-white/5 text-white/50">
                🌍 {data.culture}
              </span>
            )}
            {data.faith?.map((f) => (
              <span
                key={f}
                className="rounded-full px-phi-2 py-0.5 text-[10px] bg-white/5 text-white/50"
              >
                🙏 {f}
              </span>
            ))}
            {data.reach?.map((r) => (
              <span
                key={r}
                className="rounded-full px-phi-2 py-0.5 text-[10px] bg-white/5 text-white/50"
              >
                🌐 {r}
              </span>
            ))}
            {data.interests?.slice(0, 3).map((i) => (
              <span
                key={i}
                className="rounded-full px-phi-2 py-0.5 text-[10px] bg-white/5 text-white/50"
              >
                ❤️ {i}
              </span>
            ))}
          </div>
        ) : null}

        {/* Spacer pushes action button to bottom for equal-height cards */}
        <div className="flex-grow" />

        {/* ── Action button ── */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (type === 'person') {
              router.push(`/messages?dm=${data.id}`)
            } else {
              onAction?.()
            }
          }}
          className={`w-full rounded-lg py-phi-2 text-phi-sm font-medium transition-all ${
            type === 'person'
              ? 'bg-brand-primary text-white hover:bg-brand-primary/80'
              : 'border border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10'
          }`}
        >
          {type === 'person' ? t('exchange.card.connectChat') : t('exchange.card.viewPath')}
        </button>
      </GlassCard>
    </Link>
  )
}

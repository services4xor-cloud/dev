'use client'

/**
 * Venture Detail — Path detail page + "Open Chapter" action
 *
 * Fetches real path data from /api/paths/[id] (Prisma → Neon PostgreSQL).
 * Shows description, skills, salary, and "Open Chapter" CTA.
 */

import { useState, useEffect } from 'react'
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
import StatusBadge from '@/components/StatusBadge'
import { useTranslation } from '@/lib/hooks/use-translation'

// ─── DB Path type ─────────────────────────────────────────────────────────────

interface DbPath {
  id: string
  title: string
  company: string
  description: string
  location: string
  country: string
  isRemote: boolean
  skills: string[]
  sector: string | null
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  status: string
  tier: string
  pathType: string
  createdAt: string
  anchor?: { name: string | null; email: string; country: string; avatarUrl: string | null }
  _count?: { chapters: number; savedBy: number }
}

function sectorIcon(sector: string | null): string {
  switch (sector) {
    case 'tech':
      return '💻'
    case 'healthcare':
      return '🏥'
    case 'safari':
      return '🦁'
    case 'hospitality':
      return '🏨'
    case 'finance':
      return '💰'
    case 'agriculture':
      return '🌾'
    default:
      return '📡'
  }
}

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return 'Competitive'
  const fmt = (n: number) => n.toLocaleString()
  if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`
  if (min) return `${currency} ${fmt(min)}+`
  return `${currency} up to ${fmt(max!)}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VentureDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const pathId = params.id as string
  const [chapterOpened, setChapterOpened] = useState(false)
  const [path, setPath] = useState<DbPath | null>(null)
  const [similarPaths, setSimilarPaths] = useState<DbPath[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch path from real DB
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/paths/${pathId}`)
        const data = await res.json()
        if (data.success && data.path) {
          setPath(data.path)
          // Fetch similar paths (same sector)
          const sector = data.path.sector
          const simRes = await fetch(
            `/api/paths?limit=4&status=OPEN${sector ? `&sector=${sector}` : ''}`
          )
          const simData = await simRes.json()
          if (simData.paths) {
            setSimilarPaths(simData.paths.filter((p: DbPath) => p.id !== pathId).slice(0, 3))
          }
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [pathId])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🧭</div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('venture.notFoundTitle')}</h1>
          <p className="text-gray-400 mb-6">{t('venture.notFoundDesc')}</p>
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('venture.browseAll')}
          </Link>
        </div>
      </div>
    )
  }

  const anchorName = path.anchor?.name || path.company
  const salary = formatSalary(path.salaryMin, path.salaryMax, path.currency)
  const posted = timeAgo(path.createdAt)
  const chaptersCount = path._count?.chapters ?? 0
  const icon = sectorIcon(path.sector)

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
            {t('venture.backToVentures')}
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
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white">{path.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {anchorName}
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
                          {t('venture.remoteOk')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={path.status === 'OPEN' ? 'open' : 'closed'} />
                {path.sector && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {path.sector}
                  </span>
                )}
                {path.pathType && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {path.pathType.replace('_', ' ')}
                  </span>
                )}
                {path.skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-white font-semibold mb-3">{t('venture.aboutPath')}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {path.description}
              </p>
            </section>

            {/* Skills Required */}
            {path.skills.length > 0 && (
              <section>
                <h2 className="text-white font-semibold mb-3">{t('venture.requirements')}</h2>
                <ul className="space-y-2">
                  {path.skills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-gray-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ── Right column: Action card (sticky) ──────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Summary card */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-5">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{t('venture.compensation')}</div>
                  <div className="text-xl font-bold text-white">{salary}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">{t('venture.posted')}</div>
                    <div className="flex items-center gap-1 text-sm text-white">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {posted}
                    </div>
                  </div>
                  {chaptersCount > 0 && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">{VOCAB.chapter.plural}</div>
                      <div className="flex items-center gap-1 text-sm text-white">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        {chaptersCount}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="text-xs text-gray-400 mb-1">{t('venture.anchor')}</div>
                  <div className="text-sm text-white font-medium">{anchorName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{path.location}</div>
                </div>

                {/* CTA — Open Chapter */}
                {chapterOpened ? (
                  <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-semibold text-sm">
                      {t('venture.chapterOpened')}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{t('venture.chapterReview')}</p>
                    <Link
                      href="/pioneers/dashboard"
                      className="inline-block mt-3 text-brand-accent text-xs hover:underline"
                    >
                      {t('venture.goToDashboard')}
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
                  {t('venture.chapterNote', {
                    chapter: VOCAB.chapter.singular,
                    anchor: VOCAB.anchor.singular,
                  })}
                </p>
              </div>

              {/* Similar paths */}
              {similarPaths.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-3">
                    {t('venture.similarPaths')}
                  </h3>
                  <div className="space-y-3">
                    {similarPaths.map((p) => (
                      <Link
                        key={p.id}
                        href={`/ventures/${p.id}`}
                        className="flex items-start gap-2 group"
                      >
                        <span className="text-lg flex-shrink-0">{sectorIcon(p.sector)}</span>
                        <div className="min-w-0">
                          <div className="text-sm text-white group-hover:text-brand-accent transition-colors font-medium truncate">
                            {p.title}
                          </div>
                          <div className="text-xs text-gray-400">{p.anchor?.name || p.company}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

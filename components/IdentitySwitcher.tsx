'use client'

/**
 * IdentitySwitcher — Reusable identity dropdown panel
 *
 * Shows threads in tabbed categories (Countries, Tribes, Languages, Faith, Paths).
 * When a thread is selected, it updates the global identity context:
 *   - Country threads → setCountry()
 *   - Language threads → setLanguage() + setCountry() via mapping
 *   - Tribe threads → setCountry() via mapping + setThread()
 *   - Other threads → setThread()
 *
 * Used in: Nav (logo dropdown), Homepage hero (logo dropdown)
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { ThreadType, Thread } from '@/lib/threads'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { useThreads } from '@/lib/hooks/use-threads'
import { useIdentity } from '@/lib/identity-context'

// ─── Identity Tab Configuration ──────────────────────────────────────
// Each tab maps to one or more ThreadType values from the data.
// Content is dynamic — only tabs with threads are shown.
export const IDENTITY_TABS: { types: ThreadType[]; label: string; icon: string }[] = [
  { types: ['country'], label: 'Countries', icon: '🌍' },
  { types: ['tribe'], label: 'Tribes', icon: '🏛️' },
  { types: ['language'], label: 'Languages', icon: '🗣️' },
  { types: ['religion'], label: 'Faith', icon: '🕊️' },
  { types: ['interest', 'science', 'location'], label: 'Paths', icon: '⭐' },
]

// Language → Country mapping: selecting a language also sets the primary country
const LANGUAGE_COUNTRY_MAP: Record<string, string> = {
  sw: 'KE',
  swahili: 'KE',
  de: 'DE',
  deutsch: 'DE',
  german: 'DE',
  fr: 'FR',
  french: 'FR',
  français: 'FR',
  en: 'GB',
  english: 'GB',
  ar: 'AE',
  arabic: 'AE',
  hi: 'IN',
  hindi: 'IN',
  zu: 'ZA',
  zulu: 'ZA',
  ha: 'NG',
  hausa: 'NG',
  yo: 'NG',
  yoruba: 'NG',
  lg: 'UG',
  luganda: 'UG',
  zh: 'CN',
  chinese: 'CN',
  es: 'ES',
  spanish: 'ES',
  pt: 'BR',
  portuguese: 'BR',
  ru: 'RU',
  russian: 'RU',
  ja: 'JP',
  japanese: 'JP',
  ko: 'KR',
  korean: 'KR',
  tr: 'TR',
  turkish: 'TR',
  id: 'ID',
  bahasa: 'ID',
}

// Tribe → Country mapping: selecting a tribe sets the associated country
const TRIBE_COUNTRY_MAP: Record<string, string> = {
  maasai: 'KE',
  kikuyu: 'KE',
  luo: 'KE',
  bavarian: 'DE',
  swabian: 'DE',
  schwaben: 'DE',
  berliner: 'DE',
  romand: 'CH',
  'alemannic-swiss': 'CH',
  alemannisch: 'CH',
  yoruba: 'NG',
  igbo: 'NG',
}

/** Get the URL for a thread */
function getThreadUrl(thread: { type: ThreadType; slug: string }): string {
  if (thread.type === 'country') return `/be/${thread.slug}`
  return `/threads/${thread.slug}`
}

// ─── Props ──────────────────────────────────────────────────────────
interface IdentitySwitcherProps {
  /** Whether the panel is currently open */
  open: boolean
  /** Callback to close the panel */
  onClose: () => void
  /** Callback when a thread is hovered (for logo preview in Nav) */
  onHoverThread?: (thread: { icon: string; brandName: string } | null) => void
  /** Additional CSS classes for the container */
  className?: string
  /** Width class override */
  widthClass?: string
}

export default function IdentitySwitcher({
  open,
  onClose,
  onHoverThread,
  className = '',
  widthClass = 'w-[calc(100vw-2rem)] sm:w-96 max-w-[24rem]',
}: IdentitySwitcherProps) {
  const [tabIdx, setTabIdx] = useState(0)
  const { threads: navThreads } = useThreads()
  const { identity, setCountry, setLanguage, setThread } = useIdentity()

  if (!open) return null

  const handleSelect = (thread: Thread) => {
    // Every selection updates the full identity context
    if (thread.type === 'country') {
      const match = COUNTRY_OPTIONS.find(
        (c) =>
          c.name.toLowerCase() === thread.slug.toLowerCase() ||
          c.code.toLowerCase() === thread.slug.toLowerCase()
      )
      if (match) setCountry(match.code)
    } else if (thread.type === 'language') {
      // Language = Country: selecting Deutsch → sets DE
      const langCode = thread.slug.length <= 3 ? thread.slug : thread.slug.slice(0, 2)
      setLanguage(langCode)
      const mappedCountry = LANGUAGE_COUNTRY_MAP[thread.slug]
      if (mappedCountry) setCountry(mappedCountry)
      setThread(thread.slug, thread.type, thread.brandName)
    } else if (thread.type === 'tribe') {
      // Tribe → sets associated country too
      const mappedCountry = TRIBE_COUNTRY_MAP[thread.slug]
      if (mappedCountry) setCountry(mappedCountry)
      setThread(thread.slug, thread.type, thread.brandName)
    } else {
      setThread(thread.slug, thread.type, thread.brandName)
    }
    onClose()
    onHoverThread?.(null)
  }

  return (
    <div
      role="menu"
      data-testid="identity-switcher"
      className={`${widthClass} rounded-xl bg-[#16161e] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden ${className}`}
    >
      {/* Tab row */}
      <div className="flex gap-0.5 px-2 pt-2 pb-1 overflow-x-auto scrollbar-hide border-b border-white/5">
        {IDENTITY_TABS.map((tab, idx) => {
          const count = navThreads.filter((t) => tab.types.includes(t.type) && t.active).length
          if (count === 0) return null
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setTabIdx(idx)}
              data-testid={`identity-tab-${tab.label.toLowerCase()}`}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors duration-150 ${
                tabIdx === idx
                  ? 'bg-brand-accent/15 text-brand-accent'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Thread list — sorted by relevance to active identity */}
      <div className="max-h-64 overflow-y-auto overscroll-contain py-1.5 px-1.5">
        {navThreads
          .filter((t) => IDENTITY_TABS[tabIdx]?.types.includes(t.type) && t.active)
          .sort((a, b) => {
            // Threads matching active country appear first
            const aMatch = a.countries?.includes(identity.country) ? 1 : 0
            const bMatch = b.countries?.includes(identity.country) ? 1 : 0
            if (aMatch !== bMatch) return bMatch - aMatch
            return b.memberCount - a.memberCount
          })
          .map((thread) => (
            <Link
              key={thread.slug}
              href={getThreadUrl(thread)}
              role="menuitem"
              data-testid={`identity-thread-${thread.slug}`}
              onClick={() => handleSelect(thread)}
              onMouseEnter={() =>
                onHoverThread?.({ icon: thread.icon, brandName: thread.brandName })
              }
              onMouseLeave={() => onHoverThread?.(null)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                       hover:bg-white/8 group/item"
            >
              <span className="text-lg shrink-0">{thread.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white group-hover/item:text-brand-accent transition-colors truncate">
                    {thread.brandName}
                  </span>
                  {(thread.slug === identity.country.toLowerCase() ||
                    thread.slug === identity.threadSlug) && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/40 truncate mt-0.5">
                  {thread.memberCount.toLocaleString()} pioneers · {thread.tagline.slice(0, 50)}
                </p>
              </div>
            </Link>
          ))}
      </div>

      {/* Footer — Browse all + Home link */}
      <div className="border-t border-white/5 px-3 py-2 flex items-center justify-between">
        <Link
          href="/threads"
          onClick={onClose}
          className="text-[11px] font-medium text-brand-accent/70 hover:text-brand-accent transition-colors"
        >
          Browse all threads →
        </Link>
        <Link
          href="/"
          onClick={onClose}
          className="text-[11px] font-medium text-white/30 hover:text-white/60 transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  )
}

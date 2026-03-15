'use client'

import { useState, useEffect, useCallback } from 'react'
import AgentChat from '@/components/AgentChat'
import DimensionOverlapBar from '@/components/DimensionOverlapBar'
import type { AgentDimensions } from '@/types/domain'
import type { ActiveFilter } from '@/components/DimensionFilters'

/** Greeting in user's browser language */
const GREETINGS: Record<string, string> = {
  en: 'Hello',
  de: 'Hallo',
  fr: 'Bonjour',
  es: 'Hola',
  pt: 'Olá',
  it: 'Ciao',
  nl: 'Hallo',
  pl: 'Cześć',
  ru: 'Привет',
  uk: 'Привіт',
  ja: 'こんにちは',
  ko: '안녕하세요',
  zh: '你好',
  ar: 'مرحبا',
  hi: 'नमस्ते',
  sw: 'Habari',
  tr: 'Merhaba',
  th: 'สวัสดี',
  vi: 'Xin chào',
  id: 'Halo',
  ms: 'Halo',
  ro: 'Bună',
  cs: 'Ahoj',
  hu: 'Szia',
  sv: 'Hej',
  no: 'Hei',
  da: 'Hej',
  fi: 'Hei',
  el: 'Γεια σου',
  he: 'שלום',
  bn: 'হ্যালো',
  ta: 'வணக்கம்',
  te: 'హలో',
  fa: 'سلام',
}

function getBrowserGreeting(): string {
  if (typeof navigator === 'undefined') return GREETINGS.en
  const lang = navigator.language?.slice(0, 2)?.toLowerCase()
  return GREETINGS[lang] ?? GREETINGS.en
}

export default function AgentPage() {
  const [filters, setFilters] = useState<ActiveFilter[]>([])
  const [focusedValue, setFocusedValue] = useState<string | null>(null)
  const [focusHint, setFocusHint] = useState<string | null>(null)
  const [greeting, setGreeting] = useState('Hello')

  // Detect browser language on mount
  useEffect(() => {
    setGreeting(getBrowserGreeting())
  }, [])

  // Load active filters from sessionStorage (set by map page)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bex-map-filters')
      if (raw) setFilters(JSON.parse(raw) as ActiveFilter[])
    } catch {
      // ignore
    }
  }, [])

  // Re-read filters when overlap bar syncs changes
  useEffect(() => {
    function onStorage() {
      try {
        const raw = sessionStorage.getItem('bex-map-filters')
        if (raw) setFilters(JSON.parse(raw) as ActiveFilter[])
        else setFilters([])
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', onStorage)
    // Also listen for custom event from same-page sync
    window.addEventListener('bex-filters-changed', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('bex-filters-changed', onStorage)
    }
  }, [])

  // Convert filters to AgentDimensions for the chat
  const dimensions: AgentDimensions = {}
  for (const f of filters) {
    if (f.dimension === 'language') dimensions.language = f.nodeCode
    if (f.dimension === 'faith') dimensions.faith = f.nodeCode
    if (f.dimension === 'sector') dimensions.sector = f.nodeCode
    if (f.dimension === 'culture') dimensions.culture = f.nodeCode
  }
  // Fallback country from map selection
  if (!dimensions.country) {
    const selected =
      typeof window !== 'undefined' ? sessionStorage.getItem('bex-map-selected') : null
    if (selected) dimensions.country = selected
  }

  // Focus handler — clicking a dimension chip primes the agent conversation
  const handleDimensionClick = useCallback(
    (dimension: string, value: string) => {
      const key = `${dimension}:${value}`
      if (focusedValue === key) {
        // Toggle off
        setFocusedValue(null)
        setFocusHint(null)
      } else {
        setFocusedValue(key)
        // Find the label for this value from filters
        const match = filters.find((f) => f.dimension === dimension && f.nodeCode === value)
        const label = match?.label ?? value
        const dimLabel =
          dimension === 'language'
            ? 'language'
            : dimension === 'sector'
              ? 'sector'
              : dimension === 'faith'
                ? 'faith'
                : 'currency'
        setFocusHint(`Focus on ${label} (${dimLabel}) connections`)
      }
    },
    [focusedValue, filters]
  )

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">{greeting} — Be[X] Agent</h1>
            <p className="text-sm text-brand-text-muted">
              AI persona shaped by your dimension crossings
            </p>
          </div>
          <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
            &larr; Map
          </a>
        </div>
      </header>

      {/* Dimension overlap context bar */}
      <DimensionOverlapBar onDimensionClick={handleDimensionClick} focusedValue={focusedValue} />

      {/* Focus hint banner */}
      {focusHint && (
        <div className="border-b border-brand-accent/10 bg-brand-accent/5 px-6 py-1.5">
          <div className="mx-auto max-w-2xl text-xs text-brand-accent/80">{focusHint}</div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-4">
        <AgentChat dimensions={dimensions} />
      </main>
    </div>
  )
}

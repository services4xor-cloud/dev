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

  // Convert ALL filters to AgentDimensions — pass everything for rich context
  const dimensions: AgentDimensions = {}
  const allDimValues: Record<string, string[]> = {}
  for (const f of filters) {
    const dim = f.dimension
    if (!allDimValues[dim]) allDimValues[dim] = []
    const label = f.label ?? f.nodeCode
    if (!allDimValues[dim].includes(label)) allDimValues[dim].push(label)
    // Set primary (first encountered) for graph lookup
    if (dim === 'language' && !dimensions.language) dimensions.language = f.nodeCode
    if (dim === 'faith' && !dimensions.faith) dimensions.faith = f.nodeCode
    if (dim === 'sector' && !dimensions.sector) dimensions.sector = f.nodeCode
    if (dim === 'currency' && !dimensions.currency) dimensions.currency = f.nodeCode
    if (dim === 'culture' && !dimensions.culture) dimensions.culture = f.nodeCode
  }
  // Enriched countries from map
  let enrichedCountries: string[] = []
  try {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem('bex-map-enriched') : null
    if (raw) enrichedCountries = JSON.parse(raw) as string[]
  } catch {
    /* ignore */
  }
  // Pass first country for graph lookup
  if (!dimensions.country && enrichedCountries.length > 0) {
    dimensions.country = enrichedCountries[0]
  }
  // Fallback country from map selection
  if (!dimensions.country) {
    const selected =
      typeof window !== 'undefined' ? sessionStorage.getItem('bex-map-selected') : null
    if (selected) dimensions.country = selected
  }
  // Attach extra context for the prompt builder
  const enrichedContext = {
    countries: enrichedCountries,
    allValues: allDimValues,
    customChips: filters
      .filter((f) => f.source === 'custom')
      .map((f) => ({
        dimension: f.dimension,
        label: f.label ?? f.nodeCode,
      })),
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
        <AgentChat dimensions={dimensions} enrichedContext={enrichedContext} />
      </main>
    </div>
  )
}

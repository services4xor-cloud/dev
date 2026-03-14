'use client'

import { useState, useEffect } from 'react'
import AgentChat from '@/components/AgentChat'
import type { AgentDimensions } from '@/types/domain'
import type { ActiveFilter } from '@/components/DimensionFilters'

export default function AgentPage() {
  const [filters, setFilters] = useState<ActiveFilter[]>([])

  // Load active filters from sessionStorage (set by map page)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('bex-map-filters')
      if (raw) setFilters(JSON.parse(raw) as ActiveFilter[])
    } catch {
      // ignore
    }
  }, [])

  // Convert filters to AgentDimensions for the chat
  const dimensions: AgentDimensions = {}
  for (const f of filters) {
    if (f.dimension === 'language') dimensions.language = f.nodeCode
    if (f.dimension === 'location') dimensions.country = f.nodeCode.toUpperCase()
    if (f.dimension === 'faith') dimensions.faith = f.nodeCode
    if (f.dimension === 'sector') dimensions.sector = f.nodeCode
    if (f.dimension === 'culture') dimensions.culture = f.nodeCode
  }
  // Fallback if no location selected
  if (!dimensions.country) {
    const selected =
      typeof window !== 'undefined' ? sessionStorage.getItem('bex-map-selected') : null
    if (selected) dimensions.country = selected
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">Be[X] Agent</h1>
            <p className="text-sm text-brand-text-muted">
              AI persona shaped by your dimension crossings
            </p>
          </div>
          <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
            ← Map
          </a>
        </div>
      </header>

      {/* Active context bar — shows what dimensions shape this agent */}
      {filters.length > 0 && (
        <div className="border-b border-brand-accent/5 bg-brand-surface/50 px-6 py-2">
          <div className="mx-auto flex max-w-2xl flex-wrap gap-1.5">
            {filters.map((f) => (
              <span
                key={f.dimension}
                className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs text-brand-accent"
              >
                {f.icon ?? '◆'} {f.label ?? f.nodeCode}
              </span>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-4">
        <AgentChat dimensions={dimensions} />
      </main>
    </div>
  )
}

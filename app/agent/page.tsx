'use client'

import { useState } from 'react'
import AgentChat from '@/components/AgentChat'
import type { AgentDimensions } from '@/types/domain'

export default function AgentPage() {
  const [dimensions] = useState<AgentDimensions>({
    country: 'KE',
    language: 'en',
  })

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">Be[X] Agent</h1>
            <p className="text-sm text-brand-text-muted">
              Chat with an AI persona shaped by dimension crossings
            </p>
          </div>
          <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
            ← Map
          </a>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-4">
        <AgentChat dimensions={dimensions} />
      </main>
    </div>
  )
}

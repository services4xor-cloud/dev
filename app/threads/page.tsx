'use client'

/**
 * Threads — Identity-based community directory
 *
 * Browse all Be[X] threads: countries, tribes, languages, interests,
 * sciences, locations. Each thread is a community with its own
 * curated Ventures feed and identity Gate.
 *
 * KISS: filter chips + grid of thread cards. No over-engineering.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Users, Search, Database } from 'lucide-react'
import { useThreads } from '@/lib/hooks/use-threads'
import type { ThreadType } from '@/lib/threads'

// ─── Filter config ───────────────────────────────────────────────────────────

const TYPE_FILTERS: { id: ThreadType | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🌍' },
  { id: 'country', label: 'Countries', icon: '🏳️' },
  { id: 'tribe', label: 'Tribes', icon: '🦁' },
  { id: 'language', label: 'Languages', icon: '🗣️' },
  { id: 'interest', label: 'Interests', icon: '💡' },
  { id: 'science', label: 'Sciences', icon: '🔬' },
  { id: 'location', label: 'Locations', icon: '📍' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ThreadsPage() {
  const [filter, setFilter] = useState<ThreadType | 'all'>('all')
  const [search, setSearch] = useState('')

  // Fetch from API with mock fallback
  const { threads: allThreads, loading: threadsLoading, fromDB } = useThreads()

  const filtered = allThreads.filter((t) => {
    if (filter !== 'all' && t.type !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        t.name.toLowerCase().includes(q) ||
        t.brandName.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section
        className="pt-16 pb-10 px-4 text-center"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 65%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Be<span className="text-brand-accent">[You]</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Find your people. Every identity — country, tribe, language, interest — has a thread.
            Join communities that move, work, and thrive together.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search threads..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-900/60 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Thread grid */}
      <div className="max-w-6xl mx-auto px-4 xl:px-8 pb-20">
        {/* Data source indicator */}
        {fromDB && !threadsLoading && (
          <div className="flex items-center gap-1.5 text-[10px] text-green-400/60 mb-4">
            <Database className="w-3 h-3" /> Live data · {allThreads.length} threads
          </div>
        )}

        {/* Loading skeleton */}
        {threadsLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5 h-32"
              />
            ))}
          </div>
        )}

        {!threadsLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>No threads match your search. Try a different term.</p>
          </div>
        )}

        {!threadsLoading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((thread) => (
              <Link
                key={thread.slug}
                href={`/threads/${thread.slug}`}
                className="group bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-brand-accent/40 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{thread.icon}</span>
                    <div>
                      <div className="text-white font-bold group-hover:text-brand-accent transition-colors">
                        {thread.brandName}
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{thread.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3" />
                    {thread.memberCount.toLocaleString()}
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{thread.tagline}</p>
                {thread.relatedThreads && thread.relatedThreads.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {thread.relatedThreads.slice(0, 3).map((slug) => {
                      const related = allThreads.find((t) => t.slug === slug)
                      return related ? (
                        <span
                          key={slug}
                          className="text-[10px] px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full"
                        >
                          {related.icon} {related.name}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

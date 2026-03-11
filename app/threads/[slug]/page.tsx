'use client'

/**
 * Thread Detail — Identity Gate for any Be[X] thread
 *
 * Same component renders BeKenya, BeMaasai, BeSwahili, BeTech, etc.
 * Shows thread info, member count, related threads, and links to
 * curated Ventures. Adding a new thread = adding data, not code.
 */

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Compass, ArrowRight, Database } from 'lucide-react'
import { useThread, useThreads } from '@/lib/hooks/use-threads'
import { usePaths } from '@/lib/hooks/use-paths'

// ─── Thread type → color mapping ─────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  country: 'from-brand-primary to-green-900/80',
  tribe: 'from-brand-primary to-brand-primary-light',
  language: 'from-blue-900/80 to-brand-primary',
  interest: 'from-purple-900/80 to-brand-primary',
  religion: 'from-brand-primary to-indigo-900/80',
  science: 'from-teal-900/80 to-brand-primary',
  location: 'from-brand-primary to-emerald-900/80',
}

export default function ThreadDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [joined, setJoined] = useState(false)

  // Fetch from API with mock fallback
  const { thread, loading: threadLoading, fromDB } = useThread(slug)
  const { threads: allThreads } = useThreads()
  const { paths: communityPaths } = usePaths({ limit: 3 })

  if (threadLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-48 bg-gray-800/60 rounded-2xl" />
          <div className="h-6 w-48 bg-gray-800/40 rounded" />
          <div className="h-4 w-full bg-gray-800/30 rounded" />
          <div className="h-4 w-2/3 bg-gray-800/20 rounded" />
        </div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Thread Not Found</h1>
          <p className="text-gray-400 mb-6">This community doesn&apos;t exist yet.</p>
          <Link
            href="/threads"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Threads
          </Link>
        </div>
      </div>
    )
  }

  // Derive related + child threads from allThreads
  const relatedThreads = (thread.relatedThreads ?? [])
    .map((s) => allThreads.find((t) => t.slug === s))
    .filter(Boolean) as typeof allThreads
  const childThreads = allThreads.filter((t) => t.parentThread === slug && t.active)
  const gradientClass = TYPE_COLORS[thread.type] ?? 'from-brand-primary to-brand-bg'

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${gradientClass} relative`}>
        <div className="max-w-6xl mx-auto px-4 xl:px-8 pt-8 pb-16">
          {/* Back */}
          <Link
            href="/threads"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Threads
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="text-7xl">{thread.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{thread.brandName}</h1>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 capitalize border border-white/20">
                  {thread.type}
                </span>
              </div>
              <p className="text-white/80 text-lg mb-4">{thread.tagline}</p>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {thread.memberCount.toLocaleString()} Pioneers
                </span>
                {thread.countries.length > 0 && <span>{thread.countries.join(', ')}</span>}
              </div>
            </div>
            <button
              onClick={() => setJoined(!joined)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-colors flex-shrink-0 ${
                joined
                  ? 'bg-green-900/50 text-green-400 border border-green-700/50'
                  : 'bg-brand-accent text-white hover:opacity-90'
              }`}
            >
              {joined ? '✓ Joined' : 'Join Thread'}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 xl:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-white font-semibold mb-3">About {thread.brandName}</h2>
              <p className="text-gray-300 leading-relaxed">{thread.description}</p>
            </section>

            {/* Child threads (e.g. tribes within Kenya) */}
            {childThreads.length > 0 && (
              <section>
                <h2 className="text-white font-semibold mb-3">Communities within {thread.name}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {childThreads.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/threads/${child.slug}`}
                      className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-brand-accent/40 transition-colors group"
                    >
                      <span className="text-2xl">{child.icon}</span>
                      <div>
                        <div className="text-white font-medium text-sm group-hover:text-brand-accent transition-colors">
                          {child.brandName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {child.memberCount.toLocaleString()} Pioneers
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Community picks — paths relevant to this thread */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">Paths in {thread.name}</h2>
                <Link
                  href="/ventures"
                  className="text-brand-accent text-sm hover:underline flex items-center gap-1"
                >
                  See all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {communityPaths.map((path) => (
                  <Link
                    key={path.id}
                    href={`/ventures/${path.id}`}
                    className="flex items-start gap-3 bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors group"
                  >
                    <span className="text-2xl flex-shrink-0">{path.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium group-hover:text-brand-accent transition-colors">
                        {path.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {path.anchorName} · {path.location}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">{path.salary}</div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Compass CTA */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
              <Compass className="w-8 h-8 text-brand-accent mx-auto mb-3" />
              <h3 className="text-white font-semibold text-sm mb-2">Find Your Path</h3>
              <p className="text-gray-400 text-xs mb-4">
                Use the Compass to find Paths matched to your skills and identity.
              </p>
              <Link
                href="/compass"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                Start Compass
              </Link>
            </div>

            {/* Related threads */}
            {relatedThreads.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="text-white font-semibold text-sm mb-3">Related Threads</h3>
                <div className="space-y-2">
                  {relatedThreads.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/threads/${r.slug}`}
                      className="flex items-center gap-2 text-sm group"
                    >
                      <span>{r.icon}</span>
                      <span className="text-gray-300 group-hover:text-brand-accent transition-colors">
                        {r.brandName}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {r.memberCount.toLocaleString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">Thread Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Members</span>
                  <span className="text-white font-medium">
                    {thread.memberCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium capitalize">{thread.type}</span>
                </div>
                {thread.parentThread && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Part of</span>
                    <Link
                      href={`/threads/${thread.parentThread}`}
                      className="text-brand-accent hover:underline"
                    >
                      {allThreads.find((t) => t.slug === thread.parentThread)?.brandName ??
                        thread.parentThread}
                    </Link>
                  </div>
                )}
                {thread.countries.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Countries</span>
                    <span className="text-white">{thread.countries.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

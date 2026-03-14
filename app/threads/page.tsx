'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'

interface ThreadNode {
  id: string
  type: string
  code: string
  label: string
  icon: string | null
}

interface Thread {
  id: string
  title: string
  description: string | null
  node: ThreadNode
  _count: { posts: number }
  createdAt: string
}

const NODE_TYPES = ['COUNTRY', 'LANGUAGE', 'FAITH', 'SECTOR', 'CULTURE', 'SKILL']

function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <Link
      href={`/threads/${thread.id}`}
      className="flex flex-col gap-3 rounded-xl border border-brand-accent/20 bg-brand-surface p-5 hover:border-brand-accent/40 transition"
    >
      <div className="flex items-start gap-3">
        {thread.node.icon && (
          <span className="text-2xl leading-none mt-0.5">{thread.node.icon}</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-brand-text truncate">{thread.title}</p>
          <p className="text-xs text-brand-text-muted mt-0.5">
            {thread.node.type} · {thread.node.label}
          </p>
        </div>
      </div>
      {thread.description && (
        <p className="text-sm text-brand-text-muted line-clamp-2">{thread.description}</p>
      )}
      <div className="flex items-center gap-1 text-xs text-brand-text-muted">
        <span className="text-brand-accent font-medium">{thread._count.posts}</span>
        <span>{thread._count.posts === 1 ? 'post' : 'posts'}</span>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-36 animate-pulse rounded-xl border border-brand-accent/10 bg-brand-surface"
        />
      ))}
    </div>
  )
}

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = typeFilter ? `?type=${typeFilter}` : ''
    fetch(`/api/threads${params}`)
      .then((r) => r.json())
      .then((data: { threads?: Thread[] }) => setThreads(data.threads ?? []))
      .catch(() => setError('Failed to load threads'))
      .finally(() => setLoading(false))
  }, [typeFilter])

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-accent/10 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold text-brand-accent">
            Be[X]
          </Link>
          <span className="text-brand-text-muted">/</span>
          <h1 className="text-base font-semibold text-brand-text">Community Threads</h1>
        </div>
        <Link href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
          ← Back
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Intro */}
        <p className="mb-6 text-sm text-brand-text-muted">
          Identity-based discussions — find your community and start a conversation.
        </p>

        {/* Type filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter('')}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              typeFilter === ''
                ? 'border-brand-accent bg-brand-primary text-brand-accent'
                : 'border-brand-accent/20 text-brand-text-muted hover:border-brand-accent/40'
            }`}
          >
            All
          </button>
          {NODE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                typeFilter === t
                  ? 'border-brand-accent bg-brand-primary text-brand-accent'
                  : 'border-brand-accent/20 text-brand-text-muted hover:border-brand-accent/40'
              }`}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : loading ? (
          <LoadingGrid />
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-brand-text">No threads yet</p>
            <p className="mt-1 text-sm text-brand-text-muted">
              Threads are created by community hosts. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {threads.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

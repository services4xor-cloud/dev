'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Footer from '@/components/Footer'

interface PostAuthor {
  id: string
  name: string | null
  image: string | null
}

interface ThreadPost {
  id: string
  content: string
  createdAt: string
  author: PostAuthor
}

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
  posts: ThreadPost[]
  _count: { posts: number }
  createdAt: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-brand-accent text-xs font-semibold select-none flex-shrink-0">
      {initials || '?'}
    </div>
  )
}

function PostCard({ post }: { post: ThreadPost }) {
  return (
    <div className="rounded-xl border border-brand-accent/20 bg-brand-surface p-4">
      <div className="flex items-center gap-3 mb-3">
        <AvatarPlaceholder name={post.author.name ?? 'Anonymous'} />
        <div>
          <p className="text-sm font-medium text-brand-text">{post.author.name ?? 'Anonymous'}</p>
          <p className="text-xs text-brand-text-muted">{formatDate(post.createdAt)}</p>
        </div>
      </div>
      <p className="text-sm text-brand-text leading-relaxed whitespace-pre-wrap">{post.content}</p>
    </div>
  )
}

function PostForm({ threadId, onPosted }: { threadId: string; onPosted: () => void }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/threads/${threadId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? 'Failed to post')
        return
      }
      setContent('')
      onPosted()
    } catch {
      setError('Failed to post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <p className="mb-2 text-sm font-medium text-brand-text">Write a post</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="Share your thoughts with this community…"
        className="w-full rounded-lg border border-brand-accent/20 bg-brand-surface px-4 py-3 text-sm text-brand-text placeholder-brand-text-muted outline-none focus:border-brand-accent/50 transition resize-none"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="rounded-lg bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  )
}

export default function ThreadDetailPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '')
  const { data: session } = useSession()

  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadThread() {
    setLoading(true)
    fetch(`/api/threads/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data: Thread) => setThread(data))
      .catch(() => setError('Thread not found or unavailable'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (id) loadThread()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-accent/10 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold text-brand-accent">
            Be[X]
          </Link>
          <span className="text-brand-text-muted">/</span>
          <Link
            href="/threads"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition"
          >
            Community Threads
          </Link>
        </div>
        <Link
          href="/threads"
          className="text-sm text-brand-text-muted hover:text-brand-accent transition"
        >
          ← Back
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-xl border border-brand-accent/10 bg-brand-surface" />
            <div className="h-40 animate-pulse rounded-xl border border-brand-accent/10 bg-brand-surface" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-brand-text">{error}</p>
            <Link href="/threads" className="mt-4 text-sm text-brand-accent hover:underline">
              Back to threads
            </Link>
          </div>
        ) : thread ? (
          <>
            {/* Thread header */}
            <div className="mb-6 rounded-xl border border-brand-accent/20 bg-brand-surface p-5">
              <div className="flex items-start gap-3">
                {thread.node.icon && (
                  <span className="text-3xl leading-none mt-0.5">{thread.node.icon}</span>
                )}
                <div>
                  <h1 className="text-xl font-bold text-brand-text">{thread.title}</h1>
                  <p className="text-xs text-brand-text-muted mt-1">
                    {thread.node.type} · {thread.node.label}
                  </p>
                  {thread.description && (
                    <p className="mt-3 text-sm text-brand-text-muted">{thread.description}</p>
                  )}
                  <p className="mt-3 text-xs text-brand-text-muted">
                    <span className="text-brand-accent font-medium">{thread._count.posts}</span>{' '}
                    {thread._count.posts === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {thread.posts.length === 0 ? (
                <p className="text-center text-sm text-brand-text-muted py-10">
                  No posts yet. Be the first to start the conversation.
                </p>
              ) : (
                thread.posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>

            {/* Write a post (only when signed in) */}
            {session ? (
              <PostForm threadId={thread.id} onPosted={loadThread} />
            ) : (
              <div className="mt-6 rounded-xl border border-brand-accent/20 bg-brand-surface px-5 py-4 text-center">
                <p className="text-sm text-brand-text-muted">
                  <Link href="/login" className="text-brand-accent hover:underline">
                    Sign in
                  </Link>{' '}
                  to join the discussion.
                </p>
              </div>
            )}
          </>
        ) : null}
      </div>

      <Footer />
    </main>
  )
}

'use client'

/**
 * useThreads — Client-side hook for fetching threads from API
 *
 * Falls back to MOCK_THREADS when API is unavailable.
 * Used by Nav identity switcher, threads page, and thread detail page.
 */

import { useState, useEffect } from 'react'
import { MOCK_THREADS } from '@/data/mock/threads'
import type { Thread, ThreadType } from '@/lib/threads'

interface UseThreadsOptions {
  type?: ThreadType
  country?: string
}

interface UseThreadsResult {
  threads: Thread[]
  loading: boolean
  error: string | null
  fromDB: boolean
}

/** Map API ThreadItem → UI Thread (handle field name differences) */
function mapApiThread(t: Record<string, unknown>): Thread {
  return {
    slug: t.slug as string,
    name: t.name as string,
    brandName: t.brandName as string,
    type: ((t.type as string) ?? '').toLowerCase() as ThreadType,
    icon: t.icon as string,
    tagline: t.tagline as string,
    description: (t.description as string) ?? '',
    relatedThreads: (t.relatedSlugs as string[]) ?? [],
    parentThread: (t.parentSlug as string) ?? undefined,
    countries: (t.countries as string[]) ?? [],
    memberCount: (t.memberCount as number) ?? 0,
    active: (t.active as boolean) ?? true,
  }
}

export function useThreads(options: UseThreadsOptions = {}): UseThreadsResult {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDB, setFromDB] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchThreads() {
      try {
        const params = new URLSearchParams()
        if (options.type) params.set('type', options.type)
        if (options.country) params.set('country', options.country)

        const qs = params.toString()
        const res = await fetch(`/api/threads${qs ? `?${qs}` : ''}`)

        if (!res.ok) throw new Error(`API ${res.status}`)

        const data = await res.json()
        // API returns { success, threads, total }
        const items = Array.isArray(data) ? data : (data.threads ?? [])
        if (!cancelled) {
          setThreads(items.map(mapApiThread))
          setFromDB(true)
          setLoading(false)
        }
      } catch {
        // Graceful fallback to mock data
        if (!cancelled) {
          let mock = MOCK_THREADS.filter((t) => t.active)
          if (options.type) mock = mock.filter((t) => t.type === options.type)
          if (options.country) mock = mock.filter((t) => t.countries?.includes(options.country!))
          setThreads(mock)
          setFromDB(false)
          setLoading(false)
        }
      }
    }

    fetchThreads()
    return () => {
      cancelled = true
    }
  }, [options.type, options.country])

  return { threads, loading, error, fromDB }
}

/** Fetch a single thread by slug — used by thread detail page */
export function useThread(slug: string) {
  const [thread, setThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [fromDB, setFromDB] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchThread() {
      try {
        const res = await fetch(`/api/threads/${slug}`)
        if (!res.ok) throw new Error(`API ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          setThread(mapApiThread(data))
          setFromDB(true)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          const mock = MOCK_THREADS.find((t) => t.slug === slug && t.active)
          setThread(mock ?? null)
          setFromDB(false)
          setLoading(false)
        }
      }
    }

    fetchThread()
    return () => {
      cancelled = true
    }
  }, [slug])

  return { thread, loading, fromDB }
}

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'

export type DimensionPriority = 'high' | 'medium' | 'low'

interface ProfileData {
  name?: string
  country?: string
  language?: string
  languages?: string[]
  interests?: string[]
  reach?: string[]
  faith?: string[]
  culture?: string
  crafts?: string[]
  city?: string
  bio?: string
  headline?: string
  skills?: string[]
  priorities?: Record<string, DimensionPriority>
}

interface ProfileResponse {
  success: boolean
  data?: {
    id: string
    pioneerId: string | null
    name: string | null
    country: string
    profile: {
      headline: string | null
      bio: string | null
      language: string
      languages: string[]
      interests: string[]
      reach: string[]
      faith: string[]
      culture: string | null
      crafts: string[]
      priorities: Record<string, DimensionPriority> | null
      city: string | null
      skills: string[]
    } | null
  } | null
}

/**
 * Hook that syncs identity changes to the backend profile API.
 * Debounces writes by 1.5s to avoid spamming on rapid changes.
 * Returns { saving, lastSaved, pioneerId, loadProfile }
 */
export function useProfileSync() {
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [pioneerId, setPioneerId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load profile from DB on mount
  const loadProfile = useCallback(async (): Promise<ProfileResponse['data'] | null> => {
    if (!session?.user) return null
    try {
      const res = await fetch('/api/profile')
      if (!res.ok) return null
      const json: ProfileResponse = await res.json()
      if (json.success && json.data?.pioneerId) {
        setPioneerId(json.data.pioneerId)
      }
      return json.data ?? null
    } catch {
      return null
    }
  }, [session?.user])

  // Save profile changes (debounced)
  const saveProfile = useCallback(
    (data: ProfileData) => {
      if (!session?.user) return
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(async () => {
        setSaving(true)
        try {
          const res = await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (res.ok) {
            const json: ProfileResponse = await res.json()
            if (json.data?.pioneerId) setPioneerId(json.data.pioneerId)
            setLastSaved(new Date())
          }
        } catch {
          // Silent fail — profile sync is best-effort
        } finally {
          setSaving(false)
        }
      }, 1500)
    },
    [session?.user]
  )

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { saving, lastSaved, pioneerId, saveProfile, loadProfile }
}

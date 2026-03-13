'use client'

/**
 * useXP — Client hook for XP state and awarding
 *
 * Fetches XP on mount, provides awardXP() to trigger XP events
 * with toast notifications.
 */

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import type { XPState } from '@/lib/xp'

interface XPAward {
  points: number
  label: string
  leveledUp: boolean
  timestamp: number
}

interface UseXPReturn extends XPState {
  loading: boolean
  recentAward: XPAward | null
  awardXP: (action: string) => Promise<void>
  clearAward: () => void
}

export function useXP(): UseXPReturn {
  const { data: session } = useSession()
  const [state, setState] = useState<XPState>({
    totalXP: 0,
    level: 1,
    levelName: 'Newcomer',
    progressToNext: 0,
    xpToNextLevel: 100,
    xpInCurrentLevel: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentAward, setRecentAward] = useState<XPAward | null>(null)

  // Fetch XP state on mount
  useEffect(() => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    fetch('/api/xp')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalXP !== undefined) {
          setState({
            totalXP: data.totalXP,
            level: data.level,
            levelName: data.levelName,
            progressToNext: data.progressToNext,
            xpToNextLevel: data.xpToNextLevel,
            xpInCurrentLevel: data.xpInCurrentLevel,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session?.user])

  const awardXP = useCallback(async (action: string) => {
    try {
      const res = await fetch('/api/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()

      if (data.awarded) {
        setState({
          totalXP: data.totalXP,
          level: data.level,
          levelName: data.levelName,
          progressToNext: data.progressToNext,
          xpToNextLevel: data.xpToNextLevel,
          xpInCurrentLevel: data.xpInCurrentLevel,
        })

        setRecentAward({
          points: data.points,
          label: data.label,
          leveledUp: data.leveledUp,
          timestamp: Date.now(),
        })

        // Auto-clear after 4 seconds
        setTimeout(() => setRecentAward(null), 4000)
      }
    } catch {
      // Silent fail — XP is non-critical
    }
  }, [])

  const clearAward = useCallback(() => setRecentAward(null), [])

  return {
    ...state,
    loading,
    recentAward,
    awardXP,
    clearAward,
  }
}

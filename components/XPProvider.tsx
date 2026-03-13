'use client'

/**
 * XPProvider — Global XP context + toast display
 *
 * Wraps the app to provide useXP() everywhere and
 * renders the XPToast when XP is earned.
 */

import { createContext, useContext, type ReactNode } from 'react'
import { useXP } from '@/lib/hooks/use-xp'
import XPToast from '@/components/XPToast'

type XPContextValue = ReturnType<typeof useXP>

const XPContext = createContext<XPContextValue | null>(null)

export function XPProvider({ children }: { children: ReactNode }) {
  const xp = useXP()

  return (
    <XPContext.Provider value={xp}>
      {children}
      {xp.recentAward && (
        <XPToast
          points={xp.recentAward.points}
          label={xp.recentAward.label}
          leveledUp={xp.recentAward.leveledUp}
          level={xp.level}
          levelName={xp.levelName}
          progressToNext={xp.progressToNext}
          onDismiss={xp.clearAward}
        />
      )}
    </XPContext.Provider>
  )
}

export function useXPContext(): XPContextValue {
  const ctx = useContext(XPContext)
  if (!ctx) {
    // Fallback when outside provider
    return {
      totalXP: 0,
      level: 1,
      levelName: 'Newcomer',
      progressToNext: 0,
      xpToNextLevel: 100,
      xpInCurrentLevel: 0,
      loading: true,
      recentAward: null,
      awardXP: async () => {},
      clearAward: () => {},
    }
  }
  return ctx
}

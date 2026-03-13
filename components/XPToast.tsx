'use client'

/**
 * XPToast — Subtle notification when XP is earned
 *
 * Bottom-right toast showing points earned + progress.
 * Auto-dismisses after 3 seconds.
 * Level-up gets a slightly bigger celebration.
 */

import { useEffect, useState } from 'react'

interface XPToastProps {
  points: number
  label: string
  leveledUp: boolean
  level?: number
  levelName?: string
  progressToNext?: number
  onDismiss: () => void
}

export default function XPToast({
  points,
  label,
  leveledUp,
  level,
  levelName,
  progressToNext = 0,
  onDismiss,
}: XPToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))

    // Auto-dismiss
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300) // Wait for fade-out
    }, 3500)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`rounded-2xl border px-5 py-3 shadow-lg backdrop-blur-sm ${
          leveledUp
            ? 'bg-brand-accent/20 border-brand-accent/50'
            : 'bg-brand-surface/90 border-brand-primary/30'
        }`}
      >
        {leveledUp ? (
          <div className="text-center">
            <div className="text-brand-accent font-bold text-lg mb-1">Level Up!</div>
            <div className="text-white text-sm">
              Level {level} — {levelName}
            </div>
            <div className="text-brand-accent/70 text-xs mt-1">
              +{points} XP — {label}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="text-brand-accent font-bold text-lg">+{points}</span>
              <span className="text-white/70 text-sm">{label}</span>
            </div>
            {/* Mini progress bar */}
            <div className="mt-2 h-1 w-32 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.round(progressToNext * 100)}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

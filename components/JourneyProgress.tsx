'use client'

/**
 * JourneyProgress — Gamification progress widget for the Pioneer dashboard
 *
 * Shows current stage, XP, progress bar, suggested actions, and stage badges.
 * Compact, collapsible. Reads from useJourney hook (localStorage-backed).
 */

import { useState } from 'react'
import Link from 'next/link'
import { useJourney, JOURNEY_STAGES } from '@/lib/hooks/use-journey'

export default function JourneyProgress() {
  const {
    currentStage,
    nextStage,
    stageProgress,
    overallProgress,
    suggestedActions,
    totalXp,
    completedCount,
    totalActions,
  } = useJourney()

  const [collapsed, setCollapsed] = useState(false)

  const currentStageIdx = JOURNEY_STAGES.findIndex((s) => s.id === currentStage.id)

  return (
    <div className="bg-brand-surface border border-white/10 rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentStage.icon}</span>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">
              {currentStage.label}
              <span className="ml-2 text-brand-accent font-bold">{totalXp} XP</span>
            </div>
            <div className="text-gray-400 text-xs">{currentStage.description}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{overallProgress}% complete</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible body */}
      {!collapsed && (
        <div className="px-5 pb-5 space-y-5">
          {/* Progress bar to next stage */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-400">
                {nextStage ? `Next: ${nextStage.icon} ${nextStage.label}` : 'Journey complete!'}
              </span>
              <span className="text-brand-accent font-medium">{stageProgress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${stageProgress}%` }}
              />
            </div>
            {nextStage && (
              <div className="text-xs text-gray-400 mt-1">
                {nextStage.xpRequired - totalXp} XP to {nextStage.label}
              </div>
            )}
          </div>

          {/* Stage badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIdx
              const isCurrent = idx === currentStageIdx
              const isLocked = idx > currentStageIdx

              return (
                <div
                  key={stage.id}
                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isCurrent
                      ? 'bg-brand-accent/15 border-brand-accent/40 text-brand-accent'
                      : isCompleted
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-white/[0.02] border-white/5 text-gray-500'
                  }`}
                  title={`${stage.label} — ${isCompleted ? 'Completed' : isCurrent ? 'Current' : `Locked (${stage.xpRequired} XP)`}`}
                >
                  <span>{stage.icon}</span>
                  <span className="hidden sm:inline">{stage.label}</span>
                  {isCompleted && (
                    <svg
                      className="w-3 h-3 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isLocked && (
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>

          {/* Suggested actions */}
          {suggestedActions.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
                Next Steps
              </div>
              <div className="grid gap-2">
                {suggestedActions.map((action) => {
                  const inner = (
                    <div className="flex items-center gap-3 bg-brand-surface-elevated border border-white/10 rounded-xl px-4 py-3 hover:border-brand-accent/30 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium group-hover:text-brand-accent transition-colors">
                          {action.label}
                        </div>
                        <div className="text-gray-400 text-xs mt-0.5">{action.description}</div>
                      </div>
                      <span className="text-brand-accent text-xs font-bold whitespace-nowrap">
                        +{action.xp} XP
                      </span>
                    </div>
                  )

                  return action.route ? (
                    <Link key={action.id} href={action.route}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={action.id}>{inner}</div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-white/5">
            <span>
              {completedCount}/{totalActions} actions completed
            </span>
            <span className="text-brand-accent font-medium">{overallProgress}% journey</span>
          </div>
        </div>
      )}
    </div>
  )
}

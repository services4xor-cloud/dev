'use client'

/**
 * useJourney — Gamification progress engine
 *
 * Tracks the Pioneer's journey through the platform and never lets them
 * feel lost. Every action earns XP and progresses through stages.
 *
 * Journey stages (inspired by the Hero's Journey):
 *   1. Arrival     → Sign up, set identity
 *   2. Discovery   → Browse paths, explore threads
 *   3. Preparation → Complete profile, save paths
 *   4. First Step  → Open first Chapter (apply)
 *   5. Connection  → Join threads, connect with community
 *   6. Momentum    → Multiple chapters, referrals
 *   7. Pioneer     → Placed, contributing back
 *
 * Persists in localStorage. Will sync to DB when backend is ready.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────

export type JourneyStage =
  | 'arrival'
  | 'discovery'
  | 'preparation'
  | 'first_step'
  | 'connection'
  | 'momentum'
  | 'pioneer'

export interface JourneyAction {
  id: string
  label: string
  description: string
  xp: number
  stage: JourneyStage
  completed: boolean
  /** Route to navigate to for this action */
  route?: string
}

export interface JourneyState {
  /** Total XP earned */
  xp: number
  /** Current stage */
  stage: JourneyStage
  /** Individual action completions */
  completedActions: string[]
  /** Paths saved */
  savedPaths: string[]
  /** Chapters opened */
  openedChapters: string[]
  /** Threads joined */
  joinedThreads: string[]
  /** Countries explored */
  exploredCountries: string[]
  /** When the journey started */
  startedAt: string
}

// ─── Stage Config ───────────────────────────────────────────────────────────

export const JOURNEY_STAGES: {
  id: JourneyStage
  label: string
  icon: string
  xpRequired: number
  description: string
}[] = [
  {
    id: 'arrival',
    label: 'Arrival',
    icon: '🌍',
    xpRequired: 0,
    description: 'Welcome to the network',
  },
  {
    id: 'discovery',
    label: 'Discovery',
    icon: '🔍',
    xpRequired: 50,
    description: 'Exploring opportunities',
  },
  {
    id: 'preparation',
    label: 'Preparation',
    icon: '📋',
    xpRequired: 150,
    description: 'Getting ready',
  },
  {
    id: 'first_step',
    label: 'First Step',
    icon: '🚀',
    xpRequired: 300,
    description: 'Taking action',
  },
  {
    id: 'connection',
    label: 'Connection',
    icon: '🤝',
    xpRequired: 500,
    description: 'Building network',
  },
  { id: 'momentum', label: 'Momentum', icon: '⚡', xpRequired: 800, description: 'Growing fast' },
  { id: 'pioneer', label: 'Pioneer', icon: '🏆', xpRequired: 1200, description: 'Leading the way' },
]

// ─── All trackable actions ──────────────────────────────────────────────────

const ALL_ACTIONS: Omit<JourneyAction, 'completed'>[] = [
  // Arrival
  {
    id: 'set_identity',
    label: 'Set your identity',
    description: 'Choose your country and language',
    xp: 20,
    stage: 'arrival',
    route: '/',
  },
  {
    id: 'visit_ventures',
    label: 'Explore ventures',
    description: 'Browse available paths',
    xp: 15,
    stage: 'arrival',
    route: '/ventures',
  },
  {
    id: 'visit_about',
    label: 'Learn about us',
    description: 'Understand the mission',
    xp: 10,
    stage: 'arrival',
    route: '/about',
  },

  // Discovery
  {
    id: 'explore_3_paths',
    label: 'View 3 paths',
    description: 'Click into path details',
    xp: 30,
    stage: 'discovery',
    route: '/ventures',
  },
  {
    id: 'explore_experience',
    label: 'Discover an experience',
    description: 'Check out safari/ventures',
    xp: 20,
    stage: 'discovery',
    route: '/experiences',
  },
  {
    id: 'explore_2_countries',
    label: 'Explore 2 countries',
    description: 'Switch identity to see other countries',
    xp: 25,
    stage: 'discovery',
  },
  {
    id: 'use_compass',
    label: 'Use the Compass',
    description: 'Find your route with the 4-step wizard',
    xp: 30,
    stage: 'discovery',
    route: '/compass',
  },

  // Preparation
  {
    id: 'complete_profile',
    label: 'Complete your profile',
    description: 'Fill in skills, bio, experience',
    xp: 50,
    stage: 'preparation',
    route: '/onboarding',
  },
  {
    id: 'save_first_path',
    label: 'Save a path',
    description: 'Bookmark a path for later',
    xp: 20,
    stage: 'preparation',
    route: '/ventures',
  },
  {
    id: 'upload_resume',
    label: 'Upload your resume',
    description: 'Add your CV or video pitch',
    xp: 30,
    stage: 'preparation',
    route: '/profile',
  },

  // First Step
  {
    id: 'open_first_chapter',
    label: 'Open your first Chapter',
    description: 'Apply to a path',
    xp: 60,
    stage: 'first_step',
    route: '/ventures',
  },
  {
    id: 'join_first_thread',
    label: 'Join a community',
    description: 'Connect with an identity thread',
    xp: 30,
    stage: 'first_step',
    route: '/threads',
  },

  // Connection
  {
    id: 'join_3_threads',
    label: 'Join 3 communities',
    description: 'Build your network',
    xp: 40,
    stage: 'connection',
    route: '/threads',
  },
  {
    id: 'refer_friend',
    label: 'Invite a friend',
    description: 'Share your referral code',
    xp: 50,
    stage: 'connection',
    route: '/referral',
  },
  {
    id: 'explore_5_countries',
    label: 'Explore 5 countries',
    description: 'Discover global opportunities',
    xp: 40,
    stage: 'connection',
  },

  // Momentum
  {
    id: 'open_3_chapters',
    label: 'Open 3 Chapters',
    description: 'Apply to multiple paths',
    xp: 60,
    stage: 'momentum',
    route: '/ventures',
  },
  {
    id: 'get_shortlisted',
    label: 'Get shortlisted',
    description: 'An anchor reviews your Chapter',
    xp: 80,
    stage: 'momentum',
  },

  // Pioneer
  {
    id: 'get_placed',
    label: 'Get placed',
    description: 'Start your new path!',
    xp: 150,
    stage: 'pioneer',
  },
  {
    id: 'refer_3_friends',
    label: 'Refer 3 friends',
    description: 'Help others find their path',
    xp: 100,
    stage: 'pioneer',
    route: '/referral',
  },
]

// ─── Default state ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'be-journey'

const DEFAULT_STATE: JourneyState = {
  xp: 0,
  stage: 'arrival',
  completedActions: [],
  savedPaths: [],
  openedChapters: [],
  joinedThreads: [],
  exploredCountries: [],
  startedAt: new Date().toISOString(),
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useJourney() {
  const [state, setState] = useState<JourneyState>(DEFAULT_STATE)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.startedAt) setState(parsed)
      }
    } catch {
      // Ignore
    }
  }, [])

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore
    }
  }, [state])

  // Calculate current stage from XP
  const currentStage = useMemo(() => {
    let stage = JOURNEY_STAGES[0]
    for (const s of JOURNEY_STAGES) {
      if (state.xp >= s.xpRequired) stage = s
    }
    return stage
  }, [state.xp])

  // Next stage info
  const nextStage = useMemo(() => {
    const idx = JOURNEY_STAGES.findIndex((s) => s.id === currentStage.id)
    return idx < JOURNEY_STAGES.length - 1 ? JOURNEY_STAGES[idx + 1] : null
  }, [currentStage])

  // Progress to next stage (0-100)
  const stageProgress = useMemo(() => {
    if (!nextStage) return 100
    const range = nextStage.xpRequired - currentStage.xpRequired
    const progress = state.xp - currentStage.xpRequired
    return Math.min(100, Math.round((progress / range) * 100))
  }, [state.xp, currentStage, nextStage])

  // Actions with completion status
  const actions: JourneyAction[] = useMemo(
    () =>
      ALL_ACTIONS.map((a) => ({
        ...a,
        completed: state.completedActions.includes(a.id),
      })),
    [state.completedActions]
  )

  // Next suggested actions (up to 3, from current or next stage)
  const suggestedActions = useMemo(() => {
    const incomplete = actions.filter((a) => !a.completed)
    const stageOrder = JOURNEY_STAGES.map((s) => s.id)
    const currentIdx = stageOrder.indexOf(currentStage.id)

    // Prioritize current stage actions, then next stage
    return incomplete
      .sort((a, b) => {
        const aIdx = stageOrder.indexOf(a.stage)
        const bIdx = stageOrder.indexOf(b.stage)
        const aDist = Math.abs(aIdx - currentIdx)
        const bDist = Math.abs(bIdx - currentIdx)
        return aDist - bDist
      })
      .slice(0, 3)
  }, [actions, currentStage])

  // Complete an action
  const completeAction = useCallback((actionId: string) => {
    setState((prev) => {
      if (prev.completedActions.includes(actionId)) return prev
      const action = ALL_ACTIONS.find((a) => a.id === actionId)
      if (!action) return prev
      return {
        ...prev,
        xp: prev.xp + action.xp,
        completedActions: [...prev.completedActions, actionId],
      }
    })
  }, [])

  // Track country exploration
  const trackCountryExplored = useCallback((countryCode: string) => {
    setState((prev) => {
      if (prev.exploredCountries.includes(countryCode)) return prev
      const newCountries = [...prev.exploredCountries, countryCode]
      const newCompleted = [...prev.completedActions]
      let bonusXp = 0

      // Auto-complete milestones
      if (newCountries.length >= 2 && !newCompleted.includes('explore_2_countries')) {
        newCompleted.push('explore_2_countries')
        bonusXp += 25
      }
      if (newCountries.length >= 5 && !newCompleted.includes('explore_5_countries')) {
        newCompleted.push('explore_5_countries')
        bonusXp += 40
      }

      return {
        ...prev,
        exploredCountries: newCountries,
        completedActions: newCompleted,
        xp: prev.xp + bonusXp,
      }
    })
  }, [])

  // Track path saved
  const trackPathSaved = useCallback((pathId: string) => {
    setState((prev) => {
      if (prev.savedPaths.includes(pathId)) return prev
      const newSaved = [...prev.savedPaths, pathId]
      const newCompleted = [...prev.completedActions]
      let bonusXp = 0

      if (newSaved.length >= 1 && !newCompleted.includes('save_first_path')) {
        newCompleted.push('save_first_path')
        bonusXp += 20
      }

      return {
        ...prev,
        savedPaths: newSaved,
        completedActions: newCompleted,
        xp: prev.xp + bonusXp,
      }
    })
  }, [])

  // Overall completion percentage
  const overallProgress = useMemo(() => {
    return Math.round((state.completedActions.length / ALL_ACTIONS.length) * 100)
  }, [state.completedActions.length])

  return {
    state,
    currentStage,
    nextStage,
    stageProgress,
    overallProgress,
    actions,
    suggestedActions,
    completeAction,
    trackCountryExplored,
    trackPathSaved,
    totalXp: state.xp,
    totalActions: ALL_ACTIONS.length,
    completedCount: state.completedActions.length,
  }
}

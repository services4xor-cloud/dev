/**
 * XP Engine — Gamification system for Be[Country]
 *
 * Tracks experience points earned through platform actions.
 * Level progression follows an exponential curve.
 */

// ─── XP Actions & Rewards ─────────────────────────────────────────────

interface XPActionDef {
  points: number
  label: string
  oneTime?: boolean
  maxPerDay?: number
}

export const XP_ACTIONS: Record<string, XPActionDef> = {
  SET_IDENTITY: { points: 20, label: 'Set your identity', oneTime: true },
  COMPLETE_DISCOVERY: { points: 50, label: 'Complete discovery', oneTime: true },
  VIEW_PATH: { points: 10, label: 'View a path', maxPerDay: 3 },
  APPLY_PATH: { points: 30, label: 'Apply for a path' },
  DISCOVER_EXPERIENCE: { points: 20, label: 'Discover an experience', maxPerDay: 3 },
  ADD_FRIEND: { points: 15, label: 'Add a friend' },
  SEND_MESSAGE: { points: 5, label: 'Send a message', maxPerDay: 10 },
  COMPLETE_PROFILE: { points: 25, label: 'Complete your profile', oneTime: true },
  SET_DESTINATIONS: { points: 15, label: 'Set destinations', oneTime: true },
}

export type XPAction = keyof typeof XP_ACTIONS

// ─── Level Thresholds ─────────────────────────────────────────────────

interface XPLevelDef {
  level: number
  xp: number
  name: string
}

export const XP_LEVELS: XPLevelDef[] = [
  { level: 1, xp: 0, name: 'Newcomer' },
  { level: 2, xp: 100, name: 'Explorer' },
  { level: 3, xp: 300, name: 'Pathfinder' },
  { level: 4, xp: 600, name: 'Pioneer' },
  { level: 5, xp: 1000, name: 'Trailblazer' },
  { level: 6, xp: 1500, name: 'Ambassador' },
  { level: 7, xp: 2500, name: 'Legend' },
]

export interface XPState {
  totalXP: number
  level: number
  levelName: string
  progressToNext: number // 0-1
  xpToNextLevel: number
  xpInCurrentLevel: number
}

/**
 * Calculate XP state from total XP
 */
export function getXPLevel(totalXP: number): XPState {
  let currentLevel = XP_LEVELS[0]
  let nextLevel: XPLevelDef | undefined = XP_LEVELS[1]

  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].xp) {
      currentLevel = XP_LEVELS[i]
      nextLevel = XP_LEVELS[i + 1]
      break
    }
  }

  const xpInCurrentLevel = totalXP - currentLevel.xp
  const xpToNextLevel = nextLevel ? nextLevel.xp - currentLevel.xp : 0
  const progressToNext = xpToNextLevel > 0 ? xpInCurrentLevel / xpToNextLevel : 1

  return {
    totalXP,
    level: currentLevel.level,
    levelName: currentLevel.name,
    progressToNext: Math.min(progressToNext, 1),
    xpToNextLevel,
    xpInCurrentLevel,
  }
}

// ─── Quest System ─────────────────────────────────────────────────────

export interface Quest {
  id: string
  title: string
  description: string
  icon: string
  /** XP action that completes this quest (or 'MANUAL' for composite quests) */
  trigger: string
  /** Required count to complete (e.g., view 3 paths) */
  targetCount: number
  /** XP bonus on quest completion (in addition to action XP) */
  bonusXP: number
  /** Minimum level to unlock this quest */
  unlockLevel: number
  /** Category for grouping */
  category: 'onboarding' | 'exploration' | 'connection' | 'growth'
  /** Order within category */
  order: number
}

export const QUESTS: Quest[] = [
  // ── Onboarding (Level 1) — Learn the platform basics
  {
    id: 'complete-identity',
    title: 'Define Yourself',
    description: 'Set up your identity — country, languages, and crafts',
    icon: '🪪',
    trigger: 'SET_IDENTITY',
    targetCount: 1,
    bonusXP: 10,
    unlockLevel: 1,
    category: 'onboarding',
    order: 1,
  },
  {
    id: 'complete-discovery',
    title: 'Complete Discovery',
    description: 'Finish the 5-step discovery wizard to join the network',
    icon: '🧭',
    trigger: 'COMPLETE_DISCOVERY',
    targetCount: 1,
    bonusXP: 20,
    unlockLevel: 1,
    category: 'onboarding',
    order: 2,
  },
  {
    id: 'set-destinations',
    title: 'Set Your Compass',
    description: 'Choose destination countries you want to connect with',
    icon: '🗺️',
    trigger: 'SET_DESTINATIONS',
    targetCount: 1,
    bonusXP: 10,
    unlockLevel: 1,
    category: 'onboarding',
    order: 3,
  },
  {
    id: 'complete-profile',
    title: 'Profile Pioneer',
    description: 'Fill out your complete profile — bio, headline, and all dimensions',
    icon: '⭐',
    trigger: 'COMPLETE_PROFILE',
    targetCount: 1,
    bonusXP: 15,
    unlockLevel: 1,
    category: 'onboarding',
    order: 4,
  },

  // ── Exploration (Level 2) — Discover what the platform offers
  {
    id: 'first-path-view',
    title: 'Path Explorer',
    description: 'View your first path to see what opportunities exist',
    icon: '👀',
    trigger: 'VIEW_PATH',
    targetCount: 1,
    bonusXP: 5,
    unlockLevel: 1,
    category: 'exploration',
    order: 1,
  },
  {
    id: 'view-three-paths',
    title: 'Path Scout',
    description: 'Explore 3 different paths to understand the landscape',
    icon: '🔭',
    trigger: 'VIEW_PATH',
    targetCount: 3,
    bonusXP: 15,
    unlockLevel: 2,
    category: 'exploration',
    order: 2,
  },
  {
    id: 'discover-experience',
    title: 'Experience Seeker',
    description: 'Discover an experience or venture on the platform',
    icon: '🌟',
    trigger: 'DISCOVER_EXPERIENCE',
    targetCount: 1,
    bonusXP: 10,
    unlockLevel: 2,
    category: 'exploration',
    order: 3,
  },

  // ── Connection (Level 2+) — Engage with the community
  {
    id: 'first-message',
    title: 'Ice Breaker',
    description: 'Send your first message to connect with someone',
    icon: '💬',
    trigger: 'SEND_MESSAGE',
    targetCount: 1,
    bonusXP: 10,
    unlockLevel: 2,
    category: 'connection',
    order: 1,
  },
  {
    id: 'add-friend',
    title: 'Network Builder',
    description: 'Add your first friend on the platform',
    icon: '🤝',
    trigger: 'ADD_FRIEND',
    targetCount: 1,
    bonusXP: 10,
    unlockLevel: 2,
    category: 'connection',
    order: 2,
  },
  {
    id: 'first-chapter',
    title: 'Chapter One',
    description: 'Open your first chapter — apply for a path that matches you',
    icon: '📖',
    trigger: 'APPLY_PATH',
    targetCount: 1,
    bonusXP: 20,
    unlockLevel: 2,
    category: 'connection',
    order: 3,
  },

  // ── Growth (Level 3+) — Deepen engagement
  {
    id: 'five-messages',
    title: 'Conversationalist',
    description: 'Send 5 messages to build meaningful connections',
    icon: '🗨️',
    trigger: 'SEND_MESSAGE',
    targetCount: 5,
    bonusXP: 15,
    unlockLevel: 3,
    category: 'growth',
    order: 1,
  },
  {
    id: 'three-chapters',
    title: 'Multi-Path Pioneer',
    description: 'Open chapters on 3 different paths',
    icon: '🚀',
    trigger: 'APPLY_PATH',
    targetCount: 3,
    bonusXP: 30,
    unlockLevel: 3,
    category: 'growth',
    order: 2,
  },
  {
    id: 'three-friends',
    title: 'Community Pillar',
    description: 'Build a network of 3 friends on the platform',
    icon: '🏛️',
    trigger: 'ADD_FRIEND',
    targetCount: 3,
    bonusXP: 25,
    unlockLevel: 4,
    category: 'growth',
    order: 3,
  },
]

/** Get quests available at a given level */
export function getQuestsForLevel(level: number): Quest[] {
  return QUESTS.filter((q) => q.unlockLevel <= level).sort((a, b) => a.order - b.order)
}

/** Get quests by category */
export function getQuestsByCategory(category: Quest['category']): Quest[] {
  return QUESTS.filter((q) => q.category === category).sort((a, b) => a.order - b.order)
}

/** Get the next recommended quest based on current progress */
export function getNextQuest(level: number, completedQuestIds: string[]): Quest | null {
  const available = getQuestsForLevel(level)
  // Priority: onboarding > exploration > connection > growth
  const categoryOrder: Quest['category'][] = ['onboarding', 'exploration', 'connection', 'growth']
  for (const cat of categoryOrder) {
    const next = available.find((q) => q.category === cat && !completedQuestIds.includes(q.id))
    if (next) return next
  }
  return null
}

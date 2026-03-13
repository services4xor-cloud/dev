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

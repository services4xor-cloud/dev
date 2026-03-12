/**
 * DIMENSIONS — Identity dimension types for the Human Exchange Network
 *
 * Defines the faith and reach dimension identifiers used
 * across the 8-dimension matching engine.
 */

// ─── Faith Identifiers ───────────────────────────────────────────────────────

export type FaithId =
  | 'christian'
  | 'muslim'
  | 'hindu'
  | 'buddhist'
  | 'jewish'
  | 'traditional'
  | 'spiritual'
  | 'secular'
  | 'other'

export const FAITH_OPTIONS: { id: FaithId; label: string }[] = [
  { id: 'christian', label: 'Christian' },
  { id: 'muslim', label: 'Muslim' },
  { id: 'hindu', label: 'Hindu' },
  { id: 'buddhist', label: 'Buddhist' },
  { id: 'jewish', label: 'Jewish' },
  { id: 'traditional', label: 'Traditional / Indigenous' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'secular', label: 'Secular / None' },
  { id: 'other', label: 'Other' },
]

// ─── Reach Identifiers ───────────────────────────────────────────────────────

export type ReachId =
  | 'can-travel'
  | 'can-host'
  | 'can-invest'
  | 'can-mentor'
  | 'can-relocate'
  | 'can-teach'
  | 'can-collaborate'

export const REACH_OPTIONS: { id: ReachId; label: string; description: string }[] = [
  { id: 'can-travel', label: 'Can Travel', description: 'Available to travel to other locations' },
  { id: 'can-host', label: 'Can Host', description: 'Can host visitors or provide accommodation' },
  { id: 'can-invest', label: 'Can Invest', description: 'Available to invest in opportunities' },
  { id: 'can-mentor', label: 'Can Mentor', description: 'Available to mentor others' },
  { id: 'can-relocate', label: 'Can Relocate', description: 'Open to relocating' },
  { id: 'can-teach', label: 'Can Teach', description: 'Available to teach skills' },
  {
    id: 'can-collaborate',
    label: 'Can Collaborate',
    description: 'Open to collaboration projects',
  },
]

// ─── Compatible Reach Pairs ──────────────────────────────────────────────────

/** Reach pairs that indicate strong compatibility between two profiles */
export const COMPATIBLE_REACH_PAIRS: [ReachId, ReachId][] = [
  ['can-travel', 'can-host'],
  ['can-invest', 'can-mentor'],
  ['can-relocate', 'can-host'],
]

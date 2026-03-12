/**
 * Identity Dimensions — Options for the 8 identity dimensions
 *
 * Used across onboarding, profile, and matching.
 * Each dimension contributes to the Pioneer's identity fingerprint.
 */

// ─── Faith ───────────────────────────────────────────────────────────

export interface FaithOption {
  id: string
  label: string
  icon: string
}

export const FAITH_OPTIONS: FaithOption[] = [
  { id: 'christianity', label: 'Christianity', icon: '✝️' },
  { id: 'islam', label: 'Islam', icon: '☪️' },
  { id: 'hinduism', label: 'Hinduism', icon: '🕉️' },
  { id: 'buddhism', label: 'Buddhism', icon: '☸️' },
  { id: 'judaism', label: 'Judaism', icon: '✡️' },
  { id: 'sikhism', label: 'Sikhism', icon: '🙏' },
  { id: 'traditional', label: 'Traditional / Indigenous', icon: '🌿' },
  { id: 'spiritual', label: 'Spiritual (non-religious)', icon: '🌟' },
  { id: 'none', label: 'No religion', icon: '🔘' },
  { id: 'prefer-not', label: 'Prefer not to say', icon: '🤐' },
]

export function getFaithOption(id: string): FaithOption | undefined {
  return FAITH_OPTIONS.find((f) => f.id === id)
}

// ─── Reach ───────────────────────────────────────────────────────────

export interface ReachOption {
  id: string
  label: string
  icon: string
  description: string
}

export const REACH_OPTIONS: ReachOption[] = [
  { id: 'local', label: 'Local', icon: '📍', description: 'Within my city or region' },
  { id: 'national', label: 'National', icon: '🏠', description: 'Across my country' },
  { id: 'continental', label: 'Continental', icon: '🌍', description: 'Across my continent' },
  { id: 'global', label: 'Global', icon: '🌐', description: 'Worldwide connections' },
  { id: 'diaspora', label: 'Diaspora', icon: '🔗', description: 'Connecting with my diaspora' },
  { id: 'remote', label: 'Remote-only', icon: '💻', description: 'Digital connections only' },
]

export function getReachOption(id: string): ReachOption | undefined {
  return REACH_OPTIONS.find((r) => r.id === id)
}

// ─── Dimension labels (for summary displays) ─────────────────────────

export interface DimensionMeta {
  key: string
  label: string
  icon: string
}

export const DIMENSION_META: DimensionMeta[] = [
  { key: 'location', label: 'Location', icon: '📍' },
  { key: 'languages', label: 'Languages', icon: '🗣️' },
  { key: 'faith', label: 'Faith', icon: '🙏' },
  { key: 'craft', label: 'Craft', icon: '🛠️' },
  { key: 'interests', label: 'Passion', icon: '❤️' },
  { key: 'reach', label: 'Reach', icon: '🌐' },
  { key: 'culture', label: 'Culture', icon: '🌿' },
  { key: 'market', label: 'Market', icon: '📊' },
]

/**
 * emoji-map.ts — Sector → emoji mapping
 *
 * Single source of truth for sector emoji icons.
 * Used by Country Gates (/be/[country]) and anywhere
 * that needs a visual icon for an industry sector.
 */

const SECTOR_EMOJI_RULES: [RegExp, string][] = [
  [/safari|wildlife/, '🦁'],
  [/tech|it\b|software/, '💻'],
  [/fashion|design/, '👗'],
  [/eco|green|renewable/, '🌿'],
  [/health|pflege|nurse/, '🏥'],
  [/finance|bank/, '💰'],
  [/education|teach/, '📚'],
  [/hospitality|gastro/, '🍽️'],
  [/media|content|nollywood/, '🎬'],
  [/aviation/, '✈️'],
  [/remote/, '🌎'],
  [/automotive/, '🚗'],
  [/logistics|transport/, '🚛'],
  [/oil|gas/, '⛽'],
  [/telecom/, '📡'],
  [/agri|farm/, '🌾'],
  [/construction/, '🏗️'],
  [/engineering/, '⚙️'],
  [/clean|energy/, '⚡'],
  [/security/, '🛡️'],
  [/creative/, '🎨'],
]

/**
 * Get an emoji for a sector name.
 * Falls back to 💼 if no rule matches.
 */
export function getSectorEmoji(sectorName: string): string {
  const name = sectorName.toLowerCase()
  for (const [pattern, emoji] of SECTOR_EMOJI_RULES) {
    if (pattern.test(name)) return emoji
  }
  return '💼'
}

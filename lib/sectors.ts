/**
 * Sector metadata — single source of truth
 *
 * Maps sector slug to display icon + category grouping.
 * Used by usePaths hook for path enrichment, and available
 * for any future sector-based UI (filters, tags, feeds).
 */

export type SectorCategory = 'professional' | 'explorer' | 'community' | 'creative'

export interface SectorMeta {
  icon: string
  category: SectorCategory
}

export const SECTOR_META: Record<string, SectorMeta> = {
  tech: { icon: '💻', category: 'professional' },
  safari: { icon: '🦁', category: 'explorer' },
  healthcare: { icon: '🏥', category: 'professional' },
  finance: { icon: '💰', category: 'professional' },
  education: { icon: '📚', category: 'community' },
  agriculture: { icon: '🌾', category: 'community' },
  engineering: { icon: '⚙️', category: 'professional' },
  hospitality: { icon: '🏨', category: 'explorer' },
  pharma: { icon: '💊', category: 'professional' },
  marine: { icon: '🐠', category: 'explorer' },
  energy: { icon: '⚡', category: 'professional' },
  media: { icon: '🎬', category: 'creative' },
  arts: { icon: '🎨', category: 'creative' },
  transport: { icon: '🚄', category: 'professional' },
  telecom: { icon: '📡', category: 'professional' },
  banking: { icon: '🏦', category: 'professional' },
  conservation: { icon: '🌿', category: 'explorer' },
}

/** Get sector icon, falling back to a compass emoji */
export function getSectorIcon(sector: string): string {
  return SECTOR_META[sector]?.icon ?? '🧭'
}

/** Get sector category, defaulting to 'professional' */
export function getSectorCategory(sector: string): SectorCategory {
  return SECTOR_META[sector]?.category ?? 'professional'
}

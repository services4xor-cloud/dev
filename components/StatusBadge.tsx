/**
 * StatusBadge — Reusable status pill/tag component
 *
 * Flexible enough for chapter status, path status, or any label+color combo.
 * Replaces 3 duplicated implementations across dashboards.
 *
 * Usage:
 *   <StatusBadge status="new" />
 *   <StatusBadge status="open" variant="outline" />
 *   <StatusBadge status="declined" size="sm" />
 */

import type { LucideIcon } from 'lucide-react'

// ── Status → style mapping ────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  // Chapter statuses
  new: {
    label: 'New',
    className: 'bg-brand-primary/50 text-brand-accent border-brand-accent/50',
  },
  'under review': {
    label: 'Under Review',
    className: 'bg-blue-900/50 text-blue-400 border-blue-700/50',
  },
  reviewed: {
    label: 'Reviewed',
    className: 'bg-blue-900/50 text-blue-400 border-blue-700/50',
  },
  shortlisted: {
    label: 'Shortlisted',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  offer: {
    label: 'Offer',
    className: 'bg-brand-accent/20 text-brand-accent border-brand-accent/40',
  },
  declined: {
    label: 'Declined',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  // Path statuses
  open: {
    label: 'Open',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  paused: {
    label: 'Paused',
    className: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
  },
  closed: {
    label: 'Closed',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  // Forward statuses (Agent system)
  sent: {
    label: 'Sent',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  clicked: {
    label: 'Clicked',
    className: 'bg-blue-900/50 text-blue-400 border-blue-700/50',
  },
  signed_up: {
    label: 'Signed Up',
    className: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
  },
  applied: {
    label: 'Applied',
    className: 'bg-purple-900/50 text-purple-400 border-purple-700/50',
  },
  placed: {
    label: 'Placed',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  expired: {
    label: 'Expired',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  // Generic
  active: {
    label: 'Active',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  pending: {
    label: 'Pending',
    className: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
  },
}

const FALLBACK_STYLE = 'bg-gray-700/50 text-gray-400 border-gray-600/50'

// ── Component ──────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  /** Status key (case-insensitive, e.g. "new", "shortlisted", "open") */
  status: string
  /** Optional override for display label */
  label?: string
  /** Optional icon (from lucide-react) */
  icon?: LucideIcon
  /** Size variant */
  size?: 'sm' | 'md'
  /** Additional className */
  className?: string
}

export default function StatusBadge({
  status,
  label,
  icon: Icon,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const key = status.toLowerCase()
  const style = STATUS_STYLES[key]
  const displayLabel = label ?? style?.label ?? status
  const colorClass = style?.className ?? FALLBACK_STYLE

  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${sizeClass} ${colorClass} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
      {displayLabel}
    </span>
  )
}

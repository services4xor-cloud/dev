'use client'

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
import { useTranslation } from '@/lib/hooks/use-translation'

// ── Status → style mapping ────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { i18nKey: string; className: string }> = {
  // Chapter statuses
  new: {
    i18nKey: 'status.new',
    className: 'bg-brand-primary/50 text-brand-accent border-brand-accent/50',
  },
  'under review': {
    i18nKey: 'status.underReview',
    className: 'bg-blue-900/50 text-blue-400 border-blue-700/50',
  },
  reviewed: {
    i18nKey: 'status.reviewed',
    className: 'bg-blue-900/50 text-blue-400 border-blue-700/50',
  },
  shortlisted: {
    i18nKey: 'status.shortlisted',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  offer: {
    i18nKey: 'status.offer',
    className: 'bg-brand-accent/20 text-brand-accent border-brand-accent/40',
  },
  declined: {
    i18nKey: 'status.declined',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  // Path statuses
  open: {
    i18nKey: 'status.open',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  paused: {
    i18nKey: 'status.paused',
    className: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
  },
  closed: {
    i18nKey: 'status.closed',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  // Forward statuses (Agent system)
  sent: {
    i18nKey: 'status.sent',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  clicked: {
    i18nKey: 'status.clicked',
    className: 'bg-blue-900/50 text-blue-400 border-blue-700/50',
  },
  signed_up: {
    i18nKey: 'status.signedUp',
    className: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
  },
  applied: {
    i18nKey: 'status.applied',
    className: 'bg-purple-900/50 text-purple-400 border-purple-700/50',
  },
  placed: {
    i18nKey: 'status.placed',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  expired: {
    i18nKey: 'status.expired',
    className: 'bg-gray-700/50 text-gray-400 border-gray-600/50',
  },
  // Generic
  active: {
    i18nKey: 'status.active',
    className: 'bg-green-900/50 text-green-400 border-green-700/50',
  },
  pending: {
    i18nKey: 'status.pending',
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
  const { t } = useTranslation()
  const key = status.toLowerCase()
  const style = STATUS_STYLES[key]
  const displayLabel = label ?? (style ? t(style.i18nKey) : status)
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

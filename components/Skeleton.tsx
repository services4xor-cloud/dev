'use client'

/**
 * Reusable skeleton loading primitives.
 * Use animate-pulse wrapper + gray blocks that match the content layout.
 *
 * Usage:
 *   <SkeletonCard />           → single card skeleton
 *   <SkeletonGrid count={3} /> → grid of skeleton cards
 *   <SkeletonDashboard />      → full dashboard tab skeleton
 *   <SkeletonLine w="w-48" />  → single text line placeholder
 */

// ── Atomic primitives ──────────────────────────────────────────────

export function SkeletonLine({
  w = 'w-full',
  h = 'h-4',
  className = '',
}: {
  w?: string
  h?: string
  className?: string
}) {
  return <div className={`${h} ${w} bg-gray-800/60 rounded ${className}`} />
}

export function SkeletonBlock({ h = 'h-32', className = '' }: { h?: string; className?: string }) {
  return <div className={`${h} w-full bg-gray-800/40 rounded-xl ${className}`} />
}

// ── Card skeleton (matches PathCard / venture card) ────────────────

export function SkeletonCard() {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="h-36 bg-gray-800/40" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 bg-gray-800/60 rounded-full" />
        <div className="h-4 w-full bg-gray-800/60 rounded" />
        <div className="h-3 w-2/3 bg-gray-800/40 rounded" />
        <div className="flex justify-between">
          <div className="h-5 w-24 bg-gray-800/60 rounded" />
          <div className="h-4 w-16 bg-gray-800/40 rounded" />
        </div>
      </div>
    </div>
  )
}

// ── Card grid skeleton ─────────────────────────────────────────────

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

// ── List item skeleton (matches Path list items) ───────────────────

export function SkeletonListItem() {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
      <div className="w-12 h-12 rounded-xl bg-gray-800/60 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-800/60 rounded" />
        <div className="h-3 w-1/2 bg-gray-800/40 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-800/40 rounded-full" />
          <div className="h-5 w-20 bg-gray-800/40 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ── Stat card skeleton (matches dashboard stat cards) ──────────────

export function SkeletonStatCard() {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-phi-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-20 bg-gray-800/60 rounded" />
        <div className="w-8 h-8 bg-gray-800/40 rounded-lg" />
      </div>
      <div className="h-7 w-16 bg-gray-800/60 rounded mb-1" />
      <div className="h-3 w-24 bg-gray-800/40 rounded" />
    </div>
  )
}

// ── Dashboard tab skeleton ─────────────────────────────────────────

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Section header */}
      <SkeletonLine w="w-48" h="h-6" />

      {/* Content list */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  )
}

// ── Page-level wrapper (adds animate-pulse) ────────────────────────

export function SkeletonPage({ children }: { children: React.ReactNode }) {
  return <div className="animate-pulse">{children}</div>
}

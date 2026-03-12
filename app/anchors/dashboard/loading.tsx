// Anchor dashboard loading skeleton
export default function AnchorDashboardLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header skeleton */}
      <div
        className="py-12 px-4"
        style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-bg))' }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-phi-3">
          <div className="w-16 h-16 rounded-2xl skeleton-shimmer" />
          <div>
            <div className="h-6 w-48 rounded mb-2 skeleton-shimmer" />
            <div className="h-4 w-64 rounded skeleton-shimmer" style={{ opacity: 0.6 }} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-phi-4">
        {/* Tab bar skeleton */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 rounded-xl shrink-0 skeleton-shimmer"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-phi-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-phi-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-3 w-20 rounded mb-3 skeleton-shimmer" />
              <div className="h-8 w-12 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="glass rounded-2xl p-phi-5">
          <div className="h-5 w-32 rounded mb-6 skeleton-shimmer" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-phi-3 py-4"
              style={{ borderBottom: i < 3 ? '1px solid var(--color-primary)' : 'none' }}
            >
              <div className="w-10 h-10 rounded-xl shrink-0 skeleton-shimmer" />
              <div className="flex-1">
                <div className="h-4 w-2/3 rounded mb-2 skeleton-shimmer" />
                <div className="h-3 w-1/3 rounded skeleton-shimmer" style={{ opacity: 0.6 }} />
              </div>
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

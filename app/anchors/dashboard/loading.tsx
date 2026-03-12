// Anchor dashboard loading skeleton
export default function AnchorDashboardLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header skeleton */}
      <div
        className="py-12 px-4"
        style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-bg))' }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl animate-pulse"
            style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
          />
          <div>
            <div
              className="h-6 w-48 rounded mb-2 animate-pulse"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div
              className="h-4 w-64 rounded animate-pulse"
              style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab bar skeleton */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 rounded-xl shrink-0 animate-pulse"
              style={{
                backgroundColor: i === 0 ? 'var(--color-accent)' : 'var(--color-surface-2)',
                opacity: i === 0 ? 0.4 : 0.3,
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div
                className="h-3 w-20 rounded mb-3"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <div
                className="h-8 w-12 rounded"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div
          className="rounded-2xl p-6 animate-pulse"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-primary)',
          }}
        >
          <div
            className="h-5 w-32 rounded mb-6"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-4"
              style={{ borderBottom: i < 3 ? '1px solid var(--color-primary)' : 'none' }}
            >
              <div
                className="w-10 h-10 rounded-xl shrink-0"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <div className="flex-1">
                <div
                  className="h-4 w-2/3 rounded mb-2"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div
                  className="h-3 w-1/3 rounded"
                  style={{ backgroundColor: 'var(--color-primary)', opacity: 0.6 }}
                />
              </div>
              <div
                className="h-6 w-16 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

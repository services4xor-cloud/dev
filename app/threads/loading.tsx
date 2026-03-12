/**
 * Loading skeleton for /threads — identity community list
 */
export default function ThreadsLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-16 px-4"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="h-8 w-48 mx-auto mb-4 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
          <div
            className="h-5 w-80 mx-auto mb-8 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--color-surface-2)', animationDelay: '150ms' }}
          />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-full animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Thread cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
                <div className="flex-1">
                  <div
                    className="h-4 w-28 rounded mb-2"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  />
                  <div
                    className="h-3 w-20 rounded"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  />
                </div>
              </div>
              <div
                className="h-3 w-full rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-3 w-3/4 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

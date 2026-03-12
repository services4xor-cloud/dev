/**
 * Loading skeleton for /offerings — international opportunities page
 */
export default function OfferingsLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-16 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
        }}
      >
        <div
          className="h-8 w-56 mx-auto rounded-lg mb-3 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-4 w-80 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Country filter pills */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-8 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 rounded-full animate-pulse flex-shrink-0"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>

        {/* Offerings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 60}ms`,
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
                    style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
                  />
                </div>
              </div>
              <div
                className="h-3 w-full rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-3 w-3/4 rounded mb-4"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
              <div className="flex gap-2">
                <div
                  className="h-6 w-16 rounded-full"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
                <div
                  className="h-6 w-20 rounded-full"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

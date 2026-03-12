// Ventures feed loading skeleton — shows while paths/experiences load
export default function VenturesLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-bg))' }}
      >
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
        />
        <div
          className="h-8 w-48 mx-auto rounded-lg mb-3 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-4 w-72 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Filter bar skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--color-surface-2)', animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div className="flex-1">
                  <div
                    className="h-4 w-3/4 rounded mb-2"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                  <div
                    className="h-3 w-1/2 rounded"
                    style={{ backgroundColor: 'var(--color-primary)', opacity: 0.6 }}
                  />
                </div>
              </div>
              <div
                className="h-3 w-full rounded mb-2"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <div
                className="h-3 w-5/6 rounded mb-4"
                style={{ backgroundColor: 'var(--color-primary)', opacity: 0.6 }}
              />
              <div className="flex gap-2">
                <div
                  className="h-6 w-16 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div
                  className="h-6 w-20 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

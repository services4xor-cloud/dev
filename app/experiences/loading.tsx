/**
 * Loading skeleton for /experiences — eco-tourism listing
 */
export default function ExperiencesLoading() {
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
          className="h-8 w-52 mx-auto rounded-lg mb-3 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-4 w-80 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Experience cards grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {/* Image placeholder */}
              <div className="h-48 w-full" style={{ backgroundColor: 'var(--color-surface-2)' }} />
              <div className="p-5">
                <div
                  className="h-5 w-3/4 rounded mb-2"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
                <div
                  className="h-3 w-full rounded mb-2"
                  style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
                />
                <div
                  className="h-3 w-2/3 rounded mb-4"
                  style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
                />
                <div className="flex justify-between items-center">
                  <div
                    className="h-6 w-20 rounded-full"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  />
                  <div
                    className="h-8 w-24 rounded-xl"
                    style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for /experiences/[id] — experience detail page
 */
export default function ExperienceDetailLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Image hero skeleton */}
      <div
        className="h-64 md:h-80 w-full animate-pulse"
        style={{ backgroundColor: 'var(--color-surface-2)' }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 animate-pulse">
            <div
              className="h-8 w-3/4 rounded-lg mb-3"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div className="flex gap-3 mb-6">
              <div
                className="h-6 w-20 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-6 w-24 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
            </div>
            <div className="space-y-3 mb-8">
              <div
                className="h-4 w-full rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-4 w-5/6 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
              <div
                className="h-4 w-4/6 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.3 }}
              />
            </div>
            {/* Highlights */}
            <div
              className="h-6 w-28 rounded mb-4"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg"
                  style={{ backgroundColor: 'var(--color-surface)', animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Booking sidebar */}
          <div
            className="rounded-2xl p-6 h-fit animate-pulse"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
            }}
          >
            <div
              className="h-8 w-28 rounded mb-4"
              style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
            />
            <div className="space-y-4">
              <div
                className="h-12 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-12 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-12 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

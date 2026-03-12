/**
 * Loading skeleton for /profile — Pioneer profile page
 */
export default function ProfileLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Profile header skeleton */}
        <div className="flex items-center gap-6 mb-10">
          <div
            className="w-20 h-20 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
          <div className="flex-1">
            <div
              className="h-6 w-40 rounded-lg mb-3 animate-pulse"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div
              className="h-4 w-56 rounded-lg animate-pulse"
              style={{ backgroundColor: 'var(--color-surface-2)', animationDelay: '100ms' }}
            />
          </div>
        </div>

        {/* Form sections skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 mb-6 animate-pulse"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              animationDelay: `${i * 120}ms`,
            }}
          >
            <div
              className="h-5 w-32 rounded mb-5"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div className="space-y-4">
              <div
                className="h-10 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-10 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

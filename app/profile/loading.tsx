/**
 * Loading skeleton for /profile — Pioneer profile page
 */
export default function ProfileLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Profile header skeleton */}
        <div className="flex items-center gap-phi-4 mb-10">
          <div className="w-20 h-20 rounded-full skeleton-shimmer" />
          <div className="flex-1">
            <div className="h-6 w-40 rounded-lg mb-3 skeleton-shimmer" />
            <div
              className="h-4 w-56 rounded-lg skeleton-shimmer"
              style={{ animationDelay: '100ms' }}
            />
          </div>
        </div>

        {/* Form sections skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-phi-5 mb-phi-4"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="h-5 w-32 rounded mb-5 skeleton-shimmer" />
            <div className="space-y-phi-3">
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

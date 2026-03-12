/**
 * Loading skeleton for /experiences/[id] — experience detail page
 */
export default function ExperienceDetailLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Image hero skeleton */}
      <div className="h-64 md:h-80 w-full skeleton-shimmer" />

      <div className="max-w-4xl mx-auto px-4 py-phi-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5">
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="h-8 w-3/4 rounded-lg mb-3 skeleton-shimmer" />
            <div className="flex gap-3 mb-6">
              <div className="h-6 w-20 rounded-full skeleton-shimmer" />
              <div className="h-6 w-24 rounded-full skeleton-shimmer" />
            </div>
            <div className="space-y-3 mb-8">
              <div className="h-4 w-full rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
              <div className="h-4 w-5/6 rounded skeleton-shimmer" style={{ opacity: 0.4 }} />
              <div className="h-4 w-4/6 rounded skeleton-shimmer" style={{ opacity: 0.3 }} />
            </div>
            {/* Highlights */}
            <div className="h-6 w-28 rounded mb-4 skeleton-shimmer" />
            <div className="grid grid-cols-2 gap-phi-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg skeleton-shimmer"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="glass rounded-2xl p-phi-5 h-fit">
            <div className="h-8 w-28 rounded mb-4 skeleton-shimmer" />
            <div className="space-y-4">
              <div className="h-12 w-full rounded-xl skeleton-shimmer" style={{ opacity: 0.5 }} />
              <div className="h-12 w-full rounded-xl skeleton-shimmer" style={{ opacity: 0.5 }} />
              <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

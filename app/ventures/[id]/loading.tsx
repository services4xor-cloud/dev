/**
 * Loading skeleton for /ventures/[id] — venture detail page
 */
export default function VentureDetailLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Breadcrumb skeleton */}
      <div className="max-w-4xl mx-auto px-4 pt-phi-4">
        <div className="flex gap-2 mb-4">
          <div className="h-4 w-16 rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
          <div className="h-4 w-4 rounded skeleton-shimmer" style={{ opacity: 0.3 }} />
          <div className="h-4 w-32 rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-phi-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5">
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-phi-2 mb-4">
              <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
              <div className="flex-1">
                <div className="h-6 w-3/4 rounded mb-2 skeleton-shimmer" />
                <div className="h-4 w-1/2 rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
              <div className="h-6 w-20 rounded-full skeleton-shimmer" />
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
            </div>
            <div className="space-y-3 mb-8">
              <div className="h-4 w-full rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
              <div className="h-4 w-5/6 rounded skeleton-shimmer" style={{ opacity: 0.4 }} />
              <div className="h-4 w-4/6 rounded skeleton-shimmer" style={{ opacity: 0.3 }} />
              <div className="h-4 w-full rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
              <div className="h-4 w-3/4 rounded skeleton-shimmer" style={{ opacity: 0.4 }} />
            </div>
            {/* Skills section */}
            <div className="h-5 w-20 rounded mb-3 skeleton-shimmer" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-20 rounded-full skeleton-shimmer"
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Apply sidebar */}
          <div className="glass rounded-2xl p-phi-5 h-fit">
            <div className="h-6 w-24 rounded mb-2 skeleton-shimmer" />
            <div className="h-3 w-full rounded mb-6 skeleton-shimmer" style={{ opacity: 0.5 }} />
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded skeleton-shimmer" />
                <div className="h-3 w-20 rounded skeleton-shimmer" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded skeleton-shimmer" />
                <div className="h-3 w-16 rounded skeleton-shimmer" />
              </div>
            </div>
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}

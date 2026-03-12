// Compass wizard loading skeleton — shows while wizard initializes
export default function CompassLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-bg))' }}
      >
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 skeleton-shimmer" />
        <div className="h-8 w-56 mx-auto rounded-lg mb-3 skeleton-shimmer" />
        <div className="h-4 w-80 mx-auto rounded-lg skeleton-shimmer" style={{ opacity: 0.6 }} />
      </div>

      {/* Step progress skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-phi-5">
        <div className="flex justify-between mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full skeleton-shimmer" />
              <div className="h-3 w-16 rounded skeleton-shimmer" style={{ opacity: 0.4 }} />
            </div>
          ))}
        </div>

        {/* Form skeleton */}
        <div className="glass rounded-2xl p-phi-6">
          <div className="h-6 w-48 rounded mb-6 skeleton-shimmer" />
          <div className="space-y-4">
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" style={{ opacity: 0.7 }} />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" style={{ opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

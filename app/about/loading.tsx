/**
 * Loading skeleton for /about — company story page
 */
export default function AboutLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
        }}
      >
        <div className="h-10 w-56 mx-auto rounded-lg mb-4 skeleton-shimmer" />
        <div className="h-5 w-96 mx-auto rounded-lg skeleton-shimmer" style={{ opacity: 0.6 }} />
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Mission section */}
        <div>
          <div className="h-6 w-40 rounded mb-4 skeleton-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
            <div className="h-4 w-5/6 rounded skeleton-shimmer" style={{ opacity: 0.4 }} />
            <div className="h-4 w-4/6 rounded skeleton-shimmer" style={{ opacity: 0.3 }} />
          </div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-phi-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl mb-4 skeleton-shimmer" />
              <div className="h-5 w-24 rounded mb-2 skeleton-shimmer" />
              <div className="h-3 w-full rounded mb-1 skeleton-shimmer" style={{ opacity: 0.5 }} />
              <div className="h-3 w-3/4 rounded skeleton-shimmer" style={{ opacity: 0.4 }} />
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-phi-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="glass text-center p-phi-3 rounded-xl"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-8 w-16 mx-auto rounded mb-2 skeleton-shimmer" />
              <div className="h-3 w-20 mx-auto rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

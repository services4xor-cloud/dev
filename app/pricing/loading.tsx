/**
 * Loading skeleton for /pricing — pricing plans page
 */
export default function PricingLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-16 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
        }}
      >
        <div className="h-10 w-48 mx-auto rounded-lg mb-4 skeleton-shimmer" />
        <div className="h-5 w-72 mx-auto rounded-lg skeleton-shimmer" style={{ opacity: 0.6 }} />
      </div>

      {/* Pricing cards */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-phi-5"
              style={{
                border: i === 1 ? '2px solid var(--color-accent)' : undefined,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div className="h-5 w-24 rounded mb-2 skeleton-shimmer" />
              <div className="h-10 w-28 rounded mb-4 skeleton-shimmer" />
              <div className="h-3 w-full rounded mb-6 skeleton-shimmer" style={{ opacity: 0.5 }} />
              {/* Feature list */}
              <div className="space-y-3 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full skeleton-shimmer" />
                    <div
                      className="h-3 flex-1 rounded skeleton-shimmer"
                      style={{ opacity: 0.5 - j * 0.05 }}
                    />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

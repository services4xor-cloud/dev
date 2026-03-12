/**
 * Loading skeleton for /be/[country] — Country Gate page
 */
export default function CountryGateLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton with flag */}
      <div
        className="py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
        }}
      >
        <div className="w-20 h-14 mx-auto mb-4 rounded-lg skeleton-shimmer" />
        <div className="h-10 w-48 mx-auto rounded-lg mb-3 skeleton-shimmer" />
        <div className="h-5 w-72 mx-auto rounded-lg skeleton-shimmer" style={{ opacity: 0.6 }} />
      </div>

      {/* Stats bar */}
      <div className="max-w-5xl mx-auto px-4 py-phi-4">
        <div className="grid grid-cols-3 gap-phi-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass text-center p-phi-3 rounded-xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-7 w-12 mx-auto rounded mb-2 skeleton-shimmer" />
              <div className="h-3 w-20 mx-auto rounded skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Sectors grid */}
        <div className="h-6 w-36 rounded mb-4 skeleton-shimmer" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-phi-3 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass rounded-xl p-phi-3"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-4 w-24 rounded mb-2 skeleton-shimmer" />
              <div className="h-3 w-full rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>

        {/* Paths section */}
        <div className="h-6 w-32 rounded mb-4 skeleton-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-phi-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-phi-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-5 w-3/4 rounded mb-3 skeleton-shimmer" />
              <div className="h-3 w-full rounded mb-2 skeleton-shimmer" style={{ opacity: 0.5 }} />
              <div className="h-3 w-2/3 rounded skeleton-shimmer" style={{ opacity: 0.4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

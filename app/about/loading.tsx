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
        <div
          className="h-10 w-56 mx-auto rounded-lg mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-5 w-96 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Mission section */}
        <div className="animate-pulse">
          <div
            className="h-6 w-40 rounded mb-4"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
          <div className="space-y-2">
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
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl mb-4"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-5 w-24 rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-3 w-full rounded mb-1"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-3 w-3/4 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--color-surface)', animationDelay: `${i * 80}ms` }}
            >
              <div
                className="h-8 w-16 mx-auto rounded mb-2"
                style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
              />
              <div
                className="h-3 w-20 mx-auto rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for /charity — UTAMADUNI CBO page
 */
export default function CharityLoading() {
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
          className="h-10 w-64 mx-auto rounded-lg mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-5 w-80 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Pillars grid */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
              />
              <div
                className="h-5 w-28 rounded mb-3"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-3 w-full rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-3 w-3/4 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
            </div>
          ))}
        </div>

        {/* Stories section */}
        <div
          className="h-6 w-32 rounded mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="h-4 w-48 rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-3 w-full rounded mb-1"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-3 w-5/6 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

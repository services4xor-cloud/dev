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
        <div
          className="w-20 h-14 mx-auto mb-4 rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-10 w-48 mx-auto rounded-lg mb-3 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-5 w-72 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Stats bar */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--color-surface)', animationDelay: `${i * 100}ms` }}
            >
              <div
                className="h-7 w-12 mx-auto rounded mb-2"
                style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
              />
              <div
                className="h-3 w-20 mx-auto rounded"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
            </div>
          ))}
        </div>

        {/* Sectors grid */}
        <div
          className="h-6 w-36 rounded mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div
                className="h-4 w-24 rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-3 w-full rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
            </div>
          ))}
        </div>

        {/* Paths section */}
        <div
          className="h-6 w-32 rounded mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 animate-pulse"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="h-5 w-3/4 rounded mb-3"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-3 w-full rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-3 w-2/3 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

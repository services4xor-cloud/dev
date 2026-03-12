// Compass wizard loading skeleton — shows while wizard initializes
export default function CompassLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-bg))' }}
      >
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
        />
        <div
          className="h-8 w-56 mx-auto rounded-lg mb-3 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-4 w-80 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Step progress skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-full animate-pulse"
                style={{
                  backgroundColor: i === 0 ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  opacity: i === 0 ? 0.5 : 0.3,
                }}
              />
              <div
                className="h-3 w-16 rounded animate-pulse"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
            </div>
          ))}
        </div>

        {/* Form skeleton */}
        <div
          className="rounded-2xl p-8 animate-pulse"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-primary)',
          }}
        >
          <div
            className="h-6 w-48 rounded mb-6"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div className="space-y-4">
            <div
              className="h-12 w-full rounded-xl"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <div
              className="h-12 w-full rounded-xl"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.7 }}
            />
            <div
              className="h-12 w-full rounded-xl"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

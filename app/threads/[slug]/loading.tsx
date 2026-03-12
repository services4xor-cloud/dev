/**
 * Loading skeleton for /threads/[slug] — thread detail page
 */
export default function ThreadDetailLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Thread header */}
      <div
        className="py-12 px-4"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4 animate-pulse">
            <div
              className="w-14 h-14 rounded-2xl"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div className="flex-1">
              <div
                className="h-7 w-48 rounded-lg mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-4 w-72 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
              />
            </div>
          </div>
          <div className="flex gap-4 animate-pulse">
            <div
              className="h-8 w-24 rounded-full"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div
              className="h-8 w-20 rounded-full"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div
              className="h-8 w-28 rounded-full"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
          </div>
        </div>
      </div>

      {/* Members + content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-5 animate-pulse"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-primary)',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  />
                  <div
                    className="h-4 w-24 rounded"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  />
                </div>
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

          {/* Sidebar */}
          <div
            className="rounded-2xl p-5 h-fit animate-pulse"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
            }}
          >
            <div
              className="h-5 w-20 rounded mb-4"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  />
                  <div
                    className="h-3 w-20 rounded"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

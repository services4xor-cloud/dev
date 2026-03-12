/**
 * Loading skeleton for /ventures/[id] — venture detail page
 */
export default function VentureDetailLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Breadcrumb skeleton */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-4 animate-pulse">
          <div
            className="h-4 w-16 rounded"
            style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
          />
          <div
            className="h-4 w-4 rounded"
            style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.3 }}
          />
          <div
            className="h-4 w-32 rounded"
            style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div className="flex-1">
                <div
                  className="h-6 w-3/4 rounded mb-2"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
                <div
                  className="h-4 w-1/2 rounded"
                  style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
                />
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              <div
                className="h-6 w-16 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-6 w-20 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-6 w-16 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
            </div>
            <div className="space-y-3 mb-8">
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
              <div
                className="h-4 w-full rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
              <div
                className="h-4 w-3/4 rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.4 }}
              />
            </div>
            {/* Skills section */}
            <div
              className="h-5 w-20 rounded mb-3"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
            />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-20 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    animationDelay: `${i * 40}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Apply sidebar */}
          <div
            className="rounded-2xl p-6 h-fit animate-pulse"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
            }}
          >
            <div
              className="h-6 w-24 rounded mb-2"
              style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
            />
            <div
              className="h-3 w-full rounded mb-6"
              style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
            />
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div
                  className="h-3 w-16 rounded"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
                <div
                  className="h-3 w-20 rounded"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
              </div>
              <div className="flex justify-between">
                <div
                  className="h-3 w-16 rounded"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
                <div
                  className="h-3 w-16 rounded"
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                />
              </div>
            </div>
            <div
              className="h-12 w-full rounded-xl"
              style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

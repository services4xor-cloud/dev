/**
 * Loading skeleton for /contact — contact form page
 */
export default function ContactLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div
        className="py-16 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 100%)',
        }}
      >
        <div
          className="h-8 w-40 mx-auto rounded-lg mb-3 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-4 w-64 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Form skeleton */}
      <div className="max-w-xl mx-auto px-4 py-10">
        <div
          className="rounded-2xl p-8 animate-pulse"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
          }}
        >
          <div className="space-y-6">
            {/* Name field */}
            <div>
              <div
                className="h-3 w-16 rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-12 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
            </div>
            {/* Email field */}
            <div>
              <div
                className="h-3 w-14 rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-12 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
            </div>
            {/* Subject field */}
            <div>
              <div
                className="h-3 w-20 rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-12 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
            </div>
            {/* Message field */}
            <div>
              <div
                className="h-3 w-24 rounded mb-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              />
              <div
                className="h-32 w-full rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
            </div>
            {/* Submit button */}
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

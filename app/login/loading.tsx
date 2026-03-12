/**
 * Loading skeleton for /login — authentication page
 */
export default function LoginLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 animate-pulse"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-primary)',
        }}
      >
        {/* Logo placeholder */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6"
          style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
        />
        <div
          className="h-7 w-32 mx-auto rounded-lg mb-8"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />

        {/* OAuth button */}
        <div
          className="h-12 w-full rounded-xl mb-6"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-surface-2)' }} />
          <div
            className="h-3 w-8 rounded"
            style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
          />
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-surface-2)' }} />
        </div>

        {/* Form fields */}
        <div className="space-y-4">
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
          <div
            className="h-12 w-full rounded-xl"
            style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

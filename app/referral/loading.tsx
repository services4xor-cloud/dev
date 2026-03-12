/**
 * Loading skeleton for /referral — referral program page
 */
export default function ReferralLoading() {
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
          className="h-8 w-52 mx-auto rounded-lg mb-3 animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        />
        <div
          className="h-4 w-72 mx-auto rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.6 }}
        />
      </div>

      {/* Stats + referral card */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Referral code card */}
        <div
          className="rounded-2xl p-6 mb-8 animate-pulse"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
          }}
        >
          <div
            className="h-4 w-32 rounded mb-4"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          />
          <div
            className="h-12 w-full rounded-xl mb-4"
            style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
          />
          <div
            className="h-10 w-32 rounded-xl"
            style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--color-surface)', animationDelay: `${i * 80}ms` }}
            >
              <div
                className="h-8 w-12 mx-auto rounded mb-2"
                style={{ backgroundColor: 'var(--color-accent)', opacity: 0.3 }}
              />
              <div
                className="h-3 w-16 mx-auto rounded"
                style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.5 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

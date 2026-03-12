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
        <div className="h-8 w-52 mx-auto rounded-lg mb-3 skeleton-shimmer" />
        <div className="h-4 w-72 mx-auto rounded-lg skeleton-shimmer" style={{ opacity: 0.6 }} />
      </div>

      {/* Stats + referral card */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Referral code card */}
        <div className="glass rounded-2xl p-phi-5 mb-8">
          <div className="h-4 w-32 rounded mb-4 skeleton-shimmer" />
          <div className="h-12 w-full rounded-xl mb-4 skeleton-shimmer" style={{ opacity: 0.5 }} />
          <div className="h-10 w-32 rounded-xl skeleton-shimmer" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-phi-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass text-center p-phi-3 rounded-xl"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-8 w-12 mx-auto rounded mb-2 skeleton-shimmer" />
              <div className="h-3 w-16 mx-auto rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

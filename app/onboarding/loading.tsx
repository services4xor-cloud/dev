// Onboarding flow loading skeleton
export default function OnboardingLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-xl w-full mx-auto px-4">
        {/* Progress bar skeleton */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full skeleton-shimmer"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Card skeleton */}
        <div className="glass rounded-2xl p-phi-6">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 skeleton-shimmer" />
          <div className="h-7 w-56 mx-auto rounded mb-3 skeleton-shimmer" />
          <div
            className="h-4 w-72 mx-auto rounded mb-8 skeleton-shimmer"
            style={{ opacity: 0.6 }}
          />
          <div className="space-y-3">
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" style={{ opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

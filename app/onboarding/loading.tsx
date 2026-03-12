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
              className="h-1.5 flex-1 rounded-full animate-pulse"
              style={{
                backgroundColor: i === 0 ? 'var(--color-accent)' : 'var(--color-surface-2)',
                opacity: i === 0 ? 0.5 : 0.3,
                animationDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>

        {/* Card skeleton */}
        <div
          className="rounded-2xl p-8 animate-pulse"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-primary)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div
            className="h-7 w-56 mx-auto rounded mb-3"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div
            className="h-4 w-72 mx-auto rounded mb-8"
            style={{ backgroundColor: 'var(--color-primary)', opacity: 0.6 }}
          />
          <div className="space-y-3">
            <div
              className="h-12 w-full rounded-xl"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <div
              className="h-12 w-full rounded-xl"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.7 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

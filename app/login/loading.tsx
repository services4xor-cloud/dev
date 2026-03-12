/**
 * Loading skeleton for /login — authentication page
 */
export default function LoginLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="glass w-full max-w-md rounded-2xl p-phi-6">
        {/* Logo placeholder */}
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 skeleton-shimmer" />
        <div className="h-7 w-32 mx-auto rounded-lg mb-8 skeleton-shimmer" />

        {/* OAuth button */}
        <div className="h-12 w-full rounded-xl mb-6 skeleton-shimmer" />

        {/* Divider */}
        <div className="flex items-center gap-phi-3 mb-6">
          <div className="flex-1 h-px skeleton-shimmer" />
          <div className="h-3 w-8 rounded skeleton-shimmer" style={{ opacity: 0.5 }} />
          <div className="flex-1 h-px skeleton-shimmer" />
        </div>

        {/* Form fields */}
        <div className="space-y-phi-3">
          <div>
            <div className="h-3 w-14 rounded mb-2 skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" style={{ opacity: 0.5 }} />
          </div>
          <div>
            <div className="h-3 w-20 rounded mb-2 skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" style={{ opacity: 0.5 }} />
          </div>
          <div className="h-12 w-full rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}

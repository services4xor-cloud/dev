// Server Component — no 'use client' needed
// Global loading state shown while pages load

export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="flex flex-col items-center gap-phi-4">
        {/* Lion paw spinning emblem */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-spin"
          style={{
            backgroundColor: 'var(--color-primary)',
            border: '2px solid var(--color-accent)',
            animationDuration: '2s',
          }}
        >
          🐾
        </div>

        {/* Tagline fading */}
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: 'var(--color-accent)', animationDuration: '1.5s' }}
        >
          Your compass is loading...
        </p>

        {/* Three bouncing gold dots */}
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-accent)',
              animationDelay: '0ms',
              animationDuration: '1s',
            }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-accent)',
              animationDelay: '150ms',
              animationDuration: '1s',
            }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-accent)',
              animationDelay: '300ms',
              animationDuration: '1s',
            }}
          />
        </div>
      </div>
    </div>
  )
}

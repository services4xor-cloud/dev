'use client'

// Reusable shimmer skeleton components using BeKenya brand colors
// Brand: Maroon #5C0A14, Gold #C9A227, Dark bg #0A0A12 / #1A1A25

// Shimmer animation applied via inline keyframe style injected once
function ShimmerBase({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className ?? ''}`}
      style={{ backgroundColor: '#1A1A25', ...style }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.08) 50%, transparent 100%)',
          animation: 'shimmer 1.8s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

// ---- Venture Card Skeleton ----
// Matches the safari package / path cards on Experiences / Ventures pages
export function VentureCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: '#13131E', border: '1px solid #5C0A14' }}
    >
      {/* Image placeholder */}
      <ShimmerBase className="h-40 w-full rounded-xl" />

      {/* Title */}
      <ShimmerBase className="h-5 w-3/4 rounded-md" />

      {/* Provider / badge row */}
      <div className="flex gap-2">
        <ShimmerBase className="h-4 w-1/3 rounded-full" />
        <ShimmerBase className="h-4 w-1/4 rounded-full" />
      </div>

      {/* Description lines */}
      <ShimmerBase className="h-3 w-full rounded-md" />
      <ShimmerBase className="h-3 w-5/6 rounded-md" />

      {/* Price + CTA row */}
      <div className="flex items-center justify-between mt-1">
        <ShimmerBase className="h-6 w-1/3 rounded-md" />
        <ShimmerBase className="h-9 w-1/3 rounded-xl" />
      </div>
    </div>
  )
}

// ---- Pioneer Profile Skeleton ----
// Matches the Pioneer / job-seeker profile cards
export function PioneerProfileSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex gap-4"
      style={{ backgroundColor: '#13131E', border: '1px solid #5C0A14' }}
    >
      {/* Avatar */}
      <ShimmerBase className="h-14 w-14 flex-shrink-0 rounded-full" style={{ borderRadius: '9999px' }} />

      <div className="flex-1 flex flex-col gap-2">
        {/* Name */}
        <ShimmerBase className="h-4 w-2/5 rounded-md" />
        {/* Role tag */}
        <ShimmerBase className="h-3 w-1/3 rounded-full" />
        {/* Bio lines */}
        <ShimmerBase className="h-3 w-full rounded-md" />
        <ShimmerBase className="h-3 w-4/5 rounded-md" />
        {/* Skills row */}
        <div className="flex gap-2 mt-1">
          <ShimmerBase className="h-6 w-16 rounded-full" />
          <ShimmerBase className="h-6 w-12 rounded-full" />
          <ShimmerBase className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ---- Compass Skeleton ----
// Matches the Compass / dashboard reading card
export function CompassSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: '#13131E', border: '1px solid #C9A227' }}
    >
      {/* Header with icon */}
      <div className="flex items-center gap-3">
        <ShimmerBase
          className="w-10 h-10 flex-shrink-0"
          style={{ borderRadius: '50%', backgroundColor: '#5C0A14' }}
        />
        <div className="flex-1 flex flex-col gap-1.5">
          <ShimmerBase className="h-4 w-1/2 rounded-md" />
          <ShimmerBase className="h-3 w-1/3 rounded-md" />
        </div>
      </div>

      {/* Reading meter bar */}
      <div className="rounded-full overflow-hidden h-2" style={{ backgroundColor: '#1A1A25' }}>
        <ShimmerBase className="h-2 w-3/5 rounded-full" style={{ borderRadius: '9999px' }} />
      </div>

      {/* Insight lines */}
      <ShimmerBase className="h-3 w-full rounded-md" />
      <ShimmerBase className="h-3 w-11/12 rounded-md" />
      <ShimmerBase className="h-3 w-3/4 rounded-md" />

      {/* CTA button */}
      <ShimmerBase className="h-10 w-1/2 rounded-xl mt-2" />
    </div>
  )
}

// ---- Page Header Skeleton ----
// Matches the top hero / breadcrumb area of most pages
export function PageHeaderSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4 py-12 px-4">
      {/* Badge pill */}
      <ShimmerBase className="h-7 w-36 rounded-full" />

      {/* H1 title */}
      <ShimmerBase className="h-10 w-2/3 max-w-xl rounded-lg" />
      <ShimmerBase className="h-10 w-1/2 max-w-md rounded-lg" />

      {/* Subtitle */}
      <ShimmerBase className="h-4 w-3/5 max-w-lg rounded-md mt-1" />
      <ShimmerBase className="h-4 w-2/5 max-w-sm rounded-md" />

      {/* CTA row */}
      <div className="flex gap-3 mt-2">
        <ShimmerBase className="h-11 w-32 rounded-xl" />
        <ShimmerBase className="h-11 w-28 rounded-xl" />
      </div>
    </div>
  )
}

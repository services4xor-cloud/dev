'use client'

import RouteError from '@/components/ui/RouteError'

export default function AnchorDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="⚓"
      title="Anchor dashboard error"
      description="Something went wrong loading your Anchor dashboard."
      contextLabel="Anchor Dashboard"
      error={error}
      reset={reset}
    />
  )
}

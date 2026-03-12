'use client'

import RouteError from '@/components/ui/RouteError'

export default function PioneerDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="🌍"
      title="Pioneer dashboard error"
      description="Something went wrong loading your Pioneer dashboard."
      contextLabel="Pioneer Dashboard"
      error={error}
      reset={reset}
    />
  )
}

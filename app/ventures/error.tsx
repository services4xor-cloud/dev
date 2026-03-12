'use client'

import RouteError from '@/components/ui/RouteError'

export default function VenturesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="🗺️"
      title="Ventures unavailable"
      description="Something went wrong loading ventures. Please try again."
      contextLabel="Ventures"
      error={error}
      reset={reset}
    />
  )
}

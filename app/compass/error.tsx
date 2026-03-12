'use client'

import RouteError from '@/components/ui/RouteError'

export default function CompassError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="🧭"
      title="Compass recalibrating"
      description="Something went wrong loading the Compass wizard. Let's try again."
      contextLabel="Compass"
      retryLabel="Recalibrate"
      error={error}
      reset={reset}
    />
  )
}

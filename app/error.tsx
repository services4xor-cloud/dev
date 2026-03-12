'use client'

import RouteError from '@/components/ui/RouteError'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="🦁"
      title="Something went wrong"
      description="Something went wrong on this route."
      contextLabel="BeNetwork"
      returnLabel="Return to Compass"
      error={error}
      reset={reset}
    />
  )
}

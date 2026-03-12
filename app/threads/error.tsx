'use client'

import RouteError from '@/components/ui/RouteError'

export default function ThreadsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="💬"
      title="Threads unavailable"
      description="Something went wrong loading threads."
      contextLabel="Threads"
      error={error}
      reset={reset}
    />
  )
}

'use client'

import RouteError from '@/components/ui/RouteError'

export default function ExperienceDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="✨"
      title="Experience unavailable"
      description="Something went wrong loading this experience."
      contextLabel="Experience Detail"
      error={error}
      reset={reset}
    />
  )
}

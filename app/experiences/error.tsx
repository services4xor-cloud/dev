'use client'

import RouteError from '@/components/ui/RouteError'

export default function ExperiencesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="✨"
      title="Experiences unavailable"
      description="Something went wrong loading experiences."
      contextLabel="Experiences"
      error={error}
      reset={reset}
    />
  )
}

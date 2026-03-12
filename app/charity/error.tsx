'use client'

import RouteError from '@/components/ui/RouteError'

export default function CharityError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="💚"
      title="UTAMADUNI page unavailable"
      description="We couldn't load the charity page right now. Please try again."
      contextLabel="Charity"
      error={error}
      reset={reset}
    />
  )
}

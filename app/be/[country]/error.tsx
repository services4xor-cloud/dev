'use client'

import RouteError from '@/components/ui/RouteError'

export default function CountryGateError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="🌐"
      title="Country gate error"
      description="Something went wrong loading this country page."
      contextLabel="Country Gate"
      error={error}
      reset={reset}
    />
  )
}

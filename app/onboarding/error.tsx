'use client'

import RouteError from '@/components/ui/RouteError'

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="🚀"
      title="Onboarding error"
      description="Something went wrong during onboarding. Please try again."
      contextLabel="Onboarding"
      error={error}
      reset={reset}
    />
  )
}

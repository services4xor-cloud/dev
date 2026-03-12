'use client'

import RouteError from '@/components/ui/RouteError'

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="👤"
      title="Profile error"
      description="Something went wrong loading your profile."
      contextLabel="Profile"
      error={error}
      reset={reset}
    />
  )
}

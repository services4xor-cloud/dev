'use client'

import RouteError from '@/components/ui/RouteError'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      emoji="⚙️"
      title="Admin panel error"
      description="Something went wrong loading the admin dashboard."
      contextLabel="Admin"
      returnLabel="Return to Compass"
      error={error}
      reset={reset}
    />
  )
}

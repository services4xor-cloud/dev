'use client'

/**
 * Providers — Client-side context providers wrapper
 *
 * Wraps the app with:
 *   1. NextAuth SessionProvider — for useSession() in client components
 *   2. IdentityProvider — for useIdentity() (country/thread selection)
 */

import { SessionProvider } from 'next-auth/react'
import { IdentityProvider } from '@/lib/identity-context'
import { XPProvider } from '@/components/XPProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <IdentityProvider>
        <XPProvider>{children}</XPProvider>
      </IdentityProvider>
    </SessionProvider>
  )
}

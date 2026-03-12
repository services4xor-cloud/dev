'use client'

import { useIdentity } from '@/lib/identity-context'
import WowHero from '@/components/WowHero'
import Discovery from '@/components/Discovery'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { hasCompletedDiscovery } = useIdentity()
  const [showDiscovery, setShowDiscovery] = useState(false)
  const router = useRouter()

  // If user already completed discovery, show a simplified landing
  // with "Enter My World" CTA (don't force them through Discovery again)

  return (
    <main className="bg-brand-bg min-h-screen">
      {hasCompletedDiscovery ? (
        // Returning user: show WowHero with "Enter My World" CTA
        <WowHero onBegin={() => router.push('/world')} returning />
      ) : !showDiscovery ? (
        <WowHero onBegin={() => setShowDiscovery(true)} />
      ) : (
        <Discovery />
      )}
    </main>
  )
}

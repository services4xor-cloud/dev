import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: `Get Started — ${BRAND_NAME}`,
  description: `Tell us about yourself. Complete your Pioneer profile in 5 steps and unlock personalized Paths and Ventures.`,
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

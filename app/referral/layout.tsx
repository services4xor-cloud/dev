import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `Referral Program — ${BRAND_NAME}`,
  description: `Earn rewards by referring Pioneers and Anchors to ${BRAND_NAME}. Share the platform and help your community grow.`,
}

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

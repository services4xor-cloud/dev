import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `International Offerings — ${BRAND_NAME}`,
  description: `Explore international Paths and Ventures. Work, study, and thrive across borders with ${BRAND_NAME}'s global network.`,
}

export default function OfferingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

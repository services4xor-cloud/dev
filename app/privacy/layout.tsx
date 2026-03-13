import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND_NAME}`,
  description: `Privacy policy for ${BRAND_NAME}. How we collect, use, and protect your data across the BeNetwork platform.`,
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

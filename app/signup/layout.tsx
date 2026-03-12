import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `Join — ${BRAND_NAME}`,
  description: `Create your ${BRAND_NAME} account. Start exploring Paths, book Ventures, and connect with Anchors across the globe.`,
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

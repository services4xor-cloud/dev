import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: `Contact — ${BRAND_NAME}`,
  description: `Get in touch with ${BRAND_NAME}. Questions about Paths, Ventures, Anchors, or partnerships? We're here to help.`,
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

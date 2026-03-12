import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `Media — ${BRAND_NAME}`,
  description: `${BRAND_NAME} in the news. Press coverage, media kit, and stories about our mission to connect Pioneers with global opportunities.`,
}

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

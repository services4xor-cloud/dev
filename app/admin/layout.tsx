import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `Admin Dashboard — ${BRAND_NAME}`,
  description: `Platform administration panel for ${BRAND_NAME}. Manage Pioneers, Anchors, Paths, and analytics.`,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

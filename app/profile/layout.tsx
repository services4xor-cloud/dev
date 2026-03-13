import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: `My Profile — ${BRAND_NAME}`,
  description: `Manage your ${BRAND_NAME} Pioneer profile. Update your skills, preferences, and identity settings.`,
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

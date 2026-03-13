import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: `Sign In — ${BRAND_NAME}`,
  description: `Sign in to your ${BRAND_NAME} account. Access your Pioneer dashboard, saved Paths, and Venture bookings.`,
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `Reset Password — ${BRAND_NAME}`,
  description: `Reset your ${BRAND_NAME} account password. Get a secure reset link sent to your email.`,
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

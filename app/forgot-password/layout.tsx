import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password to regain access to your account.',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}

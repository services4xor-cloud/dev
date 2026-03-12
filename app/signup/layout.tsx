import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your account and begin your journey.',
}
export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}

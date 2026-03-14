import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Threads',
  description: 'Join identity-based community discussions',
}

export default function ThreadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

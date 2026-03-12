import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Stay updated with your latest matches, messages, and opportunities.',
}
export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `Threads — ${BRAND_NAME}`,
  description: `Join identity communities on ${BRAND_NAME}. Connect with people who share your culture, language, tribe, and interests.`,
}

export default function ThreadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

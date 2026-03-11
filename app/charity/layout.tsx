import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: 'UTAMADUNI — Community Impact',
  description: `UTAMADUNI CBO: 5% of every ${BRAND_NAME} booking goes to community development in Kenya. Education, clean water, cultural preservation — powered by every Pioneer path booked.`,
  openGraph: {
    title: 'UTAMADUNI — Community by Design',
    description:
      'Every booking funds community impact. Education, clean water, cultural preservation in Kenya. Built into the BeNetwork from the start.',
    images: [
      { url: '/og?title=UTAMADUNI+Community&sub=5%25+of+every+booking', width: 1200, height: 630 },
    ],
  },
}

export default function CharityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

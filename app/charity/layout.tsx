import type { Metadata } from 'next'
import { BRAND_NAME, IMPACT_PARTNER } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: `${IMPACT_PARTNER.name} — Community Impact`,
  description: `${IMPACT_PARTNER.name} CBO: 5% of every ${BRAND_NAME} booking goes to community development in Kenya. Education, clean water, cultural preservation — powered by every Pioneer path booked.`,
  openGraph: {
    title: `${IMPACT_PARTNER.name} — Community by Design`,
    description:
      'Every booking funds community impact. Education, clean water, cultural preservation in Kenya. Built into the BeNetwork from the start.',
    images: [
      {
        url: `/og?title=${encodeURIComponent(IMPACT_PARTNER.name)}+Community&sub=5%25+of+every+booking`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function CharityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

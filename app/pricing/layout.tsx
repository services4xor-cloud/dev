import type { Metadata } from 'next'
import { COUNTRIES } from '@/lib/countries'

const CC = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE') as keyof typeof COUNTRIES
const cur = COUNTRIES[CC]?.currency ?? 'KES'

export const metadata: Metadata = {
  title: 'Pricing',
  description: `Transparent pricing for Anchors and Pioneers. Post Paths from ${cur} 500. Featured placements, unlimited listings, and priority matching available. M-Pesa, Stripe, and Flutterwave accepted.`,
  openGraph: {
    title: 'Pricing — Be[Country] Anchor Plans',
    description: `Simple, fair pricing. ${cur} 500 Basic · ${cur} 2,000 Featured · ${cur} 5,000 Premium. M-Pesa + Stripe + Flutterwave.`,
    images: [
      {
        url: '/og?title=Pricing&sub=Basic+%C2%B7+Featured+%C2%B7+Premium',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

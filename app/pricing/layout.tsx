import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent pricing for Anchors and Pioneers. Post Paths from KES 500. Featured placements, unlimited listings, and priority matching available. M-Pesa, Stripe, and Flutterwave accepted.',
  openGraph: {
    title: 'Pricing — Be[Country] Anchor Plans',
    description: 'Simple, fair pricing. KES 500 Basic · KES 2,000 Featured · KES 5,000 Premium. M-Pesa + Stripe + Flutterwave.',
    images: [{ url: '/og?title=Pricing&sub=Basic+%C2%B7+Featured+%C2%B7+Premium', width: 1200, height: 630 }],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

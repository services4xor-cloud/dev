import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ventures',
  description: 'Explore all Ventures — professional paths, safari experiences, creative gigs, and business opportunities. From Maasai Mara safaris to tech pioneer roles across 12 countries.',
  openGraph: {
    title: 'Ventures — Paths & Experiences | Be[Country]',
    description: 'Safari guides, software pioneers, eco-tourism, and more. Discover ventures across Kenya and beyond. Pay with M-Pesa, Stripe, or Flutterwave.',
    images: [{ url: '/og?title=Ventures&sub=Paths+%C2%B7+Safaris+%C2%B7+Experiences&type=venture', width: 1200, height: 630 }],
  },
}

export default function VenturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

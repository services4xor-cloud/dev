import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BeKenya Family Ltd',
  description: 'BeKenya Family Ltd — the Kenyan company behind the BeNetwork. eCitizen registered, KCB/Equity banked, M-Pesa licensed. 20% Kenyan ownership structure.',
  openGraph: {
    title: 'BeKenya Family Ltd — Business Structure',
    description: 'Transparent ownership. Kenyan-registered. M-Pesa business. UTAMADUNI affiliated. Built to last.',
    images: [{ url: '/og?title=BeKenya+Family+Ltd&sub=Business+Structure', width: 1200, height: 630 }],
  },
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

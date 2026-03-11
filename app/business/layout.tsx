import type { Metadata } from 'next'
import { BRAND_NAME, LEGAL } from '@/data/mock/config'

export const metadata: Metadata = {
  title: LEGAL.companyName,
  description: `${LEGAL.companyName} — the Kenyan company behind the BeNetwork. eCitizen registered, KCB/Equity banked, M-Pesa licensed. 20% Kenyan ownership structure.`,
  openGraph: {
    title: `${LEGAL.companyName} — Business Structure`,
    description:
      'Transparent ownership. Kenyan-registered. M-Pesa business. UTAMADUNI affiliated. Built to last.',
    images: [
      {
        url: `/og?title=${encodeURIComponent(LEGAL.companyName)}&sub=Business+Structure`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

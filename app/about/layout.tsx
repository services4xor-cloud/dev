import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Be[Country] is the BeNetwork — an identity-first compass connecting people with dignified work, extraordinary experiences, and community across countries. Born in Kenya. Built for everywhere.',
  openGraph: {
    title: 'About Be[Country] — The BeNetwork',
    description: 'Our mission: dignified paths for everyone, everywhere. Connecting Kenya and the world through open trade, fair work, and community impact.',
    images: [{ url: '/og?title=About+Be%5BCountry%5D&sub=Mission+%C2%B7+Values+%C2%B7+Impact', width: 1200, height: 630 }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

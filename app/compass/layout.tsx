import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compass',
  description: 'Your smart route finder. Tell us who you are and where you want to go — the Compass matches you with the right paths, experiences, and corridors across 12 countries.',
  openGraph: {
    title: 'Compass — Find Your Route | Be[Country]',
    description: 'Identity-first routing. Kenya to Germany, Kenya to UAE, Kenya to UK — we score every route by demand, fit, and opportunity. Start your compass now.',
    images: [{ url: '/og?title=Start+Your+Compass&sub=Identity-first+country+routing', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/compass',
  },
}

export default function CompassLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

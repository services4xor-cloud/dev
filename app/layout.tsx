import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#5C0A14',
}

export const metadata: Metadata = {
  title: { default: 'Be[X] — Identity-First Life Routing', template: '%s | Be[X]' },
  description:
    'Define who you are — country, tribe, language, craft, faith — and connect to paths, people, and experiences that match your identity.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://becountry.com'),
  openGraph: {
    type: 'website',
    siteName: 'Be[X]',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Be[X]',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to MapTiler CDN — saves ~200-400ms on first tile load */}
        <link rel="preconnect" href="https://api.maptiler.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.maptiler.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

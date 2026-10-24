import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/schibsted-grotesk'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/montserrat'
import Providers from '@/components/Providers'
import SiteChrome from '@/components/site/SiteChrome'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#17483c',
  // Lets the page reach under the iPhone notch and toolbar; padding uses env(safe-area-inset-*)
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: { default: 'Be[X] — Identity-First Life Routing', template: '%s | Be[X]' },
  description:
    'Define who you are — country, tribe, language, craft, faith — and connect to opportunities, people, and experiences that match your identity.',
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
      <body className="font-sans antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  )
}

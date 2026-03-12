import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import Providers from '@/components/Providers'
import { BRAND_NAME, LEGAL } from '@/data/mock/config'
import { COUNTRY_META } from '@/lib/countries'
import './globals.css'

// ── Fonts ──────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

// ── Site metadata (country-aware) ──────────────────────────────────
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bekenya.com'
const countryCode = process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE'

const meta = COUNTRY_META[countryCode] ?? COUNTRY_META.KE

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: meta.title,
    template: `%s | ${meta.brandName} — The BeNetwork`,
  },
  description: meta.description,

  keywords: [
    'BeNetwork',
    meta.brandName,
    `paths in ${meta.brandName.replace('Be', '')}`,
    `work in ${meta.brandName.replace('Be', '')}`,
    'country routing',
    'identity-first platform',
    'dignified work',
    'cultural exchange',
  ],

  authors: [{ name: LEGAL.companyName, url: siteUrl }],
  creator: LEGAL.companyName,
  publisher: LEGAL.companyName,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: `${meta.brandName} — The BeNetwork`,
    title: meta.title,
    description: meta.description,
    images: [
      { url: '/og', width: 1200, height: 630, alt: `${meta.brandName} — Find where you belong.` },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: ['/og'],
    creator: meta.twitter,
  },

  icons: { icon: '/logo-circle.svg', shortcut: '/logo-circle.svg', apple: '/logo.svg' },
  manifest: '/manifest.webmanifest',
  alternates: { canonical: siteUrl },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: 'var(--color-primary)' },
    { media: '(prefers-color-scheme: light)', color: 'var(--color-primary)' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ── Root layout ────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-brand-bg text-brand-text font-sans antialiased flex flex-col min-h-screen">
        <Providers>
          <Nav />
          <main id="main-content" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { IdentityProvider } from '@/lib/identity-context'
import { BRAND_NAME, LEGAL } from '@/data/mock/config'
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

const COUNTRY_META: Record<string, { title: string; description: string; twitter: string }> = {
  KE: {
    title: `${BRAND_NAME} — Find Where You Belong. Go There.`,
    description:
      'An identity-first compass for Pioneers. Safari paths, professional ventures, community impact — Kenya-first, globally connected. M-Pesa, Stripe, Flutterwave.',
    twitter: `@${BRAND_NAME}`,
  },
  DE: {
    title: 'BeGermany — Find Your Path in Germany.',
    description:
      'Your compass for professional paths, experiences, and community in Germany. SEPA payments, skilled worker routes, European connections.',
    twitter: '@BeGermany',
  },
}

const meta = COUNTRY_META[countryCode] ?? COUNTRY_META.KE

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: meta.title,
    template: `%s | Be[Country] — The BeNetwork`,
  },
  description: meta.description,

  keywords: [
    'BeNetwork',
    'Kenya jobs',
    'safari guide jobs Kenya',
    'work in Kenya',
    'Africa opportunities',
    'M-Pesa',
    'Kenya careers',
    'Maasai Mara safari',
    'eco-tourism Kenya',
    'work abroad Kenya',
    'country routing',
    'dignified work Africa',
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
    siteName: 'Be[Country]',
    title: meta.title,
    description: meta.description,
    images: [{ url: '/og', width: 1200, height: 630, alt: 'Be[Country] — Find where you belong.' }],
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
        <IdentityProvider>
          <Nav />
          <main id="main-content" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </IdentityProvider>
      </body>
    </html>
  )
}

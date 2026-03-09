import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://bekenya.com'),
  title: {
    default: 'BeKenya — Find Where You Belong. Go There.',
    template: '%s | BeKenya — The BeNetwork',
  },
  description:
    'BeKenya is the BeNetwork — an identity-first compass for Pioneers who want to move, grow, and belong somewhere extraordinary. Safaris, professional paths, creative ventures. Kenya-first, globally connected.',
  keywords: [
    'Kenya jobs',
    'safari guide jobs Kenya',
    'work in Kenya',
    'BeKenya',
    'Africa opportunities',
    'M-Pesa',
    'Kenya careers',
    'Maasai Mara safari',
    'eco-tourism Kenya',
    'work abroad from Kenya',
    'Kenya talent',
    'BeNetwork',
  ],
  authors: [{ name: 'BeKenya Family Ltd', url: 'https://bekenya.com' }],
  creator: 'BeKenya Family Ltd',
  publisher: 'BeKenya Family Ltd',
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
    url: 'https://bekenya.com',
    siteName: 'BeKenya',
    title: 'BeKenya — Find Where You Belong. Go There.',
    description:
      "BeKenya is not a job board. It's a compass — for Pioneers who want to move, grow, and belong somewhere extraordinary.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BeKenya — The BeNetwork. Find where you belong.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeKenya — Find Where You Belong. Go There.',
    description: "BeKenya is not a job board. It's a compass for Pioneers.",
    images: ['/og-image.png'],
    creator: '@BeKenya',
  },
  icons: {
    icon: '/logo-bekenya-circle.svg',
    shortcut: '/logo-bekenya-circle.svg',
    apple: '/logo-bekenya.svg',
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: 'https://bekenya.com',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#5C0A14' },
    { media: '(prefers-color-scheme: light)', color: '#5C0A14' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#0A0A0F] text-[#F5F0E8] font-sans antialiased">
        <Nav />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}

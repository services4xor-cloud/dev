import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
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
  title: 'Bekenya — International Jobs, Powered by M-Pesa',
  description:
    'Find international jobs and hire global talent. Pay with M-Pesa, Stripe, Flutterwave and more. Mobile-first job platform built for Kenya and the world.',
  keywords: ['jobs in Kenya', 'international jobs', 'M-Pesa payments', 'remote jobs Africa', 'Nairobi jobs'],
  openGraph: {
    title: 'Bekenya — International Jobs, Powered by M-Pesa',
    description: 'The world\'s best job platform for Kenyan talent and global employers.',
    url: 'https://bekenya.com',
    siteName: 'Bekenya',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bekenya — International Jobs',
    description: 'Find jobs. Get paid via M-Pesa. Work with the world.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF6B35',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  )
}

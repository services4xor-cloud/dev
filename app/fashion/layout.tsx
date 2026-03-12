import type { Metadata } from 'next'
import { BRAND_NAME } from '@/data/mock/config'

export const metadata: Metadata = {
  title: `Fashion — ${BRAND_NAME}`,
  description: `Discover African fashion and creative industries on ${BRAND_NAME}. Connect with designers, brands, and artisan networks.`,
}

export default function FashionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'
import { getPackageById } from '@/lib/safari-packages'
import { BRAND_NAME } from '@/data/mock/config'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = getPackageById(params.id)

  if (!pkg) {
    return {
      title: 'Experience Not Found',
      description: `This experience could not be found. Browse all ${BRAND_NAME} ventures.`,
    }
  }

  const title = pkg.name
  const description = `${pkg.name} — ${pkg.duration}. ${pkg.destination}. ${pkg.highlights?.[0] ?? 'Unforgettable Kenya experience.'}. Book via M-Pesa or Stripe.`
  const ogImage = `/og?title=${encodeURIComponent(pkg.name)}&sub=${encodeURIComponent(pkg.destination + ' · ' + pkg.duration)}&type=venture`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

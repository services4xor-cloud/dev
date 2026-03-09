import type { Metadata } from 'next'
import { COUNTRIES } from '@/lib/countries'

interface Props {
  params: { country: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code    = params.country.toUpperCase() as keyof typeof COUNTRIES
  const country = COUNTRIES[code]

  if (!country) {
    return {
      title: 'Country Gate',
      description: 'Explore paths, experiences, and routes with the BeNetwork.',
    }
  }

  const name        = country.name
  const title       = `Be${name} — Paths, Experiences & Routes`
  const description = `Discover professional paths, experiences, and country corridors in ${name}. The BeNetwork connects Pioneers with ${name}'s best opportunities — paid locally in ${country.currency}.`
  const ogImage     = `/og?title=Be${encodeURIComponent(name)}&sub=${encodeURIComponent(name + ' Paths · Experiences · Routes')}&type=country`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/be/${params.country}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImage],
    },
    alternates: {
      canonical: `/be/${params.country}`,
    },
  }
}

export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

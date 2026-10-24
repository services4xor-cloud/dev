import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ code: string }>
}

/** Country pages live in the map's country panel; /be/ke opens Kenya there. */
export default async function CountryHubPage({ params }: PageProps) {
  const { code } = await params
  redirect(`/map?country=${encodeURIComponent(code.toUpperCase().slice(0, 2))}`)
}

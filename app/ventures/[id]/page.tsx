import { redirect } from 'next/navigation'

export default function VentureDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/exchange/${params.id}`)
}

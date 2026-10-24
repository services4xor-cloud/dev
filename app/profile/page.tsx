'use client'

import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

/** Greeting in user's browser language */
const GREETINGS: Record<string, string> = {
  en: 'Hello',
  de: 'Hallo',
  fr: 'Bonjour',
  es: 'Hola',
  pt: 'Olá',
  it: 'Ciao',
  nl: 'Hallo',
  pl: 'Cześć',
  ru: 'Привет',
  uk: 'Привіт',
  ja: 'こんにちは',
  ko: '안녕하세요',
  zh: '你好',
  ar: 'مرحبا',
  hi: 'नमस्ते',
  sw: 'Habari',
  tr: 'Merhaba',
  th: 'สวัสดี',
  vi: 'Xin chào',
  id: 'Halo',
  ms: 'Halo',
  ro: 'Bună',
  cs: 'Ahoj',
  hu: 'Szia',
  sv: 'Hej',
  no: 'Hei',
  da: 'Hej',
  fi: 'Hei',
  el: 'Γεια σου',
  he: 'שלום',
  bn: 'হ্যালো',
  ta: 'வணக்கம்',
  te: 'హలో',
  fa: 'سلام',
}

function getBrowserGreeting(): string {
  if (typeof navigator === 'undefined') return GREETINGS.en
  const lang = navigator.language?.slice(0, 2)?.toLowerCase()
  return GREETINGS[lang] ?? GREETINGS.en
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    setGreeting(getBrowserGreeting())
  }, [])

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/login')
  }

  const name = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? 'Explorer'

  return (
    <PageShell eyebrow="Profile" title={`${greeting}, ${name}`} width="narrow">
      <div className="card p-6 sm:p-8">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt={name}
            width={80}
            height={80}
            className="mb-4 rounded-full border-2 border-brand-accent/30"
          />
        )}
        <p className="text-lg text-brand-text">{name}</p>
        {session?.user?.email && (
          <p className="mt-1 text-sm text-brand-text-muted">{session.user.email}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-brand-line pt-6">
          <Link href="/bookings" className="btn btn-sm">
            Your bookings
          </Link>
          <Link href="/opportunities#yours" className="btn btn-sm">
            Your listings
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-sm ml-auto">
            Sign out
          </button>
        </div>
      </div>
    </PageShell>
  )
}

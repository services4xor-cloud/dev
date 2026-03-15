'use client'

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

  const name = session?.user?.name ?? session?.user?.email?.split('@')[0] ?? 'Pioneer'

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-accent">
              {greeting}, {name}
            </h1>
            <p className="text-sm text-brand-text-muted">Your Be[X] identity</p>
          </div>
          <a href="/" className="text-sm text-brand-text-muted hover:text-brand-accent transition">
            &larr; Map
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center p-6">
        <div className="text-center">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={name}
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full border-2 border-brand-accent/30"
            />
          )}
          <p className="text-lg text-brand-text">{name}</p>
          {session?.user?.email && (
            <p className="mt-1 text-sm text-brand-text-muted">{session.user.email}</p>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-8 rounded-full border border-brand-accent/30 px-5 py-2 text-sm text-brand-text-muted transition hover:border-brand-accent/50 hover:text-brand-accent"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  )
}

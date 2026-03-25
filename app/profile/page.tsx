'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { getBrowserGreeting } from '@/lib/greetings'

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

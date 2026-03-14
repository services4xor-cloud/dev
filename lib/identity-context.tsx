'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { GraphEdge, GraphNode } from '@/types/domain'

interface Identity {
  userId: string | null
  country: string
  language: string
  node: GraphNode | null
  edges: GraphEdge[]
  loading: boolean
}

const defaultIdentity: Identity = {
  userId: null,
  country: 'KE',
  language: 'en',
  node: null,
  edges: [],
  loading: true,
}

const IdentityContext = createContext<{ identity: Identity }>({
  identity: defaultIdentity,
})

export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [identity, setIdentity] = useState<Identity>(defaultIdentity)

  useEffect(() => {
    if (!session?.user) {
      setIdentity({ ...defaultIdentity, loading: false })
      return
    }

    const user = session.user as {
      id?: string
      country?: string
      language?: string
    }

    // Load user's graph node and edges
    async function loadIdentity() {
      try {
        const res = await fetch(`/api/identity`)
        if (res.ok) {
          const data = await res.json()
          setIdentity({
            userId: user.id ?? null,
            country: user.country ?? 'KE',
            language: user.language ?? 'en',
            node: data.node,
            edges: data.edges,
            loading: false,
          })
        } else {
          setIdentity({
            userId: user.id ?? null,
            country: user.country ?? 'KE',
            language: user.language ?? 'en',
            node: null,
            edges: [],
            loading: false,
          })
        }
      } catch {
        setIdentity({
          userId: user.id ?? null,
          country: user.country ?? 'KE',
          language: user.language ?? 'en',
          node: null,
          edges: [],
          loading: false,
        })
      }
    }

    loadIdentity()
  }, [session])

  return <IdentityContext.Provider value={{ identity }}>{children}</IdentityContext.Provider>
}

export function useIdentity() {
  return useContext(IdentityContext)
}

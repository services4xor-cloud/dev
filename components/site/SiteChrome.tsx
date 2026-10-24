'use client'

import { usePathname } from 'next/navigation'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'

/** Full-screen map pages: compact header, no footer (the map fills the rest). */
const MAP_PATHS = new Set(['/', '/map'])
/** Pages with their own chrome. */
const BARE_PATHS = new Set(['/4xor', '/offline'])

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  if (BARE_PATHS.has(pathname)) return <>{children}</>
  if (MAP_PATHS.has(pathname)) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden">
        <SiteHeader compact />
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    )
  }
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}

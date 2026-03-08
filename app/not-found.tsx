'use client'

import Link from 'next/link'
import { Search, Home, Briefcase } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-brand-orange mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">
          This page doesn&apos;t exist yet. But thousands of real jobs do.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-secondary flex items-center justify-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link href="/jobs" className="btn-primary flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Browse Jobs
          </Link>
        </div>
        <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <div className="flex items-center justify-center gap-2 text-brand-orange font-medium mb-1">
            <Briefcase className="w-4 h-4" />
            Quick job search
          </div>
          <p className="text-sm text-gray-600">
            Try searching for{' '}
            <Link href="/jobs?q=Software+Engineer" className="text-brand-orange hover:underline">Software Engineer</Link>,{' '}
            <Link href="/jobs?q=Remote" className="text-brand-orange hover:underline">Remote</Link>, or{' '}
            <Link href="/jobs?q=Nairobi" className="text-brand-orange hover:underline">Nairobi</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

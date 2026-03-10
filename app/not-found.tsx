'use client'

/**
 * 404 Not Found — BeNetwork dark theme
 * Uses BeNetwork vocabulary. Global layout provides Nav + Footer.
 */

import Link from 'next/link'
import Image from 'next/image'
import { Compass, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-20"
      style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 40%)' }}
    >
      <div className="text-center max-w-lg">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/logo.svg" alt="BeNetwork Compass" width={64} height={64} className="opacity-70" unoptimized />
        </div>

        {/* 404 number */}
        <div
          className="text-9xl font-black mb-2 leading-none"
          style={{ color: '#C9A227', textShadow: '0 0 40px rgba(201,162,39,0.3)' }}
        >
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          This route doesn&apos;t exist yet.
        </h1>
        <p className="text-gray-400 text-base mb-10 leading-relaxed">
          The Compass couldn&apos;t find this path. But thousands of real Paths and
          Ventures do exist — let&apos;s get you back on course.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', border: '1px solid #C9A22760' }}
          >
            <Compass className="w-5 h-5" />
            Return to Compass
          </Link>
          <Link
            href="/ventures"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 transition-all"
          >
            Explore Ventures <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick nav */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#0A0A0F', border: '1px solid #C9A22730' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-4">
            Popular Paths
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Safari Guide',       href: '/ventures?q=safari' },
              { label: 'Software Engineer',  href: '/ventures?q=software' },
              { label: 'NHS Nursing',        href: '/ventures?q=nursing' },
              { label: 'Remote Work',        href: '/ventures?q=remote' },
              { label: 'Germany Route',      href: '/compass' },
              { label: 'UAE Hospitality',    href: '/ventures?q=hospitality' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 rounded-full text-sm text-gray-400 bg-gray-900 border border-gray-800 hover:border-[#C9A227]/40 hover:text-[#C9A227] transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

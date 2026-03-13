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
      style={{
        background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 40%)',
      }}
    >
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.svg"
            alt="BeNetwork Compass"
            width={64}
            height={64}
            className="opacity-70"
            unoptimized
          />
        </div>

        {/* 404 number */}
        <div
          className="text-9xl font-black mb-2 leading-none"
          style={{
            color: 'var(--color-accent)',
            textShadow: '0 0 40px rgb(var(--color-accent-rgb) / 0.3)',
          }}
        >
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          This route doesn&apos;t exist yet.
        </h1>
        <p className="text-gray-400 text-base mb-10 leading-relaxed">
          The Compass couldn&apos;t find this path. But thousands of real Paths and Ventures do
          exist — let&apos;s get you back on course.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              border: '1px solid rgb(var(--color-accent-rgb) / 0.38)',
            }}
          >
            <Compass className="w-5 h-5" />
            Return to Compass
          </Link>
          <Link
            href="/exchange"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold border border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10 transition-all"
          >
            Explore Ventures <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick nav */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid rgb(var(--color-accent-rgb) / 0.19)',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-4">
            Popular Paths
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Safari Guide', href: '/exchange?q=safari' },
              { label: 'Software Engineer', href: '/exchange?q=software' },
              { label: 'NHS Nursing', href: '/exchange?q=nursing' },
              { label: 'Remote Work', href: '/exchange?q=remote' },
              { label: 'Germany Route', href: '/compass' },
              { label: 'UAE Hospitality', href: '/exchange?q=hospitality' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 rounded-full text-sm text-gray-400 bg-gray-900 border border-brand-primary/30 hover:border-brand-accent/40 hover:text-brand-accent transition-all"
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

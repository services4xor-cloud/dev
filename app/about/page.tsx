'use client'

/**
 * About — BeNetwork platform story, mission, values
 *
 * Dark theme. Full BeNetwork vocabulary.
 * Global layout.tsx provides Nav + Footer — do NOT add them here.
 */

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Globe, Shield, Leaf, Users, Compass, Anchor, BookOpen } from 'lucide-react'

const VALUES = [
  { icon: Heart,  title: 'Dignity First',            desc: 'Every Pioneer deserves meaningful, dignified paths. We connect talent to opportunity — no matter where you start or where you are going.' },
  { icon: Globe,  title: 'Global Reach, Local Roots', desc: 'Born in Kenya, built for the world. We understand African payment systems and global markets equally — M-Pesa to SEPA.' },
  { icon: Shield, title: 'Safe & Verified',           desc: 'Every Anchor is vetted. Every Path is real. We protect Pioneers from exploitation — no gatekeepers, no hidden fees.' },
  { icon: Leaf,   title: 'Regenerative Impact',       desc: 'We prioritize eco-tourism, conservation, and sustainable industries — because the planet is everyone\'s workplace.' },
]

const SECTORS = [
  { emoji: '🦁', name: 'Safari & Wildlife' },  { emoji: '🌿', name: 'Eco-Tourism' },
  { emoji: '💻', name: 'Technology' },          { emoji: '🏥', name: 'Healthcare' },
  { emoji: '⚙️', name: 'Engineering' },         { emoji: '🏦', name: 'Finance & Banking' },
  { emoji: '📚', name: 'Education' },           { emoji: '🍽️', name: 'Hospitality' },
  { emoji: '🎨', name: 'Creative & Media' },    { emoji: '🌾', name: 'Agriculture' },
  { emoji: '⛽', name: 'Energy' },              { emoji: '🚛', name: 'Logistics & Trade' },
]

const PAYMENT_METHODS = [
  { name: 'M-Pesa',      desc: 'Kenya, Tanzania, Mozambique',  icon: '📱' },
  { name: 'Flutterwave', desc: 'Pan-African payments',          icon: '🌍' },
  { name: 'SEPA',        desc: 'Europe bank transfer',           icon: '🏦' },
  { name: 'Stripe',      desc: 'Cards worldwide',               icon: '💳' },
  { name: 'Wise',        desc: 'Global transfers, low fee',     icon: '🔄' },
  { name: 'Paystack',    desc: 'Nigeria & Ghana',               icon: '🇳🇬' },
]

const STATS = [
  { value: '12,400+', label: 'Active Paths' },
  { value: '50+',     label: 'Countries' },
  { value: '3,200',   label: 'Pioneers Hired This Month' },
  { value: '12',      label: 'Country Gates Open' },
]

const VOCAB_ITEMS = [
  { icon: Users,    label: 'Pioneers',  desc: 'People seeking paths across borders' },
  { icon: Anchor,   label: 'Anchors',   desc: 'Organisations offering real paths' },
  { icon: Compass,  label: 'Compass',   desc: 'Smart routing from origin to destination' },
  { icon: BookOpen, label: 'Chapters',  desc: 'Every engagement, documented fairly' },
]

export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0F] text-white">

      {/* Hero */}
      <section
        className="relative overflow-hidden py-28 px-4 text-center"
        style={{ background: 'linear-gradient(to bottom, #5C0A14 0%, #0A0A0F 70%)' }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#C9A22720 1px, transparent 1px), linear-gradient(90deg, #C9A22720 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Image src="/logo.svg" alt="BeNetwork" width={80} height={80} className="drop-shadow-2xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-sm font-medium mb-8">
            <Compass className="w-3.5 h-3.5" />
            Identity-first life-routing platform
          </div>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            Work should be for <span style={{ color: '#C9A227' }}>everyone.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            BeNetwork reverses colonial economic flows through open trade, fair compensation,
            and direct country-to-country connections. No intermediaries. No gatekeepers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/compass"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', border: '1px solid #C9A22760' }}
            >
              <Compass className="w-5 h-5" />
              Start My Compass →
            </Link>
            <Link
              href="/anchors/post-path"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 transition-all"
            >
              <Anchor className="w-5 h-5" />
              Post a Path
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
              <div className="text-3xl md:text-4xl font-black text-[#C9A227] mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission — golden ratio 61.8 / 38.2 column split */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-[1.618fr_1fr] gap-12 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-4 flex items-center gap-2">
              <div className="w-8 h-px bg-[#C9A227]" /> Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Reverse the flow.<br />
              <span className="text-[#C9A227]">Build the corridor.</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              For centuries, value has flowed one way — out of Africa, out of the Global South,
              into the hands of intermediaries and gatekeepers. BeNetwork is the corridor in the
              opposite direction.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We connect Pioneers directly with Anchors across 50+ countries. Payments flow
              through M-Pesa, Flutterwave, and local rails — not through foreign banks.
              Routes are built on real visa corridors, not wishful thinking.
            </p>
          </div>
          <div className="space-y-4">
            {VOCAB_ITEMS.map(item => (
              <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="w-10 h-10 rounded-lg bg-[#5C0A14]/40 border border-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div>
                  <div className="font-semibold text-white">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">What We Stand For</div>
          <h2 className="text-3xl md:text-4xl font-bold">Values that guide every path</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {VALUES.map(v => (
            <div key={v.title} className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#C9A227]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#5C0A14]/40 border border-[#C9A227]/20 flex items-center justify-center mb-4">
                <v.icon className="w-5 h-5 text-[#C9A227]" />
              </div>
              <h3 className="font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">Industries</div>
          <h2 className="text-3xl md:text-4xl font-bold">Paths across every sector</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {SECTORS.map(s => (
            <div
              key={s.name}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#C9A227]/30 transition-colors text-center"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-xs text-gray-400 font-medium leading-tight">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Rails */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A227] mb-3">Payment Rails</div>
          <h2 className="text-3xl font-bold mb-3">Money flows where you do</h2>
          <p className="text-gray-400">We support local payment methods across every corridor — so your income arrives in your hands.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map(p => (
            <div key={p.name} className="flex items-center gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm">{p.name}</div>
                <div className="text-xs text-gray-500">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UTAMADUNI CBO */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #5C0A14 0%, #0A0A0F 100%)', border: '1px solid #C9A22740' }}
        >
          <div className="text-3xl mb-3">🤲</div>
          <h3 className="text-2xl font-bold mb-3">UTAMADUNI CBO</h3>
          <p className="text-gray-300 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            Our community arm. Supporting conservation workers, local guides, and cultural
            educators across East Africa. Every booking through BeKenya contributes.
          </p>
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#C9A227] border border-[#C9A227]/40 hover:bg-[#C9A227]/10 transition-colors"
          >
            Learn about UTAMADUNI →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to find your path?</h2>
        <p className="text-gray-400 text-lg mb-10">
          Start your Compass. Tell us where you are and where you want to go. We&apos;ll build your route.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/compass"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #5C0A14, #7a0e1a)', border: '1px solid #C9A22760' }}
          >
            <Compass className="w-5 h-5" />
            Start My Compass →
          </Link>
          <Link
            href="/anchors/post-path"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 transition-all text-lg"
          >
            <Anchor className="w-5 h-5" />
            Post a Path
          </Link>
        </div>
      </section>

    </div>
  )
}

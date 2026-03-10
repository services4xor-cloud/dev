'use client'

import Link from 'next/link'
import {
  Globe,
  Shield,
  Building2,
  Users,
  Mail,
  Phone,
  ChevronRight,
  Layers,
  Landmark,
  Lock,
} from 'lucide-react'
import { DIVISIONS, OPERATING_COUNTRIES, SHARE_BLOCKS } from '@/data/mock'

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
            <Landmark className="w-4 h-4 text-[#C9A227]" />
            <span>Legal Entity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">BeKenya Family Ltd</h1>
          <p className="text-xl text-gray-300 font-light mb-3">A Family. A Mission. A Structure.</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The legal and operational home of the BeNetwork platform and all Be[Country] ventures.
            Registered in Kenya. Built for the world.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 px-4 bg-[#5C0A14]/10 border-b border-[#5C0A14]/30">
        <div className="max-w-3xl mx-auto text-center">
          <Globe className="w-10 h-10 text-[#C9A227] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Dignified work and opportunity for everyone, everywhere. We connect Pioneers (people
            seeking their path) with Anchors (employers and partners) across borders, currencies,
            and cultures — starting in Kenya, scaling globally.
          </p>
        </div>
      </section>

      {/* ── Legal Status ── */}
      <section className="py-14 px-4 border-b border-[#5C0A14]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-[#C9A227]" />
            <h2 className="text-2xl font-bold text-white">Legal Status</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Landmark className="w-5 h-5 text-[#C9A227]" />,
                label: 'Registration',
                value: 'Kenya Companies Act',
                sub: 'eCitizen Business Registration',
              },
              {
                icon: <Building2 className="w-5 h-5 text-[#C9A227]" />,
                label: 'Entity Type',
                value: 'Private Limited Company',
                sub: 'BeKenya Family Ltd',
              },
              {
                icon: <Lock className="w-5 h-5 text-[#C9A227]" />,
                label: 'Governance',
                value: 'Dual-Signature Control',
                sub: 'Finance Controller approval required',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-900/60 rounded-2xl p-5 border border-[#5C0A14]/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
                <p className="font-semibold text-white">{item.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Share Structure ── */}
      <section className="py-14 px-4 border-b border-[#5C0A14]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-6 h-6 text-[#C9A227]" />
            <h2 className="text-2xl font-bold text-white">Share Structure</h2>
          </div>
          <p className="text-gray-400 text-sm mb-8 ml-9">
            Shareholder identities are privacy-protected. Structure shown for transparency.
          </p>

          {/* Bar */}
          <div className="flex h-8 rounded-full overflow-hidden mb-6 border border-[#5C0A14]/30">
            {SHARE_BLOCKS.map((block) => (
              <div
                key={block.label}
                className={`${block.color} flex items-center justify-center text-white text-sm font-bold transition-all`}
                style={{ width: `${block.percent}%` }}
              >
                {block.percent}%
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="grid md:grid-cols-2 gap-4">
            {SHARE_BLOCKS.map((block) => (
              <div
                key={block.label}
                className="flex items-start gap-3 bg-gray-900/60 rounded-xl p-4 border border-[#5C0A14]/30"
              >
                <div className={`w-3 h-3 rounded-full mt-1 ${block.color} shrink-0`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${block.textColor}`}>
                      {block.percent}%
                    </span>
                    <span className="font-semibold text-gray-200 text-sm">{block.label}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{block.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Divisions ── */}
      <section className="py-14 px-4 border-b border-[#5C0A14]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-6 h-6 text-[#C9A227]" />
            <h2 className="text-2xl font-bold text-white">Business Divisions</h2>
          </div>
          <div className="space-y-4">
            {DIVISIONS.map((div) => (
              <div
                key={div.name}
                className="rounded-2xl border border-[#5C0A14]/30 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-4 bg-gray-900/60 border-b border-[#5C0A14]/30">
                  <span className="text-2xl">{div.icon}</span>
                  <h3 className="font-bold text-white text-lg">{div.name}</h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-300 mb-4 leading-relaxed">{div.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {div.ventures.map((v) => (
                      <span
                        key={v}
                        className="text-xs bg-[#5C0A14]/20 text-[#C9A227] border border-[#C9A227]/20 rounded-full px-3 py-1 font-medium"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Operating Countries ── */}
      <section className="py-14 px-4 border-b border-[#5C0A14]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-6 h-6 text-[#C9A227]" />
            <h2 className="text-2xl font-bold text-white">Operating Countries</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {OPERATING_COUNTRIES.map((country) => (
              <div key={country.code} className={`rounded-2xl border p-6 ${country.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{country.name}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${country.badge}`}
                      >
                        {country.role}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{country.details}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Next: BeNigeria (NGN + Flutterwave) · BeAmerica (USD + Stripe) · BeGermany full entity
          </p>
        </div>
      </section>

      {/* ── Payment & Financial Control ── */}
      <section className="py-14 px-4 border-b border-[#5C0A14]/30 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-[#C9A227]" />
            <h2 className="text-2xl font-bold text-white">Payment & Financial Control</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: '🏦',
                title: 'Dual Signature Bank Account',
                body: 'KCB / Equity Bank Kenya. All withdrawals require Finance Controller approval. No single-party access.',
              },
              {
                icon: '📱',
                title: 'M-Pesa Business Till',
                body: 'Chapa-powered Lipa na M-Pesa integration. Instant KES collections. Sandbox: Till 174379.',
              },
              {
                icon: '🌐',
                title: 'Global Payment Rails',
                body: 'Stripe (USD/EUR), Flutterwave (NGN), PayPal. Each rail enabled per country activation.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-900/60 rounded-2xl border border-[#5C0A14]/30 p-5"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-[#5C0A14]/20 border border-[#C9A227]/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#C9A227] mt-0.5 shrink-0" />
              <p className="text-sm text-gray-300">
                <strong>Finance Controller Oversight:</strong> All revenue withdrawals, partner
                disbursements, and UTAMADUNI transfers require dual approval. Platform revenue
                auto-routes: 10% to charity reserve, 15% to operational float, remainder to growth
                fund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partnership CTA ── */}
      <section className="py-14 px-4 border-b border-[#5C0A14]/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-[#C9A227]" />
            <h2 className="text-2xl font-bold text-white">Partnership Enquiries</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: '🦁',
                type: 'Safari Lodges & Conservancies',
                desc: 'List your packages on BeKenya Experiences. Reach global travellers directly.',
              },
              {
                icon: '🌍',
                type: 'NGOs & Development Partners',
                desc: 'Co-fund UTAMADUNI projects. Skills training, youth employment, community builds.',
              },
              {
                icon: '🏢',
                type: 'Corporate Anchors',
                desc: 'Hire verified Pioneers. Post paths, sponsor placements, build your East Africa team.',
              },
            ].map((p) => (
              <div
                key={p.type}
                className="rounded-2xl border border-[#5C0A14]/30 p-5 hover:border-[#C9A227]/50 transition-colors"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-semibold text-white mb-2">{p.type}</h3>
                <p className="text-sm text-gray-300">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Get in Touch</h2>
          <p className="text-gray-400 mb-8">
            For partnership proposals, legal enquiries, or press, reach us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="mailto:services4xor@gmail.com"
              className="inline-flex items-center gap-2 bg-[#5C0A14] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#5C0A14]/80 transition-colors"
            >
              <Mail className="w-4 h-4" />
              services4xor@gmail.com
            </a>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-green-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ventures"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#C9A227] transition-colors font-medium"
            >
              Browse Ventures <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/experiences"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#C9A227] transition-colors font-medium"
            >
              Safari Experiences <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/charity"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#C9A227] transition-colors font-medium"
            >
              UTAMADUNI Charity <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

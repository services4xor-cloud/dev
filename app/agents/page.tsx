'use client'

/**
 * Agent Landing Page — "Become a Be[Country] Agent"
 *
 * Explains the Agent model: real people who bridge Anchors and Pioneers.
 * CTA: Apply to become an Agent → /signup?role=AGENT
 */

import Link from 'next/link'
import {
  Send,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Smartphone,
  Shield,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { BRAND_NAME } from '@/data/mock'

// ─── Stats ────────────────────────────────────────────────────────────────────

const AGENT_STATS = [
  { label: 'Active Agents', value: '200+', icon: Users },
  { label: 'Placements Made', value: '1,200+', icon: TrendingUp },
  { label: 'Countries Covered', value: '16', icon: MapPin },
  { label: 'Avg Commission', value: 'KES 15K', icon: DollarSign },
]

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Earn 10% Commission',
    description:
      'Every time someone you forward gets placed, you earn 10% of the placement fee. No caps, no limits.',
  },
  {
    icon: Smartphone,
    title: 'Forward via WhatsApp',
    description:
      'Share opportunities with your network using one tap. WhatsApp, SMS, in-person — whatever works.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Impact',
    description:
      'See exactly who clicked, who signed up, who got placed. Full transparency on your earnings.',
  },
  {
    icon: Shield,
    title: 'Verified Agent Status',
    description:
      'Get verified by our team. Verified agents get priority demand notifications and higher visibility.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Apply',
    description:
      'Tell us about your territory and network. We verify your identity and activate your account.',
  },
  {
    step: '2',
    title: 'Get Demand',
    description:
      'Receive open paths matched to your territory and sectors. Healthcare, tech, hospitality — your choice.',
  },
  {
    step: '3',
    title: 'Forward',
    description:
      'Share paths with workers you know. Each forward has a unique tracking code linked to you.',
  },
  {
    step: '4',
    title: 'Earn',
    description:
      'When your forward leads to a placement, you earn commission. Paid monthly via M-Pesa.',
  },
]

export default function AgentLandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section
        className="relative py-20 lg:py-28"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary) 0%, var(--color-bg) 40%)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
              Agent Programme
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Become a {BRAND_NAME} Agent
            </h1>
            <p className="text-lg text-gray-300 mb-2">
              You know workers. We know companies. Together, we place people.
            </p>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Agents are the bridge between global employers and local talent. Forward job
              opportunities to your community, track every placement, and earn commission for every
              worker who gets hired through your network.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup?role=AGENT"
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                Apply to become an Agent
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/agents/dashboard"
                className="flex items-center gap-2 px-6 py-3 border border-brand-accent/40 text-brand-accent rounded-xl text-sm font-medium hover:bg-brand-accent/10 transition-colors"
              >
                View Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENT_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-5 text-center"
                >
                  <Icon className="w-5 h-5 text-brand-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            How it works
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Four steps to earning</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            Benefits
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Why become an Agent?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/30 border border-brand-accent/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-accent" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Who can be an Agent */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 xl:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">
            Who is this for
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            You might be a great Agent if you...
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Know workers in healthcare, tech, or hospitality',
              'Are active in community groups or WhatsApp networks',
              'Have connections at churches, mosques, or community centres',
              'Work in recruitment, HR, or talent placement',
              'Run a vocational training centre or skills programme',
              'Are a community leader, chief, or local organizer',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700"
              >
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 xl:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to start placing people?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join {BRAND_NAME}&apos;s Agent network. No upfront cost. Earn commission on every
            successful placement.
          </p>
          <Link
            href="/signup?role=AGENT"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-xl font-medium hover:opacity-90 transition-colors"
          >
            Apply to become an Agent
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

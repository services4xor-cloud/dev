'use client'

import Link from 'next/link'
import { Heart, Globe, Shield, TrendingUp, Leaf, Users, Briefcase, DollarSign } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Dignity First',
    desc: 'Every person deserves meaningful, dignified work. We connect talent to opportunity — no matter where you start.',
    color: 'text-red-500 bg-red-50',
  },
  {
    icon: Globe,
    title: 'Global Reach, Local Roots',
    desc: 'Born in Kenya, built for the world. We understand African payment systems and global job markets equally.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Safe & Verified',
    desc: 'Every employer is vetted. Every job is real. We protect job seekers from scams and exploitation.',
    color: 'text-green-500 bg-green-50',
  },
  {
    icon: Leaf,
    title: 'Sustainable Impact',
    desc: 'We prioritize eco-tourism, conservation, and sustainable industries — because the planet is everyone\'s workplace.',
    color: 'text-teal-500 bg-teal-50',
  },
]

const sectors = [
  { emoji: '💻', name: 'Technology', desc: 'Software, AI, fintech' },
  { emoji: '🦁', name: 'Wildlife & Safaris', desc: 'Safari guides, rangers, conservationists' },
  { emoji: '🌿', name: 'Eco-Tourism', desc: 'Lodges, guides, nature experiences' },
  { emoji: '💰', name: 'Finance', desc: 'Banking, M-Pesa, microfinance' },
  { emoji: '🏥', name: 'Healthcare', desc: 'Nurses, doctors, community health' },
  { emoji: '🎓', name: 'Education', desc: 'Teachers, tutors, trainers' },
  { emoji: '🏗️', name: 'Construction', desc: 'Engineers, artisans, builders' },
  { emoji: '👗', name: 'Fashion & Modeling', desc: 'Professional, dignified creative work' },
  { emoji: '🚀', name: 'Startups', desc: 'Early-stage, remote, equity-based' },
  { emoji: '🌾', name: 'Agriculture', desc: 'Modern farming, agri-business' },
  { emoji: '✈️', name: 'Aviation & Travel', desc: 'Pilots, cabin crew, hospitality' },
  { emoji: '⚡', name: 'Clean Energy', desc: 'Solar, wind, green infrastructure' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gray-900">Beke</span>
            <span className="text-brand-orange">nya</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/jobs" className="text-gray-600 hover:text-brand-orange">Jobs</Link>
            <Link href="/post-job" className="btn-primary px-4 py-2 text-sm">Post a Job</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🌍</div>
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Work should be for<br />
            <span className="text-brand-orange">everyone</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Bekenya exists so that anyone — a nurse in Kisumu, a developer in Nairobi,
            a safari guide in Maasai Mara, or a model in Mombasa — can find dignified,
            well-paying work locally and internationally.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In Kenya and across Africa, millions of talented people are underemployed — not because they lack
              skills, but because they lack access. Access to the right employers. Access to international
              opportunities. Access to payment systems that work for them.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Bekenya bridges that gap. We built a platform that works on any phone, accepts M-Pesa, and
              connects Kenyan talent with employers from Nairobi to New York.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that when people have access to dignified work, everything else gets better —
              for families, communities, and the entire economy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-brand-orange">50K+</div>
              <div className="text-gray-600 mt-1">Job seekers</div>
            </div>
            <div className="bg-teal-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-brand-teal">120+</div>
              <div className="text-gray-600 mt-1">Verified employers</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-green-600">35+</div>
              <div className="text-gray-600 mt-1">Countries reached</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-blue-600">3.2K</div>
              <div className="text-gray-600 mt-1">Hired this month</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${v.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sectors */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Every industry. Every skill.</h2>
            <p className="text-gray-500 mt-2">From safari guides to software engineers — we cover all of Kenya and beyond</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sectors.map(s => (
              <div key={s.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-brand-orange transition-colors cursor-pointer">
                <div className="text-2xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-gray-900 text-sm">{s.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Philosophy */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <DollarSign className="w-12 h-12 text-brand-orange mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Built for how Africa pays</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The biggest barrier to online payments in Africa isn&apos;t willingness — it&apos;s access.
                Most people don&apos;t have Visa cards. They have mobile phones. They have M-Pesa.
              </p>
              <p className="text-gray-600 leading-relaxed">
                So we built a payment system that works for everyone: M-Pesa STK Push for Kenya,
                Airtel Money for Uganda and Tanzania, Flutterwave for Nigeria and Ghana,
                and Stripe for international employers. No one is left out.
              </p>
            </div>
            <div className="space-y-3">
              {['M-Pesa (Kenya, Tanzania)', 'Airtel Money (Uganda, DRC)', 'MTN Mobile Money (West Africa)', 'Flutterwave (Nigeria, Ghana)', 'Stripe (USA, UK, EU)', 'PayPal (Worldwide)'].map(method => (
                <div key={method} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  <span className="text-gray-700 text-sm">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the movement</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Whether you&apos;re looking for work or looking to hire, Bekenya is for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=jobseeker" className="btn-primary px-8 py-4 text-lg">
              Find Work — Free
            </Link>
            <Link href="/post-job" className="btn-secondary px-8 py-4 text-lg">
              Post a Job — From KES 500
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© 2024 Bekenya. Built with ❤️ for Kenya and the world.</p>
        <p className="mt-1">🇰🇪 Nairobi, Kenya · Payments: M-Pesa • Stripe • Flutterwave</p>
      </div>
    </div>
  )
}

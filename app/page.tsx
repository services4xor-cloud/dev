'use client'

import Link from 'next/link'
import { Search, MapPin, Briefcase, Globe, Zap, Shield, TrendingUp, Users } from 'lucide-react'

const STATS = [
  { label: 'Active Jobs', value: '12,400+' },
  { label: 'Countries', value: '50+' },
  { label: 'Hired This Month', value: '3,200' },
  { label: 'Avg. Salary (KES)', value: '85K' },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Apply in 60 Seconds',
    desc: 'Swipe, tap, done. No long forms. Your profile does the talking.',
    color: 'bg-orange-50 text-brand-orange',
  },
  {
    icon: Shield,
    title: 'Pay with M-Pesa',
    desc: 'Post jobs or unlock premium features instantly via M-Pesa STK Push.',
    color: 'bg-green-50 text-brand-green',
  },
  {
    icon: Globe,
    title: 'Work with the World',
    desc: 'Remote and on-site jobs from USA, UK, Germany, UAE, Canada and more.',
    color: 'bg-blue-50 text-brand-teal',
  },
  {
    icon: TrendingUp,
    title: 'Earn Referral Bonuses',
    desc: 'Refer a friend who gets hired — earn KES 5,000 via M-Pesa instantly.',
    color: 'bg-yellow-50 text-yellow-600',
  },
]

const JOB_CATEGORIES = [
  { label: 'Tech & Engineering', count: 4200, emoji: '💻' },
  { label: 'Finance & Banking', count: 1800, emoji: '💰' },
  { label: 'Healthcare', count: 2100, emoji: '🏥' },
  { label: 'Teaching & Education', count: 1500, emoji: '📚' },
  { label: 'Construction', count: 900, emoji: '🏗️' },
  { label: 'Hospitality', count: 1200, emoji: '🍽️' },
  { label: 'Logistics & Transport', count: 800, emoji: '🚛' },
  { label: 'Marketing & Sales', count: 1400, emoji: '📈' },
]

const PAYMENT_LOGOS = [
  { name: 'M-Pesa', color: '#00A651', abbr: 'M' },
  { name: 'Stripe', color: '#635BFF', abbr: 'S' },
  { name: 'Flutterwave', color: '#F5A623', abbr: 'F' },
  { name: 'PayPal', color: '#003087', abbr: 'P' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-light">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-2xl text-gray-900">
            Beke<span className="text-brand-orange">nya</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/jobs" className="hover:text-gray-900 transition-colors">Find Jobs</Link>
            <Link href="/employers" className="hover:text-gray-900 transition-colors">For Employers</Link>
            <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
            <Link href="/post-job" className="btn-primary text-sm py-2 px-4">Post a Job</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-orange rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-teal rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>3,200+ people hired this month</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              International Jobs,<br />
              <span className="text-brand-orange">Paid via M-Pesa</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Find your dream job with top employers from Kenya, USA, UK, UAE and beyond.
              Apply fast, get hired faster, get paid your way.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
              <div className="flex items-center gap-3 flex-1 px-4 py-2">
                <Search className="text-gray-400 flex-shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Job title, skill, or company..."
                  className="flex-1 outline-none text-gray-900 text-base bg-transparent"
                />
              </div>
              <div className="flex items-center gap-3 flex-1 px-4 py-2 md:border-l border-gray-100">
                <MapPin className="text-gray-400 flex-shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Nairobi, Remote, or Worldwide"
                  className="flex-1 outline-none text-gray-900 text-base bg-transparent"
                />
              </div>
              <Link href="/jobs" className="btn-primary rounded-xl whitespace-nowrap text-center">
                Search Jobs
              </Link>
            </div>

            {/* Popular tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Remote', 'Nairobi', 'Software Engineer', 'Accountant', 'UK Visa Sponsored'].map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?q=${encodeURIComponent(tag)}`}
                  className="text-xs bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-orange text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-orange-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment trust */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500 font-medium">Accepted payments worldwide:</span>
          <div className="flex items-center gap-6">
            {PAYMENT_LOGOS.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: p.color }}
                >
                  {p.abbr}
                </div>
                <span className="text-sm font-semibold text-gray-700">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-1">Find opportunities in your field</p>
          </div>
          <Link href="/jobs" className="text-brand-orange font-semibold text-sm hover:underline">
            See all jobs →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {JOB_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/jobs?category=${encodeURIComponent(cat.label)}`}
              className="card p-5 flex flex-col gap-3 group hover:-translate-y-0.5 transition-transform"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm group-hover:text-brand-orange transition-colors">
                  {cat.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{cat.count.toLocaleString()} jobs</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Built Different. Built for You.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We built Bekenya for how Kenyans actually work — mobile-first, M-Pesa-friendly, and globally connected.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA split */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        {/* Job seeker CTA */}
        <div className="bg-gradient-to-br from-brand-orange to-orange-600 rounded-3xl p-8 text-white">
          <Briefcase size={40} className="mb-4 opacity-90" />
          <h3 className="font-display text-2xl font-bold mb-2">Find Your Next Job</h3>
          <p className="text-orange-100 mb-6 leading-relaxed">
            Thousands of employers are looking for talent like you — local and international.
            Create a free profile and start applying today.
          </p>
          <Link href="/signup?role=jobseeker" className="btn-secondary text-brand-orange font-bold">
            Get Started Free →
          </Link>
        </div>

        {/* Employer CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
          <Users size={40} className="mb-4 opacity-90" />
          <h3 className="font-display text-2xl font-bold mb-2">Hire Top Talent</h3>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Post a job in minutes. Pay with M-Pesa, Stripe or any major method.
            Access a pool of verified, skilled candidates ready to work.
          </p>
          <Link href="/post-job" className="btn-primary font-bold">
            Post a Job — from KES 500 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-display font-bold text-xl text-white mb-3">
                Beke<span className="text-brand-orange">nya</span>
              </div>
              <p className="text-sm leading-relaxed">
                Where Kenyan talent meets global opportunity. Mobile-first. M-Pesa powered.
              </p>
            </div>
            <div>
              <div className="font-semibold text-white mb-3 text-sm">For Job Seekers</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Create Profile</Link></li>
                <li><Link href="/referral" className="hover:text-white transition-colors">Referral Program</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-3 text-sm">For Employers</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/employers" className="hover:text-white transition-colors">Employer Login</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-3 text-sm">Company</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>© 2024 Bekenya. Built with ❤️ for Kenya and the world.</div>
            <div className="flex items-center gap-2">
              <span>🇰🇪 Nairobi, Kenya</span>
              <span>·</span>
              <span>Payments: M-Pesa • Stripe • Flutterwave</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

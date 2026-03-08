import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-bold text-xl text-white mb-3">
              Beke<span className="text-brand-orange">nya</span>
            </div>
            <p className="text-sm leading-relaxed">
              Where talent meets opportunity. Mobile-first. M-Pesa powered. Built for Africa.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white mb-3 text-sm">For Job Seekers</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Create Profile</Link></li>
              <li><Link href="/referral" className="hover:text-white transition-colors">Earn Referral Bonus</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3 text-sm">For Employers</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/employers/dashboard" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3 text-sm">Company</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Bekenya</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div>© {year} Bekenya. Built with ❤️ for Kenya and the world.</div>
          <div className="flex items-center gap-2">
            <span>🇰🇪 Nairobi, Kenya</span>
            <span>·</span>
            <span>M-Pesa • Stripe • Flutterwave • PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

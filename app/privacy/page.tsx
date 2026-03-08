import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Bekenya',
  description: 'How Bekenya collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-gray-900">Beke</span>
            <span className="text-brand-orange">nya</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: March 2024</p>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 prose prose-sm max-w-none">
          <h2>1. Data We Collect</h2>
          <p>When you use Bekenya, we collect:</p>
          <ul>
            <li>Account information (name, email, phone number)</li>
            <li>Profile data (skills, work history, CV)</li>
            <li>Payment information (M-Pesa transaction IDs — we never store your PIN)</li>
            <li>Job application data (which jobs you applied to)</li>
            <li>Usage data (pages visited, search terms)</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <ul>
            <li>To match you with relevant job opportunities</li>
            <li>To process payments via M-Pesa, Stripe, or Flutterwave</li>
            <li>To send job alerts and application updates (you can opt out)</li>
            <li>To prevent fraud and verify employer legitimacy</li>
            <li>To improve our platform based on usage patterns</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>We share your data with:</p>
          <ul>
            <li><strong>Employers</strong> — only your profile information when you apply</li>
            <li><strong>Payment processors</strong> — Safaricom (M-Pesa), Stripe, Flutterwave</li>
            <li><strong>Infrastructure providers</strong> — Vercel (hosting), Neon (database)</li>
          </ul>
          <p>We <strong>never sell</strong> your personal data to third parties.</p>

          <h2>4. Your Rights (GDPR & Kenyan Data Protection Act)</h2>
          <ul>
            <li>Right to access your data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to delete your account and data</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We use industry-standard security measures including encryption at rest and in transit, secure authentication, and regular security audits.</p>

          <h2>6. Contact</h2>
          <p>For privacy concerns, email: <a href="mailto:privacy@bekenya.com">privacy@bekenya.com</a></p>
        </div>
      </div>
    </div>
  )
}

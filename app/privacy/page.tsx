import Link from 'next/link'
import { BRAND_NAME, CONTACT, LEGAL } from '@/data/mock/config'
import HeroSection from '@/components/HeroSection'
import GlassCard from '@/components/ui/GlassCard'
import SectionLayout from '@/components/ui/SectionLayout'

export const metadata = {
  title: `Privacy Policy — ${BRAND_NAME}`,
  description: `How ${BRAND_NAME} collects, uses, and protects your personal data.`,
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <HeroSection
        title="Privacy Policy"
        subtitle={`Last updated: ${LEGAL.privacyLastUpdated}`}
        icon={
          <div className="w-14 h-14 bg-brand-primary/60 rounded-2xl flex items-center justify-center mx-auto border border-brand-accent/20">
            <span className="text-phi-xl">🔒</span>
          </div>
        }
        gradientTitle
      />

      <SectionLayout ambient maxWidth="max-w-3xl">
        <GlassCard padding="lg" className="prose prose-invert prose-sm max-w-none">
          <h2>1. Data We Collect</h2>
          <p>When you use {BRAND_NAME}, we collect:</p>
          <ul>
            <li>Account information (name, email, phone number)</li>
            <li>Profile data (skills, work history, CV)</li>
            <li>Payment information (M-Pesa transaction IDs — we never store your PIN)</li>
            <li>Chapter data (which Paths you engaged with)</li>
            <li>Usage data (pages visited, search terms)</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <ul>
            <li>To match you with relevant Paths via the Compass</li>
            <li>To process payments via M-Pesa, Stripe, or Flutterwave</li>
            <li>To send Path alerts and Chapter updates (you can opt out)</li>
            <li>To prevent fraud and verify Anchor legitimacy</li>
            <li>To improve our platform based on usage patterns</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>We share your data with:</p>
          <ul>
            <li>
              <strong>Anchors</strong> — only your profile information when you open a Chapter
            </li>
            <li>
              <strong>Payment processors</strong> — Safaricom (M-Pesa), Stripe, Flutterwave
            </li>
            <li>
              <strong>Infrastructure providers</strong> — Vercel (hosting), Neon (database)
            </li>
          </ul>
          <p>
            We <strong>never sell</strong> your personal data to third parties.
          </p>

          <h2>4. Your Rights (GDPR &amp; Kenyan Data Protection Act)</h2>
          <ul>
            <li>Right to access your data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to delete your account and data</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We use industry-standard security measures including encryption at rest and in transit,
            secure authentication, and regular security audits.
          </p>

          <h2>6. Contact</h2>
          <p>
            For privacy concerns, email:{' '}
            <a href={`mailto:${CONTACT.emailPrivacy}`} className="text-brand-accent">
              {CONTACT.emailPrivacy}
            </a>
          </p>
        </GlassCard>
      </SectionLayout>
    </div>
  )
}

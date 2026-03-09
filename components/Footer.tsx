import Link from 'next/link'
import Image from 'next/image'

// ── Column link lists ──────────────────────────────────────────────
const PIONEER_LINKS = [
  { href: '/ventures',   label: 'Browse Ventures' },
  { href: '/compass',    label: 'Find My Path' },
  { href: '/onboarding', label: 'Create Profile' },
  { href: '/referral',   label: 'Refer & Earn' },
]

const ANCHOR_LINKS = [
  { href: '/anchors/post-path',  label: 'Post a Path' },
  { href: '/pricing',            label: 'Pricing' },
  { href: '/anchors/dashboard',  label: 'Anchor Dashboard' },
]

const DISCOVER_LINKS = [
  { href: '/experiences', label: 'Safari Experiences' },
  { href: '/be/ke',       label: 'BeKenya' },
  { href: '/charity',     label: 'UTAMADUNI' },
  { href: '/media',       label: 'Media & Stories' },
]

const COMPANY_LINKS = [
  { href: '/about',    label: 'About' },
  { href: '/business', label: 'BeKenya Family Ltd' },
  { href: '/contact',  label: 'Contact' },
  { href: '/privacy',  label: 'Privacy Policy' },
]

// ── Component ──────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0F] border-t border-[#C9A227]/15">
      <div className="max-w-6xl 3xl:max-w-[1600px] mx-auto px-4 xl:px-8 py-16 3xl:py-24">

        {/* Top — brand + columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-lg"
              aria-label="Be[Country] — Home"
            >
              <Image
                src="/logo.svg"
                alt="Be[Country] compass"
                width={36}
                height={36}
              />
              <span className="text-[#C9A227] font-bold text-lg tracking-wide">
                Be[Country]
              </span>
            </Link>
            <p className="text-[#9D9BAA] text-sm leading-relaxed max-w-xs">
              An identity-first compass. Find where you belong — work, live,
              experience, and build across countries. Starting with Kenya.
            </p>
            <p className="mt-4 text-xs text-[#9D9BAA]/60">
              5% of every booking supports UTAMADUNI community projects.
            </p>
          </div>

          {/* Pioneers */}
          <FooterColumn title="For Pioneers" links={PIONEER_LINKS} />

          {/* Anchors */}
          <FooterColumn title="For Anchors" links={ANCHOR_LINKS} />

          {/* Discover + Company */}
          <div className="space-y-6">
            <FooterColumn title="Discover" links={DISCOVER_LINKS} />
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#C9A227]/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#9D9BAA]/70">
          <span>© {year} BeKenya Family Ltd. Built for dignity, everywhere.</span>
          <span className="flex items-center gap-2">
            <span>🇰🇪 Nairobi</span>
            <span aria-hidden="true">·</span>
            <span>M-Pesa · Stripe · Flutterwave</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

// ── Helper ─────────────────────────────────────────────────────────
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h3 className="text-[#F5F0E8] font-semibold text-sm mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[#9D9BAA] text-sm hover:text-[#C9A227] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

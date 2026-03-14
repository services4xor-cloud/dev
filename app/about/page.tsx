import Link from 'next/link'
import Footer from '@/components/Footer'

const values = [
  {
    name: 'Identity',
    description:
      'Who you are shapes where you go. Language, faith, craft, and culture are the foundation of every connection.',
  },
  {
    name: 'Connection',
    description:
      'Bridges across borders start with shared meaning — not just geography. Find people who see the world as you do.',
  },
  {
    name: 'Exchange',
    description:
      'Skills, culture, and opportunities flow between people when the right corridors are open.',
  },
  {
    name: 'Discovery',
    description:
      "The world is larger than any algorithm. Explore corridors you didn't know existed.",
  },
]

const steps = [
  {
    number: '01',
    title: 'Define your identity',
    detail:
      'Add the dimensions that matter to you — languages you speak, faiths you hold, crafts you practice, interests that shape your days.',
  },
  {
    number: '02',
    title: 'Discover your corridors',
    detail:
      'The platform maps corridors between countries that align with your profile, surfacing paths other Explorers have walked.',
  },
  {
    number: '03',
    title: 'Connect worldwide',
    detail:
      'Meet Explorers and Hosts whose identity dimensions overlap with yours — people who share your language, craft, or faith.',
  },
  {
    number: '04',
    title: 'Exchange and grow',
    detail:
      'Exchange skills, culture, and opportunities across borders. Every connection expands what is possible for you.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Nav bar */}
      <header className="border-b border-brand-accent/20 bg-brand-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold text-brand-accent hover:opacity-80 transition-opacity"
          >
            Be[X]
          </Link>
          <Link
            href="/"
            className="text-sm text-brand-text-muted hover:text-brand-accent transition-colors"
          >
            ← Back to Map
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-brand-text sm:text-5xl">
            About <span className="text-brand-accent">Be[X]</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-text-muted">
            Be[X] is an identity-first life-routing platform. X is whatever defines you — your
            country, your tribe, your craft, your faith. We connect people to paths, people, and
            experiences that match who they truly are.
          </p>
        </section>

        {/* Mission */}
        <section className="border-t border-brand-accent/10 bg-brand-surface">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-brand-text">Our Mission</h2>
            <p className="mt-4 text-brand-text-muted leading-relaxed">
              The world organises itself around proximity and nationality. We believe a deeper
              organising principle exists — identity. Language, faith, craft, and culture create
              invisible corridors between people regardless of where they were born. Be[X] makes
              those corridors visible and walkable.
            </p>
            <p className="mt-4 text-brand-text-muted leading-relaxed">
              Start with countries (BeKenya, BeGermany). Expand to tribes (BeMaasai), locations
              (BeNairobi), crafts (BeEngineer). One platform, infinite identities — every deployment
              serves all countries and languages.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-brand-text">How It Works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {steps.map(({ number, title, detail }) => (
              <div
                key={number}
                className="rounded-lg border border-brand-accent/20 bg-brand-surface p-6"
              >
                <p className="text-3xl font-bold text-brand-accent/40">{number}</p>
                <h3 className="mt-3 text-base font-semibold text-brand-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-brand-accent/10 bg-brand-surface">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-2xl font-semibold text-brand-text">Our Values</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {values.map(({ name, description }) => (
                <div key={name} className="flex gap-4">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-accent" />
                  <div>
                    <p className="font-semibold text-brand-text">{name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-brand-text-muted">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-brand-text">Ready to find your corridor?</h2>
          <p className="mt-3 text-brand-text-muted">
            Explore the map and discover where your identity takes you.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-md bg-brand-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Open the Map
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}

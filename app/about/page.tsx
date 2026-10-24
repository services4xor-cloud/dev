import Link from 'next/link'
import PageShell from '@/components/PageShell'

const STEPS = [
  {
    title: 'Pick a country on the map',
    text: 'See live facts from public sources: people, economy, the industries it is strong in, and the countries it shares a language or currency with.',
  },
  {
    title: 'Find what is on offer there',
    text: 'Journeys, experiences, services and automations listed by Hosts. Every listing is checked before it goes on the map.',
  },
  {
    title: 'Ask the agent',
    text: 'It knows the countries you picked and the offerings you selected, and helps you find partners, industries, work and the right next step.',
  },
  {
    title: 'Book or write to the Host',
    text: 'Hosts confirm each booking. You follow it under Bookings, and service access links appear there once you are confirmed.',
  },
]

const PRINCIPLES = [
  [
    'Real data only',
    'Country facts come live from the World Bank and Wikipedia, with sources shown. Nothing is made up.',
  ],
  [
    'Reviewed listings',
    'A person checks every new listing and every change to a live one before it shows.',
  ],
  [
    'Your data stays yours',
    'Conversations with the agent are private to you. We do not sell data.',
  ],
] as const

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="No borders, just differences."
      intro="Culture, language and business differ from country to country. Be[X] puts them on one map, so you can find the people, partners and offerings that fit who you are."
    >
      <section className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <div key={s.title} className="card p-6">
            <p className="font-display text-3xl text-brand-accent">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-brand-text">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-brand-text-muted">{s.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-3">
        {PRINCIPLES.map(([title, text]) => (
          <div key={title} className="border-t border-brand-line pt-5">
            <h2 className="font-semibold text-brand-text">{title}</h2>
            <p className="mt-2 text-brand-text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-[10px] bg-brand-deep p-6 text-[#f3f5f2] sm:p-10">
        <p className="eyebrow mb-3 !text-[#b8e4d5]">Made by 4XOR</p>
        <h2 className="font-display text-3xl">Software and AI agents from Aesch, Switzerland.</h2>
        <p className="mt-3 max-w-2xl text-white/80">
          Be[X] is a 4XOR project. The same team builds AI agents and workflow automation for
          businesses, and lists them here as offerings.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/map" className="btn btn-on-deep">
            Open the map
          </Link>
          <a href="https://4xor.com" className="btn border-white/30 text-white">
            Visit 4xor.com
          </a>
        </div>
      </section>
    </PageShell>
  )
}

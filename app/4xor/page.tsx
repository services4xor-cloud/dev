// @ts-nocheck — async server component (React 18 types don't support async components)
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatPrice, KIND_LABELS, readProps, toDTO } from '@/lib/opportunities'

export const metadata: Metadata = {
  title: { absolute: '4XOR Software — platforms, agents and automations' },
  description:
    '4XOR Software takes routine work off your team: enquiries answered, bookings handled, social media posted. See BeKenya and 4xor Studio as live examples.',
}

export const dynamic = 'force-dynamic'

/** 4xor.com — company page with the two live examples and bookable services. */
export default async function FourXorPage() {
  const provider = await db.node
    .findUnique({
      where: { type_code: { type: 'USER', code: 'provider:4xor' } },
      include: { outEdges: { where: { relation: 'OFFERS' }, include: { to: true } } },
    })
    .catch(() => null)

  const services = (provider?.outEdges ?? [])
    .map((e) => e.to)
    .filter((n) => n.active && readProps(n).status === 'PUBLISHED')
    .map((n) => toDTO(n, provider))

  const studio = services.find((s) => s.properties.kind === 'SERVICE')
  // Opens the map with our services selected for the agent (BeKenya's stay visible)
  const mapHref = services.length
    ? `/map?select=${services.map((s) => s.code).join(',')}&country=CH`
    : '/map'
  const onMap = (s: (typeof services)[number]) =>
    `/map?select=${s.code}&country=${s.properties.countryCode ?? 'CH'}`

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <header className="border-b border-brand-accent/10 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-brand-accent">4XOR Software</span>
          <nav className="flex gap-5 text-sm text-brand-text-muted">
            <a href="#work" className="hover:text-brand-accent">
              Work
            </a>
            <a href="#services" className="hover:text-brand-accent">
              Services
            </a>
            <a href="#contact" className="hover:text-brand-accent">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent/70">
          Software from Aesch, Switzerland
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          We build platforms, AI agents and automations that run your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-brand-text-muted">
          Two of our own products run live, and you can use both: a world map where people find and
          book journeys with an AI agent, and a studio that plans and posts social media for you.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#services"
            className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-accent hover:opacity-90"
          >
            See what you can book
          </a>
          <Link
            href={mapHref}
            className="rounded-lg border border-brand-accent/30 px-6 py-3 text-sm text-brand-text hover:bg-brand-accent/10"
          >
            See our services on the map
          </Link>
        </div>
      </section>

      <section id="work" className="border-t border-brand-accent/10 bg-brand-surface">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-16 md:grid-cols-2">
          <article className="flex flex-col rounded-xl border border-white/10 bg-brand-bg p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent/70">
              Example 1 · Map platform with agent
            </p>
            <h2 className="mt-2 text-2xl font-bold">Be[X] and BeKenya</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-text-muted">
              A world map of 177 countries where travellers pick journeys, ask an AI agent about
              exactly the ones they selected, and send a booking request the host confirms. BeKenya
              runs its safaris and coast trips on it. Sign in with Google or email, admins review
              every listing before it goes live.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href="/map?select=bekenya-21-days-safari-culture-coast&country=KE"
                className="text-brand-accent hover:underline"
              >
                Try the map →
              </Link>
              <a
                href="https://bekenya.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-text-muted hover:text-brand-accent"
              >
                bekenya.com
              </a>
            </div>
          </article>

          <article className="flex flex-col rounded-xl border border-white/10 bg-brand-bg p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent/70">
              Example 2 · Social media automation
            </p>
            <h2 className="mt-2 text-2xl font-bold">4xor Studio</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-text-muted">
              Your channels keep posting every week without taking your time. Posts are planned,
              written and scheduled for you, and nothing goes out until you approve it. Book it on
              the map, and once we confirm, your Studio access appears under My bookings.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {studio ? (
                <Link href={`/exchange/${studio.id}`} className="text-brand-accent hover:underline">
                  Book 4xor Studio →
                </Link>
              ) : null}
              <a
                href="https://studio.4xor.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-text-muted hover:text-brand-accent"
              >
                Studio login for customers
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold">What you can book</h2>
        <p className="mt-2 text-sm text-brand-text-muted">
          Every service is listed on the map too, so you can ask the agent about it first.{' '}
          <Link href={mapHref} className="text-brand-accent hover:underline">
            Open them on the map →
          </Link>
        </p>
        {services.length === 0 ? (
          <p className="mt-8 text-sm text-brand-text-muted">
            Our services will appear here shortly.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <article
                key={s.id}
                id={s.code}
                className="scroll-mt-6 rounded-xl border border-white/10 bg-brand-surface p-5 transition hover:border-brand-accent/40"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-accent/70">
                      {KIND_LABELS[s.properties.kind]}
                    </p>
                    <h3 className="font-semibold">{s.label}</h3>
                    <p className="mt-2 text-sm text-brand-text-muted">{s.properties.description}</p>
                    <p className="mt-3 text-sm font-medium">
                      {formatPrice(s.properties) ?? 'Price on request'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <Link href={onMap(s)} className="text-brand-accent hover:underline">
                        See it on the map →
                      </Link>
                      <Link
                        href={`/exchange/${s.id}`}
                        className="text-brand-text-muted hover:text-brand-accent"
                      >
                        Book or ask
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer id="contact" className="border-t border-brand-accent/10 bg-brand-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-between gap-6 px-6 py-10 text-sm text-brand-text-muted">
          <address className="not-italic">
            <p className="font-semibold text-brand-text">4XOR Software Schäuble</p>
            <p>Dornacherstrasse 17</p>
            <p>4147 Aesch, Switzerland</p>
          </address>
          <div className="flex flex-col gap-1">
            <Link href="/contact" className="hover:text-brand-accent">
              Contact us
            </Link>
            <Link href="/privacy" className="hover:text-brand-accent">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

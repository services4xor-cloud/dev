'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/site/Logo'

const COLUMNS: { head: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    head: 'Explore',
    links: [
      { label: 'World map', href: '/map' },
      { label: 'Offerings', href: '/opportunities' },
      { label: 'Agent', href: '/agent' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    head: 'Hosts',
    links: [
      { label: 'List an offering', href: '/opportunities/new' },
      { label: 'Your listings', href: '/opportunities#yours' },
      { label: 'Bookings', href: '/bookings' },
    ],
  },
  {
    head: 'Projects',
    links: [
      { label: '4XOR', href: 'https://4xor.com', external: true },
      { label: 'AI agents & automation', href: 'https://4xor.com/#solutions', external: true },
      { label: 'BeKenya', href: 'https://bekenya.com', external: true },
    ],
  },
]

const LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Legal notice', href: 'https://4xor.com/legal-notice' },
  { label: 'Contact', href: '/contact' },
]

/** Shared footer in the 4xor.com design: deep green band, site map, contact, local time. */
export default function SiteFooter() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 20_000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="mt-20 border-t-[3px] border-brand-accent bg-[radial-gradient(50%_60%_at_0%_100%,rgb(255_255_255/0.07),transparent_70%),linear-gradient(135deg,#1f6452,#17483c_60%)] pb-8 pt-12 text-[0.95rem] text-[#f3f5f2]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-[4fr_2fr_2fr_2fr_2.6fr]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/map" aria-label="Be[X] map">
              <Logo size={40} />
            </Link>
            <p className="mt-5 max-w-sm leading-relaxed text-white/80">
              No borders, just differences in culture, language and business. Find the people,
              partners and offerings that fit who you are.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.head}>
              <h2 className="mb-3.5 text-[0.85rem] font-semibold">{c.head}</h2>
              <ul className="grid gap-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        className="foot-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="foot-link">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-3.5 text-[0.85rem] font-semibold">Contact</h2>
            <ul className="grid gap-2">
              <li>
                <a href="mailto:services4xor@gmail.com" className="foot-link break-all">
                  services4xor@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+41766396609" className="foot-link">
                  +41 76 639 66 09
                </a>
              </li>
              <li className="mt-1 text-[0.88rem] leading-normal text-white/70">
                Dornacherstrasse 17, 4147 Aesch, Schweiz
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-5 text-[0.88rem] text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} 4XOR Software Schäuble</span>
          <nav aria-label="Legal" className="flex gap-5">
            {LEGAL.map((l) => (
              <a key={l.label} href={l.href} className="foot-link">
                {l.label}
              </a>
            ))}
          </nav>
          <span className="inline-flex items-center gap-2">
            <i aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-[#f7d27a]" />
            Local time in Aesch <b className="font-semibold tabular-nums text-white">{time}</b>
          </span>
        </div>
      </div>
    </footer>
  )
}

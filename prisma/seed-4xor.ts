/* eslint-disable no-console */
/**
 * Seeds the real 4xor and BeKenya offerings as Opportunities on the map.
 * Idempotent: creates missing listings and never overwrites existing ones,
 * so edits made in the app survive a re-run. With SEED_UPDATE=1 the title,
 * description, kind and public link of these listings are reset to the
 * text below (prices, contact and status stay as edited).
 *
 *   npm run db:seed:4xor
 *
 * Facts are taken from bekenya.com (Oct 2026). Prices left empty show as
 * "Price on request" — edit them in the app (Opportunities → Your listings
 * is for your own; admins edit these from the listing's edit page).
 * Hosts are provider nodes without a login; only Admins can edit them.
 */
import { PrismaClient, type Prisma } from '@prisma/client'

const prisma = new PrismaClient()
const UPDATE = process.env.SEED_UPDATE === '1'

interface Provider {
  code: string
  label: string
  icon: string
}

const BEKENYA: Provider = { code: 'provider:bekenya', label: 'BeKenya', icon: '🦁' }
const FOURXOR: Provider = { code: 'provider:4xor', label: '4XOR Software', icon: '⚡' }

const AESCH = { lat: 47.47, lng: 7.59 }

const LISTINGS: {
  code: string
  provider: Provider
  label: string
  icon: string
  lat: number
  lng: number
  properties: Record<string, unknown>
}[] = [
  {
    code: 'bekenya-21-days-safari-culture-coast',
    provider: BEKENYA,
    label: '21 days in Kenya: wildlife, culture and the coast in one trip',
    icon: '🧭',
    lat: -1.29,
    lng: 36.82,
    properties: {
      kind: 'JOURNEY',
      countryCode: 'KE',
      location: 'Maasai Mara · Nakuru & Naivasha · Mombasa · Watamu · Tsavo East & Marafa',
      description:
        'See the Big Five in the Maasai Mara, the lakes of Nakuru and Naivasha, old Mombasa, the beaches of Watamu and the red Marafa Canyon, all in one trip, with local guides who take care of the planning. You come home knowing Kenya, not just its postcards, and part of every trip goes to community projects.\n\n21 days / 20 nights. Days 3–7 Maasai Mara, Lake Nakuru and Naivasha; days 9–10 Mombasa and Fort Jesus; days 11–13 Watamu; days 14–19 Tsavo East and Marafa Canyon. Tours included, hotels on top. €1,350 per person from January to June, €1,620 per person from July to December. Operated by BeKenya Family Limited, Kenya.',
      sector: 'Tourism and Hospitality',
      price: 1350,
      currency: 'EUR',
      priceUnit: 'PERSON',
      demoUrl: 'https://bekenya.com/',
    },
  },
  {
    code: 'bekenya-masai-mara-safari',
    provider: BEKENYA,
    label: 'Masai Mara safari: the Big Five and the Great Migration',
    icon: '🦓',
    lat: -1.5,
    lng: 35.15,
    properties: {
      kind: 'JOURNEY',
      countryCode: 'KE',
      location: 'Maasai Mara',
      description:
        'Get close to lions, elephants and the Great Migration with local guides who know where to look. Meals and logistics are taken care of, so all you do is enjoy the safari.',
      sector: 'Tourism and Hospitality',
      demoUrl: 'https://bekenya.com/',
    },
  },
  {
    code: 'bekenya-watamu-beach',
    provider: BEKENYA,
    label: 'Watamu: white sand and coral reefs on the Indian Ocean',
    icon: '🏝️',
    lat: -3.35,
    lng: 40.02,
    properties: {
      kind: 'JOURNEY',
      countryCode: 'KE',
      location: 'Watamu, Indian Ocean coast',
      description:
        'Relaxed days on white sand, swimming over coral reefs in clear water. A local marine guide shows you the reef, and a driver takes care of getting around.',
      sector: 'Tourism and Hospitality',
      demoUrl: 'https://bekenya.com/',
    },
  },
  {
    code: '4xor-social-media-automation',
    provider: FOURXOR,
    label: 'Social media that keeps posting, without your time',
    icon: '📣',
    ...AESCH,
    properties: {
      kind: 'SERVICE',
      countryCode: 'CH',
      location: 'Aesch, Switzerland · works online worldwide',
      description:
        'Your channels stay active every week while your team works on customers. Posts are planned, written and scheduled for you, and nothing goes out until you approve it. After booking you get your own 4xor Studio workspace to see and approve every post.',
      sector: 'Technology and IT',
      priceUnit: 'MONTH',
      demoUrl: 'https://4xor.com/#4xor-social-media-automation',
      accessUrl: 'https://studio.4xor.de/',
    },
  },
  {
    code: '4xor-workflow-automation',
    provider: FOURXOR,
    label: 'Hours back every week: routine work that runs by itself',
    icon: '⚙️',
    ...AESCH,
    properties: {
      kind: 'AUTOMATION',
      countryCode: 'CH',
      location: 'Aesch, Switzerland · works online worldwide',
      description:
        'New leads get an answer in minutes, bookings land in your calendar, emails, reports and posts go out on time, and your tools pass data to each other without copy and paste. Your team approves what matters and spends the saved hours on customers. Start with one process and add the next once it pays off. We set it up, run it and keep it working.',
      sector: 'Technology and IT',
      demoUrl: 'https://4xor.com/#4xor-workflow-automation',
    },
  },
]

async function upsertProvider(p: Provider) {
  return prisma.node.upsert({
    where: { type_code: { type: 'USER', code: p.code } },
    // Provider nodes have no login; inactive so they don't count as Explorers
    create: { type: 'USER', code: p.code, label: p.label, icon: p.icon, active: false },
    update: { label: p.label, icon: p.icon },
  })
}

async function main() {
  console.log('🌍 Seeding 4xor + BeKenya opportunities...')
  const providers = new Map<string, { id: string }>()
  for (const p of [BEKENYA, FOURXOR]) providers.set(p.code, await upsertProvider(p))

  for (const l of LISTINGS) {
    const found = await prisma.node.findUnique({
      where: { type_code: { type: 'EXPERIENCE', code: l.code } },
    })
    if (found && UPDATE) {
      const { description, kind, demoUrl } = l.properties
      await prisma.node.update({
        where: { id: found.id },
        data: {
          label: l.label,
          icon: l.icon,
          properties: {
            ...((found.properties as Record<string, unknown> | null) ?? {}),
            description,
            kind,
            demoUrl,
          } as Prisma.InputJsonValue,
        },
      })
    }
    const node =
      found ??
      (await prisma.node.create({
        data: {
          type: 'EXPERIENCE',
          code: l.code,
          label: l.label,
          icon: l.icon,
          lat: l.lat,
          lng: l.lng,
          properties: { ...l.properties, status: 'PUBLISHED' } as Prisma.InputJsonValue,
        },
      }))
    const providerId = providers.get(l.provider.code)!.id
    await prisma.edge.upsert({
      where: { fromId_toId_relation: { fromId: providerId, toId: node.id, relation: 'OFFERS' } },
      create: { fromId: providerId, toId: node.id, relation: 'OFFERS' },
      update: {},
    })
    console.log(`  ✓ ${l.label}`)
  }
  console.log('✅ Done')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

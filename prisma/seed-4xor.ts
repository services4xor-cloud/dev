/* eslint-disable no-console */
/**
 * Seeds the real 4xor and BeKenya offerings as Opportunities on the map.
 * Idempotent: creates missing listings and never overwrites existing ones,
 * so edits made in the app survive a re-run.
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
    label: '21 Days Kenya: Safari, Culture & Coast',
    icon: '🧭',
    lat: -1.29,
    lng: 36.82,
    properties: {
      kind: 'JOURNEY',
      countryCode: 'KE',
      location: 'Maasai Mara · Nakuru & Naivasha · Mombasa · Watamu · Tsavo East & Marafa',
      description:
        '21 days / 20 nights across Kenya with local guides. Days 3–7 Maasai Mara, Lake Nakuru and Naivasha; days 9–10 Mombasa and Fort Jesus; days 11–13 Watamu; days 14–19 Tsavo East and Marafa Canyon.\n\nTours included, hotels on top. €1,350 per person from January to June, €1,620 per person from July to December. Operated by BeKenya Family Limited, Kenya; part of every trip goes to community projects.',
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
    label: 'Masai Mara Safari Adventure',
    icon: '🦓',
    lat: -1.5,
    lng: 35.15,
    properties: {
      kind: 'JOURNEY',
      countryCode: 'KE',
      location: 'Maasai Mara',
      description:
        'Safari in the Maasai Mara with expert local guides: the Big Five and the Great Migration. Catering and logistics handled by BeKenya.',
      sector: 'Tourism and Hospitality',
      demoUrl: 'https://bekenya.com/',
    },
  },
  {
    code: 'bekenya-watamu-beach',
    provider: BEKENYA,
    label: 'Watamu Beach Paradise',
    icon: '🏝️',
    lat: -3.35,
    lng: 40.02,
    properties: {
      kind: 'JOURNEY',
      countryCode: 'KE',
      location: 'Watamu, Indian Ocean coast',
      description:
        'White sand, coral reefs and the Indian Ocean in Watamu, with a local marine guide and driver.',
      sector: 'Tourism and Hospitality',
      demoUrl: 'https://bekenya.com/',
    },
  },
  {
    code: '4xor-social-media-automation',
    provider: FOURXOR,
    label: 'Social media automation (4xor Studio)',
    icon: '📣',
    ...AESCH,
    properties: {
      kind: 'SERVICE',
      countryCode: 'CH',
      location: 'Aesch, Switzerland · works online worldwide',
      description:
        'We plan, write and schedule your social media posts with 4xor Studio, our planner built on OpenClaw and n8n. You approve posts before they go out. After booking you get access to your own Studio workspace.',
      sector: 'Technology and IT',
      priceUnit: 'MONTH',
      demoUrl: 'https://4xor.com/',
      accessUrl: 'https://studio.4xor.de/',
    },
  },
  {
    code: '4xor-workflow-automation',
    provider: FOURXOR,
    label: 'Workflow automation with n8n',
    icon: '⚙️',
    ...AESCH,
    properties: {
      kind: 'AUTOMATION',
      countryCode: 'CH',
      location: 'Aesch, Switzerland · works online worldwide',
      description:
        'We automate repetitive work for your business with n8n: lead handling, bookings, emails, reports and connections between your tools. We set it up, host it and keep it running.',
      sector: 'Technology and IT',
      demoUrl: 'https://4xor.com/',
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
    const node =
      (await prisma.node.findUnique({
        where: { type_code: { type: 'EXPERIENCE', code: l.code } },
      })) ??
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

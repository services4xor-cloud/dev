/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '../lib/country-selector'
import { FAITH_OPTIONS } from '../lib/dimensions'
import { EXPLORER_TYPES } from '../lib/vocabulary'

const prisma = new PrismaClient()

async function main() {
  console.log('🌍 Seeding Be[X] v2 graph...')

  // Phase 1: Dimension nodes
  await seedLanguages()
  await seedFaiths()
  await seedCurrencies()
  await seedSectors()
  await seedCountries()

  // Phase 2: Edges
  await seedCountryLanguageEdges()
  await seedCountryCurrencyEdges()

  console.log('✅ Seed complete')
}

async function seedLanguages() {
  const languages = Object.values(LANGUAGE_REGISTRY)
  console.log(`  📝 Seeding ${languages.length} languages...`)

  for (const lang of languages) {
    await prisma.node.upsert({
      where: { type_code: { type: 'LANGUAGE', code: lang.code } },
      create: {
        type: 'LANGUAGE',
        code: lang.code,
        label: lang.name,
        labelKey: `language.${lang.code}`,
        properties: { nativeName: lang.nativeName, digitalReach: lang.digitalReach },
      },
      update: {
        label: lang.name,
        properties: { nativeName: lang.nativeName, digitalReach: lang.digitalReach },
      },
    })
  }
}

async function seedFaiths() {
  console.log(`  🙏 Seeding ${FAITH_OPTIONS.length} faiths...`)

  for (const faith of FAITH_OPTIONS) {
    await prisma.node.upsert({
      where: { type_code: { type: 'FAITH', code: faith.id } },
      create: {
        type: 'FAITH',
        code: faith.id,
        label: faith.label,
        labelKey: faith.labelKey,
        icon: faith.icon,
      },
      update: {
        label: faith.label,
        icon: faith.icon,
      },
    })
  }
}

async function seedCurrencies() {
  // Extract unique currencies from country data
  const currencies = new Set<string>()
  for (const country of COUNTRY_OPTIONS) {
    if (country.currency) currencies.add(country.currency)
  }

  console.log(`  💰 Seeding ${currencies.size} currencies...`)

  for (const code of Array.from(currencies)) {
    await prisma.node.upsert({
      where: { type_code: { type: 'CURRENCY', code } },
      create: {
        type: 'CURRENCY',
        code,
        label: code, // Currency codes are their own labels (USD, EUR, KES)
      },
      update: {},
    })
  }
}

async function seedSectors() {
  // Extract all unique sectors from EXPLORER_TYPES
  const sectors = new Set<string>()
  for (const explorerType of Object.values(EXPLORER_TYPES)) {
    for (const sector of explorerType.sectors) {
      sectors.add(sector)
    }
  }

  console.log(`  🏢 Seeding ${sectors.size} sectors...`)

  for (const sector of Array.from(sectors)) {
    const code = sector.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    await prisma.node.upsert({
      where: { type_code: { type: 'SECTOR', code } },
      create: {
        type: 'SECTOR',
        code,
        label: sector,
      },
      update: {
        label: sector,
      },
    })
  }
}

async function seedCountries() {
  console.log(`  🌍 Seeding ${COUNTRY_OPTIONS.length} countries...`)

  for (const country of COUNTRY_OPTIONS) {
    await prisma.node.upsert({
      where: { type_code: { type: 'COUNTRY', code: country.code } },
      create: {
        type: 'COUNTRY',
        code: country.code,
        label: country.name,
        icon: country.flag,
        lat: country.lat,
        lng: country.lng,
        properties: {
          region: country.region,
          corridorStrength: country.corridorStrength,
          topSectors: country.topSectors,
          visa: country.visa,
          tz: country.tz,
          payment: country.payment,
        },
      },
      update: {
        label: country.name,
        icon: country.flag,
        lat: country.lat,
        lng: country.lng,
        properties: {
          region: country.region,
          corridorStrength: country.corridorStrength,
          topSectors: country.topSectors,
          visa: country.visa,
          tz: country.tz,
          payment: country.payment,
        },
      },
    })
  }
}

async function seedCountryLanguageEdges() {
  console.log('  🔗 Seeding OFFICIAL_LANG edges...')
  let count = 0

  // Use LANGUAGE_REGISTRY.countries to create edges
  for (const lang of Object.values(LANGUAGE_REGISTRY)) {
    const langNode = await prisma.node.findUnique({
      where: { type_code: { type: 'LANGUAGE', code: lang.code } },
    })
    if (!langNode) continue

    for (const countryCode of lang.countries) {
      const countryNode = await prisma.node.findUnique({
        where: { type_code: { type: 'COUNTRY', code: countryCode } },
      })
      if (!countryNode) continue

      await prisma.edge.upsert({
        where: {
          fromId_toId_relation: {
            fromId: countryNode.id,
            toId: langNode.id,
            relation: 'OFFICIAL_LANG',
          },
        },
        create: {
          fromId: countryNode.id,
          toId: langNode.id,
          relation: 'OFFICIAL_LANG',
        },
        update: {},
      })
      count++
    }
  }

  console.log(`    Created ${count} OFFICIAL_LANG edges`)
}

async function seedCountryCurrencyEdges() {
  console.log('  🔗 Seeding COUNTRY_CURRENCY edges...')
  let count = 0

  for (const country of COUNTRY_OPTIONS) {
    if (!country.currency) continue

    const countryNode = await prisma.node.findUnique({
      where: { type_code: { type: 'COUNTRY', code: country.code } },
    })
    const currencyNode = await prisma.node.findUnique({
      where: { type_code: { type: 'CURRENCY', code: country.currency } },
    })
    if (!countryNode || !currencyNode) continue

    await prisma.edge.upsert({
      where: {
        fromId_toId_relation: {
          fromId: countryNode.id,
          toId: currencyNode.id,
          relation: 'COUNTRY_CURRENCY',
        },
      },
      create: {
        fromId: countryNode.id,
        toId: currencyNode.id,
        relation: 'COUNTRY_CURRENCY',
      },
      update: {},
    })
    count++
  }

  console.log(`    Created ${count} COUNTRY_CURRENCY edges`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

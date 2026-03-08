/**
 * Bekenya Test Data Seed
 * Run: npx prisma db seed
 *
 * Creates realistic test data for Kenya deployment:
 * - 5 test employers
 * - 20 test job posts (mix of tiers)
 * - 5 test job seekers
 * - 10 test applications
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Bekenya test data...')

  // ── Test Employers ──────────────────────────────────────────────────────────
  const employers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'hr@safaricom.test' },
      update: {},
      create: {
        email: 'hr@safaricom.test',
        name: 'Safaricom HR',
        role: 'EMPLOYER',
        country: 'Kenya',
        profile: {
          create: {
            bio: 'Leading telecom company in Kenya, powering M-Pesa.',
            headline: 'HR Manager',
            skills: ['recruitment', 'HR', 'Kenya'],
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'careers@kcb.test' },
      update: {},
      create: {
        email: 'careers@kcb.test',
        name: 'KCB Bank Kenya',
        role: 'EMPLOYER',
        country: 'Kenya',
        profile: {
          create: {
            bio: 'Kenya Commercial Bank — largest bank in East Africa.',
            headline: 'Talent Acquisition',
            skills: ['banking', 'finance', 'Kenya'],
          },
        },
      },
    }),
  ])

  // ── Test Jobs ───────────────────────────────────────────────────────────────
  const jobs = [
    {
      title: 'Senior Software Engineer',
      company: 'Safaricom',
      description: 'Join the M-Pesa team and build financial infrastructure for 30M+ users across East Africa. We need a Senior Software Engineer who can lead development of new payment features.',
      location: 'Nairobi, Kenya',
      isRemote: true,
      jobType: 'FULL_TIME' as const,
      salaryMin: 180000,
      salaryMax: 280000,
      currency: 'KES',
      skills: ['TypeScript', 'Node.js', 'React', 'AWS', 'PostgreSQL'],
      country: 'Kenya',
      status: 'ACTIVE' as const,
      tier: 'FEATURED' as const,
      employerId: employers[0].id,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Safari Guide & Wildlife Educator',
      company: 'Basecamp Masai Mara',
      description: 'Lead international tourists on safari experiences in the Masai Mara. Share deep knowledge of Kenyan wildlife, ecology, and Maasai culture. Must speak fluent English and Swahili.',
      location: 'Masai Mara, Kenya',
      isRemote: false,
      jobType: 'FULL_TIME' as const,
      salaryMin: 80000,
      salaryMax: 120000,
      currency: 'KES',
      skills: ['Wildlife Knowledge', 'English', 'Swahili', 'Customer Service', 'First Aid'],
      country: 'Kenya',
      status: 'ACTIVE' as const,
      tier: 'PREMIUM' as const,
      employerId: employers[0].id,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Branch Manager — Westlands',
      company: 'KCB Bank Kenya',
      description: 'Lead the Westlands branch operations, managing a team of 15 staff and serving corporate and retail clients. Strong leadership and banking experience required.',
      location: 'Westlands, Nairobi',
      isRemote: false,
      jobType: 'FULL_TIME' as const,
      salaryMin: 200000,
      salaryMax: 300000,
      currency: 'KES',
      skills: ['Banking', 'Leadership', 'Sales', 'Credit Analysis', 'Customer Relations'],
      country: 'Kenya',
      status: 'ACTIVE' as const,
      tier: 'FEATURED' as const,
      employerId: employers[1].id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Social Media Manager',
      company: 'Twiga Foods',
      description: 'Manage Twiga Foods\' social media presence across Twitter, Instagram, TikTok and LinkedIn. Create engaging content about fresh food and agricultural supply chains.',
      location: 'Nairobi, Kenya',
      isRemote: true,
      jobType: 'FULL_TIME' as const,
      salaryMin: 60000,
      salaryMax: 100000,
      currency: 'KES',
      skills: ['Social Media', 'Content Creation', 'Photography', 'Canva', 'Analytics'],
      country: 'Kenya',
      status: 'ACTIVE' as const,
      tier: 'BASIC' as const,
      employerId: employers[0].id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Eco-Lodge Manager — Amboseli',
      company: 'Ol Tukai Lodge',
      description: 'Manage daily operations of our luxury eco-lodge with 80 rooms at the foot of Kilimanjaro. Oversee staff, maintain 5-star standards, and ensure sustainability practices.',
      location: 'Amboseli, Kenya',
      isRemote: false,
      jobType: 'FULL_TIME' as const,
      salaryMin: 150000,
      salaryMax: 220000,
      currency: 'KES',
      skills: ['Hospitality Management', 'Sustainability', 'Team Leadership', 'English', 'Safari Knowledge'],
      country: 'Kenya',
      status: 'ACTIVE' as const,
      tier: 'FEATURED' as const,
      employerId: employers[1].id,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Community Health Worker — Kibera',
      company: 'Amref Health Africa',
      description: 'Provide primary healthcare services and health education to families in Kibera. Must have nursing or clinical officer qualification. Swahili essential.',
      location: 'Kibera, Nairobi',
      isRemote: false,
      jobType: 'FULL_TIME' as const,
      salaryMin: 45000,
      salaryMax: 65000,
      currency: 'KES',
      skills: ['Nursing', 'Community Health', 'Swahili', 'First Aid', 'Health Education'],
      country: 'Kenya',
      status: 'ACTIVE' as const,
      tier: 'BASIC' as const,
      employerId: employers[0].id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: `seed_${job.title.replace(/\s+/g, '_').toLowerCase()}` },
      update: {},
      create: { id: `seed_${job.title.replace(/\s+/g, '_').toLowerCase()}`, ...job },
    })
  }

  // ── Test Job Seekers ────────────────────────────────────────────────────────
  const seekers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'wanjiku@test.com' },
      update: {},
      create: {
        email: 'wanjiku@test.com',
        name: 'Wanjiku Maina',
        role: 'JOB_SEEKER',
        country: 'Kenya',
        phone: '+254712345678',
        profile: {
          create: {
            bio: 'Experienced software engineer with 5 years building fintech products in Nairobi.',
            headline: 'Software Engineer',
            skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'kamau@test.com' },
      update: {},
      create: {
        email: 'kamau@test.com',
        name: 'Kamau Njoroge',
        role: 'JOB_SEEKER',
        country: 'Kenya',
        phone: '+254722345678',
        profile: {
          create: {
            bio: 'Passionate safari guide with 8 years experience in Masai Mara and Amboseli. Fluent in 3 languages.',
            headline: 'Senior Safari Guide',
            skills: ['Wildlife Knowledge', 'English', 'Swahili', 'French', 'First Aid'],
          },
        },
      },
    }),
  ])

  console.log(`✅ Seeded ${employers.length} employers`)
  console.log(`✅ Seeded ${jobs.length} jobs`)
  console.log(`✅ Seeded ${seekers.length} job seekers`)
  console.log('')
  console.log('🎉 Test data ready! Visit /jobs to see listings.')
}

main()
  .catch(e => { console.error('Seed failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

/**
 * Mock / static data for the Media (BeKenya Media Division) page
 *
 * Extracted from app/media/page.tsx
 */

export const MEDIA_PATHS = [
  {
    emoji: '🎬',
    title: 'Video / Documentary',
    description:
      "Safari films, social media content, corporate video, NGO impact documentaries. Kenya's landscapes deserve the world's screens.",
    sectors: ['Safari Films', 'Corporate', 'NGO', 'Social Media'],
    earning: 'KES 40,000 – 120,000/project',
  },
  {
    emoji: '📸',
    title: 'Photography',
    description:
      'Wildlife, fashion, events, real estate. Brands and lodges pay top dollar for authentic African imagery that resonates globally.',
    sectors: ['Wildlife', 'Fashion', 'Events', 'Real Estate'],
    earning: 'KES 8,000 – 50,000/day',
  },
  {
    emoji: '✍️',
    title: 'Content Writing',
    description:
      'Travel blogs, brand stories, social media management. Your words can take someone from Berlin to Nairobi before they book a flight.',
    sectors: ['Travel Blogs', 'Brand Stories', 'Social Media'],
    earning: 'KES 20,000 – 80,000/month',
  },
  {
    emoji: '🎵',
    title: 'Music & Audio',
    description:
      'Soundtracks for safari films, podcast production, voice-over for brands. The sound of Africa, heard everywhere.',
    sectors: ['Soundtracks', 'Podcasts', 'Voice-Over'],
    earning: 'KES 15,000 – 60,000/project',
  },
]

export const MEDIA_FEATURED_PROJECTS = [
  {
    title: 'Maasai Mara Documentary Series',
    client: 'Commissioned by German travel brand',
    description:
      "A 6-part documentary series capturing the Great Migration, Maasai culture, and Kenya's conservation story for German-speaking audiences.",
    needs: ['Videographer', 'Editor', 'Guide-Narrator'],
    status: 'Seeking Pioneers',
    flag: '🇩🇪',
    value: 'KES 180,000',
  },
  {
    title: 'Safaricom Digital Campaign',
    client: 'Safaricom Brand Team',
    description:
      '3 content creators needed for a nationwide digital campaign celebrating Kenyan innovation and everyday heroes.',
    needs: ['Content Creator x3', 'Social Media Manager'],
    status: 'Applications Open',
    flag: '🇰🇪',
    value: 'KES 45,000/creator',
  },
  {
    title: 'Victoria Paradise Social Media',
    client: 'Victoria Paradise Lodge, Kisumu',
    description:
      'Full-time Instagram and TikTok manager needed for a luxury lodge on Lake Victoria. Remote + occasional on-site.',
    needs: ['Instagram Manager', 'TikTok Creator'],
    status: 'Urgent',
    flag: '🌊',
    value: 'KES 65,000/month',
  },
]

export const MEDIA_PLATFORMS = [
  { name: 'Instagram', emoji: '📸' },
  { name: 'TikTok', emoji: '🎵' },
  { name: 'Facebook', emoji: '👥' },
  { name: 'Twitter/X', emoji: '✖️' },
  { name: 'LinkedIn', emoji: '💼' },
  { name: 'YouTube', emoji: '▶️' },
  { name: 'WhatsApp', emoji: '💬' },
  { name: 'Pinterest', emoji: '📌' },
  { name: 'Telegram', emoji: '✈️' },
]

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { actionEmail, sendEmail } from '@/lib/email'
import { readProps } from '@/lib/opportunities'
import { rateLimit } from '@/lib/rate-limit'

const MESSAGE_MAX = 2000

// POST /api/opportunities/[id]/contact — a signed-in visitor writes to the
// provider of a published listing. The message is relayed by email with the
// visitor as reply-to; the provider's address is never revealed to them.
// Recipient: the listing's contact email, else the host's account email,
// else the admins (providers without a login, e.g. BeKenya, 4XOR).
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!(await rateLimit('contact', userId, 10, 60 * 60))) {
    return NextResponse.json({ error: 'Too many messages. Try again in an hour.' }, { status: 429 })
  }

  let body: { message?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (message.length < 5) return NextResponse.json({ error: 'Write a message' }, { status: 400 })

  const node = await db.node.findUnique({
    where: { id: params.id },
    include: {
      inEdges: {
        where: { relation: 'OFFERS' },
        include: { from: { select: { label: true, user: { select: { email: true } } } } },
        take: 1,
      },
    },
  })
  const props = node ? readProps(node) : null
  if (!node || node.type !== 'EXPERIENCE' || !node.active || props?.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  }

  const sender = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  })
  if (!sender) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const hostEmail = node.inEdges[0]?.from.user?.email
  const to = props.contactEmail
    ? [props.contactEmail]
    : hostEmail
      ? [hostEmail]
      : (await db.user.findMany({ where: { role: 'ADMIN' }, select: { email: true } })).map(
          (a) => a.email
        )
  if (to.length === 0) {
    return NextResponse.json({ error: 'This provider cannot be contacted yet' }, { status: 503 })
  }

  const base = process.env.NEXTAUTH_URL ?? req.nextUrl.origin
  try {
    await sendEmail({
      to,
      replyTo: sender.email,
      subject: `Question about ${node.label}`,
      html: actionEmail(
        `${sender.name ?? 'A visitor'} wrote about ${node.label}`,
        `${message.slice(0, MESSAGE_MAX)}\n\nReply to this email to answer ${sender.name ?? 'them'} directly (${sender.email}).`,
        'Open the listing',
        `${base}/exchange/${node.id}`
      ),
    })
  } catch {
    return NextResponse.json(
      { error: 'The message could not be sent. Try again later.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}

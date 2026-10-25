import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendDirectMessage } from '@/lib/conversations'
import { actionEmail, sendEmail } from '@/lib/email'
import { notify } from '@/lib/notifications'
import { readProps } from '@/lib/opportunities'
import { rateLimit } from '@/lib/rate-limit'

const MESSAGE_MAX = 2000

// POST /api/opportunities/[id]/contact — a signed-in visitor writes to the
// provider of a published listing. The message lands in the provider's
// Messages inbox (the host's account, else the admins for providers without a
// login, e.g. BeKenya, 4XOR) and is also emailed with the visitor as reply-to;
// the provider's address is never revealed to them.
// Email goes to the listing's contact email, else the host's, else the admins.
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
        include: {
          from: { select: { label: true, userId: true, user: { select: { email: true } } } },
        },
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

  // Inbox first: the host's account, else the admins (providers without a login).
  // Email is a courtesy on top, so a bounced email never loses the message.
  const host = node.inEdges[0]?.from
  const admins = host?.userId
    ? []
    : await db.user.findMany({ where: { role: 'ADMIN' }, select: { id: true, email: true } })
  const inbox = (host?.userId ? [host.userId] : admins.map((a) => a.id)).filter(
    (id) => id !== userId
  )
  const emailTo = props.contactEmail
    ? [props.contactEmail]
    : host?.user?.email
      ? [host.user.email]
      : admins.map((a) => a.email)
  if (inbox.length === 0 && emailTo.length === 0) {
    return NextResponse.json({ error: 'This provider cannot be contacted yet' }, { status: 503 })
  }

  const text = message.slice(0, MESSAGE_MAX)
  let conversationId: string | undefined
  for (const recipientId of inbox) {
    const sent = await sendDirectMessage(
      userId,
      recipientId,
      `About ${node.label}:

${text}`
    )
    conversationId ??= sent.conversationId
    notify({
      userId: recipientId,
      type: 'MESSAGE',
      title: `${sender.name ?? 'A visitor'} asked about ${node.label}`,
      body: text.slice(0, 100),
      link: '/messages',
    }).catch(() => {})
  }

  const base = process.env.NEXTAUTH_URL ?? req.nextUrl.origin
  const email = sendEmail({
    to: emailTo,
    replyTo: sender.email,
    subject: `Question about ${node.label}`,
    html: actionEmail(
      `${sender.name ?? 'A visitor'} wrote about ${node.label}`,
      `${text}

Reply in Messages, or reply to this email to answer ${sender.name ?? 'them'} directly (${sender.email}).`,
      'Open Messages',
      `${base}/messages`
    ),
  })

  if (inbox.length === 0) {
    // Email is the only channel, so its failure is the visitor's failure
    try {
      await email
    } catch {
      return NextResponse.json(
        { error: 'The message could not be sent. Try again later.' },
        { status: 502 }
      )
    }
  } else {
    await email.catch((e) => console.warn('[contact] email not sent, message is in the inbox:', e))
  }

  return NextResponse.json({ ok: true, ...(conversationId ? { conversationId } : {}) })
}

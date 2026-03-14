import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Resend } from 'resend'
import { db } from '@/lib/db'

/**
 * NextAuth configuration — shared between route handler and getServerSession.
 *
 * Adapter: PrismaAdapter stores Account (OAuth links) in Neon.
 * Strategy: JWT — no DB round-trip per request.
 * Providers: Google OAuth + Magic Link (via Resend HTTP API).
 */
const hasDB = !!process.env.DATABASE_URL
const resendKey = process.env.RESEND_API_KEY

async function sendMagicLink({
  identifier: email,
  url,
}: {
  identifier: string
  url: string
  provider: { from: string }
}) {
  if (!resendKey) throw new Error('RESEND_API_KEY not configured')
  const resend = new Resend(resendKey)
  const fromAddress = process.env.EMAIL_FROM ?? 'BeNetwork <services4xor@gmail.com>'

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: 'Sign in to BeNetwork',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #5C0A14; font-size: 24px; margin: 0;">BeNetwork</h1>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Click below to sign in to your account. This link expires in 24 hours.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background: #5C0A14; color: #C9A227; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            Sign in to BeNetwork
          </a>
        </div>
        <p style="color: #888; font-size: 13px; line-height: 1.4;">
          If you didn't request this email, you can safely ignore it.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 11px; text-align: center;">
          BeNetwork — Identity-first life routing
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('[auth] Resend magic link error:', JSON.stringify(error))
    throw new Error(`Magic link failed: ${error.message}`)
  }
}

export const authOptions: NextAuthOptions = {
  ...(hasDB ? { adapter: PrismaAdapter(db) as NextAuthOptions['adapter'] } : {}),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    ...(hasDB && resendKey
      ? [
          EmailProvider({
            sendVerificationRequest: sendMagicLink,
            from: process.env.EMAIL_FROM ?? 'BeNetwork <onboarding@resend.dev>',
          }),
        ]
      : []),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        try {
          const dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { role: true, country: true, language: true },
          })
          if (dbUser) {
            token.role = dbUser.role
            token.country = dbUser.country
            token.language = dbUser.language
          }
        } catch {
          token.role = 'EXPLORER'
          token.country = 'KE'
          token.language = 'en'
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as {
          id?: string
          role?: string
          country?: string
          language?: string
        }
        u.id = token.id as string
        u.role = token.role as string
        u.country = token.country as string
        u.language = token.language as string
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        const { db } = await import('@/lib/db')
        await db.node.create({
          data: {
            type: 'USER',
            code: user.email ?? user.id,
            label: user.name ?? 'Explorer',
            icon: '👤',
            userId: user.id,
          },
        })
      }
    },
  },
}

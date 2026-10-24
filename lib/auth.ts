import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { actionEmail, sendEmail } from '@/lib/email'
import { normalizeEmail, verifyPassword } from '@/lib/password'
import { rateLimit } from '@/lib/rate-limit'

/**
 * NextAuth configuration — shared between route handler and getServerSession.
 *
 * Adapter: PrismaAdapter stores Account (OAuth links) in Neon.
 * Strategy: JWT (required for the credentials provider). Tokens carry the
 * user's tokenVersion; it is re-checked against the DB every few minutes, so
 * bumping it ("sign out everywhere", password change) ends every session.
 * Providers: Google OAuth, email + password, Magic Link (via Resend).
 * ADMIN_EMAILS (comma-separated) are promoted to ADMIN on sign-in.
 */
const hasDB = !!process.env.DATABASE_URL
const resendKey = process.env.RESEND_API_KEY
const RECHECK_MS = 5 * 60 * 1000
const SESSION_MAX_AGE = 30 * 24 * 60 * 60

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

async function sendMagicLink({ identifier: email, url }: { identifier: string; url: string }) {
  await sendEmail({
    to: email,
    subject: 'Sign in to Be[X]',
    html: actionEmail(
      'Be[X]',
      'Click below to sign in to your account. This link expires in 24 hours.',
      'Sign in to Be[X]',
      url
    ),
  })
}

export const authOptions: NextAuthOptions = {
  ...(hasDB ? { adapter: PrismaAdapter(db) as NextAuthOptions['adapter'] } : {}),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      // Google verifies emails, so a Google sign-in may attach to an existing
      // account with the same email (see events.linkAccount for the safeguard).
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: 'password',
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = normalizeEmail(credentials?.email)
        const password = credentials?.password
        if (!email || typeof password !== 'string' || !password) return null
        if (!(await rateLimit('login', email, 10, 15 * 60))) {
          throw new Error('TooManyAttempts')
        }
        const user = await db.user.findUnique({ where: { email } })
        if (!user?.passwordHash) return null
        if (!(await verifyPassword(password, user.passwordHash))) return null
        if (!user.emailVerified) throw new Error('EmailNotVerified')
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          country: user.country,
          language: user.language,
        }
      },
    }),
    ...(hasDB && resendKey
      ? [
          EmailProvider({
            sendVerificationRequest: sendMagicLink,
            from: process.env.EMAIL_FROM ?? 'Be[X] <onboarding@resend.dev>',
          }),
        ]
      : []),
  ],
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        try {
          let dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { email: true, role: true, country: true, language: true, tokenVersion: true },
          })
          if (dbUser && dbUser.role !== 'ADMIN' && adminEmails().includes(dbUser.email)) {
            dbUser = await db.user.update({
              where: { id: user.id },
              data: { role: 'ADMIN' },
              select: {
                email: true,
                role: true,
                country: true,
                language: true,
                tokenVersion: true,
              },
            })
          }
          if (dbUser) {
            token.role = dbUser.role
            token.country = dbUser.country
            token.language = dbUser.language
            token.tokenVersion = dbUser.tokenVersion
            token.checkedAt = Date.now()
          }
        } catch {
          token.role = 'EXPLORER'
          token.country = 'KE'
          token.language = 'en'
        }
        return token
      }

      // Periodic re-check: picks up role changes and revoked sessions.
      if (token.id && Date.now() - (token.checkedAt ?? 0) > RECHECK_MS) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id },
            select: { role: true, country: true, language: true, tokenVersion: true },
          })
          if (!dbUser || dbUser.tokenVersion !== (token.tokenVersion ?? 0)) {
            token.revoked = true
            return token
          }
          token.role = dbUser.role
          token.country = dbUser.country
          token.language = dbUser.language
          token.checkedAt = Date.now()
        } catch {
          // DB unreachable — keep the current token until the next check
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.revoked) {
        // Session was revoked — expose no user so every route treats it as signed out.
        return { ...session, user: undefined } as unknown as typeof session
      }
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
    // If Google is linked to a password account that was never confirmed, the
    // password may have been set by someone else: drop it and trust Google.
    async linkAccount({ user, account }) {
      if (account.provider !== 'google' || !user.id) return
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { emailVerified: true, passwordHash: true },
      })
      if (dbUser && !dbUser.emailVerified) {
        await db.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            ...(dbUser.passwordHash ? { passwordHash: null } : {}),
          },
        })
      }
    },
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

import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'

/**
 * NextAuth configuration — shared between route handler and getServerSession.
 *
 * Adapter: PrismaAdapter stores Account (OAuth links) in Neon.
 * Strategy: JWT — no DB round-trip per request.
 * Providers: Google OAuth + Magic Link (via Resend).
 *
 * NOTE: Only use adapter when DATABASE_URL is set, otherwise Google OAuth
 * will silently fail when trying to write Account records to a cold/missing DB.
 */
const hasDB = !!process.env.DATABASE_URL

export const authOptions: NextAuthOptions = {
  // Only wire PrismaAdapter if we have a DB — otherwise NextAuth works in
  // "JWT-only" mode (no Account persistence, but OAuth still works)
  ...(hasDB ? { adapter: PrismaAdapter(db) as NextAuthOptions['adapter'] } : {}),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // Magic link email — requires RESEND_API_KEY + DATABASE_URL
    ...(hasDB && process.env.RESEND_API_KEY
      ? [
          EmailProvider({
            server: {
              host: 'smtp.resend.com',
              port: 465,
              auth: {
                user: 'resend',
                pass: process.env.RESEND_API_KEY,
              },
            },
            from: process.env.EMAIL_FROM ?? 'BeNetwork <noreply@bekenya.com>',
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
            select: { role: true, country: true },
          })
          if (dbUser) {
            token.role = dbUser.role
            token.country = dbUser.country
          }
        } catch {
          token.role = 'PIONEER'
          token.country = 'KE'
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as { id?: string; role?: string; country?: string }
        u.id = token.id as string
        u.role = token.role as string
        u.country = token.country as string
      }
      return session
    },
  },
}

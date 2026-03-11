import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'

/**
 * NextAuth configuration — shared between route handler and getServerSession.
 *
 * Adapter: PrismaAdapter stores Account (OAuth links) in Neon.
 * Strategy: JWT — no DB round-trip per request.
 * Providers: Google OAuth + email/password (with bcrypt).
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
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          })
          if (!user?.passwordHash) return null

          const valid = await compare(credentials.password, user.passwordHash)
          if (!valid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            country: user.country,
          }
        } catch {
          // Dev fallback when DB is unavailable
          if (process.env.NODE_ENV === 'development') {
            return {
              id: 'dev_user',
              email: credentials.email,
              name: 'Dev User',
            }
          }
          return null
        }
      },
    }),
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

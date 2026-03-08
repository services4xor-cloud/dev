import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
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
        // TODO: look up user in Prisma + verify password hash
        // const user = await prisma.user.findUnique({ where: { email: credentials?.email } })
        // if (!user) return null
        // const valid = await bcrypt.compare(credentials?.password ?? '', user.passwordHash)
        // if (!valid) return null
        // return { id: user.id, email: user.email, name: user.name, role: user.role }

        // Mock for now — REMOVE before production
        if (credentials?.email && credentials?.password) {
          return {
            id: 'mock_user_id',
            email: credentials.email,
            name: 'Test User',
          }
        }
        return null
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
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string
      return session
    },
  },
})

export { handler as GET, handler as POST }

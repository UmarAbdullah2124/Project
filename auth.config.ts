import type { NextAuthConfig } from 'next-auth'

const protectedPrefixes = ['/dashboard', '/clients', '/projects', '/invoices', '/settings']

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isProtected = protectedPrefixes.some((prefix) =>
        request.nextUrl.pathname.startsWith(prefix)
      )
      if (isProtected && !isLoggedIn) return false
      return true
    },
  },
} satisfies NextAuthConfig

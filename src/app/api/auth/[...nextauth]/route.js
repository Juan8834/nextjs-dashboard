// src/app/api/auth/[...nextauth]/route.js

export const runtime = 'nodejs'; // Force Node runtime for NextAuth

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

// Fetch user from Neon DB
async function getUser(email) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT * FROM users WHERE email=${email}`;
    return result?.[0] || null;
  } catch (err) {
    console.error('Error fetching user:', err);
    return null;
  }
}

// NextAuth handler
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Demo user check
        const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
        const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

        if (credentials.email === demoEmail) {
          if (credentials.password === demoPassword) {
            return { id: 'demo-user', email: demoEmail, name: 'Demo User', role: 'demo' };
          } else {
            return null;
          }
        }

        // Fetch real user
        const user = await getUser(credentials.email);
        if (!user) return null;

        // Compare passwords
        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: '/login', // optional custom login page
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.name = token.name;
      return session;
    },
  },
});

// App Router exports
export { handler as GET, handler as POST };

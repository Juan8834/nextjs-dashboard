import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

async function getUser(email) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`SELECT * FROM users WHERE email=${email}`;

    console.log('Query result:', result);

    if (result && result.length > 0) {
      return result[0];
    } else {
      console.error('No user found for email:', email);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Attempting to authenticate with credentials:', credentials);

        // Demo user credentials from environment variables
        const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
        const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

        // Check if the user is using the demo account
        if (credentials.email === demoEmail) {
          if (credentials.password !== demoPassword) {
            console.error('Invalid password for demo account');
            throw new Error('Invalid password');
          }
          console.log('Demo user authenticated successfully');
          return { id: 'demo-user', email: demoEmail, name: 'Demo User', role: 'demo' };
        }

        // Retrieve user from the database
        const user = await getUser(credentials.email);

        if (user) {
          console.log('Stored password (hashed):', user.password);
          console.log('Password from login attempt:', credentials.password);

          // Compare hashed password
          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          console.log('Password comparison result:', passwordsMatch);

          if (passwordsMatch) {
            console.log('User authenticated successfully:', user);
            return { id: user.id, email: user.email, name: user.name };
          } else {
            console.error('Invalid password for email:', credentials.email);
          }
        } else {
          console.error('No user found with email:', credentials.email);
        }

        return null; // Authentication failed
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page (optional)
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
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

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          console.log("Res", res)
          // Ensure response is JSON
          if (!res.ok) {
            console.error('Login API error:', res.status, await res.text());
            throw new Error('Failed to log in');
          }

          const user = await res.json();

          // Validate the returned user object
          if (user && user.token) {
            return user; // This will be added to the JWT and session
          }
          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('Authorization error:', error);
          return null; // Returning null will show an error page
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error', // Redirect to a custom error page
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
});

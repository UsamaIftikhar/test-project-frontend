import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessToken: string;
    };
  }

  interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    accessToken: string;
  }
}

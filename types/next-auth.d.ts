import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'manager' | 'member';
      companyId: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'member';
    companyId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'manager' | 'member';
    companyId: string;
  }
}

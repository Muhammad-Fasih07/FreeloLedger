// @ts-ignore
import { withAuth } from 'next-auth/middleware';

// @ts-ignore
export default withAuth({
  callbacks: {
    authorized: ({ token }: any) => !!token,
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/payments/:path*',
    '/expenses/:path*',
    '/team/:path*',
  ],
};

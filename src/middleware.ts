import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/firebase/server';

export async function middleware(request: NextRequest) {
  const idToken = request.cookies.get('idToken')?.value;

  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    if (!idToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Middleware Token Verification Error:', error);
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('idToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};

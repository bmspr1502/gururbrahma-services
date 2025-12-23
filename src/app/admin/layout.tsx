import { cookies } from 'next/headers';
import { auth } from '@/firebase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const idToken = cookies().get('idToken')?.value;
  let user = null;
  if (idToken) {
    try {
      user = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Token verification failed:', error);
      // If token is invalid, treat as logged out
      user = null;
    }
  }

  // The actual child will be determined by the page.tsx in this segment.
  // This layout simply provides the user context.
  return <>{children}</>;
}

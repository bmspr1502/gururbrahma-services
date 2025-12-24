import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from './login-form';
import { auth, db } from '@/firebase/server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  let user = null;

  if (session) {
    try {
      user = await auth.verifySessionCookie(session, true);
    } catch (error) {
      // Invalid session cookie, treat as logged out
      user = null;
    }
  }

  if (user) {
    // Also verify role here to prevent redirect loop if dashboard rejects it
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      const isSuperAdmin = user.email === 'drbmsathyaramacharya@gmail.com';
      const isAdmin = userDoc.exists && userDoc.data()?.role === 'admin';

      if (isSuperAdmin || isAdmin) {
        redirect('/admin/dashboard');
      } else {
        // Valid session but not admin - logout
        redirect('/api/auth/logout');
      }
    } catch (error) {
      // DB error - safer to logout than loop
      console.error("Error verifying role in login page:", error);
      redirect('/api/auth/logout');
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  );
}

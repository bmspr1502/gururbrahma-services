import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from './login-form';
import { auth } from '@/firebase/server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const idToken = cookieStore.get('idToken')?.value;
  let user = null;

  if (session) {
    try {
      user = await auth.verifySessionCookie(session, true);
    } catch (error) {
      console.error("Session verification failed:", error);
      user = null;
    }
  } else if (idToken) {
    try {
      user = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error("ID Token verification failed:", error);
      user = null;
    }
  }

  if (user) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  );
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from './login-form';
import { auth } from '@/firebase/server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = cookies();
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

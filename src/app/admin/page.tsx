import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from './login-form';
import { auth } from '@/firebase/server';

export default async function AdminPage() {
  const idToken = cookies().get('idToken')?.value;
  let user = null;

  if (idToken) {
    try {
      user = await auth.verifyIdToken(idToken);
    } catch (error) {
      // Invalid token, treat as logged out
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

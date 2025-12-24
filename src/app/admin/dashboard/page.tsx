import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, db } from '@/firebase/server';
import { Button } from '@/components/ui/button';
import { logout } from '../actions';
import { DashboardTabs } from './tabs';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return redirect('/admin');
  }

  let decodedToken;
  try {
    decodedToken = await auth.verifySessionCookie(session, true);
  } catch (error) {
    console.error("Session verification failed, redirecting to login:", error);
    return redirect('/admin');
  }

  if (!decodedToken) {
    return redirect('/admin');
  }

  // Stricter role check for production
  try {
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      console.warn(`User ${decodedToken.email} attempted admin access without required role or user document.`);
      // Invalidate the session and redirect
      cookies().delete("session");
      return redirect('/admin');
    }
  } catch (error) {
    console.error('Error verifying admin role from Firestore:', error);
    // On any Firestore error, deny access as a security precaution.
    return redirect('/admin');
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">Logged in as {decodedToken.email}</p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors">
            Logout
          </Button>
        </form>
      </div>

      <DashboardTabs />
    </div>
  );
}

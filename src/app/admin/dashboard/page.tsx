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

  // Role check
  try {
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    
    // For now, if the user doesn't exist in the users collection, we'll allow it 
    // but log a warning, OR we can be strict. Let's be semi-strict: 
    // If the doc exists, it MUST have role === 'admin'.
    if (userDoc.exists && userData?.role !== 'admin') {
      console.warn(`User ${decodedToken.email} attempted admin access without admin role.`);
      return redirect('/admin');
    }
    
  } catch (error) {
    console.error('Error verifying admin role:', error);
    // On Firestore error, redirect to login to prevent unauthorized access.
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

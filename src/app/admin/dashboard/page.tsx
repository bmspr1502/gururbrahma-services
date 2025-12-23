import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth, db } from '@/firebase/server';
import { Button } from '@/components/ui/button';
import { logout } from '../actions';
import { DashboardTabs } from './tabs';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const idToken = cookieStore.get('idToken')?.value;

  if (!session && !idToken) {
    redirect('/admin');
  }

  let decodedToken;
  try {
    if (session) {
      decodedToken = await auth.verifySessionCookie(session, true);
    } else if (idToken) {
      decodedToken = await auth.verifyIdToken(idToken);
    }
  } catch (error) {
    redirect('/admin');
  }

  if (!decodedToken) {
    redirect('/admin');
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
      redirect('/admin');
    }
    
    // If we want to be fully strict and only allow pre-approved admins:
    // if (!userDoc.exists || userData?.role !== 'admin') { redirect('/admin'); }
  } catch (error) {
    console.error('Error verifying admin role:', error);
    // Allow access if Firestore fails but token is valid, to prevent lockout 
    // unless you want maximum security.
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

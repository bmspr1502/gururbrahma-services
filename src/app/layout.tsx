import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { BackgroundPattern } from '@/components/background-pattern';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Analytics } from '@/components/analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://gururbrahma.in'),
  title: 'Gururbrahma Services | Guiding Your Spiritual Journey',
  description: 'Guiding your spiritual journey through Vedic traditions. Professional priest and astrologer services.',
  openGraph: {
    title: 'Gururbrahma Services',
    description: 'Guiding your spiritual journey through Vedic traditions.',
    type: 'website',
    url: 'https://gururbrahma.in',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'Gururbrahma Services Logo',
      },
    ],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

import { cookies } from 'next/headers';
import { auth } from '@/firebase/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side check for admin status
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  let isAdmin = false;

  if (session) {
    try {
      // Optimistic check: if session exists, assume admin for UI speed, 
      // or verify properly. Verification is safer.
      const decodedClaims = await auth.verifySessionCookie(session, true);
      if (decodedClaims) {
        isAdmin = true;
      }
    } catch (error) {
       // invalid session
       isAdmin = false;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <FirebaseClientProvider>
          <BackgroundPattern />
          <Header isAdmin={isAdmin} />
          <div className="flex-grow pt-16">
            {children}
          </div>
          <Footer isAdmin={isAdmin} />
          <Toaster />
          <Analytics />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

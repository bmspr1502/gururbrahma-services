import type { Metadata, Viewport } from 'next';
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
  manifest: '/icons/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gururbrahma',
  },
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
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/icons/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/icons/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/icons/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/icons/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/icons/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/apple-icon.png',
      },
    ],
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/icons/ms-icon-144x144.png',
  }
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

import { cookies } from 'next/headers';
import { auth } from '@/firebase/server';

import { LanguageProvider } from '@/context/language-context';

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
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2795531880467169"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <LanguageProvider>
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
        </LanguageProvider>
      </body>
    </html>
  );
}

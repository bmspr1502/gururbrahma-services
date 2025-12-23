import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { BackgroundPattern } from '@/components/background-pattern';

export const metadata: Metadata = {
  title: 'Gururbrahma Services | Guiding Your Spiritual Journey',
  description: 'Guiding your spiritual journey through Vedic traditions. Professional priest and astrologer services.',
  openGraph: {
    title: 'Gururbrahma Services',
    description: 'Guiding your spiritual journey through Vedic traditions.',
    type: 'website',
    url: 'https://gururbrahma-services.com', // Replace with actual URL
    images: [
      {
        url: 'https://gururbrahma-services.com/og-image.jpg', // Replace with actual image URL
        width: 1200,
        height: 630,
        alt: 'Gururbrahma Services',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <BackgroundPattern />
        <Header />
        <div className="flex-grow pt-16">
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

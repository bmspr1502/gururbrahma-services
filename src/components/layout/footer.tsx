import Link from 'next/link';
import { Youtube, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/logo';

const OmSymbol = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-8 w-8 text-primary-foreground/20"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15.5c-1.63 0-3.08-.8-4-2.02l1.41-1.41c.64.84 1.59 1.43 2.59 1.43s2-.59 2-1.5c0-1.2-1.37-1.45-2.73-1.84-2.13-.62-3.27-1.63-3.27-3.57C6 6.13 7.82 4.5 10.5 4.5c1.63 0 3.08.8 4 2.02l-1.41 1.41c-.64-.84-1.59-1.43-2.59-1.43s-2 .59-2 1.5c0 1.2 1.37 1.45 2.73 1.84 2.13.62 3.27 1.63 3.27 3.57C14 16.87 12.18 18.5 9.5 18.5z" />
  </svg>
);


export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:items-start">
          {/* Logo and Branding Section - Major Space */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <Logo className="h-48 w-48 md:h-64 md:w-64 border-4 border-white/10 shadow-2xl relative transition-transform hover:scale-105 duration-500" size={512} />
            </div>
            <div className="text-center lg:text-left space-y-4">
              <h3 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
                Gururbrahma Services
              </h3>
              <p className="text-lg md:text-xl text-primary-foreground/70 max-w-md leading-relaxed">
                Guiding your spiritual journey through Vedantic traditions and Vedic rituals with wisdom and devotion.
              </p>
            </div>
          </div>

          {/* Details Section - Right Side */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-12 w-full lg:pt-12">
            <div>
              <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-accent"></span>
                Quick Links
              </h3>
              <ul className="grid grid-cols-1 gap-4 text-primary-foreground/80">
                <li><Link href="/services" className="hover:text-accent hover:translate-x-1 transition-all flex items-center gap-2">Services</Link></li>
                <li><Link href="/posts" className="hover:text-accent hover:translate-x-1 transition-all flex items-center gap-2">Posts</Link></li>
                <li><Link href="/video" className="hover:text-accent hover:translate-x-1 transition-all flex items-center gap-2">Videos</Link></li>
                <li><Link href="/contact" className="hover:text-accent hover:translate-x-1 transition-all flex items-center gap-2">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-accent"></span>
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-4">
                <Link href="https://www.youtube.com/@gururbrahma" target="_blank" className="p-3 rounded-xl bg-white/5 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <Youtube className="w-6 h-6" />
                </Link>
                <Link href="https://www.facebook.com/sathyaram.boosimadhavan/" target="_blank" className="p-3 rounded-xl bg-white/5 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <Facebook className="w-6 h-6" />
                </Link>
                <Link href="https://www.instagram.com/sathyaramacharya_bm/" target="_blank" className="p-3 rounded-xl bg-white/5 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <Instagram className="w-6 h-6" />
                </Link>
                <Link href="https://wa.me/919443514199" target="_blank" className="p-3 rounded-xl bg-white/5 hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <MessageCircle className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Symbol */}
        <div className="absolute -bottom-12 -right-12 opacity-[0.03] scale-[3] pointer-events-none hidden lg:block">
          <OmSymbol />
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-4 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Gururbrahma Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

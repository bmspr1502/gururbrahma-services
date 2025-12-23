import Link from 'next/link';
import { Youtube, Facebook, Instagram } from 'lucide-react';

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
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-headline text-lg font-bold mb-4">Gururbrahma Services</h3>
            <p className="text-sm text-primary-foreground/80">
              Guiding your spiritual journey through Vedic traditions.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-accent">Services</Link></li>
              <li><Link href="/posts" className="hover:text-accent">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>
          <div className="relative">
            <h3 className="font-headline text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="hover:text-accent"><Youtube /></Link>
              <Link href="#" className="hover:text-accent"><Facebook /></Link>
              <Link href="#" className="hover:text-accent"><Instagram /></Link>
            </div>
            <div className="absolute bottom-0 right-0 opacity-50 hidden md:block">
              <OmSymbol />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-4 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Gururbrahma Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

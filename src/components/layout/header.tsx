"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';

import { useLanguage } from '@/context/language-context';

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('services'), href: '/services' },
    { name: t('posts'), href: '/posts' },
    { name: t('videos'), href: '/video' },
    { name: t('contact'), href: '/contact' },
  ];

  const LanguageToggle = () => (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 font-bold text-accent px-2"
      onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
    >
      <span className={language === 'en' ? 'underline' : ''}>E</span>
      <span>/</span>
      <span className={language === 'ta' ? 'underline' : ''}>அ</span>
    </Button>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 text-white backdrop-blur-lg shadow-md transition-all duration-300 ${isAdmin ? 'bg-black/90' : 'bg-primary/95'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-accent" />
          <span className="text-lg sm:text-xl font-bold font-headline">{t('brand_name')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-accent">
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin/dashboard" className="text-sm font-medium transition-colors hover:text-accent text-accent">
              Admin
            </Link>
          )}
          <LanguageToggle />
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/services">{t('book_now')}</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`w-[300px] text-white border-white/10 ${isAdmin ? 'bg-black' : 'bg-primary'}`}>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <Logo className="h-6 w-6 text-accent" />
                    <span className="text-lg font-bold font-headline">{t('brand_name').split(' ')[0]}</span>
                  </Link>
                </div>
                <nav className="mt-8 flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="text-lg font-medium transition-colors text-accent hover:text-accent/80"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Portal
                    </Link>
                  )}
                </nav>
                <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/services" onClick={() => setIsMenuOpen(false)}>{t('book_now')}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

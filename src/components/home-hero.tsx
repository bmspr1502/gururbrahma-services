"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

interface HomeHeroProps {
  imageUrl: string;
  imageAlt: string;
  imageHint: string;
}

export function HomeHero({ imageUrl, imageAlt, imageHint }: HomeHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
      <Image
        src={imageUrl}
        alt={imageAlt}
        data-ai-hint={imageHint}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg">
          {t('hero_title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-neutral-200 drop-shadow-md">
          {t('hero_subtitle')}
        </p>
        <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/services">{t('book_now')}</Link>
        </Button>
      </div>
    </section>
  );
}

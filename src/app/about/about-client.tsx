"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpenCheck, Gem } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function AboutClient() {
  const { t } = useLanguage();
  const priestImage = PlaceHolderImages.find((p) => p.id === 'priest-bio');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t('about')}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('about_p2')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-1">
          {priestImage && (
            <Card className="overflow-hidden shadow-2xl border-primary/20">
              <div className="aspect-[4/5] relative">
                <Image
                  src={priestImage.imageUrl}
                  alt={priestImage.description}
                  data-ai-hint={priestImage.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4 bg-card text-center">
                <CardTitle className="text-xl">{t('founder_name')}</CardTitle>
                <p className="text-muted-foreground">{t('founder_title')}</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-4">{t('about_legacy_title')}</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 space-y-4">
            <p>
              {t('about_p1')}
            </p>
            <p>
              {t('about_p2')}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
             <div className="flex flex-col items-center p-4 rounded-lg">
               <BookOpenCheck className="w-10 h-10 text-secondary mb-2" />
               <h3 className="font-bold text-lg">{t('purohitam')}</h3>
               <p className="text-sm text-muted-foreground">{t('sudarshana_homam_desc')}</p>
             </div>
             <div className="flex flex-col items-center p-4 rounded-lg">
               <Gem className="w-10 h-10 text-secondary mb-2" />
               <h3 className="font-bold text-lg">{t('jyotisham')}</h3>
               <p className="text-sm text-muted-foreground">{t('jadhaga_parivarthanai_desc')}</p>
             </div>
             <div className="flex flex-col items-center p-4 rounded-lg">
               <Users className="w-10 h-10 text-secondary mb-2" />
               <h3 className="font-bold text-lg">{t('academy_name')}</h3>
               <p className="text-sm text-muted-foreground">{t('sanskrit_classes_desc')}</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

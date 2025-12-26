"use client";

import { services } from '@/lib/data';
import type { ServiceCategory } from '@/lib/types';
import { ServiceCard } from '@/components/service-card';
import { useLanguage } from '@/context/language-context';

export function ServicesClient() {
  const { t } = useLanguage();
  const categories: ServiceCategory[] = ['Purohitam', 'Jyotisham', 'Teaching'];

  const getCategoryTitle = (category: ServiceCategory) => {
    switch (category) {
      case 'Purohitam':
        return t('purohitam');
      case 'Jyotisham':
        return t('jyotisham_banner');
      case 'Teaching':
        return t('academy_name');
      default:
        return category;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t('services')}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-primary pb-2 text-primary">
              {getCategoryTitle(category)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

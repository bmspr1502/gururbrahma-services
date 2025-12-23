import { services } from '@/lib/data';
import type { ServiceCategory } from '@/lib/types';
import { ServiceCard } from '@/components/service-card';

export default function ServicesPage() {
  const categories: ServiceCategory[] = ['Purohitam', 'Jyotisham', 'Matrimony'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Services</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          We offer a range of spiritual services rooted in Vedic wisdom to guide you on your path.
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-primary pb-2">{category}</h2>
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

"use client";

import { services } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { RequestServiceForm } from "./request-service-form";
import { useLanguage } from "@/context/language-context";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useLanguage();
  
  const service = services.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  const serviceImage = PlaceHolderImages.find((p) => p.id === service.image);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <Badge variant="secondary">{t(service.category === 'Teaching' ? 'academy_name' : (service.category.toLowerCase() as any))}</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2">{t(service.name as any)}</h1>
              <p className="mt-4 text-xl text-muted-foreground">{t(service.description as any)}</p>
            </div>

            {serviceImage && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden my-8 shadow-lg">
                <Image
                  src={serviceImage.imageUrl}
                  alt={t(service.name as any)}
                  data-ai-hint={serviceImage.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
                <div dangerouslySetInnerHTML={{ __html: t(service.detailedHtml as any) }} />
            </div>

            <div className="mt-12 p-6 rounded-xl bg-accent/5 border border-accent/20">
              <h3 className="text-2xl font-bold mb-3 font-headline text-primary">{t('cost_dakshina')}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('cost_info_message')}
              </p>
            </div>
          </div>

          {/* Request Form Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <RequestServiceForm 
                serviceId={service.id} 
                serviceName={t(service.name as any)} 
                category={service.category}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

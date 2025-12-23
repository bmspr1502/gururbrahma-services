import { services } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { RequestServiceForm } from "./request-service-form";

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  return services.map((service) => ({
    id: service.id,
  }));
}

export default function ServiceDetailPage({ params }: Props) {
  const service = services.find((s) => s.id === params.id);

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
              <Badge variant="secondary">{service.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2">{service.name}</h1>
              <p className="mt-4 text-xl text-muted-foreground">{service.description}</p>
            </div>

            {serviceImage && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden my-8 shadow-lg">
                <Image
                  src={serviceImage.imageUrl}
                  alt={service.name}
                  data-ai-hint={serviceImage.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
                <div dangerouslySetInnerHTML={{ __html: service.detailedHtml }} />
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-2">Cost / Dakshina</h3>
              <p className="text-lg text-muted-foreground">{service.price}</p>
            </div>
          </div>

          {/* Request Form Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <RequestServiceForm serviceId={service.id} serviceName={service.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

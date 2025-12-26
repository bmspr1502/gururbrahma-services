import { services } from "@/lib/data";
import { translations } from "@/lib/translations";
import { notFound } from "next/navigation";
import { ServiceDetailClient } from "./service-detail-client";
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = services.find((s) => s.id === id);
  
  if (!service) return { title: 'Service Not Found' };

  // Use English translation for metadata
  const name = translations.en[service.name as keyof typeof translations.en] || service.name;
  const desc = translations.en[service.description as keyof typeof translations.en] || service.description;

  return {
    title: name,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
    }
  };
}

export default async function ServiceDetailPage(props: Props) {
  const params = await props.params;
  const { id } = params;
  
  const service = services.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient id={id} />;
}

"use client";

import { Mail, Phone, MapPin, Youtube, Facebook, Instagram, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';

export default function ContactPage() {
  const { t } = useLanguage();
  
  // Replace these with actual details
  const contactDetails = {
    name: t('founder_name'),
    phone: "+91 94435 14199",
    whatsapp: "https://wa.me/919443514199",
    email: "virudhhiedu.consultant@gmail.com",
    facebook: "https://www.facebook.com/sathyaram.boosimadhavan/",
    youtube: "https://www.youtube.com/@gururbrahma",
    instagram: "https://www.instagram.com/sathyaramacharya_bm/",
    address: "'SHRI RAM BHAVANAM', 53/74, Bungalow Street, Salem - 636 001 (TN, India)",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!4v1766556041993!6m8!1m7!1slLKcNW0tETHCFN_IdlQ_Qg!2m2!1d11.65960870541327!2d78.16945247571024!3f52.5357645612802!4f-1.3999530754026637!5f0.7820865974627469"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t('contact')}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info Card */}
        <Card className="shadow-2xl overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="md:flex">
            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden bg-muted">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-accent/10">
                 <Image 
                   src="https://firebasestorage.googleapis.com/v0/b/studio-5159116962-cf239.firebasestorage.app/o/posts%2FnNwjQxQJLI5TkM16ZyjN%2Fimages%2F1766646262302_WhatsApp%20Image%202025-04-14%20at%2019.30.01.jpeg?alt=media&token=719e07e5-1693-4dc9-ab39-30e369aa1b94"
                   alt={contactDetails.name}
                   fill
                   className="object-cover"
                 />
              </div>
            </div>
            <div className="p-8 md:w-2/3">
              <h2 className="text-2xl font-bold mb-6">{contactDetails.name}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/20 text-accent">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{contactDetails.phone}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-2">
                    <a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-accent/20 text-accent">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium underline underline-offset-4">{contactDetails.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-accent/20 text-accent">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{contactDetails.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-accent hover:text-accent-foreground">
                  <a href={contactDetails.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-accent hover:text-accent-foreground">
                  <a href={contactDetails.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-accent hover:text-accent-foreground">
                  <a href={contactDetails.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-accent hover:text-accent-foreground">
                  <a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Map Section */}
        <div className="h-[400px] lg:h-full min-h-[400px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
          <iframe
            src={contactDetails.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="filter contrast-125"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

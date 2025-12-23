import { Mail, Phone, MapPin, Youtube, Facebook, Map as MapIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  // Replace these with actual details
  const contactDetails = {
    name: "Sri [Dad's Name]",
    phone: "+91 XXXXXXXXXX",
    email: "contact@gururbrahma.com",
    facebook: "https://facebook.com/gururbrahmaservices",
    youtube: "https://youtube.com/@gururbrahmaservices",
    address: "123, Spiritual Street, Temple Town, City Name, State - PIN",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3123456789!2d77.1234567!3d12.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA3JzM0LjQiTiA3N8KwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Reach out to us for spiritual guidance, Purohitam services, and Jyotisham consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info Card */}
        <Card className="shadow-2xl overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="md:flex">
            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden bg-muted">
              {/* Replace with actual picture */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-accent/10">
                 <Image 
                   src="/logo.png" // Placeholder or actual image
                   alt={contactDetails.name}
                   fill
                   className="object-cover"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-center p-4">
                    [Dad's Picture Here]
                 </div>
              </div>
            </div>
            <div className="p-8 md:w-2/3">
              <h2 className="text-2xl font-bold mb-6">{contactDetails.name}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-accent/20 text-accent">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{contactDetails.phone}</p>
                  </div>
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
            className="filter grayscale contrast-125"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

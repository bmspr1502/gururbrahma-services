import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpenCheck, Gem } from 'lucide-react';

export default function AboutPage() {
  const priestImage = PlaceHolderImages.find((p) => p.id === 'priest-bio');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Gururbrahma Services</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Rooted in ancient Vedic traditions, we are dedicated to providing authentic spiritual guidance and services to help you navigate life's journey with peace and clarity.
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
                <CardTitle className="text-xl">Sri Venkatesha Sastry</CardTitle>
                <p className="text-muted-foreground">Founder & Principal Priest</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-4">A Legacy of Spiritual Service</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 space-y-4">
            <p>
              Gururbrahma Services was founded by Sri Venkatesha Sastry, a distinguished scholar and priest with over 30 years of experience in Vedic rituals and astrology. Hailing from a long lineage of priests, his mission is to make these ancient practices accessible and relevant to the modern world.
            </p>
            <p>
              Our services are built on a foundation of deep knowledge, unwavering faith, and a genuine desire to help individuals and families. We believe in a personalized approach, understanding that each person's spiritual path is unique.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
             <div className="flex flex-col items-center p-4 rounded-lg">
               <BookOpenCheck className="w-10 h-10 text-secondary mb-2" />
               <h3 className="font-bold text-lg">Authentic Purohitam</h3>
               <p className="text-sm text-muted-foreground">Performing sacred rituals with precision and devotion.</p>
             </div>
             <div className="flex flex-col items-center p-4 rounded-lg">
               <Gem className="w-10 h-10 text-secondary mb-2" />
               <h3 className="font-bold text-lg">Expert Jyotisham</h3>
               <p className="text-sm text-muted-foreground">Providing insightful astrological guidance for life's challenges.</p>
             </div>
             <div className="flex flex-col items-center p-4 rounded-lg">
               <Users className="w-10 h-10 text-secondary mb-2" />
               <h3 className="font-bold text-lg">Community Focus</h3>
               <p className="text-sm text-muted-foreground">Helping families connect through our matrimony services.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { AlertCircle, Youtube, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { VideoCard } from "@/components/video-card";
import { latestPosts, latestVideos } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-priest")!;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg">
            Guiding your spiritual journey through Vedic traditions.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-200 drop-shadow-md">
            Expert Purohitam and Jyotisham services to bring peace and prosperity into your life.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/services">Book a Service</Link>
          </Button>
        </div>
      </section>

      {/* Notification Ticker */}
      <div className="container mx-auto py-4 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upcoming Event!</AlertTitle>
          <AlertDescription>
            Special pujas available for the upcoming Lunar Eclipse. Timings will be updated soon.
          </AlertDescription>
        </Alert>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Latest Updates Section */}
        <section id="latest-updates">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Latest Videos */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Youtube className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Latest Videos</h2>
              </div>
              <div className="space-y-6">
                {latestVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>

            {/* Recent Articles */}
            <div>
               <div className="flex items-center gap-3 mb-6">
                <Newspaper className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Recent Articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

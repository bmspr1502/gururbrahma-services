import type { Metadata } from 'next';
import { db } from '@/firebase/server';
import { Video } from '@/lib/types';
import { Youtube } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/utils';
import { VideosFeed } from '@/components/videos-feed';

export const metadata: Metadata = {
  title: 'Sacred Videos',
  description: 'Watch our latest videos on spiritual events, Vedic rituals, and insights into the divine path. Live sessions and recorded discourses.',
};

export default async function VideosPage() {
  let initialVideos: Video[] = [];
  let initialCursor: string | null = null;
  let allTags: string[] = [];
  
  try {
    const snapshot = await db.collection('videos')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

    initialVideos = snapshot.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data } as Video;
    });

    if (initialVideos.length > 0) {
        const lastVideo = initialVideos[initialVideos.length - 1];
        initialCursor = typeof lastVideo.timestamp === 'string' 
            ? lastVideo.timestamp 
            : lastVideo.timestamp.toISOString();
    }

    allTags = Array.from(new Set(initialVideos.flatMap(v => v.tags || []))).sort();

  } catch (error) {
    console.error("Error fetching videos:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4 text-primary">
          <Youtube className="w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Videos</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch our latest videos on spiritual events, Vedic rituals, and insights into the divine path.
        </p>
      </div>

      <VideosFeed 
        initialVideos={initialVideos} 
        initialCursor={initialCursor} 
        allTags={allTags}
      />
    </div>
  );
}

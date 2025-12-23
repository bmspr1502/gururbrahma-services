import { db } from '@/firebase/server';
import { VideoCard } from '@/components/video-card';
import { Video } from '@/lib/types';
import { Youtube } from 'lucide-react';
import { serializeFirestoreData } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function VideosPage() {
  let videos: Video[] = [];
  
  try {
    const snapshot = await db.collection('videos').orderBy('createdAt', 'desc').get();
    videos = snapshot.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data, timestamp: data.createdAt || data.timestamp || new Date() } as Video;
    });
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

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-muted">
          <p className="text-muted-foreground text-xl">No videos found yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

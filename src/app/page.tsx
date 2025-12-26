import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PostCard } from "@/components/post-card";
import { VideoCard } from "@/components/video-card";
import { db } from "@/firebase/server";
import { Post, Video } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { serializeFirestoreData } from "@/lib/utils";
import { HomeHero } from "@/components/home-hero";
import { LatestUpdatesHeader } from "@/components/home-updates-header";
import { LocalizedText } from "@/components/localized-text";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-priest")!;

  // Fetch data from Firestore
  let notification: any = null;
  let posts: Post[] = [];
  let videos: Video[] = [];

  try {
    const [notifyDoc, postsSnap, videosSnap] = await Promise.all([
      db.collection("site-content").doc("home-notification").get(),
      db.collection("posts").orderBy("timestamp", "desc").limit(2).get(),
      db.collection("videos").orderBy("timestamp", "desc").limit(2).get(),
    ]);

    if (notifyDoc.exists && notifyDoc.data()?.active) {
      notification = serializeFirestoreData(notifyDoc.data());
    }

    posts = postsSnap.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data } as Post;
    });
    videos = videosSnap.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data } as Video;
    });

  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HomeHero 
        imageUrl={heroImage.imageUrl} 
        imageAlt={heroImage.description} 
        imageHint={heroImage.imageHint} 
      />

      {/* Notification Ticker */}
      {notification && (
        <div className="container mx-auto py-4 px-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Latest Updates Section */}
        <section id="latest-updates">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Latest Videos */}
            <div>
              <LatestUpdatesHeader type="videos" />
              <div className="space-y-6">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    <LocalizedText translationKey="stay_tuned_videos" fallback="Stay tuned for new videos." />
                  </p>
                )}
              </div>
            </div>

            {/* Recent Articles */}
            <div>
              <LatestUpdatesHeader type="posts" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    <LocalizedText translationKey="coming_soon_articles" fallback="New articles coming soon." />
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

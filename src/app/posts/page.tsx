
import { db } from '@/firebase/server';
import { Post } from '@/lib/types';
import { serializeFirestoreData } from '@/lib/utils';
import { PostsFeed } from '@/components/posts-feed';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  let initialPosts: Post[] = [];
  let initialCursor: string | null = null;
  let allTags: string[] = [];

  try {
    // 1. Fetch first batch of posts (Limit 10)
    const snapshot = await db.collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

    initialPosts = snapshot.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data } as Post;
    });

    if (initialPosts.length > 0) {
        initialCursor = initialPosts[initialPosts.length - 1].timestamp.toISOString();
    }

    // 2. Ideally fetch unique tags. Since firestore doesn't support aggregate distinct easily,
    // we can either:
    // a) Just use tags from the first 50 posts (cheap)
    // b) Have a separate scheduled function to aggregate tags (best practice)
    // c) For now, load slightly more posts just to seed tags? Or just rely on loaded posts.
    // Let's rely on loaded posts + previous batch for simplicity and performance.
    // If the user wants specific tags to be ALWAYS visible, they should be hardcoded or stored separately.
    // I'll grab tags from the first 50 items (metadata only query if possible, but firestore reads full doc).
    // Let's just stick to tags found in `initialPosts` passed to the component for now. 
    // The component will accumulate tags as user loads more, or we can fetch a separate "tags list" if we had one.
    // I will extract tags from `initialPosts`.
    allTags = Array.from(new Set(initialPosts.flatMap(p => p.tags || []))).sort();

  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Posts</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore articles on Vedic astrology, spiritual practices, and festival significations to enlighten your path.
        </p>
      </div>

      <PostsFeed 
        initialPosts={initialPosts} 
        initialCursor={initialCursor} 
        allTags={allTags}
      />
    </div>
  );
}

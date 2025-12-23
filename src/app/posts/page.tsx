import { PostCard } from '@/components/post-card';
import { db } from '@/firebase/server';
import { Post } from '@/lib/types';
import { serializeFirestoreData } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  let posts: Post[] = [];

  try {
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    posts = snapshot.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data, timestamp: data.createdAt || data.timestamp || new Date() } as Post;
    });
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}


import { db } from '@/firebase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Post } from '@/lib/types';
import { serializeFirestoreData } from '@/lib/utils';

type Props = {
  params: { id: string };
};

export default async function PostDetailPage({ params }: Props) {
  let post: Post | null = null;

  try {
    const doc = await db.collection('posts').doc(params.id).get();
    if (doc.exists) {
      const data = serializeFirestoreData(doc.data());
      post = { id: doc.id, ...data } as Post;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
  }

  if (!post) {
    notFound();
  }

  // Handle both placeholder IDs and direct URLs for imageUrl
  let imageUrl = post.imageUrl;
  let imageHint = 'blog post';
  const isPlaceholderId = !post.imageUrl.startsWith('http');
  if (isPlaceholderId) {
    const placeholder = PlaceHolderImages.find((p) => p.id === post.imageUrl);
    if (placeholder) {
      imageUrl = placeholder.imageUrl;
      imageHint = placeholder.imageHint;
    }
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article>
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2">{post.title}</h1>
            <div className="mt-4 flex justify-center items-center gap-6 text-muted-foreground text-sm">
                <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4'/>
                    <time dateTime={new Date(post.timestamp).toISOString()}>
                        {format(new Date(post.timestamp), 'LLLL d, yyyy')}
                    </time>
                </div>
                 <div className='flex items-center gap-2'>
                    <Tag className='w-4 h-4'/>
                    <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          
          <div className="relative aspect-video w-full rounded-lg overflow-hidden my-8 shadow-lg">
            <Image
              src={imageUrl}
              alt={post.title}
              data-ai-hint={imageHint}
              fill
              className="object-cover"
            />
          </div>
          
          <div 
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}

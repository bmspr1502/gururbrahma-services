
import { db } from '@/firebase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Post } from '@/lib/types';
import { serializeFirestoreData } from '@/lib/utils';
import { Carousel } from '@/components/carousel';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const doc = await db.collection('posts').doc(id).get();
    if (doc.exists) {
      const post = doc.data() as Post;
      return {
        title: post.title,
        description: post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
        openGraph: {
          title: post.title,
          description: post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
          images: post.imageUrl ? [post.imageUrl] : [],
        }
      };
    }
  } catch (e) {
    console.error("Metadata error:", e);
  }
  return { title: 'Post Detail' };
}

interface ExtendedPost extends Post {
  images?: string[];
  documents?: { name: string; url: string }[];
}

export default async function PostDetailPage(props: Props) {
  const params = await props.params;
  let post: ExtendedPost | null = null;

  try {
    const doc = await db.collection('posts').doc(params.id).get();
    if (doc.exists) {
      const data = serializeFirestoreData(doc.data());
      post = { id: doc.id, ...data } as ExtendedPost;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
  }

  if (!post) {
    notFound();
  }

  const hasImages = post.images && post.images.length > 0;

  // Handle fallback image if no gallery is present
  let fallbackImageUrl: string | null = null;
  let fallbackImageHint = 'blog post';
  
  if (!hasImages && post.imageUrl) {
      const isPlaceholderId = !post.imageUrl.startsWith('http');
      if (isPlaceholderId) {
        const placeholder = PlaceHolderImages.find((p) => p.id === post.imageUrl);
        if (placeholder) {
          fallbackImageUrl = placeholder.imageUrl;
          fallbackImageHint = placeholder.imageHint;
        }
      } else {
          fallbackImageUrl = post.imageUrl;
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

          {/* Image Display Logic: Carousel > Fallback Image */}
          {hasImages ? (
            <div className="my-8 shadow-lg rounded-lg overflow-hidden">
                <Carousel 
                    className="w-full"
                    slides={post.images!.map((img, idx) => (
                        <div key={idx} className="relative aspect-video w-full">
                            <Image 
                                src={img} 
                                alt={`Image ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                />
            </div>
          ) : fallbackImageUrl ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden my-8 shadow-lg">
                <Image
                src={fallbackImageUrl}
                alt={post.title}
                data-ai-hint={fallbackImageHint}
                fill
                className="object-cover"
                />
            </div>
          ) : null}
          
          <div 
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Documents */}
          {post.documents && post.documents.length > 0 && (
            <div className="my-12 p-6 bg-muted/30 rounded-lg border">
                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Attached Documents
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {post.documents.map((doc, idx) => (
                        <a 
                            key={idx} 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-background border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
                        >
                            <span className="truncate flex-1 font-medium text-sm">{doc.name}</span>
                            <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </a>
                    ))}
                 </div>
            </div>
          )}

        </article>
      </div>
    </div>
  );
}

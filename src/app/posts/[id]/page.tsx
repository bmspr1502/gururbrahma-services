import { allPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post.id,
  }));
}

export default function PostDetailPage({ params }: Props) {
  const post = allPosts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  const postImage = PlaceHolderImages.find((p) => p.id === post.id);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article>
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2">{post.title}</h1>
            <div className="mt-4 flex justify-center items-center gap-6 text-muted-foreground text-sm">
                <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4'/>
                    <time dateTime={post.timestamp.toISOString()}>
                        {format(post.timestamp, 'LLLL d, yyyy')}
                    </time>
                </div>
                 <div className='flex items-center gap-2'>
                    <Tag className='w-4 h-4'/>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {postImage && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden my-8 shadow-lg">
              <Image
                src={postImage.imageUrl}
                alt={post.title}
                data-ai-hint={postImage.imageHint}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}

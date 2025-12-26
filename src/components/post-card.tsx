
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

import { useLanguage } from "@/context/language-context";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useLanguage();
  // Determine the display image
  let displayImageUrl = post.imageUrl;
  let displayImageHint = 'blog post';
  
  // 1. Prefer the first image from the gallery if available
  if (post.images && post.images.length > 0) {
    displayImageUrl = post.images[0];
  } 
  
  // 2. Check if the current URL is a placeholder ID
  if (displayImageUrl && !displayImageUrl.startsWith('http')) {
      const placeholder = PlaceHolderImages.find(p => p.id === displayImageUrl);
      if (placeholder) {
          displayImageUrl = placeholder.imageUrl;
          displayImageHint = placeholder.imageHint;
      }
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="h-full">
      <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
        <CardHeader className="p-0">
          {displayImageUrl && (
            <div className="aspect-video relative">
              <Image
                src={displayImageUrl}
                alt={post.title}
                data-ai-hint={displayImageHint}
                fill
                className="object-cover"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight mb-2">{post.title}</CardTitle>
          <div className="text-sm text-muted-foreground line-clamp-2 mb-3" dangerouslySetInnerHTML={{ __html: post.content }}></div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild variant="link" className="p-0 text-primary hover:text-secondary">
            <Link href={`/posts/${post.id}`}>
              {t('learn_more' as any) || 'Read More'}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

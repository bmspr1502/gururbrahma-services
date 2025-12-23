"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const postImage = PlaceHolderImages.find(p => p.id === post.imageUrl);

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="h-full">
      <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
        <CardHeader className="p-0">
          {postImage && (
            <div className="aspect-video relative">
              <Image
                src={postImage.imageUrl}
                alt={post.title}
                data-ai-hint={postImage.imageHint}
                fill
                className="object-cover"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight mb-2">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild variant="link" className="p-0 text-primary hover:text-secondary">
            <Link href={`/posts/${post.id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

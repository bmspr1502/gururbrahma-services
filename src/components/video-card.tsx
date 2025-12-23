"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import type { Video } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface VideoCardProps {
  video: Video;
}

const getYoutubeThumbnail = (url: string): string => {
  const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return `https://picsum.photos/seed/youtube/480/360`;
};

export function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = getYoutubeThumbnail(video.youtubeUrl);

  return (
    <motion.div whileHover={{ y: -5 }}>
      <Link href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex items-center gap-4">
          <CardHeader className="p-0 relative w-1/3 flex-shrink-0">
            <div className="aspect-video">
              <Image
                src={thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <PlayCircle className="w-8 h-8 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4 pr-4">
            <h3 className="font-semibold leading-tight line-clamp-2">{video.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 capitalize">{video.type}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

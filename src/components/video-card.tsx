"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, ListVideo, MonitorPlay, Film } from 'lucide-react';
import type { Video } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface VideoCardProps {
  video: Video;
}

const getYoutubeThumbnail = (url: string): string | null => {
  const videoIdMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/);
  const videoId = (videoIdMatch && videoIdMatch[2].length === 11) ? videoIdMatch[2] : null;
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
};

const getTypeIcon = (t: string) => {
    switch (t) {
        case "short": return <Film className="w-5 h-5" />;
        case "playlist": return <ListVideo className="w-5 h-5" />;
        default: return <MonitorPlay className="w-5 h-5" />;
    }
};

export function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = video.thumbnailUrl || getYoutubeThumbnail(video.youtubeUrl);
  const isPlaylist = video.type === 'playlist';

  return (
    <motion.div whileHover={{ y: -5 }}>
      <Link href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card h-full flex flex-col">
          <CardHeader className="p-0 relative aspect-video flex-shrink-0 bg-muted flex items-center justify-center overflow-hidden">
             {thumbnailUrl ? (
                <>
                  <Image
                    src={thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform" />
                  </div>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    {getTypeIcon(video.type)}
                    <span className="text-xs uppercase font-medium">{video.type}</span>
                </div>
             )}
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-2 flex-grow">
            <h3 className="font-semibold leading-tight line-clamp-2 text-lg group-hover:text-primary transition-colors">{video.title}</h3>
            
            <div className="flex flex-wrap items-center gap-2 mb-2">
                 <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium uppercase tracking-wider">
                    {getTypeIcon(video.type)} {video.type === 'short' ? 'Shorts' : video.type}
                 </span>
                 {video.tags && video.tags.map(tag => (
                   <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                     {tag}
                   </span>
                 ))}
            </div>

            {video.description && (
                <div 
                    className="text-sm text-muted-foreground line-clamp-3 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: video.description }}
                />
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

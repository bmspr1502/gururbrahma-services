"use client";

import { useState } from "react";
import { Video } from "@/lib/types";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";
import { getVideos } from "@/app/actions/content";
import { Loader2, Filter, X, MonitorPlay, Film, ListVideo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideosFeedProps {
  initialVideos: Video[];
  initialCursor: string | null;
  allTags?: string[]; 
}

type VideoType = "short" | "video" | "playlist" | "all";

export function VideosFeed({ initialVideos, initialCursor, allTags = [] }: VideosFeedProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialVideos.length === 10);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<VideoType>("all");

  // Derived tags
  const availableTags = Array.from(new Set([
      ...allTags,
      ...videos.flatMap(v => v.tags || [])
  ])).sort();

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    const typeFilter = activeType === "all" ? undefined : activeType;
    const res = await getVideos({ 
        cursor: cursor ?? undefined, 
        tag: activeTag ?? undefined,
        type: typeFilter
    });

    if (res.success && res.data) {
      setVideos(prev => [...prev, ...res.data]);
      setCursor(res.nextCursor || null);
      setHasMore(res.hasMore || false);
    }
    setLoading(false);
  };

  const resetAndFetch = async (newTag: string | null, newType: VideoType) => {
      setLoading(true);
      setVideos([]);
      setCursor(null);
      
      const typeFilter = newType === "all" ? undefined : newType;

      const res = await getVideos({ 
          cursor: undefined, 
          tag: newTag ?? undefined,
          type: typeFilter
      });
      
      if (res.success && res.data) {
          setVideos(res.data);
          setCursor(res.nextCursor || null);
          setHasMore(res.hasMore || false);
      }
      setLoading(false);
  };

  const handleTagClick = (tag: string) => {
      const newTag = activeTag === tag ? null : tag;
      setActiveTag(newTag);
      resetAndFetch(newTag, activeType);
  };

  const handleTypeChange = (val: string) => {
      const newType = val as VideoType;
      setActiveType(newType);
      resetAndFetch(activeTag, newType);
  }

  return (
    <div className="space-y-8">
        
        {/* Type Filter Tabs */}
        <div className="flex justify-center">
            <Tabs defaultValue="all" value={activeType} onValueChange={handleTypeChange} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-4 sm:w-[480px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="video">Videos</TabsTrigger>
                    <TabsTrigger value="short">Shorts</TabsTrigger>
                    <TabsTrigger value="playlist">Playlists</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter by Tag
            </h3>
            <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                    <Badge 
                        key={tag}
                        variant={activeTag === tag ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/20 transition-colors capitalize px-3 py-1"
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                        {activeTag === tag && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                ))}
                 {availableTags.length === 0 && <span className="text-sm text-muted-foreground">No tags found.</span>}
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>

         {/* Loading / Empty States */}
         {videos.length === 0 && !loading && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">
                    No videos found 
                    {activeType !== "all" ? ` of type "${activeType}"` : ""}
                    {activeTag ? ` with tag "${activeTag}"` : ""}.
                </p>
                {(activeTag || activeType !== "all") && (
                    <Button variant="link" onClick={() => {
                        setActiveTag(null);
                        setActiveType("all");
                        resetAndFetch(null, "all");
                    }}>
                        Clear Filters
                    </Button>
                )}
            </div>
        )}

        {/* Load More Trigger */}
        <div className="flex justify-center mt-8">
            {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
                hasMore && (
                    <Button onClick={loadMore} variant="outline" size="lg">
                        Load More
                    </Button>
                )
            )}
        </div>
    </div>
  );
}

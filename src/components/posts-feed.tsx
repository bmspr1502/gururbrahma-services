"use client";

import { useState } from "react";
import { Post } from "@/lib/types";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/app/actions/content";
import { Loader2, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PostsFeedProps {
  initialPosts: Post[];
  initialCursor: string | null;
  allTags?: string[]; // Optional list of known tags to suggest
}

export function PostsFeed({ initialPosts, initialCursor, allTags = [] }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialConversationHasMore(initialPosts));
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // Helper to determine initial hasMore based on pageSize (if we assume 10)
  // But strictly, we should rely on server. For now, if we got 10, likely more.
  function initialConversationHasMore(list: any[]) {
      return list.length === 10;
  }

  // Derived unique tags from loaded posts + initial set
  const availableTags = Array.from(new Set([
      ...allTags,
      ...posts.flatMap(p => p.tags || [])
  ])).sort();

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    
    // Pass the activeTag if filtering
    // If we just changed filter, we should have reset cursor.
    // logic needs to differentiate "Load Next Page" vs "Change Filter"
    
    const res = await getPosts({ 
        cursor: cursor ?? undefined, 
        tag: activeTag ?? undefined 
    });

    if (res.success && res.data) {
      setPosts(prev => [...prev, ...res.data]);
      setCursor(res.nextCursor || null);
      setHasMore(res.hasMore || false);
    }
    setLoading(false);
  };

  const handleTagClick = async (tag: string) => {
      // Toggle
      const newTag = activeTag === tag ? null : tag;
      setActiveTag(newTag);
      setLoading(true);
      
      // Reset list
      setPosts([]);
      setCursor(null);
      
      // Fetch fresh with new filter
      const res = await getPosts({ 
          cursor: undefined, 
          tag: newTag ?? undefined 
      });
      
      if (res.success && res.data) {
          setPosts(res.data);
          setCursor(res.nextCursor || null);
          setHasMore(res.hasMore || false);
      }
      setLoading(false);
  };

  return (
    <div className="space-y-8">
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
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>

        {/* Loading / Empty States */}
        {posts.length === 0 && !loading && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No posts found {activeTag ? `with tag "${activeTag}"` : ""}.</p>
                {activeTag && <Button variant="link" onClick={() => handleTagClick(activeTag)}>Clear Filter</Button>}
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

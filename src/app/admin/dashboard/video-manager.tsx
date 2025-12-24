"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addVideo, deleteVideo } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Trash2, ExternalLink, Play } from "lucide-react";
import Image from "next/image";

export function VideoManager() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"video" | "short">("video");
  const [loading, setLoading] = useState(false);

  const firestore = useFirestore();
  const videosQuery = useMemoFirebase(() => query(collection(firestore, "videos"), orderBy("createdAt", "desc")), [firestore]);
  const { data: videos, isLoading: fetching } = useCollection(videosQuery);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAdd = async () => {
    if (!url || !title) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please provide both a title and a YouTube URL." });
      return;
    }

    const videoId = getYoutubeId(url);
    if (!videoId) {
      toast({ variant: "destructive", title: "Invalid URL", description: "Please provide a valid YouTube URL." });
      return;
    }

    setLoading(true);
    const result = await addVideo(url, title, type);
    setLoading(false);

    if (result.success) {
      toast({ title: "Success", description: "Video added successfully." });
      setUrl("");
      setTitle("");
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    const result = await deleteVideo(id);
    if (result.success) {
      toast({ title: "Success", description: "Video deleted." });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Video Form */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Add New Video</CardTitle>
          <CardDescription>Enter a YouTube link and title to display it on the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-title" className="flex items-center gap-1">
                Video Title <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="video-title" 
                placeholder="e.g., Daily Morning Puja" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-type">Format</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger id="video-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Standard Video</SelectItem>
                  <SelectItem value="short">YouTube Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-url" className="flex items-center gap-1">
              YouTube URL <span className="text-destructive">*</span>
            </Label>
            <Input 
              id="video-url" 
              placeholder="https://www.youtube.com/watch?v=..." 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
            />
          </div>
          <Button onClick={handleAdd} className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Video"}
          </Button>
        </CardContent>
      </Card>

      {/* Video List */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Existing Videos</CardTitle>
          <CardDescription>Manage your current video collection.</CardDescription>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="text-center py-4">Loading videos...</div>
          ) : videos?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No videos found.</div>
          ) : (
            <div className="divide-y divide-border">
              {videos?.map((video: any) => {
                const videoId = getYoutubeId(video.youtubeUrl);
                return (
                  <div key={video.id} className="py-4 flex items-center gap-4">
                    <div className="relative w-24 aspect-video rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {videoId && (
                        <Image 
                          src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium truncate">{video.title}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{video.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

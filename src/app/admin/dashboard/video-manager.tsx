"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addVideo, updateVideo, deleteVideo, getVideos } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ExternalLink, Play, Edit, Plus, MonitorPlay, Film, ListVideo, ImageIcon, X, RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUploader } from "@/components/image-uploader";
import { useEffect } from "react";

export function VideoManager() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"video" | "short" | "playlist">("video");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [tags, setTags] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const result = await getVideos();
      if (result.success) {
        setVideos(result.data || []);
      } else {
        setFetchError(result.error || "Failed to load videos.");
      }
    } catch (e: any) {
      setFetchError(e.message || "An unexpected error occurred.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const getYoutubeId = (url: string) => {
    // Handle playlist URLs too if possible, but basic ID extraction for video/shorts
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setType("video");
    setDescription("");
    setThumbnailUrl("");
    setTags("");
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (video: any) => {
    setEditingId(video.id);
    setUrl(video.youtubeUrl);
    setTitle(video.title);
    setType(video.type || "video");
    setDescription(video.description || "");
    setThumbnailUrl(video.thumbnailUrl || "");
    setTags(Array.isArray(video.tags) ? video.tags.join(", ") : "");
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!url || !title) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please provide both a title and a YouTube URL." });
      return;
    }

    // Basic validation
    if (type !== "playlist") {
        const videoId = getYoutubeId(url);
        if (!videoId) {
            toast({ variant: "destructive", title: "Invalid URL", description: "Please provide a valid YouTube video URL." });
            return;
        }
    }

    setLoading(true);
    const tagArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");

    let result;
    if (editingId) {
        result = await updateVideo(editingId, url, title, type, description, thumbnailUrl, tagArray);
    } else {
        result = await addVideo(url, title, type, description, thumbnailUrl, tagArray);
    }
    setLoading(false);

    if (result.success) {
      toast({ title: "Success", description: editingId ? "Video updated." : "Video added." });
      resetForm();
      fetchVideos();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    const result = await deleteVideo(id);
    if (result.success) {
      toast({ title: "Success", description: "Video deleted." });
      fetchVideos();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const handleThumbnailUpload = (urls: string[]) => {
      if (urls.length > 0) {
          setThumbnailUrl(urls[0]);
      }
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
        case "short": return <Film className="w-4 h-4" />;
        case "playlist": return <ListVideo className="w-4 h-4" />;
        default: return <MonitorPlay className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Videos & Playlists</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Video
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-accent/5">
            <CardHeader>
            <CardTitle>{editingId ? "Edit Video" : "Add New Video"}</CardTitle>
            <CardDescription>Enter a YouTube link and title to display it on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="video-title" className="flex items-center gap-1">
                    Title <span className="text-destructive">*</span>
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
                    <SelectItem value="playlist">Playlist</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="video-tags">Tags (comma separated)</Label>
                <Input 
                    id="video-tags" 
                    placeholder="puja, morning, ritual" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="video-url" className="flex items-center gap-1">
                YouTube URL <span className="text-destructive">*</span>
                </Label>
                <Input 
                id="video-url" 
                placeholder="https://www.youtube.com/watch?v=... or Playlist URL" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <RichTextEditor content={description} onChange={setDescription} />
            </div>

            <div className="space-y-4 rounded-lg border p-4 bg-background/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Custom Thumbnail (Optional)
                </h3>
                <p className="text-xs text-muted-foreground">Recommended for Playlists or if you want to override the default YouTube thumbnail.</p>

                {thumbnailUrl && (
                    <div className="relative aspect-video w-48 rounded-md overflow-hidden border">
                         <Image src={thumbnailUrl} alt="Thumbnail preview" fill className="object-cover" />
                         <button 
                            onClick={() => setThumbnailUrl("")}
                            type="button"
                            className="absolute right-1 top-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}
                
                <ImageUploader 
                    path={`videos/${editingId || 'new'}/thumbnails`} 
                    onUpload={handleThumbnailUpload} 
                />
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1" disabled={loading}>
                    {loading ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Update Video" : "Add Video")}
                </Button>
            </div>
            </CardContent>
        </Card>
      )}

      {/* Video List */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Library</CardTitle>
          <CardDescription>Manage your current video collection.</CardDescription>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="text-center py-8 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <div className="text-muted-foreground">Loading videos...</div>
            </div>
          ) : fetchError ? (
            <div className="text-center py-8 border-2 border-destructive/20 rounded-lg bg-destructive/5">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="font-semibold text-destructive">Error Loading Videos</p>
                <p className="text-sm text-destructive-foreground/70 mb-4">{fetchError}</p>
                <Button variant="outline" size="sm" onClick={fetchVideos} className="gap-2">
                    <RefreshCw className="w-4 h-4" /> Try Again
                </Button>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No videos found.</div>
          ) : (
            <div className="divide-y divide-border">
              {videos?.map((video: any) => {
                const videoId = getYoutubeId(video.youtubeUrl);
                const displayThumbnail = video.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/default.jpg` : null);
                
                return (
                  <div key={video.id} className="py-4 flex items-center gap-4">
                    <div className="relative w-24 aspect-video rounded-md overflow-hidden bg-muted flex-shrink-0 border flex items-center justify-center">
                      {displayThumbnail ? (
                        <>
                            <Image 
                            src={displayThumbnail}
                            alt=""
                            fill
                            className="object-cover"
                            />
                            {!video.thumbnailUrl && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Play className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </>
                      ) : (
                        <div className="bg-primary/10 w-full h-full flex items-center justify-center">
                           {getTypeIcon(video.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium truncate flex items-center gap-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium uppercase tracking-wider">
                            {getTypeIcon(video.type)}
                            {video.type}
                        </span>
                        {video.tags && video.tags.length > 0 && (
                            <div className="flex gap-1 overflow-hidden">
                                {video.tags.slice(0, 2).map((tag: string) => (
                                    <span key={tag} className="text-[10px] bg-muted px-1 rounded truncate max-w-[60px]">{tag}</span>
                                ))}
                                {video.tags.length > 2 && <span className="text-[10px] text-muted-foreground">+{video.tags.length - 2}</span>}
                            </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(video)} className="text-primary hover:text-primary hover:bg-primary/10">
                        <Edit className="w-4 h-4" />
                      </Button>
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

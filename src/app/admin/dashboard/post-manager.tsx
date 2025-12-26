"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addPost, updatePost, deletePost, getPosts } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, FileText, X, ImageIcon, File as FileIcon, RefreshCw, AlertCircle } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useEffect } from "react";
import { ImageUploader } from "@/components/image-uploader";
import { DocumentUploader } from "@/components/document-uploader";
import { Carousel } from "@/components/carousel";

interface PostDocument {
  name: string;
  url: string;
}

export function PostManager() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<PostDocument[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const result = await getPosts();
      if (result.success) {
        setPosts(result.data || []);
      } else {
        setFetchError(result.error || "Failed to load posts.");
      }
    } catch (e: any) {
      setFetchError(e.message || "An unexpected error occurred.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setImages([]);
    setDocuments([]);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "");
    setImages(post.images || (post.imageUrl ? [post.imageUrl] : []));
    setDocuments(post.documents || []);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please provide both a title and content." });
      return;
    }

    setLoading(true);
    const tagArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");
    // Use the first image as the 'main' image for backward compatibility
    const mainImageUrl = images.length > 0 ? images[0] : "";
    
    let result;
    if (editingId) {
        result = await updatePost(editingId, title, content, tagArray, mainImageUrl, images, documents);
    } else {
        result = await addPost(title, content, tagArray, mainImageUrl, images, documents);
    }
    
    setLoading(false);

    if (result.success) {
      toast({ title: "Success", description: editingId ? "Post updated." : "Post published." });
      resetForm();
      fetchPosts();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const result = await deletePost(id);
    if (result.success) {
      toast({ title: "Success", description: "Post removed." });
      fetchPosts();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  // Image management
  const handleImagesUploaded = (urls: string[]) => {
    setImages(prev => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Document management
  const handleDocumentsUploaded = (docs: PostDocument[]) => {
    setDocuments(prev => [...prev, ...docs]);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-accent/5">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Post" : "Create New Post"}</CardTitle>
            <CardDescription>Share your wisdom and updates with the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="post-title" className="flex items-center gap-1">
                    Post Title <span className="text-destructive">*</span>
                </Label>
                <Input 
                    id="post-title" 
                    placeholder="The Significance of..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="post-tags">Tags (comma separated)</Label>
                <Input 
                    id="post-tags" 
                    placeholder="astrology, ritual, peace" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                />
                </div>
            </div>

            <div className="space-y-2">
              <Label>Content <span className="text-destructive">*</span></Label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            <div className="space-y-4 rounded-lg border p-4 bg-background/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Post Images
                </h3>
                <p className="text-sm text-muted-foreground mb-2">Upload images for this post. The first image will be used as the preview.</p>
                
                {/* Image List / Carousel Preview */}
                {images.length > 0 && (
                    <div className="mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-video rounded-md overflow-hidden border bg-muted">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => removeImage(idx)}
                                        type="button"
                                        className="absolute right-1 top-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    {idx === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center">
                                            Main Image
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <ImageUploader 
                    path={`posts/${editingId || 'new'}/images`} 
                    onUpload={handleImagesUploaded} 
                />
            </div>

            <div className="space-y-4 rounded-lg border p-4 bg-background/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <FileIcon className="w-4 h-4" /> Documents (PDFs)
                </h3>
                
                 {documents.length > 0 && (
                    <div className="mb-4 space-y-2">
                        {documents.map((doc, idx) => (
                             <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-md border">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className="w-4 h-4 shrink-0 text-primary" />
                                    <span className="text-sm truncate">{doc.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive"
                                    onClick={() => removeDocument(idx)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                             </div>
                        ))}
                    </div>
                 )}

                <DocumentUploader 
                    path={`posts/${editingId || 'new'}/documents`} 
                    onUpload={handleDocumentsUploaded} 
                />
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1" disabled={loading}>
                    {loading ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Post" : "Publish Post")}
                </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post List */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>View and manage published articles.</CardDescription>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="text-center py-8 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <div className="text-muted-foreground">Loading posts...</div>
            </div>
          ) : fetchError ? (
            <div className="text-center py-8 border-2 border-destructive/20 rounded-lg bg-destructive/5">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="font-semibold text-destructive">Error Loading Posts</p>
                <p className="text-sm text-destructive-foreground/70 mb-4">{fetchError}</p>
                <Button variant="outline" size="sm" onClick={fetchPosts} className="gap-2">
                    <RefreshCw className="w-4 h-4" /> Try Again
                </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No posts found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts?.map((post: any) => (
                <Card key={post.id} className="overflow-hidden bg-muted/30">
                  <div className="flex gap-4 p-4">
                    <div className="p-2 rounded-md bg-white border shrink-0 h-fit">
                      {post.imageUrl ? (
                           <img src={post.imageUrl} alt="" className="w-8 h-8 object-cover rounded" /> 
                      ) : (
                           <FileText className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h4 className="font-semibold truncate">{post.title}</h4>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {post.tags?.map((tag: string) => (
                          <span key={tag} className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full capitalize">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} className="text-primary hover:text-primary hover:bg-primary/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

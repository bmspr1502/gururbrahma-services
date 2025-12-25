"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addPost, updatePost, deletePost } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Trash2, Edit, Plus, FileText, X, ImageIcon, File as FileIcon } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
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
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<PostDocument[]>([]);
  
  const [loading, setLoading] = useState(false);

  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => query(collection(firestore, "posts"), orderBy("timestamp", "desc")), [firestore]);
  const { data: posts, isLoading: fetching } = useCollection(postsQuery);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setImageUrl("");
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
    setImageUrl(post.imageUrl || "");
    setImages(post.images || []);
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
    
    let result;
    if (editingId) {
        result = await updatePost(editingId, title, content, tagArray, imageUrl, images, documents);
    } else {
        result = await addPost(title, content, tagArray, imageUrl || "https://picsum.photos/seed/spiritual/800/400", images, documents);
    }
    
    setLoading(false);

    if (result.success) {
      toast({ title: "Success", description: editingId ? "Post updated." : "Post published." });
      resetForm();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const result = await deletePost(id);
    if (result.success) {
      toast({ title: "Success", description: "Post removed." });
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

            {/* Featured Image - Keeping plain URL for backward compatibility/simplicity if wanted, 
                but usually user wants to upload this too. For now keeping as URL input per previous design,
                but user can use Image Uploader below for gallery. */}
            <div className="space-y-2">
                <Label htmlFor="post-image">Featured Image URL (Main list image)</Label>
                 <Input 
                    id="post-image" 
                    placeholder="https://..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                />
            </div>

            <div className="space-y-4 rounded-lg border p-4 bg-background/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Gallery Images
                </h3>
                
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
            <div className="text-center py-4">Loading posts...</div>
          ) : posts?.length === 0 ? (
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

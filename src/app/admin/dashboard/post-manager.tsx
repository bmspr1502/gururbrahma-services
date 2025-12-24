"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addPost, deletePost } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Trash2, Edit, Plus, FileText } from "lucide-react";

export function PostManager() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => query(collection(firestore, "posts"), orderBy("createdAt", "desc")), [firestore]);
  const { data: posts, isLoading: fetching } = useCollection(postsQuery);

  const handleAdd = async () => {
    if (!title || !content) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please provide both a title and content." });
      return;
    }

    setLoading(true);
    const tagArray = tags.split(",").map(t => t.trim()).filter(t => t !== "");
    const result = await addPost(title, content, tagArray, imageUrl || "https://picsum.photos/seed/spiritual/800/400");
    setLoading(false);

    if (result.success) {
      toast({ title: "Success", description: "Post published." });
      setTitle("");
      setContent("");
      setTags("");
      setImageUrl("");
      setIsAdding(false);
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> New Post</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-accent/5">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Share your wisdom and updates with the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="post-image">Featured Image URL (Optional)</Label>
              <Input 
                id="post-image" 
                placeholder="https://..." 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-content" className="flex items-center gap-1">
                Content (HTML supported) <span className="text-destructive">*</span>
              </Label>
              <Textarea 
                id="post-content" 
                placeholder="Write your article here..." 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                rows={10}
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
            <Button onClick={handleAdd} className="w-full" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
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
                    <div className="p-2 rounded-md bg-white border shrink-0">
                      <FileText className="w-8 h-8 text-primary" />
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

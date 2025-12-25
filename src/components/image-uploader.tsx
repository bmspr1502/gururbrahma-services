"use client";

import { useState, useCallback } from "react";
import { useFirebase } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  path: string; // e.g. "posts/123/images"
  onUpload: (urls: string[]) => void;
  className?: string;
}

export function ImageUploader({ path, onUpload, className }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { storage } = useFirebase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const uploadedUrls: string[] = [];
    let completedCount = 0;

    try {
      await Promise.all(
        files.map(async (file) => {
          const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          return new Promise<void>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
               // Individial progress tracking could happen here but simplistic total progress is easier
              },
              (error) => {
                console.error("Upload error:", error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedUrls.push(downloadURL);
                completedCount++;
                setProgress((completedCount / files.length) * 100);
                resolve();
              }
            );
          });
        })
      );

      onUpload(uploadedUrls);
      setFiles([]); // Clear queue on success
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload some images. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload images</span> or drag and drop
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
           <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
                <div key={index} className="relative group bg-muted rounded-md p-2 flex items-center gap-2 pr-8 border">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                    <button
                        onClick={() => removeFile(index)}
                        className="absolute right-1 top-1.5 p-0.5 rounded-full hover:bg-background/80 opacity-60 hover:opacity-100 transition-all"
                        disabled={uploading}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
           </div>
           
           <div className="flex items-center gap-4">
               <Button onClick={handleUpload} disabled={uploading} size="sm">
                {uploading ? "Uploading..." : `Upload ${files.length} Image${files.length > 1 ? 's' : ''}`}
               </Button>
               {uploading && <Progress value={progress} className="w-[60%]" />}
           </div>
        </div>
      )}
    </div>
  );
}

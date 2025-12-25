"use client";

import { useState } from "react";
import { useFirebase } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  path: string; // e.g. "posts/123/documents"
  onUpload: (documents: { name: string; url: string }[]) => void;
  className?: string;
}

export function DocumentUploader({ path, onUpload, className }: DocumentUploaderProps) {
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

    const uploadedDocs: { name: string; url: string }[] = [];
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
                // simple progress
              },
              (error) => {
                console.error("Upload error:", error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedDocs.push({
                    name: file.name,
                    url: downloadURL
                });
                completedCount++;
                setProgress((completedCount / files.length) * 100);
                resolve();
              }
            );
          });
        })
      );

      onUpload(uploadedDocs);
      setFiles([]); // Clear queue on success
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert("Failed to upload some documents. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="doc-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload PDFs</span> or drag and drop
            </p>
          </div>
          <input
            id="doc-upload"
            type="file"
            className="hidden"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
           <div className="flex flex-col gap-2">
            {files.map((file, index) => (
                <div key={index} className="relative group bg-muted rounded-md p-2 flex items-center gap-2 pr-8 border">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                        onClick={() => removeFile(index)}
                        className="absolute right-2 top-2 p-1 rounded-full hover:bg-background/80 opacity-60 hover:opacity-100 transition-all"
                        disabled={uploading}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
           </div>
           
           <div className="flex items-center gap-4">
               <Button onClick={handleUpload} disabled={uploading} size="sm">
                {uploading ? "Uploading..." : `Upload ${files.length} Document${files.length > 1 ? 's' : ''}`}
               </Button>
               {uploading && <Progress value={progress} className="w-[60%]" />}
           </div>
        </div>
      )}
    </div>
  );
}

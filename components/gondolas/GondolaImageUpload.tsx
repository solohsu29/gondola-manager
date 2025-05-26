"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"

export interface GondolaPhoto {
  id: string;
  url: string;
  uploadedAt: Date;
  description: string;
}

interface GondolaImageUploadProps {
  gondolaId: string;
  currentImages?: GondolaPhoto[];
  onImagesChange?: (images: GondolaPhoto[]) => void;
  onStagedImagesRef?: (ref: { uploadAllStagedImages: () => Promise<void> }) => void;
}

export function GondolaImageUpload({ gondolaId, currentImages, onImagesChange, onStagedImagesRef }: GondolaImageUploadProps) {
  // ...existing state
  const [imageLoadErrors, setImageLoadErrors] = useState<number[]>([]);
  const [images, setImages] = useState<GondolaPhoto[]>(
    currentImages?.map((img) => ({ ...img })) || [],
  )
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Expose uploadAllStagedImages to parent
  React.useEffect(() => {
    if (onStagedImagesRef) {
      onStagedImagesRef({ uploadAllStagedImages });
    }
    // eslint-disable-next-line
  }, [stagedFiles, images]);

  // Upload a file to /api/photos/upload and return the photo info
  const uploadFile = async (file: File): Promise<GondolaPhoto | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gondolaId', gondolaId);
    if (description) formData.append('description', description);
    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return {
          id: data.id,
          url: data.url,
          uploadedAt: new Date(data.uploadedAt),
          description: data.description || '',
        };
      } else if (res.status === 400 && data?.error?.includes("isn't a valid image")) {
        setUploadError("The selected file is not a valid image.");
      } else if (data?.error) {
        setUploadError(data.error);
      }
      return null;
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (gondolaId) {
      // Edit mode: upload immediately
      setIsUploading(true);
      setUploadError("");
      let newImages = [...images];
      for (const file of Array.from(files)) {
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        const tempId = `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const previewPhoto: GondolaPhoto = {
          id: tempId,
          url: previewUrl,
          uploadedAt: new Date(),
          description: description || `Photo of gondola ${gondolaId}`,
        };
        newImages = [...newImages, previewPhoto];
        setImages([...newImages]);
        if (onImagesChange) onImagesChange([...newImages]);
        try {
          const uploaded = await uploadFile(file);
          if (uploaded) {
            newImages = newImages.map((img) =>
              img.id === tempId ? uploaded : img
            );
            URL.revokeObjectURL(previewUrl);
            setImages([...newImages]);
            if (onImagesChange) onImagesChange([...newImages]);
          } else {
            newImages = newImages.filter((img) => img.id !== tempId);
            URL.revokeObjectURL(previewUrl);
            setImages([...newImages]);
            setUploadError("Upload failed: Invalid gondola or server error.");
            if (onImagesChange) onImagesChange([...newImages]);
          }
        } catch (err) {
          newImages = newImages.filter((img) => img.id !== tempId);
          URL.revokeObjectURL(previewUrl);
          setImages([...newImages]);
          setUploadError("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
          if (onImagesChange) onImagesChange([...newImages]);
        }
      }
      setIsUploading(false);
      setDescription("");
      e.target.value = '';
    } else {
      // New gondola: stage files for batch upload after gondola creation
      setStagedFiles((prev) => [...prev, ...Array.from(files)]);
      e.target.value = '';
    }
  }

  // Batch upload all staged images
  async function uploadAllStagedImages() {
    if (!gondolaId || stagedFiles.length === 0) return;
    setIsUploading(true);
    setUploadError("");
    let newImages: GondolaPhoto[] = [...images];
    for (const file of stagedFiles) {
      const previewUrl = URL.createObjectURL(file);
      const tempId = `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewPhoto: GondolaPhoto = {
        id: tempId,
        url: previewUrl,
        uploadedAt: new Date(),
        description: description || `Photo of gondola ${gondolaId}`,
      };
      newImages = [...newImages, previewPhoto];
      setImages([...newImages]);
      if (onImagesChange) onImagesChange([...newImages]);
      try {
        const uploaded = await uploadFile(file);
        if (uploaded) {
          newImages = newImages.map((img) =>
            img.id === tempId ? uploaded : img
          );
          URL.revokeObjectURL(previewUrl);
          setImages([...newImages]);
          if (onImagesChange) onImagesChange([...newImages]);
        } else {
          newImages = newImages.filter((img) => img.id !== tempId);
          URL.revokeObjectURL(previewUrl);
          setImages([...newImages]);
          setUploadError("Upload failed: Invalid gondola or server error.");
          if (onImagesChange) onImagesChange([...newImages]);
        }
      } catch (err) {
        newImages = newImages.filter((img) => img.id !== tempId);
        URL.revokeObjectURL(previewUrl);
        setImages([...newImages]);
        setUploadError("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
        if (onImagesChange) onImagesChange([...newImages]);
      }
    }
    setStagedFiles([]);
    setIsUploading(false);
    setDescription("");
  }

  const handleRemoveImage = async (index: number) => {
    // Remove from staged files if not uploaded yet (for new gondola)
    if (!gondolaId && stagedFiles.length > 0 && index >= images.length) {
      setStagedFiles(stagedFiles.filter((_, i) => i !== (index - images.length)));
      return;
    }
    // Remove from backend if uploaded
    const img = images[index];
    if (img && img.id && !img.id.startsWith('preview-')) {
      try {
        await fetch(`/api/photos/${img.id}/delete`, { method: 'DELETE' });
      } catch (err) {
        setUploadError('Failed to delete image from server.');
      }
    }
    // Revoke the object URL to prevent memory leaks if preview
    if (img && img.url && img.id.startsWith('preview-')) {
      URL.revokeObjectURL(img.url);
    }
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
  }
    
  

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (gondolaId) fileInputRef.current?.click();
          }}
          disabled={isUploading || !gondolaId}
          title={!gondolaId ? "Save gondola first" : undefined}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>
      {uploadError && (
        <div className="text-red-600 text-sm mt-2">{uploadError}</div>
      )}
      {!gondolaId && (
        <div className="text-yellow-600 text-sm mt-2">
          Save the gondola before uploading images.
        </div>
      )}

      <input
        type="text"
        placeholder="Image description (optional)"
        className="w-full p-2 border rounded-md"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" disabled={!gondolaId} />

      {(images.length > 0 || stagedFiles.length > 0) ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {/* Uploaded images */}
            {images.map((image, index) => {
              const hasError = imageLoadErrors.includes(index);
              return (
                <div
                  key={image.id}
                  className={`relative border rounded-md overflow-hidden w-full h-32 ${hasError ? 'border-red-500' : ''}`}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Gondola preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImageLoadErrors((prev) => prev.includes(index) ? prev : [...prev, index]);
                    }}
                  />
                  {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                      <span className="text-red-600 text-xs font-semibold">Image not found (404)</span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                    {image.description || `Image ${index + 1}`}
                  </div>
                </div>
              );
            })}
            {/* Previews for staged (not-yet-uploaded) images */}
            {stagedFiles.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div
                  key={"staged-" + idx}
                  className="relative border-2 border-dashed border-blue-400 rounded-md overflow-hidden w-full h-32"
                >
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                    onClick={() => setStagedFiles(stagedFiles.filter((_, i) => i !== idx))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600 bg-opacity-60 text-white text-xs p-1 truncate">
                    {file.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border rounded-md flex items-center justify-center w-full h-48 bg-gray-50">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-10 w-10 mx-auto mb-2" />
            <p>No images uploaded</p>
          </div>
        </div>
      )}
    </div>
  )
}
